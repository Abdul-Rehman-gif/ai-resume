import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Persistent User Storage File Path
const USERS_FILE_PATH = path.join(process.cwd(), "data", "users.json");

function getUsersFromFile(): any[] {
  try {
    const dir = path.dirname(USERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE_PATH)) {
      const initialUsers = [
        {
          id: "client-demo-1",
          name: "Sarah Jenkins",
          username: "@sarah_jenkins",
          email: "client@example.com",
          password: "password123",
          roleTitle: "Senior Product Manager",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
          loginMethod: "password",
          isPro: true,
          credits: 100,
          joinedDate: "Aug 2026",
        },
      ];
      fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(initialUsers, null, 2), "utf-8");
      return initialUsers;
    }
    const raw = fs.readFileSync(USERS_FILE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading users file:", err);
    return [];
  }
}

function saveUsersToFile(users: any[]) {
  try {
    const dir = path.dirname(USERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving users file:", err);
  }
}

interface PendingRegistration {
  fullName: string;
  email: string;
  password: string;
  jobTitle: string;
  otp: string;
  expiresAt: number;
}

const pendingRegistrations = new Map<string, PendingRegistration>();

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// User Registration with OTP Generation
app.post("/api/auth/signup-request", (req, res) => {
  try {
    const { fullName, email, password, jobTitle } = req.body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUsers = getUsersFromFile();

    const userExists = existingUsers.some((u) => u.email.toLowerCase() === cleanEmail);
    if (userExists) {
      return res.status(400).json({ error: "An account with this email already exists. Please sign in instead." });
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    pendingRegistrations.set(cleanEmail, {
      fullName: fullName ? fullName.trim() : cleanEmail.split("@")[0],
      email: cleanEmail,
      password: password.trim(),
      jobTitle: jobTitle ? jobTitle.trim() : "Candidate / Professional",
      otp,
      expiresAt,
    });

    console.log(`\n==================================================`);
    console.log(`[AUTH OTP SENT] Email: ${cleanEmail} | OTP Code: ${otp}`);
    console.log(`==================================================\n`);

    return res.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}.`,
      email: cleanEmail,
      devOtp: otp,
    });
  } catch (err: any) {
    console.error("Signup request error:", err);
    return res.status(500).json({ error: "Failed to process sign up request." });
  }
});

// Verify OTP & Save Account
app.post("/api/auth/verify-otp", (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and verification code are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const pending = pendingRegistrations.get(cleanEmail);

    if (!pending) {
      return res.status(400).json({ error: "No pending registration found for this email. Please sign up again." });
    }

    if (Date.now() > pending.expiresAt) {
      pendingRegistrations.delete(cleanEmail);
      return res.status(400).json({ error: "Verification code has expired. Please request a new code." });
    }

    if (pending.otp !== otp.toString().trim()) {
      return res.status(400).json({ error: "Invalid verification code. Please check your email and try again." });
    }

    // OTP Verified! Save user permanently to backend users.json storage
    const users = getUsersFromFile();
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: pending.fullName,
      username: `@${pending.fullName.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
      email: pending.email,
      password: pending.password,
      roleTitle: pending.jobTitle,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      loginMethod: "password",
      isPro: true,
      credits: 100,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };

    users.push(newUser);
    saveUsersToFile(users);

    pendingRegistrations.delete(cleanEmail);

    const { password: _, ...userProfile } = newUser;

    console.log(`[AUTH SUCCESS] User registered & saved: ${cleanEmail}`);

    return res.json({
      success: true,
      message: "Account verified and created successfully!",
      user: userProfile,
    });
  } catch (err: any) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ error: "Failed to verify code." });
  }
});

// Resend Verification OTP
app.post("/api/auth/resend-otp", (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const cleanEmail = email.toLowerCase().trim();
    const pending = pendingRegistrations.get(cleanEmail);

    if (!pending) {
      return res.status(400).json({ error: "No pending sign up found for this email." });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    pending.otp = newOtp;
    pending.expiresAt = Date.now() + 10 * 60 * 1000;
    pendingRegistrations.set(cleanEmail, pending);

    console.log(`[AUTH RESEND OTP] Email: ${cleanEmail} | New OTP Code: ${newOtp}`);

    return res.json({
      success: true,
      message: `A new 6-digit verification code was sent to ${cleanEmail}.`,
      devOtp: newOtp,
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to resend verification code." });
  }
});

// Login Endpoint
app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const users = getUsersFromFile();

    const matchedUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!matchedUser) {
      const pending = pendingRegistrations.get(cleanEmail);
      if (pending) {
        return res.status(400).json({
          error: "Your sign up verification is incomplete. Please enter the verification code sent to your email.",
          isPendingOtp: true,
          email: cleanEmail,
          devOtp: pending.otp,
        });
      }
      return res.status(400).json({ error: "No account found with this email. Please register first." });
    }

    if (matchedUser.password !== password) {
      return res.status(400).json({ error: "Incorrect password. Please try again." });
    }

    const { password: _, ...userProfile } = matchedUser;
    return res.json({
      success: true,
      message: "Logged in successfully!",
      user: userProfile,
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Failed to authenticate user." });
  }
});

