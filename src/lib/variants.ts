export interface Variant {
  id: string;
  name: string;
  coreColor: string;
  bleedColor: string;
  voidColor: string;
  structure: 'slit' | 'ribbon' | 'window' | 'wave' | 'uplight' | 'marble' | 'stars' | 'smoke';
  warp: number;
  slitWidth: number;
  grain: number;
  promptText: string;
}

export const VARIANTS: Variant[] = [
  {
    id: 'prismatic-rift',
    name: 'Prismatic Rift',
    coreColor: '#ffffff',
    bleedColor: '#ff00ff',
    voidColor: '#0a0510',
    structure: 'slit',
    warp: 2.5,
    slitWidth: 0.15,
    grain: 0.08,
    promptText: 'Recreate this hero as a full-screen WebGL fragment shader (react-three-fiber), variant "Prismatic Rift":\n- core color #ffffff, bleed color rainbow (hue-rotate), void color #0a0510\n- structure: vertical slit with chromatic dispersion\n- motion: domain-warped fbm noise, 4 octaves, slow drift, gentle pulse\n- finish: film grain + chromatic edge + outer glow bleed\n- UI shell: dark editorial showcase, mono variant list, 3D tilt carousel peeks, blue Copy-prompt pill',
  },
  {
    id: 'ember-clouds',
    name: 'Ember Clouds',
    coreColor: '#ffb347',
    bleedColor: '#ff3d00',
    voidColor: '#1a0a05',
    structure: 'smoke',
    warp: 1.8,
    slitWidth: 0.2,
    grain: 0.06,
    promptText: 'Recreate this hero as a full-screen WebGL fragment shader (react-three-fiber), variant "Ember Clouds":\n- core color #ffb347, bleed color #ff3d00, void color #1a0a05\n- structure: soft smoke clouds with ember glow\n- motion: domain-warped fbm noise, 3 octaves, slow drift, gentle pulse\n- finish: film grain + chromatic edge + outer glow bleed\n- UI shell: dark editorial showcase, mono variant list, 3D tilt carousel peeks, blue Copy-prompt pill',
  },
  {
    id: 'neon-portal',
    name: 'Neon Portal',
    coreColor: '#22e6ff',
    bleedColor: '#b14cff',
    voidColor: '#070a1a',
    structure: 'slit',
    warp: 2.0,
    slitWidth: 0.12,
    grain: 0.07,
    promptText: 'Recreate this hero as a full-screen WebGL fragment shader (react-three-fiber), variant "Neon Portal":\n- core color #22e6ff, bleed color #b14cff, void color #070a1a\n- structure: vertical slit with cyan core and magenta bleed\n- motion: domain-warped fbm noise, 3 octaves, slow drift, gentle pulse\n- finish: film grain + chromatic edge + outer glow bleed\n- UI shell: dark editorial showcase, mono variant list, 3D tilt carousel peeks, blue Copy-prompt pill',
  },
  {
    id: 'red-ribbon',
    name: 'Red Ribbon',
    coreColor: '#ff2d55',
    bleedColor: '#7a0016',
    voidColor: '#0f0508',
    structure: 'ribbon',
    warp: 1.5,
    slitWidth: 0.18,
    grain: 0.05,
    promptText: 'Recreate this hero as a full-screen WebGL fragment shader (react-three-fiber), variant "Red Ribbon":\n- core color #ff2d55, bleed color #7a0016, void color #0f0508\n- structure: folded ribbon bands using abs(sin) mask\n- motion: domain-warped fbm noise, 3 octaves, slow drift, gentle pulse\n- finish: film grain + chromatic edge + outer glow bleed\n- UI shell: dark editorial showcase, mono variant list, 3D tilt carousel peeks, blue Copy-prompt pill',
  },
  {
    id: 'celestial',
    name: 'Celestial',
    coreColor: '#cfe8ff',
    bleedColor: '#2b3a8c',
    voidColor: '#03040c',
    structure: 'stars',
    warp: 1.2,
    slitWidth: 0.1,
    grain: 0.09,
    promptText: 'Recreate this hero as a full-screen WebGL fragment shader (react-three-fiber), variant "Celestial":\n- core color #cfe8ff, bleed color #2b3a8c, void color #03040c\n- structure: star specks with hash noise\n- motion: domain-warped fbm noise, 3 octaves, slow drift, gentle pulse\n- finish: film grain + chromatic edge + outer glow bleed\n- UI shell: dark editorial showcase, mono variant list, 3D tilt carousel peeks, blue Copy-prompt pill',
  },
  {
    id: 'uplight',
    name: 'Uplight',
    coreColor: '#ffe9a8',
    bleedColor: '#ff9d2f',
    voidColor: '#0a0805',
    structure: 'uplight',
    warp: 1.6,
    slitWidth: 0.25,
    grain: 0.06,
    promptText: 'Recreate this hero as a full-screen WebGL fragment shader (react-three-fiber), variant "Uplight":\n- core color #ffe9a8, bleed color #ff9d2f, void color #0a0805\n- structure: gradient from bottom up, no slit\n- motion: domain-warped fbm noise, 3 octaves, slow drift, gentle pulse\n- finish: film grain + chromatic edge + outer glow bleed\n- UI shell: dark editorial showcase, mono variant list, 3D tilt carousel peeks, blue Copy-prompt pill',
  },
  {
    id: 'indigo-marble',
    name: 'Indigo Marble',
    coreColor: '#8ea2ff',
    bleedColor: '#2a1a6e',
    voidColor: '#05030f',
    structure: 'marble',
    warp: 2.8,
    slitWidth: 0.14,
    grain: 0.07,
    promptText: 'Recreate this hero as a full-screen WebGL fragment shader (react-three-fiber), variant "Indigo Marble":\n- core color #8ea2ff, bleed color #2a1a6e, void color #05030f\n- structure: marble turbulence with high octaves\n- motion: domain-warped fbm noise, 4 octaves, slow drift, gentle pulse\n- finish: film grain + chromatic edge + outer glow bleed\n- UI shell: dark editorial showcase, mono variant list, 3D tilt carousel peeks, blue Copy-prompt pill',
  },
  {
    id: 'launch-window',
    name: 'Launch Window',
    coreColor: '#ffffff',
    bleedColor: '#2f6bff',
    voidColor: '#060810',
    structure: 'window',
    warp: 1.4,
    slitWidth: 0.2,
    grain: 0.05,
    promptText: 'Recreate this hero as a full-screen WebGL fragment shader (react-three-fiber), variant "Launch Window":\n- core color #ffffff, bleed color #2f6bff, void color #060810\n- structure: rectangular soft window of light\n- motion: domain-warped fbm noise, 3 octaves, slow drift, gentle pulse\n- finish: film grain + chromatic edge + outer glow bleed\n- UI shell: dark editorial showcase, mono variant list, 3D tilt carousel peeks, blue Copy-prompt pill',
  },
  {
    id: 'cosmic-wave',
    name: 'Cosmic Wave',
    coreColor: '#ff7a18',
    bleedColor: '#1a0d2e',
    voidColor: '#080510',
    structure: 'wave',
    warp: 1.9,
    slitWidth: 0.16,
    grain: 0.08,
    promptText: 'Recreate this hero as a full-screen WebGL fragment shader (react-three-fiber), variant "Cosmic Wave":\n- core color #ff7a18, bleed color #1a0d2e, void color #080510\n- structure: horizontal wave bands with dark ring\n- motion: domain-warped fbm noise, 3 octaves, slow drift, gentle pulse\n- finish: film grain + chromatic edge + outer glow bleed\n- UI shell: dark editorial showcase, mono variant list, 3D tilt carousel peeks, blue Copy-prompt pill',
  },
];

export function getVariantById(id: string): Variant | undefined {
  return VARIANTS.find(v => v.id === id);
}

export function getDefaultVariant(): Variant {
  return VARIANTS.find(v => v.id === 'neon-portal') || VARIANTS[2];
}
