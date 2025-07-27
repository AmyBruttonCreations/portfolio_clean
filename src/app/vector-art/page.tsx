"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCallback } from "react";
import HamburgerMenu from "../HamburgerMenu";
import InfoBox from "../InfoBox";
import React from "react";
import { useIsMobile } from '../../utils/useIsMobile';
import { useInViewAnimation, MarkerHighlightInView } from '../MarkerHighlightInView';
import MasonryGallery from "../MasonryGallery";

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
    info: `I made this for my brother. He has a huge canvas print of it in his flat.  I don’t mind seeing it, and that says a lot.`,
  },
  {
    title: "Pet Portraits",
    img: "/vector-art/PetPortrait.png",
    info: "Since I generally work from home, I often pet-sit for friends with non-dog friendly offices. Inevitably, those dogs become my muses. Pictured here are Tara and Sunce.",
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
    info: "Besides cel animation, I get a lot of commissions requiring me to turn stock photos into something with more aesthetic personality. These are some examples of that.",
  },
  {
    title: "Equal Video",
    video: "/vector-art/equal.mp4",
    info: "This was my first collaboration with the wonderful Markus Hoffmann. We were inspired by one-line tattoos to create a series of illustrations that all fed into each other. I made all the visuals, and Markus was responsible for the animation.",
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
        width: (hovered || toggled) ? 'fit-content' : 40,
        maxWidth: '90vw',
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
            whiteSpace: 'normal',
            width: '100%',
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

// Add VideoProjectOverlay component for video overlays
const defaultOverlayColor = 'rgba(200, 210, 60, 0.5)';
type VideoProjectOverlayProps = {
  videoSrc: string;
  title: string;
  company: string;
  software: string;
  description: string;
  overlayColor?: string;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};
function VideoProjectOverlay({
  videoSrc,
  title,
  company,
  software,
  description,
  overlayColor = defaultOverlayColor,
  isOpen,
  onOpen,
  onClose,
}: VideoProjectOverlayProps) {
  const overlayRef = useRef(null);

  // Helper to get solid color from overlayColor
  function getSolidColor(color: string) {
    // If rgba, convert to rgb
    const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (rgbaMatch) {
      const [_, r, g, b] = rgbaMatch;
      return `rgb(${r},${g},${b})`;
    }
    // If already rgb, return as is
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) return color;
    // Fallback to default
    return 'rgb(200,210,60)';
  }
  const solidLineColor = getSolidColor(overlayColor);

  // Snap overlay back if scrolled out of view
  useEffect(() => {
    if (!isOpen) return;
    const ref = overlayRef.current;
    if (!ref) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.5 && onClose) {
          onClose();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [isOpen, onClose]);

  return (
    <div className="w-full aspect-[16/9] lg:h-screen bg-white dark:bg-gray-800 shadow overflow-hidden relative flex flex-col justify-center" ref={overlayRef} style={{ minHeight: 320 }}>
      {/* Dashed line at the top, now matches overlay color */}
      <div
        style={{
          borderTop: `4px dashed ${solidLineColor}`,
          width: '100%',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
        }}
      />
      {/* SVG arrow for a tall, flattened triangle with cream glow, always visible, flips direction and color based on overlay state */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '10%',
          minWidth: 48,
          maxWidth: 96,
          zIndex: 1000,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          transition: 'opacity 0.7s',
          opacity: 1,
          background: 'transparent',
        }}
        aria-label={isOpen ? 'Close overlay' : 'Open overlay'}
        onClick={() => (isOpen ? onClose && onClose() : onOpen && onOpen())}
      >
        <div style={{ marginLeft: 24, width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg
            className={!isOpen ? 'bouncy-arrow' : ''}
            width="24"
            height="64"
            viewBox="0 0 24 64"
            style={{
              display: 'block',
              filter: isOpen
                ? `drop-shadow(0 0 3px ${overlayColor}) drop-shadow(0 0 6px ${overlayColor})`
                : 'drop-shadow(0 0 3px #FDF8F3) drop-shadow(0 0 6px #FDF8F3)',
              transform: isOpen ? 'scaleX(-1)' : 'scaleX(1)',
              transition: 'filter 0.3s, transform 0.7s',
            }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="0,0 24,32 0,64" fill={isOpen ? overlayColor : '#FDF8F3'} />
          </svg>
        </div>
      </div>
      {/* Video always visible as background */}
      <div className="w-full h-full flex items-center justify-center" style={{ position: 'relative', zIndex: 0 }}>
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
          style={{ borderRadius: 0 }}
        />
      </div>
      {/* Overlay slides fully off-screen to the left when openOverlay is true */}
      <div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer transition-transform duration-700"
        style={{
          background: `linear-gradient(to left, ${(overlayColor || defaultOverlayColor).replace('0.5', '1')} 0%, ${overlayColor || defaultOverlayColor} 100%)`,
          opacity: 1,
          zIndex: 1,
          transform: isOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.7s ease',
          width: '100%',
          height: '100%',
        }}
        // No click handler here; arrow handles open/close
      >
        {!isOpen && (
          <div className="w-full h-full flex flex-col justify-center" style={{
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            textAlign: 'right',
            background: 'transparent',
            margin: 0,
            padding: 0,
            justifyContent: 'center',
            zIndex: 2,
          }}>
            <div
              className="overlay-text"
              style={{
                fontWeight: 900,
                fontSize: 'clamp(1rem, 4vw, 2.4rem)',
                textAlign: 'right',
                color: '#FDF8F3',
                textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
                width: '100%',
                paddingRight: '3vw',
                marginBottom: '0.2em',
                letterSpacing: '0.04em',
                fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
                textTransform: 'uppercase',
              }}
            >
              {title}
            </div>
            <div
              className="overlay-text"
              style={{
                fontWeight: 400,
                fontSize: 'clamp(0.85rem, 2.5vw, 1.35rem)',
                color: '#FDF8F3',
                fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
                textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
                textTransform: 'lowercase',
                margin: '0.5em 0',
                textAlign: 'right',
                width: '100%',
                paddingRight: '3vw',
              }}
            >
              {company}
            </div>
            <div
              className="overlay-text"
              style={{
                fontWeight: 400,
                fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
                color: '#FDF8F3',
                fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
                textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
                textTransform: 'lowercase',
                margin: '0.5em 0',
                textAlign: 'right',
                width: '100%',
                paddingRight: '3vw',
              }}
            >
              {software}
            </div>
            <div
              className="overlay-text"
              style={{
                fontWeight: 400,
                fontSize: 'clamp(0.8rem, 2vw, 1.1rem)',
                color: '#FDF8F3',
                fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
                textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
                textTransform: 'lowercase',
                margin: '0.5em 0',
                textAlign: 'right',
                width: '25%',
                minWidth: 200,
                maxWidth: 400,
                paddingRight: '3vw',
                alignSelf: 'flex-end',
                boxSizing: 'border-box',
              }}
            >
              {description}
            </div>
          </div>
        )}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 3,
            }}
            onClick={onClose}
          />
        )}
      </div>
    </div>
  );
}

