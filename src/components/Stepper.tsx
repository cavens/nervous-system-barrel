import React from 'react';

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  isBool?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  isBool = false
}) => {
  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const displayValue = isBool ? (value === 1 ? 'Yes' : 'No') : value;

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '14px'
    }}>
      <span style={{ flex: 1 }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={handleDecrease}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          style={{
            width: '28px',
            height: '28px',
            border: '1px solid #000',
            background: '#D2D8D5',
            cursor: value <= min ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: value <= min ? 0.4 : 1
          }}
        >
          −
        </button>
        <span style={{ 
          minWidth: '40px', 
          textAlign: 'center',
          fontWeight: '500'
        }}>
          {displayValue}
        </span>
        <button
          onClick={handleIncrease}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          style={{
            width: '28px',
            height: '28px',
            border: '1px solid #000',
            background: '#D2D8D5',
            cursor: value >= max ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: value >= max ? 0.4 : 1
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};
