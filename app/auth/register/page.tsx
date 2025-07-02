"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"register" | "verify">("register");
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("Response:", res);

    if (res.ok) {
      setStep("verify");
    } else {
      const { error } = await res.json();
      alert(error);
    }
  };

  const handleVerify = async () => {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (res.ok) {
      alert("Email verified! You can now sign in.");
      router.push("/auth/signin");
    } else {
      const { error } = await res.json();
      alert(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md bg-gray-300 w-full p-8 rounded-xl shadow shadow-gray-700">
        {step === "register" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold mb-6 text-center capitalize">
              Register to MkaDevs
            </h1>

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
              onClick={handleRegister}
              className="bg-foreground text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
            >
              Register
            </button>
          </div>
        )}

        {step === "verify" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="number"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="enter your otp"
              />
            </div>

            <button
              onClick={handleVerify}
              className="bg-foreground text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
            >
              Verify
            </button>
          </>
        )}
      </div>
    </div>
  );
}
