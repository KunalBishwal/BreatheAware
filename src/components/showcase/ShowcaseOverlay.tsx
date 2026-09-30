import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Link2, Info, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { useShowcaseStore } from '../../lib/useShowcase';
import { VARIANTS } from '../../lib/variants';
import GhostLibraryPage from './GhostLibraryPage';
import CarouselStage from './CarouselStage';
import VariantList from './VariantList';
import ActionBar from './ActionBar';

export default function ShowcaseOverlay() {
  const { overlayOpen, setOverlayOpen, activeVariantId, nextVariant: goNext, prevVariant: goPrev } = useShowcaseStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const activeVariant = VARIANTS.find(v => v.id === activeVariantId);

  // Body scroll lock
  useEffect(() => {
    if (overlayOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [overlayOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!overlayOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOverlayOpen(false);
      } else if (e.key === 'c' || e.key === 'C') {
        // Copy prompt shortcut
        if (activeVariant) {
          navigator.clipboard.writeText(activeVariant.promptText);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [overlayOpen, setOverlayOpen, activeVariant]);

  // Focus trap
  useEffect(() => {
    if (!overlayOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (firstFocusable) firstFocusable.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [overlayOpen]);

  return (
    <AnimatePresence>
      {overlayOpen && (
        <>
          {/* Layer A: Ghost library page */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            className="fixed inset-0 z-40"
            onClick={() => setOverlayOpen(false)}
          >
            <GhostLibraryPage />
          </motion.div>

          {/* Layer B: Showcase overlay */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Component showcase overlay"
          >
            {/* Modal container */}
            <div
              className="relative w-full max-w-[1180px] max-h-[92vh] rounded-[20px] overflow-hidden flex flex-col"
              style={{
                backgroundColor: '#0b0d14',
                border: '1px solid rgba(255,255,255,0.04)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
              }}
            >
              {/* Top icon rail */}
              <div className="absolute top-4 right-4 flex items-center gap-1 z-10">
                {[ExternalLink, Link2, Info, MoreVertical].map((Icon, i) => (
                  <button
                    key={i}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6b7280] hover:text-[#f4f5f7] hover:bg-white/5 transition-all duration-200"
                    aria-label={`Icon button ${i + 1}`}
                  >
                    <Icon size={16} strokeWidth={1.5} />
                  </button>
                ))}
                <button
                  onClick={() => setOverlayOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[#f4f5f7] hover:bg-white/5 transition-all duration-200"
                  aria-label="Close showcase"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* Main content */}
              <div className="flex flex-1 min-h-0">
                {/* Left: Title (desktop only) */}
                <div className="hidden md:flex w-[20%] items-center justify-center p-8">
                  <AnimatePresence mode="wait">
                    <motion.h1
                      key={activeVariantId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.33, 1, 0.68, 1] }}
                      className="text-[#f4f5f7] text-[30px] font-medium leading-tight"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {activeVariant?.name}
                    </motion.h1>
                  </AnimatePresence>
                </div>

                {/* Center: Stage */}
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Mobile title */}
                  <div className="md:hidden px-4 pt-4 pb-2">
                    <h1
                      className="text-[#f4f5f7] text-[20px] font-medium"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {activeVariant?.name}
                    </h1>
                  </div>

                  {/* Carousel stage */}
                  <div className="flex-1 flex items-center justify-center px-4 md:px-8 py-4 min-h-0">
                    <div className="w-full max-w-[62%] h-full flex items-center">
                      <CarouselStage />
                    </div>
                  </div>

                  {/* Mobile variant list */}
                  <div className="md:hidden">
                    <VariantList />
                  </div>

                  {/* Action bar */}
                  <div className="px-4 md:px-8 py-4 border-t border-[rgba(255,255,255,0.04)]">
                    <ActionBar />
                  </div>
                </div>

                {/* Right: Variant list (desktop only) */}
                <div className="hidden md:flex w-[16%] p-8">
                  <VariantList />
                </div>
              </div>

              {/* Side chevrons */}
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-[#6b7280] hover:text-[#f4f5f7] hover:bg-white/5 transition-all duration-200"
                aria-label="Previous variant"
              >
                <ChevronLeft size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-[#6b7280] hover:text-[#f4f5f7] hover:bg-white/5 transition-all duration-200"
                aria-label="Next variant"
              >
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
