import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useShowcaseStore } from '../lib/useShowcase';
import { VARIANTS } from '../lib/variants';
import ShowcaseOverlay from '../components/showcase/ShowcaseOverlay';
import PortalShader from '../components/showcase/PortalShader';

export default function ShowcasePage() {
  const { setOverlayOpen, setActiveVariant } = useShowcaseStore();

  const handleCardClick = (variantId: string) => {
    setActiveVariant(variantId);
    setOverlayOpen(true);
  };

  // Open overlay by default on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setOverlayOpen(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [setOverlayOpen]);

  return (
    <div className="min-h-screen bg-[#05060a] text-[#f4f5f7]">
      <Toaster position="bottom-right" theme="dark" />
      
      {/* Header */}
      <header className="border-b border-[rgba(255,255,255,0.04)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22e6ff] to-[#b14cff]" />
            <h1 className="text-lg font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Component Showcase
            </h1>
          </div>
          <button
            onClick={() => setOverlayOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#2f6bff] text-white text-sm font-medium hover:brightness-110 transition-all duration-200"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Open Showcase
          </button>
        </div>
      </header>

      {/* Category strip */}
      <div className="border-b border-[rgba(255,255,255,0.04)] px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto">
          {['Heroes 1.2K', 'Footers 65', 'Buttons 2K', 'Forms 1.5K', 'Sign ins 103'].map((cat) => (
            <div
              key={cat}
              className="flex-shrink-0 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.04)] text-[#6b7280] text-[10px] hover:border-[rgba(255,255,255,0.08)] hover:text-[#f4f5f7] transition-all duration-200 cursor-pointer"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-medium mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            UI components
          </h2>
          <p className="text-sm text-[#6b7280]" style={{ fontFamily: 'Inter, sans-serif' }}>
            Browse and preview shader-based hero components
          </p>
        </div>

        {/* Hero cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VARIANTS.map((variant) => (
            <button
              key={variant.id}
              onClick={() => handleCardClick(variant.id)}
              className="group relative aspect-[16/10] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)] transition-all duration-300 text-left"
              aria-label={`Open ${variant.name} showcase`}
            >
              {/* Shader preview */}
              <div className="absolute inset-0">
                <PortalShader variant={variant} reducedMotion />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h3
                  className="text-white text-sm font-medium mb-1"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {variant.name}
                </h3>
                <p
                  className="text-white/60 text-[10px]"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {variant.structure} · {variant.coreColor}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* New & noteworthy section */}
        <div className="mt-16">
          <h3 className="text-lg font-medium mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            New & noteworthy
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VARIANTS.slice(0, 3).map((variant) => (
              <button
                key={variant.id}
                onClick={() => handleCardClick(variant.id)}
                className="group relative aspect-[16/10] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)] transition-all duration-300 text-left"
                aria-label={`Open ${variant.name} showcase`}
              >
                <div className="absolute inset-0">
                  <PortalShader variant={variant} reducedMotion />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white text-sm font-medium mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {variant.name}
                  </h3>
                  <p className="text-white/60 text-[10px]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {variant.structure} · {variant.coreColor}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Showcase overlay */}
      <ShowcaseOverlay />
    </div>
  );
}
