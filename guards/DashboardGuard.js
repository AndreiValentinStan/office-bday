"use client";

import { redirect, RedirectType, usePathname } from "next/navigation";
import { useAuth } from "../hooks/auth";

const protectedRoutes = ["/employees"];

export default function DashboardGuard({ children }) {
  const path = usePathname();
  const { isLogged, role } = useAuth();
  console.log({isLogged});
  if (!protectedRoutes.includes(path)) {
    return <>{children}</>;
  }
  if (!isLogged) {
    return redirect(`/login`, RedirectType.replace);
  }
  if (protectedRoutes.includes(path) && isLogged) {
    console.log("m am logat");
    return <>{children}</>;
  }
}
