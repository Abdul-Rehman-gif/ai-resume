import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { UploadSection } from "./components/UploadSection";
import { DashboardView } from "./components/DashboardView";
import { ResumeBuilderView } from "./components/ResumeBuilderView";
import { AIChatModal } from "./components/AIChatModal";
import { ClientLoginView } from "./components/ClientLoginView";
import { ResumeData, ResumeAnalysisReport, UserProfile } from "./types";
import { SAMPLE_RESUMES } from "./data/sampleResumes";

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("resume_iq_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<"upload" | "dashboard" | "builder">("upload");
  const [resumeText, setResumeText] = useState<string>(SAMPLE_RESUMES.software_engineer.rawText);
  const [targetRole, setTargetRole] = useState<string>("Senior Full Stack Software Engineer");
  const [resumeData, setResumeData] = useState<ResumeData>(SAMPLE_RESUMES.software_engineer.data);
  const [analysisReport, setAnalysisReport] = useState<ResumeAnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("resume_iq_user", JSON.stringify(user));
    } catch (err) {
      console.error("Storage error:", err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("resume_iq_user");
    } catch (err) {
      console.error("Storage error:", err);
    }
  };

  // Trigger Gemini AI Resume Analysis
  const handleStartAnalysis = async (text: string, role: string, parsedData: ResumeData) => {
    setResumeText(text);
    setTargetRole(role);
    setResumeData(parsedData);
    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: text,
          targetJobTitle: role,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const report: ResumeAnalysisReport = await res.json();
      setAnalysisReport(report);
      setActiveTab("dashboard");
    } catch (err) {
      console.error("Analysis error:", err);
      alert("Failed to complete AI analysis. Please verify server connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // If user is not logged in, show the Client Login Section first
  if (!currentUser) {
    return <ClientLoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenChat={() => setIsChatOpen(true)}
        hasReport={!!analysisReport}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === "upload" && (
          <UploadSection onStartAnalysis={handleStartAnalysis} isAnalyzing={isAnalyzing} />
        )}

        {activeTab === "dashboard" && analysisReport && (
          <DashboardView
            report={analysisReport}
            onOpenBuilder={() => setActiveTab("builder")}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {activeTab === "builder" && (
          <ResumeBuilderView
            resumeData={resumeData}
            setResumeData={setResumeData}
            targetRole={targetRole}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} ResumeIQ AI — Built with Harvard & Google Career Research Benchmarks.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>ATS Compliant Engine</span>
            <span>•</span>
            <span>PDF & DOCX Builder</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Recruiter Chat Drawer */}
      <AIChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        resumeText={resumeText}
        report={analysisReport}
      />
    </div>
  );
}
