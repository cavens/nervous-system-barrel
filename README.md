# Nervous System Barrel

An interactive visualization of personal stress load as a stacked vertical column with five ordered layers: Genetics, Trauma, Day-to-day, Acute events, and remaining Headspace.

## Features

- **Real-time stress visualization** with animated barrel chart
- **Interactive controls** for adjusting stress factors
- **Time-based dynamics** with 1-second ticker and random day-to-day variations
- **Acute event system** with linear decay over 10 seconds
- **Stress tracking** with shake animation and explosion effects
- **Dynamic status messages** based on current headspace

## Live Demo

🚀 **[View Live Demo](https://yourusername.github.io/nervous-system-barrel)**

## How It Works

The barrel represents your total stress capacity:
- **Genetics** (black): Baseline stress sensitivity
- **Trauma** (gray): Childhood trauma and healing progress
- **Day-to-day** (striped): Daily life factors with random variation
- **Acute** (blue): Temporary events that decay over time
- **Headspace** (white): Remaining mental capacity

## Controls

- Click on barrel slices to adjust their values
- Use the Sudden Events dropdown to add temporary stressors
- Watch the timer line for 1-second intervals
- Experience shake effects when headspace drops below 10%

## Technology Stack

- **React** + **TypeScript**
- **Framer Motion** for animations
- **Vite** for build tooling
- **GitHub Pages** for hosting

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## License

MIT License