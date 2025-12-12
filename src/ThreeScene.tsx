import React, { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Starfield from "./components/particles/Starfield";
import Snow from "./components/particles/Snow";
import Fireflies from "./components/particles/Fireflies";
import InteractiveBox from "./components/InteractiveBox";
import type { ModeKey } from "./modes";

type Props = { mode: ModeKey };

function SceneLighting({ mode }: { mode: ModeKey }) {
  // Return different light setups depending on mode
  if (mode === "light" || mode === "aurora") {
    return (
      <>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 10, 5]} intensity={0.9} />
      </>
    );
  }
  // dark-family modes
  return (
    <>
      <ambientLight intensity={0.35} color={new THREE.Color("#a3e3ff")} />
      <directionalLight
        position={[6, 8, 6]}
        intensity={0.6}
        color={new THREE.Color("#fff2d6")}
      />
    </>
  );
}

function CameraRig({
  mouse,
  scroll,
}: {
  mouse: THREE.Vector2;
  scroll: number;
}) {
  const { camera } = useThree();
  useFrame((_) => {
    const smooth = 0.08;
    const targetZ = 4 + scroll * 3;
    const targetY = 1.5 - scroll * 0.8;
    camera.position.z += (targetZ - camera.position.z) * smooth;
    camera.position.y += (targetY - camera.position.y) * smooth;

    // mouse parallax
    const targetX = mouse.x * 0.8;
    const targetXX = camera.position.x + (targetX - camera.position.x) * 0.08;
    camera.position.x += (targetXX - camera.position.x) * 0.08;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function ThreeScene({ mode }: Props) {
  const mouse = useRef(new THREE.Vector2(0, 0));
  const scrollRef = useRef(0);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Canvas shadows camera={{ position: [0, 1.5, 4], fov: 50 }}>
      {/* Lighting */}
      <SceneLighting mode={mode} />

      {/* Fog for fog mode */}
      <fog
        attach="fog"
        args={mode === "fog" ? ["#071026", 3, 10] : ["#071026", 100, 200]}
      />

      {/* camera rig reads mouse and scroll */}
      <CameraRig mouse={mouse.current} scroll={scrollRef.current} />

      {/* Ambient scene objects */}
      <group position={[0, -1, 0]}>
        <InteractiveBox position={[-1.6, 0, 0]} />
        <InteractiveBox position={[1.6, 0, 0]} />
      </group>

      {/* Mode-specific visual systems */}
      {mode === "galaxy" && <Starfield count={1200} />}
      {mode === "snow" && <Snow count={600} />}
      {mode === "fireflies" && <Fireflies count={60} />}

      {/* Avatar model (sits center) */}
      <React.Suspense
        fallback={
          <Html center>
            <div className="r3f-card">Loading model…</div>
          </Html>
        }
      >
        <AvatarModel />
      </React.Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}

function AvatarModel() {
  try {
    const gltf = useGLTF("/models/avatar.glb") as any;
    // Slight color / emissive tweak when aurora
    return <primitive object={gltf.scene} scale={1.4} position={[0, -1, 0]} />;
  } catch {
    return null;
  }
}
