import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function ThreeScene() {
  return (
    <Canvas camera={{ position: [3, 3, 3] }}>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      {/* 3D Object */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="royalblue" />
      </mesh>

      {/* Camera Controls */}
      <OrbitControls />
    </Canvas>
  );
}
