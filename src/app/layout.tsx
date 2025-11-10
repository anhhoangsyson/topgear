import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/context/admin/SidebarContext";
import { AuthProvider } from "@/components/features/auth/providers/AuthProvider";
import NotificationProvider from "@/components/providers/NotificationProvider";
import AdminNotificationProvider from "@/components/providers/AdminNotificationProvider";
import { Toaster } from "@/components/atoms/ui/toaster";

// Font Inter is imported but not used in className
// const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "E-COM - Bán laptop chính hãng",
  description: "E-COM - Bán laptop chính hãng, cung cấp laptop và sản phẩm công nghệ chất lượng cao",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        <AuthProvider>
          <NotificationProvider>
            <AdminNotificationProvider>
              <SidebarProvider>{children}</SidebarProvider>
              {/* use toaster for gender notification for action. Ex: login success or login failed */}
              <Toaster />
            </AdminNotificationProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
