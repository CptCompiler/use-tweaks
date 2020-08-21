import React, { useEffect } from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "drei";

import Effects from "./Effects";

import Scene from "./Scene";

function App() {
  return (
    <>
      <Canvas
        shadowMap
        colorManagement
        camera={{ position: [0, 0, -4], far: 50 }}
        style={{
          background: "#121212",
        }}
        concurrent
      >
        <OrbitControls />

        <pointLight position={[0, 1, 0]} />

        <directionalLight position={[-1, 0, 0]} intensity={0.1} />
        <directionalLight position={[1, 0, 0]} intensity={0.2} />

        <Scene />

        <Effects />
      </Canvas>
    </>
  );
}

export default App;
