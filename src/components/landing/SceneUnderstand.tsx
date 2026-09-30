import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { getAQIColor } from '../../lib/aqi';

export default function SceneUnderstand() {
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

  // Generate calendar cells
  const calendarCells = Array.from({ length: 365 }, (_, i) => {
    const month = Math.floor(i / 30);
    const seasonalFactor = (month >= 9 || month <= 1) ? 1.8 : (month >= 5 && month <= 8) ? 0.5 : 1.0;
    const aqi = Math.min(500, Math.round((60 + Math.random() * 200) * seasonalFactor));
    return { aqi, month };
  });

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden py-20 px-4">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section label */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-aqi-moderate to-aqi-poor" />
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.3em]">04 / Understand</span>
          </div>
        </div>

        {/* Section heading */}
        <div className={`mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
          <h2 className="font-heading text-[clamp(1.8rem,4vw,3rem)] font-bold text-text-primary">
            Patterns reveal the truth.
          </h2>
          <p className="mt-3 font-heading text-base sm:text-lg text-text-secondary font-light max-w-2xl">
            Time-series analysis exposes the seasonal, daily, and event-driven patterns that drive air quality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Layer 1: Calendar Heatmap */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="glow-card rounded-xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] sm:text-xs text-text-muted uppercase tracking-wider">Annual Calendar · AQI</span>
                <div className="flex items-center gap-1">
                  {['#00B050', '#92D050', '#FFFF00', '#FF9900', '#FF0000', '#800000'].map((c, i) => (
                    <div key={i} className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="grid grid-rows-12 gap-[2px]" style={{ gridTemplateColumns: 'repeat(31, 1fr)' }}>
                {calendarCells.map((cell, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-[1px] transition-all duration-500"
                    style={{ 
                      backgroundColor: getAQIColor(cell.aqi), 
                      opacity: isVisible ? 0.7 : 0.1,
                      transitionDelay: `${i * 2}ms`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-aqi-verypoor animate-pulse" />
                <span className="font-heading text-sm text-aqi-verypoor font-semibold">
                  November: 26 severe days
                </span>
              </div>
            </div>
          </div>

          {/* Layer 2: Diurnal Chart */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="glow-card rounded-xl p-5 sm:p-6">
              <div className="mb-4">
                <span className="font-mono text-[10px] sm:text-xs text-text-muted uppercase tracking-wider">24-Hour Pattern · PM2.5</span>
              </div>
              <div className="relative h-[120px] sm:h-[140px] border-b border-l border-border-subtle">
                {/* Simulated diurnal line */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 240 120" preserveAspectRatio="none">
                  <path
                    d="M0,80 Q20,85 40,90 Q60,95 80,70 Q100,40 120,30 Q140,35 160,50 Q180,60 200,45 Q220,35 240,60"
                    fill="none"
                    stroke="#FF9900"
                    strokeWidth="2"
                    opacity="0.8"
                  />
                  <path
                    d="M0,90 Q20,92 40,95 Q60,90 80,85 Q100,70 120,65 Q140,70 160,80 Q180,85 200,75 Q220,70 240,80"
                    fill="none"
                    stroke="#00B050"
                    strokeWidth="1.5"
                    opacity="0.6"
                    strokeDasharray="4,4"
                  />
                </svg>
                {/* Peak marker */}
                <div className="absolute top-[20%] left-[45%]">
                  <div className="w-2 h-2 rounded-full bg-aqi-poor" />
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="font-mono text-[8px] text-aqi-poor">Peak</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="font-mono text-[9px] text-text-muted">00:00</span>
                <span className="font-mono text-[9px] text-text-muted">06:00</span>
                <span className="font-mono text-[9px] text-text-muted">12:00</span>
                <span className="font-mono text-[9px] text-text-muted">18:00</span>
                <span className="font-mono text-[9px] text-text-muted">24:00</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-aqi-poor animate-pulse" />
                <span className="font-heading text-sm text-aqi-poor font-semibold">
                  8AM rush hour peak
                </span>
              </div>
            </div>
          </div>

          {/* Layer 3: Seasonal Trend */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="glow-card rounded-xl p-5 sm:p-6">
              <div className="mb-4">
                <span className="font-mono text-[10px] sm:text-xs text-text-muted uppercase tracking-wider">Seasonal Trend · PM2.5</span>
              </div>
              <div className="relative h-[80px] sm:h-[100px]">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 80" preserveAspectRatio="none">
                  <path
                    d="M0,60 Q50,55 100,50 Q150,40 200,35 Q250,30 300,20 Q350,15 400,10 Q450,15 500,25 Q550,35 600,50"
                    fill="none"
                    stroke="#FF0000"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                  {/* Festival markers */}
                  <line x1="420" y1="0" x2="420" y2="80" stroke="#FF9900" strokeWidth="1" opacity="0.5" strokeDasharray="3,3" />
                  <line x1="460" y1="0" x2="460" y2="80" stroke="#FF0000" strokeWidth="1" opacity="0.5" strokeDasharray="3,3" />
                </svg>
                <div className="absolute top-0 left-[70%] text-[8px] sm:text-[9px] font-mono text-aqi-poor">Diwali</div>
                <div className="absolute top-0 left-[76%] text-[8px] sm:text-[9px] font-mono text-aqi-verypoor">Crop burning</div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-aqi-severe animate-pulse" />
                <span className="font-heading text-[clamp(1.2rem,3vw,2rem)] text-text-primary font-bold">
                  Winter = crop burning
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
