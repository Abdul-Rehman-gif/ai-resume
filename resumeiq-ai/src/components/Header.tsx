import React from "react";
import { FileCheck2, LayoutDashboard, FileEdit, MessageSquareText, Sparkles, Upload, LogOut, User, Zap } from "lucide-react";
import { UserProfile } from "../types";

interface Props {
  activeTab: "upload" | "dashboard" | "builder";
  setActiveTab: (tab: "upload" | "dashboard" | "builder") => void;
  onOpenChat: () => void;
  hasReport: boolean;
  user: UserProfile | null;
  onLogout: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onOpenChat,
  hasReport,
  user,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white px-4 lg:px-8 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                ResumeIQ <span className="text-indigo-400">AI</span>
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-300" /> ATS Recruiter Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Harvard & Google Standard Resume Audit & Builder</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "upload"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-indigo-300" /> Upload & Analyze
          </button>

          <button
            onClick={() => setActiveTab("dashboard")}
            disabled={!hasReport}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow"
                : hasReport
                ? "text-slate-300 hover:text-white hover:bg-slate-700/50"
                : "text-slate-500 cursor-not-allowed opacity-60"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Audit Dashboard
            {hasReport && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
          </button>

          <button
            onClick={() => setActiveTab("builder")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "builder"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" /> Builder & Templates
          </button>
        </nav>

        {/* User Profile & Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-xl transition shadow-md shadow-indigo-600/20"
          >
            <MessageSquareText className="w-3.5 h-3.5" /> AI Chat
          </button>

          {/* User Profile Badge */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-800/90 pl-1.5 pr-2.5 py-1 rounded-xl border border-slate-700">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-indigo-500"
              />
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-white leading-none">{user.name}</span>
                  {user.isPro && (
                    <span className="bg-indigo-600 text-white text-[9px] font-black px-1 rounded">PRO</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono block leading-tight">
                  <Zap className="w-2.5 h-2.5 inline text-amber-400 mr-0.5" />
                  {user.credits} Credits
                </span>
              </div>

              <button
                onClick={onLogout}
                title="Log out of account"
                className="ml-1 p-1 hover:bg-slate-700 text-slate-400 hover:text-red-400 rounded-lg transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-3 py-1.5 rounded-xl transition"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
