import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="max-w-2xl mx-auto mt-8">{children}</div>;
};

export const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="mx-4">{children}</div>;
};

export default Layout;
