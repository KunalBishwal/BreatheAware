import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../stores/appStore';

// Radar chart visualization for city comparison
function RadarChart({ data, color, label, size = 200 }: { data: number[]; color: string; label: string; size?: number }) {
  const axes = 6;
  const points = data.map((val, i) => {
    const angle = (Math.PI * 2 * i) / axes - Math.PI / 2;
    const r = (val / 100) * (size / 2 - 20);
    return {
      x: size / 2 + r * Math.cos(angle),
      y: size / 2 + r * Math.sin(angle),
    };
  });
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';
  const labels = ['PM2.5', 'PM10', 'NO₂', 'SO₂', 'CO', 'O₃'];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        {/* Grid circles */}
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <circle
            key={r}
            cx={size / 2}
            cy={size / 2}
            r={(size / 2 - 20) * r}
            fill="none"
            stroke="rgba(148,163,184,0.1)"
            strokeWidth="0.5"
          />
        ))}
        {/* Axes */}
        {Array.from({ length: axes }, (_, i) => {
          const angle = (Math.PI * 2 * i) / axes - Math.PI / 2;
          const x2 = size / 2 + (size / 2 - 20) * Math.cos(angle);
          const y2 = size / 2 + (size / 2 - 20) * Math.sin(angle);
          return (
            <line
              key={i}
              x1={size / 2}
              y1={size / 2}
              x2={x2}
              y2={y2}
              stroke="rgba(148,163,184,0.1)"
              strokeWidth="0.5"
            />
          );
        })}
        {/* Data shape */}
        <path
          d={pathD}
          fill={color}
          fillOpacity="0.15"
          stroke={color}
          strokeWidth="1.5"
        />
        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
        ))}
        {/* Labels */}
        {labels.map((label, i) => {
          const angle = (Math.PI * 2 * i) / axes - Math.PI / 2;
          const x = size / 2 + (size / 2 - 5) * Math.cos(angle);
          const y = size / 2 + (size / 2 - 5) * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-text-muted"
              fontSize="8"
              fontFamily="JetBrains Mono"
            >
              {label}
            </text>
          );
        })}
      </svg>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4">
        <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
}

export default function SceneCompare() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useAppStore();
  const isDark = theme === 'dark';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden py-20 px-4">
      {/* Background data streams */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-text-muted to-transparent"
            style={{
              top: `${5 + i * 5}%`,
              left: 0,
              right: 0,
              opacity: 0.3 + Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section label */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-aqi-verypoor to-aqi-severe" />
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.3em]">05 / Compare</span>
          </div>
        </div>

        {/* Typography */}
        <div className={`mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <h2 className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-bold text-text-primary">
            Policy matters.
          </h2>
          <p className="mt-3 font-heading text-base sm:text-lg text-text-secondary font-light max-w-2xl">
            Compare air quality across cities to understand the impact of governance and geography.
          </p>
        </div>

        {/* Radar Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className={`flex flex-col items-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <div className="glow-card rounded-2xl p-6 sm:p-8">
              <RadarChart
                data={[85, 78, 60, 45, 70, 30]}
                color="#FF0000"
                label="Delhi"
                size={280}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="font-data text-2xl text-aqi-verypoor">298 days</p>
              <p className="font-mono text-xs text-text-muted mt-1">exceeding safe limits</p>
            </div>
          </div>
          <div className={`flex flex-col items-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="glow-card rounded-2xl p-6 sm:p-8">
              <RadarChart
                data={[30, 40, 25, 15, 20, 45]}
                color="#00B050"
                label="Chennai"
                size={280}
              />
            </div>
            <div className="mt-4 text-center">
              <p className="font-data text-2xl text-aqi-good">42 days</p>
              <p className="font-mono text-xs text-text-muted mt-1">exceeding safe limits</p>
            </div>
          </div>
        </div>

        {/* Comparison insight */}
        <div className={`mt-12 glow-card rounded-xl p-6 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-aqi-good/10 flex items-center justify-center">
              <span className="text-aqi-good text-xl">↓</span>
            </div>
            <div>
              <h4 className="font-heading text-base sm:text-lg font-semibold text-text-primary">
                Chennai's AQI is 7x better than Delhi
              </h4>
              <p className="mt-2 text-sm text-text-secondary">
                Coastal geography, stricter industrial regulations, and lower vehicle density contribute to significantly better air quality.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="font-heading text-[clamp(1rem,2.5vw,1.5rem)] text-text-secondary font-light">
            Which city breathes cleaner?
          </p>
        </div>
      </div>
    </section>
  );
}
