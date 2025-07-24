"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCallback } from "react";
import HamburgerMenu from "../HamburgerMenu";
import InfoBox from "../InfoBox";
import React from "react";
import { useIsMobile } from '../../utils/useIsMobile';
import { useInViewAnimation, MarkerHighlightInView } from '../MarkerHighlightInView';
import ProjectOverlayGallery from '../ProjectOverlayGallery';
import MasonryGallery, { MasonryGalleryItem } from "../MasonryGallery";
import LightboxModal from '../../components/LightboxModal';
import MobileBanner from '../../components/MobileBanner';

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/vector-art", label: "Vector Art" },
  { href: "/cel-animation", label: "Cel Animation" },
  { href: "/illustration-2d", label: "2D Illustration" },
  { href: "/illustration-3d", label: "3D Illustration" },
  { href: "/contact", label: "Contact" },

];

const galleryImages = [
  { thumb: '/2D-3D-illustration/thumbs/TRIAD_HD (1).jpg', hd: '/2D-3D-illustration/TRIAD_HD (1).png' },
  { thumb: '/2D-3D-illustration/thumbs/TRIAD_HD (5).jpg', hd: '/2D-3D-illustration/TRIAD_HD (5).png' },
  { thumb: '/2D-3D-illustration/thumbs/TRIAD_HD (6).jpg', hd: '/2D-3D-illustration/TRIAD_HD (6).png' },
  { thumb: '/2D-3D-illustration/thumbs/TRIAD_HD (7).jpg', hd: '/2D-3D-illustration/TRIAD_HD (7).png' },
  { thumb: '/2D-3D-illustration/thumbs/TRIAD_HD (8).jpg', hd: '/2D-3D-illustration/TRIAD_HD (8).png' },
  { thumb: '/2D-3D-illustration/thumbs/TRIAD_HD (9).jpg', hd: '/2D-3D-illustration/TRIAD_HD (9).png' },
  { thumb: '/2D-3D-illustration/thumbs/TRIAD_HD (10).jpg', hd: '/2D-3D-illustration/TRIAD_HD (10).png' },
  { thumb: '/2D-3D-illustration/thumbs/TRIAD_HD (11).jpg', hd: '/2D-3D-illustration/TRIAD_HD (11).png' },
  { thumb: '/2D-3D-illustration/thumbs/TRIAD_HD (12).jpg', hd: '/2D-3D-illustration/TRIAD_HD (12).png' },
  { thumb: '/2D-3D-illustration/thumbs/TRIAD_HD (15).jpg', hd: '/2D-3D-illustration/TRIAD_HD (15).png' },
];
const overlayColors = [
  'rgba(239, 20, 129, 0.5)', // magenta
  'rgba(133, 219, 216, 0.5)', // blue
  'rgba(200, 210, 60, 0.5)', // darker yellow
];

