import React from 'react';
import type { AcuteEvent } from '../types';
import { Card } from './Card';

interface SuddenEventsPanelProps {
  onAddEvent: (event: AcuteEvent) => void;
}

interface EventPreset {
  label: string;
  magnitude: number;
  decayPeriods: number; // Number of seconds for linear decay
}

const PRESETS: EventPreset[] = [
  { label: 'Job loss', magnitude: 0.15, decayPeriods: 10 },
  { label: 'Death in family', magnitude: 0.20, decayPeriods: 10 },
  { label: 'Medical emergency', magnitude: 0.15, decayPeriods: 10 },
  { label: 'Breakup', magnitude: 0.10, decayPeriods: 10 },
  { label: 'Financial crisis', magnitude: 0.10, decayPeriods: 10 },
  { label: 'Major positive event', magnitude: -0.08, decayPeriods: 10 }
];

export const SuddenEventsPanel: React.FC<SuddenEventsPanelProps> = ({
  onAddEvent
}) => {
  const handleAddPreset = (preset: EventPreset) => {
    onAddEvent({
      label: preset.label,
      magnitude: preset.magnitude,
      decayPeriods: preset.decayPeriods,
      occurredAt: new Date()
    });
  };

  return (
    <Card title="Sudden Events" style={{ width: '320px' }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
          Add Event:
        </div>
        <select
          onChange={(e) => {
            const selectedPreset = PRESETS[parseInt(e.target.value)];
            if (selectedPreset) {
              handleAddPreset(selectedPreset);
              e.target.value = ''; // Reset dropdown
            }
          }}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #000',
            background: '#D2D8D5',
            cursor: 'pointer'
          }}
          defaultValue=""
        >
          <option value="" disabled>Select an event...</option>
          {PRESETS.map((preset, idx) => (
            <option key={idx} value={idx}>
              {preset.label} {preset.magnitude > 0 ? '+' : ''}{Math.round(preset.magnitude * 100)}%
            </option>
          ))}
        </select>
      </div>
    </Card>
  );
};