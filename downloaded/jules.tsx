import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { motion } from "framer-motion";

const Box = (props) => {
  const mesh = useRef(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <motion.mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      animate={{
        rotateX: active ? Math.PI / 2 : 0,
        rotateY: active ? Math.PI / 2 : 0,
      }}
      transition={{ duration: 0.5 }}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </motion.mesh>
  );
};

const JulesTestPage = () => {
  return (
    <div style={{ height: "100vh", background: "#111" }}>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
          <Text
            color="white"
            anchorX="center"
            anchorY="middle"
            fontSize={0.5}
            position={[0, 2, 0]}
          >
            Hello from Jules!
          </Text>
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default JulesTestPage;
