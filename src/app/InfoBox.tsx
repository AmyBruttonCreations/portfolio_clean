"use client";
import { useState } from "react";

interface InfoBoxProps {
  info?: string;
}

export default function InfoBox({ info }: InfoBoxProps) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ border: '4px solid lime', margin: '2rem' }}>
      <button
        className="bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg focus:outline-none"
        style={{ width: 40, height: 40, fontSize: 28, border: '4px solid lime !important' }}
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