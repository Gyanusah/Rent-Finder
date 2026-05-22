

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OTPVerification from "../components/OTPVerification";

// ─── Password strength helper ────────────────────────────────────────────────
const getPasswordStrength = (password) => {
  const tests = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const score = Object.values(tests).filter(Boolean).length;
  const levels = [
    {
      label: "Too weak",
      color: "bg-red-500",
      textColor: "text-red-500",
      width: "w-1/5",
    },
    {
      label: "Weak",
      color: "bg-orange-500",
      textColor: "text-orange-500",
      width: "w-2/5",
    },
    {
      label: "Fair",
      color: "bg-amber-400",
      textColor: "text-amber-500",
      width: "w-3/5",
    },
    {
      label: "Strong",
      color: "bg-emerald-400",
      textColor: "text-emerald-500",
      width: "w-4/5",
    },
    {
      label: "Very strong",
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
      width: "w-full",
    },
  ];
  return { tests, score, ...(levels[Math.max(0, score - 1)] ?? levels[0]) };
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) =>
  open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5"
    >
      <path
        d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.39 1 11.5a10.97 10.97 0 0 1 5.06-6.44M9.9 4.24A9.12 9.12 0 0 1 12 4c5 0 9.27 3.61 11 8.5a10.94 10.94 0 0 1-4.12 5.36M3 3l18 18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5"
    >
      <path
        d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    className="w-3.5 h-3.5"
  >
    <polyline
      points="20 6 9 17 4 12"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Field wrapper ────────────────────────────────────────────────────────────
const Field = ({ label, required, hint, children }) => (
  <div className="group">
    <label className="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2 transition-colors group-focus-within:text-indigo-400">
      {label} {required && <span className="text-rose-400 not-italic">*</span>}
    </label>
    {children}
    {hint && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
  </div>
);

const inputCls =
  "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm " +
  "focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 " +
  "transition-all duration-200 hover:border-slate-600";

// ─── Main component ───────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "tenant",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [step, setStep] = useState(1); // 1 = personal, 2 = security

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleStep1 = (e) => {
    e.preventDefault();
    setError("");
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all fields");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!formData.password) {
      setError("Please enter a password");
      return;
    }
    setShowOTP(true);
  };

  const handleOTPVerified = async () => {
    setError("");
    setLoading(true);
    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role,
      formData.phone,
    );
    setLoading(false);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
      setShowOTP(false);
    }
  };

  const requirementItems = [
    { key: "length", label: "At least 12 characters" },
    { key: "uppercase", label: "One uppercase letter" },
    { key: "lowercase", label: "One lowercase letter" },
    { key: "number", label: "One number" },
    { key: "special", label: "One special character" },
  ];

  if (showOTP) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4">
        <OTPVerification
          email={formData.email}
          phone={formData.phone}
          type="both"
          onVerified={handleOTPVerified}
          onBack={() => setShowOTP(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* ── Ambient glows ──────────────────────────────────────── */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative w-full max-w-md">
        {/* ── Logo / brand ───────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white"
              >
                <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              RentFinder
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Create your account
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Join thousands finding their perfect home
          </p>
        </div>

        {/* ── Step indicator ─────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8 px-1">
          {[1, 2].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step >= s
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                      : "bg-slate-800 text-slate-500 border border-slate-700"
                  }`}
                >
                  {step > s ? <CheckIcon /> : s}
                </div>
                <span
                  className={`text-xs font-medium transition-colors ${step >= s ? "text-slate-300" : "text-slate-600"}`}
                >
                  {s === 1 ? "Personal Info" : "Security"}
                </span>
              </div>
              {s < 2 && (
                <div
                  className={`flex-1 h-px transition-all duration-500 ${step > s ? "bg-indigo-500" : "bg-slate-800"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Card ───────────────────────────────────────────────── */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-7 shadow-2xl shadow-black/40">
          {error && (
            <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl px-4 py-3 mb-6 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4 mt-0.5 shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-5">
              <Field label="Full name" required>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoFocus
                  className={inputCls}
                  placeholder="John Doe"
                />
              </Field>

              <Field label="Email address" required>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputCls}
                  placeholder="you@example.com"
                />
              </Field>

              <Field
                label="Phone"
                required
                hint="A one-time code will be sent to verify your number"
              >
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-xl px-3 text-slate-400 text-sm shrink-0">
                    🇳🇵 +977
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={inputCls}
                    placeholder="98XXXXXXXX"
                    maxLength={10}
                  />
                </div>
              </Field>

              <Field label="I am a">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "tenant",
                      icon: "🔍",
                      label: "Tenant",
                      desc: "Looking for a property",
                    },
                    {
                      value: "owner",
                      icon: "🏠",
                      label: "Owner",
                      desc: "Listing my property",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({ ...p, role: opt.value }))
                      }
                      className={`text-left rounded-xl border p-3.5 transition-all duration-200 cursor-pointer ${
                        formData.role === opt.value
                          ? "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20"
                          : "border-slate-700 bg-slate-800/40 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <p
                        className={`text-sm font-semibold mt-1.5 ${formData.role === opt.value ? "text-indigo-300" : "text-slate-300"}`}
                      >
                        {opt.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </Field>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-3 rounded-xl font-semibold text-sm tracking-wide hover:from-indigo-400 hover:to-violet-500 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 mt-2"
              >
                Continue →
              </button>
            </form>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Password" required>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoFocus
                    className={inputCls + " pr-11"}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute inset-y-0 right-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <EyeIcon open={showPw} />
                  </button>
                </div>

                {/* Strength bar */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : "bg-slate-700"}`}
                          />
                        ))}
                      </div>
                      <span
                        className={`ml-3 text-xs font-semibold ${strength.textColor}`}
                      >
                        {strength.label}
                      </span>
                    </div>
                  </div>
                )}
              </Field>

              {/* Requirements checklist */}
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Password requirements
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {requirementItems.map(({ key, label }) => {
                    const met = strength.tests[key];
                    return (
                      <div key={key} className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                            met
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-700 border border-slate-600"
                          }`}
                        >
                          {met && <CheckIcon />}
                        </div>
                        <span
                          className={`text-xs transition-colors ${met ? "text-slate-300" : "text-slate-500"}`}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 py-3 rounded-xl font-semibold text-sm hover:bg-slate-700 hover:text-white transition-all duration-200"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading || strength.score < 3}
                  className="flex-[2] bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-3 rounded-xl font-semibold text-sm tracking-wide hover:from-indigo-400 hover:to-violet-500 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                      Creating…
                    </span>
                  ) : (
                    "Verify & Create Account"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center text-slate-600 text-xs mt-4">
          By signing up, you agree to our{" "}
          <span className="text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">
            Terms
          </span>{" "}
          and{" "}
          <span className="text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">
            Privacy Policy
          </span>
        </p>
      </div>
    </div>
  );
}
