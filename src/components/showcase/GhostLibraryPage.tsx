import { Search, Home, Compass, Bug, Plus } from 'lucide-react';

export default function GhostLibraryPage() {
  return (
    <div className="fixed inset-0 bg-[#05060a] overflow-hidden pointer-events-none">
      {/* Left rail */}
      <div className="absolute left-0 top-0 bottom-0 w-56 border-r border-[rgba(255,255,255,0.04)] p-4 flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)]" />
          <span className="text-[#3a3f4b] text-sm font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Component Library
          </span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
          <Search size={14} className="text-[#3a3f4b]" />
          <span className="text-[#3a3f4b] text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
            Search components...
          </span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#3a3f4b] text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <Home size={14} />
            <span>Home</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#3a3f4b] text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <Compass size={14} />
            <span>Explore</span>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className="absolute left-56 top-0 right-0 bottom-0 p-8">
        {/* Category strip */}
        <div className="flex items-center gap-4 mb-8">
          {['Heroes 1.2K', 'Footers 65', 'Buttons 2K', 'Forms 1.5K', 'Sign ins 103'].map((cat) => (
            <div
              key={cat}
              className="px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.04)] text-[#3a3f4b] text-[10px]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Right column header */}
        <div className="absolute right-8 top-8 text-right">
          <h2 className="text-[#3a3f4b] text-sm font-medium mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            UI components
          </h2>
          <div className="flex flex-col gap-1 text-[10px] text-[#3a3f4b]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <span>Forms and pickers</span>
            <span>Sign in</span>
            <span>Sign ups</span>
          </div>
        </div>

        {/* Hero cards grid */}
        <div className="grid grid-cols-3 gap-4 mt-16">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[16/10] rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] overflow-hidden"
            >
              <div
                className="w-full h-full"
                style={{
                  background: `radial-gradient(circle at ${30 + i * 10}% ${40 + i * 5}%, rgba(47,107,255,0.1) 0%, transparent 50%)`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom elements */}
        <div className="absolute bottom-8 left-8 flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.04)] text-[#3a3f4b] text-[10px]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          <Bug size={12} />
          <span>Add Bug Bot</span>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <h3 className="text-[#3a3f4b] text-sm font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            New & noteworthy
          </h3>
        </div>
      </div>

      {/* Scrim overlay */}
      <div className="absolute inset-0 bg-[rgba(5,6,10,0.78)] backdrop-blur-[2px]" />
    </div>
  );
}
