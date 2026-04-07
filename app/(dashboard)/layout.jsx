import Sidebar from "../../components/main/Sidebar";
import "../globals.css";
import DashboardGuard from "@/guards/DashboardGuard";

export default function RootLayout({ children }) {
  return (
    <DashboardGuard>
      <div className="w-full h-full flex overflow-hidden">
        <Sidebar />
        {children}
      </div>
    </DashboardGuard>
  );
}