// Expanding sliver gallery component
function ExpandingSliverGallery({ images, alt, onImageClick }: { images: string[]; alt: string, onImageClick?: (img: string) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className="relative w-full h-screen flex flex-row overflow-hidden">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={alt}
          loading="lazy"
          className={`h-full w-full object-cover cursor-pointer transition-all duration-500 ${hovered === i ? 'flex-[30]' : 'flex-[1]'}`}
          style={{
            minWidth: 0,
            zIndex: hovered === i ? 2 : 1,
            transform: hovered === i ? 'scale(1.5)' : 'scale(1)',
            transition: 'transform 0.3s',
          }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onImageClick && onImageClick(img)}
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
    fontSize: 'clamp(1rem, 1.5vw, 1.35rem)',
    color: '#FDF8F3',
    fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
    textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
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
  // Overlay open/close state for overlay projects
  const [openOverlayIndex, setOpenOverlayIndex] = useState<number | null>(null);
  // Refs for overlay projects
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Track hovered image index for each overlay project by project index
  const [galleryHovered, setGalleryHovered] = useState<{ [projectIdx: number]: number | null }>({});

  // Intersection Observer to close overlay when scrolled out of view
  useEffect(() => {
    if (openOverlayIndex === null) return;
    const ref = overlayRefs.current[openOverlayIndex];
    if (!ref) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.5) {
          setOpenOverlayIndex(null);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [openOverlayIndex]);

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
    <MobileBanner open={showMobileBanner} onClose={() => setShowMobileBanner(false)}>
      Pssst - all of this looks so much better in landscape. Feel free to rotate your phone or give it a spin on your laptop &lt;3 !
    </MobileBanner>
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
            <span className="swipe-reveal" style={{ overflow: 'visible', display: 'inline' }}>&nbsp;2D & 3D Illustration</span>
          </h1>
        </div>
        <div
          className="mt-3 w-full px-8 text-center"
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <p style={{ color: '#FDF8F3', ...captionStyle }}>
            I normally tell people I’m a picture maker, because I make visuals in so many different mediums.<br /><br />
            {showDelayedCaption && (
              <MarkerHighlightInView style={{ fontSize: 'clamp(1rem, 1.5vw, 1.35rem)' }}>
                Here are some pictures I made.
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
          src="/2D-3D-illustration/bannerimage_2D.png"
          alt="2D & 3D Illustration Banner artwork"
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

  const lightboxModal = (
    <LightboxModal
      open={!!lightbox?.open}
      src={lightbox?.img || ''}
      type="image"
      onClose={() => setLightbox(null)}
      alt="Lightbox"
    />
  );

  const speedpaintGallery = [
    { thumb: '/2D-3D-illustration/thumbs/speedpaint (1).jpg', hd: '/2D-3D-illustration/speedpaint (1).png' },
    { thumb: '/2D-3D-illustration/thumbs/speedpaint (2).jpg', hd: '/2D-3D-illustration/speedpaint (2).png' },
    { thumb: '/2D-3D-illustration/thumbs/speedpaint (3).jpg', hd: '/2D-3D-illustration/speedpaint (3).png' },
    { thumb: '/2D-3D-illustration/thumbs/speedpaint (4).jpg', hd: '/2D-3D-illustration/speedpaint (4).png' },
    { thumb: '/2D-3D-illustration/thumbs/speedpaint (1).jpg', hd: '/2D-3D-illustration/speedpaint (1).png' },
    { thumb: '/2D-3D-illustration/thumbs/speedpaint (2).jpg', hd: '/2D-3D-illustration/speedpaint (2).png' },
    { thumb: '/2D-3D-illustration/thumbs/speedpaint (3).jpg', hd: '/2D-3D-illustration/speedpaint (3).png' },
    { thumb: '/2D-3D-illustration/thumbs/speedpaint (4).jpg', hd: '/2D-3D-illustration/speedpaint (4).png' },
  ];

  const odysseyGallery = [
    { thumb: '/2D-3D-illustration/thumbs/OD_Concepts (1).jpg', hd: '/2D-3D-illustration/OD_Concepts (1).png' },
    { thumb: '/2D-3D-illustration/thumbs/OD_Concepts (3).jpg', hd: '/2D-3D-illustration/OD_Concepts (3).png' },
    { thumb: '/2D-3D-illustration/thumbs/OD_Concepts (4).jpg', hd: '/2D-3D-illustration/OD_Concepts (4).png' },
    { thumb: '/2D-3D-illustration/thumbs/OD_Concepts (5).jpg', hd: '/2D-3D-illustration/OD_Concepts (5).png' },
    { thumb: '/2D-3D-illustration/thumbs/ODYSSEA_Cover.jpg', hd: '/2D-3D-illustration/ODYSSEA_Cover.png' },
    { thumb: '/2D-3D-illustration/thumbs/ODYSSEA_Cover_Front.jpg', hd: '/2D-3D-illustration/ODYSSEA_Cover_Front.png' },
    { thumb: '/2D-3D-illustration/thumbs/ODYSSEA_Cover (01).jpg', hd: '/2D-3D-illustration/ODYSSEA_Cover (01).png' },
  ];

  // Odyssea project items for MasonryGallery
  const odysseaItems: MasonryGalleryItem[] = [
    { src: "/2D-3D-illustration/OD_Concepts_Portrait.png", type: "image", orientation: "portrait" },
    { src: "/2D-3D-illustration/OD_Concepts_Portrait (2).png", type: "image", orientation: "portrait" },
    { src: "/2D-3D-illustration/OD_Concepts_Portrait (3).png", type: "image", orientation: "portrait" },
    { src: "/2D-3D-illustration/OD_Concepts_Portrait (4).png", type: "image", orientation: "portrait" },
    { src: "/2D-3D-illustration/OD_Pages_Portrait.png", type: "image", orientation: "portrait" },
    { src: "/2D-3D-illustration/ODYSSEA_Cover_Front_Portrait.png", type: "image", orientation: "portrait" },
    { src: "/2D-3D-illustration/OD_Turn_Portrait.mp4", type: "video", orientation: "portrait" },
    { src: "/2D-3D-illustration/OD_Sketches_Landscape.png", type: "image", orientation: "landscape" },
    { src: "/2D-3D-illustration/OD_Sketches_Landscape (2).png", type: "image", orientation: "landscape" },
    { src: "/2D-3D-illustration/OD_Shots_Landscape.png", type: "image", orientation: "landscape" },
    { src: "/2D-3D-illustration/OD_Shots_Landscape (2).png", type: "image", orientation: "landscape" },
    { src: "/2D-3D-illustration/OD_Landscape.png", type: "image", orientation: "landscape" },
    { src: "/2D-3D-illustration/ODYSSEA_Cover01_Landscape.png", type: "image", orientation: "landscape" },
    { src: "/2D-3D-illustration/ODYSSEA_Cover_Landscape.png", type: "image", orientation: "landscape" },
    { src: "/2D-3D-illustration/OD_Animation_Landscape.mp4", type: "video", orientation: "landscape" },
  ];

  const analogItems: MasonryGalleryItem[] = [
    { src: "/2D-3D-illustration/analog_landscape.png", type: "image", orientation: "landscape" },
    { src: "/2D-3D-illustration/analog_portrait (1).png", type: "image", orientation: "portrait" },
    { src: "/2D-3D-illustration/analog_portrait (2).png", type: "image", orientation: "portrait" },
    { src: "/2D-3D-illustration/analog_portrait (1).jpg", type: "image", orientation: "portrait" },
    { src: "/2D-3D-illustration/analog_portrait (2).jpg", type: "image", orientation: "portrait" },
    { src: "/2D-3D-illustration/analog_portrait (3).jpg", type: "image", orientation: "portrait" },
    { src: "/2D-3D-illustration/analog_portrait (4).jpg", type: "image", orientation: "portrait" },
  ];

  return (
    <div style={{ background: '#E4A4BD' }} className="flex flex-col items-center">
      {lightboxModal}
      <HamburgerMenu />
      {/* Top banner */}
      <div className="w-full">
        {topBanner}
      </div>
      <div className="w-full flex flex-col items-center">
        <MasonryGallery
          title="The Golden Age of Islam (Masonry)"
          company="@ Triad"
          software="Photoshop"
          description="A selection from a wide series of over 60 illustrations I created for a museum exhibit aimed at a younger audience, recounting the lives of seminal Muslim explorers between the 9th and 15th century."
          items={galleryImages.map(img => ({ src: img.hd, type: 'image', orientation: 'landscape' }))}
          overlayColor={overlayColors[0]}
          isOpen={openOverlayIndex === 100}
          onOpen={() => setOpenOverlayIndex(100)}
          onClose={() => setOpenOverlayIndex(null)}
        />
        <MasonryGallery
          title="Speedpaint Series (Masonry)"
          company="Personal Work"
          software="Photoshop"
          description="A series of digital speedpaints exploring color, light, and mood."
          items={speedpaintGallery.map(img => ({ src: img.hd, type: 'image', orientation: 'landscape' }))}
          overlayColor={overlayColors[1]}
          isOpen={openOverlayIndex === 101}
          onOpen={() => setOpenOverlayIndex(101)}
          onClose={() => setOpenOverlayIndex(null)}
        />
        {/* Masonry Gallery for OD images */}
        <div className="w-full max-w-full">
          <MasonryGallery
            title="Odyssea - a graphic novel"
            company="@ Collaboration"
            software="Blender + Clip Studio Paint"
            description={"A peek at a graphic novel I’ve been working on in my free time for about a year.<br />As my first foray into world building, NPR rendering and blender, it’s been quite the journey."}
            items={odysseaItems}
            isOpen={openOverlayIndex === 2}
            onOpen={() => setOpenOverlayIndex(2)}
            onClose={() => setOpenOverlayIndex(null)}
          />
        </div>
        <div className="w-full max-w-full">
          <MasonryGallery
            title="Analog Work"
            company="@ personal"
            software="pencil, ballpoint, fine liner and watercolour"
            description={"I also do analog things. I’ll draw with anything that leaves a mark - pictured here: some watercolour, some oil painting, some pencil, some marker, and something I made with a ballpoint pen."}
            items={analogItems}
            overlayColor="rgba(239, 20, 129, 0.5)"
            isOpen={openOverlayIndex === 3}
            onOpen={() => setOpenOverlayIndex(3)}
            onClose={() => setOpenOverlayIndex(null)}
          />
        </div>
      </div>
      {/* Mobile notification banner */}
      {isMobile !== undefined && isMobile && orientation === 'portrait' && mobileBanner}
    </div>
  );
}