export default function VectorArt() {
  const [openOverlayIndex, setOpenOverlayIndex] = useState<number | null>(null);
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
  };
  // Caption style (less bold)
  const captionStyle: React.CSSProperties = {
    fontWeight: 400,
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
            className={`font-bold uppercase text-[10vw] md:text-[5vw] w-full text-center flex items-center justify-center ${glitchClassTitle}`}
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

  const stackedImages = [
    "/vector-art/pulpfiction.jpg",
    "/vector-art/PetPortrait.png"
  ];

  return (
    <div style={{ background: '#E4A4BD' }} className="flex flex-col items-center">
      <HamburgerMenu />
      {/* Top banner */}
      <div className="w-full">
        {topBanner}
      </div>
      {/* New stacked images overlay project */}
      <div className="w-full max-w-full">
        <MasonryGallery
          title="Commissions"
          company="@ personal"
          software="Adobe Illustrator"
          description="I love pushing the boundaries of detailing in vector art - the challenge of capturing lights with shapes reminds me of digital impressionism. Also: endlessly scalable. "
          items={stackedImages.map(src => ({ src, type: 'image', orientation: 'landscape' }))}
          overlayColor="rgba(239, 20, 129, 0.5)"
          isOpen={openOverlayIndex === 0}
          onOpen={() => setOpenOverlayIndex(0)}
          onClose={() => setOpenOverlayIndex(null)}
          stacked={true}
          zoomScale={1.1}
        />
      </div>
      <div className="w-full flex flex-col items-center">
        {/* HYGH Series (Masonry) moved here above the video project */}
        <MasonryGallery
          title="corporate design"
          company="@ HYGH ag"
          software="adobe illustrator"
          description="Besides cel animation, I get a lot of commissions requiring me to turn stock photos into something with more aesthetic personality. These are some examples of that."
          items={[
            'hygh (1).png',
            'hygh (2).png',
            'hygh (3).png',
            'hygh (4).png',
            'hygh (5).png',
            'hygh (6).png',
            'hygh (7).png',
          ].map(name => ({ src: `/vector-art/${name}`, type: 'image', orientation: 'landscape' }))}
          overlayColor="rgba(133, 219, 216, 0.5)"
          isOpen={openOverlayIndex === 4}
          onOpen={() => setOpenOverlayIndex(4)}
          onClose={() => setOpenOverlayIndex(null)}
          columns={2}
          zoomScale={1.1}
        />
        {/* Video and other projects */}
        {projects.slice(2).map((project, idx) => {
          // Video project logic
          if (project.video) {
            return (
              <VideoProjectOverlay
                key={idx}
                videoSrc={project.video}
                title={idx === 1 ? "EQUAL // last night in Paris" : project.title}
                company={idx === 1 ? "Storz&Escherich" : "Collab: Markus Hoffmann"}
                software={idx === 1 ? "Adobe Illustrator + After Effects" : "After Effects, Illustrator"}
                description={project.info}
                overlayColor={defaultOverlayColor}
                isOpen={openOverlayIndex === 1000 + idx}
                onOpen={() => setOpenOverlayIndex(1000 + idx)}
                onClose={() => setOpenOverlayIndex(null)}
              />
            );
          }
          // Expanding sliver gallery logic
          if (project.sliverImgs) {
            return null;
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
                {/* InfoPill removed as per request */}
              </div>
            </div>
          );
        })}
      </div>
      <div className="w-full flex flex-col items-center">
        {/* Standard MasonryGallery for second sliver gallery images */}
        {Array.isArray(projects[4]?.sliverImgs) && (
            <MasonryGallery
              title="VW Pitch"
              company="Storz&Escherich"
              software="Adobe Illustrator"
              description="a pitch I did for VW that I'm still quite fond of. "
              items={projects[4].sliverImgs.map(src => ({ src, type: 'image', orientation: 'landscape' }))}
              overlayColor="rgba(239, 20, 129, 0.5)"
              isOpen={openOverlayIndex === 1004}
              onOpen={() => setOpenOverlayIndex(1004)}
              onClose={() => setOpenOverlayIndex(null)}
              columns={2}
              zoomScale={1.1}
            topLineColor="rgb(239,20,129)"
          />
        )}
      </div>
      {/* Mobile notification banner */}
      {isMobile !== undefined && isMobile && orientation === 'portrait' && mobileBanner}
      {/* Add bouncy-arrow animation keyframes if not already present */}
      <style jsx global>{`
        @keyframes arrow-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
        .bouncy-arrow {
          animation: arrow-pulse 1s cubic-bezier(.68,-0.6,.32,1.6) infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
} 