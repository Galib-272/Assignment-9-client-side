import "./globals.css";
import { Toaster } from "react-hot-toast";
import AppProvider from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "IdeaVault - Startup Validation Ecosystem",
  description: "Secure, decentralized workspace layout to deposit, trace, and validate breaking business formulations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 antialiased transition-colors duration-300">
        <AppProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}