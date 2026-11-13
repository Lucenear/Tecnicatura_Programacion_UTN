import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PostulacionProvider } from "@/components/especialista/PostulacionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FixYa - Soluciones y Especialistas",
  description: "Encontrá tutoriales paso a paso o contactá especialistas verificados para resolver problemas en casa.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 overflow-x-clip">
        <AuthProvider>
          <PostulacionProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </PostulacionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
