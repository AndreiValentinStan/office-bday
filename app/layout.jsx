import "./globals.css";
import ThemeContainer from "../components/ui/ThemeContainer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-customFont">
        <ThemeContainer />
        {children}
      </body>
    </html>
  );
}
