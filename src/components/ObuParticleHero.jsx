import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import RaccoonParticles from './RaccoonParticles.jsx';

export default function ObuParticleHero() {
  return (
    <div className="h-full w-full bg-black">
      <Canvas
        className="h-full w-full"
        camera={{ position: [0, 0, 9], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 8, 18]} />
        <RaccoonParticles />
        <EffectComposer multisampling={0}>
          <Bloom intensity={1.15} luminanceThreshold={0.12} luminanceSmoothing={0.42} mipmapBlur />
          <Vignette eskil={false} offset={0.25} darkness={0.82} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
