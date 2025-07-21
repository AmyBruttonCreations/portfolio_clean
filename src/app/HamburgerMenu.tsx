"use client";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

const defaultNavLinks = [
  { href: "/", label: "Home" },
  { href: "/vector-art", label: "Vector Art" },
  { href: "/cel-animation", label: "Cel Animation" },
  { href: "/illustration-2d", label: "2D and 3D Illustration" },
];

export default function HamburgerMenu({ navLinks = defaultNavLinks }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [iconBounced, setIconBounced] = useState(false);
  const [showMenuLinks, setShowMenuLinks] = useState(false);
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
  const handleMenuToggle = useCallback((e?: React.MouseEvent) => {
    setMenuOpen((open) => !open);
    setIconBounced(true);
    setTimeout(() => setIconBounced(false), 400);
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

  return (
    <div
      className={`fixed top-4 left-4 z-50 magenta-glow shadow-lg flex items-center transition-all duration-400${menuOpen ? ' w-[675px] h-12 rounded-full' : ' w-10 h-10 md:w-12 md:h-12 rounded-full'}`}
      ref={menuRef}
      style={{ background: '#85DBD8' }}
    >
      {/* Envelope icon for contact page */}
      <Link
        className="contact-envelope group w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full"
        href="/contact"
        aria-label="Contact"
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 100,
          background: '#85DBD8',
          boxShadow: '0 0 6px 1.5px #EF1481, 0 0 12px 3px #EF1481',
          color: '#EF1481',
          fontSize: 28,
          textDecoration: 'none',
          transition: 'background 0.2s',
        }}
      >
        {/* Closed Envelope (default) */}
        <span className="block group-hover:hidden transition-all duration-300">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </span>
        {/* Open Envelope (on hover) */}
        <span className="hidden group-hover:block transition-all duration-300">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="8" width="20" height="12" rx="2"/>
            <polyline points="2,8 12,3 22,8"/>
            <polyline points="2,8 12,15 22,8"/>
          </svg>
        </span>
      </Link>
      <button
        className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 cursor-pointer z-[9999] flex flex-col items-center justify-center gap-1 rounded-full transition-all duration-400${iconBounced ? ' scale-105' : ' scale-100'}${menuOpen ? ' left-0 translate-x-0' : ' left-1/2 -translate-x-1/2'} hover:rgb-split`}
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
        <nav className="flex-1 flex items-center justify-between w-full px-6">
          {navLinks.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-0.5 text-gray-900 dark:text-gray-100 rounded transition font-medium whitespace-nowrap mr-2 rgb-split-hover`}
              style={{
                animationName: 'fade-in-right',
                animationDuration: '0.3s',
                animationTimingFunction: 'cubic-bezier(.68,-0.6,.32,1.6)',
                animationFillMode: 'both',
                animationDelay: `${i * 30}ms`
              }}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => { setMenuOpen(false); }}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
} 