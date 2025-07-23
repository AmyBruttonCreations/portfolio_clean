import React, { useState, useRef, useEffect } from "react";

interface GalleryImage {
  thumb: string;
  hd: string;
}

interface ProjectShowcaseGalleryProps {
  title: string;
  company?: string;
  software?: string;
  description?: string;
  gallery: GalleryImage[];
  height?: string;
  overlayColor?: string;
  thumbAspectRatio?: string;
  columns?: number;
  maxThumbWidth?: string;
  maxThumbHeight?: string;
  children?: React.ReactNode;
}

const defaultOverlayColor = 'rgba(239, 20, 129, 0.5)';

export default function ProjectShowcaseGallery({
  title,
  company,
  software,
  description,
  gallery,
  height = 'auto',
  overlayColor = defaultOverlayColor,
  thumbAspectRatio = '16/9',
  columns = 3,
  maxThumbWidth = '300px',
  maxThumbHeight = 'auto',
  children,
}: ProjectShowcaseGalleryProps) {
  const [openOverlay, setOpenOverlay] = useState(false);
  const [galleryHovered, setGalleryHovered] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<{ open: boolean; img: string } | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Close overlay when scrolled out of view
  useEffect(() => {
    if (!openOverlay) return;
    const ref = overlayRef.current;
    if (!ref) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.5) {
          setOpenOverlay(false);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [openOverlay]);

  // Lightbox modal
  const lightboxModal = lightbox && lightbox.open && (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{
        cursor: 'zoom-out',
        background: 'rgba(0,0,0,0.18)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={() => setLightbox(null)}
    >
      <img
        src={lightbox.img}
        alt="Lightbox"
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: 12,
          boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
          background: '#222',
        }}
        onClick={e => e.stopPropagation()}
      />
      <button
        onClick={() => setLightbox(null)}
        style={{
          position: 'fixed',
          top: 32,
          right: 32,
          zIndex: 1100,
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 48,
          height: 48,
          fontSize: 32,
          fontWeight: 900,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Close lightbox"
      >
        ×
      </button>
    </div>
  );

  // Styles
  const captionStyle: React.CSSProperties = {
    fontWeight: 400,
    fontSize: 'clamp(1rem, 1.5vw, 1.35rem)',
    color: '#FDF8F3',
    fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
    textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
  };
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

  return (
    <div
      className="w-full flex flex-col items-center relative"
      style={{ marginTop: 0, marginBottom: 0, height }}
      ref={overlayRef}
    >
      {/* Dashed line at the top, matches overlay color */}
      <div
        style={{
          borderTop: `4px dashed ${(() => {
            if ((overlayColor || defaultOverlayColor).includes('200, 210, 60')) {
              return 'rgb(200,210,60)';
            }
            return (overlayColor || defaultOverlayColor)
              .replace(/rgba?\(([^,]+),([^,]+),([^,]+)(?:,[^)]+)?\)/, 'rgb($1,$2,$3)')
              .replace('0.5', '1');
          })()}`,
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
      {/* SVG arrow for a tall, flattened triangle with cream glow */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: openOverlay
            ? 'translate(-80px, -50%)'
            : 'translate(0, -50%)',
          transition: 'transform 0.7s cubic-bezier(.68,-0.6,.32,1.6), opacity 0.7s',
          opacity: openOverlay ? 0 : 1,
          zIndex: 10,
          cursor: 'pointer',
          paddingLeft: '3vw',
        }}
        aria-label="Open overlay"
      >
        <svg
          width="24"
          height="64"
          viewBox="0 0 24 64"
          style={{
            display: 'block',
            filter: 'drop-shadow(0 0 3px #FDF8F3) drop-shadow(0 0 6px #FDF8F3)',
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="0,0 24,32 0,64" fill="#FDF8F3" />
        </svg>
      </div>
      {/* Gallery grid, flexible layout */}
      <div className="w-full flex items-center justify-center overflow-hidden" style={{ position: 'relative', zIndex: 0, height: '100%' }}>
        <div
          className="showcase-gallery bg-white bg-opacity-80 transition-all duration-500"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: 'transparent',
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridAutoRows: '1fr',
            columnGap: '1vw',
            rowGap: '1vw',
            height: 'auto',
            alignItems: 'center',
            justifyItems: 'center',
            paddingLeft: '3vw',
            paddingRight: '3vw',
            paddingTop: '3vw',
            paddingBottom: '3vw',
            maxWidth: '90vw',
            margin: '0 auto',
            overflow: 'visible',
          }}
        >
          {gallery.map((img, i) => (
            <img
              key={i}
              src={img.thumb}
              alt={title + ' gallery'}
              loading="lazy"
              className="object-cover cursor-pointer transition-transform duration-300"
              style={{
                width: '100%',
                maxWidth: maxThumbWidth,
                maxHeight: maxThumbHeight,
                aspectRatio: thumbAspectRatio,
                borderRadius: 8,
                boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                zIndex: galleryHovered === i ? 2 : 1,
                transform: galleryHovered === i ? 'scale(1.5)' : 'scale(1)',
                transition: 'transform 0.3s',
                background: '#fff',
                objectFit: 'cover',
              }}
              onMouseEnter={() => setGalleryHovered(i)}
              onMouseLeave={() => setGalleryHovered(null)}
              onClick={() => setLightbox({ open: true, img: img.hd })}
            />
          ))}
        </div>
      </div>
      {/* Overlay slides out to the right */}
      <div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer transition-transform duration-700"
        style={{
          background: `linear-gradient(to left, ${(overlayColor || defaultOverlayColor).replace('0.5', '1')} 0%, ${overlayColor || defaultOverlayColor} 100%)`,
          opacity: 1,
          zIndex: 1,
          transform: openOverlay ? 'translateX(calc(100% - 80px))' : 'translateX(0)',
          transition: 'transform 0.7s ease',
          width: '100%',
          height: '100%',
        }}
        onClick={() => !openOverlay && setOpenOverlay(true)}
      >
        {!openOverlay && (
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
              style={{
                fontWeight: 900,
                fontSize: '2.4rem',
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
            {company && (
              <div
                style={{
                  ...captionStyle,
                  textTransform: 'lowercase',
                  fontSize: '1.2rem',
                  margin: '0.5em 0',
                  textAlign: 'right',
                  textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
                  width: '100%',
                  paddingRight: '3vw',
                }}
              >
                {company}
              </div>
            )}
            {software && (
              <div
                style={{
                  ...captionStyle,
                  textTransform: 'lowercase',
                  fontSize: '1rem',
                  margin: '0.5em 0',
                  textAlign: 'right',
                  textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
                  width: '100%',
                  paddingRight: '3vw',
                }}
              >
                {software}
              </div>
            )}
            {description && (
              <div
                style={{
                  ...captionStyle,
                  textTransform: 'lowercase',
                  fontSize: '1rem',
                  margin: '0.5em 0',
                  fontWeight: 400,
                  textAlign: 'right',
                  textShadow: '0 0 6px #FDF8F3, 0 0 12px #FDF8F3',
                  width: '100%',
                  paddingRight: '3vw',
                }}
              >
                {description}
              </div>
            )}
            {children}
          </div>
        )}
        {openOverlay && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 3,
            }}
            onClick={() => setOpenOverlay(false)}
          />
        )}
      </div>
      {lightboxModal}
      {/* Add global styles for showcase-gallery responsiveness */}
      <style jsx global>{`
        .showcase-gallery {
          display: grid;
          align-items: center;
          justify-items: center;
        }
        @media (max-width: 900px) {
          .showcase-gallery {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .showcase-gallery {
            grid-template-columns: repeat(1, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
} 