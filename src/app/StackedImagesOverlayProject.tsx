import React, { useRef, useEffect } from "react";

export interface StackedImagesOverlayProjectProps {
  title: string;
  company: string;
  software: string;
  description: string;
  images: string[];
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  overlayColor?: string;
  onImageClick?: (src: string) => void;
}

const defaultOverlayColor = 'rgba(239, 20, 129, 0.5)';

const StackedImagesOverlayProject: React.FC<StackedImagesOverlayProjectProps> = ({
  title,
  company,
  software,
  description,
  images,
  isOpen,
  onOpen,
  onClose,
  overlayColor = defaultOverlayColor,
  onImageClick,
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Snap overlay back if scrolled out of view
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

  return (
    <div className="w-full flex flex-col items-center relative px-8" style={{ minHeight: 400 }} ref={overlayRef}>
      {/* Yellow dashed line at the top for consistency */}
      <div
        style={{
          borderTop: '4px dashed rgb(239,20,129)',
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
      {/* SVG arrow for opening overlay */}
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
      {/* Vertically stacked images */}
      <div className="w-full flex flex-col items-center gap-6 py-12" style={{ position: 'relative', zIndex: 0 }}>
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`${title} image ${idx + 1}`}
            style={{ width: '100%', maxWidth: 600, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.12)', cursor: onImageClick ? 'pointer' : undefined }}
            onClick={() => onImageClick && onImageClick(src)}
          />
        ))}
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
            <div
              style={{
                fontWeight: 400,
                fontSize: 'clamp(1rem, 1.5vw, 1.35rem)',
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
              style={{
                fontWeight: 400,
                fontSize: '1rem',
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
              style={{
                fontWeight: 400,
                fontSize: '1rem',
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
    </div>
  );
};

export default StackedImagesOverlayProject; 