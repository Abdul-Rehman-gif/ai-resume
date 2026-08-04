import React, { useState } from "react";
import { ResumeAnalysisReport } from "../types";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import {
  Award,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Zap,
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
  FileSearch,
  BookOpen,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Props {
  report: ResumeAnalysisReport;
  onOpenBuilder: () => void;
  onOpenChat: () => void;
}

export const DashboardView: React.FC<Props> = ({ report, onOpenBuilder, onOpenChat }) => {
  const [activeTab, setActiveTab] = useState<"top20" | "redflags" | "starVerbs" | "categories" | "industry">("top20");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("experience");

  // Prepare radar chart data
  const radarData = [
    { subject: "Summary", score: report.categories?.summary?.score || 70 },
    { subject: "Contact", score: report.categories?.contactInfo?.score || 85 },
    { subject: "Skills", score: report.categories?.skills?.score || 75 },
    { subject: "Experience", score: report.categories?.experience?.score || 65 },
    { subject: "Projects", score: report.categories?.projects?.score || 70 },
    { subject: "Formatting", score: report.categories?.formatting?.score || 80 },
    { subject: "Grammar", score: report.categories?.grammar?.score || 85 },
    { subject: "ATS Scan", score: report.atsScore || 75 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 55) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "bg-emerald-600 text-white shadow-emerald-600/30";
      case "B+":
      case "B":
        return "bg-blue-600 text-white shadow-blue-600/30";
      case "C":
        return "bg-amber-600 text-white shadow-amber-600/30";
      default:
        return "bg-red-600 text-white shadow-red-600/30";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-md border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Audit Target Role
            </span>
            <span className="text-sm font-semibold text-slate-800">{report.targetRoleDetected || "General Professional"}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">HR & ATS Resume Evaluation Report</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenChat}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" /> Ask AI Assistant
          </button>
          <button
            onClick={onOpenBuilder}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
          >
            <Zap className="w-4 h-4" /> Rewrite & Format in Builder
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Overall Score */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Score</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${getGradeBadge(report.letterGrade)}`}>
              Grade {report.letterGrade}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">{report.overallScore}</span>
            <span className="text-sm text-slate-400 font-semibold">/ 100</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-blue-600 h-full transition-all duration-500"
              style={{ width: `${report.overallScore}%` }}
            ></div>
          </div>
        </div>

        {/* ATS Compatibility */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">ATS Pass Rate</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Risk: {report.atsBreakdown?.parsingRisk || "Low"}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">{report.atsScore}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${report.atsScore}%` }}
            ></div>
          </div>
        </div>

        {/* Recruiter Scan Velocity */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Recruiter Scan Time</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">
              {report.categories?.recruiterReadability?.estimatedReadTimeSeconds || 18}s
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">
            First Impression: <strong className="text-slate-800">{report.categories?.recruiterReadability?.firstImpressionScore || 8.5}/10</strong>
          </p>
        </div>

        {/* Grammar & Readability */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Readability & Grammar</span>
            <FileCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">
              {report.categories?.grammar?.score || 85}%
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">
            Passive voice: <strong className="text-slate-800">{report.categories?.grammar?.passiveVoiceInstances?.length || 0} instances</strong>
          </p>
        </div>
      </div>

      {/* Main Analysis Visuals: Radar Chart & ATS Diagnostic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart Card */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-md border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" /> Recruiter Evaluation Radar
              </h2>
              <p className="text-xs text-slate-500">Multidimensional score balance across 8 key hiring dimensions</p>
            </div>
          </div>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Radar name="Candidate Score" dataKey="score" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ATS Diagnostic Box */}
        <div className="lg:col-span-5 bg-slate-900 text-slate-200 p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-1">
              <ShieldCheck className="w-5 h-5 text-indigo-400" /> ATS Parser Compatibility Audit
            </div>
            <p className="text-xs text-slate-400">
              Automated Applicant Tracking Systems (Workday, Greenhouse, Taleo) strip graphic layers and non-standard tables.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
              <span className="font-semibold text-slate-200 block">Parsing Risk Level: {report.atsBreakdown?.parsingRisk || "Low"}</span>
              <p className="text-slate-400">{report.atsBreakdown?.formattingIssues?.[0] || "No major formatting blocks found."}</p>
            </div>

            {report.atsBreakdown?.tableWarnings?.length > 0 && (
              <div className="flex items-start gap-2 text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/50">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{report.atsBreakdown.tableWarnings[0]}</span>
              </div>
            )}

            {report.atsBreakdown?.columnWarnings?.length > 0 && (
              <div className="flex items-start gap-2 text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/50">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{report.atsBreakdown.columnWarnings[0]}</span>
              </div>
            )}
          </div>

          <button
            onClick={onOpenBuilder}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center justify-center gap-2"
          >
            Apply Harvard / Google ATS Template <Zap className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Tabs for Detailed Analysis */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 overflow-x-auto p-2 gap-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("top20")}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === "top20" ? "bg-white text-indigo-700 shadow border border-slate-200" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Zap className="w-4 h-4 text-indigo-600" /> Top Action Improvements ({report.top20Improvements?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("redflags")}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === "redflags" ? "bg-white text-indigo-700 shadow border border-slate-200" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Red Flags & Career Gaps ({report.redFlags?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("starVerbs")}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === "starVerbs" ? "bg-white text-indigo-700 shadow border border-slate-200" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Action Verbs & STAR Metrics
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === "categories" ? "bg-white text-indigo-700 shadow border border-slate-200" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileSearch className="w-4 h-4 text-blue-600" /> Section-by-Section Audit
          </button>

          <button
            onClick={() => setActiveTab("industry")}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === "industry" ? "bg-white text-indigo-700 shadow border border-slate-200" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-600" /> Industry & Keywords
          </button>
        </div>

        {/* Tab 1: Top 20 Priority Improvements */}
        {activeTab === "top20" && (
          <div className="p-6 md:p-8 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Ranked Priorities for Recruiter & ATS Impact</h3>
            <div className="space-y-3">
              {report.top20Improvements?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                      #{item.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">{item.title}</span>
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{item.actionItem}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0 border ${
                      item.impact === "High"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : item.impact === "Medium"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {item.impact} Impact
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Red Flags & Career Gaps */}
        {activeTab === "redflags" && (
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Identified Red Flags ({report.redFlags?.length || 0})
              </h3>
              {report.redFlags?.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No major recruiter red flags detected in this resume!
                </div>
              ) : (
                <div className="space-y-3">
                  {report.redFlags?.map((flag, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-red-50/60 border border-red-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-red-900">{flag.title}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-200 text-red-800">
                          {flag.severity} Severity
                        </span>
                      </div>
                      <p className="text-xs text-slate-700">{flag.description}</p>
                      <div className="bg-white p-2.5 rounded-lg text-xs text-slate-800 border border-red-100 font-medium">
                        💡 <strong>Fix Advice:</strong> {flag.fixAdvice}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" /> Career Gaps & Timeline Continuity
              </h3>
              {report.careerGaps?.length === 0 ? (
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  No unexplained employment gaps detected in work history.
                </p>
              ) : (
                <div className="space-y-3">
                  {report.careerGaps?.map((gap, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-amber-900">
                        <span>Gap Period: {gap.period}</span>
                        <span>Concern: {gap.concernLevel}</span>
                      </div>
                      <p className="text-slate-700">{gap.explanation}</p>
                      <p className="text-amber-800 font-medium pt-1">Strategy: {gap.mitigationStrategy}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Action Verbs & Achievement Detection */}
        {activeTab === "starVerbs" && (
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Weak Action Verbs Replacements</h3>
              <p className="text-xs text-slate-500 mb-4">
                Recruiters heavily penalize passive words like "Worked", "Responsible for", "Helped". Replace them with action-oriented leadership verbs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.weakActionVerbs?.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-bold bg-red-100/60 px-2 py-0.5 rounded">
                        "{item.originalWord}"
                      </span>
                      <span className="text-slate-400 font-medium">replace with →</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.recommendedAlternatives?.map((alt, i) => (
                        <span key={i} className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                          {alt}
                        </span>
                      ))}
                    </div>
                    {item.context && <p className="text-[11px] text-slate-500 italic mt-1">Context: "{item.context}"</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Quantifiable Metric Bullet Upgrades</h3>
              <p className="text-xs text-slate-500 mb-4">
                Transform passive statements into STAR (Situation, Task, Action, Result) accomplishments with measurable metrics.
              </p>
              <div className="space-y-3">
                {report.achievementImprovements?.map((ach, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="text-slate-500 strike-through">
                      ❌ <strong>Original:</strong> "{ach.originalBullet}"
                    </div>
                    <div className="text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                      ✅ <strong>STAR Suggestion:</strong> "{ach.quantifiedSuggestion}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Section-by-Section Categories */}
        {activeTab === "categories" && (
          <div className="p-6 md:p-8 space-y-4">
            {Object.entries(report.categories || {}).map(([key, cat]: [string, any]) => {
              const isExpanded = expandedCategory === key;
              return (
                <div key={key} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : key)}
                    className="w-full p-4 flex items-center justify-between bg-slate-50/60 hover:bg-slate-100/80 transition text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getScoreColor(cat.score || 70)}`}>
                        {cat.score || 70}/100
                      </span>
                      <span className="font-bold text-sm text-slate-900 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium hidden sm:inline">{cat.status}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-200 space-y-3 text-xs text-slate-700 bg-white">
                      <p className="leading-relaxed">{cat.feedback}</p>

                      {/* Extra Category Details */}
                      {cat.hardSkillsFound && (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <div>
                            <strong className="text-slate-900">Hard Skills Detected: </strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {cat.hardSkillsFound.map((s: string, i: number) => (
                                <span key={i} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          {cat.missingEssentialSkills?.length > 0 && (
                            <div>
                              <strong className="text-amber-800">Missing Key Skills for Role: </strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {cat.missingEssentialSkills.map((s: string, i: number) => (
                                  <span key={i} className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px] font-medium">
                                    + {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {cat.checkList && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                          {cat.checkList.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-1.5">
                              {item.present ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                              )}
                              <span className={item.present ? "text-slate-800 font-medium" : "text-slate-400"}>
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 5: Industry & Keywords */}
        {activeTab === "industry" && (
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Industry-Specific Advice for {report.industrySpecificAdvice?.targetRole}</h3>
              <ul className="list-disc list-outside ml-5 text-xs text-slate-700 space-y-1.5">
                {report.industrySpecificAdvice?.adviceList?.map((advice, i) => (
                  <li key={i}>{advice}</li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-2">High-Frequency Keywords for ATS Matching</h3>
              <div className="flex flex-wrap gap-1.5">
                {report.industrySpecificAdvice?.specializedKeywords?.map((kw, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium px-2.5 py-1 rounded-lg text-xs">
                    🏷️ {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
