import React, { useEffect, useRef, useState } from 'react';

interface PixelArtSpriteProps {
  basePath: string; // e.g. '/cel-animation/sprites/retimed/BAMBI_'
  frameCount: number;
  idleEnd: number; // last frame of idle loop (inclusive, zero-based)
  runStart: number; // first frame of run sequence (inclusive, zero-based)
  runEnd: number; // last frame of run sequence (inclusive, zero-based)
  trigger: boolean; // when true, play run sequence
  style?: React.CSSProperties;
  className?: string;
  playOnceInView?: boolean;
}

const FRAME_RATE = 24; // 24 fps for smooth animation

const pad = (num: number, size: number) => num.toString().padStart(size, '0');

const PixelArtSprite: React.FC<PixelArtSpriteProps> = ({
  basePath,
  frameCount,
  idleEnd,
  runStart,
  runEnd,
  trigger,
  style,
  className,
  playOnceInView,
}) => {
  const [frame, setFrame] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const spriteRef = useRef<HTMLImageElement>(null);

  // Preload all frames
  useEffect(() => {
    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image();
      img.src = `${basePath}${pad(i, 5)}.png`;
    }
  }, [basePath, frameCount]);

  // Animation logic
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (trigger) {
      // Play run animation from runStart to runEnd once
      setIsRunning(true);
      setFrame(runStart);
      let current = runStart;
      intervalRef.current = setInterval(() => {
        current++;
        if (current <= runEnd) {
          setFrame(current);
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsRunning(false);
        }
      }, 1000 / FRAME_RATE);
    } else {
      // Idle loop
      setIsRunning(false);
      setFrame(0);
      let current = 0;
      intervalRef.current = setInterval(() => {
        current = (current < idleEnd) ? current + 1 : 0;
        setFrame(current);
      }, 1000 / FRAME_RATE);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [trigger, idleEnd, runStart, runEnd]);

  // IntersectionObserver for playOnceInView
  useEffect(() => {
    if (!playOnceInView) return;
    if (!spriteRef.current) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isRunning) {
            setIsRunning(true);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(spriteRef.current);
    return () => observer.disconnect();
  }, [playOnceInView, isRunning]);

  // Reset to idle when overlay closes
  useEffect(() => {
    if (!trigger) {
      setIsRunning(false);
      setFrame(0);
    }
  }, [trigger]);

  return (
    <img
      ref={spriteRef}
      src={`${basePath}${pad(frame, 5)}.png`}
      alt="Pixel sprite animation"
      style={{
        imageRendering: 'pixelated',
        width: 'clamp(120px, 18vw, 240px)',
        height: 'auto',
        position: 'absolute',
        left: '50%',
        top: 0,
        transform: 'translateX(-50%)',
        zIndex: 3,
        ...style,
      }}
      className={className}
      draggable={false}
    />
  );
};

export default PixelArtSprite; 