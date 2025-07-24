import React, { useEffect, useRef } from 'react';

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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
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
};

export default LightboxModal; 