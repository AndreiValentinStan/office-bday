"use client";
import Link from "next/link";
import { useState } from "react";
import LogoutButton from "../ui/buttons/Logout";

export default function Sidebar() {
  const [width, setWidth] = useState("w-96");
  const handleToggle = () => {
    if (width === "w-96") return setWidth("w-0");
    else return setWidth("w-96");
  };
  return (
    <>
      <div
        className={`bg-blue-700 ${width} h-full transition-all duration-700 overflow-hidden relative`}
      >
        <div className="min-w-64 p-10">
          {/* image */}
          <div className="flex justify-center">
            <img
              src="https://sts.ro/fodidin/uploads/2024/08/5fba193160aa826e.png"
              className="rounded-full w-24"
            />
          </div>
          {/* links */}
          <div className="flex flex-col pt-10 gap-y-2 text-xl text-white">
            <Link className="hover:scale-125 origin-left" href="/employees">Employees</Link>
            <Link className="hover:scale-125 origin-left" href="/settings">Settings</Link>
          </div>
          {/* logout button */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <button className='text-white bg-blue-800 border border-blue-900 py-2 px-20 rounded-md hover:bg-blue-900'>Logout</button>
          </div>
        </div>
      </div>
    </>
  );
}
