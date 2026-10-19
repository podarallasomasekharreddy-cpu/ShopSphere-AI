
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

const GOLD = "#D4AF37";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://shopsphere-ai-zwey.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      // Only allow accounts with the admin role.
      if (data.user?.role !== "admin") {
        setError(
          "Access denied. An admin account is required."
        );
        return;
      }

      if (!data.token) {
        setError(
          "Authentication token was not returned by the server."
        );
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/admin", { replace: true });
    } catch (err) {
      console.error("Admin login error:", err);
      setError(
        err.message || "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] px-5 pb-12 pt-32 text-white sm:pt-36 lg:pt-40">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center">
        {/* PAGE HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 w-full max-w-md text-center"
        >
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-3xl font-black text-black shadow-lg"
            style={{
              backgroundColor: GOLD,
              boxShadow: "0 10px 35px rgba(212,175,55,0.15)",
            }}
          >
            S
          </div>

          <p
            className="mt-5 text-xs font-semibold uppercase tracking-[0.35em]"
            style={{ color: GOLD }}
          >
            ShopSpher Luxury Commerce
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            Admin Login
          </h1>

          <p className="mt-3 text-sm text-zinc-400">
            Sign in to manage your store.
          </p>
        </motion.div>

        {/* LOGIN CARD */}
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0D0D0D] p-6 shadow-2xl sm:p-8"
        >
          {/* SECURITY NOTICE */}
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">
            <ShieldCheck
              size={24}
              color={GOLD}
              className="shrink-0"
            />

            <p className="text-sm leading-6 text-zinc-300">
              Restricted access for authorized administrators.
            </p>
          </div>

          {/* EMAIL */}
          <div className="mb-5">
            <label
              htmlFor="admin-email"
              className="mb-2 block text-sm font-semibold"
            >
              Admin Email
            </label>

            <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-[#080808] px-4 transition focus-within:border-[#D4AF37]/60">
              <Mail
                size={18}
                className="shrink-0"
                color={GOLD}
              />

              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mb-5">
            <label
              htmlFor="admin-password"
              className="mb-2 block text-sm font-semibold"
            >
              Password
            </label>

            <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-[#080808] px-4 transition focus-within:border-[#D4AF37]/60">
              <Lock
                size={18}
                className="shrink-0"
                color={GOLD}
              />

              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-zinc-500"
              />

              <button
                type="button"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                className="shrink-0 text-zinc-500 transition hover:text-[#D4AF37]"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-400"
            >
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3.5 text-sm font-bold text-black transition duration-300 hover:bg-[#E5C454] disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: GOLD }}
          >
            {loading ? "Signing In..." : "Sign In to Admin"}
          </button>

          {/* CUSTOMER LOGIN LINK */}
          <div className="mt-6 border-t border-white/10 pt-5 text-center">
            <Link
              to="/login"
              className="text-sm text-zinc-400 transition hover:text-[#D4AF37]"
            >
              Return to Customer Login
            </Link>
          </div>
        </motion.form>

        <p className="mt-6 text-center text-xs text-zinc-600">
          ShopSpher Administration
        </p>
      </div>
    </main>
  );
}
