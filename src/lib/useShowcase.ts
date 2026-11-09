import { create } from 'zustand';
import { VARIANTS, type Variant } from '../lib/variants';

interface ShowcaseState {
  overlayOpen: boolean;
  activeVariantId: string;
  savedVariants: string[];
  setOverlayOpen: (open: boolean) => void;
  setActiveVariant: (variantId: string) => void;
  toggleSaved: (variantId: string) => void;
  nextVariant: () => void;
  prevVariant: () => void;
}

export const useShowcaseStore = create<ShowcaseState>((set, get) => ({
  overlayOpen: false,
  activeVariantId: 'neon-portal',
  savedVariants: [],
  
  setOverlayOpen: (open) => set({ overlayOpen: open }),
  
  setActiveVariant: (variantId) => set({ activeVariantId: variantId }),
  
  toggleSaved: (variantId) => {
    const { savedVariants } = get();
    if (savedVariants.includes(variantId)) {
      set({ savedVariants: savedVariants.filter(id => id !== variantId) });
    } else {
      set({ savedVariants: [...savedVariants, variantId] });
    }
  },
  
  nextVariant: () => {
    const { activeVariantId } = get();
    const currentIndex = VARIANTS.findIndex(v => v.id === activeVariantId);
    const nextIndex = (currentIndex + 1) % VARIANTS.length;
    set({ activeVariantId: VARIANTS[nextIndex].id });
  },
  
  prevVariant: () => {
    const { activeVariantId } = get();
    const currentIndex = VARIANTS.findIndex(v => v.id === activeVariantId);
    const prevIndex = (currentIndex - 1 + VARIANTS.length) % VARIANTS.length;
    set({ activeVariantId: VARIANTS[prevIndex].id });
  },
}));
