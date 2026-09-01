import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  Mail,
  Lock,
  Eye,
  Apple,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const GOLD = "#D4AF37";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

     if (data.user.role === "admin") {
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
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 pt-28">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Home</span>

            <ChevronRight size={15} />

            <span style={{ color: GOLD }}>
              Login
            </span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
            <Sparkles
              size={16}
              color={GOLD}
            />

            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Welcome Back
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-black">
            Sign In
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            Continue your premium shopping experience with your
            ShopSpher account.
          </p>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl rounded-[34px] border border-white/10 bg-white/5 p-10 backdrop-blur-2xl"
        >
          <h2 className="text-3xl font-black">
            Login to ShopSpher
          </h2>

          <p className="mt-3 text-zinc-400">
            Access your wishlist, orders and premium shopping
            experience.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label className="mb-3 block text-sm font-semibold">
                Email Address
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0F0F0F] px-5 py-4">
                <Mail
                  size={20}
                  className="text-[#D4AF37]"
                />

                <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full bg-transparent outline-none"
/>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold">
                Password
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0F0F0F] px-5 py-4">
                <Lock
                  size={20}
                  className="text-[#D4AF37]"
                />

                <input
  type={showPassword ? "text" : "password"}
  placeholder="Enter your password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full bg-transparent outline-none"
/>

                <Eye
  size={20}
  onClick={() => setShowPassword(!showPassword)}
  className="cursor-pointer text-zinc-500"
/>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-400">
                <input
  type="checkbox"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
  className="accent-[#D4AF37]"
/>
                Remember me
              </label>

              <button className="text-[#D4AF37]">
                Forgot Password?
              </button>
            </div>
            {error && (
  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
    {error}
  </div>
)}
                        <button
  type="button"
  onClick={handleLogin}
  disabled={loading}
  className="w-full rounded-2xl bg-[#D4AF37] py-4 text-lg font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Signing In..." : "Sign In"}
</button>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Or continue with
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <button className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-4 transition hover:border-[#D4AF37]">
                <FcGoogle size={22} />
                Google
              </button>

              <button className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 py-4 transition hover:border-[#D4AF37]">
                <Apple size={22} />
                Apple
              </button>
            </div>

            <p className="mt-8 text-center text-zinc-400">
              Don't have an account?{" "}
              <Link
  to="/register"
  className="font-semibold text-[#D4AF37] hover:underline"
>
  Create Account
</Link>
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}