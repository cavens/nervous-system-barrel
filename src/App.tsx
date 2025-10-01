import { useState, useEffect, useCallback, useRef } from 'react';
import { BarrelChart } from './components/BarrelChart';
import { TimeTicker } from './components/TimeTicker';
import { SuddenEventsPanel } from './components/SuddenEventsPanel';
import { ControlPanels } from './components/ControlPanels';
import { instantBarrelParts, updateSmoothedLevel, DEFAULT_PARAMS } from './barrelMath';
import type {
  GeneticsInputs,
  ACEInputs,
  DailyFactorsInputs,
  AcuteEvent,
  SliceType
} from './types';

const INITIAL_GENETICS: GeneticsInputs = {
  familyAnxiety: false,
  familyStressIllness: false,
  personalSensitivity: 2
};

const INITIAL_ACE: ACEInputs = {
  emotionalAbuseNeglect: true,
  physicalAbuseNeglect: false,
  sexualAbuse: false,
  householdDysfunction: false
};

const INITIAL_DAILY: DailyFactorsInputs = {
  sleepQuality: 1,
  dietQuality: 1,
  exerciseFrequency: 1,
  medicalStatus: 1,
  workSatisfaction: 1,
  purposeMeaning: 1,
  financialStress: 5,
  jobSecurity: 1
};


export default function App() {
  const [genetics, setGenetics] = useState<GeneticsInputs>(INITIAL_GENETICS);
  const [ace, setACE] = useState<ACEInputs>(INITIAL_ACE);
  const [healing, setHealing] = useState<number>(0);
  const [daily, setDaily] = useState<DailyFactorsInputs>(INITIAL_DAILY);
  const [acuteEvents, setAcuteEvents] = useState<AcuteEvent[]>([]);
  const [selectedSlice, setSelectedSlice] = useState<SliceType | null>(null);
  
  const smoothingState = useRef<SmoothingState>({ level: 0.2 });
  const [displayLevel, setDisplayLevel] = useState(0.2);
  
  const [sampleQueue, setSampleQueue] = useState<number[]>([0.2, 0.2, 0.2, 0.2]);
  const [meltdown, setMeltdown] = useState(false);
  const [dailyVariation, setDailyVariation] = useState(0); // Random variation for day-to-day (±5%)
  
  const parts = instantBarrelParts({
    genetics,
    ace,
    healing,
    daily,
    social: { support: 3, safety: 3, barriers: 3 },
    acuteEvents
  }, DEFAULT_PARAMS, dailyVariation);
  
  const aceScore = [
    ace.emotionalAbuseNeglect,
    ace.physicalAbuseNeglect,
    ace.sexualAbuse,
    ace.householdDysfunction
  ].filter(Boolean).length / 4;
  
  useEffect(() => {
    if (meltdown) return;
    
    const animate = () => {
      const newLevel = updateSmoothedLevel(
        smoothingState.current,
        parts.total,
        aceScore,
        healing,
        DEFAULT_PARAMS
      );
      setDisplayLevel(newLevel);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    let animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [parts.total, aceScore, healing, meltdown]);
  
  const handleTick = useCallback(() => {
    if (meltdown) return;
    
    // Apply random variation to day-to-day (±20% = ±0.2)
    const randomVariation = (Math.random() - 0.5) * 0.4; // -0.2 to +0.2
    setDailyVariation(randomVariation);
    
    // Clean up expired acute events (older than their decayPeriods)
    setAcuteEvents(prev => {
      const now = new Date();
      return prev.filter(event => {
        const elapsedSeconds = (now.getTime() - event.occurredAt.getTime()) / 1000;
        const decayPeriods = event.decayPeriods || 10;
        return elapsedSeconds < decayPeriods;
      });
    });
    
    setSampleQueue(prev => {
      const newQueue = [...prev.slice(1), displayLevel];
      
      const avg = newQueue.reduce((a, b) => a + b, 0) / 4;
      if (avg >= 1.0) {
        setMeltdown(true);
      }
      
      return newQueue;
    });
  }, [displayLevel, meltdown]);
  
  const avgLevel = sampleQueue.reduce((a, b) => a + b, 0) / 4;
  const overstressed = avgLevel >= 0.90 && avgLevel < 1.0 && !meltdown;
  
  const handleReset = () => {
    setMeltdown(false);
    setSampleQueue([0.2, 0.2, 0.2, 0.2]);
    smoothingState.current.level = 0.2;
    setDisplayLevel(0.2);
    setDailyVariation(0);
  };
  
  const handleAddEvent = (event: AcuteEvent) => {
    setAcuteEvents(prev => [...prev, event]);
  };
  
  const handleRemoveEvent = (index: number) => {
    setAcuteEvents(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSelectSlice = (slice: SliceType | null) => {
    setSelectedSlice(slice);
  };
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BODY' || target.id === 'root') {
        setSelectedSlice(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#D2D8D5',
        fontFamily: 'Athiti, sans-serif',
        padding: '40px 20px'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '32px',
          fontSize: '32px',
          fontWeight: '600'
        }}>
          Nervous System Barrel
        </h1>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <TimeTicker onTick={handleTick} width={300} height={8} />
        </div>
        
        <div style={{ 
          position: 'relative',
          width: '100%',
          height: '600px'
        }}>
          {/* Controls on the left */}
          <div style={{ 
            position: 'absolute',
            left: '20px',
            top: '0',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            zIndex: 10
          }}>
              <SuddenEventsPanel
                onAddEvent={handleAddEvent}
              />
            
            <ControlPanels
              selectedSlice={selectedSlice}
              genetics={genetics}
              ace={ace}
              healing={healing}
              daily={daily}
              onUpdateGenetics={setGenetics}
              onUpdateACE={setACE}
              onUpdateHealing={setHealing}
              onUpdateDaily={setDaily}
            />
          </div>
          
          {/* Barrel perfectly centered */}
          <div style={{ 
            position: 'absolute',
            left: '50%',
            top: '0',
            transform: 'translateX(-200px)' // Center the visible bar: barX (100px) + barWidth/2 (100px) = 200px
          }}>
            <BarrelChart
              parts={parts}
              fillFrac={displayLevel}
              overstressed={overstressed}
              meltdown={meltdown}
              selectedSlice={selectedSlice}
              onSelectSlice={handleSelectSlice}
            />
            
            {meltdown && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: '2px solid #000',
                    background: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
