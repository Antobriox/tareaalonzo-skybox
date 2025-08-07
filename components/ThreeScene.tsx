'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/model/Cute_Demon.glb';

function PenguinModel({ isPlaying }: { isPlaying: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATH);
  const mixer = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    if (animations && animations.length > 0) {
      mixer.current = new THREE.AnimationMixer(scene);
      const action = mixer.current.clipAction(animations[0]);
      if (isPlaying) {
        action.play();
      } else {
        action.stop();
      }
      return () => {
        action.stop();
      };
    }
  }, [scene, animations, isPlaying]);

  useFrame((state, delta) => {
    if (mixer.current && isPlaying) {
      mixer.current.update(delta);
    }
  });

  return <primitive ref={group} object={scene} />;
}

export default function ThreeScene() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
        {/* Iluminación */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 7.5]} intensity={1} castShadow />
        {/* Skybox cambiado a 'city' */}
        <Environment preset="forest" background />
        {/* Modelo animado */}
        <PenguinModel isPlaying={isPlaying} />
        {/* Controles de cámara */}
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
      {/* Interfaz para pausar/reanudar */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <button onClick={() => setIsPlaying((p) => !p)} style={{ padding: '10px 20px', fontSize: '16px' }}>
          {isPlaying ? 'Pausar animación' : 'Reanudar animación'}
        </button>
      </div>
    </div>
  );
}

// Necesario para que useGLTF funcione correctamente con el modelo
useGLTF.preload(MODEL_PATH);