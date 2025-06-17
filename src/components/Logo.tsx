
import React from "react";

const Logo = ({ size = 38 }: { size?: number }) => (
  <span className="inline-flex items-center justify-center rounded-2xl shadow border-2 border-blue-200 bg-gradient-to-br from-blue-400 via-purple-300 to-fuchsia-200" style={{ width: size, height: size }}>
    <svg
      width={size * 0.89}
      height={size * 0.89}
      viewBox="0 0 34 34"
      fill="none"
      className="m-1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="30" height="30" rx="10" fill="url(#paint0_linear)" />
      <circle cx="17" cy="17" r="9.5" fill="url(#paint1_radial)" />
      <path d="M11 18C12.5 16 15.5 21 17.3 15.2C18.7 11.2 23.5 16 23.5 13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      <defs>
        <linearGradient id="paint0_linear" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA"/>
          <stop offset="0.5" stopColor="#A78BFA"/>
          <stop offset="1" stopColor="#F472B6"/>
        </linearGradient>
        <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientTransform="translate(17 17) scale(10)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff" stopOpacity="0.95"/>
          <stop offset="1" stopColor="#E0E7FF" stopOpacity="0.5"/>
        </radialGradient>
      </defs>
    </svg>
  </span>
);

export default Logo;
