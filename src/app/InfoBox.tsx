"use client";
import React, { useState } from "react";

export default function InfoBox({ text }: { text: string }) {
  const [hovered, setHovered] = useState(false);
  const [toggled, setToggled] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  return (
    <div
      className={`transition-all duration-300 inline-flex items-center justify-center cursor-pointer rounded-full magenta-glow`}
      style={{
        background: '#85DBD8',
        width: (hovered || toggled) ? 'auto' : 40,
        minWidth: 40,
        height: 40,
        boxShadow: '0 0 6px 1.5px #EF1481, 0 0 12px 3px #EF1481',
        fontSize: 28,
        paddingLeft: (hovered || toggled) ? 16 : 0,
        paddingRight: (hovered || toggled) ? 16 : 0,
        transition: 'width 0.3s cubic-bezier(.68,-0.6,.32,1.6)',
      }}
      onMouseEnter={() => { if (!isMobile) setHovered(true); }}
      onMouseLeave={() => { if (!isMobile) setHovered(false); }}
      onClick={() => { if (isMobile) setToggled(t => !t); }}
    >
      <span className="flex items-center justify-center w-10 h-10 font-bold" style={{ color: '#EF1481' }}>i</span>
      {(hovered || toggled) && (
        <span
          className="ml-2 text-gray-900 dark:text-gray-100 font-medium transition-all duration-300 opacity-100"
          style={{
            fontSize: '1.25rem',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s cubic-bezier(.68,-0.6,.32,1.6)',
            display: 'block',
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
} 