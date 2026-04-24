import { Toaster } from "react-hot-toast";
import Sidebar from "../components/main/Sidebar";
import "./globals.css";
import AuthProvider from "../components/authentication/AuhtProvider.js";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
            <div className="w-full h-dvh flex">
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#333",
                    color: "#fff",
                  },
                }}
              />
            </div>
        </AuthProvider>
      </body>
    </html>
  );
}
