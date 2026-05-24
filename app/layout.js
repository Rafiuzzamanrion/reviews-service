import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Premiums Edu Market — Premium .edu Email Accounts",
  description: "Buy premium, aged, and single domain .edu email accounts with instant delivery and replacement warranty.",
  keywords: "edu email, buy edu email, premium edu accounts, student discount, edu marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-background text-primary min-h-screen flex flex-col antialiased`}>
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                color: '#0D3B66',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(13, 59, 102, 0.12)',
              },
              success: {
                iconTheme: {
                  primary: '#06D6A0',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF476F',
                  secondary: 'white',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
