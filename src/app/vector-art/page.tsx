"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCallback } from "react";
import HamburgerMenu from "../HamburgerMenu";
import InfoBox from "../InfoBox";
import React from "react";
import { useInViewAnimation, MarkerHighlightInView } from '../MarkerHighlightInView';

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
          className={`h-full w-full object-cover cursor-pointer transition-all duration-500 ${hovered === i ? 'flex-[30]' : 'flex-[1]'}`}
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
  const [toggled, setToggled] = useState(false);
  // Use the same mobile detection as elsewhere in the file
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
        transition: 'all 0.3s cubic-bezier(.68,-0.6,.32,1.6)',
      }}
      onMouseEnter={() => { if (!isMobile) setHovered(true); }}
      onMouseLeave={() => { if (!isMobile) setHovered(false); }}
      onClick={() => { if (isMobile) setToggled(t => !t); }}
    >
      <span className="flex items-center justify-center w-10 h-10 font-bold" style={{ color: '#EF1481' }}>i</span>
      {(hovered || toggled) && (
        <span
          className="ml-2 text-gray-900 dark:text-gray-100 font-medium whitespace-nowrap transition-all duration-300 opacity-100"
          style={{
            fontSize: '1.25rem',
            whiteSpace: 'nowrap',
            maxWidth: 300,
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(.68,-0.6,.32,1.6)',
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
}

export default function VectorArt() {
  // Title style
  const titleStyle: React.CSSProperties = {
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
    fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
    fontSize: 'clamp(1rem, 1.5vw, 1.35rem)'
  };
  const [hasMounted, setHasMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false); // for initial loading spinner only
  const [showMobileBanner, setShowMobileBanner] = useState(true); // for mobile notification
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [showDelayedCaption, setShowDelayedCaption] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);
  useEffect(() => {
    if (hasMounted) {
      const t = setTimeout(() => setShowBanner(true), 50);
      return () => clearTimeout(t);
    }
  }, [hasMounted]);
  useEffect(() => {
    if (showBanner) {
      const t = setTimeout(() => setShowDelayedCaption(true), 1500);
      return () => clearTimeout(t);
    } else {
      setShowDelayedCaption(false);
    }
  }, [showBanner]);

  const isMobile = useIsMobile();
  const [lightbox, setLightbox] = useState<{ open: boolean; img: string } | null>(null);
  const [showInfo, setShowInfo] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [iconBounced, setIconBounced] = useState(false);
  const [linkBounce, setLinkBounce] = useState(false);
  const [showMenuLinks, setShowMenuLinks] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    typeof window !== 'undefined' && window.innerWidth < window.innerHeight ? 'portrait' : 'landscape'
  );
  useEffect(() => {
    function updateOrientation() {
      if (window.innerWidth < window.innerHeight) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
      }
    }
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);
    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

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
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl shadow-lg flex items-center gap-3 font-bold text-base"
      style={{
        background: '#EF1481',
        color: '#FDF8F3',
        fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
        boxShadow: '0 0 16px 4px #EF1481, 0 0 32px 8px #fff',
        letterSpacing: '0.02em',
        minWidth: 0,
        maxWidth: '90vw',
        display: showMobileBanner ? 'flex' : 'none',
      }}
    >
      <span>Pssst - all of this looks so much better in landscape. Feel free to rotate your phone or give it a spin on your laptop &lt;3 !</span>
      <button
        className="ml-2 flex items-center justify-center w-8 h-8 rounded-full"
        style={{
          background: '#FDF8F3',
          color: '#EF1481',
          border: 'none',
          boxShadow: '0 0 8px 2px #EF1481',
          cursor: 'pointer',
          fontWeight: 900,
          fontSize: 22,
          padding: 0,
        }}
        onClick={() => setShowMobileBanner(false)}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );

  // Add in-view animation for Vector Art title
  const [refTitle, glitchClassTitle] = useInViewAnimation<HTMLHeadingElement>("scanline-flicker-once");

  // Top banner with title and artwork
  const topBanner = (
    <div
      key="animated-banner"
      className="w-full flex flex-col md:flex-row vector-banner-vertical crt-flicker-bg"
      style={{
        opacity: showBanner ? 1 : 0,
        transition: 'opacity 0.1s',
      }}
    >
      <div
        className="vector-banner-top flex flex-col items-center justify-center px-8 aspect-square w-screen md:w-[50vw] max-w-screen md:max-w-[50vw]"
        style={{ minWidth: 0, minHeight: 0 }}
      >
        {/* Title style */}
        <div
          style={{
            overflow: 'visible',
            paddingTop: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerWidth < window.innerHeight) ? '1.2em' : '2.5em',
            paddingRight: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerWidth < window.innerHeight) ? '0.5em' : '2.5em',
            paddingBottom: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerWidth < window.innerHeight) ? '0.5em' : '0.5em',
            paddingLeft: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerWidth < window.innerHeight) ? '0.5em' : '3.5em',
            margin: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerWidth < window.innerHeight) ? '1em 0 0.5em 0' : '2em 0 0.5em 0',
            textAlign: 'center',
          }}
        >
          <h1
            ref={refTitle}
            className={`font-bold uppercase text-[15vw] md:text-[7.5vw] w-full text-center flex items-center justify-center ${glitchClassTitle}`}
            style={titleStyle}
          >
            <span className="swipe-reveal" style={{ overflow: 'visible', display: 'inline' }}>&nbsp;Vector Art</span>
          </h1>
        </div>
        <div
          className="mt-3 w-full px-8 text-center"
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <p style={{ color: '#FDF8F3', ...captionStyle }}>
            <span
              className="swipe-reveal"
            >
              I used to hate Adobe Illustrator. I’m obsessed with details and always felt vector art forced things to be simplified.
            </span>
          </p>
          <p style={{ color: '#FDF8F3', marginTop: '1em', ...captionStyle }}>
            {showDelayedCaption && (
              <MarkerHighlightInView style={{ fontSize: 'clamp(1rem, 1.5vw, 1.35rem)' }}>
                I have since changed my mind.
              </MarkerHighlightInView>
            )}
          </p>
        </div>
      </div>
      <div
        className="vector-banner-bottom flex items-center justify-center overflow-hidden aspect-square w-screen md:w-[50vw] max-w-screen md:max-w-[50vw]"
        style={{ minWidth: 0, minHeight: 0, position: 'relative' }}
      >
        <img
          src="/vector-art/BannerArt_VA.png"
          alt="Banner artwork"
          className="object-cover w-full h-full"
          style={{
            borderRadius: 0,
            objectPosition: 'center',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
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
              <div key={idx} className="project-container w-full aspect-[16/9] lg:h-screen bg-white dark:bg-gray-800 shadow overflow-hidden relative flex flex-col justify-center">
                <div className="relative w-full flex flex-col justify-center">
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
              <div key={idx} className="sliver-gallery-container w-full aspect-[16/9] lg:h-screen bg-white dark:bg-gray-800 shadow overflow-hidden relative flex flex-col justify-center">
                <div className="relative w-full flex flex-col justify-center">
                  <ExpandingSliverGallery images={project.sliverImgs} alt={project.title} />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                    <InfoPill text={`Project info goes here...`} />
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div key={idx} className="project-container w-full aspect-[16/9] lg:h-screen bg-white dark:bg-gray-800 shadow overflow-hidden relative flex flex-col justify-center">
              <div className="relative w-full flex flex-col justify-center">
                <img
                  src={project.img || ""}
                  alt={project.title || ""}
                  className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105"
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
      {/* Mobile notification banner */}
      {isMobile !== undefined && isMobile && orientation === 'portrait' && mobileBanner}
    </div>
  );
} 