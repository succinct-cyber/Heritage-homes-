import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { fetchMe, login, register } from "../api/endpoints.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignIn() {
  const [tab, setTab] = useState("login"); // login | register
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "login") {
        const data = await login(form.email, form.password);
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        const userData = await fetchMe();
        setAuthUser(data, userData);
      } else {
        const data = await register(form.fullName, form.email, form.password);
        setAuthUser(data, data.user);
      }
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.detail || "Something went wrong. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual panel */}
      <div
        className="relative hidden lg:flex flex-col justify-between p-10 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,20,35,0.55), rgba(10,20,35,0.75)), url('https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <Link to="/" className="font-serif text-2xl font-bold text-white">Heritage Estates</Link>
        <div>
          <h1 className="font-serif text-5xl font-bold text-white leading-tight">
            Welcome Back to Heritage Estates
          </h1>
          <p className="text-white/85 mt-4 max-w-md text-sm">
            Access your premium portfolio and discover exclusive Nigerian real estate
            opportunities designed for comfort, security, and elegance.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-cream">
        <div className="w-full max-w-sm">
          <Link to="/" className="font-serif text-2xl font-bold text-charcoal lg:hidden mb-8 block">
            Heritage Estates
          </Link>

          <div className="flex border-b border-charcoal/10">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest2 ${
                tab === "login" ? "border-b-2 border-green text-charcoal font-semibold" : "text-muted"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setTab("register")}
              className={`flex-1 pb-3 text-xs uppercase tracking-widest2 ${
                tab === "register" ? "border-b-2 border-green text-charcoal font-semibold" : "text-muted"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {tab === "register" && (
              <div>
                <label className="text-xs uppercase tracking-widest2 text-muted">Full Name</label>
                <div className="relative mt-2">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    required
                    className="input-field pl-11"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs uppercase tracking-widest2 text-muted">Email or Phone</label>
              <div className="relative mt-2">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  required
                  type="email"
                  className="input-field pl-11"
                  placeholder="Enter your email or phone number"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-widest2 text-muted">Password</label>
                {tab === "login" && (
                  <button type="button" className="text-xs text-muted hover:text-charcoal">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative mt-2">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  className="input-field pl-11 pr-11"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <span className="flex-1 h-px bg-charcoal/10" />
            <span className="text-[11px] uppercase tracking-widest2 text-muted">Or continue with</span>
            <span className="flex-1 h-px bg-charcoal/10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="btn-outline">Google</button>
            <button className="btn-outline">Apple</button>
          </div>
        </div>
      </div>
    </div>
  );
}
