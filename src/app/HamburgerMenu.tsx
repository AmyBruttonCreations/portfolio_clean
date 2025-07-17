"use client";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

const defaultNavLinks = [
  { href: "/", label: "Home" },
  { href: "/vector-art", label: "Vector Art" },
  { href: "/cel-animation", label: "Cel Animation" },
  { href: "/illustration-2d", label: "2D Illustration" },
  { href: "/illustration-3d", label: "3D Illustration" },
  { href: "/contact", label: "Contact" },
];

export default function HamburgerMenu({ navLinks = defaultNavLinks }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [iconBounced, setIconBounced] = useState(false);
  const [showMenuLinks, setShowMenuLinks] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [glitch, setGlitch] = useState(false); // NEW
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
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

  // Bounce and glitch effect for icon
  const handleMenuToggle = useCallback(() => {
    setMenuOpen((open) => !open);
    setIconBounced(true);
    setGlitch(true); // NEW
    setTimeout(() => setIconBounced(false), 400);
    setTimeout(() => setGlitch(false), 400); // NEW
  }, []);

  // Delay menu links until after pill expands
  useEffect(() => {
    if (menuOpen) {
      const t = setTimeout(() => setShowMenuLinks(true), 100);
      return () => clearTimeout(t);
    } else {
      setShowMenuLinks(false);
    }
  }, [menuOpen]);

  // Handle hover open/close
  const handleMouseEnter = () => setMenuOpen(true);
  const handleMouseLeave = () => setMenuOpen(false);

  return (
    <div
      className={`fixed top-4 left-4 z-50 magenta-glow shadow-lg flex items-center overflow-hidden transition-all duration-400${menuOpen ? ' w-[900px] h-12 rounded-full' : ' w-12 h-12 rounded-full'}`}
      ref={menuRef}
      style={{ background: '#85DBD8' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 cursor-pointer z-[9999] flex flex-col items-center justify-center gap-1 rounded-full transition-all duration-400${iconBounced ? ' scale-105' : ' scale-100'}${menuOpen ? ' left-0 translate-x-0' : ' left-1/2 -translate-x-1/2'} hover:rgb-split`}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={handleMenuToggle}
        tabIndex={0}
        style={{ position: 'relative' }}
      >
        {/* Hamburger to X animation */}
        <span
          className={`block w-6 h-1 rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
          style={{ background: '#EF1481' }}
        ></span>
        <span
          className={`block w-6 h-1 rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
          style={{ background: '#EF1481' }}
        ></span>
        <span
          className={`block w-6 h-1 rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          style={{ background: '#EF1481' }}
        ></span>
      </button>
      {showMenuLinks && (
        <nav className="flex-1 flex items-center ml-24">
          {navLinks.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-0.5 text-gray-900 dark:text-gray-100 rounded transition font-medium whitespace-nowrap mr-2 rgb-split-hover`}
              style={{
                animationName: 'fade-in-right',
                animationDuration: '0.5s',
                animationTimingFunction: 'cubic-bezier(.68,-0.6,.32,1.6)',
                animationFillMode: 'both',
                animationDelay: `${i * 60}ms`
              }}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => { setActiveIdx(i); setMenuOpen(false); }}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
} 