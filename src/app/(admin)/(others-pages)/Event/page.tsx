
import Event from "@/components/event/Event";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Blank Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Blank Page TailAdmin Dashboard Template",
};

export default function Page() {
  return (
    <div>
      
     <Event />
    </div>
  );
}
