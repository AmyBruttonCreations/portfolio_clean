"use client";
import { useState } from "react";

interface InfoBoxProps {
  info?: string;
}

export default function InfoBox({ info }: InfoBoxProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="absolute bottom-4 left-4 z-40">
      <button
        className="bg-purple-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-4xl shadow-lg focus:outline-none"
        aria-label="Show project info"
        tabIndex={0}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
      >
        i
      </button>
      {show && (
        <div
          className="absolute left-1/2 bottom-0 bg-gray-900 text-white text-2xl sm:text-3xl rounded shadow-lg z-50 flex items-center justify-center"
          style={{
            height: '3.5rem', // h-14
            width: '90vw',
            minWidth: '300px',
            maxWidth: '1100px',
            transform: 'translateX(-50%)',
            boxSizing: 'border-box',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            padding: '0 2rem',
          }}
        >
          {info}
        </div>
      )}
    </div>
  );
} 