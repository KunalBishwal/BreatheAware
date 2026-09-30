import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { generateCalendarData, generateDiurnalData } from '../lib/mockData';
import { getAQIColor, POLLUTANTS } from '../lib/aqi';
import ThemeToggle from '../components/shared/ThemeToggle';
import { Activity, Calendar, GitCompare, BookOpen, Menu, X } from 'lucide-react';

export default function Seasonal() {
  const { selectedCity, sidebarCollapsed, toggleSidebar, selectedPollutant, setSelectedPollutant, theme } = useAppStore();
  const [calendarData] = useState(generateCalendarData());
  const [diurnalData] = useState(generateDiurnalData());
  const isDark = theme === 'dark';

  const navItems = [
    { path: '/dashboard', label: "Today", icon: Activity },
    { path: '/dashboard/seasonal', label: 'Seasonal', icon: Calendar },
    { path: '/dashboard/compare', label: 'Compare', icon: GitCompare },
    { path: '/dashboard/story', label: 'Story', icon: BookOpen },
  ];

  const weekdayAvg = Array.from({ length: 24 }, (_, hour) => {
    const points = diurnalData.filter(d => d.hour === hour && d.weekday < 5);
    const avg = points.reduce((sum, p) => sum + (p[selectedPollutant as keyof typeof p] as number || 0), 0) / (points.length || 1);
    return { hour, value: Math.round(avg) };
  });

  const weekendAvg = Array.from({ length: 24 }, (_, hour) => {
    const points = diurnalData.filter(d => d.hour === hour && d.weekday >= 5);
    const avg = points.reduce((sum, p) => sum + (p[selectedPollutant as keyof typeof p] as number || 0), 0) / (points.length || 1);
    return { hour, value: Math.round(avg) };
  });

  const monthlyAvg = Array.from({ length: 12 }, (_, month) => {
    const days = calendarData.filter(d => d.month === month);
    const avg = days.reduce((sum, d) => sum + d.aqi, 0) / (days.length || 1);
    return { month, value: Math.round(avg) };
  });

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentPath = useLocation().pathname;

  return (
    <div className="min-h-screen bg-bg-primary flex theme-transition">
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-bg-secondary border-r border-border-subtle z-50 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-56'} hidden md:block theme-transition`}>
        <div className="p-4 flex items-center justify-between">
          {!sidebarCollapsed && (
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-3 h-3 rounded-full bg-aqi-good" />
              <span className="font-heading text-sm font-bold text-text-primary">BreatheAware</span>
            </Link>
          )}
          {sidebarCollapsed ? (
            <Link to="/" className="p-1 text-text-muted hover:text-text-primary transition-colors" title="Back to landing page">
              <div className="w-3 h-3 rounded-full bg-aqi-good" />
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
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                  isActive ? 'bg-bg-card text-text-primary' : 'text-text-muted hover:text-text-secondary hover:bg-bg-card/50'
                }`}
              >
                <Icon size={16} />
                {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border-subtle z-50 md:hidden theme-transition">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Link key={item.path} to={item.path}
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

      <main className="flex-1 md:ml-56 min-h-screen pb-16 md:pb-0">
        <header className="sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-xl border-b border-border-subtle theme-transition">
          <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3">
            <h1 className="font-heading text-sm sm:text-lg font-semibold text-text-primary">Seasonal & Diurnal</h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-mono text-[10px] sm:text-xs text-text-muted">{selectedCity.city}</span>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {/* Pollutant Switch */}
          <div className="glow-card rounded-xl p-3 sm:p-4 theme-transition">
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-3">Select Pollutant</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {POLLUTANTS.map(p => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPollutant(p.key)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-mono transition-all ${
                    selectedPollutant === p.key
                      ? 'bg-bg-primary text-text-primary border border-text-muted'
                      : 'bg-bg-primary/50 text-text-muted border border-transparent hover:border-border-subtle'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Heatmap */}
          <div className="glow-card rounded-xl p-3 sm:p-4 md:p-6 theme-transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider">Calendar Heatmap · 2024</h3>
              <div className="flex items-center gap-1">
                <span className="font-mono text-[8px] sm:text-[9px] text-text-muted">Good</span>
                {['#00B050', '#92D050', '#FFFF00', '#FF9900', '#FF0000', '#800000'].map(c => (
                  <div key={c} className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm" style={{ backgroundColor: c }} />
                ))}
                <span className="font-mono text-[8px] sm:text-[9px] text-text-muted">Severe</span>
              </div>
            </div>
            
            <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
              <div className="min-w-[600px]">
                <div className="flex gap-[2px] mb-1">
                  {monthNames.map(m => (
                    <div key={m} className="flex-1 text-center">
                      <span className="font-mono text-[8px] sm:text-[9px] text-text-muted">{m}</span>
                    </div>
                  ))}
                </div>
                {Array.from({ length: 7 }, (_, weekday) => (
                  <div key={weekday} className="flex gap-[2px] mb-[2px]">
                    <span className="font-mono text-[7px] sm:text-[8px] text-text-muted w-5 sm:w-6 flex-shrink-0 flex items-center">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'][weekday]}
                    </span>
                    {Array.from({ length: 53 }, (_, week) => {
                      const dayData = calendarData.find(d => d.weekday === weekday && Math.floor(d.day / 7) === week % 5 && d.month === week % 12);
                      const aqi = dayData?.aqi || 0;
                      return (
                        <div
                          key={week}
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] flex-shrink-0"
                          style={{
                            backgroundColor: aqi > 0 ? getAQIColor(aqi) : 'rgba(148,163,184,0.05)',
                            opacity: aqi > 0 ? 0.8 : 0.2,
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Diurnal Chart */}
          <div className="glow-card rounded-xl p-3 sm:p-4 md:p-6 theme-transition">
            <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
              Diurnal Pattern · {POLLUTANTS.find(p => p.key === selectedPollutant)?.label}
            </h3>
            <div className="relative h-[150px] sm:h-[200px]">
              <svg className="w-full h-full" viewBox="0 0 480 200" preserveAspectRatio="none">
                {[0, 50, 100, 150, 200].map(y => (
                  <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(148,163,184,0.05)" strokeWidth="1" />
                ))}
                <path
                  d={weekdayAvg.map((p, i) => `${i === 0 ? 'M' : 'L'}${(p.hour / 23) * 480},${200 - (p.value / 200) * 200}`).join(' ')}
                  fill="none"
                  stroke="#FF9900"
                  strokeWidth="2"
                />
                <path
                  d={weekendAvg.map((p, i) => `${i === 0 ? 'M' : 'L'}${(p.hour / 23) * 480},${200 - (p.value / 200) * 200}`).join(' ')}
                  fill="none"
                  stroke="#00B050"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                {['00', '04', '08', '12', '16', '20', '24'].map(t => (
                  <span key={t} className="font-mono text-[8px] sm:text-[9px] text-text-muted">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-[2px] sm:w-4 bg-aqi-poor" />
                <span className="font-mono text-[9px] sm:text-[10px] text-text-muted">Weekday</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-[2px] sm:w-4 bg-aqi-good" />
                <span className="font-mono text-[9px] sm:text-[10px] text-text-muted">Weekend</span>
              </div>
            </div>
          </div>

          {/* Seasonal Trend */}
          <div className="glow-card rounded-xl p-3 sm:p-4 md:p-6 theme-transition">
            <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Monthly Average AQI</h3>
            <div className="relative h-[120px] sm:h-[160px]">
              <svg className="w-full h-full" viewBox="0 0 480 160" preserveAspectRatio="none">
                {[0, 40, 80, 120, 160].map(y => (
                  <line key={y} x1="0" y1={y} x2="480" y2={y} stroke="rgba(148,163,184,0.05)" strokeWidth="1" />
                ))}
                <path
                  d={monthlyAvg.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i / 11) * 480},${160 - (p.value / 400) * 160}`).join(' ')}
                  fill="none"
                  stroke="#FF0000"
                  strokeWidth="2"
                />
                {monthlyAvg.map((p, i) => (
                  <circle
                    key={i}
                    cx={(i / 11) * 480}
                    cy={160 - (p.value / 400) * 160}
                    r="3"
                    fill={getAQIColor(p.value)}
                  />
                ))}
                <line x1={(9.5 / 11) * 480} y1="0" x2={(9.5 / 11) * 480} y2="160" stroke="#FF9900" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                <text x={(9.5 / 11) * 480 + 4} y="15" fill="#FF9900" fontSize="8" fontFamily="JetBrains Mono">Diwali</text>
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                {monthNames.map(m => (
                  <span key={m} className="font-mono text-[7px] sm:text-[9px] text-text-muted">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
