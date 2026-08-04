import { ResumeData } from "../types";

/**
 * Basic heuristic text parser to convert raw resume text into a structured ResumeData object.
 * When the user uploads a document or pastes raw text, this extracts contact details and sections.
 */
export function parseRawTextToResume(rawText: string): ResumeData {
  const lines = rawText.split("\n").map(line => line.trim()).filter(Boolean);
  
  // Extract email
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : "";

  // Extract phone number
  const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : "";

  // Extract links
  const linkedinMatch = rawText.match(/(linkedin\.com\/in\/[^\s,]+)/i);
  const githubMatch = rawText.match(/(github\.com\/[^\s,]+)/i);
  const portfolioMatch = rawText.match(/https?:\/\/[^\s,]+/i);

  // Guess name from first line or text before email
  const name = lines.length > 0 ? lines[0].slice(0, 40) : "Candidate Name";
  const title = lines.length > 1 && !lines[1].includes("@") ? lines[1].slice(0, 50) : "Professional";

  // Section splitting
  const sections: Record<string, string[]> = {
    summary: [],
    experience: [],
    projects: [],
    skills: [],
    education: [],
    certifications: [],
  };

  let currentSection = "summary";
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes("experience") || lower.includes("employment") || lower.includes("work history")) {
      currentSection = "experience";
      continue;
    } else if (lower.includes("project")) {
      currentSection = "projects";
      continue;
    } else if (lower.includes("skill") || lower.includes("technologies") || lower.includes("competencies")) {
      currentSection = "skills";
      continue;
    } else if (lower.includes("education") || lower.includes("academic")) {
      currentSection = "education";
      continue;
    } else if (lower.includes("certification") || lower.includes("license") || lower.includes("awards")) {
      currentSection = "certifications";
      continue;
    } else if (lower.includes("summary") || lower.includes("profile") || lower.includes("objective")) {
      currentSection = "summary";
      continue;
    }

    sections[currentSection].push(line);
  }

  // Parse skills
  const skillsText = sections.skills.join(" ");
  const skillList = skillsText
    .split(/[,•|/\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 1 && s.length < 35);

  return {
    contact: {
      name,
      title,
      email,
      phone,
      location: "San Francisco, CA",
      linkedin: linkedinMatch ? linkedinMatch[0] : "",
      github: githubMatch ? githubMatch[0] : "",
      portfolio: portfolioMatch ? portfolioMatch[0] : "",
    },
    summary: sections.summary.join(" ").slice(0, 500) || "Experienced professional with strong technical and operational background.",
    experience: [
      {
        id: "exp-parsed-1",
        company: "Primary Employer",
        role: title || "Senior Specialist",
        location: "City, State",
        startDate: "2021-01",
        endDate: "Present",
        current: true,
        bullets: sections.experience.length > 0
          ? sections.experience.filter(l => l.startsWith("•") || l.startsWith("-") || l.length > 20).slice(0, 5)
          : ["Managed cross-functional initiatives and delivered key project milestones.", "Optimized processes and improved operational efficiency."],
      },
    ],
    projects: sections.projects.length > 0 ? [
      {
        id: "proj-parsed-1",
        title: "Key Highlight Project",
        techStack: skillList.slice(0, 4),
        description: "High impact technical solution.",
        link: "",
        bullets: sections.projects.filter(l => l.length > 15).slice(0, 3),
      }
    ] : [],
    skills: {
      hardSkills: skillList.slice(0, 8),
      softSkills: ["Leadership", "Communication", "Problem Solving", "Strategic Planning"],
      technicalSkills: skillList.slice(8, 14),
      industrySkills: ["Domain Expertise", "Agile Workflow"],
    },
    education: [
      {
        id: "edu-parsed-1",
        institution: sections.education.length > 0 ? sections.education[0] : "State University",
        degree: "Bachelor of Science",
        field: "Relevant Major",
        startDate: "2016",
        endDate: "2020",
        highlights: [],
      },
    ],
    certifications: sections.certifications.length > 0 ? [
      {
        id: "cert-parsed-1",
        name: sections.certifications[0],
        issuer: "Industry Board",
        date: "2023",
      }
    ] : [],
  };
}
