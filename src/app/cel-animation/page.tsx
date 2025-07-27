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
import PixelArtSprite from "../../components/PixelArtSprite";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/vector-art", label: "Vector Art" },
  { href: "/cel-animation", label: "Cel Animation" },
  { href: "/illustration-2d", label: "2D Illustration" },
  { href: "/illustration-3d", label: "3D Illustration" },
  { href: "/contact", label: "Contact" },

];

const projects: Array<{
  title: string;
  img?: string;
  info: string;
  sliverImgs?: string[];
  video?: string;
}> = [
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

// Remove PixelArtSpriteAnimation component and all raccoon sprite logic

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
            paddingTop: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerHeight < window.innerWidth) ? '1.2em' : '2.5em',
            paddingRight: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerHeight < window.innerWidth) ? '0.5em' : '2.5em',
            paddingBottom: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerHeight < window.innerWidth) ? '0.5em' : '0.5em',
            paddingLeft: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerHeight < window.innerWidth) ? '0.5em' : '3.5em',
            margin: typeof window !== 'undefined' && (window.innerWidth <= 700 || window.innerHeight < window.innerWidth) ? '1em 0 0.5em 0' : '2em 0 0.5em 0',
            textAlign: 'center',
          }}
        >
          <h1
            ref={refTitle}
            className={`font-bold uppercase text-[10vw] md:text-[5vw] w-full text-center flex items-center justify-center ${glitchClassTitle}`}
            style={titleStyle}
          >
            <span className="swipe-reveal" style={{ overflow: 'visible', display: 'inline' }}>&nbsp;Cel Animation</span>
          </h1>
        </div>
        <div
          className="mt-3 w-full px-8 text-center"
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <p style={{ color: '#FDF8F3', ...captionStyle }}>
            <span className="swipe-reveal">
              Although I studied 3D and specialised in character modelling, somehow my career steered me towards cel animation.
            </span>
          </p>
          <p style={{ color: '#FDF8F3', marginTop: '1em', ...captionStyle }}>
            {showDelayedCaption && (
              <MarkerHighlightInView style={{ fontSize: 'clamp(1rem, 1.5vw, 1.35rem)' }}>
                I hope to never lose the childlike joy of hitting play and seeing things move.
              </MarkerHighlightInView>
            )}
          </p>
        </div>
        {/* Remove the sprite from the banner image half, only render in the text half */}
      </div>
      <div
        className="vector-banner-bottom flex items-center justify-center overflow-hidden aspect-square w-screen md:w-[50vw] max-w-screen md:max-w-[50vw]"
        style={{ minWidth: 0, minHeight: 0, position: 'relative', zIndex: 2 }}
      >
        <video
          src="/cel-animation/JOPLYN/converted/SkillsetAnim_Cel.mp4"
          className="object-cover w-full h-full"
          style={{
            borderRadius: 0,
            objectPosition: 'center',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setBannerLoaded(true)}
        />
        <div className="vhs-noise"></div>
        {bannerLoaded && <div className="scanlines"></div>}
        {/* Remove the sprite from the banner image half, only render in the text half */}
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

  const celAnimationGalleryItems: import("../MasonryGallery").MasonryGalleryItem[] = [
    { src: "/cel-animation/JOPLYN/converted/LOOP03.mp4", hdSrc: "/cel-animation/JOPLYN/LOOP03.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/converted/05_JOPLYN_KeepMeInYourMind_4K.mp4", hdSrc: "/cel-animation/JOPLYN/05_JOPLYN_KeepMeInYourMind_4K.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/converted/01_JOPLYN_Stains_4K.mp4", hdSrc: "/cel-animation/JOPLYN/01_JOPLYN_Stains_4K.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/converted/02_JOPLYN_Clay_4K.mp4", hdSrc: "/cel-animation/JOPLYN/02_JOPLYN_Clay_4K.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/converted/03_JOPLYN_IWantToBelieve_4K.mp4", hdSrc: "/cel-animation/JOPLYN/03_JOPLYN_IWantToBelieve_4K.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/converted/04_JOPLYN_RemindMe_4K.mp4", hdSrc: "/cel-animation/JOPLYN/04_JOPLYN_RemindMe_4K.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/converted/06_JOPLYN_Falling_4K.mp4", hdSrc: "/cel-animation/JOPLYN/06_JOPLYN_Falling_4K.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/converted/07_JOPLYN_GoBack_Looped_4K.mp4", hdSrc: "/cel-animation/JOPLYN/07_JOPLYN_GoBack_Looped_4K.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/converted/08_JOPLYN_Circles_4K.mp4", hdSrc: "/cel-animation/JOPLYN/08_JOPLYN_Circles_4K.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/converted/09_JOPLYN_BreatheMeIn_4K.mp4", hdSrc: "/cel-animation/JOPLYN/09_JOPLYN_BreatheMeIn_4K.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/converted/09_JOPLYN_BreatheMeIn_BreathingAnimation_4K.mp4", hdSrc: "/cel-animation/JOPLYN/09_JOPLYN_BreatheMeIn_BreathingAnimation_4K.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/converted/10_JOPLYN_BringMeHome_4K.mp4", hdSrc: "/cel-animation/JOPLYN/10_JOPLYN_BringMeHome_4K.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/converted/11_JOPLYN_CanYouSeeIt_4K.mp4", hdSrc: "/cel-animation/JOPLYN/11_JOPLYN_CanYouSeeIt_4K.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/converted/SkillsetAnim_Cel.mp4", hdSrc: "/cel-animation/JOPLYN/SkillsetAnim_Cel.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/converted/LOOP04.mp4", hdSrc: "/cel-animation/JOPLYN/LOOP04.mp4", type: "video", orientation: "landscape" },
    // Add new images and sticker
    { src: "/cel-animation/JOPLYN/CharacterDesign_LINEUP_reformat.png", type: "image", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/JOPLYN_CharacterDesign+Turn.mp4", type: "video", orientation: "landscape" },
    { src: "/cel-animation/JOPLYN/JOP_Sticker_LARGE-01.png", type: "image", orientation: "portrait" },
  ];

  return (
    <div style={{ background: '#E4A4BD', position: 'relative', minHeight: '100vh' }} className="flex flex-col items-center">
      <HamburgerMenu />
      {/* Top banner */}
      <div className="w-full">
        <div style={{position: 'relative', width: '100%', height: '100%'}}>
          <PixelArtSprite
            basePath="/cel-animation/sprites/retimed/SPACECOW_Master_"
            frameCount={606}
            idleEnd={605}
            runStart={0}
            runEnd={605}
            trigger={false}
            style={{
              position: 'absolute',
              top: '75%',
              left: '90%',
              width: 'min(220px, 22vw)',
              zIndex: 1, // behind the banner image
              pointerEvents: 'none',
              transform: 'scale(8) translateX(-100%)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
        {topBanner}
          </div>
        </div>
      </div>
      {/* New stacked images overlay project */}
      <div className="w-full max-w-full" style={{position: 'relative', minHeight: '400px'}}>
        {/* BAMBI sprite at the top left, mirrored, 400% scale, only on landscape, runs when overlay is opened */}
        {orientation === 'landscape' && (
          <PixelArtSprite
            basePath="/cel-animation/sprites/retimed/BAMBI_"
            frameCount={107}
            idleEnd={60}
            runStart={61}
            runEnd={106}
            trigger={openOverlayIndex === 0}
            style={{
              transform: 'scaleX(-4) scaleY(4)',
              position: 'absolute',
              top: 0,
              left: '0.5vw',
              width: 'clamp(120px, 18vw, 240px)',
              zIndex: 20,
              pointerEvents: 'none',
            }}
          />
        )}
        <MasonryGallery
          title="JOPLYN"
          company="@ None of the Above"
          software="Toon Boom Harmony"
          description="a series of 14 animations and visuals I made for JOPLYN's album Stains. Since we were short on time, I limited the longer animations to 4FPS. Sometimes I feel the urge to go in and smooth them out, but I still feel it holds up pretty well."
          items={celAnimationGalleryItems}
          overlayColor="rgba(239, 20, 129, 0.5)"
          isOpen={openOverlayIndex === 0}
          onOpen={() => setOpenOverlayIndex(0)}
          onClose={() => setOpenOverlayIndex(null)}
          columns={3}
        />
      </div>
      <div className="w-full flex flex-col items-center">
        {/* HYGH Series (Masonry) moved here above the video project */}
        <MasonryGallery
          title="June's Journey - Catch the Cat"
          company="@ Wooga x CCCB"
          software="toon boom harmony"
          description="late last year I collaborated with cbbb , wolfspack and wooga to create a promotional video for the much-loved June's journey, featuring a live action background and character, and an animated cat. the goal was to capture the aesthetic of June's Journey in a cel-animation style, integrating it seamlessly with live-action backgrounds while delivering high-quality results quickly."
          items={[
            { src: "/cel-animation/WOOGA/Makingof0001.png", type: "image", orientation: "landscape" },
            { src: "/cel-animation/WOOGA/Makingof0002.png", type: "image", orientation: "landscape" },
            { src: "/cel-animation/WOOGA/converted/CatchTheCat_MakingOf.mp4", hdSrc: "/cel-animation/WOOGA/CatchTheCat_MakingOf.mp4", type: "video", orientation: "landscape" },
            { src: "/cel-animation/WOOGA/converted/Jj H Ua-Liveaction Catchthecat 30S En 1920X1080 Cta.mp4", hdSrc: "/cel-animation/WOOGA/Jj H Ua-Liveaction Catchthecat 30S En 1920X1080 Cta.mp4", type: "video", orientation: "landscape" },
          ]}
          overlayColor="rgba(133, 219, 216, 0.5)"
          isOpen={openOverlayIndex === 4}
          onOpen={() => setOpenOverlayIndex(4)}
          onClose={() => setOpenOverlayIndex(null)}
          columns={2}
          zoomScale={1.1}
        />
        <div style={{ position: 'relative', width: '100%' }}>
          {/* Raccoon sprite at the top left, mirrored, 600% scale, only on landscape, runs when overlay is opened */}
          {orientation === 'landscape' && (
                        <PixelArtSprite
              basePath="/cel-animation/sprites/retimed/RACCOON_"
              frameCount={129}
              idleEnd={0}
              runStart={0}
              runEnd={128}
              trigger={openOverlayIndex === 104}
              style={{
                transform: 'scaleX(-12) scaleY(12)',
                position: 'absolute',
                top: '170px',
                left: 'calc(2vw + 30px)',
                width: 'clamp(120px, 18vw, 240px)',
                zIndex: 20,
                pointerEvents: 'none',
              }}
            />
          )}
          <MasonryGallery
            title="geberit"
            company="@ katalyst"
            software="toon boom harmony"
            description="this was my first experience creating cel animation as an overlay for live action footage, and i loved the challenge of creating something smooth enough not to be jarring, whilst still embracing the hand-drawn quality of the medium."
            items={[
              { src: "/cel-animation/GEBERIT_KATALYST/converted/Mountaineer.mp4", hdSrc: "/cel-animation/GEBERIT_KATALYST/Mountaineer.mov", type: "video", orientation: "landscape" },
              { src: "/cel-animation/GEBERIT_KATALYST/converted/8aY7k4GvsYw_576.mp4", hdSrc: "/cel-animation/GEBERIT_KATALYST/8aY7k4GvsYw_576.mp4", type: "video", orientation: "landscape" },
              { src: "/cel-animation/GEBERIT_KATALYST/converted/EJnj8GHKj_C_576.mp4", hdSrc: "/cel-animation/GEBERIT_KATALYST/EJnj8GHKj_C_576.mp4", type: "video", orientation: "landscape" },
              { src: "/cel-animation/GEBERIT_KATALYST/converted/UzMuRZqFubT_576.mp4", hdSrc: "/cel-animation/GEBERIT_KATALYST/UzMuRZqFubT_576.mp4", type: "video", orientation: "landscape" },
            ]}
            overlayColor="rgba(200, 210, 60, 0.5)"
            isOpen={openOverlayIndex === 104}
            onOpen={() => setOpenOverlayIndex(104)}
            onClose={() => setOpenOverlayIndex(null)}
            columns={2}
            zoomScale={1.1}
          />
        </div>
        <div style={{ position: 'relative', width: '100%' }}>
          {/* Cockerel sprite at the top left, mirrored, 400% scale, only on landscape, runs when overlay is opened */}
          {orientation === 'landscape' && (
            <PixelArtSprite
              basePath="/cel-animation/sprites/retimed/COCKEREL_"
              frameCount={130}
              idleEnd={0}
              runStart={0}
              runEnd={129}
              trigger={openOverlayIndex === 204}
              style={{
                transform: 'scaleX(-4) scaleY(4)',
                position: 'absolute',
                top: '130px',
                left: 'calc(2vw - 120px)',
                width: 'clamp(120px, 18vw, 240px)',
                zIndex: 20,
                pointerEvents: 'none',
              }}
            />
          )}
          <MasonryGallery
            title="ortovox"
            company="@ storz&escherich"
            software="toon boom harmony"
            description="an ad campaign I created for ski clothing company Ortovox, centered around the adventures of their mascot - a sheep who goes on a fitness journey."
            items={[
              { src: "/cel-animation/S&E/converted/Episode01.mp4", hdSrc: "/cel-animation/S&E/Episode01.mp4", type: "video", orientation: "landscape" },
              { src: "/cel-animation/S&E/converted/Episode02.mp4", hdSrc: "/cel-animation/S&E/Episode02.mp4", type: "video", orientation: "landscape" },
              { src: "/cel-animation/S&E/converted/nextup.mp4", hdSrc: "/cel-animation/S&E/nextup.mp4", type: "video", orientation: "landscape" },
              { src: "/cel-animation/S&E/converted/gif02.mp4", hdSrc: "/cel-animation/S&E/gif02.mp4", type: "video", orientation: "landscape" },
              { src: "/cel-animation/S&E/converted/gif04.mp4", hdSrc: "/cel-animation/S&E/gif04.mp4", type: "video", orientation: "landscape" },
              { src: "/cel-animation/S&E/converted/gif01.mp4", hdSrc: "/cel-animation/S&E/gif01.mp4", type: "video", orientation: "landscape" },
              { src: "/cel-animation/S&E/converted/gif03.mp4", hdSrc: "/cel-animation/S&E/gif03.mp4", type: "video", orientation: "landscape" },
              { src: "/cel-animation/S&E/converted/woolyAnimationTest.mp4", hdSrc: "/cel-animation/S&E/woolyAnimationTest.mov", type: "video", orientation: "landscape" },
            ]}
            overlayColor="rgba(239, 20, 129, 0.5)"
            isOpen={openOverlayIndex === 204}
            onOpen={() => setOpenOverlayIndex(204)}
            onClose={() => setOpenOverlayIndex(null)}
            columns={2}
            zoomScale={1.1}
          />
        </div>
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
        {/* New project with blue overlay */}
        <MasonryGallery
          title="ROCHE"
          company="@ 908"
          software="toon boom harmony"
          description="some of the first things I ever did in cel animation  - along with the pixel animals you may have noticed bouncing around the page. Most old work doesn't hold up - but I quite like these"
          items={[
            { src: "/cel-animation/908/converted/Roche _ Mut macht Originale - Christoph Kolumbus (1080p with 24fps).mp4", hdSrc: "/cel-animation/908/Roche _ Mut macht Originale - Christoph Kolumbus (1080p with 24fps).mp4", type: "video", orientation: "landscape" },
            { src: "/cel-animation/908/converted/Roche _ Mut macht Originale - Thomas Edison (1080p with 24fps).mp4", hdSrc: "/cel-animation/908/Roche _ Mut macht Originale - Thomas Edison (1080p with 24fps).mp4", type: "video", orientation: "landscape" },
            { src: "/cel-animation/908/AvL Brand Storyworlds (720p with 25fps)_compressed.mp4", hdSrc: "/cel-animation/908/AvL Brand Storyworlds (720p with 25fps)_compressed.mp4", type: "video", orientation: "landscape" },
          ]}
          overlayColor="rgba(133, 219, 216, 0.5)"
          isOpen={openOverlayIndex === 304}
          onOpen={() => setOpenOverlayIndex(304)}
          onClose={() => setOpenOverlayIndex(null)}
          columns={2}
          zoomScale={1.1}
        />
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
        img[src*="JOP_Sticker_LARGE-01.png"] {
          border-radius: 50%;
          object-fit: cover;
          background: transparent !important;
        }
        .masonry-gallery-item img[src*="JOP_Sticker_LARGE-01.png"] {
          background: transparent !important;
        }
        .masonry-gallery-item:has(img[src*="JOP_Sticker_LARGE-01.png"]) {
          background: transparent !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
} 