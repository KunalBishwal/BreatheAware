import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { CITIES, STATIONS, generateMockMeasurements } from '../lib/mockData';
import { getAQIColor, getAQICategory, getAQILabel, AQI_BANDS } from '../lib/aqi';
import ThemeToggle from '../components/shared/ThemeToggle';
import { 
  MapPin, AlertTriangle, ChevronDown, RefreshCw, 
  Menu, X, Activity, Calendar, GitCompare, BookOpen
} from 'lucide-react';

export default function Dashboard() {
  const { selectedCity, setSelectedCity, sidebarCollapsed, toggleSidebar, hasSevereAlert, theme } = useAppStore();
  const [measurements, setMeasurements] = useState<ReturnType<typeof generateMockMeasurements>[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    const cityStations = STATIONS.filter(s => s.city === selectedCity.city);
    const cityMeasurements = cityStations.map(s => generateMockMeasurements(s.id));
    setMeasurements(cityMeasurements);

    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  const cityAQI = selectedCity.aqi;
  const cityColor = getAQIColor(cityAQI);
  const cityCategory = getAQICategory(cityAQI);

  const navItems = [
    { path: '/dashboard', label: "Today", icon: Activity },
    { path: '/dashboard/seasonal', label: 'Seasonal', icon: Calendar },
    { path: '/dashboard/compare', label: 'Compare', icon: GitCompare },
    { path: '/dashboard/story', label: 'Story', icon: BookOpen },
  ];

  const currentPath = useLocation().pathname;

  return (
    <div className="min-h-screen bg-bg-primary flex theme-transition">
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-bg-secondary border-r border-border-subtle z-50 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-56'} hidden md:block theme-transition`}>
        <div className="p-4 flex items-center justify-between">
          {!sidebarCollapsed && (
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cityColor }} />
              <span className="font-heading text-sm font-bold text-text-primary">BreatheAware</span>
            </Link>
          )}
          {sidebarCollapsed ? (
            <Link to="/" className="p-1 text-text-muted hover:text-text-primary transition-colors" title="Back to landing page">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cityColor }} />
            </Link>
          ) : (
            <button onClick={toggleSidebar} className="p-1 text-text-muted hover:text-text-primary transition-colors">
              <X size={16} />
            </button>
          )}
        </div>

        <nav className="mt-6 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                  isActive
                    ? 'bg-bg-card text-text-primary'
                    : 'text-text-muted hover:text-text-secondary hover:bg-bg-card/50'
                }`}
              >
                <Icon size={16} />
                {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        {!sidebarCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-3 rounded-lg bg-bg-card border border-border-subtle theme-transition">
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider">Network Status</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-aqi-good animate-pulse" />
                <span className="text-xs text-text-secondary">231 stations online</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border-subtle z-50 md:hidden theme-transition">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                  isActive ? 'text-text-primary' : 'text-text-muted'
                }`}
              >
                <Icon size={18} />
                <span className="text-[9px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 md:ml-56 min-h-screen pb-16 md:pb-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-xl border-b border-border-subtle theme-transition">
          <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* City selector */}
              <div className="relative">
                <select
                  value={selectedCity.city}
                  onChange={(e) => {
                    const city = CITIES.find(c => c.city === e.target.value);
                    if (city) setSelectedCity(city);
                  }}
                  className="appearance-none bg-bg-card border border-border-subtle rounded-lg px-3 py-2 pr-7 text-xs sm:text-sm text-text-primary font-heading focus:outline-none focus:border-text-muted cursor-pointer theme-transition"
                >
                  {CITIES.map(c => (
                    <option key={c.city} value={c.city}>{c.city}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>

              {/* Date - hidden on small screens */}
              <span className="font-mono text-[10px] sm:text-xs text-text-muted hidden sm:block">
                {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {hasSevereAlert && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-danger-pulse">
                  <AlertTriangle size={10} className="text-aqi-verypoor animate-pulse-glow" />
                  <span className="font-mono text-[9px] text-aqi-verypoor hidden sm:inline">SEVERE</span>
                </div>
              )}
              <ThemeToggle />
              <button className="p-2 text-text-muted hover:text-text-primary transition-colors hidden sm:block">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* Alert Banner */}
        {hasSevereAlert && (
          <div className="mx-3 sm:mx-4 md:mx-6 mt-3 sm:mt-4 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #800000, #400000)' }}>
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3">
              <AlertTriangle size={16} className="text-white animate-pulse-glow flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white">Air Quality Emergency — {selectedCity.city}</p>
                <p className="text-[10px] sm:text-xs text-white/70 mt-0.5">
                  Multiple stations reporting Severe AQI. Avoid outdoor activities.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="p-3 sm:p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
          {/* AQI Gauge */}
          <div className="sm:col-span-2 lg:col-span-5 glow-card rounded-xl p-4 sm:p-6 theme-transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider">City AQI</h3>
              <span className="font-mono text-[10px] text-text-muted">LIVE</span>
            </div>
            
            {/* Gauge */}
            <div className="flex items-center justify-center py-4 sm:py-6">
              <div className="relative w-36 h-36 sm:w-48 sm:h-48">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <path
                    d="M 30 150 A 80 80 0 1 1 170 150"
                    fill="none"
                    stroke="rgba(148,163,184,0.1)"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {AQI_BANDS.map((band, i) => {
                    const startAngle = -210 + (i * 40);
                    const endAngle = startAngle + 38;
                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;
                    const x1 = 100 + 80 * Math.cos(startRad);
                    const y1 = 100 + 80 * Math.sin(startRad);
                    const x2 = 100 + 80 * Math.cos(endRad);
                    const y2 = 100 + 80 * Math.sin(endRad);
                    return (
                      <path
                        key={band.category}
                        d={`M ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2}`}
                        fill="none"
                        stroke={band.color}
                        strokeWidth="12"
                        strokeLinecap="round"
                        opacity={cityCategory === band.category ? 1 : 0.3}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-data text-3xl sm:text-5xl" style={{ color: cityColor }}>
                    {cityAQI}
                  </span>
                  <span className="font-mono text-[10px] sm:text-xs mt-1" style={{ color: cityColor }}>
                    {getAQILabel(cityAQI)}
                  </span>
                </div>
              </div>
            </div>

            {/* Pollutant breakdown */}
            <div className="mt-4 space-y-2">
              {measurements.slice(0, 1).map((m, i) => (
                <div key={i}>
                  <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-2">Dominant Pollutants</p>
                  <div className="space-y-1.5">
                    {[
                      { label: 'PM2.5', value: m.pm25 || 0, max: 500, color: '#FF9900' },
                      { label: 'PM10', value: m.pm10 || 0, max: 600, color: '#FF0000' },
                      { label: 'NO₂', value: m.no2 || 0, max: 200, color: '#FFFF00' },
                    ].map((p) => (
                      <div key={p.label} className="flex items-center gap-2 sm:gap-3">
                        <span className="font-mono text-[9px] sm:text-[10px] text-text-muted w-8 sm:w-10">{p.label}</span>
                        <div className="flex-1 h-2 bg-bg-primary rounded-full overflow-hidden theme-transition">
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${Math.min(100, (p.value / p.max) * 100)}%`,
                              backgroundColor: p.color,
                            }}
                          />
                        </div>
                        <span className="font-data text-[10px] sm:text-xs text-text-secondary w-8 sm:w-12 text-right">
                          {p.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Station Map Area */}
          <div className="sm:col-span-2 lg:col-span-7 glow-card rounded-xl p-4 sm:p-6 theme-transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider">Station Network</h3>
              <span className="font-mono text-[10px] text-text-muted">{selectedCity.stationCount} stations</span>
            </div>
            
            {/* Map placeholder */}
            <div className="relative h-[200px] sm:h-[280px] md:h-[340px] rounded-lg overflow-hidden bg-bg-primary border border-border-subtle theme-transition">
              <div className="absolute inset-0 opacity-[0.05]" style={{
                backgroundImage: 'linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }} />
              
              {STATIONS.filter(s => s.city === selectedCity.city).map((station, i) => {
                const measurement = generateMockMeasurements(station.id);
                const color = getAQIColor(measurement.aqi || 100);
                const left = 15 + (i * 25) % 70;
                const top = 20 + (i * 30) % 60;
                return (
                  <div
                    key={station.id}
                    className="absolute group cursor-pointer"
                    style={{ left: `${left}%`, top: `${top}%` }}
                  >
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-bg-primary transition-transform group-hover:scale-150"
                      style={{ backgroundColor: color }}
                    />
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{ backgroundColor: color }}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <div className="bg-bg-card border border-border-subtle rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap theme-transition">
                        <p className="font-heading text-[10px] sm:text-xs font-semibold text-text-primary">{station.name}</p>
                        <p className="font-data text-xs sm:text-sm mt-0.5" style={{ color }}>
                          AQI {measurement.aqi}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1 sm:gap-2">
                <MapPin size={10} className="text-text-muted" />
                <span className="font-mono text-[8px] sm:text-[10px] text-text-muted">{selectedCity.city}</span>
              </div>

              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex gap-0.5 sm:gap-1">
                {AQI_BANDS.map(b => (
                  <div key={b.category} className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm" style={{ backgroundColor: b.color, opacity: 0.7 }} />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="sm:col-span-2 lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Worst Station', value: 'Anand Vihar', sub: 'AQI 342', color: '#FF0000' },
              { label: 'Best Station', value: 'RK Puram', sub: 'AQI 198', color: '#FF9900' },
              { label: 'City Average', value: `${cityAQI}`, sub: getAQILabel(cityAQI), color: cityColor },
              { label: 'Reporting', value: `${selectedCity.stationCount}`, sub: 'stations active', color: '#00B050' },
            ].map((stat) => (
              <div key={stat.label} className="glow-card rounded-xl p-3 sm:p-4 theme-transition">
                <p className="font-mono text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</p>
                <p className="font-data text-xl sm:text-2xl mt-1 sm:mt-2" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="font-mono text-[10px] sm:text-xs text-text-secondary mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* 24h Trend */}
          <div className="sm:col-span-2 lg:col-span-8 glow-card rounded-xl p-4 sm:p-6 theme-transition">
            <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">24-Hour Trend</h3>
            <div className="relative h-[120px] sm:h-[160px]">
              <svg className="w-full h-full" viewBox="0 0 480 160" preserveAspectRatio="none">
                {[0, 40, 80, 120, 160].map(y => (
                  <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(148,163,184,0.05)" strokeWidth="1" />
                ))}
                <path
                  d={generateTrendPath(cityAQI)}
                  fill="none"
                  stroke={cityColor}
                  strokeWidth="2"
                  opacity="0.8"
                />
                <path
                  d={generateTrendPath(cityAQI) + ' L480,160 L0,160 Z'}
                  fill={cityColor}
                  opacity="0.05"
                />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                {['00:00', '06:00', '12:00', '18:00', '24:00'].map(t => (
                  <span key={t} className="font-mono text-[8px] sm:text-[9px] text-text-muted">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Pollutant Distribution */}
          <div className="sm:col-span-2 lg:col-span-4 glow-card rounded-xl p-4 sm:p-6 theme-transition">
            <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Pollutant Mix</h3>
            <div className="space-y-2 sm:space-y-3">
              {[
                { name: 'PM2.5', pct: 38, color: '#FF9900' },
                { name: 'PM10', pct: 28, color: '#FF0000' },
                { name: 'NO₂', pct: 15, color: '#FFFF00' },
                { name: 'SO₂', pct: 8, color: '#92D050' },
                { name: 'CO', pct: 6, color: '#00B050' },
                { name: 'O₃', pct: 5, color: '#94a3b8' },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-2 sm:gap-3">
                  <span className="font-mono text-[9px] sm:text-[10px] text-text-muted w-8">{p.name}</span>
                  <div className="flex-1 h-2 sm:h-3 bg-bg-primary rounded-full overflow-hidden theme-transition">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${p.pct}%`, backgroundColor: p.color }}
                    />
                  </div>
                  <span className="font-data text-[10px] sm:text-xs text-text-secondary w-6 sm:w-8 text-right">{p.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function generateTrendPath(baseAQI: number): string {
  const points: string[] = [];
  for (let x = 0; x <= 480; x += 10) {
    const hour = (x / 480) * 24;
    const rushFactor = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20) ? 1.3 : 0.8;
    const nightFactor = hour >= 22 || hour <= 5 ? 0.7 : 1;
    const noise = Math.sin(x * 0.05) * 15 + Math.random() * 10;
    const y = 160 - ((baseAQI * rushFactor * nightFactor + noise) / 500) * 160;
    points.push(`${x === 0 ? 'M' : 'L'}${x},${Math.max(10, Math.min(150, y))}`);
  }
  return points.join(' ');
}
