import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { CITIES } from '../../lib/mockData';
import { getAQIColor } from '../../lib/aqi';

export default function SceneMap() {
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
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Typography */}
        <div className={`mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
          <h2 className="font-heading text-[clamp(1.8rem,5vw,3.2rem)] font-bold text-text-primary leading-tight">
            See what your<br />
            <span className="text-text-secondary font-light">lungs are breathing.</span>
          </h2>
        </div>

        {/* Map grid visualization */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Grid of AQI cells */}
          <div className="lg:col-span-8">
            <div className="relative w-full aspect-[4/3] glow-card rounded-xl p-6">
              <div className="grid grid-cols-8 grid-rows-6 gap-1 w-full h-full">
                {Array.from({ length: 48 }, (_, i) => {
                  const cityIndex = Math.floor(i / 8) % CITIES.length;
                  const city = CITIES[cityIndex];
                  const opacity = isVisible ? 0.6 + Math.random() * 0.4 : 0.1;
                  return (
                    <div
                      key={i}
                      className="rounded-sm transition-all duration-1000"
                      style={{
                        backgroundColor: getAQIColor(city.aqi),
                        opacity,
                        transitionDelay: `${i * 30}ms`,
                      }}
                    />
                  );
                })}
              </div>

              {/* City markers overlaid */}
              <div className="absolute inset-6">
                {CITIES.map((city, i) => (
                  <div
                    key={city.city}
                    className="absolute flex flex-col items-center group"
                    style={{
                      left: `${10 + (i % 4) * 25}%`,
                      top: `${15 + Math.floor(i / 4) * 45}%`,
                    }}
                  >
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-bg-primary transition-transform group-hover:scale-150"
                      style={{ backgroundColor: getAQIColor(city.aqi) }}
                    />
                    <div className="mt-1.5 px-2 py-0.5 rounded bg-bg-primary/80 backdrop-blur-sm border border-border-subtle">
                      <span className="text-[10px] sm:text-xs font-mono font-semibold text-text-primary whitespace-nowrap">
                        {city.city}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stat card */}
          <div className={`lg:col-span-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="glow-card rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-aqi-severe animate-pulse-glow" />
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Worst station today</span>
              </div>
              <p className="font-heading text-lg font-semibold text-text-primary">Anand Vihar, Delhi</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-data text-4xl text-aqi-verypoor">342</span>
                <span className="text-xs text-text-secondary">Very Poor</span>
              </div>
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <p className="text-xs text-text-muted">
                  PM2.5: 285 μg/m³<br />
                  PM10: 412 μg/m³<br />
                  NO₂: 78 μg/m³
                </p>
              </div>
            </div>

            {/* CTA hint */}
            <div className="mt-6 text-center">
              <p className="font-mono text-xs text-text-muted tracking-wider">
                Tap to enter the Command Center →
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
