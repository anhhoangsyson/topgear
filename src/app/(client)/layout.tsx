import Footer from "@/components/organisms/layout/Footer";
import Header from "@/components/organisms/layout/Header";
import React from "react";

export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-20 pb-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
