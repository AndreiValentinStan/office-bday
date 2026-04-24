"use client";

import { redirect, RedirectType } from "next/navigation";
import { useAuth } from "../hooks/auth";

export const LoginGuard = ({children}) => {
  const {isLogged} = useAuth();

  if (isLogged) {
    return redirect("/employees", RedirectType.replace);
  }
  return <>{children}</>;
};
