"use client";

import Image from "next/image";
import Profile from "@/assets/Profile.png"; // Adjust the path as necessary
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();

  return (
    <div className="w-8/12 mx-auto mt-8">
      <div className="flex items-center justify-between bg-gray-800 p-4 navbar-shadow rounded-lg shadow-md">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image height={45} width={45} src={Profile} alt="" />
          <p className="text-4xl font-semibold text-white">MkaDevs</p>
        </div>

        <div>
          <button className="bg-gray-300 px-4 py-1 text-xl font-semibold rounded-md font-mono" onClick={() => router.push("/auth/signin")}>Login</button>
        </div>
      </div>
    </div>
  );
}
