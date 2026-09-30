import { motion } from 'framer-motion';
import { VARIANTS } from '../../lib/variants';
import { useShowcaseStore } from '../../lib/useShowcase';

export default function VariantList() {
  const { activeVariantId, setActiveVariant } = useShowcaseStore();

  return (
    <>
      {/* Desktop: Vertical list */}
      <div className="hidden md:flex flex-col justify-center h-full" role="listbox" aria-label="Shader variants">
        {VARIANTS.map((variant) => {
          const isActive = variant.id === activeVariantId;
          return (
            <motion.button
              key={variant.id}
              role="option"
              aria-selected={isActive}
              onClick={() => setActiveVariant(variant.id)}
              className={`relative text-right py-1.5 px-3 transition-colors duration-200 group ${
                isActive ? 'text-[#f4f5f7]' : 'text-[#6b7280] hover:text-[#f4f5f7]'
              }`}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.05em', lineHeight: '1.9' }}
              whileHover={{ x: -2 }}
              transition={{ duration: 0.2 }}
            >
              {isActive && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full"
                  style={{ backgroundColor: '#22e6ff' }}
                  layoutId="activeIndicator"
                  transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                />
              )}
              <span className={isActive ? 'font-semibold' : 'font-normal'}>
                {variant.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile: Horizontal chip strip */}
      <div className="flex md:hidden overflow-x-auto gap-2 px-4 py-3 scrollbar-hide" role="listbox" aria-label="Shader variants">
        {VARIANTS.map((variant) => {
          const isActive = variant.id === activeVariantId;
          return (
            <button
              key={variant.id}
              role="option"
              aria-selected={isActive}
              onClick={() => setActiveVariant(variant.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] transition-all duration-200 border ${
                isActive
                  ? 'bg-[#f4f5f7]/10 text-[#f4f5f7] border-[#22e6ff]/40'
                  : 'bg-transparent text-[#6b7280] border-[rgba(255,255,255,0.04)] hover:text-[#f4f5f7]'
              }`}
              style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em' }}
            >
              {variant.name}
            </button>
          );
        })}
      </div>
    </>
  );
}
