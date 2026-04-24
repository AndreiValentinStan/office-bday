"use client";

import { useAuth } from "@/hooks/auth";
import { Dropdown, DropdownItem } from "flowbite-react";
import Link from "next/link";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoPeopleCircle } from "react-icons/io5";
import { FaUserClock } from "react-icons/fa6";
import { useSelectedLayoutSegment } from "next/navigation";
import { FaUserEdit } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";


const dropdownTheme = {
  arrowIcon: "ml-2 h-4 w-4",
  content: "py-1 focus:outline-none",
  floating: {
    animation: "transition-opacity",
    arrow: {
      base: "absolute z-10 h-2 w-2 rotate-45",
      style: {
        dark: "bg-gray-900 dark:bg-gray-700",
        light: "bg-white",
        auto: "bg-white dark:bg-gray-700",
      },
      placement: "-4px",
    },
    base: "z-10 w-fit divide-y divide-gray-100 rounded shadow focus:outline-none",
    content: "py-1 text-sm text-gray-700 dark:text-gray-200",
    divider: "my-1 h-px bg-gray-100 dark:bg-gray-600",
    header: "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200",
    hidden: "invisible opacity-0",
    item: {
      container: "",
      base: "flex w-full cursor-pointer items-center justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:bg-gray-600 dark:focus:text-white",
      icon: "mr-2 h-4 w-4",
    },
    style: {
      dark: "bg-gray-900 text-white dark:bg-gray-700",
      light: "border border-gray-200 bg-white text-gray-900",
      auto: "border border-gray-200 bg-white text-gray-900 dark:border-none dark:bg-gray-700 dark:text-white",
    },
    target: "w-fit bg-blue-600 px-2",
  },
  inlineWrapper: "flex items-center",
};

function snakeCaseName(firstName) {
    if(!firstName)
        return '';
  return `${firstName[0].toUpperCase() + firstName.slice(1)}`;
}

function renderIcon(location){
    const style = 'w-8 h-8'
    switch(location){
        case 'employees':
            return <FaPeopleGroup className={style}/>
        case 'accounts':
            return <FaUserClock className={style}/>
        case 'profile':
            return <FaUserEdit className={style}/>
        case 'settings': 
            return <IoIosSettings className={style}/>
        default:
            return <></>
    }
}

export default function Navbar({ children }) {
  const { firstName, logout, sessionId } = useAuth();
  const activePage = useSelectedLayoutSegment();

  return (
    <div className="flex flex-col w-full h-dvh overflow-hidden"> {/*  */}
      <div className="md:h-0 h-14 md:p-0 flex w-full bg-blue-500 opacity-100 md:opacity-0 flex-shrink-0 items-center justify-center relative py-3">
        {/* burger */}
        <div className="absolute left-5 h-full flex items-center">
          <Dropdown label={renderIcon(activePage)} theme={dropdownTheme}>
            <DropdownItem as={Link} href="/employees">
              Employees
            </DropdownItem>
            <DropdownItem as={Link} href="/accounts">
              Accounts
            </DropdownItem>
          </Dropdown>
        </div>

        {/* logo */}
        <div className="flex justify-center hidden sm:visible">
          <img
            src="https://sts.ro/fodidin/uploads/2024/08/5fba193160aa826e.png"
            className="rounded-full w-10 h-10"
          />
        </div>

        {/* profile badge */}
        <div className="absolute right-5 h-full flex items-center">
          <Dropdown
            theme={dropdownTheme}
            label={
              <>
                <IoPeopleCircle className="w-6 h-6" />
                {snakeCaseName(firstName)}
              </>
            }
          >
            <DropdownItem as={Link} href="/profile">
              Profile
            </DropdownItem>
            <DropdownItem as={Link} href="/settings">
              Settings
            </DropdownItem>

            <DropdownItem onClick={() => logout(sessionId)}>
              <span>Logout</span>
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
      <div className="overflow-y-auto flex-1 min-h-0">{children}</div>
    </div>
  );
}
