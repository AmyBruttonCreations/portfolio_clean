import React from 'react';

interface MobileBannerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileBanner: React.FC<MobileBannerProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="mobile-banner">
      <span>{children}</span>
      <button
        className="mobile-banner__close"
        onClick={onClose}
        aria-label="Dismiss notification"
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClose();
          }
        }}
      >
        ×
      </button>
    </div>
  );
};

export default MobileBanner; 