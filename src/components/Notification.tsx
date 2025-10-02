import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  message: string;
  onComplete: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, onComplete }) => {
  const [shouldFade, setShouldFade] = useState(false);

  useEffect(() => {
    // Reset state when message changes
    setShouldFade(false);

    // Start fading out after 1 second
    const fadeTimer = setTimeout(() => {
      setShouldFade(true);
    }, 1000); // Start fade after 1 second

    // Complete notification after 2 seconds total
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [message, onComplete]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message} // Key ensures new messages replace old ones
        initial={{ opacity: 1 }}
        animate={{ opacity: shouldFade ? 0 : 1 }}
        transition={{ duration: shouldFade ? 1.0 : 0, ease: "easeOut" }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '32px',
          fontWeight: '600',
          color: '#000',
          textAlign: 'center',
          zIndex: 1000,
          pointerEvents: 'none',
          fontFamily: 'Athiti, sans-serif',
          background: '#fff',
          padding: '8px 16px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
};
