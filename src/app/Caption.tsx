import React from "react";

const captionStyle: React.CSSProperties = {
  fontWeight: 400,
  fontSize: 'clamp(1rem, 1.5vw, 1.35rem)',
  color: '#FDF8F3',
};

export default function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p style={captionStyle} className="w-full text-center">
      {children}
    </p>
  );
} 