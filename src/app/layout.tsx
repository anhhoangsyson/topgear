import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/context/admin/SidebarContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SidebarProvider>{children}</SidebarProvider>
        {/* use toaster for gender notification for action. Ex: login success or login failed */}
        <Toaster />
      </body>
    </html>
  );
}
