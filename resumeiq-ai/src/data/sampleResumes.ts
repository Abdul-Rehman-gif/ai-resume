import { ResumeData } from "../types";

export const SAMPLE_RESUMES: Record<string, { label: string; role: string; data: ResumeData; rawText: string }> = {
  software_engineer: {
    label: "Software Engineer (Mid-Senior)",
    role: "Senior Full Stack Software Engineer",
    data: {
      contact: {
        name: "Alex Morgan",
        title: "Senior Full Stack Software Engineer",
        email: "alex.morgan@email.com",
        phone: "+1 (555) 234-5678",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/alexmorgan-dev",
        github: "github.com/alexmorgan-dev",
        portfolio: "alexmorgan.dev",
      },
      summary: "Results-oriented Senior Full Stack Engineer with 6+ years of experience architecting cloud-native microservices, scaling web applications to 2M+ active users, and driving modern React/Node.js tech stacks. Proven track record of reducing infrastructure latency by 40% and leading high-performing Agile teams.",
      experience: [
        {
          id: "exp-1",
          company: "TechScale Solutions",
          role: "Senior Full Stack Engineer",
          location: "San Francisco, CA",
          startDate: "2022-03",
          endDate: "Present",
          current: true,
          bullets: [
            "Architected high-throughput microservices handling over 15,000 requests per minute using Node.js, TypeScript, and Redis caching.",
            "Spearheaded complete frontend rewrite in Next.js & React, improving core web vitals and reducing page load times from 3.2s to 0.9s (72% speedup).",
            "Mentored team of 6 junior and mid-level engineers, enforcing strict CI/CD pipelines, code reviews, and automated unit testing (94% coverage).",
            "Optimized PostgreSQL database query performance, indexing key tables to eliminate bottlenecks during peak Black Friday traffic spikes.",
          ],
        },
        {
          id: "exp-2",
          company: "CloudVibe Systems",
          role: "Software Engineer",
          location: "San Jose, CA",
          startDate: "2019-06",
          endDate: "2022-02",
          current: false,
          bullets: [
            "Developed RESTful APIs and real-time WebSocket feeds serving financial analytics data to 50,000+ Enterprise clients.",
            "Worked on migrating legacy monolith to Docker & Kubernetes on Google Cloud Platform (GCP), cutting server hosting costs by $120,000/yr.",
            "Helped implement OAuth2 and SAML authentication flows, ensuring SOC 2 Type II compliance.",
          ],
        },
      ],
      projects: [
        {
          id: "proj-1",
          title: "DevPulse - Real-time Developer Analytics Dashboard",
          techStack: ["React", "TypeScript", "Node.js", "GraphQL", "Tailwind CSS"],
          description: "Open-source developer performance dashboard tracking commit metrics and deployment velocity.",
          link: "https://github.com/alexmorgan-dev/devpulse",
          bullets: [
            "Engineered streaming event system using Server-Sent Events (SSE) to aggregate metrics from GitHub and Jira APIs.",
            "Gained 1,200+ GitHub stars and featured in Product Hunt Top 5 Products of the Day.",
          ],
        },
      ],
      skills: {
        hardSkills: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "GraphQL", "Redis", "Docker", "Kubernetes", "Google Cloud (GCP)", "AWS", "Git"],
        softSkills: ["Technical Leadership", "Agile/Scrum", "System Architecture", "Cross-Functional Collaboration", "Problem Solving"],
        technicalSkills: ["REST APIs", "CI/CD", "Microservices", "TDD", "System Design"],
        industrySkills: ["SaaS Infrastructure", "Fintech Compliance", "E-Commerce Scaling"],
      },
      education: [
        {
          id: "edu-1",
          institution: "University of California, Berkeley",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2015-08",
          endDate: "2019-05",
          gpa: "3.85 / 4.0",
          highlights: ["Dean's Honor List (6 terms)", "Vice President of Computer Science Undergraduate Association"],
        },
      ],
      certifications: [
        {
          id: "cert-1",
          name: "AWS Certified Solutions Architect – Associate",
          issuer: "Amazon Web Services",
          date: "2023-01",
        },
        {
          id: "cert-2",
          name: "Google Cloud Certified Professional Cloud Architect",
          issuer: "Google Cloud",
          date: "2022-08",
        },
      ],
    },
    rawText: `ALEX MORGAN
San Francisco, CA | alex.morgan@email.com | +1 (555) 234-5678
linkedin.com/in/alexmorgan-dev | github.com/alexmorgan-dev | alexmorgan.dev

SUMMARY
Results-oriented Senior Full Stack Engineer with 6+ years of experience architecting cloud-native microservices, scaling web applications to 2M+ active users, and driving modern React/Node.js tech stacks. Proven track record of reducing infrastructure latency by 40% and leading high-performing Agile teams.

EXPERIENCE
TechScale Solutions — Senior Full Stack Engineer
San Francisco, CA | Mar 2022 – Present
• Architected high-throughput microservices handling over 15,000 requests per minute using Node.js, TypeScript, and Redis caching.
• Spearheaded complete frontend rewrite in Next.js & React, improving core web vitals and reducing page load times from 3.2s to 0.9s (72% speedup).
• Mentored team of 6 junior and mid-level engineers, enforcing strict CI/CD pipelines, code reviews, and automated unit testing (94% coverage).
• Optimized PostgreSQL database query performance, indexing key tables to eliminate bottlenecks during peak Black Friday traffic spikes.

CloudVibe Systems — Software Engineer
San Jose, CA | Jun 2019 – Feb 2022
• Developed RESTful APIs and real-time WebSocket feeds serving financial analytics data to 50,000+ Enterprise clients.
• Worked on migrating legacy monolith to Docker & Kubernetes on Google Cloud Platform (GCP), cutting server hosting costs by $120,000/yr.
• Helped implement OAuth2 and SAML authentication flows, ensuring SOC 2 Type II compliance.

PROJECTS
DevPulse — Real-time Developer Analytics Dashboard
• Engineered streaming event system using Server-Sent Events (SSE) to aggregate metrics from GitHub and Jira APIs.
• Gained 1,200+ GitHub stars and featured in Product Hunt Top 5 Products of the Day.

SKILLS
Programming Languages & Libraries: React, TypeScript, Node.js, Express, PostgreSQL, GraphQL, Redis, Docker, Kubernetes, GCP, AWS, Git
Technical Capabilities: REST APIs, CI/CD, Microservices, System Architecture, Test-Driven Development (TDD)
Soft Skills: Technical Leadership, Agile/Scrum, Problem Solving, Cross-functional Communication

EDUCATION
University of California, Berkeley — B.S. in Computer Science | GPA: 3.85 / 4.0 | Aug 2015 – May 2019

CERTIFICATIONS
• AWS Certified Solutions Architect – Associate (Jan 2023)
• Google Cloud Certified Professional Cloud Architect (Aug 2022)`,
  },
  product_manager: {
    label: "Product Manager (Senior / Lead)",
    role: "Senior Product Manager",
    data: {
      contact: {
        name: "Sarah Jenkins",
        title: "Senior Product Manager",
        email: "sarah.jenkins@email.com",
        phone: "+1 (555) 876-5432",
        location: "New York, NY",
        linkedin: "linkedin.com/in/sarahjenkins-pm",
        github: "",
        portfolio: "sarahjenkins.co",
      },
      summary: "Data-driven Product Manager with 7+ years of experience growing B2B SaaS ARR from $5M to $28M. Skilled in product strategy, customer discovery, funnel conversion optimization, and leading cross-functional engineering, design, and GTM teams.",
      experience: [
        {
          id: "exp-pm-1",
          company: "Nexus SaaS",
          role: "Senior Product Manager - Growth",
          location: "New York, NY",
          startDate: "2021-09",
          endDate: "Present",
          current: true,
          bullets: [
            "Defined Product Vision & GTM roadmap for enterprise collaboration suite, driving 38% YoY expansion revenue.",
            "Ran 45+ A/B experiments on user onboarding flows, boosting self-serve free-to-paid conversion rates from 4.1% to 8.7%.",
            "Collaborated directly with VP of Engineering to prioritize 12-month product backlog using RICE scoring methodology.",
          ],
        },
        {
          id: "exp-pm-2",
          company: "Optima Analytics",
          role: "Product Manager",
          location: "Boston, MA",
          startDate: "2018-05",
          endDate: "2021-08",
          current: false,
          bullets: [
            "Launched AI-powered anomaly detection feature, adopting 120+ enterprise enterprise customers within 90 days of launch.",
            "Conducted over 100 customer interviews with Chief Data Officers to identify workflow pain points.",
          ],
        },
      ],
      projects: [],
      skills: {
        hardSkills: ["Product Strategy", "Roadmapping", "A/B Testing", "Mixpanel", "Amplitude", "Jira", "SQL", "User Research", "Wireframing", "Figma"],
        softSkills: ["Cross-functional Leadership", "Stakeholder Alignment", "Strategic Thinking", "Data Analysis"],
        technicalSkills: ["SQL Queries", "API Integrations", "Agile/Scrum", "Product Analytics"],
        industrySkills: ["B2B SaaS", "Enterprise Software", "PLG (Product-Led Growth)"],
      },
      education: [
        {
          id: "edu-pm-1",
          institution: "Columbia University",
          degree: "Master of Business Administration (MBA)",
          field: "Product & Technology Management",
          startDate: "2016-08",
          endDate: "2018-05",
          highlights: ["President of Product Management Club"],
        },
      ],
      certifications: [
        {
          id: "cert-pm-1",
          name: "Certified Scrum Product Owner (CSPO)",
          issuer: "Scrum Alliance",
          date: "2020-04",
        },
      ],
    },
    rawText: `SARAH JENKINS
New York, NY | sarah.jenkins@email.com | +1 (555) 876-5432 | linkedin.com/in/sarahjenkins-pm | sarahjenkins.co

SUMMARY
Data-driven Product Manager with 7+ years of experience growing B2B SaaS ARR from $5M to $28M. Skilled in product strategy, customer discovery, funnel conversion optimization, and leading cross-functional engineering, design, and GTM teams.

EXPERIENCE
Nexus SaaS — Senior Product Manager - Growth
New York, NY | Sep 2021 – Present
• Defined Product Vision & GTM roadmap for enterprise collaboration suite, driving 38% YoY expansion revenue.
• Ran 45+ A/B experiments on user onboarding flows, boosting self-serve free-to-paid conversion rates from 4.1% to 8.7%.
• Collaborated directly with VP of Engineering to prioritize 12-month product backlog using RICE scoring methodology.

Optima Analytics — Product Manager
Boston, MA | May 2018 – Aug 2021
• Launched AI-powered anomaly detection feature, adopting 120+ enterprise customers within 90 days of launch.
• Conducted over 100 customer interviews with Chief Data Officers to identify workflow pain points.

SKILLS
Product Strategy, Roadmapping, A/B Testing, Mixpanel, Amplitude, Jira, SQL, User Research, Wireframing, Figma, B2B SaaS, PLG

EDUCATION
Columbia University — MBA in Product & Technology Management | 2016 – 2018

CERTIFICATIONS
• Certified Scrum Product Owner (CSPO)`,
  },
  fresh_graduate: {
    label: "Fresh Graduate / Junior Candidate",
    role: "Junior Software Developer",
    data: {
      contact: {
        name: "Jordan Lee",
        title: "Junior Software Developer",
        email: "jordan.lee@university.edu",
        phone: "+1 (555) 432-1098",
        location: "Austin, TX",
        linkedin: "linkedin.com/in/jordanlee-dev",
        github: "github.com/jordanlee",
        portfolio: "",
      },
      summary: "Motivated Computer Science graduate with hands-on software development internship experience. Proficient in Java, Python, HTML/CSS, and SQL. Eager to contribute to collaborative engineering teams building scalable web apps.",
      experience: [
        {
          id: "exp-jr-1",
          company: "Innovate Tech Lab",
          role: "Software Engineering Intern",
          location: "Austin, TX",
          startDate: "2023-06",
          endDate: "2023-08",
          current: false,
          bullets: [
            "Assisted in writing unit test scripts in JUnit and Jest for internal admin portal.",
            "Worked on fixing UI bugs and updated documentation for API endpoints.",
            "Helped team present sprint deliverables to engineering leads.",
          ],
        },
      ],
      projects: [
        {
          id: "proj-jr-1",
          title: "Smart Campus Meal Planner App",
          techStack: ["React Native", "Firebase", "Node.js"],
          description: "Mobile app for university students to track daily cafeteria menus and nutrition.",
          link: "github.com/jordanlee/meal-planner",
          bullets: [
            "Built interactive meal selector used by 300+ fellow students during launch week.",
            "Integrated Firebase Firestore for real-time menu updates.",
          ],
        },
      ],
      skills: {
        hardSkills: ["Java", "Python", "JavaScript", "React", "HTML/CSS", "Git", "SQL", "Firebase"],
        softSkills: ["Teamwork", "Eagerness to Learn", "Communication", "Time Management"],
        technicalSkills: ["Object-Oriented Programming (OOP)", "Data Structures", "Algorithms"],
        industrySkills: ["Web Development", "Mobile Applications"],
      },
      education: [
        {
          id: "edu-jr-1",
          institution: "University of Texas at Austin",
          degree: "Bachelor of Science",
          field: "Computer Science",
          startDate: "2020-08",
          endDate: "2024-05",
          gpa: "3.4 / 4.0",
          highlights: ["Member of Association for Computing Machinery (ACM)"],
        },
      ],
      certifications: [],
    },
    rawText: `JORDAN LEE
Austin, TX | jordan.lee@university.edu | +1 (555) 432-1098 | linkedin.com/in/jordanlee-dev | github.com/jordanlee

SUMMARY
Motivated Computer Science graduate with hands-on software development internship experience. Proficient in Java, Python, HTML/CSS, and SQL. Eager to contribute to collaborative engineering teams building scalable web apps.

EXPERIENCE
Innovate Tech Lab — Software Engineering Intern
Austin, TX | Jun 2023 – Aug 2023
• Assisted in writing unit test scripts in JUnit and Jest for internal admin portal.
• Worked on fixing UI bugs and updated documentation for API endpoints.
• Helped team present sprint deliverables to engineering leads.

PROJECTS
Smart Campus Meal Planner App
• Built interactive meal selector used by 300+ fellow students during launch week.
• Integrated Firebase Firestore for real-time menu updates.

SKILLS
Java, Python, JavaScript, React, HTML/CSS, Git, SQL, Firebase, OOP, Data Structures

EDUCATION
University of Texas at Austin — B.S. in Computer Science | GPA: 3.4 / 4.0 | 2020 – 2024`,
  },
};
