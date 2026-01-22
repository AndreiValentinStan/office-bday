"use client";

import { redirect, RedirectType, usePathname } from "next/navigation";
import { useAuth } from "../hooks/auth";

const protectedRoutes = ["/employees"];

export default function UserGuard({ children }) {
  const path = usePathname();
  console.log('aici');
  console.log(path === protectedRoutes[0], {protected: protectedRoutes[0], path});
  console.log('Path: ', path);
  //if (!protectedRoutes.includes(path)) {
    console.log(' is not protected!');
    return <>{children}</>;
  //}
  console.log('is protected!');
  const { user, role } = useAuth();
  if (!user) {
    return redirect(
      `/login`,
      RedirectType.replace
    );
  }
}
