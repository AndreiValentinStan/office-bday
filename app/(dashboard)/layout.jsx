import Sidebar from "../../components/main/Sidebar";
import "../globals.css";
import DashboardGuard from "@/guards/DashboardGuard";
import Navbar from "../../components/main/Navbar";

export default function RootLayout({ children }) {
  return (
    <DashboardGuard>
      <div className="w-full h-full flex">
        <Sidebar />
        <Navbar>{children}</Navbar>
        
      </div>
    </DashboardGuard>
  );
}
