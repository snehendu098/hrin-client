import Nav from "@/components/nav";

import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-screen">
      <Nav />
      <div className="w-full flex flex-col items-center relative">
        <div className="py-10 w-full max-w-7xl z-20">{children}</div>
      </div>
    </div>
  );
};

export default RootLayout;
