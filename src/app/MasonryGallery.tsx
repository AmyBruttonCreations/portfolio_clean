import React, { useState, useRef, useEffect, PropsWithChildren } from "react";
import ReactDOM from "react-dom";
import Masonry from "react-masonry-css";
import Image from "next/image";
import { useIsMobile } from '../utils/useIsMobile';
import LightboxModal from '../components/LightboxModal';

export interface MasonryGalleryItem {
  src: string;
  hdSrc?: string;
  type: "image" | "video";
  orientation: "portrait" | "landscape";
}

/**
 * Props for MasonryGallery
 *
 * stacked: If true, uses a single-column stacked layout instead of a masonry grid. Only affects layout.
 */
interface MasonryGalleryProps extends PropsWithChildren {
  title: string;
  company: string;
  software: string;
  description: string;
  items: MasonryGalleryItem[];
  overlayColor?: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  stacked?: boolean;
  height?: string;
  columns?: number;
  zoomScale?: number;
  disableAutoClose?: boolean;
  topLineColor?: string;
}

const defaultOverlayColor = 'rgba(200, 210, 60, 0.5)';

// Use columns prop if provided, otherwise default
function getBreakpointColumnsObj(columns?: number) {
  return {
    default: columns || 6,
    1100: Math.max(2, Math.floor((columns || 6) * 2 / 3)),
    700: 2
  };
}

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
  stacked = false,
  height,
  columns,
  zoomScale,
  disableAutoClose = false,
  topLineColor,
  ...rest
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [lightbox, setLightbox] = useState<{ open: boolean; src: string; type: 'image' | 'video' } | null>(null);
  const [galleryHovered, setGalleryHovered] = useState<number | null>(null);
  const [zoomedIdx, setZoomedIdx] = useState<number | null>(null);
  const [zoomedRect, setZoomedRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const galleryContainerRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  // Auto-close overlay if scrolled out of view (unless disableAutoClose is true)
  useEffect(() => {
    if (Boolean(disableAutoClose)) {
      return;
    }
    if (!isOpen) return;
    const ref = overlayRef.current;
    if (!ref) return;
    // Dynamic threshold: lower if overlay is tall or on mobile
    let threshold = 0.5;
    const overlayHeight = ref.getBoundingClientRect().height;
    const viewportHeight = window.innerHeight;
    if (overlayHeight > viewportHeight * 0.95 || window.innerWidth <= 768) {
      threshold = 0.1;
    }
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < threshold) {
          onClose();
        }
      },
      { threshold }
    );
    observer.observe(ref);
    return () => observer.disconnect();
    // Always include all dependencies, but do not change the array length
  }, [isOpen, onClose, disableAutoClose]);

  // Lightbox modal
  const lightboxModal = (
    <LightboxModal
      open={!!lightbox?.open}
      src={lightbox?.src || ''}
      type={lightbox?.type || 'image'}
      onClose={() => setLightbox(null)}
      alt="Lightbox"
    />
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
  const solidLineColor = topLineColor || getSolidColor(overlayColor);

  useEffect(() => {
    if (zoomedIdx === null) return;
    // Add scroll handler to close zoomed image
    const handleScroll = () => {
      setZoomedIdx(null);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [zoomedIdx]);

  return (
    <div className="w-full flex flex-col items-center relative pt-20 pb-20 px-20" style={{ minHeight: 400, height: height || undefined }} ref={overlayRef}>
      {lightboxModal}
      {/* Dashed line at the top of the project, matches overlay color */}
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
      {/* Masonry grid always visible as background */}
      <div className="w-full pt-20 pb-20" style={{ position: 'relative', zIndex: 0, paddingLeft: 80, paddingRight: 80 }} ref={galleryContainerRef}>
        {/*
          stacked: If true, use a single-column stacked layout. Only affects layout.
        */}
        {stacked ? (
          <div className="flex flex-col gap-8 w-full">
            {items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  width: "100%",
                  background: "#fff",
                  borderRadius: 8,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.3s",
                }}
                tabIndex={0}
                role="button"
                aria-label={`Open ${item.type === 'image' ? 'image' : 'video'} in lightbox`}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLightbox({ open: true, src: item.hdSrc || item.src, type: item.type });
                  }
                }}
                onMouseEnter={e => {
                  if (!isMobile && !lightbox?.open) {
                    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                    setZoomedRect({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
                    setZoomedIdx(idx);
                  }
                }}
                onMouseLeave={() => { if (!isMobile) setZoomedIdx(null); }}
              >
                {item.type === "image" ? (
                  <Image
                    src={item.src}
                    alt={`${title} ${item.orientation} ${idx + 1}`}
                    width={item.orientation === "portrait" ? 400 : 600}
                    height={item.orientation === "portrait" ? 600 : 400}
                    style={{ width: "100%", height: "auto", cursor: "pointer" }}
                    sizes="100vw"
                    priority={idx < 3}
                    onClick={() => setLightbox({ open: true, src: item.hdSrc || item.src, type: 'image' })}
                  />
                ) : (
                  <video
                    src={item.src}
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", height: "auto", background: "#000", cursor: "pointer" }}
                    onClick={() => setLightbox({ open: true, src: item.src, type: 'video' })}
                    ref={(el) => {
                      if (el) {
                        const observer = new IntersectionObserver(
                          (entries) => {
                            entries.forEach((entry) => {
                              if (entry.isIntersecting) {
                                el.play();
                              } else {
                                el.pause();
                              }
                            });
                          },
                          { threshold: 0.1 }
                        );
                        observer.observe(el);
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <Masonry
            breakpointCols={getBreakpointColumnsObj(columns)}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {balancedItems.map((item, idx) => {
              const isZoomed = zoomedIdx === idx;
              const commonStyle = {
                width: "100%",
                marginBottom: "16px",
                background: "transparent",
                borderRadius: 8,
                boxShadow: "none",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.3s",
              };
              return (
                <div
                  key={idx}
                  style={{
                    ...commonStyle,
                    position: "relative",
                    zIndex: 1,
                    transform: "scale(1)",
                    // Remove box-shadow for the sticker image
                    ...(item.src.includes('JOP_Sticker_LARGE-01.png') ? { boxShadow: 'none' } : {}),
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open ${item.type === 'image' ? 'image' : 'video'} in lightbox`}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setLightbox({ open: true, src: item.hdSrc || item.src, type: item.type });
                    }
                  }}
                  onMouseEnter={e => {
                    if (!isMobile && !lightbox?.open) {
                      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                      setZoomedRect({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
                      setZoomedIdx(idx);
                    }
                  }}
                  onMouseLeave={() => { if (!isMobile) setZoomedIdx(null); }}
                >
                  {item.type === "image" ? (
                    <Image
                      src={item.src}
                      alt={`${title} ${item.orientation} ${idx + 1}`}
                      width={item.orientation === "portrait" ? 400 : 600}
                      height={item.orientation === "portrait" ? 600 : 400}
                      style={{ width: "100%", height: "auto", cursor: "pointer" }}
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      priority={idx < 3}
                      onClick={() => setLightbox({ open: true, src: item.hdSrc || item.src, type: 'image' })}
                    />
                  ) : (
                    <video
                      src={item.src}
                      loop
                      muted
                      playsInline
                      style={{ width: "100%", height: "auto", background: "#000", cursor: "pointer" }}
                      onClick={() => setLightbox({ open: true, src: item.src, type: 'video' })}
                      ref={(el) => {
                        if (el) {
                          const observer = new IntersectionObserver(
                            (entries) => {
                              entries.forEach((entry) => {
                                if (entry.isIntersecting) {
                                  el.play();
                                } else {
                                  el.pause();
                                }
                              });
                            },
                            { threshold: 0.1 }
                          );
                          observer.observe(el);
                        }
                      }}
                    />
                  )}
                </div>
              );
            })}
          </Masonry>
        )}
        {/* Portal for zoomed image */}
        {typeof window !== 'undefined' && !isMobile && !lightbox?.open && zoomedIdx !== null && zoomedRect && ReactDOM.createPortal(
          <div
            style={{
              position: 'fixed',
              left: zoomedRect.left + zoomedRect.width / 2,
              top: zoomedRect.top + zoomedRect.height / 2,
              width: zoomedRect.width,
              height: zoomedRect.height,
              transform: `translate(-50%, -50%) scale(${zoomScale || 1.4})`,
              zIndex: 3000,
              pointerEvents: 'none',
              transition: 'transform 0.3s',
            }}
          >
            {balancedItems[zoomedIdx].type === 'image' ? (
              <Image
                src={balancedItems[zoomedIdx].src}
                alt={`${title} ${balancedItems[zoomedIdx].orientation} ${zoomedIdx + 1}`}
                width={balancedItems[zoomedIdx].orientation === "portrait" ? 400 : 600}
                height={balancedItems[zoomedIdx].orientation === "portrait" ? 600 : 400}
                style={{ width: '100%', height: 'auto', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}
                draggable={false}
              />
            ) : (
              <video
                src={balancedItems[zoomedIdx].src}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: 'auto', background: '#000', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.12)' }}
                draggable={false}
              />
            )}
          </div>,
          document.body
        )}
      </div>
      {/* Overlay slides out to the right */}
      <div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center transition-transform duration-700"
        style={{
          background: `linear-gradient(to left, ${(overlayColor || defaultOverlayColor).replace('0.5', '1')} 0%, ${overlayColor || defaultOverlayColor} 100%)`,
          opacity: 1,
          zIndex: 1,
          transform: isOpen ? 'translateX(-100%)' : 'translateX(0)', // Fully off-screen when open
          transition: 'transform 0.7s ease',
          width: '100%',
          height: '100%',
        }}
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
      </div>
      {!lightbox?.open && (
        <>
          {/* Top arrow */}
          <div
            className="overlay-arrow-area"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '33%',
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
            tabIndex={0}
            role="button"
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                isOpen ? onClose() : onOpen();
              }
            }}
            onClick={() => isOpen ? onClose() : onOpen()}
          >
            <div className="overlay-arrow-area__icon">
              <svg
                className={!isOpen ? 'bouncy-arrow' : ''}
                width="24"
                height="64"
                viewBox="0 0 24 64"
                style={{
                  display: 'block',
                  filter: isOpen
                    ? `drop-shadow(0 0 3px ${(overlayColor || defaultOverlayColor).replace(/, 0.5\)/, ', 1)')}) drop-shadow(0 0 6px ${(overlayColor || defaultOverlayColor).replace(/, 0.5\)/, ', 1)')})`
                    : 'drop-shadow(0 0 3px #FDF8F3) drop-shadow(0 0 6px #FDF8F3)',
                  transform: isOpen ? 'scaleX(-1)' : 'none',
                  transition: 'transform 0.3s',
                }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="0,0 24,32 0,64" fill={isOpen ? (overlayColor || defaultOverlayColor).replace(/, 0.5\)/, ', 1)') : '#FDF8F3'} />
              </svg>
            </div>
          </div>
          {/* Middle arrow (original) */}
          <div
            className="overlay-arrow-area"
            aria-label={isOpen ? 'Close overlay' : 'Open overlay'}
            tabIndex={0}
            role="button"
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                isOpen ? onClose() : onOpen();
              }
            }}
            onClick={() => isOpen ? onClose() : onOpen()}
          >
            <div className="overlay-arrow-area__icon">
              <svg
                className={!isOpen ? 'bouncy-arrow' : ''}
                width="24"
                height="64"
                viewBox="0 0 24 64"
                style={{
                  display: 'block',
                  filter: isOpen
                    ? `drop-shadow(0 0 3px ${(overlayColor || defaultOverlayColor).replace(/, 0.5\)/, ', 1)')}) drop-shadow(0 0 6px ${(overlayColor || defaultOverlayColor).replace(/, 0.5\)/, ', 1)')})`
                    : 'drop-shadow(0 0 3px #FDF8F3) drop-shadow(0 0 6px #FDF8F3)',
                  transform: isOpen ? 'scaleX(-1)' : 'none',
                  transition: 'transform 0.3s',
                }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="0,0 24,32 0,64" fill={isOpen ? (overlayColor || defaultOverlayColor).replace(/, 0.5\)/, ', 1)') : '#FDF8F3'} />
              </svg>
            </div>
          </div>
          {/* Bottom arrow */}
          <div
            className="overlay-arrow-area"
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              top: 'auto',
              height: '33%',
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
            tabIndex={0}
            role="button"
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                isOpen ? onClose() : onOpen();
              }
            }}
            onClick={() => isOpen ? onClose() : onOpen()}
          >
            <div className="overlay-arrow-area__icon">
              <svg
                className={!isOpen ? 'bouncy-arrow' : ''}
                width="24"
                height="64"
                viewBox="0 0 24 64"
                style={{
                  display: 'block',
                  filter: isOpen
                    ? `drop-shadow(0 0 3px ${(overlayColor || defaultOverlayColor).replace(/, 0.5\)/, ', 1)')}) drop-shadow(0 0 6px ${(overlayColor || defaultOverlayColor).replace(/, 0.5\)/, ', 1)')})`
                    : 'drop-shadow(0 0 3px #FDF8F3) drop-shadow(0 0 6px #FDF8F3)',
                  transform: isOpen ? 'scaleX(-1)' : 'none',
                  transition: 'transform 0.3s',
                }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon points="0,0 24,32 0,64" fill={isOpen ? (overlayColor || defaultOverlayColor).replace(/, 0.5\)/, ', 1)') : '#FDF8F3'} />
              </svg>
            </div>
          </div>
        </>
      )}
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
};

export default MasonryGallery; 