import Sidebar from "../../components/main/Sidebar";
import "../globals.css";

export default function RootLayout({ children }) {
  return (
    <div className="w-full h-dvh flex">
      <Sidebar />
      {children}
    </div>
  );
}
