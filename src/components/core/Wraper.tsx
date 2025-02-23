import { cn } from "@/lib/utils";
import React from "react";

interface WrapperProps {
  children: React.ReactNode;
  className?: string;
}

const Wraper = ({ children, className = "" }: WrapperProps) => {
  return (
    <div
      className={cn(`mx-auto max-w-[1420px] w-full px-4 lg:px-8`, className)}
    >
      {children}
    </div>
  );
};

export default Wraper;
