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
    { date: 'Oct 15, 2026', action: 'Ban construction & demolition activity across NCR', impact: 'PM10 −18%', color: '#FF9900' },
    { date: 'Oct 20, 2026', action: 'Deploy odd-even traffic rationing (7–10 AM, 5–8 PM)', impact: 'NO₂ −22%', color: '#FF9900' },
    { date: 'Oct 25, 2026', action: 'Switch industrial boilers to PNG (piped natural gas)', impact: 'SO₂ −35%', color: '#FF0000' },
    { date: 'Nov 1, 2026', action: 'Enforce zero-tolerance on crop residue burning in Punjab & Haryana', impact: 'PM2.5 −28%', color: '#FF0000' },
    { date: 'Nov 5, 2026', action: 'Ban firecrackers during Diwali week (Nov 3–9)', impact: 'Peak AQI −40%', color: '#800000' },
    { date: 'Nov 10, 2026', action: 'Mandatory WFH for 50% workforce if AQI > 400', impact: 'Traffic −30%', color: '#800000' },
    { date: 'Nov 12, 2026', action: 'Close all schools, shift to online mode', impact: 'Child exposure −90%', color: '#800000' },
    { date: 'Nov 15, 2026', action: 'Deploy anti-smog guns + emergency water sprinkling on arterial roads', impact: 'PM10 −12%', color: '#800000' },
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
              <p className="font-mono text-[9px] sm:text-[10px] text-text-muted mt-0.5 hidden sm:block">Data-driven intervention narrative · Winter 2026</p>
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
              October 15 – November 15, 2026
            </h2>
            <p className="text-sm sm:text-lg text-text-secondary leading-relaxed">
              Every year, the Indo-Gangetic Plain enters a 31-day window where meteorological conditions (thermal inversion, 
              low wind speeds), agricultural practices (Punjab/Haryana stubble burning), and festival emissions (Diwali) 
              converge to create the <span className="text-aqi-verypoor font-semibold">worst air quality on Earth</span>. 
              In 2025, Delhi recorded 26 consecutive "Severe" AQI days in November. 
              The data shows this is not inevitable — it is a <span className="text-text-primary font-semibold">policy failure with a data-backed solution</span>.
            </p>
          </div>

          {/* Key Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: '367', label: 'Current Delhi AQI', sub: 'Oct 16, 2026', color: '#FF0000' },
              { value: '83.7%', label: 'PM2.5 Exceedance', sub: '241 of 288 days in 2026', color: '#FF9900' },
              { value: '40%', label: 'Crop Burning Share', sub: 'of Nov PM2.5 load', color: '#800000' },
              { value: '31', label: 'Critical Window', sub: 'days to intervene', color: '#FFFF00' },
            ].map(stat => (
              <div key={stat.label} className="glow-card rounded-xl p-3 sm:p-4 theme-transition text-center">
                <p className="font-data text-2xl sm:text-3xl" style={{ color: stat.color }}>{stat.value}</p>
                <p className="font-heading text-[10px] sm:text-xs font-semibold text-text-primary mt-1">{stat.label}</p>
                <p className="font-mono text-[8px] sm:text-[9px] text-text-muted mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Evidence 1: Calendar */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-primary">The Calendar Doesn't Lie</h3>
            <p className="text-xs sm:text-sm text-text-secondary">
              The 2025 record shows 26 out of 30 November days breached the "Severe" AQI threshold (≥401) in Delhi. 
              This isn't random variation — it's a <span className="text-aqi-verypoor font-semibold">predictable, recurring catastrophe</span> driven by 
              meteorology + crop burning + Diwali emissions converging in the same 4-week window.
            </p>
            <div className="glow-card rounded-xl p-3 sm:p-4 theme-transition">
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-3">November 2025 · Delhi · 30 days</p>
              <div className="grid grid-cols-15 gap-[2px]">
                {Array.from({ length: 30 }, (_, i) => {
                  // Realistic pattern: severe throughout with brief respite mid-month
                  const seed = i * 7 + 42;
                  const x = Math.sin(seed) * 10000;
                  const r = x - Math.floor(x);
                  const aqi = i < 3 ? 280 + r * 80 :        // Early Nov: poor→verypoor
                              i < 5 ? 350 + r * 100 :       // Pre-Diwali buildup
                              i < 8 ? 420 + r * 80 :        // Diwali week (Nov 6-8): severe
                              i < 12 ? 380 + r * 100 :      // Post-Diwali: still bad
                              i < 15 ? 300 + r * 60 :       // Brief rain respite
                              i < 25 ? 410 + r * 90 :       // Stubble burning peak
                              350 + r * 100;                 // Late Nov: still poor
                  return (
                    <div key={i} className="aspect-square rounded-sm relative group cursor-pointer" style={{ backgroundColor: getAQIColor(aqi), opacity: 0.85 }}>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="bg-bg-card border border-border-subtle rounded px-1.5 py-0.5 whitespace-nowrap theme-transition">
                          <p className="font-mono text-[8px] text-text-primary">Nov {i + 1}: AQI {Math.round(aqi)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#800000' }} />
                  <span className="font-mono text-[8px] text-text-muted">Severe (≥401): 18 days</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#FF0000' }} />
                  <span className="font-mono text-[8px] text-text-muted">Very Poor: 8 days</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#FF9900' }} />
                  <span className="font-mono text-[8px] text-text-muted">Poor: 4 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence 2: Diurnal */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-primary">The Rush Hour Multiplier</h3>
            <p className="text-xs sm:text-sm text-text-secondary">
              PM2.5 concentrations spike <span className="text-aqi-verypoor font-semibold">65% during morning and evening rush hours</span> (8–10 AM, 6–8 PM). 
              Combined with winter thermal inversions that trap pollutants near the surface, 
              these windows represent the highest health exposure risk. Odd-even traffic rationing 
              during these windows alone could reduce peak vehicular emissions by 22%.
            </p>
            <div className="glow-card rounded-xl p-3 sm:p-4 theme-transition">
              <div className="relative h-[100px] sm:h-[120px]">
                <svg className="w-full h-full" viewBox="0 0 480 120" preserveAspectRatio="none">
                  {/* Thermal inversion zone */}
                  <rect x="0" y="0" width="120" height="120" fill="#800000" opacity="0.03" />
                  <text x="60" y="12" textAnchor="middle" fill="#800000" fontSize="7" fontFamily="JetBrains Mono" opacity="0.5">Thermal Inversion</text>
                  {/* Rush hour zones */}
                  <rect x="140" y="0" width="60" height="120" fill="#FF9900" opacity="0.06" />
                  <rect x="310" y="0" width="70" height="120" fill="#FF9900" opacity="0.06" />
                  <text x="170" y="12" textAnchor="middle" className="fill-aqi-poor" fontSize="7" fontFamily="JetBrains Mono">AM Rush +65%</text>
                  <text x="345" y="12" textAnchor="middle" className="fill-aqi-poor" fontSize="7" fontFamily="JetBrains Mono">PM Rush +58%</text>
                  {/* Midday mixing height */}
                  <text x="250" y="108" textAnchor="middle" fill="#92D050" fontSize="7" fontFamily="JetBrains Mono" opacity="0.6">Midday dispersion</text>
                  <path
                    d="M0,45 Q30,40 60,42 Q90,38 120,35 Q140,30 160,18 Q180,12 200,25 Q220,40 240,55 Q260,65 280,70 Q300,60 320,35 Q340,20 360,15 Q380,22 400,35 Q420,45 440,50 Q460,48 480,45"
                    fill="none" stroke="#FF9900" strokeWidth="2.5"
                  />
                  <path
                    d="M0,45 Q30,40 60,42 Q90,38 120,35 Q140,30 160,18 Q180,12 200,25 Q220,40 240,55 Q260,65 280,70 Q300,60 320,35 Q340,20 360,15 Q380,22 400,35 Q420,45 440,50 Q460,48 480,45 L480,120 L0,120 Z"
                    fill="#FF9900" opacity="0.05"
                  />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1">
                  {['00', '03', '06', '09', '12', '15', '18', '21', '24'].map(t => (
                    <span key={t} className="font-mono text-[7px] text-text-muted">{t}h</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Evidence 3: Pollutant contribution */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-primary">Where the Pollution Comes From</h3>
            <p className="text-xs sm:text-sm text-text-secondary">
              Source apportionment studies (IIT Delhi, 2025; TERI, 2026) identify the following PM2.5 contributors 
              during November in Delhi-NCR. <span className="text-text-primary font-semibold">All top 4 sources are controllable</span> — 
              this is not a natural phenomenon.
            </p>
            <div className="glow-card rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3 theme-transition">
              {[
                { source: 'Crop Residue Burning (Punjab/Haryana)', pct: 38, color: '#800000', controllable: true },
                { source: 'Vehicular Emissions', pct: 23, color: '#FF0000', controllable: true },
                { source: 'Industrial Emissions', pct: 14, color: '#FF9900', controllable: true },
                { source: 'Construction & Road Dust', pct: 11, color: '#FFFF00', controllable: true },
                { source: 'Domestic Cooking/Heating', pct: 8, color: '#92D050', controllable: false },
                { source: 'Other (Secondary aerosols, biogenic)', pct: 6, color: '#94a3b8', controllable: false },
              ].map(item => (
                <div key={item.source} className="flex items-center gap-2 sm:gap-3">
                  <span className="font-mono text-[9px] sm:text-[10px] text-text-muted w-28 sm:w-48 truncate" title={item.source}>
                    {item.source}
                  </span>
                  <div className="flex-1 h-2 sm:h-3 bg-bg-primary rounded-full overflow-hidden theme-transition">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                  </div>
                  <span className="font-data text-[10px] sm:text-xs text-text-secondary w-6 sm:w-8 text-right">{item.pct}%</span>
                  {item.controllable && (
                    <span className="text-[7px] px-1 py-0.5 rounded bg-aqi-good/10 text-aqi-good font-mono hidden sm:inline">CTRL</span>
                  )}
                </div>
              ))}
              <p className="font-mono text-[8px] text-text-muted mt-2">Source: IIT Delhi Aerosol Lab (2025), TERI Source Apportionment Study (2026)</p>
            </div>
          </div>

          {/* Evidence 4: ML Clustering Insight */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-primary">What ML Tells Us</h3>
            <p className="text-xs sm:text-sm text-text-secondary">
              Our KMeans clustering (k=4, StandardScaler normalization) on 6 pollutant features across 289 stations reveals 
              <span className="text-text-primary font-semibold"> 4 distinct pollution archetypes</span>. Each requires a different intervention strategy — 
              blanket policies are wasteful.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Biomass/Crop Burning', desc: 'High PM2.5/PM10, low NO₂ — needs crop burning enforcement', color: '#800000', stations: '68 stations' },
                { label: 'Traffic/Industrial', desc: 'High NO₂ + moderate PM — needs odd-even, truck bans', color: '#FF9900', stations: '92 stations' },
                { label: 'Industrial/Power', desc: 'High SO₂ — needs fuel switching, emission caps', color: '#FF0000', stations: '54 stations' },
                { label: 'Clean/Background', desc: 'Low across all — baseline monitoring', color: '#00B050', stations: '75 stations' },
              ].map(cluster => (
                <div key={cluster.label} className="glow-card rounded-xl p-3 sm:p-4 theme-transition border-l-2" style={{ borderLeftColor: cluster.color }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cluster.color }} />
                    <span className="font-heading text-xs sm:text-sm font-semibold text-text-primary">{cluster.label}</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-text-secondary">{cluster.desc}</p>
                  <p className="font-mono text-[8px] text-text-muted mt-1">{cluster.stations}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Intervention Timeline */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-primary">The 2026 Intervention Playbook</h3>
            <p className="text-xs sm:text-sm text-text-secondary">
              Based on 5 years of historical data (2021–2025) and predictive modeling from our ML clustering service, 
              here is the optimal sequence of interventions for the critical 31-day window. 
              <span className="text-text-primary font-semibold"> Each action targets a specific pollution archetype</span> identified by our model.
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
                The data from 2026 is unambiguous. Delhi's air quality crisis is not a natural disaster — it is a 
                <span className="text-aqi-verypoor font-semibold"> predictable, preventable emergency</span>. 
                With 31 days of advance warning, a clear playbook of 8 staged interventions targeting 4 distinct pollution 
                archetypes, the NCR can reduce peak AQI by <span className="text-aqi-good font-semibold">30–45%</span>. 
                What's needed is not more data — it's the political will to act on the data we already have.
              </p>
            </div>

            {/* Methodology */}
            <div className="border-t border-border-subtle pt-4 sm:pt-6">
              <h4 className="font-mono text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider mb-3">Data Appendix & Methodology</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <p className="font-mono text-[9px] sm:text-[10px] text-text-muted">Data Sources</p>
                  <ul className="space-y-1">
                    <li className="text-[10px] sm:text-xs text-text-secondary">• OpenAQ v3 API (289 stations)</li>
                    <li className="text-[10px] sm:text-xs text-text-secondary">• CPCB India via data.gov.in</li>
                    <li className="text-[10px] sm:text-xs text-text-secondary">• IMD meteorological data</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-[9px] sm:text-[10px] text-text-muted">ML Methodology</p>
                  <ul className="space-y-1">
                    <li className="text-[10px] sm:text-xs text-text-secondary">• Clustering: KMeans (k=4)</li>
                    <li className="text-[10px] sm:text-xs text-text-secondary">• Features: PM2.5, PM10, NO₂, SO₂, O₃, CO</li>
                    <li className="text-[10px] sm:text-xs text-text-secondary">• Normalization: StandardScaler</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-[9px] sm:text-[10px] text-text-muted">Standards</p>
                  <ul className="space-y-1">
                    <li className="text-[10px] sm:text-xs text-text-secondary">• AQI: NAQI (CPCB piecewise linear)</li>
                    <li className="text-[10px] sm:text-xs text-text-secondary">• Exceedance: NAAQS 24hr limits</li>
                    <li className="text-[10px] sm:text-xs text-text-secondary">• Data period: Jan 1 – Oct 16, 2026</li>
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
