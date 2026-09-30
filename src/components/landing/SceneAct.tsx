import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../stores/appStore';

interface Props {
  onEnterDashboard: () => void;
}

const INTERVENTIONS = [
  { date: 'Oct 15', label: 'Ban construction', color: '#FF9900' },
  { date: 'Oct 25', label: 'Odd-even', color: '#FF0000' },
  { date: 'Nov 1', label: 'Fuel switch', color: '#FF0000' },
  { date: 'Nov 15', label: 'School closure', color: '#800000' },
];

export default function SceneAct({ onEnterDashboard }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [visibleMarkers, setVisibleMarkers] = useState<number[]>([]);
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

  // Stagger timeline markers
  useEffect(() => {
    if (!isVisible) {
      setVisibleMarkers([]);
      return;
    }

    INTERVENTIONS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleMarkers(prev => [...prev, i]);
      }, i * 300);
    });
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden py-20 px-4">
      {/* Background - subtle grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section label */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-aqi-poor to-aqi-severe" />
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.3em]">06 / Act</span>
          </div>
        </div>

        {/* Intervention Timeline */}
        <div className={`mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h3 className="font-heading text-xl sm:text-2xl font-semibold text-text-primary mb-8 text-center">
            The Intervention Timeline
          </h3>
          
          {/* Timeline line */}
          <div className="relative">
            <div className="absolute top-6 left-0 right-0 h-[2px] bg-gradient-to-r from-aqi-poor via-aqi-verypoor to-aqi-severe opacity-60" />
            
            {/* Timeline markers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {INTERVENTIONS.map((item, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center transition-all duration-700 ${visibleMarkers.includes(i) ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90'}`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <div className="mb-4 text-center px-2">
                    <span className="font-heading text-xs sm:text-sm font-semibold text-text-primary block">
                      {item.label}
                    </span>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 border-bg-primary relative z-10 shadow-lg"
                    style={{ backgroundColor: item.color, boxShadow: `0 0 20px ${item.color}60` }}
                  />
                  <span className="mt-3 font-mono text-xs text-text-muted">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final message */}
        <div className={`text-center mb-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="font-heading text-[clamp(1.8rem,5vw,3.2rem)] font-bold text-text-primary leading-tight">
            The window is <span className="text-aqi-verypoor">31 days</span>.<br />
            <span className="text-text-secondary font-light">The data is clear.</span>
          </h2>
        </div>

        {/* CTA - Dashboard entry */}
        <div className={`text-center transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <button
            onClick={onEnterDashboard}
            className="group relative px-10 py-5 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-aqi-poor to-aqi-verypoor opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-[2px] bg-bg-primary rounded-[10px] group-hover:bg-bg-secondary transition-colors" />
            <span className="relative font-heading text-base sm:text-lg font-semibold text-text-primary tracking-wide flex items-center gap-2">
              Enter Command Center
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
          <p className="mt-4 font-mono text-[10px] sm:text-xs text-text-muted">
            Guest access · No sign-up required
          </p>
        </div>

        {/* Bottom brand */}
        <div className="mt-20 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-aqi-good animate-pulse" />
            <span className="font-heading text-sm font-semibold text-text-primary">BreatheAware</span>
          </div>
          <p className="mt-2 font-mono text-[9px] text-text-muted">
            Real-time air quality intelligence
          </p>
        </div>
      </div>
    </section>
  );
}
