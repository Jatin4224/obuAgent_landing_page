import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Stars } from '@react-three/drei';
import RaccoonParticles from './RaccoonParticles.jsx';

export default function RaccoonParticleHero() {
  return (
    <section className="fixed inset-0 h-screen w-screen bg-black">
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 8, 18]} />
        <Stars
          radius={18}
          depth={8}
          count={900}
          factor={1.4}
          saturation={0}
          fade
          speed={0.28}
        />
        <RaccoonParticles />
        <EffectComposer multisampling={0}>
          <Bloom intensity={1.3} luminanceThreshold={0.16} luminanceSmoothing={0.42} mipmapBlur />
          <Vignette eskil={false} offset={0.24} darkness={0.82} />
        </EffectComposer>
      </Canvas>
    </section>
  );
}
