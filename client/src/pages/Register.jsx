import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  Apple,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const GOLD = "#D4AF37";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
  e.preventDefault();

  console.log("CREATE ACCOUNT BUTTON CLICKED");

  setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5001/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/account");
    } catch (error) {
      console.error("Registration error:", error);
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
              Register
            </span>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-2">
            <Sparkles
              size={16}
              color={GOLD}
            />

            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
              Create Account
            </span>
          </div>

          <h1 className="mt-6 text-5xl font-black">
            Join ShopSpher
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            Create your premium shopping account and enjoy
            luxury collections, faster checkout and exclusive
            member benefits.
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
            Create Your Account
          </h2>

          <p className="mt-3 text-zinc-400">
            Become a member and unlock the complete ShopSpher
            experience.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label className="mb-3 block text-sm font-semibold">
                Full Name
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0F0F0F] px-5 py-4">
                <User
                  size={20}
                  className="text-[#D4AF37]"
                />

               <input
  type="text"
  placeholder="Enter your full name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full bg-transparent outline-none"
/>
              </div>
            </div>

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
  placeholder="Create password"
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
                       {error && (
  <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
    {error}
  </p>
)}

<button
  type="button"
  onClick={handleRegister}
  disabled={loading}
  className="w-full rounded-2xl bg-[#D4AF37] py-4 text-lg font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
>
  {loading ? "Creating Account..." : "Create Account"}
</button>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Or sign up with
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
              Already have an account?{" "}
              <Link
  to="/login"
  className="font-semibold text-[#D4AF37] hover:underline"
>
  Sign In
</Link>
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
}