// cube.tsx

import { css } from "@emotion/react";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const RubiksCube: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount?.appendChild(renderer.domElement);

    // Create the Rubik's cub
    const cubeSize = 1;
    const spacing = 0.1;
    const cubeGroup = new THREE.Group();
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

          const materials = [
            new THREE.MeshStandardMaterial({
              color: 0xb71234,
              roughness: 0.3,
              metalness: 0.2,
            }), // red
            new THREE.MeshStandardMaterial({
              color: 0x009b48,
              roughness: 0.3,
              metalness: 0.2,
            }), // green
            new THREE.MeshStandardMaterial({
              color: 0x0046ad,
              roughness: 0.3,
              metalness: 0.2,
            }), // blue
            new THREE.MeshStandardMaterial({
              color: 0xffd500,
              roughness: 0.3,
              metalness: 0.2,
            }), // yellow
            new THREE.MeshStandardMaterial({
              color: 0xff5800,
              roughness: 0.3,
              metalness: 0.2,
            }), // orange
            new THREE.MeshStandardMaterial({
              color: 0xffffff,
              roughness: 0.3,
              metalness: 0.2,
            }), // white
          ];

          const cube = new THREE.Mesh(geometry, materials);
          cube.position.set(x * (cubeSize + spacing), y * (cubeSize + spacing), z * (cubeSize + spacing));
          cubeGroup.add(cube);
        }
      }
    }

    scene.add(cubeGroup);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight1.position.set(5, 5, 5);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, -5, -5);
    directionalLight2.castShadow = true;
    scene.add(directionalLight2);
    // Configure shadows for cubes
    cubeGroup.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    // Set camera position
    camera.position.z = 5;

    // Animation function
    const animate = () => {
      requestAnimationFrame(animate);
      cubeGroup.rotation.x += 0.01;
      cubeGroup.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onWindowResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", onWindowResize);
      mount?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      css={css`
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        `}
    />
  );
};

export default RubiksCube;