// 1. Analyze Resume Endpoint
app.post("/api/analyze-resume", async (req, res) => {
  try {
    const { resumeText, targetJobTitle } = req.body;

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 20) {
      return res.status(400).json({ error: "Please provide a valid resume text (at least 20 characters)." });
    }

    const systemPrompt = `You are a Senior HR Manager, Fortune 500 Lead Recruiter, ATS System Auditor, and Resume Optimization Expert who has reviewed over 20,000 resumes.
Evaluate the provided resume rigorously based on real-world hiring research (Harvard Resume Guide, Google Career Guidelines, Jobscan ATS benchmarks, Indeed & LinkedIn recruiter standards).

Evaluate all of the following aspects:
1. Overall Score (0-100) & Grade (A+, A, B+, B, C, D, F).
2. ATS Compatibility Score (0-100%), parsing risk, formatting issues (tables, columns, graphics, headers/footers).
3. Section-by-section category evaluation:
   - Summary (impact, keywords, recruiter appeal)
   - Contact Info (phone, email, LinkedIn, GitHub, Portfolio, location, professional email check)
   - Skills (hard, soft, technical, missing essential skills, trending industry keywords)
   - Experience (STAR framework compliance 0-100, quantifiable metrics 0-100, action verb strength 0-100, weak bullet points, duplicate wording)
   - Projects (quality, missing live/GitHub links, business impact)
   - Education & Certifications
   - Formatting (whitespace, margin alignment, readability, typography)
   - Grammar & Readability (passive voice instances, Flesch score assessment, spelling notes)
   - Keywords (matched vs missing modern keywords, keyword stuffing check)
   - Recruiter Readability (estimated scan time in seconds e.g. 18, explanation, first impression 0-10 score, professionalism score, resume length assessment)
4. Red flags detection (job hopping, no achievements, missing portfolio, weak action verbs, unprofessional contact, generic SaaS clichés).
5. Career gaps detection with mitigation advice.
6. Weak Action Verbs detector (e.g., 'worked', 'responsible for', 'helped' -> replaced with 'Engineered', 'Optimized', 'Spearheaded', 'Architected').
7. Achievement Detection: find bullets without metrics and suggest quantified STAR versions.
8. Industry-Specific Suggestions tailored to the target role (${targetJobTitle || "detected role"}).
9. Missing essential sections.
10. Top 20 Improvements prioritized by impact.

Return strict, valid JSON strictly adhering to the specified schema.`;

    const userPrompt = `Resume Content to Analyze:
---
${resumeText}
---
Target Job Role (if specified): ${targetJobTitle || "Auto-detect from resume"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        { text: systemPrompt },
        { text: userPrompt },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetRoleDetected: { type: Type.STRING },
            overallScore: { type: Type.NUMBER },
            letterGrade: { type: Type.STRING },
            atsScore: { type: Type.NUMBER },
            atsBreakdown: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                parsingRisk: { type: Type.STRING },
                formattingIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
                tableWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                columnWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                graphicWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                headerFooterWarnings: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["score", "parsingRisk", "formattingIssues", "tableWarnings", "columnWarnings", "graphicWarnings", "headerFooterWarnings"],
            },
            categories: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                    keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    missingElements: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["score", "status", "feedback"],
                },
                contactInfo: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                    checkList: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          label: { type: Type.STRING },
                          present: { type: Type.BOOLEAN },
                          suggestion: { type: Type.STRING },
                        },
                        required: ["label", "present"],
                      },
                    },
                  },
                  required: ["score", "status", "feedback", "checkList"],
                },
                skills: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                    hardSkillsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
                    softSkillsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
                    missingEssentialSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    trendingKeywordsToInclude: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["score", "status", "feedback", "hardSkillsFound", "softSkillsFound", "missingEssentialSkills", "trendingKeywordsToInclude"],
                },
                experience: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                    starComplianceScore: { type: Type.NUMBER },
                    quantifiableMetricsScore: { type: Type.NUMBER },
                    actionVerbStrengthScore: { type: Type.NUMBER },
                    weakBulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    duplicateContent: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["score", "status", "feedback", "starComplianceScore", "quantifiableMetricsScore", "actionVerbStrengthScore", "weakBulletPoints", "duplicateContent"],
                },
                projects: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                    qualityRating: { type: Type.STRING },
                    missingLinks: { type: Type.BOOLEAN },
                    businessImpactScore: { type: Type.NUMBER },
                  },
                  required: ["score", "status", "feedback", "qualityRating", "missingLinks", "businessImpactScore"],
                },
                education: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                  },
                  required: ["score", "status", "feedback"],
                },
                certifications: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                  },
                  required: ["score", "status", "feedback"],
                },
                formatting: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                    whitespaceRating: { type: Type.STRING },
                    readabilityRating: { type: Type.STRING },
                    marginAlignment: { type: Type.STRING },
                    fontReadability: { type: Type.STRING },
                  },
                  required: ["score", "status", "feedback", "whitespaceRating", "readabilityRating", "marginAlignment", "fontReadability"],
                },
                grammar: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                    passiveVoiceInstances: { type: Type.ARRAY, items: { type: Type.STRING } },
                    readabilityFlesch: { type: Type.STRING },
                    spellingGrammarNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["score", "status", "feedback", "passiveVoiceInstances", "readabilityFlesch", "spellingGrammarNotes"],
                },
                keywords: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                    matchedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                    missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                    keywordStuffingDetected: { type: Type.BOOLEAN },
                  },
                  required: ["score", "status", "feedback", "matchedKeywords", "missingKeywords", "keywordStuffingDetected"],
                },
                recruiterReadability: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    status: { type: Type.STRING },
                    feedback: { type: Type.STRING },
                    estimatedReadTimeSeconds: { type: Type.NUMBER },
                    explainWhy: { type: Type.STRING },
                    firstImpressionScore: { type: Type.NUMBER },
                    professionalismScore: { type: Type.NUMBER },
                    resumeLengthAssessment: { type: Type.STRING },
                  },
                  required: ["score", "status", "feedback", "estimatedReadTimeSeconds", "explainWhy", "firstImpressionScore", "professionalismScore", "resumeLengthAssessment"],
                },
              },
              required: ["summary", "contactInfo", "skills", "experience", "projects", "education", "certifications", "formatting", "grammar", "keywords", "recruiterReadability"],
            },
            redFlags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  description: { type: Type.STRING },
                  fixAdvice: { type: Type.STRING },
                },
                required: ["title", "severity", "description", "fixAdvice"],
              },
            },
            careerGaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  period: { type: Type.STRING },
                  concernLevel: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  mitigationStrategy: { type: Type.STRING },
                },
                required: ["period", "concernLevel", "explanation", "mitigationStrategy"],
              },
            },
            weakActionVerbs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  originalWord: { type: Type.STRING },
                  context: { type: Type.STRING },
                  recommendedAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["originalWord", "context", "recommendedAlternatives"],
              },
            },
            achievementImprovements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  originalBullet: { type: Type.STRING },
                  quantifiedSuggestion: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ["originalBullet", "quantifiedSuggestion", "explanation"],
              },
            },
            industrySpecificAdvice: {
              type: Type.OBJECT,
              properties: {
                targetRole: { type: Type.STRING },
                adviceList: { type: Type.ARRAY, items: { type: Type.STRING } },
                specializedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["targetRole", "adviceList", "specializedKeywords"],
            },
            missingSections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sectionName: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  reason: { type: Type.STRING },
                },
                required: ["sectionName", "importance", "reason"],
              },
            },
            top20Improvements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rank: { type: Type.NUMBER },
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  actionItem: { type: Type.STRING },
                  impact: { type: Type.STRING },
                },
                required: ["rank", "category", "title", "actionItem", "impact"],
              },
            },
          },
          required: [
            "targetRoleDetected",
            "overallScore",
            "letterGrade",
            "atsScore",
            "atsBreakdown",
            "categories",
            "redFlags",
            "careerGaps",
            "weakActionVerbs",
            "achievementImprovements",
            "industrySpecificAdvice",
            "missingSections",
            "top20Improvements",
          ],
        },
      },
    });

    const report = JSON.parse(response.text || "{}");
    return res.json(report);
  } catch (error: any) {
    console.error("Resume analysis error:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze resume with Gemini AI." });
  }
});

// 2. AI Resume Rewrite Endpoint
app.post("/api/rewrite-resume", async (req, res) => {
  try {
    const { resumeData, targetJobTitle, focusInstructions } = req.body;

    if (!resumeData) {
      return res.status(400).json({ error: "Missing resumeData payload." });
    }

    const systemPrompt = `You are a Senior Executive Resume Writer and Technical Recruiter.
Your job is to rewrite the candidate's resume content to make it high-impact, ATS-optimized, metric-driven, and active.

RULES:
1. Preserve ALL factual candidate information (company names, dates, degrees, true scope of responsibility). Do NOT fabricate companies, dates, or false metrics.
2. Replace weak action verbs with powerful action verbs (e.g. Engineered, Spearheaded, Optimized, Architected, Accelerated).
3. Transform bullet points using the STAR method (Situation/Task, Action, Result). If original bullet lacks numbers, suggest realistic quantifiable metric placeholders like [X%], $[Y]k, [Z] users while keeping original intent clear.
4. Enhance the Professional Summary to be concise, compelling, and keyword-rich for target role (${targetJobTitle || "detected role"}).
5. Categorize and expand hard, soft, technical, and industry skills appropriately.

Return the updated resume structure in JSON matching the exact ResumeData schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        { text: systemPrompt },
        { text: `Original Resume JSON:\n${JSON.stringify(resumeData, null, 2)}\n\nInstructions: ${focusInstructions || "Optimize for ATS and recruiter readability"}` },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            contact: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                title: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                github: { type: Type.STRING },
                portfolio: { type: Type.STRING },
              },
              required: ["name", "title", "email", "phone", "location", "linkedin", "github", "portfolio"],
            },
            summary: { type: Type.STRING },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  company: { type: Type.STRING },
                  role: { type: Type.STRING },
                  location: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  current: { type: Type.BOOLEAN },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["id", "company", "role", "location", "startDate", "endDate", "current", "bullets"],
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                  description: { type: Type.STRING },
                  link: { type: Type.STRING },
                  bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["id", "title", "techStack", "description", "link", "bullets"],
              },
            },
            skills: {
              type: Type.OBJECT,
              properties: {
                hardSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                softSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                technicalSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                industrySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["hardSkills", "softSkills", "technicalSkills", "industrySkills"],
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  field: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  gpa: { type: Type.STRING },
                  highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["id", "institution", "degree", "field", "startDate", "endDate", "highlights"],
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  date: { type: Type.STRING },
                  url: { type: Type.STRING },
                },
                required: ["id", "name", "issuer", "date"],
              },
            },
          },
          required: ["contact", "summary", "experience", "projects", "skills", "education", "certifications"],
        },
      },
    });

    const rewritten = JSON.parse(response.text || "{}");
    return res.json({ rewrittenData: rewritten });
  } catch (error: any) {
    console.error("Resume rewrite error:", error);
    return res.status(500).json({ error: error.message || "Failed to rewrite resume." });
  }
});

// 3. AI Chat Assistant Endpoint
app.post("/api/resume-chat", async (req, res) => {
  try {
    const { message, resumeText, analysisReport } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message." });
    }

    const systemInstruction = `You are ResumeIQ AI Coach, a friendly, highly skilled Senior Recruiter & Career Advisor.
You help candidates optimize their resume, pass ATS systems, improve bullet points, and prepare for top tier job applications.

CONTEXT:
${resumeText ? `Candidate Resume Text:\n${resumeText.slice(0, 3000)}\n` : ""}
${analysisReport ? `Current Resume Score: ${analysisReport.overallScore}/100, ATS Score: ${analysisReport.atsScore}%.\nTop Issues: ${analysisReport.top20Improvements?.slice(0, 5).map(i => i.title).join("; ")}\n` : ""}

Give direct, structured, actionable advice with concrete bullet rewrites or clear tips whenever requested. Keep tone professional yet supportive.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        { text: systemInstruction },
        { text: message },
      ],
    });

    return res.json({ reply: response.text || "I am here to help you optimize your resume!" });
  } catch (error: any) {
    console.error("Chat error:", error);
    return res.status(500).json({ error: error.message || "Failed to communicate with AI Coach." });
  }
});

// Vite Middleware & Static Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
