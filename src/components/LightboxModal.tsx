import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface LightboxModalProps {
  open: boolean;
  src: string;
  type: 'image' | 'video';
  onClose: () => void;
  alt?: string;
}

const LightboxModal: React.FC<LightboxModalProps> = ({ open, src, type, onClose, alt }) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // Focus the close button when modal opens
    closeBtnRef.current?.focus();
    // Add Escape key handler
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    // Add scroll handler to close on scroll
    const handleScroll = () => {
      onClose();
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open, onClose]);

  if (!open) return null;
  const modalContent = (
    <div className="lightbox-modal" onClick={onClose}>
      {type === 'image' ? (
        <img
          src={src}
          alt={alt || 'Lightbox'}
          className="lightbox-modal__img"
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          controls
          className="lightbox-modal__video"
          onClick={e => e.stopPropagation()}
        />
      )}
      <button
        className="lightbox-modal__close"
        onClick={e => { e.stopPropagation(); onClose(); }}
        aria-label="Close lightbox"
        ref={closeBtnRef}
      >
        ×
      </button>
    </div>
  );
  return ReactDOM.createPortal(modalContent, document.body);
};

export default LightboxModal; 