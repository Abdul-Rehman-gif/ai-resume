import React from "react";
import { ResumeData } from "../../types";

interface Props {
  data: ResumeData;
}

export const GoogleTemplate: React.FC<Props> = ({ data }) => {
  const { contact, summary, experience, projects, skills, education, certifications } = data;

  return (
    <div
      id="resume-preview-content"
      className="bg-white text-gray-900 p-8 md:p-12 shadow-md max-w-[800px] mx-auto text-sm font-sans leading-relaxed border border-gray-200 printable-area"
    >
      {/* Google Style Header: Centered & Spacious */}
      <header className="text-center pb-4 mb-4 border-b border-gray-300">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{contact.name || "YOUR NAME"}</h1>
        {contact.title && <p className="text-sm font-medium text-blue-700 mt-0.5">{contact.title}</p>}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-600 mt-2">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>| {contact.phone}</span>}
          {contact.location && <span>| {contact.location}</span>}
          {contact.linkedin && <span>| {contact.linkedin}</span>}
          {contact.github && <span>| {contact.github}</span>}
          {contact.portfolio && <span>| {contact.portfolio}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
            Summary
          </h2>
          <p className="text-gray-800 text-[13px]">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 border-b border-gray-200 pb-1">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-semibold text-gray-900 text-xs">
                  <span>
                    <strong className="text-sm text-gray-900">{exp.company}</strong> — {exp.role}
                  </span>
                  <span className="text-gray-600 font-normal">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate} ({exp.location})
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 text-[13px] text-gray-800 space-y-1">
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 border-b border-gray-200 pb-1">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-semibold text-gray-900 text-xs">
                  <span>
                    <strong>{proj.title}</strong>
                    {proj.techStack?.length > 0 && (
                      <span className="text-gray-600 font-normal ml-2">
                        ({proj.techStack.join(", ")})
                      </span>
                    )}
                  </span>
                  {proj.link && <span className="text-blue-700 text-xs">{proj.link}</span>}
                </div>
                {proj.bullets && proj.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 text-[13px] text-gray-800 space-y-1">
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

      {/* Technical Skills */}
      {skills && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 border-b border-gray-200 pb-1">
            Skills & Expertise
          </h2>
          <div className="text-[13px] text-gray-800 space-y-1">
            {skills.hardSkills?.length > 0 && (
              <p>
                <strong>Technical: </strong>
                {skills.hardSkills.join(" • ")}
              </p>
            )}
            {skills.technicalSkills?.length > 0 && (
              <p>
                <strong>Tools & Infrastructure: </strong>
                {skills.technicalSkills.join(" • ")}
              </p>
            )}
            {skills.softSkills?.length > 0 && (
              <p>
                <strong>Leadership & Practices: </strong>
                {skills.softSkills.join(" • ")}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 border-b border-gray-200 pb-1">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between text-xs">
                <span>
                  <strong>{edu.institution}</strong> — {edu.degree} in {edu.field}
                </span>
                <span className="text-gray-600">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 border-b border-gray-200 pb-1">
            Certifications
          </h2>
          <ul className="list-disc list-outside ml-4 text-[13px] text-gray-800 space-y-0.5">
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
