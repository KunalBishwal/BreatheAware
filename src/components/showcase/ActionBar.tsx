import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bookmark, Copy, ChevronDown, ChevronRight, ExternalLink, FileJson, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { VARIANTS } from '../../lib/variants';
import { useShowcaseStore } from '../../lib/useShowcase';

export default function ActionBar() {
  const { activeVariantId, savedVariants, toggleSaved } = useShowcaseStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [similarOpen, setSimilarOpen] = useState(false);

  const activeVariant = VARIANTS.find(v => v.id === activeVariantId);
  const isSaved = savedVariants.includes(activeVariantId);

  const handleCopyPrompt = async () => {
    if (!activeVariant) return;
    try {
      await navigator.clipboard.writeText(activeVariant.promptText);
      toast.success('Prompt copied to clipboard');
    } catch {
      toast.error('Failed to copy prompt');
    }
  };

  const handleCopyMarkdown = async () => {
    if (!activeVariant) return;
    const markdown = `# ${activeVariant.name}\n\n\`\`\`\n${activeVariant.promptText}\n\`\`\``;
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success('Copied as Markdown');
    } catch {
      toast.error('Failed to copy');
    }
    setMenuOpen(false);
  };

  const handleCopyJSON = async () => {
    if (!activeVariant) return;
    const json = JSON.stringify({
      name: activeVariant.name,
      coreColor: activeVariant.coreColor,
      bleedColor: activeVariant.bleedColor,
      voidColor: activeVariant.voidColor,
      structure: activeVariant.structure,
      warp: activeVariant.warp,
      slitWidth: activeVariant.slitWidth,
      grain: activeVariant.grain,
    }, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      toast.success('Copied as JSON');
    } catch {
      toast.error('Failed to copy');
    }
    setMenuOpen(false);
  };

  const handleRemix = () => {
    toast.info('Remix feature coming soon');
  };

  // Get similar variants (same structure type)
  const similarVariants = VARIANTS.filter(
    v => v.id !== activeVariantId && v.structure === activeVariant?.structure
  ).slice(0, 3);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Main action bar */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {/* Remix */}
        <button
          onClick={handleRemix}
          className="flex items-center gap-2 px-3 py-2 text-[#6b7280] hover:text-[#f4f5f7] transition-colors duration-200"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
        >
          <Sparkles size={16} strokeWidth={1.5} />
          <span>Remix</span>
        </button>

        {/* Save */}
        <button
          onClick={() => {
            toggleSaved(activeVariantId);
            toast.success(isSaved ? 'Removed from saved' : 'Saved');
          }}
          className={`flex items-center gap-2 px-3 py-2 transition-colors duration-200 ${
            isSaved ? 'text-[#f4f5f7]' : 'text-[#6b7280] hover:text-[#f4f5f7]'
          }`}
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
        >
          <Bookmark size={16} strokeWidth={1.5} fill={isSaved ? 'currentColor' : 'none'} />
          <span>Save</span>
        </button>

        {/* Copy prompt split button */}
        <div className="flex items-center">
          <button
            onClick={handleCopyPrompt}
            className="flex items-center gap-2 px-4 py-2 rounded-l-lg text-white transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: '#2f6bff', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
          >
            <ExternalLink size={14} strokeWidth={1.5} />
            <span>Copy prompt</span>
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center w-8 h-8 rounded-r-lg border-l border-white/20 text-white transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: '#2f6bff' }}
            aria-label="More copy options"
          >
            <ChevronDown size={14} className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Copy menu dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-12 bg-[#0b0d14] border border-[rgba(255,255,255,0.04)] rounded-lg shadow-2xl overflow-hidden z-50"
          >
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-[#6b7280] hover:text-[#f4f5f7] hover:bg-white/5 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
            >
              <FileText size={14} strokeWidth={1.5} />
              <span>Copy as Markdown</span>
            </button>
            <button
              onClick={handleCopyJSON}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-[#6b7280] hover:text-[#f4f5f7] hover:bg-white/5 transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px' }}
            >
              <FileJson size={14} strokeWidth={1.5} />
              <span>Copy as JSON</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* See similar */}
      <button
        onClick={() => setSimilarOpen(!similarOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,255,255,0.04)] text-[#6b7280] hover:text-[#f4f5f7] hover:border-[rgba(255,255,255,0.08)] transition-all duration-200"
        style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px' }}
      >
        <span>See similar</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${similarOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Similar variants strip */}
      <AnimatePresence>
        {similarOpen && similarVariants.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex gap-3 px-4">
              {similarVariants.map(variant => (
                <button
                  key={variant.id}
                  onClick={() => {
                    useShowcaseStore.getState().setActiveVariant(variant.id);
                    setSimilarOpen(false);
                  }}
                  className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)] transition-all duration-200"
                  style={{ backgroundColor: variant.voidColor }}
                  aria-label={`Switch to ${variant.name}`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div
                      className="w-8 h-8 rounded-full opacity-60"
                      style={{
                        background: `radial-gradient(circle, ${variant.coreColor} 0%, ${variant.bleedColor} 50%, transparent 100%)`,
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
