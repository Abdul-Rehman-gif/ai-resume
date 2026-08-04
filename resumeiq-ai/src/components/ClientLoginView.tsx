import React, { useState, useRef } from "react";
import { UserProfile } from "../types";
import {
  Mail,
  Lock,
  User,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Eye,
  EyeOff,
  Zap,
  AlertCircle,
  KeyRound,
  RotateCcw,
  Send,
} from "lucide-react";

interface Props {
  onLoginSuccess: (user: UserProfile) => void;
}

export const ClientLoginView: React.FC<Props> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // OTP Verification State
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Registration & Login Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Handle Digit Change for 6-Digit OTP Box
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance focus to next digit box
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace on OTP inputs
  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste 6-Digit Code
  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const chars = pastedData.split("");
      setOtpDigits(chars);
      otpInputRefs.current[5]?.focus();
    }
  };

  // 1. Submit Registration -> Request OTP
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid work or personal email address.");
      return;
    }
    if (!fullName) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, jobTitle }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Sign up request failed.");
      }

      setOtpEmail(data.email || email);
      setDevOtpCode(data.devOtp || null);
      setOtpDigits(["", "", "", "", "", ""]);
      setIsOtpStep(true);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Submit Login
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage("Please enter your email.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.isPendingOtp) {
          setOtpEmail(data.email || email);
          setDevOtpCode(data.devOtp || null);
          setOtpDigits(["", "", "", "", "", ""]);
          setIsOtpStep(true);
          setErrorMessage("Registration incomplete. Please enter the verification code sent to your email.");
          return;
        }
        throw new Error(data.error || "Invalid credentials.");
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setErrorMessage(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Verify OTP Submit
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const code = otpDigits.join("").trim();
    if (code.length < 6) {
      setErrorMessage("Please enter the full 6-digit verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail, otp: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed.");
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setErrorMessage(err.message || "Verification code is invalid or expired.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Resend OTP
  const handleResendOtp = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend code.");
      }

      setDevOtpCode(data.devOtp || null);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Could not resend code.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google Single Sign-On Demo
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const user: UserProfile = {
        id: `google-${Date.now()}`,
        name: "Sarah Jenkins",
        username: "@sarah_jenkins",
        email: "sarah.jenkins@example.com",
        avatar: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80`,
        roleTitle: "Product Manager",
        company: "Google Client SSO",
        loginMethod: "google",
        isPro: true,
        credits: 100,
        joinedDate: "Aug 2026",
      };
      onLoginSuccess(user);
      setIsLoading(false);
    }, 600);
  };

  // Quick Guest Pass
  const handleGuestAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      const user: UserProfile = {
        id: `guest-${Date.now()}`,
        name: "Alex Morgan",
        username: "@alex_morgan",
        email: "alex.morgan@demo-client.com",
        avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80`,
        roleTitle: "Senior Software Engineer",
        company: "Demo Mode",
        loginMethod: "guest",
        isPro: true,
        credits: 50,
        joinedDate: "Today",
      };
      onLoginSuccess(user);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background Lighting Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Header Navigation */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/20">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              ResumeIQ <span className="text-indigo-400">Client Portal</span>
            </span>
            <span className="text-[10px] text-slate-400 block">
              Enterprise Candidate & Resume Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGuestAuth}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition shadow"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Demo Client Access
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Left Column: Platform Features */}
          <div className="lg:col-span-6 space-y-6 hidden lg:block pr-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" /> Recruiter & ATS Optimization Platform
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
              Client Portal & Candidate <br />
              <span className="bg-gradient-to-r from-indigo-400 via-blue-300 to-indigo-200 bg-clip-text text-transparent">
                Resume Intelligence Engine
              </span>
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed">
              Create an account or sign in to manage your resume evaluations, run ATS parsing diagnostics, access recruiter-approved Harvard & Google templates, and rewrite bullet points using AI.
            </p>

            <div className="space-y-3 pt-2">
              {[
                {
                  title: "Harvard & Google Benchmarks",
                  desc: "Evaluates formatting, white space, and 100-point recruiter readability.",
                },
                {
                  title: "Automated Email Verification",
                  desc: "6-digit OTP email verification for secure account initialization.",
                },
                {
                  title: "Backend User Data Storage",
                  desc: "Securely stores candidate account profiles and password credentials.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit SSL Encrypted Client Authentication</span>
            </div>
          </div>

          {/* Right Column: Auth Form Box */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl space-y-6">
              
              {/* OTP Step View */}
              {isOtpStep ? (
                <div className="space-y-5 animate-fade-in">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center border border-indigo-500/30">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Verify Your Email</h2>
                    <p className="text-xs text-slate-300">
                      We've sent a 6-digit verification code to <br />
                      <strong className="text-indigo-300 font-mono">{otpEmail}</strong>
                    </p>
                  </div>

                  {/* Dev OTP Helper Banner */}
                  {devOtpCode && (
                    <div className="p-3 bg-indigo-950/80 border border-indigo-500/50 rounded-xl text-center space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
                        Verification Code (Sent to Email)
                      </span>
                      <span className="text-lg font-mono font-black text-amber-300 tracking-widest block">
                        {devOtpCode}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        Enter this 6-digit code below to confirm account creation.
                      </p>
                    </div>
                  )}

                  {/* Error Alert */}
                  {errorMessage && (
                    <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* 6-Digit Code Input Form */}
                  <form onSubmit={handleVerifyOtpSubmit} className="space-y-5">
                    <div className="flex justify-center gap-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                          onPaste={handleDigitPaste}
                          className="w-10 h-12 bg-slate-950 border border-slate-700 rounded-xl text-center text-lg font-bold font-mono text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Verify & Complete Registration
                        </>
                      )}
                    </button>
                  </form>

                  {/* Resend & Back controls */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Resend Code
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtpStep(false);
                        setErrorMessage(null);
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      ← Change Email / Back
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Sign In / Register Form */
                <>
                  {/* Form Tab Switcher */}
                  <div className="flex border-b border-slate-800 pb-4">
                    <button
                      onClick={() => {
                        setAuthMode("login");
                        setErrorMessage(null);
                      }}
                      className={`flex-1 pb-2 text-sm font-bold text-center border-b-2 transition ${
                        authMode === "login"
                          ? "border-indigo-500 text-white"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Client Sign In
                    </button>
                    <button
                      onClick={() => {
                        setAuthMode("signup");
                        setErrorMessage(null);
                      }}
                      className={`flex-1 pb-2 text-sm font-bold text-center border-b-2 transition ${
                        authMode === "signup"
                          ? "border-indigo-500 text-white"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Register Account
                    </button>
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-white">
                      {authMode === "login" && "Welcome back to ResumeIQ"}
                      {authMode === "signup" && "Create your Client Account"}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {authMode === "login" && "Enter your credentials to access your saved resume audits"}
                      {authMode === "signup" && "Sign up to receive an OTP verification code on your email"}
                    </p>
                  </div>

                  {/* Error Alert Message */}
                  {errorMessage && (
                    <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-start gap-2 animate-fade-in">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Form */}
                  <form
                    onSubmit={authMode === "login" ? handleSignIn : handleSignUp}
                    className="space-y-4"
                  >
                    {/* Full Name field (Sign Up only) */}
                    {authMode === "signup" && (
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Eleanor Vance"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Field */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Work or Personal Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. client@example.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                          required
                        />
                      </div>
                    </div>

                    {/* Role / Job Title Field (Sign Up only) */}
                    {authMode === "signup" && (
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                          Target Role / Job Title
                        </label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="e.g. Senior Software Engineer / PM"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                          />
                        </div>
                      </div>
                    )}

                    {/* Password Field */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                          Password
                        </label>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {authMode === "signup" && (
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Must be at least 6 characters. Saved securely in backend database.
                        </span>
                      )}
                    </div>

                    {/* Remember Me Checkbox */}
                    {authMode === "login" && (
                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>Remember my login session</span>
                        </label>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-600 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          {authMode === "login" ? "Sign In to Client Portal" : "Send OTP & Register Account"}{" "}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative flex items-center justify-center pt-2">
                    <div className="border-t border-slate-800 w-full"></div>
                    <span className="bg-slate-900 px-3 text-[10px] uppercase font-mono text-slate-500 relative">
                      Or continue with
                    </span>
                  </div>

                  {/* Social / Single Sign-On Options */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleGoogleAuth}
                      className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-2"
                    >
                      <span className="font-black text-blue-400 text-sm">G</span>
                      <span>Google Client</span>
                    </button>

                    <button
                      onClick={handleGuestAuth}
                      className="py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Guest Pass</span>
                    </button>
                  </div>

                  {/* Terms Footer */}
                  <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                    By logging in, you accept ResumeIQ's <span className="underline cursor-pointer">Client Terms</span> and confirm compliance with candidate data privacy policies.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center border-t border-slate-800/80 text-[11px] text-slate-500">
        © {new Date().getFullYear()} ResumeIQ AI — Enterprise Candidate Intelligence Platform. All rights reserved.
      </footer>
    </div>
  );
};
