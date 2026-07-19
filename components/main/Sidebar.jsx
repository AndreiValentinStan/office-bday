"use client";
import { useAuth } from "@/hooks/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import sts_image from "@/public/sts_image.png";

export default function Sidebar() {
  const { firstName, lastName, email, logout, sessionId } = useAuth();
  const [width, setWidth] = useState("w-96");
  const router = useRouter();
  const handleToggle = () => {
    if (width === "w-96") return setWidth("w-0");
    else return setWidth("w-96");
  };
  return (
    <>
      <div
        className={`bg-blue-700 w-0 invisible md:visible md:min-w-72 md:max-w-96 opacity-0 md:opacity-100 flex flex-col justify-between items-center py-5 h-dvh transition-[width, opacity] duration-500 overflow-hidden relative`} /* ${width} */
      >
        <div className="min-w-full">
          {/* image */}
          <div className="flex justify-center">
            <Image
              src={sts_image}
              width={120}
              className="rounded-full"
              alt="sts_logo"
            ></Image>
            {/*  <img
              src="https://sts.ro/fodidin/uploads/2024/08/5fba193160aa826e.png"
              className="rounded-full w-24"
            /> */}
          </div>
          {/* links */}
          <div className="flex flex-col pt-10 gap-y-2 text-xl text-white pl-12">
            <Link className="hover:scale-125 origin-left" href="/employees">
              Employees
            </Link>
            <Link className="hover:scale-125 origin-left" href="/settings">
              Settings
            </Link>
            <Link className="hover:scale-125 origin-left" href="/profile">
              Profile
            </Link>
            <Link className="hover:scale-125 origin-left" href="/accounts">
              Accounts
            </Link>
          </div>
        </div>

        {/* logout button */}
        <div className="flex flex-col gap-y-10 items-start justify-center">
          {/* user badge */}
          <div className="flex flex-col text-white/90 italic">
            {/* name */}
            <span>{firstName + " " + lastName}</span>
            {/* email */}
            <span>{email}</span>
          </div>
          <button
            className="text-white bg-blue-800 border border-blue-900 py-2 px-20 rounded-md hover:bg-blue-900"
            onClick={(e) => {
              e.preventDefault();
              logout(sessionId);
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
