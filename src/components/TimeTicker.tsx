import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface TimeTickerProps {
  onTick: () => void;
  width?: number;
  height?: number;
}

export const TimeTicker: React.FC<TimeTickerProps> = ({ 
  onTick, 
  width = 300, 
  height = 8 
}) => {
  const [phase, setPhase] = useState<'grow' | 'wipe'>('grow');
  const onTickRef = useRef(onTick);

  // Always use the latest onTick callback
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    // Trigger tick every 1 second
    const interval = setInterval(() => {
      onTickRef.current();
      setPhase(current => current === 'grow' ? 'wipe' : 'grow');
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      style={{ 
        position: 'relative', 
        width, 
        height,
        background: '#D2D8D5',
        overflow: 'hidden'
      }}
      aria-label="time ticker"
    >
      {phase === 'grow' && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            background: '#000'
          }}
        />
      )}
      {phase === 'wipe' && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, ease: 'linear' }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            background: '#D2D8D5'
          }}
        />
      )}
    </div>
  );
};