export type OneToFive = 1 | 2 | 3 | 4 | 5;

export interface GeneticsInputs {
  familyAnxiety: boolean;
  familyStressIllness: boolean;
  personalSensitivity: OneToFive;
}

export interface ACEInputs {
  emotionalAbuseNeglect: boolean;
  physicalAbuseNeglect: boolean;
  sexualAbuse: boolean;
  householdDysfunction: boolean;
}

export interface DailyFactorsInputs {
  sleepQuality: OneToFive;
  dietQuality: OneToFive;
  exerciseFrequency: OneToFive;
  medicalStatus: OneToFive;
  workSatisfaction: OneToFive;
  purposeMeaning: OneToFive;
  spiritualPractice: OneToFive;
  significantOther: OneToFive;
  otherRelationships: OneToFive;
  financialStress: OneToFive;
  jobSecurity: OneToFive;
}

export interface SocialInputs {
  support: OneToFive;
  safety: OneToFive;
  barriers: OneToFive;
}

export interface AcuteEvent {
  label: string;
  magnitude: number;
  occurredAt: Date;
  decayPeriods: number; // Number of time periods (seconds) for linear decay
}

export interface BarrelParts {
  genetics: number;
  trauma: number;
  social: number;
  daily: number;
  acute: number;
  total: number;
}

export interface ComputeBarrelInputs {
  genetics: GeneticsInputs;
  ace: ACEInputs;
  healing: number;
  daily: DailyFactorsInputs;
  social: SocialInputs;
  acuteEvents: AcuteEvent[];
}

export interface Params {
  wTrauma: number;
  wDaily: number;
  wSocial: number;
  baseMin: number;
  baseMax: number;
  sensitivityGain: number;
  alphaCap: number;
  betaAmp: number;
  etaUp: number;
  etaDownBase: number;
  overflowSlowdown: number;
}

export type SliceType = 'genetics' | 'trauma' | 'social' | 'daily' | 'acute' | 'headspace';

export interface SliceData {
  type: SliceType;
  color: string;
  label: string;
  percentage: number;
  y: number;
  height: number;
}
