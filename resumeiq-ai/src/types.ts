export interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  techStack: string[];
  description: string;
  link: string;
  bullets: string[];
}

export interface SkillCategories {
  hardSkills: string[];
  softSkills: string[];
  technicalSkills: string[];
  industrySkills: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
  credentialId?: string;
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillCategories;
  education: EducationItem[];
  certifications: CertificationItem[];
  customSections?: Array<{ title: string; items: string[] }>;
}

export interface ATSBreakdown {
  score: number;
  parsingRisk: "Low" | "Medium" | "High";
  formattingIssues: string[];
  tableWarnings: string[];
  columnWarnings: string[];
  graphicWarnings: string[];
  headerFooterWarnings: string[];
}

export interface CategoryEvaluation {
  score: number;
  status: "Good" | "Needs Work" | "Critical";
  feedback: string;
  keyStrengths?: string[];
  missingElements?: string[];
}

export interface SkillsCategoryEvaluation extends CategoryEvaluation {
  hardSkillsFound: string[];
  softSkillsFound: string[];
  missingEssentialSkills: string[];
  trendingKeywordsToInclude: string[];
}

export interface ExperienceCategoryEvaluation extends CategoryEvaluation {
  starComplianceScore: number;
  quantifiableMetricsScore: number;
  actionVerbStrengthScore: number;
  weakBulletPoints: string[];
  duplicateContent: string[];
}

export interface ProjectsCategoryEvaluation extends CategoryEvaluation {
  qualityRating: string;
  missingLinks: boolean;
  businessImpactScore: number;
}

export interface ContactCategoryEvaluation extends CategoryEvaluation {
  checkList: Array<{ label: string; present: boolean; suggestion?: string }>;
}

export interface FormattingCategoryEvaluation extends CategoryEvaluation {
  whitespaceRating: string;
  readabilityRating: string;
  marginAlignment: string;
  fontReadability: string;
}

export interface GrammarCategoryEvaluation extends CategoryEvaluation {
  passiveVoiceInstances: string[];
  readabilityFlesch: string;
  spellingGrammarNotes: string[];
}

export interface KeywordsCategoryEvaluation extends CategoryEvaluation {
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordStuffingDetected: boolean;
}

export interface RecruiterReadabilityEvaluation extends CategoryEvaluation {
  estimatedReadTimeSeconds: number;
  explainWhy: string;
  firstImpressionScore: number; // e.g. 8.6
  professionalismScore: number;
  resumeLengthAssessment: "Ideal (1 Page)" | "Ideal (2 Pages)" | "Too Long" | "Too Short";
}

export interface RedFlag {
  title: string;
  severity: "High" | "Medium" | "Low";
  description: string;
  fixAdvice: string;
}

export interface CareerGap {
  period: string;
  concernLevel: "Minor" | "Moderate" | "Major";
  explanation: string;
  mitigationStrategy: string;
}

export interface WeakActionVerb {
  originalWord: string;
  context: string;
  recommendedAlternatives: string[];
}

export interface AchievementImprovement {
  originalBullet: string;
  quantifiedSuggestion: string;
  explanation: string;
}

export interface TopImprovement {
  rank: number;
  category: string;
  title: string;
  actionItem: string;
  impact: "High" | "Medium" | "Low";
}

export interface ResumeAnalysisReport {
  targetRoleDetected: string;
  overallScore: number;
  letterGrade: "A+" | "A" | "B+" | "B" | "C" | "D" | "F";
  atsScore: number;
  atsBreakdown: ATSBreakdown;
  categories: {
    summary: CategoryEvaluation;
    contactInfo: ContactCategoryEvaluation;
    skills: SkillsCategoryEvaluation;
    experience: ExperienceCategoryEvaluation;
    projects: ProjectsCategoryEvaluation;
    education: CategoryEvaluation;
    certifications: CategoryEvaluation;
    formatting: FormattingCategoryEvaluation;
    grammar: GrammarCategoryEvaluation;
    keywords: KeywordsCategoryEvaluation;
    recruiterReadability: RecruiterReadabilityEvaluation;
  };
  redFlags: RedFlag[];
  careerGaps: CareerGap[];
  weakActionVerbs: WeakActionVerb[];
  achievementImprovements: AchievementImprovement[];
  industrySpecificAdvice: {
    targetRole: string;
    adviceList: string[];
    specializedKeywords: string[];
  };
  missingSections: Array<{ sectionName: string; importance: "Critical" | "Recommended" | "Optional"; reason: string }>;
  top20Improvements: TopImprovement[];
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  roleTitle: string;
  company?: string;
  loginMethod: "password" | "google" | "magic_link" | "guest" | "sso";
  isPro: boolean;
  credits: number;
  joinedDate?: string;
}

export type ResumeTemplateId = "harvard" | "modern" | "google" | "executive";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
