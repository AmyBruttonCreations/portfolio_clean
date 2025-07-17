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

export default function Homepage() {
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
          position: 'relative', // allow overlay
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
        {(() => {
          const [refHero, glitchClassHero] = useInViewAnimation<HTMLDivElement>("scanline-flicker-once");
          return (
            <div ref={refHero}>
              <h1
                className={glitchClassHero}
                style={{
                  color: '#fff',
                  fontSize: 'clamp(4rem, 12vw, 12rem)',
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
                  width: 'auto',
                  maxWidth: 'none',
                  overflow: 'visible',
                  margin: 0,
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
          );
        })()}
      </section>

      {/* Section 2: About - My Name is Amy Rose box */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: "url('/homepage/AboutMe_BG_Mint.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          style={{
            background: '#E4A4BD',
            opacity: 1,
            borderRadius: '2rem',
            transform: 'rotate(-2.5deg)',
            boxShadow: '0 4px 32px 0 rgba(239, 20, 129, 0.08)',
            width: '66%',
            maxWidth: 900,
            minHeight: 320,
            marginLeft: 40,
            marginRight: 'auto',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '0.5rem', height: 180 }}>
            <div style={{ width: 180, height: 180, borderRadius: '50%', background: '#fff', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <img src="/homepage/aboutme_photo_mint.png" alt="Amy Brutton" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 70%' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              {/* My Name is Amy Rose with in-view glitch+swipe */}
              {(() => {
                const [ref1, glitchClass1] = useInViewAnimation("scanline-flicker-once");
                const [ref2, glitchClass2] = useInViewAnimation("scanline-flicker-once");
                return (
                  <div
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
                );
              })()}
              <div style={{ fontFamily: "'Montserrat', Arial, Helvetica, sans-serif", fontWeight: 900, fontSize: '1.25rem', color: '#EF1481', marginTop: '0.5rem', textTransform: 'none', letterSpacing: '0.01em' }}>
                and I like to tell stories with pictures
              </div>
            </div>
          </div>
          <div style={{ width: '90%', alignSelf: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: "'Montserrat', Arial, Helvetica, sans-serif", fontWeight: 700, fontSize: '1.15rem', color: '#FDF8F3', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.75rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5ch' }}>
              <span style={{ color: '#EF1481', fontWeight: 900 }}>I AM:</span>
              <span style={{ color: '#FDF8F3', fontWeight: 700 }}>
                &nbsp;A CG ARTIST WITH A <span style={{ color: '#EF1481' }} className="highlight-animate">DEGREE IN DIGITAL DIRECTION</span>, AND OVER A DECADE OF PROFESSIONAL EXPERIENCE. MY COMPREHENSIVE SKILLSET INCLUDES <span style={{ color: '#EF1481' }} className="highlight-animate">VECTOR ART</span>, <span style={{ color: '#EF1481' }} className="highlight-animate">CEL ANIMATION</span>, <span style={{ color: '#EF1481' }} className="highlight-animate">3D IMAGERY</span> AND <span style={{ color: '#EF1481' }} className="highlight-animate">DIGITAL PAINTING</span>, I STRIVE TO BRING OUT THE <span style={{ color: '#EF1481' }} className="highlight-animate">STORYTELLING DETAILS</span> OF ANY VISUAL I CREATE, WHETHER ABSTRACT OR FIGURATIVE, STATIC OR ANIMATED.
              </span>
            </div>
            <div style={{ fontFamily: "'Montserrat', Arial, Helvetica, sans-serif", fontWeight: 600, fontSize: '1.05rem', color: '#EF1481', textTransform: 'none', letterSpacing: '0.01em', marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5ch' }}>
              <span style={{ color: '#EF1481', fontWeight: 900 }}>i am also:</span>
              <span style={{ color: '#FDF8F3', fontWeight: 600 }}>
                &nbsp;bilingual from birth, and trilingual since moving to Berlin // a singer, a dancer and a lover of sustainable fashion and costumes. <span style={{ color: '#EF1481' }} className="highlight-animate">And dogs.</span>
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
        }}
      >
        <div style={{
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
        }}>
          {/* Horizontal SKILLSET bar */}
          <div style={{
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
            {(() => {
              const [refSkill, glitchClassSkill] = useInViewAnimation("scanline-flicker-once");
              return (
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
              );
            })()}
          </div>
          {/* Main skillset menu box */}
          <div style={{
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: 0 }}>
              <div style={{ width: 288, height: 162, background: '#fff', borderRadius: 0, overflow: 'hidden', flex: 'none' }}>
                <img src="/homepage/skillset_vector.png" alt="Vector Art" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <Link href="/vector-art" style={{ textDecoration: 'none' }}>
                <div className="rgb-split-hover" style={{ fontFamily: "'Montserrat', Arial, Helvetica, sans-serif", fontWeight: 900, fontSize: '2rem', color: '#EF1481', textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer', transition: 'color 0.2s' }}>Vector Art</div>
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: 0 }}>
              <div style={{ width: 288, height: 162, background: '#222', borderRadius: 0, overflow: 'hidden', flex: 'none' }}>
                <video src="/homepage/skillsetAnim_Cel.mp4" autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <Link href="/cel-animation" style={{ textDecoration: 'none' }}>
                <div className="rgb-split-hover" style={{ fontFamily: "'Montserrat', Arial, Helvetica, sans-serif", fontWeight: 900, fontSize: '2rem', color: '#EF1481', textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer', transition: 'color 0.2s' }}>Cel Animation</div>
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: 0 }}>
              <div style={{ width: 288, height: 162, background: '#fff', borderRadius: 0, overflow: 'hidden', flex: 'none' }}>
                <img src="/homepage/skillset_digipaint.png" alt="2D and 3D Illustration" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <Link href="/illustration-2d" style={{ textDecoration: 'none' }}>
                <div className="rgb-split-hover" style={{ fontFamily: "'Montserrat', Arial, Helvetica, sans-serif", fontWeight: 900, fontSize: '2rem', color: '#EF1481', textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer', transition: 'color 0.2s' }}>2D and 3D Illustration</div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}