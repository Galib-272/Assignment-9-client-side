import "./globals.css";

export const metadata = {
  title: "IdeaVault",
  description: "Secure Concept Ledgers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col justify-between">
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
