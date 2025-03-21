import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React from "react";

export default function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
<<<<<<< Updated upstream
      <Header />
      <div className="mx-auto max-w-[1025px] w-full">{children}</div>
      <Footer />
=======
        <Header />
        <div className='2xl:w-10/12 mx-auto'>
        {children}
        </div>
        <Footer />
>>>>>>> Stashed changes
    </>
  );
}
