import Footer from "@/components/organisms/layout/Footer";
import Header from "@/components/organisms/layout/Header";
import React from "react";

export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[106px]">{children}</div>
      <Footer />
      
    </>
  );
}
