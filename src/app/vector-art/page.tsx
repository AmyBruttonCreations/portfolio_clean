"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useCallback } from "react";
import HamburgerMenu from "../HamburgerMenu";

import React from "react";
import { useIsMobile } from '../../utils/useIsMobile';
import { useInViewAnimation, MarkerHighlightInView } from '../MarkerHighlightInView';
import MasonryGallery from "../MasonryGallery";
import VideoProjectOverlay from "../../components/VideoProjectOverlay";
import MobileBanner from "../../components/MobileBanner";



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
    title: "Equal Video",
    video: "/vector-art/equal.mp4",
    info: "This was my first collaboration with the wonderful Markus Hoffmann. We were inspired by one-line tattoos to create a series of illustrations that all fed into each other. I made all the visuals, and Markus was responsible for the animation.",
  },
  {
    title: "VW PITCH",
    images: [
      "/vector-art/vw (1).png",
      "/vector-art/vw (2).png", 
      "/vector-art/vw (3).png"
    ],
    info: "a pitch i did for VW that i'm still quite fond of.",
  },

];







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
          zoomScale={0}
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
          zoomScale={0}
        />
        {/* Video project */}
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
                overlayColor="rgba(200, 210, 60, 0.5)"
                isOpen={openOverlayIndex === 1000 + idx}
                onOpen={() => setOpenOverlayIndex(1000 + idx)}
                onClose={() => setOpenOverlayIndex(null)}
              />
            );
          }
          // Masonry gallery project logic
          if (project.images) {
            return (
              <MasonryGallery
                key={idx}
                title={project.title}
                company="storz&escherich"
                software="adobe illustrator"
                description={project.info}
                items={project.images.map(src => ({ src, type: 'image', orientation: 'landscape' }))}
                overlayColor="rgba(239, 20, 129, 0.5)"
                isOpen={openOverlayIndex === 2000 + idx}
                onOpen={() => setOpenOverlayIndex(2000 + idx)}
                onClose={() => setOpenOverlayIndex(null)}
                columns={2}
                zoomScale={0}
              />
            );
          }
          return null;
        })}
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