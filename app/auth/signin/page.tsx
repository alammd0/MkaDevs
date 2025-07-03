"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false, // do not auto redirect — handle manually
      email,
      password,
    });

    if (res?.error) {
      alert(res.error);
    } else {
      router.push("/"); // redirect to homepage after login
    }

    setLoading(false);
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md bg-gray-300 w-full p-8 rounded-xl shadow shadow-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center capitalize">
          Welcome back to MkaDevs
        </h1>

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="mkadevs@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-white py-2 rounded hover:bg-gray-700 transition duration-200"
          >
            {loading ? "Signing in..." : "Sign in with Email"}
          </button>
        </form>

        <p className="mt-2 text-center text-gray-600">
          Don`&apos;`t have an account?{" "}
          <Link href="/auth/register">Please create one</Link>
        </p>

        <div className="mt-2 text-center">
          <p className="text-gray-600 mb-2">or</p>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex  items-center gap-2 justify-center bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition duration-200"
          >
            <FcGoogle />{" "}
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
