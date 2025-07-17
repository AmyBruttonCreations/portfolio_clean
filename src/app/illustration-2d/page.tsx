"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import HamburgerMenu from "../HamburgerMenu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/vector-art", label: "Vector Art" },
  { href: "/cel-animation", label: "Cel Animation" },
  { href: "/illustration-2d", label: "2D Illustration" },
  { href: "/illustration-3d", label: "3D Illustration" },
  { href: "/contact", label: "Contact" },
];

const projects = [
  {
    title: "2D Illustration 1",
    img: "https://via.placeholder.com/800x400?text=2D+1",
    info: "This is a description of 2D Illustration 1. Digital painting with vibrant colors.",
  },
  {
    title: "2D Illustration 2",
    img: "https://via.placeholder.com/800x400?text=2D+2",
    info: "This is a description of 2D Illustration 2. Character concept art.",
  },
  {
    title: "2D Illustration 3",
    img: "https://via.placeholder.com/800x400?text=2D+3",
    info: "This is a description of 2D Illustration 3. Editorial illustration for magazines.",
  },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export default function Illustration2D() {
  const isMobile = useIsMobile();
  const [lightbox, setLightbox] = useState<{ open: boolean; img: string } | null>(null);
  const [showInfo, setShowInfo] = useState<number | null>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const mobileBanner = (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-200 text-yellow-900 px-4 py-2 rounded shadow flex items-center gap-2 text-sm max-w-xs border border-yellow-400" style={{display: showBanner ? 'flex' : 'none'}}>
      <span>For best experience, view on desktop or rotate your phone to landscape mode.</span>
      <button
        className="ml-2 text-yellow-900 hover:text-yellow-700 font-bold"
        onClick={() => setShowBanner(false)}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );

  const topBanner = (
    <div className="w-full min-h-screen flex flex-col sm:flex-row bg-gradient-to-r from-purple-600 to-blue-500 text-white px-0 sm:px-0">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h1
          className="w-full text-left font-bold uppercase px-8"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            color: '#FDF8F3',
            textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
            lineHeight: 1.1,
            width: '100%',
            maxWidth: '100%',
            letterSpacing: '0.04em',
          }}
        >
          2D Illustration
        </h1>
        <div className="mt-6 text-lg text-left px-8">
          <p style={{ color: '#FDF8F3' }}>
            I normally tell people I’m a picture maker, because I make visuals in so many different mediums.
          </p>
          <p className="mt-4">
            <span className="highlight-animate" style={{ color: '#FDF8F3' }}>
              Here are some pictures I made.
            </span>
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center relative min-h-[200px] sm:min-h-0">
        <img
          src="https://via.placeholder.com/800x800?text=Banner+Art"
          alt="Banner artwork"
          className="object-cover w-full h-full"
          style={{ maxHeight: '100vh', minHeight: '200px', borderRadius: 0 }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-12">
      <HamburgerMenu />
      {/* Top banner */}
      <div className="w-full flex-1">
        {topBanner}
      </div>
      <div className="w-full px-2 sm:px-0 flex flex-col items-center">
        {projects.map((project, idx) => (
          <div key={idx} className="w-full bg-white dark:bg-gray-800 shadow overflow-hidden relative min-h-screen flex flex-col justify-center">
            <div className="relative w-full flex-1 flex flex-col justify-center">
              <img
                src={project.img}
                alt={project.title}
                className="w-full h-auto cursor-pointer transition-transform hover:scale-105"
                onClick={() => setLightbox({ open: true, img: project.img })}
                style={{ maxHeight: 600, objectFit: "cover", borderRadius: 0 }}
              />
              <div
                className="absolute top-2 right-2 bg-purple-600 text-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer group"
                onMouseEnter={() => !isMobile && setShowInfo(idx)}
                onMouseLeave={() => !isMobile && setShowInfo(null)}
                onClick={() => isMobile && setShowInfo(showInfo === idx ? null : idx)}
                tabIndex={0}
                aria-label="Show project info"
              >
                ?
                {(showInfo === idx) && (
                  <div className="absolute top-8 right-0 bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg z-20 w-56 max-w-xs" style={{whiteSpace: 'normal'}}>
                    {project.info}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 w-full">
              <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
            </div>
          </div>
        ))}
      </div>
      {lightbox?.open && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox.img}
            alt="Expanded project"
            className="max-w-full max-h-full rounded shadow-lg"
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
      {typeof window !== "undefined" && isMobile && mobileBanner}
    </div>
  );
} 