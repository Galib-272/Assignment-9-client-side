import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast"; // ✅ IMPORT ADDED
import "./globals.css";

// ✅ FIXED: Configured metadata properties to resolve the default app tab to "IdeaVault | Home"
export const metadata = {
  title: "IdeaVault | Home",
  description: "Secure Concept Ledgers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col justify-between">
        {/* ✅ COMPONENT ADDED: This will render the popups across your whole application */}
        <Toaster position="top-center" reverseOrder={false} />
        
        <AppProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}