import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { portalFragmentShader } from '../../lib/shaders/portal.frag.glsl';
import type { Variant } from '../../lib/variants';

interface PortalShaderProps {
  variant: Variant;
  pointer?: { x: number; y: number };
  reducedMotion?: boolean;
}

function getStructureIndex(structure: Variant['structure']): number {
  const map: Record<Variant['structure'], number> = {
    'slit': 0,
    'ribbon': 1,
    'window': 2,
    'wave': 3,
    'uplight': 4,
    'marble': 5,
    'stars': 6,
    'smoke': 7,
  };
  return map[structure];
}

function hexToVec3(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

function ShaderPlane({ variant, pointer, reducedMotion }: PortalShaderProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uCoreColor: { value: new THREE.Vector3(...hexToVec3(variant.coreColor)) },
    uBleedColor: { value: new THREE.Vector3(...hexToVec3(variant.bleedColor)) },
    uVoidColor: { value: new THREE.Vector3(...hexToVec3(variant.voidColor)) },
    uWarp: { value: variant.warp },
    uSlitWidth: { value: variant.slitWidth },
    uGrain: { value: variant.grain },
    uStructure: { value: getStructureIndex(variant.structure) },
  }), []);

  // Update uniforms when variant changes
  useEffect(() => {
    uniforms.uCoreColor.value.set(...hexToVec3(variant.coreColor));
    uniforms.uBleedColor.value.set(...hexToVec3(variant.bleedColor));
    uniforms.uVoidColor.value.set(...hexToVec3(variant.voidColor));
    uniforms.uWarp.value = variant.warp;
    uniforms.uSlitWidth.value = variant.slitWidth;
    uniforms.uGrain.value = variant.grain;
    uniforms.uStructure.value = getStructureIndex(variant.structure);
  }, [variant, uniforms]);

  // Update pointer
  useEffect(() => {
    if (pointer) {
      uniforms.uPointer.value.set(pointer.x, 1.0 - pointer.y);
    }
  }, [pointer, uniforms]);

  // Update resolution
  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  useFrame((state) => {
    if (!reducedMotion) {
      uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        fragmentShader={portalFragmentShader}
        vertexShader={`
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

interface PortalShaderCanvasProps {
  variant: Variant;
  className?: string;
  reducedMotion?: boolean;
  pointer?: { x: number; y: number };
}

export default function PortalShader({ variant, className = '', reducedMotion = false, pointer: externalPointer }: PortalShaderCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalPointerRef = useRef({ x: 0.5, y: 0.5 });
  const pointer = externalPointer || internalPointerRef.current;

  const handlePointerMove = (e: React.PointerEvent) => {
    if (reducedMotion || externalPointer) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    internalPointerRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onPointerMove={handlePointerMove}
    >
      <Canvas
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 1] }}
        dpr={[1, reducedMotion ? 1.5 : 2]}
        style={{ background: variant.voidColor }}
      >
        <ShaderPlane
          variant={variant}
          pointer={pointer}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}
