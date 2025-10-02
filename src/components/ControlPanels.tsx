import React from 'react';
import { Card } from './Card';
import { Stepper } from './Stepper';
import type { GeneticsInputs, ACEInputs, DailyFactorsInputs, SliceType, OneToFive } from '../types';

interface GeneticsPanelProps {
  genetics: GeneticsInputs;
  onUpdate: (genetics: GeneticsInputs) => void;
}

export const GeneticsPanel: React.FC<GeneticsPanelProps> = ({ genetics, onUpdate }) => {
  return (
    <Card title="Genetics" style={{ width: '320px' }}>
      <Stepper
        label="Family anxiety/depression"
        value={genetics.familyAnxiety ? 1 : 0}
        min={0}
        max={1}
        isBool
        onChange={(v) => onUpdate({ ...genetics, familyAnxiety: v === 1 })}
      />
      <Stepper
        label="Stress-related illness in family"
        value={genetics.familyStressIllness ? 1 : 0}
        min={0}
        max={1}
        isBool
        onChange={(v) => onUpdate({ ...genetics, familyStressIllness: v === 1 })}
      />
      <Stepper
        label="Personal sensitivity (1-5)"
        value={genetics.personalSensitivity}
        min={1}
        max={5}
        onChange={(v) => onUpdate({ ...genetics, personalSensitivity: v as OneToFive })}
      />
    </Card>
  );
};

interface TraumaPanelProps {
  ace: ACEInputs;
  healing: number;
  onUpdateACE: (ace: ACEInputs) => void;
  onUpdateHealing: (healing: number) => void;
}

export const TraumaPanel: React.FC<TraumaPanelProps> = ({ ace, healing, onUpdateACE, onUpdateHealing }) => {
  const aceScore = [
    ace.emotionalAbuseNeglect,
    ace.physicalAbuseNeglect,
    ace.sexualAbuse,
    ace.householdDysfunction
  ].filter(Boolean).length;

  return (
    <Card title="Trauma & Healing" style={{ width: '320px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Stepper
          label="Emotional abuse/neglect"
          value={ace.emotionalAbuseNeglect ? 1 : 0}
          min={0}
          max={1}
          isBool
          onChange={(v) => onUpdateACE({ ...ace, emotionalAbuseNeglect: v === 1 })}
        />
        <Stepper
          label="Physical abuse/neglect"
          value={ace.physicalAbuseNeglect ? 1 : 0}
          min={0}
          max={1}
          isBool
          onChange={(v) => onUpdateACE({ ...ace, physicalAbuseNeglect: v === 1 })}
        />
        <Stepper
          label="Sexual abuse"
          value={ace.sexualAbuse ? 1 : 0}
          min={0}
          max={1}
          isBool
          onChange={(v) => onUpdateACE({ ...ace, sexualAbuse: v === 1 })}
        />
        <Stepper
          label="Household dysfunction"
          value={ace.householdDysfunction ? 1 : 0}
          min={0}
          max={1}
          isBool
          onChange={(v) => onUpdateACE({ ...ace, householdDysfunction: v === 1 })}
        />
      </div>
      
      <Stepper
        label="Healing progress (%)"
        value={Math.round(healing * 100)}
        min={0}
        max={100}
        step={5}
        onChange={(v) => onUpdateHealing(v / 100)}
      />
    </Card>
  );
};


interface DailyPanelProps {
  daily: DailyFactorsInputs;
  onUpdate: (daily: DailyFactorsInputs) => void;
}

export const DailyPanel: React.FC<DailyPanelProps> = ({ daily, onUpdate }) => {
  return (
    <Card title="Day to Day" style={{ width: '320px' }}>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Physical:</div>
        <Stepper
          label="Sleep quality (1-5)"
          value={daily.sleepQuality}
          min={1}
          max={5}
          onChange={(v) => onUpdate({ ...daily, sleepQuality: v as OneToFive })}
        />
        <Stepper
          label="Diet quality (1-5)"
          value={daily.dietQuality}
          min={1}
          max={5}
          onChange={(v) => onUpdate({ ...daily, dietQuality: v as OneToFive })}
        />
        <Stepper
          label="Exercise frequency (1-5)"
          value={daily.exerciseFrequency}
          min={1}
          max={5}
          onChange={(v) => onUpdate({ ...daily, exerciseFrequency: v as OneToFive })}
        />
        <Stepper
          label="Medical status (1-5)"
          value={daily.medicalStatus}
          min={1}
          max={5}
          onChange={(v) => onUpdate({ ...daily, medicalStatus: v as OneToFive })}
        />
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Mental/Emotional:</div>
        <Stepper
          label="Work satisfaction (1-5)"
          value={daily.workSatisfaction}
          min={1}
          max={5}
          onChange={(v) => onUpdate({ ...daily, workSatisfaction: v as OneToFive })}
        />
        <Stepper
          label="Purpose/meaning (1-5)"
          value={daily.purposeMeaning}
          min={1}
          max={5}
          onChange={(v) => onUpdate({ ...daily, purposeMeaning: v as OneToFive })}
        />
        <Stepper
          label="Spiritual practice (1-5)"
          value={daily.spiritualPractice}
          min={1}
          max={5}
          onChange={(v) => onUpdate({ ...daily, spiritualPractice: v as OneToFive })}
        />
        <Stepper
          label="Significant other (1-5)"
          value={daily.significantOther}
          min={1}
          max={5}
          onChange={(v) => onUpdate({ ...daily, significantOther: v as OneToFive })}
        />
        <Stepper
          label="Other relationships (1-5)"
          value={daily.otherRelationships}
          min={1}
          max={5}
          onChange={(v) => onUpdate({ ...daily, otherRelationships: v as OneToFive })}
        />
      </div>
      
      <div>
        <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Socioeconomic:</div>
        <Stepper
          label="Financial stress (1-5, higher=worse)"
          value={daily.financialStress}
          min={1}
          max={5}
          onChange={(v) => onUpdate({ ...daily, financialStress: v as OneToFive })}
        />
        <Stepper
          label="Job security (1-5)"
          value={daily.jobSecurity}
          min={1}
          max={5}
          onChange={(v) => onUpdate({ ...daily, jobSecurity: v as OneToFive })}
        />
      </div>
    </Card>
  );
};

interface ControlPanelsProps {
  selectedSlice: SliceType | null;
  genetics: GeneticsInputs;
  ace: ACEInputs;
  healing: number;
  daily: DailyFactorsInputs;
  onUpdateGenetics: (genetics: GeneticsInputs) => void;
  onUpdateACE: (ace: ACEInputs) => void;
  onUpdateHealing: (healing: number) => void;
  onUpdateDaily: (daily: DailyFactorsInputs) => void;
}

export const ControlPanels: React.FC<ControlPanelsProps> = ({
  selectedSlice,
  genetics,
  ace,
  healing,
  daily,
  onUpdateGenetics,
  onUpdateACE,
  onUpdateHealing,
  onUpdateDaily
}) => {
  return (
    <>
      <GeneticsPanel genetics={genetics} onUpdate={onUpdateGenetics} />
      <TraumaPanel ace={ace} healing={healing} onUpdateACE={onUpdateACE} onUpdateHealing={onUpdateHealing} />
      <DailyPanel daily={daily} onUpdate={onUpdateDaily} />
    </>
  );
};
