"use client";
import { useRef, useEffect } from "react";
import styles from './VideoProjectOverlay.module.css';

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

export default function VideoProjectOverlay({
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
  const overlayRef = useRef<HTMLDivElement>(null);

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
    <div className={`w-full aspect-[16/9] lg:h-screen bg-white dark:bg-gray-800 shadow overflow-hidden relative flex flex-col justify-center ${styles.container}`} ref={overlayRef}>
      {/* Dashed line at the top, now matches overlay color */}
      <div
        className={styles.dashedLine}
        style={{ borderTop: `4px dashed ${solidLineColor}` }}
      />
      {/* Top arrow */}
      <div
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
      {/* Middle arrow (original) */}
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
      {/* Bottom arrow */}
      <div
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
      <div className={`w-full h-full flex items-center justify-center ${styles.videoContainer}`}>
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover ${styles.video}`}
          onPlay={(e) => {
            // Prevent play/pause conflicts
            e.currentTarget.play().catch(() => {
              // Ignore play errors - they're usually harmless
            });
          }}
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