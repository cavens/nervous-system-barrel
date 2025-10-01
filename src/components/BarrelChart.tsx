import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BarrelParts, SliceType } from '../types';

interface BarrelChartProps {
  parts: BarrelParts;
  fillFrac: number;
  overstressed: boolean;
  meltdown: boolean;
  selectedSlice: SliceType | null;
  onSelectSlice: (slice: SliceType | null) => void;
}

interface SliceConfig {
  type: SliceType;
  color: string;
  pattern?: 'stripes';
  label: string;
}

const SLICE_CONFIGS: SliceConfig[] = [
  { type: 'genetics', color: '#000000', label: 'Genetics' },
  { type: 'trauma', color: '#9A9A9A', label: 'Trauma' },
  { type: 'daily', color: '#FFFFFF', pattern: 'stripes', label: 'Day to day' },
  { type: 'acute', color: '#0008D1', label: 'Acute' }
];

export const BarrelChart: React.FC<BarrelChartProps> = ({
  parts,
  fillFrac,
  overstressed,
  meltdown,
  selectedSlice,
  onSelectSlice
}) => {
  const barWidth = 200;
  const barHeight = 500;
  const totalWidth = 600;
  const barX = (totalWidth - barWidth) / 2 - 100;
  
  // Minimum heights for base layers (in pixels)
  const MIN_HEIGHT = 30;
  
  // Calculate percentages (each component as % of total barrel)
  const totalStress = parts.genetics + parts.trauma + parts.daily + parts.acute;
  
  const percentages = {
    genetics: Math.round(parts.genetics * 100),
    trauma: Math.round(parts.trauma * 100),
    social: 0, // Social context removed
    daily: Math.round(parts.daily * 100),
    acute: Math.round(parts.acute * 100),
    headspace: Math.round((1 - fillFrac) * 100)
  };
  
  // Calculate slice heights directly from percentages (proportional to filled area)
  const filledHeight = fillFrac * barHeight;
  const sliceHeights = {
    genetics: totalStress > 0 ? (parts.genetics / totalStress) * filledHeight : 0,
    trauma: totalStress > 0 ? (parts.trauma / totalStress) * filledHeight : 0,
    social: 0, // Social context removed
    daily: totalStress > 0 ? (parts.daily / totalStress) * filledHeight : 0,
    acute: totalStress > 0 ? (parts.acute / totalStress) * filledHeight : 0
  };
  
  const headspaceHeight = (1 - fillFrac) * barHeight;
  
  // Build slices, filtering out acute if it has no contribution
  let currentY = barHeight;
  const slices = SLICE_CONFIGS
    .filter(config => config.type !== 'acute' || parts.acute > 0) // Hide acute if no events
    .map(config => {
      const height = sliceHeights[config.type];
      currentY -= height;
      return {
        ...config,
        y: currentY,
        height,
        percentage: percentages[config.type]
      };
    });
  
  currentY -= headspaceHeight;
  const headspaceSlice = {
    type: 'headspace' as SliceType,
    color: '#FFFFFF',
    label: 'Headspace',
    y: currentY,
    height: headspaceHeight,
    percentage: percentages.headspace
  };
  
  const allSlices = [...slices, headspaceSlice];
  
  const shakeVariants = {
    shake: {
      x: [0, -2, 2, -2, 2, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'loop' as const
      }
    },
    normal: { x: 0 }
  };
  
  const meltdownVariants = {
    explode: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.8 }
    },
    normal: { opacity: 1, scale: 1 }
  };

  return (
    <div style={{ position: 'relative', width: totalWidth, height: barHeight + 100 }}>
      {/* Center indicators - positioned independently of barrel shake */}
      <div style={{ position: 'absolute', left: barX + barWidth/2 - 20, top: barHeight * 0.5, fontSize: '12px', color: '#000', textAlign: 'center', width: '40px', zIndex: 10 }}>
        <span style={{ background: '#fff', padding: '0px 2px', borderRadius: '1px', lineHeight: '1', display: 'inline-block' }}>
          Great
        </span>
      </div>
      <div style={{ position: 'absolute', left: barX + barWidth/2 - 15, top: barHeight * 0.4, fontSize: '12px', color: '#000', textAlign: 'center', width: '30px', zIndex: 10 }}>
        <span style={{ background: '#fff', padding: '0px 2px', borderRadius: '1px', lineHeight: '1', display: 'inline-block' }}>
          Good
        </span>
      </div>
      <div style={{ position: 'absolute', left: barX + barWidth/2 - 25, top: barHeight * 0.25, fontSize: '12px', color: '#000', textAlign: 'center', width: '50px', zIndex: 10 }}>
        <span style={{ background: '#fff', padding: '0px 2px', borderRadius: '1px', lineHeight: '1', display: 'inline-block' }}>
          Stressed
        </span>
      </div>
      <div style={{ position: 'absolute', left: barX + barWidth/2 - 40, top: barHeight * 0.1, fontSize: '12px', color: '#000', textAlign: 'center', width: '80px', zIndex: 10 }}>
        <span style={{ background: '#fff', padding: '0px 2px', borderRadius: '1px', lineHeight: '1', display: 'inline-block' }}>
          Overstressed
        </span>
      </div>
      <div style={{ position: 'absolute', left: barX + barWidth/2 - 30, top: 0, fontSize: '12px', color: '#000', textAlign: 'center', width: '60px', zIndex: 10 }}>
        <span style={{ background: '#fff', padding: '0px 2px', borderRadius: '1px', lineHeight: '1', display: 'inline-block' }}>
          Melt-down
        </span>
      </div>
      
      {/* White horizontal lines behind labels - aligned with top of highlights */}
      <div style={{ position: 'absolute', left: barX, top: barHeight * 0.5 + 3, width: barWidth, height: '1px', background: '#fff', zIndex: 5 }}></div>
      <div style={{ position: 'absolute', left: barX, top: barHeight * 0.4 + 3, width: barWidth, height: '1px', background: '#fff', zIndex: 5 }}></div>
      <div style={{ position: 'absolute', left: barX, top: barHeight * 0.25 + 3, width: barWidth, height: '1px', background: '#fff', zIndex: 5 }}></div>
      <div style={{ position: 'absolute', left: barX, top: barHeight * 0.1 + 3, width: barWidth, height: '1px', background: '#fff', zIndex: 5 }}></div>
      
      <motion.svg
        width={totalWidth}
        height={barHeight + 80}
        animate={overstressed && !meltdown ? 'shake' : 'normal'}
        variants={shakeVariants}
      >
        <defs>
          <pattern
            id="diagonalStripes"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <rect width="4" height="8" fill="#000000" />
            <rect x="4" width="4" height="8" fill="#FFFFFF" />
          </pattern>
        </defs>
        
        {/* Container rect - always black 2px stroke all around */}
        <motion.rect
          x={barX}
          y={0}
          width={barWidth}
          height={barHeight}
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          animate={meltdown ? 'explode' : 'normal'}
          variants={meltdownVariants}
        />
        
        <AnimatePresence>
          {allSlices.map((slice, idx) => {
            if (slice.height <= 0) return null;
            
            const fill = slice.type === 'daily' && slice.height > 0
              ? 'url(#diagonalStripes)'
              : slice.type === 'headspace'
              ? `${slice.color}`
              : slice.color;
            
            const opacity = slice.type === 'headspace' ? 1 : 1;
            
            const meltdownSliceVariant = {
              explode: {
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                rotate: (Math.random() - 0.5) * 360,
                opacity: 0,
                transition: { duration: 1, delay: idx * 0.05 }
              },
              normal: { x: 0, y: 0, rotate: 0, opacity }
            };
            
            return (
              <g key={slice.type}>
                <motion.rect
                  x={barX}
                  y={slice.y}
                  width={barWidth}
                  height={slice.height}
                  fill={fill}
                  opacity={opacity}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectSlice(selectedSlice === slice.type ? null : slice.type)}
                  animate={meltdown ? 'explode' : 'normal'}
                  variants={meltdownSliceVariant}
                />
                
                {!meltdown && slice.height > 5 && (
                  <g>
                    <text
                      x={barX + barWidth + 10}
                      y={slice.y + slice.height / 2 + 4}
                      fontSize={14}
                      fill="#000"
                      fontFamily="Athiti, sans-serif"
                    >
                      {slice.label} · {slice.percentage}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </AnimatePresence>
      </motion.svg>
      
      <div style={{ 
        position: 'absolute', 
        left: barX, 
        top: barHeight + 20,
        width: barWidth,
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: '600'
      }}>
        {getStatusLabel(fillFrac)}
      </div>
      
      {meltdown && (
        <div style={{
          position: 'absolute',
          left: barX,
          top: barHeight / 2 - 40,
          width: barWidth,
          textAlign: 'center',
          fontSize: '32px',
          fontWeight: '700',
          color: '#FF0000'
        }}>
          MELTDOWN
        </div>
      )}
    </div>
  );
};
function getStatusLabel(level: number): React.ReactNode {
  if (level >= 1.0) {
    return <span style={{ color: '#FF0000' }}>Fuse-Box Meltdown</span>;
  } else if (level >= 0.90) {
    return <span style={{ color: '#FF6600' }}>Overstressed</span>;
  } else if (level >= 0.70) {
    return <span style={{ color: '#FF9900' }}>Mental Health Complaints</span>;
  } else if (level >= 0.50) {
    return <span style={{ color: '#FFCC00' }}>Stressed</span>;
  } else {
    return <span style={{ color: '#00AA00' }}>Feeling OK</span>;
  }
}

