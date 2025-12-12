import  { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = { count?: number };

export default function Starfield({ count = 1000 }: Props) {
  const pointsRef = useRef<THREE.Points | null>(null);

  const geo = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 20 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3 + 0] = Math.cos(theta) * Math.cos(phi) * r;
      positions[i * 3 + 1] = Math.sin(phi) * r * 0.5;
      positions[i * 3 + 2] = Math.sin(theta) * Math.cos(phi) * r;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    // 🌌 Rotate the entire starfield, not the material
    pointsRef.current.rotation.y += 0.0006;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;

    // Twinkle effect through material opacity change
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.8}
        sizeAttenuation
        color={"#dbeafe"}
        transparent
        depthWrite={false}
        opacity={0.9}
      />
    </points>
  );
}
