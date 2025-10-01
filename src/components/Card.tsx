import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ title, children, style }) => {
  return (
    <div style={{
      background: '#D2D8D5',
      border: '1px solid #000',
      padding: '16px',
      ...style
    }}>
      <h3 style={{ 
        margin: '0 0 12px 0',
        fontSize: '16px',
        fontWeight: '600'
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
};
