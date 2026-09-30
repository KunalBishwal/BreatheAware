import { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import { AQI_BANDS } from '../../lib/aqi';

export default function SceneBreathe() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [particleColor, setParticleColor] = useState('#94a3b8');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

  // Track mouse for particle interaction
  useEffect(() => {
    if (!isVisible) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isVisible]);

  // Cycle through AQI colors
  useEffect(() => {
    if (!isVisible) return;
    
    let index = 0;
    const interval = setInterval(() => {
      setParticleColor(AQI_BANDS[index].color);
      index = (index + 1) % AQI_BANDS.length;
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-20 px-4">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 transition-all duration-2000"
        style={{
          background: isDark 
            ? `radial-gradient(circle at 50% 50%, ${particleColor}15 0%, transparent 70%)`
            : `radial-gradient(circle at 50% 50%, ${particleColor}10 0%, transparent 70%)`,
        }}
      />

      {/* Floating particles (CSS-based for performance) */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      >
        {Array.from({ length: 80 }, (_, i) => {
          const size = 2 + Math.random() * 6;
          const baseOpacity = 0.2 + Math.random() * 0.5;
          return (
            <div
              key={i}
              className="absolute rounded-full animate-drift"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: particleColor,
                opacity: baseOpacity,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 6}s`,
                boxShadow: size > 5 ? `0 0 ${size * 2}px ${particleColor}40` : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Typography - asymmetric layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center min-h-[80vh]">
          {/* Top-left: Main heading */}
          <div className={`md:col-span-7 md:col-start-1 md:row-start-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            <h1 className="font-heading text-[clamp(2.5rem,8vw,5rem)] font-bold leading-[0.95] tracking-tight text-text-primary">
              Every breath
            </h1>
            <div className="mt-4 h-[2px] w-24 bg-gradient-to-r from-aqi-good to-aqi-satisfactory" />
          </div>

          {/* Middle-right: Subheading */}
          <div className={`md:col-span-5 md:col-start-8 md:row-start-1 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <p className="font-heading text-[clamp(1.5rem,4vw,2.5rem)] font-light italic text-text-secondary text-right">
              is a data point.
            </p>
          </div>

          {/* Bottom-right: Stats */}
          <div className={`md:col-span-6 md:col-start-7 md:row-start-2 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="font-data text-xs text-text-muted tracking-widest uppercase text-right">
              231 stations · 8 pollutants · Real-time
            </p>
            <div className="mt-3 flex gap-2 justify-end">
              {AQI_BANDS.map((band) => (
                <div
                  key={band.category}
                  className="h-1.5 w-8 rounded-full transition-all duration-500"
                  style={{ backgroundColor: band.color }}
                />
              ))}
            </div>
          </div>

          {/* Bottom-left: Scroll indicator */}
          <div className={`md:col-span-6 md:col-start-1 md:row-start-2 flex items-center gap-3 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="h-8 w-[1px] bg-text-muted animate-pulse" />
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.3em]">
              Scroll to explore
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
