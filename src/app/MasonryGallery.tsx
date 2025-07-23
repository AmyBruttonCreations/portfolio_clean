import React, { useState, useRef, useEffect } from "react";
import Masonry from "react-masonry-css";
import Image from "next/image";

export interface MasonryGalleryItem {
  src: string;
  type: "image" | "video";
  orientation: "portrait" | "landscape";
}

interface MasonryGalleryProps {
  title: string;
  company: string;
  software: string;
  description: string;
  items: MasonryGalleryItem[];
  overlayColor?: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const defaultOverlayColor = 'rgba(200, 210, 60, 0.5)';

const breakpointColumnsObj = {
  default: 6,
  1100: 4,
  700: 2
};

const MasonryGallery: React.FC<MasonryGalleryProps> = ({
  title,
  company,
  software,
  description,
  items,
  overlayColor = defaultOverlayColor,
  isOpen,
  onOpen,
  onClose,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [lightbox, setLightbox] = useState<{ open: boolean; src: string; type: 'image' | 'video' } | null>(null);

  // Optional: Snap overlay back if scrolled out of view
  useEffect(() => {
    if (!isOpen) return;
    const ref = overlayRef.current;
    if (!ref) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.5) {
          onClose();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [isOpen, onClose]);

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
      {lightbox.type === 'image' ? (
        <img
          src={lightbox.src}
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
      ) : (
        <video
          src={lightbox.src}
          autoPlay
          loop
          muted
          playsInline
          controls
          style={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            borderRadius: 12,
            background: '#000',
            boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
          }}
          onClick={e => e.stopPropagation()}
        />
      )}
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

  // Alternate portrait and landscape for balance
  const portraits = items.filter(i => i.orientation === "portrait");
  const landscapes = items.filter(i => i.orientation === "landscape");
  const balancedItems: MasonryGalleryItem[] = [];
  const maxLen = Math.max(portraits.length, landscapes.length);
  for (let i = 0; i < maxLen; i++) {
    if (landscapes[i]) balancedItems.push(landscapes[i]);
    if (portraits[i]) balancedItems.push(portraits[i]);
  }

  return (
    <div className="w-full flex flex-col items-center relative px-20" style={{ minHeight: 400 }} ref={overlayRef}>
      {lightboxModal}
      {/* Yellow dashed line at the top of the project, for visual consistency */}
      <div
        style={{
          borderTop: '4px dashed rgb(200,210,60)',
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
      {/* SVG arrow for a tall, flattened triangle with cream glow, only visible when overlay is closed */}
      {!isOpen && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translate(0, -50%)',
            transition: 'transform 0.7s cubic-bezier(.68,-0.6,.32,1.6), opacity 0.7s',
            opacity: 1,
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
      )}
      {/* Masonry grid always visible as background */}
      <div className="w-full pt-8" style={{ position: 'relative', zIndex: 0 }}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {balancedItems.map((item, idx) => (
            <div key={idx} style={{ width: "100%", marginBottom: "16px", position: "relative" }}>
              {item.type === "image" ? (
                <Image
                  src={item.src}
                  alt={`${title} ${item.orientation} ${idx + 1}`}
                  width={item.orientation === "portrait" ? 400 : 600}
                  height={item.orientation === "portrait" ? 600 : 400}
                  style={{ width: "100%", height: "auto", cursor: "pointer" }}
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  priority={idx < 3}
                  onClick={() => setLightbox({ open: true, src: item.src, type: 'image' })}
                />
              ) : (
                <video
                  src={item.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: "100%", height: "auto", background: "#000", cursor: "pointer" }}
                  onClick={() => setLightbox({ open: true, src: item.src, type: 'video' })}
                />
              )}
            </div>
          ))}
        </Masonry>
      </div>
      {/* Overlay slides out to the right */}
      <div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center cursor-pointer transition-transform duration-700"
        style={{
          background: `linear-gradient(to left, ${(overlayColor || defaultOverlayColor).replace('0.5', '1')} 0%, ${overlayColor || defaultOverlayColor} 100%)`,
          opacity: 1,
          zIndex: 1,
          transform: isOpen ? 'translateX(calc(100% - 80px))' : 'translateX(0)',
          transition: 'transform 0.7s ease',
          width: '100%',
          height: '100%',
        }}
        onClick={() => !isOpen && onOpen()}
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
          ></div>
        )}
      </div>
      <style jsx global>{`
        .my-masonry-grid {
          display: flex;
          margin-left: -16px;
          width: auto;
        }
        .my-masonry-grid_column {
          padding-left: 16px;
          background-clip: padding-box;
        }
        @media (orientation: landscape) {
          .overlay-text {
            font-size: clamp(0.7rem, 2.5vh, 1.2rem) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MasonryGallery; 