import React from "react";
import { ResumeData } from "../../types";

interface Props {
  data: ResumeData;
}

export const ModernTemplate: React.FC<Props> = ({ data }) => {
  const { contact, summary, experience, projects, skills, education, certifications } = data;

  return (
    <div
      id="resume-preview-content"
      className="bg-white text-slate-800 p-8 md:p-12 shadow-md max-w-[800px] mx-auto text-sm font-sans leading-normal border border-slate-200 printable-area"
    >
      {/* Top Banner Accent */}
      <div className="border-l-4 border-indigo-600 pl-4 py-1 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{contact.name || "YOUR NAME"}</h1>
        {contact.title && <p className="text-base font-medium text-indigo-600 mt-0.5">{contact.title}</p>}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2 font-normal">
          {contact.location && <span>📍 {contact.location}</span>}
          {contact.email && <span>✉️ {contact.email}</span>}
          {contact.phone && <span>📞 {contact.phone}</span>}
          {contact.linkedin && <span>🔗 {contact.linkedin}</span>}
          {contact.github && <span>💻 {contact.github}</span>}
          {contact.portfolio && <span>🌐 {contact.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section className="mb-6 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
          <p className="text-slate-700 text-[13px] leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200">
                <div className="flex justify-between items-baseline font-semibold text-slate-900">
                  <span className="text-sm">
                    {exp.role} <span className="text-indigo-600 font-normal">@ {exp.company}</span>
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate} | {exp.location}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 text-[13px] text-slate-700 space-y-1">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b.replace(/^[•-]\s*/, "")}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-slate-50/70 p-3 rounded-md border border-slate-100">
                <div className="flex justify-between items-baseline font-semibold text-slate-900">
                  <span>{proj.title}</span>
                  {proj.link && <span className="text-xs text-indigo-600 underline">{proj.link}</span>}
                </div>
                {proj.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.techStack.map((t, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 text-[11px] font-medium px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-2 text-[13px] text-slate-700 space-y-1">
                    {proj.bullets.map((b, i) => (
                      <li key={i}>{b.replace(/^[•-]\s*/, "")}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Core Competencies & Skills
          </h2>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {skills.hardSkills?.map((skill, idx) => (
              <span key={`hard-${idx}`} className="bg-slate-100 text-slate-800 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200">
                {skill}
              </span>
            ))}
            {skills.technicalSkills?.map((skill, idx) => (
              <span key={`tech-${idx}`} className="bg-indigo-50 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-md border border-indigo-100">
                {skill}
              </span>
            ))}
            {skills.softSkills?.map((skill, idx) => (
              <span key={`soft-${idx}`} className="bg-emerald-50 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-md border border-emerald-100">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">Education</h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <p className="font-semibold text-slate-900">{edu.institution}</p>
                  <p className="text-slate-600">{edu.degree} in {edu.field}</p>
                  <p className="text-slate-500">{edu.startDate} – {edu.endDate} {edu.gpa && `| GPA: ${edu.gpa}`}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications && certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">Certifications</h2>
            <div className="space-y-1 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-slate-700">
                  <span className="font-medium text-slate-900">{cert.name}</span>
                  <span className="text-slate-500"> — {cert.issuer} ({cert.date})</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
