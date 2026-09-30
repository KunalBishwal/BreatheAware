import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PortalShader from './PortalShader';
import { VARIANTS } from '../../lib/variants';
import { useShowcaseStore } from '../../lib/useShowcase';

export default function CarouselStage() {
  const { activeVariantId, setActiveVariant, nextVariant: goNext, prevVariant: goPrev } = useShowcaseStore();
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const stageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const currentIndex = VARIANTS.findIndex(v => v.id === activeVariantId);
  const prevIdx = (currentIndex - 1 + VARIANTS.length) % VARIANTS.length;
  const nextIdx = (currentIndex + 1) % VARIANTS.length;

  const activeVariant = VARIANTS[currentIndex];
  const prevVariantItem = VARIANTS[prevIdx];
  const nextVariantItem = VARIANTS[nextIdx];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  // Wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!stageRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      if (Math.abs(e.deltaY) > 30) {
        if (e.deltaY > 0) goNext();
        else goPrev();
      }
    };

    const stage = stageRef.current;
    if (stage) {
      stage.addEventListener('wheel', handleWheel, { passive: false });
      return () => stage.removeEventListener('wheel', handleWheel);
    }
  }, [goNext, goPrev]);

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPointer({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <div
      ref={stageRef}
      className="relative w-full h-full flex items-center justify-center"
      style={{ perspective: '1400px' }}
      onPointerMove={handlePointerMove}
    >
      {/* Previous peek */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ y: -100, opacity: 0, scale: 0.62, rotateX: 8 }}
        animate={{ y: -60, opacity: 0.5, scale: 0.62, rotateX: 8 }}
        transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.33, 1, 0.68, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="w-full aspect-[16/10] rounded-[14px] overflow-hidden opacity-50">
          <PortalShader variant={prevVariantItem} reducedMotion={reducedMotion} />
        </div>
      </motion.div>

      {/* Active tile */}
      <motion.div
        className="relative w-full aspect-[16/10] rounded-[14px] overflow-hidden cursor-pointer"
        key={activeVariantId}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.04, opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.33, 1, 0.68, 1] }}
        onClick={() => goNext()}
        style={{
          boxShadow: `0 0 60px 20px ${activeVariant.coreColor}30`,
        }}
        aria-label={`${activeVariant.name}: ${activeVariant.promptText.split('\n')[1]}`}
      >
        <PortalShader variant={activeVariant} pointer={pointer} reducedMotion={reducedMotion} />
      </motion.div>

      {/* Next peek */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ y: 100, opacity: 0, scale: 0.62, rotateX: -8 }}
        animate={{ y: 60, opacity: 0.5, scale: 0.62, rotateX: -8 }}
        transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.33, 1, 0.68, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="w-full aspect-[16/10] rounded-[14px] overflow-hidden opacity-50">
          <PortalShader variant={nextVariantItem} reducedMotion={reducedMotion} />
        </div>
      </motion.div>
    </div>
  );
}
