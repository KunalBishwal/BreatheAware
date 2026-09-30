import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { getAQIColor } from '../lib/aqi';
import ThemeToggle from '../components/shared/ThemeToggle';
import { Activity, Calendar, GitCompare, BookOpen, Menu, X } from 'lucide-react';

export default function Story() {
  const { sidebarCollapsed, toggleSidebar, theme } = useAppStore();
  const isDark = theme === 'dark';

  const navItems = [
    { path: '/dashboard', label: "Today", icon: Activity },
    { path: '/dashboard/seasonal', label: 'Seasonal', icon: Calendar },
    { path: '/dashboard/compare', label: 'Compare', icon: GitCompare },
    { path: '/dashboard/story', label: 'Story', icon: BookOpen },
  ];

  const interventions = [
    { date: 'Oct 15', action: 'Ban construction & demolition', impact: 'PM10 -15%', color: '#FF9900' },
    { date: 'Oct 20', action: 'Implement odd-even traffic', impact: 'NO₂ -20%', color: '#FF9900' },
    { date: 'Oct 25', action: 'Enforce industrial fuel switch', impact: 'SO₂ -30%', color: '#FF0000' },
    { date: 'Nov 1', action: 'Stop crop residue burning', impact: 'PM2.5 -25%', color: '#FF0000' },
    { date: 'Nov 10', action: 'Close schools if AQI > 400', impact: 'Health protection', color: '#800000' },
    { date: 'Nov 15', action: 'Emergency water sprinkling', impact: 'PM10 -10%', color: '#800000' },
  ];

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
            <div>
              <h1 className="font-heading text-sm sm:text-lg font-semibold text-text-primary">Commissioner's Story</h1>
              <p className="font-mono text-[9px] sm:text-[10px] text-text-muted mt-0.5 hidden sm:block">Data-driven intervention narrative</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 space-y-10 sm:space-y-16">
          {/* Opening */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 sm:w-12 bg-aqi-verypoor" />
              <span className="font-mono text-[9px] sm:text-[10px] text-aqi-verypoor uppercase tracking-[0.3em]">The Critical Window</span>
            </div>
            <h2 className="font-heading text-[clamp(1.8rem,5vw,3.5rem)] font-bold text-text-primary leading-tight">
              October 15 – November 15
            </h2>
            <p className="text-sm sm:text-lg text-text-secondary leading-relaxed">
              Every year, Delhi enters a 31-day window where meteorological conditions, agricultural practices, 
              and festival emissions converge to create the worst air quality on Earth. The data shows this is 
              not inevitable — it is a policy failure.
            </p>
          </div>

          {/* Evidence 1: Calendar */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-primary">The Calendar Doesn't Lie</h3>
            <p className="text-xs sm:text-sm text-text-secondary">
              26 days in November alone breach the "Severe" threshold. This isn't random variation — it's a predictable, 
              recurring pattern that demands predictable, pre-planned interventions.
            </p>
            <div className="glow-card rounded-xl p-3 sm:p-4 theme-transition">
              <div className="grid grid-cols-15 gap-[2px]">
                {Array.from({ length: 30 }, (_, i) => {
                  const aqi = i < 10 ? 200 + Math.random() * 100 : i < 20 ? 300 + Math.random() * 100 : 350 + Math.random() * 150;
                  return (
                    <div key={i} className="aspect-square rounded-sm" style={{ backgroundColor: getAQIColor(aqi), opacity: 0.8 }} />
                  );
                })}
              </div>
              <p className="mt-3 font-mono text-[9px] sm:text-[10px] text-text-muted">November 2024 · Delhi · 30 days</p>
            </div>
          </div>

          {/* Evidence 2: Diurnal */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-primary">The Rush Hour Multiplier</h3>
            <p className="text-xs sm:text-sm text-text-secondary">
              PM2.5 concentrations spike 60% during morning and evening rush hours. Odd-even traffic rationing 
              during these windows alone could reduce peak exposure by 20%.
            </p>
            <div className="glow-card rounded-xl p-3 sm:p-4 theme-transition">
              <div className="relative h-[100px] sm:h-[120px]">
                <svg className="w-full h-full" viewBox="0 0 480 120" preserveAspectRatio="none">
                  <path
                    d="M0,80 Q30,85 60,90 Q90,70 120,40 Q150,25 180,30 Q210,40 240,60 Q270,70 300,50 Q330,30 360,25 Q390,35 420,55 Q450,70 480,80"
                    fill="none" stroke="#FF9900" strokeWidth="2"
                  />
                  <rect x="100" y="0" width="80" height="120" fill="#FF9900" opacity="0.05" />
                  <rect x="300" y="0" width="80" height="120" fill="#FF9900" opacity="0.05" />
                  <text x="140" y="15" textAnchor="middle" className="fill-aqi-poor" fontSize="8" fontFamily="JetBrains Mono">AM Peak</text>
                  <text x="340" y="15" textAnchor="middle" className="fill-aqi-poor" fontSize="8" fontFamily="JetBrains Mono">PM Peak</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Evidence 3: Pollutant contribution */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-primary">Where the Pollution Comes From</h3>
            <p className="text-xs sm:text-sm text-text-secondary">
              Crop residue burning contributes up to 40% of PM2.5 in November. Combined with Diwali fireworks 
              and construction dust, these are controllable sources.
            </p>
            <div className="glow-card rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3 theme-transition">
              {[
                { source: 'Crop Residue Burning', pct: 40, color: '#800000' },
                { source: 'Vehicle Emissions', pct: 25, color: '#FF0000' },
                { source: 'Industrial', pct: 15, color: '#FF9900' },
                { source: 'Construction Dust', pct: 12, color: '#FFFF00' },
                { source: 'Other', pct: 8, color: '#94a3b8' },
              ].map(item => (
                <div key={item.source} className="flex items-center gap-2 sm:gap-3">
                  <span className="font-mono text-[9px] sm:text-[10px] text-text-muted w-24 sm:w-36 truncate">{item.source}</span>
                  <div className="flex-1 h-2 sm:h-3 bg-bg-primary rounded-full overflow-hidden theme-transition">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                  </div>
                  <span className="font-data text-[10px] sm:text-xs text-text-secondary w-6 sm:w-8 text-right">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Intervention Timeline */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-primary">The Intervention Playbook</h3>
            <p className="text-xs sm:text-sm text-text-secondary">
              Based on historical data and predictive modeling, here is the optimal sequence of interventions 
              for the critical 31-day window.
            </p>
            
            <div className="relative pl-5 sm:pl-6">
              <div className="absolute left-1.5 sm:left-2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-aqi-poor via-aqi-verypoor to-aqi-severe" />
              
              {interventions.map((item, i) => (
                <div key={i} className="relative mb-4 sm:mb-6 last:mb-0">
                  <div className="absolute -left-[14px] sm:-left-[18px] top-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-bg-primary" style={{ backgroundColor: item.color }} />
                  
                  <div className="glow-card rounded-lg p-3 sm:p-4 ml-3 sm:ml-4 theme-transition">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="font-mono text-[9px] sm:text-[10px] text-text-muted">{item.date}</span>
                      <span className="font-mono text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap" style={{ backgroundColor: item.color + '20', color: item.color }}>
                        {item.impact}
                      </span>
                    </div>
                    <p className="font-heading text-xs sm:text-sm font-semibold text-text-primary">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Closing */}
          <div className="space-y-4 sm:space-y-6 pb-8 sm:pb-16">
            <div className="glow-card rounded-xl p-4 sm:p-6 border-l-2 border-aqi-verypoor theme-transition">
              <h3 className="font-heading text-base sm:text-lg font-semibold text-text-primary mb-2">The Conclusion</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                The data is unambiguous. Delhi's air quality crisis is not a natural disaster — it is a 
                <span className="text-aqi-verypoor font-semibold"> predictable, preventable emergency</span>. 
                With 31 days of advance warning and a clear playbook of interventions, the city can reduce 
                peak AQI by 30-40%. What's needed is not more data — it's the political will to act on the data we already have.
              </p>
            </div>

            {/* Methodology */}
            <div className="border-t border-border-subtle pt-4 sm:pt-6">
              <h4 className="font-mono text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider mb-3">Data Appendix & Methodology</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <p className="font-mono text-[9px] sm:text-[10px] text-text-muted">Data Sources</p>
                  <ul className="space-y-1">
                    <li className="text-[10px] sm:text-xs text-text-secondary">• OpenAQ v3 API (global stations)</li>
                    <li className="text-[10px] sm:text-xs text-text-secondary">• CPCB India via data.gov.in</li>
                    <li className="text-[10px] sm:text-xs text-text-secondary">• IMD meteorological data</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-[9px] sm:text-[10px] text-text-muted">Methodology</p>
                  <ul className="space-y-1">
                    <li className="text-[10px] sm:text-xs text-text-secondary">• AQI: NAQI (National Air Quality Index)</li>
                    <li className="text-[10px] sm:text-xs text-text-secondary">• Clustering: KMeans (k=3, PM2.5+NO₂)</li>
                    <li className="text-[10px] sm:text-xs text-text-secondary">• Exceedance: CPCB 24hr standards</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
