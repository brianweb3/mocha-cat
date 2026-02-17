import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { useTamagotchiStore } from "./store";

import TamagotchiCusto from "./components/TamagotchiCusto";
import Env from "./components/Env";
import Background from "./components/Background";

export default function App() {
  const autoRotate = useTamagotchiStore((state) => state.autoRotate);

  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 6], fov: 25 }}>
        <Suspense fallback={null}>
          <group position={[0, -0.5, 0]}>
            <TamagotchiCusto scale={0.4} rotation-x={0} position-y={0} />
          </group>
          <Env />
        </Suspense>

        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={6}
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
      <Background />
    </>
  );
}
