import React from "react";

const Fixora2 = ({ className = "" }) => {
  return (
    <svg viewBox="0 0 540 100" fill="none" className={className}>
      {/* S Logo - Blue gradient */}
      <defs>
        <linearGradient id="sGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#87ceeb" />
          <stop offset="50%" stopColor="#4a90e2" />
          <stop offset="100%" stopColor="#0d47a1" />
        </linearGradient>
      </defs>
      
      {/* S Shape */}
      <path
        d="M 40 20 Q 60 20 60 35 Q 60 50 40 50 Q 20 50 20 65 Q 20 80 40 80 Q 60 80 60 65"
        fill="none"
        stroke="url(#sGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* FIXORA Text */}
      <text
        x="100"
        y="70"
        fontSize="48"
        fontWeight="700"
        fontFamily="Arial, sans-serif"
        fill="#ffffff"
        letterSpacing="2"
      >
        FIXORA
      </text>
    </svg>
  );
};

export default Fixora2;
