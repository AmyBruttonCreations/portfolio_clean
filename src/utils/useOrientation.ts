import { useState, useEffect } from 'react';

export function useOrientation(): 'portrait' | 'landscape' {
  const getOrientation = () =>
    typeof window !== 'undefined' && window.innerWidth < window.innerHeight
      ? 'portrait'
      : 'landscape';
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(getOrientation());

  useEffect(() => {
    const updateOrientation = () => setOrientation(getOrientation());
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);
    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

  return orientation;
} 