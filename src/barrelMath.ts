import type {
  GeneticsInputs,
  ACEInputs,
  AcuteEvent,
  BarrelParts,
  ComputeBarrelInputs,
  Params,
  OneToFive
} from './types';

export const DEFAULT_PARAMS: Params = {
  wTrauma: 0.25,
  wDaily: 0.35,
  wSocial: 0.20,
  baseMin: 0.10,
  baseMax: 0.30,
  sensitivityGain: 0.30,
  alphaCap: 0.60,
  betaAmp: 0.30,
  etaUp: 0.40,
  etaDownBase: 0.18,
  overflowSlowdown: 0.60
};

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function toSigned(v: OneToFive): number {
  return (v - 3) / 2;
}

function invertLikert(v: OneToFive): OneToFive {
  return (6 - v) as OneToFive;
}

function computeGeneticsScore(g: GeneticsInputs): number {
  const boolSum = (g.familyAnxiety ? 1 : 0) + (g.familyStressIllness ? 1 : 0);
  const sensNorm = (g.personalSensitivity - 1) / 4;
  return clamp01((boolSum / 2) * 0.5 + sensNorm * 0.5);
}

function computeACEScore(ace: ACEInputs): number {
  const count = [
    ace.emotionalAbuseNeglect,
    ace.physicalAbuseNeglect,
    ace.sexualAbuse,
    ace.householdDysfunction
  ].filter(Boolean).length;
  return count / 4;
}

function computeGatedSum(
  values: number[],
  weight: number,
  cap: number,
  amp: number
): number {
  const positives = values.filter(v => v > 0);
  const negatives = values.filter(v => v < 0);
  
  const meanPos = positives.length > 0 
    ? positives.reduce((a, b) => a + b, 0) / values.length 
    : 0;
  
  const meanNeg = negatives.length > 0 
    ? negatives.reduce((a, b) => a + b, 0) / values.length 
    : 0;
  
  return weight * (-cap * meanPos + amp * Math.abs(meanNeg));
}

function computeAcuteContribution(events: AcuteEvent[], now: Date = new Date()): number {
  return events.reduce((sum, event) => {
    // Calculate elapsed time periods (1 period = 1 second)
    const elapsedSeconds = (now.getTime() - event.occurredAt.getTime()) / 1000;
    const elapsedPeriods = Math.floor(elapsedSeconds);
    
    // Linear decay over decayPeriods (default 10 periods = 10 seconds)
    const decayPeriods = event.decayPeriods || 10;
    const decayFactor = Math.max(0, 1 - elapsedPeriods / decayPeriods);
    
    return sum + event.magnitude * decayFactor;
  }, 0);
}

export function instantBarrelParts(
  inputs: ComputeBarrelInputs,
  params: Params = DEFAULT_PARAMS,
  dailyVariation: number = 0
): BarrelParts {
  const { genetics, ace, healing, daily, acuteEvents } = inputs;
  
  const gScore = computeGeneticsScore(genetics);
  const base = lerp(params.baseMin, params.baseMax, gScore);
  const sens = 1 + params.sensitivityGain * gScore;
  
  const aceScore = computeACEScore(ace);
  const tStress = params.wTrauma * aceScore * (1 - 0.5 * healing);
  
  const cap = clamp01(1 - params.alphaCap * aceScore * (1 - healing));
  const amp = 1 + params.betaAmp * aceScore * (1 - healing);
  
  const dailyVals = [
    toSigned(daily.sleepQuality),
    toSigned(daily.dietQuality),
    toSigned(daily.exerciseFrequency),
    toSigned(daily.medicalStatus),
    toSigned(daily.workSatisfaction),
    toSigned(daily.purposeMeaning),
    toSigned(invertLikert(daily.financialStress)),
    toSigned(daily.jobSecurity)
  ];
  const dailyScore = computeGatedSum(dailyVals, params.wDaily, cap, amp);
  
  
  const acuteScore = computeAcuteContribution(acuteEvents);
  
  // Calculate raw stress components
  const rawGenetics = base;
  const rawTrauma = sens * tStress;
  const rawDaily = sens * dailyScore;
  const rawAcute = sens * acuteScore;
  
  // Apply 5% minimum to all components except acute
  const geneticsComponent = Math.max(0.05, rawGenetics);
  const traumaComponent = Math.max(0.05, rawTrauma);
  const dailyComponent = Math.max(0.05, rawDaily);
  const acuteComponent = rawAcute; // Acute can be 0
  
  // Apply daily variation AFTER minimum is applied
  const variedDailyComponent = dailyComponent * (1 + dailyVariation);
  
  // Calculate total stress from the actual components
  const total = geneticsComponent + traumaComponent + variedDailyComponent + acuteComponent;
  
  return {
    genetics: geneticsComponent,
    trauma: traumaComponent,
    social: 0, // Social context removed
    daily: variedDailyComponent,
    acute: acuteComponent,
    total
  };
}

export function instantBarrelLevel(
  inputs: ComputeBarrelInputs,
  params: Params = DEFAULT_PARAMS
): number {
  return instantBarrelParts(inputs, params).total;
}

export interface SmoothingState {
  level: number;
}

export function updateSmoothedLevel(
  state: SmoothingState,
  targetLevel: number,
  aceScore: number,
  healing: number,
  params: Params = DEFAULT_PARAMS
): number {
  const rising = targetLevel > state.level;
  let eta = rising ? params.etaUp : params.etaDownBase * (1 - 0.5 * aceScore * (1 - healing));
  
  if (!rising && state.level > 0.8) {
    eta *= params.overflowSlowdown;
  }
  
  const newLevel = clamp01(state.level + eta * (targetLevel - state.level) * 0.1);
  state.level = newLevel;
  return newLevel;
}
