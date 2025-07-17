"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCallback } from "react";
import HamburgerMenu from "../HamburgerMenu";
import InfoBox from "../InfoBox";
import React from "react";

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
    title: "Pulp Fiction",
    img: "/vector-art/pulpfiction.jpg",
    info: `I made this for my brother. He has a huge canvas print of it in his flat.\n\nI don’t mind seeing it, and that says a lot.`,
  },
  {
    title: "Pet Portraits",
    img: "/vector-art/PetPortrait.png",
    info: "Pet portrait occupying the full width.",
  },
  {
    title: "Expanding Sliver Gallery",
    sliverImgs: [
      "/vector-art/hygh (1).png",
      "/vector-art/hygh (2).png",
      "/vector-art/hygh (3).png",
      "/vector-art/hygh (4).png",
      "/vector-art/hygh (5).png",
      "/vector-art/hygh (6).png",
      "/vector-art/hygh (7).png"
    ],
    info: "Expanding sliver gallery.",
  },
  {
    title: "Equal Video",
    video: "/vector-art/equal.mp4",
    info: "This is a video project.",
  },
  {
    title: "Second Sliver Gallery",
    sliverImgs: [
      "/vector-art/vw (1).png",
      "/vector-art/vw (2).png",
      "/vector-art/vw (3).png"
    ],
    info: "Second expanding sliver gallery.",
  },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<undefined | boolean>(undefined);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// Expanding sliver gallery component
function ExpandingSliverGallery({ images, alt }: { images: string[]; alt: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="relative w-full h-screen flex flex-row overflow-hidden">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={alt}
          className={`h-full object-cover cursor-pointer transition-all duration-500 ${hovered === i ? 'flex-[30]' : 'flex-[1]'}`}
          style={{ minWidth: 0 }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        />
      ))}
    </div>
  );
}

