import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <div className="mx-auto w-11/12">{children}</div>
      <Footer />
      
    </>
  );
}
