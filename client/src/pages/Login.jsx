
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Apple,
  Sparkles,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const GOLD = "#D4AF37";

const headline = (text) =>
  text.split("").map((letter, index) => ({
    letter,
    index,
  }));

function AnimatedWord({ text, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.075,
          },
        },
      }}
      aria-label={text}
    >
      {headline(text).map(({ letter, index }) => (
        <motion.span
          key={`${letter}-${index}`}
          className={`inline-block ${
            letter === "!" ? "origin-bottom" : ""
          }`}
          animate={
            letter === "!"
              ? { rotate: [0, 12, -8, 8, -4, 0] }
              : undefined
          }
          transition={
            letter === "!"
              ? {
                  duration: 1.2,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  ease: "easeInOut",
                }
              : undefined
          }
          variants={{
            hidden: {
              opacity: 0,
              y: 24,
              rotateX: -70,
            },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: {
                duration: 0.4,
                ease: "easeOut",
              },
            },
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
}

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [socialNotice, setSocialNotice] = useState("");

  const handleSocialLogin = (provider) => {
    setSocialNotice(
      `${provider} sign-in is coming soon! Please use your email and password for now.`
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSocialNotice("");

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
        setError(data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (!rememberMe) {
        // Keep the existing application storage behavior unchanged.
        // Remember me is currently a UI preference only.
      }

      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/account");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white lg:pt-24">
      <section className="mx-auto flex min-h-screen max-w-[1600px] items-center px-5 pb-8 pt-28 sm:px-8 lg:min-h-[calc(100vh-6rem)] lg:px-12 lg:py-8">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* LEFT: ANIMATED SHOPSPHER BRANDING */}
          <div className="relative flex min-h-[240px] flex-col justify-center overflow-hidden rounded-[28px] border border-white/10 bg-[#0C0C0C] px-6 py-8 sm:px-10 lg:min-h-[500px] lg:border-0 lg:bg-transparent lg:px-0 lg:py-10">
            <div className="pointer-events-none absolute inset-0 lg:inset-y-0 lg:left-[-15%] lg:right-[-8%]">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=85"
                alt="Luxury fashion boutique"
                className="h-full w-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/65 to-[#050505]/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-[#050505]/30" />
            </div>

            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              <div className="mb-5 flex items-center gap-2">
                <Sparkles size={16} color={GOLD} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#D4AF37] sm:text-xs">
                  Your Style. Your World.
                </span>
              </div>

              <div className="overflow-hidden">
                <AnimatedWord
                  text="SHOP"
                  className="text-5xl font-black leading-[0.95] tracking-[0.04em] text-white sm:text-7xl lg:text-8xl xl:text-9xl"
                />
              </div>

              <div className="mt-2 overflow-hidden">
                <AnimatedWord
                  text="SPHER.!"
                  delay={0.4}
                  className="text-5xl font-black leading-[0.95] tracking-[-0.04em] text-[#D4AF37] sm:text-7xl lg:text-8xl xl:text-9xl"
                />
              </div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 100 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                className="mt-7 h-1 rounded-full bg-[#D4AF37]"
              />

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="mt-6 max-w-md text-sm leading-7 text-zinc-300 sm:text-base"
              >
                Discover luxury. Experience the extraordinary.
                Your next favourite find starts here.
              </motion.p>

              <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.3em] text-white/45">
                Luxury commerce · Redefined
              </p>
            </motion.div>
          </div>

          {/* RIGHT: LOGIN FORM */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto w-full max-w-[480px] rounded-[26px] border border-white/10 bg-[#0D0D0D] p-5 shadow-2xl sm:p-8 lg:p-9"
          >
            <div className="mb-6">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
                Welcome Back
              </p>

              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Login to ShopSpher
              </h1>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Access your wishlist, orders and premium shopping
                experience.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Email Address
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-[#080808] px-4 transition focus-within:border-[#D4AF37]/60">
                  <Mail size={18} className="shrink-0 text-[#D4AF37]" />

                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-sm font-semibold"
                >
                  Password
                </label>

                <div className="flex h-12 items-center gap-3 rounded-xl border border-white/10 bg-[#080808] px-4 transition focus-within:border-[#D4AF37]/60">
                  <Lock size={18} className="shrink-0 text-[#D4AF37]" />

                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-zinc-500"
                  />

                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 text-zinc-500 transition hover:text-[#D4AF37]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-zinc-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#D4AF37]"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() => setError("Password reset is not connected yet.")}
                  className="text-[#D4AF37] transition hover:text-white"
                >
                  Forgot Password?
                </button>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#D4AF37] py-3.5 text-sm font-bold text-black transition duration-300 hover:bg-[#E5C454] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] text-sm transition hover:border-[#D4AF37]/50"
              >
                <FcGoogle size={20} />
                Google
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("Apple")}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] text-sm transition hover:border-[#D4AF37]/50"
              >
                <Apple size={18} />
                Apple
              </button>
            </div>

            {socialNotice && (
              <p
                role="status"
                className="mt-4 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-3 text-center text-sm text-[#D4AF37]"
              >
                {socialNotice}
              </p>
            )}

            <p className="mt-5 text-center text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#D4AF37] hover:underline"
              >
                Create Account
              </Link>
            </p>

<div className="mt-5 border-t border-white/10 pt-5 text-center">
  <p className="mb-3 text-xs text-zinc-500">
    Store administrator?
  </p>

  <Link
    to="/admin/login"
    className="inline-flex items-center justify-center rounded-xl border border-[#D4AF37]/40 px-5 py-2.5 text-sm font-semibold text-[#D4AF37] transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/10"
  >
    Admin Login
  </Link>
</div>

          </motion.div>
        </div>
      </section>
    </main>
  );
}
