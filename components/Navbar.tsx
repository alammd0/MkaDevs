"use client";

import Image from "next/image";
import Profile from "@/assets/Profile.png";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession(); 

  return (
    <div className="w-9/12 mx-auto mt-8">
      <div className="flex items-center justify-between bg-gray-500 p-4 navbar-shadow rounded-lg shadow-md">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image height={45} width={45} src={Profile} alt="Logo" />
          <p className="text-4xl font-semibold text-white">MkaDevs</p>
        </div>

        <div>
          {status === "loading" ? (
            <p className="text-white">Loading...</p>
          ) : !session ? (
            <button
              className="bg-gray-300 px-4 py-1 text-xl font-semibold rounded-md font-mono"
              onClick={() => router.push("/auth/signin")}
            >
              Login
            </button>
          ) : (
            <button
              className="bg-gray-300 px-4 py-1 text-xl font-semibold rounded-md font-mono"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
