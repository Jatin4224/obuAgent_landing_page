import { Canvas } from '@react-three/fiber';
import ParticleText from './ParticleText.jsx';

export default function ParticleHero() {
  return (
    <section className="fixed inset-0 h-screen w-screen bg-black">
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#000000']} />
        <ParticleText />
      </Canvas>
    </section>
  );
}
