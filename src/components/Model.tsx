import { useGLTF } from '@react-three/drei'

export default function Model({ path = '/models/avatar.glb', scale = 1 }: { path?: string; scale?: number }) {
  try {
    const gltf = useGLTF(path) as any
    return <primitive object={gltf.scene} scale={scale} />
  } catch (err) {
    return null
  }
}
