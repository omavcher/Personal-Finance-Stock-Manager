import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeDScene = () => {
  const sceneRef = useRef(null); // Ref to attach the scene

  useEffect(() => {
    // Set up the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement); // Attach the renderer to the DOM

    // Create a cube geometry with material
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube); // Add the cube to the scene

    // Position the camera
    camera.position.z = 5;

    // Animation function
    const animate = function () {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01; // Rotate the cube
      cube.rotation.y += 0.01;

      renderer.render(scene, camera); // Render the scene from the camera's perspective
    };

    animate(); // Start animation loop

    // Clean up when the component unmounts
    return () => {
      sceneRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={sceneRef} style={{ width: '100%', height: '100vh' }}></div>;
};

export default ThreeDScene;
