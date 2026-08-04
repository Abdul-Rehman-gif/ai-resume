import React from "react";
import { ResumeData } from "../../types";

interface Props {
  data: ResumeData;
}

export const HarvardTemplate: React.FC<Props> = ({ data }) => {
  const { contact, summary, experience, projects, skills, education, certifications } = data;

  return (
    <div
      id="resume-preview-content"
      className="bg-white text-gray-900 p-8 md:p-12 shadow-md max-w-[800px] mx-auto text-sm font-serif leading-normal border border-gray-200 printable-area"
    >
      {/* Header */}
      <header className="text-center border-b border-gray-900 pb-4 mb-5">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-gray-900">{contact.name || "YOUR NAME"}</h1>
        {contact.title && <p className="text-base italic text-gray-700 mt-1">{contact.title}</p>}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-800 mt-2 font-sans">
          {contact.location && <span>{contact.location}</span>}
          {contact.phone && <span>• {contact.phone}</span>}
          {contact.email && <span>• {contact.email}</span>}
          {contact.linkedin && <span>• {contact.linkedin}</span>}
          {contact.github && <span>• {contact.github}</span>}
          {contact.portfolio && <span>• {contact.portfolio}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2 font-sans">
            Professional Summary
          </h2>
          <p className="text-gray-800 leading-relaxed font-serif text-[13px]">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3 font-sans">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-semibold text-gray-900">
                  <span>
                    {exp.role} — <span className="font-normal italic">{exp.company}</span>
                  </span>
                  <span className="text-xs text-gray-700 font-sans">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate} | {exp.location}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-5 mt-1 text-[13px] text-gray-800 space-y-1">
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
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3 font-sans">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-semibold text-gray-900">
                  <span>
                    {proj.title}
                    {proj.techStack?.length > 0 && (
                      <span className="font-sans font-normal text-xs text-gray-600 ml-2">
                        [{proj.techStack.join(", ")}]
                      </span>
                    )}
                  </span>
                  {proj.link && (
                    <span className="text-xs text-blue-800 font-sans underline">{proj.link}</span>
                  )}
                </div>
                {proj.description && <p className="text-xs text-gray-700 italic mt-0.5">{proj.description}</p>}
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-5 mt-1 text-[13px] text-gray-800 space-y-1">
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
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2 font-sans">
            Skills & Competencies
          </h2>
          <div className="text-[13px] text-gray-800 space-y-1">
            {skills.hardSkills?.length > 0 && (
              <p>
                <strong className="font-sans font-semibold text-gray-900">Core Technical Skills: </strong>
                {skills.hardSkills.join(", ")}
              </p>
            )}
            {skills.technicalSkills?.length > 0 && (
              <p>
                <strong className="font-sans font-semibold text-gray-900">Tools & Frameworks: </strong>
                {skills.technicalSkills.join(", ")}
              </p>
            )}
            {skills.softSkills?.length > 0 && (
              <p>
                <strong className="font-sans font-semibold text-gray-900">Leadership & Soft Skills: </strong>
                {skills.softSkills.join(", ")}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2 font-sans">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-gray-900">{edu.institution}</span> —{" "}
                  <span className="italic">{edu.degree} in {edu.field}</span>
                  {edu.gpa && <span className="text-xs text-gray-700 ml-2 font-sans">(GPA: {edu.gpa})</span>}
                </div>
                <span className="text-xs text-gray-700 font-sans">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2 font-sans">
            Certifications
          </h2>
          <ul className="list-disc list-outside ml-5 text-[13px] text-gray-800 space-y-1 font-sans">
            {certifications.map((cert) => (
              <li key={cert.id}>
                <strong>{cert.name}</strong> — {cert.issuer} ({cert.date})
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
