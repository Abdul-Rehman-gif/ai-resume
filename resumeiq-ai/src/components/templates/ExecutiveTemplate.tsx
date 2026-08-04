import React from "react";
import { ResumeData } from "../../types";

interface Props {
  data: ResumeData;
}

export const ExecutiveTemplate: React.FC<Props> = ({ data }) => {
  const { contact, summary, experience, projects, skills, education, certifications } = data;

  return (
    <div
      id="resume-preview-content"
      className="bg-white text-slate-900 shadow-lg max-w-[800px] mx-auto text-sm font-serif border border-slate-300 printable-area"
    >
      {/* Executive Dark Slate Header */}
      <header className="bg-slate-900 text-white p-8 text-center font-sans">
        <h1 className="text-3xl font-bold tracking-widest uppercase text-amber-300">{contact.name || "YOUR NAME"}</h1>
        {contact.title && <p className="text-base text-slate-300 tracking-wide mt-1 font-light">{contact.title}</p>}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-300 mt-3 border-t border-slate-700 pt-3">
          {contact.location && <span>{contact.location}</span>}
          {contact.email && <span>• {contact.email}</span>}
          {contact.phone && <span>• {contact.phone}</span>}
          {contact.linkedin && <span>• {contact.linkedin}</span>}
          {contact.portfolio && <span>• {contact.portfolio}</span>}
        </div>
      </header>

      <div className="p-8 md:p-10 space-y-6">
        {/* Executive Summary Box */}
        {summary && (
          <section className="border-l-2 border-amber-600 pl-4 py-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 font-sans mb-1">
              Executive Profile
            </h2>
            <p className="text-slate-800 text-[13px] leading-relaxed italic">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-800 pb-1 mb-4 font-sans flex justify-between items-center">
              <span>Leadership Experience</span>
            </h2>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span className="text-sm">
                      {exp.role} | <span className="font-normal italic text-slate-700">{exp.company}</span>
                    </span>
                    <span className="text-xs text-slate-600 font-sans font-normal">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate} ({exp.location})
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-5 mt-1.5 text-[13px] text-slate-800 space-y-1">
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
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-800 pb-1 mb-3 font-sans">
              Key Strategic Initiatives
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{proj.title}</span>
                    {proj.link && <span className="text-xs font-sans text-slate-600">{proj.link}</span>}
                  </div>
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-5 mt-1 text-[13px] text-slate-800 space-y-1">
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

        {/* Skills & Education split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
          {skills && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2 font-sans">
                Core Capabilities
              </h2>
              <p className="text-xs text-slate-800 leading-relaxed font-sans">
                {skills.hardSkills?.concat(skills.technicalSkills || []).join(" • ")}
              </p>
            </section>
          )}

          {education && education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2 font-sans">
                Education & Credentials
              </h2>
              <div className="space-y-1 text-xs text-slate-800 font-sans">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <strong>{edu.institution}</strong> — {edu.degree} ({edu.endDate})
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
