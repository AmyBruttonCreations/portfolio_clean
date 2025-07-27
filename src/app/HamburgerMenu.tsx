"use client";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { useIsMobile } from '../utils/useIsMobile';
import { usePathname } from 'next/navigation';
import { MarkerHighlightInView } from './MarkerHighlightInView';

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
  const isMobile = useIsMobile();
  const pathname = usePathname();

  // For mobile menu slide-out animation
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [mobileMenuAnimating, setMobileMenuAnimating] = useState<'in' | 'out' | null>(null);

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (isMobile) {
          setMobileMenuAnimating('out');
        } else {
        setMenuOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen, isMobile]);

  // Bounce and glitch effect for icon
  const handleMenuToggle = useCallback((e?: React.MouseEvent) => {
    if (isMobile) {
      if (!menuOpen) {
        setMenuOpen(true);
        setMobileMenuVisible(true);
        setMobileMenuAnimating('in');
      } else {
        setMobileMenuAnimating('out');
      }
    } else {
    setMenuOpen((open) => !open);
    }
    setIconBounced(true);
    setTimeout(() => setIconBounced(false), 400);
  }, [isMobile, menuOpen]);

  // Delay menu links until after pill expands (desktop only)
  useEffect(() => {
    if (!isMobile && menuOpen) {
      const t = setTimeout(() => setShowMenuLinks(true), 100);
      return () => clearTimeout(t);
    } else {
      setShowMenuLinks(false);
    }
  }, [menuOpen, isMobile]);

  // Handle mobile menu mount/unmount for animation
  useEffect(() => {
    if (isMobile && menuOpen) {
      setMobileMenuVisible(true);
      setMobileMenuAnimating('in');
    }
    if (isMobile && !menuOpen && mobileMenuVisible) {
      setMobileMenuAnimating('out');
    }
  }, [isMobile, menuOpen]);

  // When slide-out animation ends, unmount the menu
  const handleMobileMenuAnimationEnd = () => {
    if (mobileMenuAnimating === 'out') {
      setMobileMenuVisible(false);
      setMenuOpen(false);
      setMobileMenuAnimating(null);
    } else if (mobileMenuAnimating === 'in') {
      setMobileMenuAnimating(null);
    }
  };

  return (
    <div
      className={`fixed top-4 left-4 magenta-glow shadow-lg flex items-center transition-all duration-400${!isMobile && menuOpen ? ' w-[675px] h-12 rounded-full' : ' w-10 h-10 md:w-12 md:h-12 rounded-full'}`}
      ref={menuRef}
      style={{ background: '#85DBD8', zIndex: 20000, pointerEvents: 'auto' }}
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
        className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 cursor-pointer z-[9999] flex flex-col items-center justify-center gap-1 rounded-full transition-all duration-400${iconBounced ? ' scale-105' : ' scale-100'}${!isMobile && menuOpen ? ' left-0 translate-x-0' : ' left-1/2 -translate-x-1/2'} hover:rgb-split`}
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
      {/* Desktop pill menu */}
      {!isMobile && showMenuLinks && (
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
              {pathname === item.href ? (
                <MarkerHighlightInView style={{ borderRadius: '1em', padding: '0.1em 0.5em', display: 'inline-block' }}>{item.label.toLowerCase()}</MarkerHighlightInView>
              ) : (
                <span>{item.label.toLowerCase()}</span>
              )}
            </Link>
          ))}
        </nav>
      )}
      {/* Mobile vertical dropdown menu with slide-in/out animation */}
      {isMobile && mobileMenuVisible && (
        <nav
          className={
            mobileMenuAnimating === 'out'
              ? 'mobile-menu-slide-out'
              : 'mobile-menu-slide-in'
          }
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)', // 8px gap below hamburger
            left: 0,
            minWidth: '140px',
            width: 'max-content',
            maxWidth: '90vw',
            background: '#85DBD8',
            zIndex: 20001,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            borderRadius: '1.5rem',
            padding: '0.5rem 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '0.25rem',
            overflow: 'hidden',
            transform: 'translateX(0)',
            opacity: 1,
            transition: 'transform 0.35s cubic-bezier(.68,-0.6,.32,1.6), opacity 0.35s cubic-bezier(.68,-0.6,.32,1.6)',
          }}
          onAnimationEnd={handleMobileMenuAnimationEnd}
        >
          {navLinks.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-6 py-3 text-gray-900 dark:text-gray-100 rounded transition font-medium whitespace-nowrap rgb-split-hover w-full text-left`}
              style={{ fontSize: 20, fontWeight: 600, borderRadius: 0 }}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => { setMobileMenuAnimating('out'); }}
            >
              {pathname === item.href ? (
                <MarkerHighlightInView style={{ borderRadius: '1em', padding: '0.1em 0.5em', display: 'inline-block' }}>{item.label.toLowerCase()}</MarkerHighlightInView>
              ) : (
                <span>{item.label.toLowerCase()}</span>
              )}
            </Link>
          ))}
        </nav>
      )}
      <style jsx global>{`
        .mobile-menu-slide-in {
          transform: translateX(-24px);
          opacity: 0;
          animation: mobile-menu-slide-in-anim 0.35s cubic-bezier(.68,-0.6,.32,1.6) forwards;
        }
        .mobile-menu-slide-out {
          transform: translateX(0);
          opacity: 1;
          animation: mobile-menu-slide-out-anim 0.35s cubic-bezier(.68,-0.6,.32,1.6) forwards;
        }
        @keyframes mobile-menu-slide-in-anim {
          from {
            transform: translateX(-24px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes mobile-menu-slide-out-anim {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-24px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
} 