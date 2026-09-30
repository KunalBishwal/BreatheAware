import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { AQI_BANDS } from '../../lib/aqi';

export default function ScrollProgress() {
  const { scrollProgress, currentScene, theme } = useAppStore();
  const color = AQI_BANDS[Math.min(currentScene, AQI_BANDS.length - 1)].color;
  const isDark = theme === 'dark';

  return (
    <div className="scroll-progress" style={{ backgroundColor: isDark ? 'rgba(148,163,184,0.05)' : 'rgba(15,23,42,0.05)' }}>
      <div
        className="scroll-progress-bar rounded-full"
        style={{
          height: `${scrollProgress * 100}%`,
          backgroundColor: color,
          transition: 'background-color 0.5s ease, height 0.1s linear',
        }}
      />
    </div>
  );
}
