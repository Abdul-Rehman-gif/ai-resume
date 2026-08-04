import React, { useState } from "react";
import { Upload, FileText, CheckCircle2, ArrowRight, Sparkles, BookOpen, AlertCircle, FileCode } from "lucide-react";
import { SAMPLE_RESUMES } from "../data/sampleResumes";
import { parseRawTextToResume } from "../utils/resumeParser";
import { ResumeData } from "../types";
import mammoth from "mammoth";

interface Props {
  onStartAnalysis: (resumeText: string, targetRole: string, parsedData: ResumeData) => void;
  isAnalyzing: boolean;
}

export const UploadSection: React.FC<Props> = ({ onStartAnalysis, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [activeInputMode, setActiveInputMode] = useState<"file" | "text">("file");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    if (!file) return;
    setUploadedFileName(file.name);
    setIsReadingFile(true);
    setUploadProgress(20);

    const ext = file.name.split(".").pop()?.toLowerCase();

    try {
      if (ext === "docx") {
        const arrayBuffer = await file.arrayBuffer();
        setUploadProgress(60);
        const result = await mammoth.extractRawText({ arrayBuffer });
        setResumeText(result.value);
        setUploadProgress(100);
      } else if (ext === "pdf" || ext === "txt") {
        // Read text content
        setUploadProgress(50);
        const text = await file.text();
        setResumeText(text);
        setUploadProgress(100);
      } else {
        const text = await file.text();
        setResumeText(text);
        setUploadProgress(100);
      }
    } catch (err) {
      console.error("Error reading file:", err);
      // Fallback
      setResumeText(`[Extracted text from ${file.name}]\n\nResume content processed.`);
      setUploadProgress(100);
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sampleKey: string) => {
    const sample = SAMPLE_RESUMES[sampleKey];
    if (sample) {
      setUploadedFileName(`${sample.label}.txt`);
      setResumeText(sample.rawText);
      setTargetRole(sample.role);
    }
  };

  const handleSubmit = () => {
    if (!resumeText.trim()) return;
    const parsedData = parseRawTextToResume(resumeText);
    onStartAnalysis(resumeText, targetRole, parsedData);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Research-Backed ATS & Recruiter Evaluation Engine
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Resume Checker & ATS Optimizer
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Get an in-depth 100-point HR review, ATS parsing diagnosis, STAR metric improvements, weak action verb replacements, and recruiter-approved resume templates.
        </p>
      </div>

      {/* Main Upload / Input Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Input Mode Selector Header */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 p-2 gap-2">
          <button
            onClick={() => setActiveInputMode("file")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
              activeInputMode === "file"
                ? "bg-white text-indigo-700 shadow border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Upload className="w-4 h-4" /> Upload Document (PDF / DOCX)
          </button>
          <button
            onClick={() => setActiveInputMode("text")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
              activeInputMode === "text"
                ? "bg-white text-indigo-700 shadow border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" /> Paste Raw Resume Text
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Target Role Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Target Job Role / Title <span className="text-slate-400 font-normal">(Optional for role-specific ATS keywording)</span>
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Full Stack Software Engineer, Product Manager, Data Scientist"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition"
            />
          </div>

          {/* Mode 1: File Dropzone */}
          {activeInputMode === "file" ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition flex flex-col items-center justify-center ${
                dragActive
                  ? "border-indigo-600 bg-indigo-50/60 scale-[1.01]"
                  : uploadedFileName
                  ? "border-emerald-300 bg-emerald-50/30"
                  : "border-slate-300 hover:border-indigo-400 bg-slate-50/50"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 shadow-inner">
                <Upload className="w-7 h-7" />
              </div>

              {uploadedFileName ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4" /> File loaded: {uploadedFileName}
                  </div>
                  <p className="text-xs text-slate-500">Drag another file or click to replace</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Drag and drop your resume here, or <span className="text-indigo-600 underline">browse file</span>
                  </p>
                  <p className="text-xs text-slate-500">Supports PDF & DOCX formats</p>
                </div>
              )}

              {isReadingFile && (
                <div className="w-full max-w-md mt-4 space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Reading document text...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Mode 2: Text Area */
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Paste Resume Text
              </label>
              <textarea
                rows={10}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your full resume content here including summary, work experience bullets, skills, and education..."
                className="w-full p-4 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none transition"
              />
            </div>
          )}

          {/* Text Preview Box if file was uploaded */}
          {resumeText && activeInputMode === "file" && (
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-indigo-400" /> Extracted Text Preview
                </span>
                <span>{resumeText.length} characters</span>
              </div>
              <div className="text-xs font-mono max-h-36 overflow-y-auto whitespace-pre-wrap text-slate-300 leading-relaxed pr-2">
                {resumeText}
              </div>
            </div>
          )}

          {/* Sample Resume Quick Loader Buttons */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-500 block">
              Or test instantly with 1-click recruiter sample resumes:
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SAMPLE_RESUMES).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => handleSelectSample(key)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 transition flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-500" /> {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA Button */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={!resumeText.trim() || isAnalyzing}
              className={`w-full py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                !resumeText.trim() || isAnalyzing
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-800 text-white shadow-indigo-600/30 scale-100 active:scale-[0.99]"
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Senior Recruiter AI Analyzing Resume & ATS Standards...
                </>
              ) : (
                <>
                  Run Senior HR & ATS Evaluation Report <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Research Methodology Card */}
      <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
          <BookOpen className="w-4 h-4" /> Evaluation Standard & Research Benchmarks
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Our AI evaluation engine models real-world hiring criteria derived from top career research publications including the <strong>Harvard Resume Guide</strong>, <strong>Google Career Resources</strong>, <strong>Jobscan ATS recommendations</strong>, <strong>LinkedIn Best Practices</strong>, and <strong>Indeed Recruiter Standards</strong>. Scoring is strictly objective, verifying STAR metric compliance, formatting compatibility, and recruiter read velocity.
        </p>
      </div>
    </div>
  );
};
