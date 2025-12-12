import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = { count?: number };

export default function Fireflies({ count = 40 }: Props) {
  // initial positions
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = Math.random() * 3 + 0.3;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return arr;
  }, [count]);

  // per-particle speed
  const speeds = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = 0.2 + Math.random() * 0.8;
    return s;
  }, [count]);

  // geometry
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const pointsRef = useRef<THREE.Points | null>(null);

  useFrame((state) => {
    const positionsAttr = (pointsRef.current?.geometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute) || null;
    if (!positionsAttr) return;

    for (let i = 0; i < count; i++) {
      const t = state.clock.elapsedTime * speeds[i] * 0.3;
      const x = Math.sin(t + i) * (1 + Math.cos(t * 0.3 + i * 0.5)) * 2;
      const y = 1 + Math.cos(t * 0.7 + i) * 0.6;
      const z = Math.cos(t + i * 0.7) * 2;
      positionsAttr.setX(i, x);
      positionsAttr.setY(i, y);
      positionsAttr.setZ(i, z);
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.12}
        color="#ffd6a5"
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </points>
  );
}
