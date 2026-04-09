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
        className={`bg-blue-700 w-0 invisible md:visible h-full md:w-72 opacity-0 md:opacity-100 flex-shrink-0 transition-[width, opacity] duration-500 overflow-hidden relative`} /* ${width} */
      >
        <div className="min-w-72 p-10">
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
            <Link className="hover:scale-125 origin-left" href="/profile">Profile</Link>
            <Link className="hover:scale-125 origin-left" href="/accounts">Accounts</Link>
          </div>
          {/* logout button */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 flex justify-center">
            <button className='text-white bg-blue-800 border border-blue-900 py-2 px-20 rounded-md hover:bg-blue-900'>Logout</button>
          </div>
        </div>
      </div>
    </>
  );
}
