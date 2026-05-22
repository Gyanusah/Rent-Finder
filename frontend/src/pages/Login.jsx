

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       console.debug("Login submit", formData);
//       const result = await login(formData.email, formData.password);
//       setLoading(false);

//       if (result && result.success) {
//         navigate("/");
//       } else {
//         const msg = result?.message || "Login failed";
//         console.warn("Login failed:", msg, result);
//         setError(msg);
//       }
//     } catch (err) {
//       console.error("Login error", err);
//       setLoading(false);
//       setError(err?.message || "An unexpected error occurred");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
//       <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
//           Welcome Back
//         </h1>
//         <p className="text-center text-gray-600 mb-8">
//           Sign in to your account
//         </p>

//         {error && (
//           <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-gray-700 font-medium mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               placeholder="you@example.com"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               placeholder="Enter your password"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </button>
//         </form>

//         <p className="text-center text-gray-600 mt-6">
//           Don't have an account?{" "}
//           <Link
//             to="/register"
//             className="text-primary font-semibold hover:underline"
//           >
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EyeIcon = ({ open }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.39 1 11.5a10.97 10.97 0 0 1 5.06-6.44M9.9 4.24A9.12 9.12 0 0 1 12 4c5 0 9.27 3.61 11 8.5a10.94 10.94 0 0 1-4.12 5.36M3 3l18 18" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

const inputCls =
  "w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 text-sm " +
  "focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 " +
  "transition-all duration-200 hover:border-slate-600";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      setLoading(false);
      if (result && result.success) {
        navigate("/");
      } else {
        setError(result?.message || "Login failed");
      }
    } catch (err) {
      setLoading(false);
      setError(err?.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-56 -left-44 w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-44 -right-40 w-[420px] h-[420px] rounded-full bg-violet-600/7 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/2 left-2/3 w-[300px] h-[300px] rounded-full bg-rose-500/5 blur-[100px]" />

      <div className="relative w-full max-w-[400px]">

        {/* Brand */}
        <div className="text-center mb-9">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_4px_18px_rgba(99,102,241,0.45)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-[19px] h-[19px]">
                <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z"/>
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="text-white font-bold text-[18px] tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>RentFinder</span>
          </div>
          <h1 className="text-[30px] font-bold text-white tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome back
          </h1>
          <p className="text-slate-500 mt-2 text-sm">Sign in to continue to your account</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-2xl p-7 shadow-[0_25px_50px_rgba(0,0,0,0.5)]">

          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 mb-5 text-[13px]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-[18px]">

            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-slate-400 mb-2">
                Email address
              </label>
              <input
                className={inputCls} type="email" name="email"
                value={formData.email} onChange={handleChange}
                required autoFocus placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-semibold tracking-[0.08em] uppercase text-slate-400">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[12px] text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  className={inputCls + " pr-11"} type={showPw ? "text" : "password"} name="password"
                  value={formData.password} onChange={handleChange}
                  required placeholder="Enter your password"
                />
                <button
                  type="button" onClick={() => setShowPw((p) => !p)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800/60 text-indigo-500 focus:ring-indigo-500/30 focus:ring-2 accent-indigo-500" />
              <span className="text-[13px] text-slate-500 group-hover:text-slate-400 transition-colors">Keep me signed in</span>
            </label>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white py-3 rounded-xl font-semibold text-sm tracking-wide hover:from-indigo-400 hover:to-violet-500 transition-all duration-200 shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:shadow-[0_8px_24px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Signing in…
                </>
              ) : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[12px] text-slate-600">or continue with</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Social logins */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                label: "Google",
                icon: (
                  <svg viewBox="0 0 24 24" className="w-4 h-4">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                ),
              },
              {
                label: "GitHub",
                icon: (
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.218.682-.484 0-.236-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.157-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.252-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.254-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.394.1 2.646.64.698 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .269.18.579.688.481A10.019 10.019 0 0 0 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                ),
              },
            ].map(({ label, icon }) => (
              <button
                key={label} type="button"
                className="flex items-center justify-center gap-2 bg-slate-800/60 border border-slate-700 rounded-xl py-[11px] text-slate-400 text-[13px] font-medium hover:bg-slate-700/70 hover:border-slate-600 hover:text-slate-200 transition-all duration-200"
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-[13px] mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            Create one free
          </Link>
        </p>
        <p className="text-center text-slate-800 text-[11px] mt-3">
          Protected by 256-bit SSL encryption 🔒
        </p>
      </div>
    </div>
  );
}
