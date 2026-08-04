import React, { useState } from "react";
import { ResumeData, ResumeTemplateId } from "../types";
import { HarvardTemplate } from "./templates/HarvardTemplate";
import { ModernTemplate } from "./templates/ModernTemplate";
import { GoogleTemplate } from "./templates/GoogleTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { exportToPdf, exportToDocx } from "../utils/exporter";
import {
  Download,
  FileText,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Zap,
  Layout,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  FolderKanban,
} from "lucide-react";

interface Props {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  targetRole: string;
}

export const ResumeBuilderView: React.FC<Props> = ({ resumeData, setResumeData, targetRole }) => {
  const [activeTemplate, setActiveTemplate] = useState<ResumeTemplateId>("harvard");
  const [activeEditorTab, setActiveEditorTab] = useState<"contact" | "summary" | "experience" | "projects" | "skills" | "education">("contact");
  const [isRewriting, setIsRewriting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // AI Full Resume Rewrite
  const handleAIRewrite = async () => {
    setIsRewriting(true);
    try {
      const res = await fetch("/api/rewrite-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, targetJobTitle: targetRole }),
      });
      const data = await res.json();
      if (data.rewrittenData) {
        setResumeData(data.rewrittenData);
        setExportSuccess("Resume rewritten & optimized with AI!");
        setTimeout(() => setExportSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Rewrite error:", err);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleExportPDF = async () => {
    setExportSuccess("Generating high-resolution PDF...");
    await exportToPdf("resume-preview-content", `${resumeData.contact.name || "Resume"}.pdf`);
    setExportSuccess(null);
  };

  const handleExportDOCX = async () => {
    setExportSuccess("Generating Word .docx document...");
    await exportToDocx(resumeData, `${resumeData.contact.name || "Resume"}.docx`);
    setExportSuccess(null);
  };

  // Helper form updater
  const updateContact = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setResumeData((prev) => {
      const newExp = [...prev.experience];
      newExp[index] = { ...newExp[index], [field]: value };
      return { ...prev, experience: newExp };
    });
  };

  const addExperienceItem = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: `exp-${Date.now()}`,
          company: "Company Name",
          role: "Role Title",
          location: "City, State",
          startDate: "2022-01",
          endDate: "Present",
          current: true,
          bullets: ["Spearheaded key project initiatives and optimized team performance."],
        },
      ],
    }));
  };

  const removeExperienceItem = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Controls Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Template Selector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase text-slate-500 mr-2 flex items-center gap-1">
            <Layout className="w-4 h-4 text-indigo-600" /> Template:
          </span>
          {[
            { id: "harvard", name: "1. Harvard Style (ATS)" },
            { id: "modern", name: "2. Modern Minimal" },
            { id: "google", name: "3. Google Clean" },
            { id: "executive", name: "4. Executive" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTemplate(t.id as ResumeTemplateId)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTemplate === t.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAIRewrite}
            disabled={isRewriting}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md transition flex items-center gap-1.5"
          >
            {isRewriting ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            AI Rewrite
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" /> Export PDF
          </button>

          <button
            onClick={handleExportDOCX}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" /> Export DOCX
          </button>
        </div>
      </div>

      {exportSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold text-center animate-fade-in">
          ✅ {exportSuccess}
        </div>
      )}

      {/* Main Split Layout: Editor Form (Left) vs Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form Panel */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          {/* Editor Sub-tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/80 p-1.5 overflow-x-auto gap-1">
            {[
              { id: "contact", label: "Contact", icon: User },
              { id: "summary", label: "Summary", icon: FileText },
              { id: "experience", label: "Experience", icon: Briefcase },
              { id: "projects", label: "Projects", icon: FolderKanban },
              { id: "skills", label: "Skills", icon: Wrench },
              { id: "education", label: "Edu", icon: GraduationCap },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveEditorTab(tab.id as any)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition ${
                    activeEditorTab === tab.id ? "bg-white text-indigo-700 shadow" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-5 max-h-[700px] overflow-y-auto space-y-4">
            {/* Contact Tab */}
            {activeEditorTab === "contact" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resumeData.contact.name}
                    onChange={(e) => updateContact("name", e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Role Title</label>
                  <input
                    type="text"
                    value={resumeData.contact.title}
                    onChange={(e) => updateContact("title", e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email</label>
                    <input
                      type="text"
                      value={resumeData.contact.email}
                      onChange={(e) => updateContact("email", e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone</label>
                    <input
                      type="text"
                      value={resumeData.contact.phone}
                      onChange={(e) => updateContact("phone", e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Location</label>
                  <input
                    type="text"
                    value={resumeData.contact.location}
                    onChange={(e) => updateContact("location", e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={resumeData.contact.linkedin}
                    onChange={(e) => updateContact("linkedin", e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">GitHub / Portfolio</label>
                  <input
                    type="text"
                    value={resumeData.contact.github}
                    onChange={(e) => updateContact("github", e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Summary Tab */}
            {activeEditorTab === "summary" && (
              <div className="space-y-3 text-xs">
                <label className="font-bold text-slate-700 block">Professional Summary</label>
                <textarea
                  rows={6}
                  value={resumeData.summary}
                  onChange={(e) => setResumeData((prev) => ({ ...prev, summary: e.target.value }))}
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
                />
              </div>
            )}

            {/* Experience Tab */}
            {activeEditorTab === "experience" && (
              <div className="space-y-5 text-xs">
                {resumeData.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative">
                    <button
                      onClick={() => removeExperienceItem(idx)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <div>
                        <label className="font-semibold block mb-0.5">Role Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(idx, "role", e.target.value)}
                          className="w-full p-2 border rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-0.5">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, "company", e.target.value)}
                          className="w-full p-2 border rounded bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold block mb-0.5">Bullet Points (one per line)</label>
                      <textarea
                        rows={4}
                        value={exp.bullets.join("\n")}
                        onChange={(e) => updateExperience(idx, "bullets", e.target.value.split("\n"))}
                        className="w-full p-2 border rounded bg-white text-xs"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={addExperienceItem}
                  className="w-full py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-xl border border-indigo-200 hover:bg-indigo-100 transition flex items-center justify-center gap-1.5 text-xs"
                >
                  <Plus className="w-4 h-4" /> Add Experience Position
                </button>
              </div>
            )}

            {/* Skills Tab */}
            {activeEditorTab === "skills" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hard & Technical Skills (comma separated)</label>
                  <textarea
                    rows={3}
                    value={resumeData.skills?.hardSkills?.join(", ") || ""}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: { ...prev.skills, hardSkills: e.target.value.split(",").map((s) => s.trim()) },
                      }))
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Soft & Leadership Skills (comma separated)</label>
                  <textarea
                    rows={2}
                    value={resumeData.skills?.softSkills?.join(", ") || ""}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        skills: { ...prev.skills, softSkills: e.target.value.split(",").map((s) => s.trim()) },
                      }))
                    }
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            )}

            {/* Projects & Education Tabs fallback */}
            {(activeEditorTab === "projects" || activeEditorTab === "education") && (
              <div className="p-4 text-center text-slate-500 text-xs">
                Use the full AI Rewrite button at the top to auto-tune all sections seamlessly!
              </div>
            )}
          </div>
        </div>

        {/* Live Resume Preview Container (Right) */}
        <div className="lg:col-span-7 bg-slate-900/90 p-4 md:p-8 rounded-2xl shadow-xl border border-slate-800 flex justify-center overflow-x-auto min-h-[750px]">
          <div className="w-full">
            {activeTemplate === "harvard" && <HarvardTemplate data={resumeData} />}
            {activeTemplate === "modern" && <ModernTemplate data={resumeData} />}
            {activeTemplate === "google" && <GoogleTemplate data={resumeData} />}
            {activeTemplate === "executive" && <ExecutiveTemplate data={resumeData} />}
          </div>
        </div>
      </div>
    </div>
  );
};
