import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { CITIES, STATIONS, generateMockMeasurements } from '../lib/mockData';
import { getAQIColor, getAQICategory, getAQILabel, AQI_BANDS } from '../lib/aqi';
import type { Station } from '../types';
import ThemeToggle from '../components/shared/ThemeToggle';
import { 
  MapPin, AlertTriangle, ChevronDown, RefreshCw, 
  Menu, X, Activity, Calendar, GitCompare, BookOpen,
  TrendingUp, TrendingDown, Wind, Thermometer, Droplets, Heart,
  Sliders, Radio, Zap, ShieldCheck, CheckCircle2, Info, Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { selectedCity, setSelectedCity, sidebarCollapsed, toggleSidebar, hasSevereAlert, theme } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showAllPollutants, setShowAllPollutants] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);
  const [windDispersion, setWindDispersion] = useState<'stagnant' | 'normal' | 'strong'>('normal');
  const [trafficDensity, setTrafficDensity] = useState<'reduced' | 'normal' | 'congested'>('normal');
  const [stubbleSmoke, setStubbleSmoke] = useState(false);
  const isDark = theme === 'dark';

  // Memoize measurements so they don't regenerate on theme change
  const measurements = useMemo(() => {
    const cityStations = STATIONS.filter(s => s.city === selectedCity.city);
    return cityStations.map(s => generateMockMeasurements(s.id));
  }, [selectedCity]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const cityAQI = selectedCity.aqi;

  // Real-time atmospheric simulation calculations
  const dispersionMult = windDispersion === 'stagnant' ? 1.32 : windDispersion === 'strong' ? 0.64 : 1.0;
  const trafficMult = trafficDensity === 'reduced' ? 0.74 : trafficDensity === 'congested' ? 1.28 : 1.0;
  const smokeMult = stubbleSmoke ? 1.42 : 1.0;

  const effectiveAQI = simulationActive
    ? Math.min(500, Math.max(20, Math.round(cityAQI * dispersionMult * ((trafficMult + smokeMult) / 2))))
    : cityAQI;

  const effectiveColor = getAQIColor(effectiveAQI);
  const effectiveCategory = getAQICategory(effectiveAQI);
  const effectiveBand = AQI_BANDS.find(b => effectiveCategory === b.category);
  const aqiDelta = effectiveAQI - cityAQI;
  const aqiDeltaPct = +((aqiDelta / cityAQI) * 100).toFixed(1);

  const cityColor = effectiveColor;
  const cityCategory = effectiveCategory;
  const cityBand = effectiveBand;

  // Compute station-level stats
  const stationAQIs = measurements.map(m => m.aqi || 0);
  const worstStation = measurements.reduce((worst, m) => (m.aqi || 0) > (worst.aqi || 0) ? m : worst, measurements[0]);
  const bestStation = measurements.reduce((best, m) => (m.aqi || 0) < (best.aqi || 0) ? m : best, measurements[0]);
  const avgAQI = Math.round(stationAQIs.reduce((a, b) => a + b, 0) / (stationAQIs.length || 1));
  const worstStationName = STATIONS.find(s => s.id === worstStation?.stationId)?.name?.split(',')[0] || 'N/A';
  const bestStationName = STATIONS.find(s => s.id === bestStation?.stationId)?.name?.split(',')[0] || 'N/A';

  // Avg pollutant values
  const avgPollutants = {
    pm25: Math.round(measurements.reduce((s, m) => s + (m.pm25 || 0), 0) / (measurements.length || 1)),
    pm10: Math.round(measurements.reduce((s, m) => s + (m.pm10 || 0), 0) / (measurements.length || 1)),
    no2: Math.round(measurements.reduce((s, m) => s + (m.no2 || 0), 0) / (measurements.length || 1)),
    so2: Math.round(measurements.reduce((s, m) => s + (m.so2 || 0), 0) / (measurements.length || 1)),
    co: +((measurements.reduce((s, m) => s + (m.co || 0), 0) / (measurements.length || 1)).toFixed(1)),
    o3: Math.round(measurements.reduce((s, m) => s + (m.o3 || 0), 0) / (measurements.length || 1)),
    nh3: Math.round(measurements.reduce((s, m) => s + (m.nh3 || 0), 0) / (measurements.length || 1)),
  };

  // Pollutant contribution and NAAQS standards
  const totalPollutantLoad = avgPollutants.pm25 + avgPollutants.pm10 + avgPollutants.no2 + avgPollutants.so2 + avgPollutants.o3 + avgPollutants.nh3;
  const pollutantMix = [
    { name: 'PM2.5', value: avgPollutants.pm25, pct: Math.round((avgPollutants.pm25 / totalPollutantLoad) * 100), color: '#FF9900', standard: 60, unit: 'μg/m³' },
    { name: 'PM10', value: avgPollutants.pm10, pct: Math.round((avgPollutants.pm10 / totalPollutantLoad) * 100), color: '#FF0000', standard: 100, unit: 'μg/m³' },
    { name: 'NO₂', value: avgPollutants.no2, pct: Math.round((avgPollutants.no2 / totalPollutantLoad) * 100), color: '#FFFF00', standard: 80, unit: 'μg/m³' },
    { name: 'SO₂', value: avgPollutants.so2, pct: Math.round((avgPollutants.so2 / totalPollutantLoad) * 100), color: '#92D050', standard: 80, unit: 'μg/m³' },
    { name: 'CO', value: avgPollutants.co, pct: Math.max(1, Math.round(((avgPollutants.co * 40) / totalPollutantLoad) * 100)), color: '#A855F7', standard: 2.0, unit: 'mg/m³' },
    { name: 'O₃', value: avgPollutants.o3, pct: Math.round((avgPollutants.o3 / totalPollutantLoad) * 100), color: '#00B0F0', standard: 100, unit: 'μg/m³' },
    { name: 'NH₃', value: avgPollutants.nh3, pct: Math.round((avgPollutants.nh3 / totalPollutantLoad) * 100), color: '#94a3b8', standard: 400, unit: 'μg/m³' },
  ];

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
                <span className="text-xs text-text-secondary">289 stations online</span>
              </div>
              <p className="font-mono text-[9px] text-text-muted mt-1">Last sync: {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
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

              {/* Date */}
              <span className="font-mono text-[10px] sm:text-xs text-text-muted hidden sm:block">
                {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
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
                  {cityBand?.healthAdvisory || 'Multiple stations reporting Severe AQI. Avoid outdoor activities.'}
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
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider">
                  {simulationActive ? 'Simulated AQI' : 'City AQI'}
                </h3>
                {simulationActive && (
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 animate-pulse">
                    SCENARIO ACTIVE
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-text-muted">Oct 16, 2026</span>
                <div className={`w-2 h-2 rounded-full ${simulationActive ? 'bg-[#FF9900]' : 'bg-aqi-good'} animate-pulse`} />
                <span className="font-mono text-[10px] text-text-muted">
                  {simulationActive ? 'SIM' : 'LIVE'}
                </span>
              </div>
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
                  {simulationActive && (
                    <span className="font-mono text-[9px] font-bold mt-0.5" style={{ color: aqiDelta <= 0 ? '#00B050' : '#FF0000' }}>
                      {aqiDelta >= 0 ? `+${aqiDelta}` : aqiDelta} pts ({aqiDeltaPct}%)
                    </span>
                  )}
                  <span className="font-mono text-[8px] text-text-muted mt-0.5">
                    Dominant: {selectedCity.dominantPollutant}
                  </span>
                </div>
              </div>
            </div>

            {/* Pollutant breakdown with NAAQS comparison */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                  Pollutant Levels vs NAAQS Standards
                </p>
                <button
                  onClick={() => setShowAllPollutants(!showAllPollutants)}
                  className="font-mono text-[9px] text-text-secondary hover:text-text-primary px-2 py-0.5 rounded bg-bg-primary border border-border-subtle transition-colors"
                >
                  {showAllPollutants ? 'Show Top 4' : 'Show All 7'}
                </button>
              </div>
              <div className="space-y-1.5">
                {(showAllPollutants ? pollutantMix : pollutantMix.slice(0, 4)).map((p) => {
                  const exceedsStandard = p.value > p.standard;
                  return (
                    <div key={p.name} className="flex items-center gap-2 sm:gap-3">
                      <span className="font-mono text-[9px] sm:text-[10px] text-text-muted w-10 sm:w-12">{p.name}</span>
                      <div className="flex-1 h-2 bg-bg-primary rounded-full overflow-hidden theme-transition relative">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(100, (p.value / (p.standard * 3)) * 100)}%`,
                            backgroundColor: p.color,
                          }}
                        />
                        {/* NAAQS standard marker */}
                        <div
                          className="absolute top-0 h-full w-[2px] bg-text-muted/60"
                          style={{ left: `${Math.min(100, (p.standard / (p.standard * 3)) * 100)}%` }}
                          title={`NAAQS Limit: ${p.standard} ${p.unit}`}
                        />
                      </div>
                      <span className={`font-data text-[10px] sm:text-xs w-16 sm:w-20 text-right ${exceedsStandard ? 'text-aqi-verypoor' : 'text-aqi-good'}`}>
                        {p.value} <span className="text-text-muted text-[8px]">/ {p.standard} {p.unit.split('/')[0]}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Station Map Area */}
          <div className="sm:col-span-2 lg:col-span-7 glow-card rounded-xl p-4 sm:p-6 theme-transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider">
                  Station Network · {selectedCity.city}
                </h3>
                <p className="font-mono text-[9px] text-text-muted mt-0.5">Click any station node to open live sensor inspector</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-bg-primary border border-border-subtle">
                  <ShieldCheck size={11} className="text-aqi-good" />
                  <span className="font-mono text-[9px] text-text-secondary">
                    {measurements.length} Active CAAQMS Stations
                  </span>
                </div>
              </div>
            </div>
            
            {/* Map placeholder */}
            <div className="relative h-[200px] sm:h-[280px] md:h-[340px] rounded-lg overflow-hidden bg-bg-primary border border-border-subtle theme-transition">
              <div className="absolute inset-0 opacity-[0.05]" style={{
                backgroundImage: 'linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }} />
              
              {STATIONS.filter(s => s.city === selectedCity.city).map((station, i) => {
                const measurement = measurements.find(m => m.stationId === station.id) || generateMockMeasurements(station.id);
                const color = getAQIColor(measurement.aqi || 100);
                const left = 16 + (i * 26) % 68;
                const top = 18 + (i * 28) % 62;
                return (
                  <div
                    key={station.id}
                    className="absolute group cursor-pointer"
                    style={{ left: `${left}%`, top: `${top}%` }}
                    onClick={() => setSelectedStation(station)}
                  >
                    <div
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-bg-primary transition-transform group-hover:scale-150 shadow-md"
                      style={{ backgroundColor: color }}
                    />
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-35"
                      style={{ backgroundColor: color }}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                      <div className="bg-bg-card border border-border-subtle rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap shadow-xl theme-transition">
                        <p className="font-heading text-[10px] sm:text-xs font-semibold text-text-primary">
                          {station.name.split(',')[0]}
                        </p>
                        <p className="font-mono text-[8px] text-text-muted mt-0.5">
                          {station.network || 'CPCB CAAQMS'} · {station.stationType || 'Urban'}
                        </p>
                        <p className="font-data text-xs sm:text-sm mt-0.5" style={{ color }}>
                          AQI {measurement.aqi} · {getAQILabel(measurement.aqi || 100)}
                        </p>
                        <p className="font-mono text-[8px] text-text-muted mt-0.5">
                          PM2.5: {measurement.pm25} · NO₂: {measurement.no2} · CO: {measurement.co}
                        </p>
                        <p className="font-mono text-[7px] text-[#00B050] mt-0.5">
                          Click to inspect sensor telemetry →
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1 sm:gap-2 bg-bg-card/80 backdrop-blur-sm px-2 py-1 rounded border border-border-subtle">
                <MapPin size={10} className="text-text-muted" />
                <span className="font-mono text-[8px] sm:text-[10px] text-text-muted">{selectedCity.city}, {selectedCity.state}</span>
              </div>

              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex gap-0.5 sm:gap-1 bg-bg-card/80 backdrop-blur-sm px-2 py-1 rounded border border-border-subtle">
                {AQI_BANDS.map(b => (
                  <div key={b.category} className="flex flex-col items-center" title={`${b.label} (${b.min}-${b.max})`}>
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm" style={{ backgroundColor: b.color, opacity: 0.8 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats - Enhanced */}
          <div className="sm:col-span-2 lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                label: 'Worst Station', value: worstStationName,
                sub: `AQI ${worstStation?.aqi || 'N/A'}`, color: getAQIColor(worstStation?.aqi || 400),
                icon: TrendingUp, trend: '+12% vs yesterday',
                stationId: worstStation?.stationId
              },
              {
                label: 'Best Station', value: bestStationName,
                sub: `AQI ${bestStation?.aqi || 'N/A'}`, color: getAQIColor(bestStation?.aqi || 50),
                icon: TrendingDown, trend: '-5% vs yesterday',
                stationId: bestStation?.stationId
              },
              {
                label: 'City Average', value: `${avgAQI}`,
                sub: getAQILabel(avgAQI), color: getAQIColor(avgAQI),
                icon: Wind, trend: `PM2.5: ${avgPollutants.pm25} μg/m³`
              },
              {
                label: 'Verified Reporting', value: `${measurements.length}`,
                sub: `of ${selectedCity.stationCount} official nodes`,
                color: '#00B050',
                icon: Activity, trend: `CO: ${avgPollutants.co} mg/m³`
              },
            ].map((stat) => {
              const Icon = stat.icon;
              const hasStation = Boolean(stat.stationId);
              return (
                <div
                  key={stat.label}
                  onClick={() => {
                    if (stat.stationId) {
                      const st = STATIONS.find(s => s.id === stat.stationId);
                      if (st) setSelectedStation(st);
                    }
                  }}
                  className={`glow-card rounded-xl p-3 sm:p-4 theme-transition ${hasStation ? 'cursor-pointer hover:border-text-muted/40' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</p>
                    <Icon size={12} className="text-text-muted" />
                  </div>
                  <p className="font-data text-xl sm:text-2xl mt-1 sm:mt-2 truncate" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="font-mono text-[10px] sm:text-xs text-text-secondary mt-1">{stat.sub}</p>
                  <p className="font-mono text-[8px] text-text-muted mt-0.5">{stat.trend}</p>
                </div>
              );
            })}
          </div>

          {/* Real-Time Interactive Atmospheric Simulation Studio */}
          <div className="sm:col-span-2 lg:col-span-12 glow-card rounded-xl p-4 sm:p-6 theme-transition border border-border-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-border-subtle">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#FF9900]" />
                  <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-primary uppercase tracking-wider">
                    Real-Time Data Analysis & Scenario Simulator
                  </h3>
                </div>
                <p className="font-mono text-[9px] sm:text-[10px] text-text-muted mt-0.5">
                  Interactively model atmospheric dispersion, vehicular emission throttling, and biomass burning impacts in real time.
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSimulationActive(!simulationActive)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[10px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    simulationActive
                      ? 'bg-[#FF9900] text-black shadow-lg shadow-[#FF9900]/25'
                      : 'bg-bg-primary text-text-secondary border border-border-subtle hover:text-text-primary'
                  }`}
                >
                  <Sliders size={12} />
                  {simulationActive ? 'Simulation Active' : 'Enable Live Simulator'}
                </button>
                {simulationActive && (
                  <button
                    onClick={() => {
                      setWindDispersion('normal');
                      setTrafficDensity('normal');
                      setStubbleSmoke(false);
                    }}
                    className="px-2.5 py-1.5 rounded-lg font-mono text-[10px] text-text-muted hover:text-text-primary bg-bg-primary border border-border-subtle transition-colors"
                    title="Reset sliders to baseline"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Simulator Controls & Real-Time Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Control 1: Wind & Dispersion */}
              <div className="p-3.5 rounded-lg bg-bg-primary/50 border border-border-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1">
                    <Wind size={11} className="text-text-muted" /> Atmospheric Dispersion
                  </span>
                  <span className="font-mono text-[9px] text-text-secondary">
                    {windDispersion === 'stagnant' ? 'Class F (Inversion)' : windDispersion === 'strong' ? 'Class B (High Wind)' : 'Class D (Neutral)'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { key: 'stagnant', label: 'Inversion', sub: '1.32x' },
                    { key: 'normal', label: 'Moderate', sub: '1.0x' },
                    { key: 'strong', label: 'High Wind', sub: '0.64x' },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => { setWindDispersion(opt.key as any); if (!simulationActive) setSimulationActive(true); }}
                      className={`py-1.5 px-2 rounded text-center transition-all ${
                        windDispersion === opt.key && simulationActive
                          ? 'bg-bg-card text-text-primary border border-text-muted/60 shadow-sm'
                          : 'text-text-muted hover:text-text-secondary bg-bg-card/30 border border-transparent'
                      }`}
                    >
                      <div className="font-heading text-[10px] font-semibold">{opt.label}</div>
                      <div className="font-mono text-[8px] text-text-muted">{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Control 2: Traffic & Urban Mobility */}
              <div className="p-3.5 rounded-lg bg-bg-primary/50 border border-border-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1">
                    <Zap size={11} className="text-text-muted" /> Vehicular Fleet Load
                  </span>
                  <span className="font-mono text-[9px] text-text-secondary">
                    {trafficDensity === 'reduced' ? '-26% (Odd-Even)' : trafficDensity === 'congested' ? '+28% (Gridlock)' : 'Standard'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { key: 'reduced', label: 'Odd-Even', sub: '0.74x' },
                    { key: 'normal', label: 'Standard', sub: '1.0x' },
                    { key: 'congested', label: 'Peak Rush', sub: '1.28x' },
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => { setTrafficDensity(opt.key as any); if (!simulationActive) setSimulationActive(true); }}
                      className={`py-1.5 px-2 rounded text-center transition-all ${
                        trafficDensity === opt.key && simulationActive
                          ? 'bg-bg-card text-text-primary border border-text-muted/60 shadow-sm'
                          : 'text-text-muted hover:text-text-secondary bg-bg-card/30 border border-transparent'
                      }`}
                    >
                      <div className="font-heading text-[10px] font-semibold">{opt.label}</div>
                      <div className="font-mono text-[8px] text-text-muted">{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Control 3: Stubble Burning / Biomass Plume */}
              <div className="p-3.5 rounded-lg bg-bg-primary/50 border border-border-subtle flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle size={11} className="text-text-muted" /> Agricultural Fire Plume
                  </span>
                  <span className="font-mono text-[9px] text-text-secondary">
                    {stubbleSmoke ? '+42% Stubble Plume' : 'Baseline'}
                  </span>
                </div>
                <button
                  onClick={() => { setStubbleSmoke(!stubbleSmoke); if (!simulationActive) setSimulationActive(true); }}
                  className={`w-full py-2 px-3 rounded-lg flex items-center justify-between transition-all ${
                    stubbleSmoke && simulationActive
                      ? 'bg-[#800000]/30 text-white border border-[#800000]'
                      : 'bg-bg-card/40 text-text-muted hover:text-text-secondary border border-border-subtle'
                  }`}
                >
                  <span className="font-heading text-xs font-semibold">Active Regional Stubble Episode</span>
                  <span className={`w-2 h-2 rounded-full ${stubbleSmoke && simulationActive ? 'bg-aqi-severe animate-pulse' : 'bg-text-muted/40'}`} />
                </button>
              </div>
            </div>

            {/* Real-Time Telemetry Insights Banner */}
            <div className="mt-4 pt-4 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">Telemetric Delta</span>
                  <div className="font-data text-lg" style={{ color: aqiDelta <= 0 ? '#00B050' : '#FF0000' }}>
                    {aqiDelta >= 0 ? `+${aqiDelta}` : aqiDelta} pts ({aqiDeltaPct}%)
                  </div>
                </div>
                <div className="h-8 w-px bg-border-subtle mx-1" />
                <div className="text-left">
                  <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">Ventilation Coefficient</span>
                  <div className="font-mono text-xs text-text-primary mt-0.5">
                    {windDispersion === 'stagnant' ? '1,150 m²/s (Poor)' : windDispersion === 'strong' ? '7,400 m²/s (High)' : '3,600 m²/s (Moderate)'}
                  </div>
                </div>
                <div className="h-8 w-px bg-border-subtle mx-1 hidden sm:block" />
                <div className="text-left hidden sm:block">
                  <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">Boundary Layer</span>
                  <div className="font-mono text-xs text-text-primary mt-0.5">
                    {windDispersion === 'stagnant' ? '280m (Ground Inversion)' : windDispersion === 'strong' ? '1,450m (Well-mixed)' : '720m (Normal)'}
                  </div>
                </div>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-mono text-[9px] text-text-muted">Presets:</span>
                <button
                  onClick={() => {
                    setSimulationActive(true);
                    setWindDispersion('stagnant');
                    setTrafficDensity('congested');
                    setStubbleSmoke(true);
                  }}
                  className="px-2 py-1 rounded bg-bg-primary hover:bg-bg-card border border-border-subtle font-mono text-[9px] text-text-secondary transition-colors"
                >
                  Winter Stubble Crisis
                </button>
                <button
                  onClick={() => {
                    setSimulationActive(true);
                    setWindDispersion('strong');
                    setTrafficDensity('reduced');
                    setStubbleSmoke(false);
                  }}
                  className="px-2 py-1 rounded bg-bg-primary hover:bg-bg-card border border-border-subtle font-mono text-[9px] text-text-secondary transition-colors"
                >
                  Monsoon Washout
                </button>
              </div>
            </div>
          </div>

          {/* 24h Trend */}
          <div className="sm:col-span-2 lg:col-span-8 glow-card rounded-xl p-4 sm:p-6 theme-transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider">24-Hour AQI Trend · {selectedCity.city}</h3>
              <div className="flex gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-[2px]" style={{ backgroundColor: cityColor }} />
                  <span className="font-mono text-[8px] text-text-muted">Today</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-[2px] opacity-40" style={{ backgroundColor: cityColor }} />
                  <span className="font-mono text-[8px] text-text-muted">Yesterday</span>
                </div>
              </div>
            </div>
            <div className="relative h-[120px] sm:h-[160px]">
              <svg className="w-full h-full" viewBox="0 0 480 160" preserveAspectRatio="none">
                {[0, 40, 80, 120, 160].map(y => (
                  <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(148,163,184,0.05)" strokeWidth="1" />
                ))}
                {/* Rush hour highlight zones */}
                <rect x={140} y={0} width={60} height={160} fill={cityColor} opacity="0.03" />
                <rect x={340} y={0} width={60} height={160} fill={cityColor} opacity="0.03" />
                <text x={170} y={12} textAnchor="middle" fill={cityColor} fontSize="7" fontFamily="JetBrains Mono" opacity="0.4">AM Rush</text>
                <text x={370} y={12} textAnchor="middle" fill={cityColor} fontSize="7" fontFamily="JetBrains Mono" opacity="0.4">PM Rush</text>
                {/* Yesterday's trend (faded) */}
                <path
                  d={generateTrendPath(cityAQI * 0.95, 1)}
                  fill="none"
                  stroke={cityColor}
                  strokeWidth="1.5"
                  opacity="0.2"
                  strokeDasharray="4,3"
                />
                {/* Today's trend */}
                <path
                  d={generateTrendPath(cityAQI, 0)}
                  fill="none"
                  stroke={cityColor}
                  strokeWidth="2"
                  opacity="0.8"
                />
                <path
                  d={generateTrendPath(cityAQI, 0) + ' L480,160 L0,160 Z'}
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

          {/* Pollutant Distribution - Enhanced */}
          <div className="sm:col-span-2 lg:col-span-4 glow-card rounded-xl p-4 sm:p-6 theme-transition">
            <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Pollutant Mix · {selectedCity.city}</h3>
            <div className="space-y-2 sm:space-y-3">
              {pollutantMix.map((p) => (
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

            {/* Health advisory */}
            <div className="mt-4 p-3 rounded-lg border border-border-subtle bg-bg-primary/50 theme-transition">
              <div className="flex items-center gap-2 mb-1">
                <Heart size={10} style={{ color: cityColor }} />
                <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">Health Advisory</span>
              </div>
              <p className="text-[10px] sm:text-xs text-text-secondary leading-relaxed">
                {cityBand?.healthAdvisory || 'No advisory available.'}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Station Sensor Telemetry Inspector Modal */}
        {selectedStation && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedStation(null)}
          >
            <div
              className="bg-bg-card border border-border-subtle rounded-2xl p-4 sm:p-6 max-w-lg w-full shadow-2xl relative theme-transition max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between pb-3 border-b border-border-subtle">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base sm:text-lg font-bold text-text-primary">
                      {selectedStation.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-bg-primary text-[#00B050] border border-[#00B050]/30">
                      {selectedStation.network || 'CPCB CAAQMS Network'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono text-text-secondary bg-bg-primary border border-border-subtle">
                      {selectedStation.stationType || 'Urban Ambient'}
                    </span>
                    <span className="font-mono text-[9px] text-text-muted">
                      {selectedStation.lat.toFixed(4)}° N, {selectedStation.lng.toFixed(4)}° E
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStation(null)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-primary transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {(() => {
                const m = measurements.find(meas => meas.stationId === selectedStation.id) || generateMockMeasurements(selectedStation.id);
                const aqi = m.aqi || 100;
                const color = getAQIColor(aqi);
                const label = getAQILabel(aqi);
                return (
                  <div className="mt-4 space-y-4">
                    {/* Live Station AQI Banner */}
                    <div className="p-3 rounded-xl flex items-center justify-between border border-border-subtle bg-bg-primary/50">
                      <div>
                        <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">Station Real-Time AQI</span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-data text-2xl sm:text-3xl" style={{ color }}>{aqi}</span>
                          <span className="font-mono text-xs font-semibold" style={{ color }}>{label}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">Telemetry Status</span>
                        <div className="flex items-center gap-1.5 mt-1 justify-end">
                          <div className="w-2 h-2 rounded-full bg-aqi-good animate-pulse" />
                          <span className="font-mono text-[10px] text-text-secondary">Continuous Real-time</span>
                        </div>
                      </div>
                    </div>

                    {/* All 7 Pollutants Telemetry Matrix */}
                    <div>
                      <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-2">
                        Live Sensor Telemetry vs NAAQS Limits
                      </p>
                      <div className="space-y-2">
                        {[
                          { name: 'PM2.5', val: m.pm25 || 0, std: 60, unit: 'μg/m³', color: '#FF9900' },
                          { name: 'PM10', val: m.pm10 || 0, std: 100, unit: 'μg/m³', color: '#FF0000' },
                          { name: 'NO₂', val: m.no2 || 0, std: 80, unit: 'μg/m³', color: '#FFFF00' },
                          { name: 'SO₂', val: m.so2 || 0, std: 80, unit: 'μg/m³', color: '#92D050' },
                          { name: 'CO', val: m.co || 0, std: 2.0, unit: 'mg/m³', color: '#A855F7' },
                          { name: 'O₃', val: m.o3 || 0, std: 100, unit: 'μg/m³', color: '#00B0F0' },
                          { name: 'NH₃', val: m.nh3 || 0, std: 400, unit: 'μg/m³', color: '#94a3b8' },
                        ].map(pol => {
                          const pct = Math.min(100, (pol.val / (pol.std * 2.5)) * 100);
                          const isExceeded = pol.val > pol.std;
                          return (
                            <div key={pol.name} className="flex items-center gap-2 text-xs">
                              <span className="font-mono text-[10px] text-text-muted w-10">{pol.name}</span>
                              <div className="flex-1 h-2 bg-bg-primary rounded-full overflow-hidden relative">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{ width: `${pct}%`, backgroundColor: pol.color }}
                                />
                                <div
                                  className="absolute top-0 h-full w-[2px] bg-text-muted/60"
                                  style={{ left: `${Math.min(100, (pol.std / (pol.std * 2.5)) * 100)}%` }}
                                />
                              </div>
                              <span className={`font-data text-[10px] w-16 text-right ${isExceeded ? 'text-aqi-verypoor' : 'text-aqi-good'}`}>
                                {pol.val} <span className="text-text-muted text-[8px]">/ {pol.std}</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Instrumentation & Network Details */}
                    <div className="pt-3 border-t border-border-subtle grid grid-cols-2 gap-2 text-[9px] font-mono text-text-muted">
                      <div>
                        <span className="text-text-secondary block">Sensor Hardware:</span>
                        BAM-1020 / Chemiluminescence
                      </div>
                      <div>
                        <span className="text-text-secondary block">Data Authority:</span>
                        CPCB / {selectedStation.state} SPCB
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function generateTrendPath(baseAQI: number, offset: number): string {
  const points: string[] = [];
  for (let x = 0; x <= 480; x += 10) {
    const hour = (x / 480) * 24;
    // More realistic diurnal pattern with thermal inversion effects
    const inversionFactor = (hour >= 0 && hour <= 6) ? 1.15 : 1;
    const rushFactor = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20) ? 1.35 : 0.85;
    const middayDrop = (hour >= 11 && hour <= 15) ? 0.65 : 1;
    const nightRise = (hour >= 21 || hour <= 3) ? 1.1 : 1;
    const noise = Math.sin(x * 0.05 + offset) * 12 + Math.sin(x * 0.12 + offset * 2) * 8;
    const y = 160 - ((baseAQI * rushFactor * inversionFactor * middayDrop * nightRise + noise) / 500) * 160;
    points.push(`${x === 0 ? 'M' : 'L'}${x},${Math.max(10, Math.min(150, y))}`);
  }
  return points.join(' ');
}
