import React, { useEffect, useRef, useState } from 'react';

interface TimeTickerProps {
  onTick: () => void;
  width?: number;
  height?: number;
}

export const TimeTicker: React.FC<TimeTickerProps> = ({ 
  onTick, 
  width = 200, 
  height = 1 
}) => {
  const onTickRef = useRef(onTick);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Always use the latest onTick callback
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    // Trigger tick every 1 second
    const tickInterval = setInterval(() => {
      onTickRef.current();
    }, 1000);

    // Animation interval - 60fps for smooth animation
    const animationInterval = setInterval(() => {
      setAnimationProgress(prev => {
        const newProgress = prev + (200 / 60); // 1 second = 60 frames at 60fps, so 200% in 1 second
        if (newProgress >= 200) return 0; // Reset after 1 second
        return newProgress;
      });
    }, 1000 / 60); // 60fps

    return () => {
      clearInterval(tickInterval);
      clearInterval(animationInterval);
    };
  }, []);

  // Calculate width and margin-left based on animation progress
  const lineStyle = animationProgress <= 100 
    ? {
        width: `${animationProgress}%`,
        marginLeft: '0%'
      }
    : {
        width: `${200 - animationProgress}%`,
        marginLeft: `${animationProgress - 100}%`
      };

  return (
    <div 
      style={{ 
        position: 'relative', 
        width, 
        height,
        background: '#D2D8D5',
        border: 'none',
        overflow: 'hidden'
      }}
      aria-label="time ticker"
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          background: '#000',
          ...lineStyle
        }}
      />
    </div>
  );
};