"use client";
import React, { useRef, useEffect, useState } from "react";
import HamburgerMenu from "./HamburgerMenu";
import Link from "next/link";

// Custom hook to add animation class when in view (replayable)
function useInViewAnimation<T extends Element = HTMLSpanElement>(animationClass: string) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, inView ? animationClass : ""] as const;
}

// HighlightSwipe component for magenta swipe effect
function HighlightSwipe({ children }: { children: React.ReactNode }) {
  const [ref, inView] = useInViewAnimation<HTMLSpanElement>("");
  const [wiped, setWiped] = useState(false);
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setWiped(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [inView]);
  return (
    <span
      ref={ref}
      className={`highlight-animate${wiped ? ' wiped' : ''}`}
    >
      {children}
    </span>
  );
}

// MarkerHighlightInView component for in-view marker animation
function MarkerHighlightInView({ children }: { children: React.ReactNode }) {
  const [ref, animateClass] = useInViewAnimation('marker-highlight-animate');
  return (
    <span ref={ref} className={`marker-highlight ${animateClass}`}>{children}</span>
  );
}

export default function Homepage() {
  // Move all useInViewAnimation hook calls to the top level
  const [refHero, glitchClassHero] = useInViewAnimation<HTMLDivElement>("scanline-flicker-once");
  const [ref1, glitchClass1] = useInViewAnimation("scanline-flicker-once");
  const [ref2, glitchClass2] = useInViewAnimation("scanline-flicker-once");
  const [refSkill, glitchClassSkill] = useInViewAnimation("scanline-flicker-once");
  return (
    <div style={{ minHeight: '100vh', width: '100%', position: 'relative' }}>
      <HamburgerMenu />
      {/* Section 1: Hero */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: "url('/homepage/hero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          width: '100vw',
          maxWidth: '100vw',
          boxSizing: 'border-box',
          padding: '0 1rem',
        }}
      >
        {/* Magenta vignette overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 2,
            borderRadius: 'inherit',
            background: 'radial-gradient(ellipse at center, rgba(239,20,129,0) 0%, rgba(239,20,129,0) 60%, rgba(239,20,129,0.85) 100%)',
            mixBlendMode: 'multiply',
          }}
        />
        {/* Warm yellow center glow overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 3,
            borderRadius: 'inherit',
            background: 'radial-gradient(ellipse at center, rgba(255,220,100,0.45) 0%, rgba(255,220,100,0.18) 35%, rgba(255,220,100,0) 70%)',
            mixBlendMode: 'lighten',
          }}
        />
        {/* Responsive style for hero title */}
        <style jsx>{`
          @media (max-width: 700px) {
            h1 {
              font-size: 2.2rem !important;
              padding: 0.5em 0.5em !important;
            }
          }
        `}</style>
        <div ref={refHero} style={{ width: '100%' }}>
          <h1
            className={glitchClassHero}
            style={{
              color: '#fff',
              fontSize: 'clamp(2.2rem, 8vw, 12rem)',
              fontWeight: 900,
              textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
              textAlign: 'center',
              letterSpacing: '0.04em',
              borderRadius: '1rem',
              padding: '0.5em 1.5em',
              position: 'relative',
              zIndex: 3,
              fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
              textTransform: 'uppercase',
              width: '100%',
              maxWidth: '100vw',
              overflow: 'visible',
              margin: 0,
              boxSizing: 'border-box',
            }}
          >
            <span className="swipe-reveal" style={{ overflow: 'visible', display: 'block' }}>
              &nbsp;Amy Brutton
            </span>
            <span className="swipe-reveal" style={{ overflow: 'visible', display: 'block' }}>
              Creations
            </span>
          </h1>
        </div>
      </section>

      {/* Section 2: About - My Name is Amy Rose box */}
      <section
        className="about-section"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundImage: "url('/homepage/AboutMe_BG_Mint.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100vw',
          maxWidth: '100vw',
          boxSizing: 'border-box',
          padding: '0 1rem',
        }}
      >
        <style jsx>{`
          @media (max-width: 900px) {
            .about-section {
              min-height: 100vh !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: center !important;
              align-items: center !important;
            }
            .about-box {
              width: 95vw !important;
              min-width: 0 !important;
              padding: 1.2rem !important;
            }
            .about-row {
              flex-direction: column !important;
              height: auto !important;
              gap: 1.2rem !important;
            }
            .about-photo {
              width: 120px !important;
              height: 120px !important;
              display: none !important;
            }
            .about-title {
              font-size: 2rem !important;
            }
            .about-caption {
              font-size: 1rem !important;
              margin-top: 0.4rem !important;
              max-width: 100% !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
              padding-left: 0.5rem !important;
              text-align: left !important;
            }
            .about-box {
              transform: scale(0.8) !important;
              transform-origin: center center !important;
              margin-top: 0 !important;
              margin-bottom: 0 !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }
            .about-maintext, .about-secondarytext {
              font-size: 0.92rem !important;
            }
          }
        `}</style>
        <div
          className="about-box"
          style={{
            background: '#E4A4BD',
            opacity: 1,
            borderRadius: '2rem',
            transform: 'rotate(-2.5deg)',
            boxShadow: '0 4px 32px 0 rgba(239, 20, 129, 0.08)',
            width: '66%',
            maxWidth: 900,
            minWidth: 320,
            minHeight: 320,
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        >
          <div className="about-row" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '0.5rem', height: 180 }}>
            <div className="about-photo" style={{ width: 180, height: 180, borderRadius: '50%', background: '#fff', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <img src="/homepage/aboutme_photo_mint.png" alt="Amy Brutton" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 70%' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              {/* My Name is Amy Rose with in-view glitch+swipe */}
              <div
                className="about-title"
                style={{
                  fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: '#FDF8F3',
                  lineHeight: 1.1,
                  margin: 0,
                  padding: 0,
                  textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
                }}
              >
                <span ref={ref1} className={`${glitchClass1} swipe-reveal`} style={{ overflow: 'visible', display: 'block' }}>
                  &nbsp;My Name is
                </span>
                <span ref={ref2} className={`${glitchClass2} swipe-reveal`} style={{ overflow: 'visible', display: 'block' }}>
                  &nbsp;Amy Rose
                </span>
              </div>
              <div className="about-caption" style={{ fontFamily: "'Montserrat', Arial, Helvetica, sans-serif", fontWeight: 900, fontSize: '1.25rem', color: '#EF1481', marginTop: '0.5rem', textTransform: 'none', letterSpacing: '0.01em' }}>
                and I like to tell stories with pictures
              </div>
            </div>
          </div>
          <div style={{ width: '90%', alignSelf: 'center', marginBottom: '1.25rem' }}>
            <div className="about-maintext" style={{ fontFamily: "'Montserrat', Arial, Helvetica, sans-serif", fontWeight: 700, fontSize: '1.15rem', color: '#FDF8F3', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.75rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5ch' }}>
              <span style={{ color: '#EF1481', fontWeight: 900 }}>I AM:</span>
              <span style={{ color: '#FDF8F3', fontWeight: 700 }}>
                &nbsp;A CG ARTIST WITH A <MarkerHighlightInView>DEGREE IN DIGITAL DIRECTION</MarkerHighlightInView>, AND OVER A DECADE OF PROFESSIONAL EXPERIENCE. MY COMPREHENSIVE SKILLSET INCLUDES <MarkerHighlightInView>VECTOR ART</MarkerHighlightInView>, <MarkerHighlightInView>CEL ANIMATION</MarkerHighlightInView>, <MarkerHighlightInView>3D IMAGERY</MarkerHighlightInView> AND <MarkerHighlightInView>DIGITAL PAINTING</MarkerHighlightInView>, I STRIVE TO BRING OUT THE <MarkerHighlightInView>STORYTELLING DETAILS</MarkerHighlightInView> OF ANY VISUAL I CREATE, WHETHER ABSTRACT OR FIGURATIVE, STATIC OR ANIMATED.
              </span>
            </div>
            <div className="about-secondarytext" style={{ fontFamily: "'Montserrat', Arial, Helvetica, sans-serif", fontWeight: 600, fontSize: '1.05rem', color: '#EF1481', textTransform: 'none', letterSpacing: '0.01em', marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5ch' }}>
              <span style={{ color: '#EF1481', fontWeight: 900 }}>i am also:</span>
              <span style={{ color: '#FDF8F3', fontWeight: 600 }}>
                &nbsp;bilingual from birth, and trilingual since moving to Berlin // a singer, a dancer and a lover of sustainable fashion and costumes. <MarkerHighlightInView>And dogs.</MarkerHighlightInView>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Skillset menu */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: "url('/homepage/skillset_HD.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100vw',
          maxWidth: '100vw',
          boxSizing: 'border-box',
          padding: '0 1rem',
        }}
      >
        <style jsx>{`
          @media (max-width: 900px) {
            .skillset-section {
              flex-direction: column !important;
              align-items: center !important;
              width: 100vw !important;
            }
            .skillset-bar {
              width: 75vw !important;
              min-width: 0 !important;
              max-width: 75vw !important;
              border-top-left-radius: 2rem !important;
              border-top-right-radius: 2rem !important;
              border-bottom-left-radius: 0 !important;
              border-bottom-right-radius: 0 !important;
              height: auto !important;
              padding: 0.5rem 0 !important;
              margin-left: auto !important;
              margin-right: auto !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            .skillset-menu {
              min-width: 0 !important;
              width: 75vw !important;
              max-width: 75vw !important;
              padding: 1.2rem 0.5rem 1.2rem 0.5rem !important;
              border-top-left-radius: 0 !important;
              border-top-right-radius: 0 !important;
              border-bottom-left-radius: 2rem !important;
              border-bottom-right-radius: 2rem !important;
              margin-left: auto !important;
              margin-right: auto !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
            }
            .skillset-row {
              flex-direction: column !important;
              gap: 1.2rem !important;
            }
            .skillset-thumb {
              width: 100% !important;
              max-width: 180px !important;
              height: auto !important;
            }
            .skillset-link {
              font-size: 1.1rem !important;
            }
          }
        `}</style>
        <div
          className="skillset-section"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            width: '92%',
            maxWidth: 1400,
            margin: '0 auto 40px auto',
            borderRadius: 0,
            background: 'none',
            position: 'relative',
            minHeight: 260,
            justifyContent: 'center',
          }}
        >
          {/* Horizontal SKILLSET bar */}
          <div className="skillset-bar" style={{
            background: '#E4A4BD',
            borderTopLeftRadius: '2rem',
            borderBottomLeftRadius: '2rem',
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            minWidth: 800,
            width: 800,
            height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}>
            {/* SKILLSET with in-view glitch+swipe */}
            <span
              ref={refSkill}
              className={`${glitchClassSkill} swipe-reveal`}
              style={{
                fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(1.5rem, 7vw, 8rem)',
                color: '#FDF8F3',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textAlign: 'center',
                display: 'inline-block',
                overflow: 'visible',
                textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
                lineHeight: 1.1,
                width: '100%',
              }}
            >
              SKILLSET
            </span>
          </div>
          {/* Main skillset menu box */}
          <div className="skillset-menu" style={{
            background: '#E4A4BD',
            borderTopRightRadius: '2rem',
            borderBottomRightRadius: '2rem',
            borderTopLeftRadius: '2rem',
            borderBottomLeftRadius: 0,
            flex: 1,
            minWidth: 800,
            minHeight: 260,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '2.5rem 4rem 2.5rem 6rem',
            gap: '2rem',
            zIndex: 1,
          }}>
            {/* Each row: visual + skill name */}
            <div className="skillset-row" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: 0 }}>
              <div className="skillset-thumb" style={{ width: 288, height: 162, background: '#fff', borderRadius: 0, overflow: 'hidden', flex: 'none' }}>
                <img src="/homepage/skillset_vector.png" alt="Vector Art" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <Link href="/vector-art" style={{ textDecoration: 'none' }}>
                <div className="rgb-split-hover skillset-link" style={{ fontFamily: "'Montserrat', Arial, Helvetica, sans-serif", fontWeight: 900, fontSize: '2rem', color: '#EF1481', textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer', transition: 'color 0.2s' }}>Vector Art</div>
              </Link>
            </div>
            <div className="skillset-row" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: 0 }}>
              <div className="skillset-thumb" style={{ width: 288, height: 162, background: '#222', borderRadius: 0, overflow: 'hidden', flex: 'none' }}>
                <video src="/homepage/skillsetAnim_Cel.mp4" autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <Link href="/cel-animation" style={{ textDecoration: 'none' }}>
                <div className="rgb-split-hover skillset-link" style={{ fontFamily: "'Montserrat', Arial, Helvetica, sans-serif", fontWeight: 900, fontSize: '2rem', color: '#EF1481', textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer', transition: 'color 0.2s' }}>Cel Animation</div>
              </Link>
            </div>
            <div className="skillset-row" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: 0 }}>
              <div className="skillset-thumb" style={{ width: 288, height: 162, background: '#fff', borderRadius: 0, overflow: 'hidden', flex: 'none' }}>
                <img src="/homepage/skillset_digipaint.png" alt="2D and 3D Illustration" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <Link href="/illustration-2d" style={{ textDecoration: 'none' }}>
                <div className="rgb-split-hover skillset-link" style={{ fontFamily: "'Montserrat', Arial, Helvetica, sans-serif", fontWeight: 900, fontSize: '2rem', color: '#EF1481', textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer', transition: 'color 0.2s' }}>2D and 3D Illustration</div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}