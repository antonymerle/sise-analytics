import React from "react";

export const Footer: React.FC = () => {
  return (
    <>
      <p className="footer">
        <a href="https://github.com/antonymerle/sise-analytics">
          Sise-Analytics
        </a>{" "}
        {new Date().getFullYear()} -- v 0.6
      </p>
    </>
  );
};