// InfoPill component
function InfoPill({ text }: { text: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`transition-all duration-300 inline-flex items-center cursor-pointer overflow-hidden rounded-full magenta-glow${hovered ? ' pixelate-hover rgb-split glitch-anim' : ''}`}
      style={{
        background: '#85DBD8',
        height: 64,
        minWidth: 64,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        width: hovered ? 'auto' : 64,
        paddingRight: hovered ? 32 : 0,
        paddingLeft: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-center w-16 h-16">
        <span className="flex items-center justify-center w-16 h-16 text-2xl font-bold" style={{ color: '#EF1481' }}>i</span>
      </div>
      <span
        className={`ml-4 text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap transition-all duration-300 ${hovered ? 'animate-fade-in-right' : 'opacity-0'}`}
        style={{
          fontSize: '1.25rem',
          whiteSpace: 'nowrap',
          animationDuration: hovered ? '0.5s' : undefined,
          animationTimingFunction: hovered ? 'cubic-bezier(.68,-0.6,.32,1.6)' : undefined,
          animationFillMode: hovered ? 'both' : undefined,
          animationDelay: hovered ? '0.1s' : undefined,
        }}
      >
        {hovered ? text : ''}
      </span>
    </div>
  );
}

export default function VectorArt() {
  // Title style
  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(1.5rem, 7vw, 8rem)',
    color: '#FDF8F3',
    textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
    lineHeight: 1.1,
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    letterSpacing: '0.04em',
    fontWeight: 900,
    fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
  };
  // Caption style (less bold)
  const captionStyle: React.CSSProperties = {
    fontWeight: 400,
    fontFamily: "'Montserrat', Arial, Helvetica, sans-serif"
  };
  const [hasMounted, setHasMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);
  useEffect(() => {
    if (hasMounted) {
      const t = setTimeout(() => setShowBanner(true), 50);
      return () => clearTimeout(t);
    }
  }, [hasMounted]);

  const isMobile = useIsMobile();
  const [lightbox, setLightbox] = useState<{ open: boolean; img: string } | null>(null);
  const [showInfo, setShowInfo] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [iconBounced, setIconBounced] = useState(false);
  const [linkBounce, setLinkBounce] = useState(false);
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

  // Bounce effect for icon
  const handleMenuToggle = useCallback(() => {
    setMenuOpen((open) => !open);
    setIconBounced(true);
    setTimeout(() => setIconBounced(false), 400);
  }, []);

  // Bounce effect for links
  useEffect(() => {
    if (menuOpen) {
      setTimeout(() => setLinkBounce(true), 200);
    } else {
      setLinkBounce(false);
    }
  }, [menuOpen]);

  // Delay menu links until after pill expands
  useEffect(() => {
    if (menuOpen) {
      const t = setTimeout(() => setShowMenuLinks(true), 100);
      return () => clearTimeout(t);
    } else {
      setShowMenuLinks(false);
    }
  }, [menuOpen]);

  // Dismissible mobile notification
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

  // Top banner with title and artwork
  const topBanner = (
    <div
      key="animated-banner"
      className="w-full flex flex-col sm:flex-row crt-flicker-bg"
      style={{
        minHeight: '100vh',
        opacity: showBanner ? 1 : 0,
        transition: 'opacity 0.1s',
      }}
    >
      <div className="flex-1 flex flex-col items-start justify-center px-8 h-screen">
        {/* Title style */}
        <div style={{ overflow: 'visible', padding: '2.5em 2.5em 0.5em 3.5em', margin: '2em 0 0.5em 0' }}>
          <h1
            className="text-left font-bold uppercase scanline-flicker-once"
            style={{ ...titleStyle, width: 'auto', maxWidth: 'none', overflow: 'visible', padding: 0, margin: '0 0 0 -0.15em' }}
          >
            <span className="swipe-reveal" style={{ overflow: 'visible', display: 'inline' }}>&nbsp;Vector Art</span>
          </h1>
        </div>
        <div className="mt-6 text-left px-8" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ color: '#FDF8F3', ...captionStyle }}>
            <span
              className="swipe-reveal"
              style={{ display: 'block', fontSize: 'clamp(1.1rem, 2.5vw, 3rem)' }}
            >
              I used to hate Adobe Illustrator. I’m obsessed with details and always felt vector art forced things to be simplified.
            </span>
          </p>
          <p style={{ color: '#FDF8F3', marginTop: '1em', ...captionStyle }}>
            <span
              className="highlight-animate swipe-reveal"
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 3rem)' }}
            >
              I have since changed my mind.
            </span>
          </p>
        </div>
      </div>
      <div
        className="w-full sm:w-1/2 h-screen overflow-hidden flex items-center justify-center"
        style={{ position: 'relative' }}
      >
        <img
          src="/vector-art/BannerArt_VA.png"
          alt="Banner artwork"
          className="object-cover w-full h-full swipe-reveal"
          style={{
            borderRadius: 0,
            objectPosition: 'center',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onLoad={() => setBannerLoaded(true)}
        />
        <div className="vhs-noise"></div>
        {bannerLoaded && <div className="scanlines"></div>}
      </div>
    </div>
  );

  // Only render the loader before mount or before showBanner is true
  if (!hasMounted || !showBanner) {
    return (
      <div className="w-full flex flex-col items-center justify-center h-screen" style={{ background: '#E4A4BD' }}>
        <div
          className="animate-spin rounded-full border-8 border-t-8 border-[#EF1481] border-t-transparent w-24 h-24"
          style={{
            boxShadow: '0 0 32px 8px #EF1481, 0 0 64px 16px #E4A4BD'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ background: '#E4A4BD' }} className="flex flex-col items-center">
      <HamburgerMenu />
      {/* Top banner */}
      <div className="w-full">
        {topBanner}
      </div>
      <div className="w-full flex flex-col items-center">
        {projects.map((project, idx) => {
          // Video project logic
          if (project.video) {
            return (
              <div key={idx} className="w-full bg-white dark:bg-gray-800 shadow overflow-hidden relative flex flex-col justify-center">
                <div className="relative w-full h-screen flex flex-col justify-center">
                  <video
                    src={project.video!}
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover"
                    style={{ borderRadius: 0 }}
                  />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                    <InfoPill text={`Project info goes here...`} />
                  </div>
                </div>
              </div>
            );
          }
          // Expanding sliver gallery logic
          if (project.sliverImgs) {
            return (
              <div key={idx} className="w-full bg-white dark:bg-gray-800 shadow overflow-hidden relative flex flex-col justify-center">
                <div className="relative w-full h-screen flex flex-col justify-center">
                  <ExpandingSliverGallery images={project.sliverImgs} alt={project.title} />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                    <InfoPill text={`Project info goes here...`} />
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div key={idx} className="w-full bg-white dark:bg-gray-800 shadow overflow-hidden relative flex flex-col justify-center">
              <div className="relative w-full flex flex-col justify-center">
                <img
                  src={project.img || ""}
                  alt={project.title || ""}
                  className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105"
                  onClick={() => setLightbox({ open: true, img: project.img || "" })}
                  style={{ borderRadius: 0 }}
                />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                  <InfoPill text={`Project info goes here...`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Lightbox overlay */}
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
      {/* Mobile notification banner */}
      {isMobile !== undefined && isMobile && mobileBanner}
    </div>
  );
} 