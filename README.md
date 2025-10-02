# Nervous System Barrel (v13.3)

Interactive visualization modeling personal stress load as a stacked vertical column.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Then open http://localhost:5173 in your browser.

## Testing Instructions

### 1. Visual Testing

**Default State:**
- Barrel should show all 5 layers + headspace (left side)
- "Sudden Events" panel visible on the right
- Time ticker animating at top (1s grow, 1s wipe)
- Status label should show "Feeling OK"

**Click Interactions:**
- Click any barrel slice (genetics, trauma, social, daily, acute)
- Control panel appears in the right column below "Sudden Events"
- Use +/- buttons to adjust values
- Barrel should update in real-time
- Click the same slice again (or elsewhere) to hide controls

**Sudden Events:**
- Click any preset button (e.g., "Job loss +15%")
- Event should appear in "Active Events" list
- Barrel should increase accordingly
- Remove with × button

**Overstressed State (90-100%):**
- Add multiple stressful events (death, job loss, medical emergency)
- OR: Set daily factors to poor (sleep=1, diet=1, etc.)
- Barrel should start shaking when 4-second average ≥ 90%

**Meltdown State (≥100%):**
- Continue adding stress
- When 4-second average ≥ 100%, slices explode
- "MELTDOWN" text appears
- Click "Reset" button to restore

### 2. Math Testing

Open browser console and run:

```javascript
// Test neutral state produces baseline
// Should be around 0.15-0.20
console.log('Neutral level:', window.barrelLevel);

// Add a positive event and check it reduces load
// Add via UI, then check again
```

### 3. Specific Test Cases

**Test Case 1: Trauma Gating**
1. Set all daily factors to 5 (maximum good)
2. Note the barrel level
3. Click "Trauma" slice, set all ACE factors to "Yes"
4. Notice level goes UP despite good daily factors (benefit damping)

**Test Case 2: Healing**
1. With ACE factors enabled, set Healing progress to 100%
2. Notice trauma contribution reduces significantly

**Test Case 3: Event Decay**
1. Add a "Death in family" event
2. Note the percentage contribution
3. Wait 1-2 seconds, refresh the calculation
4. Contribution should decay over time (though slowly at this scale)

**Test Case 4: Negative Events**
1. Add "Major positive event -8%"
2. Barrel should decrease

### 4. Accessibility Testing

**Keyboard Navigation:**
- Tab through all +/- buttons
- Should have visible focus states
- Enter/Space should activate buttons

**Screen Reader:**
- All buttons should have descriptive labels
- Time ticker has aria-label

### 5. Animation Performance

Open browser DevTools > Performance:
- Start recording
- Interact with controls
- Check frame rate stays near 60 FPS

## Expected Behavior

### Layer Order (bottom to top)
1. Genetics (black)
2. Trauma (gray)
3. Social context (light gray)
4. Day to day (striped)
5. Acute (blue)
6. Headspace (white, remainder)

### Colors
- Background: #D2D8D5
- Container: 2px black border
- Labels on right with leader lines

### Status Labels
- 0-50%: "Feeling OK" (green)
- 50-70%: "Stressed" (yellow)
- 70-90%: "Mental Health Complaints" (orange)
- 90-100%: "Overstressed" (red-orange)
- ≥100%: "Fuse-Box Meltdown" (red)

## Troubleshooting

**Barrel doesn't update:**
- Check browser console for errors
- Make sure time ticker is animating

**Meltdown won't trigger:**
- Needs 4-second average ≥ 100%
- Try adding 3-4 major events at once

**Animations are choppy:**
- Close other tabs
- Check if hardware acceleration is enabled

## Build for Production

```bash
npm run build
npm run preview
```
