'use client'
import DashboardGuard from "@/guards/DashboardGuard";
import { useAuth } from "@/hooks/auth";
import { redirect } from "next/navigation";

export default function Home() {
  /* const {isSetteled, isLogged} = useAuth();
  if(isSetteled && isLogged){
    return redirect('employees', 'replace')
  }
  return redirect('login', 'replace') */
  return null;
}
