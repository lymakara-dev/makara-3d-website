import { useRef, useState } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";

type Props = {
  position?: [number, number, number];
};

export default function InteractiveBox({ position = [0, 0, 0] }: Props) {
  const ref = useRef<Mesh | null>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  // 🌈 Smoothed animation
  const { scale, color, glow } = useSpring({
    scale: active ? 1.6 : hovered ? 1.3 : 1,
    color: hovered ? "#ff92ff" : "#6bbdff",
    glow: hovered ? 1.2 : 0.4,
    config: { tension: 200, friction: 18 },
  });

  useFrame((state, delta) => {
    if (!ref.current) return;

    const t = state.clock.getElapsedTime();

    // 🌀 Floating
    ref.current.position.y = position[1] + Math.sin(t * 1.8) * 0.18;

    // 🔄 Smooth rotation
    ref.current.rotation.y += delta * (active ? 1.8 : 0.9);
    ref.current.rotation.x += delta * 0.2;

    // 🧲 Magnetic movement (mouse attraction)
    const mx = state.mouse.x * 0.5;
    const my = state.mouse.y * 0.3;

    ref.current.position.x += (mx - ref.current.position.x) * 0.03;
    ref.current.position.y +=
      (my + position[1] - ref.current.position.y) * 0.03;
  });

  return (
    <a.mesh
      ref={ref}
      position={position}
      scale={scale}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
        setHovered(false);
      }}
      onClick={() => setActive(!active)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <a.meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={glow}
        metalness={0.5}
        roughness={0.25}
      />
    </a.mesh>
  );
}
