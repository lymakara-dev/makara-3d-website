import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = { count?: number };

export default function Snow({ count = 400 }: Props) {
  // positions buffer
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = Math.random() * 15 + 2; // start high
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  // per-particle speed
  const vel = useMemo(() => {
    const v = new Float32Array(count);
    for (let i = 0; i < count; i++) v[i] = 0.01 + Math.random() * 0.04;
    return v;
  }, [count]);

  // create geometry once and attach position attribute
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
      let y = positionsAttr.getY(i);
      // fall speed with slight oscillation
      y -= vel[i] * (1 + Math.sin(state.clock.elapsedTime * 0.5 + i));
      if (y < -2) {
        y = 20 + Math.random() * 6;
      }
      positionsAttr.setY(i, y);
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.12}
        color="#ffffff"
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}
