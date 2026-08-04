<div align="center">
  <img src="assets/banner.png" alt="ResumeIQ AI Banner" width="420" />

 ResumeIQ AI

**AI Resume Checker, ATS Scanner & Recruiter-Grade Resume Builder**

Built on Harvard, Google & Executive career-research benchmarks — powered by Google Gemini.

</div>

---

 Overview

ResumeIQ AI is a full-stack web application that analyzes resumes against a target job role, produces a detailed **ATS (Applicant Tracking System) compatibility score**, and lets users rebuild their resume from scratch using professionally designed templates — all backed by the **Gemini API**.

Upload a resume (or paste the text), tell it the job you're targeting, and ResumeIQ AI returns a full breakdown: overall score, letter grade, ATS parsing risk, category-by-category evaluation, red flags, career-gap analysis, weak action verbs, and a prioritized list of the top 20 improvements to make.

---

 Features

- Client Login / Signup — Email + password auth with OTP-based signup verification, plus guest/demo login (`ClientLoginView.tsx`).
- Resume Upload & Parsing — Paste or upload resume text; a heuristic parser (`resumeParser.ts`) extracts contact info, links, and sections (summary, experience, projects, skills, education, certifications).
- AI-Powered Analysis (Gemini) — The backend (`server.ts`) calls the Google GenAI SDK to generate a structured `ResumeAnalysisReport`, including:
  - Overall score & letter grade (A+ to F)
  - ATS score with parsing risk and formatting/table/column/graphic/header-footer warnings
  - Per-category evaluations: Contact Info, Summary, Skills, Experience, Projects, Education, Certifications, Formatting, Grammar, Keywords, Recruiter Readability
  - STAR compliance, quantifiable metrics, and action-verb strength scoring for experience bullets
  - Red flags with severity ratings
  - Career gap detection with mitigation strategies
  - Weak action verb detection with recommended alternatives
  - Achievement/bullet-point rewrite suggestions
  - Industry-specific advice and trending keywords
  - Missing-sections detector
  - Ranked Top 20 Improvements list
- Interactive Dashboard — Visual score breakdown and charts via `DashboardView.tsx` (Recharts).
  Resume Builder — Rebuild the resume using structured data with four professional templates:
  - Harvard Template
  - Modern Template
  - Google Template
  - Executive Template
-  AI Recruiter Chat — Floating chat modal (`AIChatModal.tsx`) to ask follow-up questions about your resume/report.
- Export to PDF & DOCX — Client-side export via `html2canvas` + `jsPDF` (PDF) and the `docx` library (Word).
- Modern Responsive UI — Built with React 19, Tailwind CSS 4, and Motion (Framer Motion) animations.

---

 Tech Stack

| Layer            | Technology                                             |
|-------------------|---------------------------------------------------------|
| Frontend          | React 19, TypeScript, Vite 6, Tailwind CSS 4            |
| UI/Animation      | Motion, Lucide React icons, Recharts                     |
| Backend           | Node.js, Express 4, tsx / esbuild                         |
| AI Engine         | Google Gemini API (`@google/genai`)                       |
| Document Export   | `jsPDF`, `html2canvas`, `docx`, `mammoth` (DOCX parsing)   |
| Email             | `nodemailer` (OTP delivery)                                |
| Storage           | Local JSON file storage (`data/users.json`)                |

---

 Project Structure

```
resumeiq-ai/
├── server.ts                        # Express server, Gemini API integration, auth routes
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .env.example
│
├── src/
│   ├── App.tsx                      # Root component & app state/routing
│   ├── main.tsx
│   ├── index.css
│   ├── types.ts                     # All shared TypeScript interfaces
│   │
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── UploadSection.tsx        # Resume upload / paste + target role input
│   │   ├── DashboardView.tsx        # Score dashboard & charts
│   │   ├── ResumeBuilderView.tsx    # Structured resume editor
│   │   ├── AIChatModal.tsx          # AI recruiter chat drawer
│   │   ├── ClientLoginView.tsx      # Auth / login / signup
│   │   └── templates/
│   │       ├── HarvardTemplate.tsx
│   │       ├── ModernTemplate.tsx
│   │       ├── GoogleTemplate.tsx
│   │       └── ExecutiveTemplate.tsx
│   │
│   ├── data/
│   │   └── sampleResumes.ts         # Demo/sample resume data
│   │
│   └── utils/
│       ├── resumeParser.ts          # Raw text → structured ResumeData
│       └── exporter.ts              # PDF/DOCX export logic
│
└── data/
    └── users.json                   # Generated at runtime (local user store)
```

---

 ⚙️ Installation & Setup

 Prerequisites
- Node.js (LTS recommended)
- A **Google Gemini API key**

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env` file (or `.env.local`) in the project root, based on `.env.example`:

```env
GEMINI_API_KEY="your_gemini_api_key"
APP_URL="http://localhost:3000"
```

### 3. Run the app
```bash
npm run dev
```

This runs `tsx server.ts`, which starts the Express backend and serves the Vite-powered React frontend at:

```
http://localhost:3000
```

### 4. Build for production
```bash
npm run build
npm run start
```

- `npm run build` — builds the frontend with Vite and bundles the server with esbuild into `dist/server.cjs`
- `npm run start` — runs the production server
- `npm run preview` — preview the built frontend
- `npm run lint` — type-check with `tsc --noEmit`
- `npm run clean` — remove build output

---

##  How It Works

1. **Sign in** (or continue as a guest/demo user) via the login screen.
2. **Upload or paste** your resume text and specify a **target job title** in the Upload section.
3. The frontend parses the raw text into structured `ResumeData` (`resumeParser.ts`) and sends it, along with the target role, to `POST /api/analyze-resume`.
4. The Express server calls the **Gemini API** to generate a full `ResumeAnalysisReport` — score, ATS breakdown, category evaluations, red flags, career gaps, and improvement recommendations.
5. Results render in the **Dashboard**, with charts and a categorized breakdown.
6. Use the **Resume Builder** to edit your structured resume data and preview it in the Harvard, Modern, Google, or Executive templates.
7. **Export** the finished resume as a PDF or DOCX file.
8. Use the **AI Chat** drawer at any time to ask Gemini follow-up questions about your resume or report.

---

##  Environment Variables

| Variable          | Description                                                        |
|--------------------|----------------------------------------------------------------------|
| `GEMINI_API_KEY`   | Required. API key for Google Gemini (`@google/genai`).               |
| `APP_URL`          | The URL where the app is hosted (used for self-referential links).   |

---

##  Roadmap

- [ ] Multi-language resume support
- [ ] LinkedIn profile import
- [ ] AI-generated cover letters
- [ ] Browser extension for one-click scoring
- [ ] Recruiter dashboard for bulk resume screening
- [ ] Persistent database (replace local JSON user store)

---

##  Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

##  License

This project is licensed under the **MIT License** — see the `LICENSE` file for details.

---

 If you find this project useful, consider giving it a star on GitHub!
