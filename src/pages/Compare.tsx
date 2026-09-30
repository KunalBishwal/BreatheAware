import { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { CITIES, generateExceedanceData, generateClusterData } from '../lib/mockData';
import { getAQIColor } from '../lib/aqi';
import ThemeToggle from '../components/shared/ThemeToggle';
import { Activity, Calendar, GitCompare, BookOpen, Menu, X, Download } from 'lucide-react';

export default function Compare() {
  const { sidebarCollapsed, toggleSidebar, theme } = useAppStore();
  const [exceedanceData] = useState(generateExceedanceData());
  const [clusterData] = useState(generateClusterData());
  const [sortField, setSortField] = useState<'city' | 'percentage'>('percentage');
  const [selectedCities, setSelectedCities] = useState<string[]>(['Delhi', 'Mumbai', 'Chennai', 'Bangalore']);
  const isDark = theme === 'dark';

  const navItems = [
    { path: '/dashboard', label: "Today", icon: Activity },
    { path: '/dashboard/seasonal', label: 'Seasonal', icon: Calendar },
    { path: '/dashboard/compare', label: 'Compare', icon: GitCompare },
    { path: '/dashboard/story', label: 'Story', icon: BookOpen },
  ];

  const toggleCity = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) ? prev.filter(c => c !== city) : prev.length < 4 ? [...prev, city] : prev
    );
  };

  const sortedExceedance = [...exceedanceData].sort((a, b) => 
    sortField === 'percentage' ? b.percentage - a.percentage : a.city.localeCompare(b.city)
  );

  // Memoize radarData to prevent regeneration on theme change
  const radarData = useMemo(() => {
    return selectedCities.map(city => {
      const cityData = CITIES.find(c => c.city === city);
      return {
        city,
        values: [
          cityData ? Math.min(100, cityData.aqi / 5) : 50,
          cityData ? Math.min(100, (cityData.aqi * 1.5) / 5) : 60,
          cityData ? Math.min(100, 30 + Math.random() * 40) : 30,
          cityData ? Math.min(100, 10 + Math.random() * 30) : 15,
          cityData ? Math.min(100, 20 + Math.random() * 40) : 25,
          cityData ? Math.min(100, 20 + Math.random() * 50) : 35,
        ],
        color: getAQIColor(cityData?.aqi || 100),
      };
    });
  }, [selectedCities]);

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
            <h1 className="font-heading text-sm sm:text-lg font-semibold text-text-primary">Compare</h1>
            <ThemeToggle />
          </div>
        </header>

        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {/* City selector */}
          <div className="glow-card rounded-xl p-3 sm:p-4 theme-transition">
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-wider mb-3">Select Cities (max 4)</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {CITIES.map(c => (
                <button
                  key={c.city}
                  onClick={() => toggleCity(c.city)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-mono transition-all ${
                    selectedCities.includes(c.city)
                      ? 'text-text-primary border'
                      : 'bg-bg-primary/50 text-text-muted border border-transparent hover:border-border-subtle'
                  }`}
                  style={selectedCities.includes(c.city) ? { borderColor: getAQIColor(c.aqi), color: getAQIColor(c.aqi) } : {}}
                >
                  {c.city}
                </button>
              ))}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="glow-card rounded-xl p-3 sm:p-4 md:p-6 theme-transition">
            <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Multi-City Radar</h3>
            <div className="flex justify-center">
              <div className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px]">
                <svg viewBox="0 0 300 300" className="w-full h-full">
                  {[0.25, 0.5, 0.75, 1].map(r => (
                    <circle key={r} cx="150" cy="150" r={r * 120} fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="0.5" />
                  ))}
                  {Array.from({ length: 6 }, (_, i) => {
                    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                    return (
                      <line key={i} x1="150" y1="150"
                        x2={150 + 120 * Math.cos(angle)}
                        y2={150 + 120 * Math.sin(angle)}
                        stroke="rgba(148,163,184,0.08)" strokeWidth="0.5"
                      />
                    );
                  })}
                  {radarData.map((city) => {
                    const points = city.values.map((val, i) => {
                      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                      const r = (val / 100) * 120;
                      return `${150 + r * Math.cos(angle)},${150 + r * Math.sin(angle)}`;
                    }).join(' ');
                    return (
                      <g key={city.city}>
                        <polygon points={points} fill={city.color} fillOpacity="0.08" stroke={city.color} strokeWidth="1.5" />
                        {city.values.map((val, i) => {
                          const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                          const r = (val / 100) * 120;
                          return <circle key={i} cx={150 + r * Math.cos(angle)} cy={150 + r * Math.sin(angle)} r="2.5" fill={city.color} />;
                        })}
                      </g>
                    );
                  })}
                  {['PM2.5', 'PM10', 'NO₂', 'SO₂', 'CO', 'O₃'].map((label, i) => {
                    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                    const x = 150 + 135 * Math.cos(angle);
                    const y = 150 + 135 * Math.sin(angle);
                    return (
                      <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                        className="fill-text-muted" fontSize="9" fontFamily="JetBrains Mono">
                        {label}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4">
              {radarData.map(city => (
                <div key={city.city} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full" style={{ backgroundColor: city.color }} />
                  <span className="font-mono text-[9px] sm:text-[10px] text-text-secondary">{city.city}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exceedance Table */}
          <div className="glow-card rounded-xl p-3 sm:p-4 md:p-6 theme-transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider">Exceedance Analysis</h3>
              <button className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-bg-primary text-text-muted text-[10px] sm:text-xs font-mono hover:text-text-primary transition-colors theme-transition">
                <Download size={10} /> CSV
              </button>
            </div>
            
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left py-2 px-2 sm:px-3 font-mono text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider">
                      <button onClick={() => setSortField('city')} className="hover:text-text-primary transition-colors">City</button>
                    </th>
                    <th className="text-left py-2 px-2 sm:px-3 font-mono text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider">Pollutant</th>
                    <th className="text-left py-2 px-2 sm:px-3 font-mono text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider hidden sm:table-cell">Standard</th>
                    <th className="text-left py-2 px-2 sm:px-3 font-mono text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider">
                      <button onClick={() => setSortField('percentage')} className="hover:text-text-primary transition-colors">%</button>
                    </th>
                    <th className="text-left py-2 px-2 sm:px-3 font-mono text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider hidden md:table-cell">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExceedance.map((row, i) => (
                    <tr key={i} className="border-b border-border-subtle/50 hover:bg-bg-card/30 transition-colors">
                      <td className="py-2 px-2 sm:px-3 font-heading text-xs sm:text-sm text-text-primary">{row.city}</td>
                      <td className="py-2 px-2 sm:px-3 font-mono text-[10px] sm:text-xs text-text-secondary">{row.pollutant}</td>
                      <td className="py-2 px-2 sm:px-3 font-data text-[10px] sm:text-xs text-text-muted hidden sm:table-cell">{row.standard}</td>
                      <td className="py-2 px-2 sm:px-3">
                        <span className="font-data text-xs sm:text-sm" style={{ color: getAQIColor(row.percentage * 5) }}>
                          {row.percentage}%
                        </span>
                      </td>
                      <td className="py-2 px-2 sm:px-3 hidden md:table-cell">
                        <div className="w-16 sm:w-20 h-2 bg-bg-primary rounded-full overflow-hidden theme-transition">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${row.percentage}%`,
                              background: `linear-gradient(90deg, #FFFF00, ${getAQIColor(row.percentage * 5)})`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cluster Analysis */}
          <div className="glow-card rounded-xl p-3 sm:p-4 md:p-6 theme-transition">
            <h3 className="font-heading text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Station Clustering · PM2.5 vs NO₂</h3>
            <div className="relative h-[200px] sm:h-[250px]">
              <svg className="w-full h-full" viewBox="0 0 400 250">
                <line x1="40" y1="220" x2="380" y2="220" stroke="rgba(148,163,184,0.1)" strokeWidth="1" />
                <line x1="40" y1="20" x2="40" y2="220" stroke="rgba(148,163,184,0.1)" strokeWidth="1" />
                <text x="210" y="245" textAnchor="middle" className="fill-text-muted" fontSize="9" fontFamily="JetBrains Mono">PM2.5 (μg/m³)</text>
                <text x="15" y="120" textAnchor="middle" className="fill-text-muted" fontSize="9" fontFamily="JetBrains Mono" transform="rotate(-90, 15, 120)">NO₂ (μg/m³)</text>
                
                {clusterData.map((point, i) => {
                  const x = 40 + (point.pm25 / 200) * 340;
                  const y = 220 - (point.no2 / 100) * 200;
                  const color = point.cluster === 'Industrial' ? '#FF0000' : point.cluster === 'Traffic-heavy' ? '#FF9900' : '#00B050';
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="5" fill={color} opacity="0.7" />
                      <circle cx={x} cy={y} r="8" fill={color} opacity="0.15" />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-2">
              {[
                { label: 'Industrial', color: '#FF0000' },
                { label: 'Traffic-heavy', color: '#FF9900' },
                { label: 'Residential', color: '#00B050' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="font-mono text-[9px] sm:text-[10px] text-text-muted">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
