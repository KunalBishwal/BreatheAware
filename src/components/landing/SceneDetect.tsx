import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { CITIES } from '../../lib/mockData';
import { getAQIColor } from '../../lib/aqi';

const DETECT_CITIES = CITIES.slice(0, 5);

export default function SceneDetect() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCities, setVisibleCities] = useState<number[]>([]);
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

  // Stagger city appearances
  useEffect(() => {
    if (!isVisible) {
      setVisibleCities([]);
      return;
    }

    DETECT_CITIES.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCities(prev => [...prev, i]);
      }, i * 400);
    });
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden py-20 px-4">
      {/* Background with India outline SVG */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 800 900" className="w-[80vw] h-[80vh] max-w-[600px] opacity-[0.06]" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M400 50 L450 100 L500 120 L520 180 L550 200 L560 250 L580 280 L590 350 L570 400 L550 450 L530 500 L500 550 L480 600 L450 650 L420 700 L400 750 L380 800 L350 820 L320 800 L300 750 L280 700 L260 650 L240 600 L220 550 L200 500 L210 450 L230 400 L250 350 L270 300 L290 250 L310 200 L330 150 L350 100 L400 50" className="text-text-muted" />
          {/* Major city markers */}
          <circle cx="380" cy="200" r="4" className="text-text-muted" />
          <circle cx="280" cy="450" r="4" className="text-text-muted" />
          <circle cx="450" cy="650" r="4" className="text-text-muted" />
          <circle cx="520" cy="350" r="4" className="text-text-muted" />
          <circle cx="350" cy="550" r="4" className="text-text-muted" />
        </svg>
      </div>

      {/* City sensors grid */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section label */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-aqi-good to-aqi-satisfactory" />
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.3em]">02 / Detect</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {DETECT_CITIES.map((city, i) => (
            <div
              key={city.city}
              className={`transition-all duration-700 ${visibleCities.includes(i) ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* City data card */}
              <div className="glow-card rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                {/* AQI color accent */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: getAQIColor(city.aqi) }}
                />
                
                {/* Sensor beacon */}
                <div className="relative flex justify-center mb-4 pt-2">
                  <div
                    className="w-5 h-5 rounded-full animate-pulse-glow"
                    style={{ backgroundColor: getAQIColor(city.aqi) }}
                  />
                  <div
                    className="absolute inset-0 w-5 h-5 rounded-full animate-ping"
                    style={{ backgroundColor: getAQIColor(city.aqi), opacity: 0.3 }}
                  />
                </div>

                <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-primary text-center">
                  {city.city}
                </h3>
                
                <div className="mt-3 flex items-baseline justify-center gap-2">
                  <span className="font-data text-3xl sm:text-4xl" style={{ color: getAQIColor(city.aqi) }}>
                    {city.aqi}
                  </span>
                  <span className="text-xs text-text-secondary">AQI</span>
                </div>
                
                <p className="mt-2 text-[10px] sm:text-xs text-text-muted font-mono text-center">
                  {city.stationCount} stations · {city.dominantPollutant}
                </p>
                
                {/* Mini sparkline */}
                <div className="mt-4 flex gap-[2px] h-10 items-end">
                  {Array.from({ length: 24 }, (_, j) => {
                    const h = 15 + Math.sin(j * 0.5) * 30 + Math.random() * 40;
                    return (
                      <div
                        key={j}
                        className="flex-1 rounded-full opacity-70 transition-all duration-300 group-hover:opacity-100"
                        style={{
                          height: `${h}%`,
                          backgroundColor: getAQIColor(city.aqi),
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom text */}
        <div className={`mt-16 text-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-heading text-[clamp(1.5rem,4vw,2.5rem)] text-text-primary font-light">
            The sensors are watching.
          </p>
        </div>
      </div>
    </section>
  );
}
