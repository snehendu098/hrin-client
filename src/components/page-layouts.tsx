import React from "react";

const PageLayout = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full">
        <p className="text-2xl font-semibold">{text}</p>
      </div>
      <div className="w-full mt-8">{children}</div>
    </div>
  );
};

export default PageLayout;
