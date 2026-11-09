export const portalFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform vec3 uCoreColor;
  uniform vec3 uBleedColor;
  uniform vec3 uVoidColor;
  uniform float uWarp;
  uniform float uSlitWidth;
  uniform float uGrain;
  uniform int uStructure;

  // Hash functions for noise
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  // Value noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // FBM with domain warping
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    
    return value;
  }

  // Domain-warped FBM for painterly texture
  float warpedFbm(vec2 p, float time) {
    vec2 q = vec2(
      fbm(p + vec2(0.0, 0.0) + time * 0.1),
      fbm(p + vec2(5.2, 1.3) + time * 0.12)
    );
    
    vec2 r = vec2(
      fbm(p + uWarp * q + vec2(1.7, 9.2) + time * 0.08),
      fbm(p + uWarp * q + vec2(8.3, 2.8) + time * 0.09)
    );
    
    return fbm(p + uWarp * r);
  }

  // Structure masks
  float slitMask(vec2 uv, float time) {
    float center = 0.5 + sin(time * 0.3) * 0.02;
    float slit = smoothstep(uSlitWidth, 0.0, abs(uv.x - center));
    return slit;
  }

  float ribbonMask(vec2 uv, float time) {
    float ribbon = abs(sin(uv.y * 8.0 + time * 0.5 + fbm(uv * 2.0) * 3.0));
    ribbon = smoothstep(0.3, 0.7, ribbon);
    return ribbon;
  }

  float windowMask(vec2 uv, float time) {
    vec2 center = vec2(0.5, 0.5);
    vec2 size = vec2(0.25, 0.35) + sin(time * 0.4) * 0.02;
    vec2 d = abs(uv - center) - size;
    float box = length(max(d, 0.0));
    return smoothstep(0.1, 0.0, box);
  }

  float waveMask(vec2 uv, float time) {
    float wave = sin(uv.y * 12.0 + time * 0.6 + fbm(uv * 1.5) * 2.0);
    wave = smoothstep(-0.3, 0.3, wave);
    float ring = smoothstep(0.4, 0.35, length(uv - vec2(0.5)));
    return wave * (1.0 - ring * 0.5);
  }

  float uplightMask(vec2 uv, float time) {
    float gradient = smoothstep(0.0, 0.8, uv.y);
    gradient += fbm(uv * 2.0 + time * 0.1) * 0.3;
    return gradient;
  }

  float marbleMask(vec2 uv, float time) {
    float marble = fbm(uv * 3.0 + time * 0.05);
    marble = sin(marble * 8.0 + uv.x * 4.0);
    marble = smoothstep(-0.5, 0.5, marble);
    return marble;
  }

  float starsMask(vec2 uv, float time) {
    float stars = 0.0;
    for (int i = 0; i < 3; i++) {
      vec2 p = uv * (10.0 + float(i) * 5.0);
      vec2 id = floor(p);
      vec2 f = fract(p) - 0.5;
      float h = hash(id + float(i) * 100.0);
      float star = smoothstep(0.1, 0.0, length(f));
      star *= step(0.95, h);
      star *= 0.5 + 0.5 * sin(time * 2.0 + h * 6.28);
      stars += star;
    }
    return stars;
  }

  float smokeMask(vec2 uv, float time) {
    float smoke = warpedFbm(uv * 1.5, time);
    smoke = smoothstep(0.3, 0.7, smoke);
    return smoke;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * aspect;
    
    // Pointer influence (parallax)
    vec2 pointerOffset = (uPointer - 0.5) * 0.06;
    p += pointerOffset;
    
    float time = uTime;
    
    // Get structure mask
    float mask = 0.0;
    if (uStructure == 0) mask = slitMask(uv, time);
    else if (uStructure == 1) mask = ribbonMask(uv, time);
    else if (uStructure == 2) mask = windowMask(uv, time);
    else if (uStructure == 3) mask = waveMask(uv, time);
    else if (uStructure == 4) mask = uplightMask(uv, time);
    else if (uStructure == 5) mask = marbleMask(uv, time);
    else if (uStructure == 6) mask = starsMask(uv, time);
    else mask = smokeMask(uv, time);
    
    // Base void with subtle variation
    float voidNoise = warpedFbm(p * 2.0, time * 0.5);
    vec3 color = uVoidColor + voidNoise * 0.05;
    
    // Core glow
    vec3 coreGlow = uCoreColor * mask;
    
    // Bleed with radial falloff
    float dist = length(p);
    float bleed = smoothstep(0.6, 0.0, dist) * (1.0 - mask);
    bleed *= warpedFbm(p * 1.5, time * 0.3);
    vec3 bleedGlow = uBleedColor * bleed * 0.4;
    
    // Combine
    color += coreGlow + bleedGlow;
    
    // Film grain
    float grain = (hash(gl_FragCoord.xy + time * 100.0) - 0.5) * uGrain;
    color += grain;
    
    // Chromatic aberration at edges
    float chromatic = smoothstep(0.3, 0.8, dist) * 0.02;
    color.r += chromatic;
    color.b -= chromatic;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.4, 1.2, dist);
    color *= vignette;
    
    // Tone mapping
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(0.9));
    
    gl_FragColor = vec4(color, 1.0);
  }
`;
