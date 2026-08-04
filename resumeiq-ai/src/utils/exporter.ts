import { Document, Paragraph, TextRun, Packer, HeadingLevel, AlignmentType } from "docx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ResumeData } from "../types";

/**
 * PDF Exporter using html2canvas & jsPDF
 */
export async function exportToPdf(elementId: string, filename: string = "Resume.pdf"): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found for PDF export:", elementId);
    window.print();
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  } catch (err) {
    console.error("Failed to generate PDF canvas, opening print view...", err);
    window.print();
  }
}

/**
 * DOCX Exporter using `docx` package
 */
export async function exportToDocx(data: ResumeData, filename: string = "Resume.docx"): Promise<void> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Name & Header
          new Paragraph({
            text: data.contact.name || "Candidate Name",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: [
              data.contact.title,
              data.contact.location,
              data.contact.email,
              data.contact.phone,
              data.contact.linkedin,
              data.contact.github,
              data.contact.portfolio,
            ]
              .filter(Boolean)
              .join(" | "),
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }), // Spacing

          // Professional Summary
          ...(data.summary
            ? [
                new Paragraph({ text: "PROFESSIONAL SUMMARY", heading: HeadingLevel.HEADING_2 }),
                new Paragraph({ text: data.summary }),
                new Paragraph({ text: "" }),
              ]
            : []),

          // Experience
          ...(data.experience && data.experience.length > 0
            ? [
                new Paragraph({ text: "WORK EXPERIENCE", heading: HeadingLevel.HEADING_2 }),
                ...data.experience.flatMap((exp) => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `${exp.role} — ${exp.company}`, bold: true }),
                      new TextRun({
                        text: ` (${exp.startDate} – ${exp.current ? "Present" : exp.endDate}) | ${exp.location}`,
                        italics: true,
                      }),
                    ],
                  }),
                  ...exp.bullets.map(
                    (bullet) =>
                      new Paragraph({
                        text: bullet.startsWith("•") ? bullet : `• ${bullet}`,
                        indent: { left: 360 },
                      })
                  ),
                  new Paragraph({ text: "" }),
                ]),
              ]
            : []),

          // Projects
          ...(data.projects && data.projects.length > 0
            ? [
                new Paragraph({ text: "PROJECTS", heading: HeadingLevel.HEADING_2 }),
                ...data.projects.flatMap((proj) => [
                  new Paragraph({
                    children: [
                      new TextRun({ text: proj.title, bold: true }),
                      proj.techStack?.length ? new TextRun({ text: ` (${proj.techStack.join(", ")})`, italics: true }) : new TextRun({ text: "" }),
                    ],
                  }),
                  ...(proj.description ? [new Paragraph({ text: proj.description, indent: { left: 360 } })] : []),
                  ...proj.bullets.map(
                    (b) => new Paragraph({ text: b.startsWith("•") ? b : `• ${b}`, indent: { left: 360 } })
                  ),
                  new Paragraph({ text: "" }),
                ]),
              ]
            : []),

          // Skills
          ...(data.skills
            ? [
                new Paragraph({ text: "TECHNICAL & PROFESSIONAL SKILLS", heading: HeadingLevel.HEADING_2 }),
                ...(data.skills.hardSkills?.length
                  ? [new Paragraph({ children: [new TextRun({ text: "Hard Skills: ", bold: true }), new TextRun(data.skills.hardSkills.join(", "))] })]
                  : []),
                ...(data.skills.technicalSkills?.length
                  ? [new Paragraph({ children: [new TextRun({ text: "Technical Capabilities: ", bold: true }), new TextRun(data.skills.technicalSkills.join(", "))] })]
                  : []),
                ...(data.skills.softSkills?.length
                  ? [new Paragraph({ children: [new TextRun({ text: "Soft Skills: ", bold: true }), new TextRun(data.skills.softSkills.join(", "))] })]
                  : []),
                new Paragraph({ text: "" }),
              ]
            : []),

          // Education
          ...(data.education && data.education.length > 0
            ? [
                new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_2 }),
                ...data.education.map((edu) =>
                  new Paragraph({
                    children: [
                      new TextRun({ text: `${edu.institution} — ${edu.degree} in ${edu.field}`, bold: true }),
                      new TextRun({ text: ` (${edu.startDate} – ${edu.endDate}) ${edu.gpa ? `| GPA: ${edu.gpa}` : ""}`, italics: true }),
                    ],
                  })
                ),
                new Paragraph({ text: "" }),
              ]
            : []),

          // Certifications
          ...(data.certifications && data.certifications.length > 0
            ? [
                new Paragraph({ text: "CERTIFICATIONS", heading: HeadingLevel.HEADING_2 }),
                ...data.certifications.map((cert) =>
                  new Paragraph({
                    text: `• ${cert.name} — ${cert.issuer} (${cert.date})`,
                  })
                ),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
