import { useState, useEffect, useCallback, useRef } from 'react';
import { BarrelChart } from './components/BarrelChart';
import { TimeTicker } from './components/TimeTicker';
import { SuddenEventsPanel } from './components/SuddenEventsPanel';
import { DailyPanel, TraumaPanel, GeneticsPanel } from './components/ControlPanels';
import { Notification } from './components/Notification';
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
  sleepQuality: 1, // Poor
  dietQuality: 2, // Slightly poor
  exerciseFrequency: 1, // Poor
  medicalStatus: 2, // Slightly poor
  workSatisfaction: 1, // Poor
  purposeMeaning: 2, // Slightly poor
  spiritualPractice: 2, // Slightly poor
  significantOther: 2, // Slightly poor
  otherRelationships: 2, // Slightly poor
  financialStress: 4, // High stress
  jobSecurity: 2 // Slightly poor
};


export default function App() {
  const [genetics, setGenetics] = useState<GeneticsInputs>(INITIAL_GENETICS);
  const [ace, setACE] = useState<ACEInputs>(INITIAL_ACE);
  const [healing, setHealing] = useState<number>(0);
  const [daily, setDaily] = useState<DailyFactorsInputs>(INITIAL_DAILY);
  const [acuteEvents, setAcuteEvents] = useState<AcuteEvent[]>([]);
  const [selectedSlice, setSelectedSlice] = useState<SliceType | null>(null);
  
  const smoothingState = useRef<{ level: number }>({ level: 0.2 });
  const [displayLevel, setDisplayLevel] = useState(0.2);
  
  const [sampleQueue, setSampleQueue] = useState<number[]>([0.2, 0.2, 0.2, 0.2]);
  const [meltdown, setMeltdown] = useState(false);
  const [dailyVariation, setDailyVariation] = useState(0); // Random variation for day-to-day (±5%)

  // Notification system
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = useCallback((message: string) => {
    setNotification(message);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  // Wrapper functions for showing notifications
  const updateGenetics = useCallback((newGenetics: GeneticsInputs) => {
    const oldGenetics = genetics;
    setGenetics(newGenetics);
    
    // Check what changed and show notification
    if (oldGenetics.familyAnxiety !== newGenetics.familyAnxiety) {
      showNotification(newGenetics.familyAnxiety ? "Family anxiety/depression" : "No family anxiety/depression");
    } else if (oldGenetics.familyStressIllness !== newGenetics.familyStressIllness) {
      showNotification(newGenetics.familyStressIllness ? "Stress-related illness in family" : "No stress-related illness in family");
    } else if (oldGenetics.personalSensitivity !== newGenetics.personalSensitivity) {
      const diff = newGenetics.personalSensitivity - oldGenetics.personalSensitivity;
      showNotification(`Personal sensitivity ${diff > 0 ? '+' : '-'}`);
    }
  }, [genetics, showNotification]);

  const updateACE = useCallback((newACE: ACEInputs) => {
    const oldACE = ace;
    setACE(newACE);
    
    // Check what changed and show notification
    if (oldACE.emotionalAbuseNeglect !== newACE.emotionalAbuseNeglect) {
      showNotification(newACE.emotionalAbuseNeglect ? "Emotional abuse/neglect" : "No emotional abuse/neglect");
    } else if (oldACE.physicalAbuseNeglect !== newACE.physicalAbuseNeglect) {
      showNotification(newACE.physicalAbuseNeglect ? "Physical abuse/neglect" : "No physical abuse/neglect");
    } else if (oldACE.sexualAbuse !== newACE.sexualAbuse) {
      showNotification(newACE.sexualAbuse ? "Sexual abuse" : "No sexual abuse");
    } else if (oldACE.householdDysfunction !== newACE.householdDysfunction) {
      showNotification(newACE.householdDysfunction ? "Household dysfunction" : "No household dysfunction");
    }
  }, [ace, showNotification]);

  const updateHealing = useCallback((newHealing: number) => {
    const oldHealing = healing;
    setHealing(newHealing);
    
    const diff = Math.round((newHealing - oldHealing) * 100);
    if (diff !== 0) {
      showNotification(`Healing progress ${diff > 0 ? '+' : '-'}`);
    }
  }, [healing, showNotification]);

  const updateDaily = useCallback((newDaily: DailyFactorsInputs) => {
    const oldDaily = daily;
    setDaily(newDaily);
    
    // Check what changed and show notification
    const fields = [
      { key: 'sleepQuality', label: 'Sleep quality' },
      { key: 'dietQuality', label: 'Diet quality' },
      { key: 'exerciseFrequency', label: 'Exercise frequency' },
      { key: 'medicalStatus', label: 'Medical status' },
      { key: 'workSatisfaction', label: 'Work satisfaction' },
      { key: 'purposeMeaning', label: 'Purpose/meaning' },
      { key: 'spiritualPractice', label: 'Spiritual practice' },
      { key: 'significantOther', label: 'Significant other' },
      { key: 'otherRelationships', label: 'Other relationships' },
      { key: 'financialStress', label: 'Financial stress' },
      { key: 'jobSecurity', label: 'Job security' }
    ];
    
    for (const field of fields) {
      if (oldDaily[field.key as keyof DailyFactorsInputs] !== newDaily[field.key as keyof DailyFactorsInputs]) {
        const diff = (newDaily[field.key as keyof DailyFactorsInputs] as number) - (oldDaily[field.key as keyof DailyFactorsInputs] as number);
        showNotification(`${field.label} ${diff > 0 ? '+' : '-'}`);
        break; // Only show notification for the first changed field
      }
    }
  }, [daily, showNotification]);

  const addAcuteEvent = useCallback((event: AcuteEvent) => {
    setAcuteEvents(prev => [...prev, event]);
    showNotification(`Sudden ${event.label.toLowerCase()}`);
  }, [showNotification]);
  
  const parts = instantBarrelParts({
    genetics,
    ace,
    healing,
    daily,
    social: { support: 3, safety: 3, barriers: 3 },
    acuteEvents
  }, DEFAULT_PARAMS, dailyVariation);
  
  const headspacePercent = Math.max(0, (1 - displayLevel) * 100);

  const getStatusMessage = (headspace: number) => {
    if (headspace >= 60) {
      return "You're doing great";
    } else if (headspace >= 42.5) {
      return "You're doing good";
    } else if (headspace >= 25) {
      return "You're stressed";
    } else if (headspace >= 10) {
      return "You're in the danger zone";
    } else if (headspace > 0) {
      return "Get out of here!!!";
    } else {
      return "Melt-down incoming BRACE BRACE";
    }
  };
  
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
    setGenetics(INITIAL_GENETICS);
    setACE(INITIAL_ACE);
    setHealing(0);
    setDaily(INITIAL_DAILY);
    setAcuteEvents([]);
    setSelectedSlice(null);
    smoothingState.current.level = 0.2;
    setDisplayLevel(0.2);
    setSampleQueue([0.2, 0.2, 0.2, 0.2]);
    setMeltdown(false);
    setDailyVariation(0);
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
    <>
      {/* Mobile message */}
      <div className="mobile-message">
        <h1>Need more (head)space to display the animation.</h1>
        <p>Please use your laptop.</p>
      </div>

      {/* Desktop content */}
      <div
        className="desktop-only"
        style={{
          minHeight: '100vh',
          background: '#D2D8D5',
          fontFamily: 'Athiti, sans-serif',
          padding: '40px 20px',
          overflowX: 'hidden'
        }}
      >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '32px',
          fontSize: '32px',
          fontWeight: '600'
        }}>
          {!meltdown && getStatusMessage(headspacePercent)}
        </h1>
        
        {/* Left side controls - positioned relative to page, 20px from top-left, hidden during meltdown */}
        {!meltdown && (
          <div style={{ 
            position: 'absolute',
            left: '20px',
            top: '20px',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            zIndex: 10
          }}>
          <SuddenEventsPanel
            onAddEvent={addAcuteEvent}
          />
          
          <DailyPanel daily={daily} onUpdate={updateDaily} />
          </div>
        )}
        
        {/* Right side controls - positioned relative to page, 20px from top-right, hidden during meltdown */}
        {!meltdown && (
          <div style={{ 
            position: 'absolute',
            right: '20px',
            top: '20px',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            zIndex: 10
          }}>
                    <TraumaPanel ace={ace} healing={healing} onUpdateACE={updateACE} onUpdateHealing={updateHealing} />
                    <GeneticsPanel genetics={genetics} onUpdate={updateGenetics} />
                    
                    {/* Reset button under Genetics panel */}
                    <button
                      onClick={handleReset}
                      style={{
                        width: '320px', // Same width as Genetics panel
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: '600',
                        border: '1px solid #000',
                        background: '#D2D8D5',
                        cursor: 'pointer',
                        color: '#000'
                      }}
                    >
                      Reset
                    </button>
                    
                    {/* Disclaimer text */}
                    <div style={{
                      width: '320px',
                      fontSize: '14px',
                      color: '#000',
                      textAlign: 'center',
                      marginTop: '-6px',
                      lineHeight: '1.4'
                    }}>
                      This model is based on nothing but common sense and chatGPT.
                    </div>
          </div>
        )}
        
        {/* Time ticker 10px under the status text - hidden during meltdown */}
        {!meltdown && (
          <div style={{ 
            position: 'relative',
            left: '50%',
            transform: 'translateX(-100px)', // Align with barrel's left edge: barX offset
            marginBottom: '20px'
          }}>
            <TimeTicker onTick={handleTick} width={200} height={1} />
          </div>
        )}
        
        <div style={{ 
          position: 'relative',
          width: '100%',
          height: '600px'
        }}>
          
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
          </div>
        </div>
        
                {/* Explosion message - positioned relative to main page, centered during meltdown */}
                {meltdown && (
                  <div style={{ 
                    position: 'absolute',
                    left: '50%',
                    top: 'calc(50% - 200px)',
                    transform: 'translateX(-50%)',
                    marginTop: '-40px',
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#000',
                    whiteSpace: 'nowrap',
                    zIndex: 15
                  }}>
                    Oh boy, now you're screwed :)
                  </div>
                )}
        
        {/* Reset button - positioned relative to main page, centered during meltdown */}
        {meltdown && (
          <div style={{ 
            position: 'absolute',
            left: '50%',
            top: 'calc(50% - 200px)',
            transform: 'translateX(-50%)',
            marginTop: '20px',
            display: 'flex', 
            justifyContent: 'center',
            width: '100%',
            zIndex: 20
          }}>
            <button
              onClick={handleReset}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                border: '1px solid #000',
                background: '#D2D8D5',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>
        )}
      </div>
      
        {/* Notification overlay */}
        {notification && (
          <Notification 
            message={notification} 
            onComplete={hideNotification} 
          />
        )}
      </div>
    </>
  );
}
