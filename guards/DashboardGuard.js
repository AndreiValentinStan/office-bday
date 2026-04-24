"use client";

import { redirect, RedirectType, usePathname } from "next/navigation";
import { useAuth } from "../hooks/auth";

const protectedRoutes = ["/employees", "/profile", "/accounts", "/"];

export default function DashboardGuard({ children }) {
  const path = usePathname();
  const { isLogged, isSetteled } = useAuth();
  console.log({isLogged, isSetteled});
 
  if (!isSetteled) return;

  if (!protectedRoutes.includes(path)) {
    return <>{children}</>;
  }
  if (!isLogged) {
    return redirect(`/login`, RedirectType.replace);
  }
  if (protectedRoutes.includes(path) && isLogged) {
    return <>{children}</>;
  }
}
