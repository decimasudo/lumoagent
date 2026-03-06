'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, RoundedBox, PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'

function JerrilRobot() {
  const robotRef = useRef<THREE.Group>(null)
  
  // Subtle animation for idle state
  useFrame((state) => {
    if (robotRef.current) {
      // Gentle rotation tracking mouse
      robotRef.current.rotation.y = THREE.MathUtils.lerp(
        robotRef.current.rotation.y,
        (state.mouse.x * Math.PI) / 8, 
        0.05
      )
      robotRef.current.rotation.x = THREE.MathUtils.lerp(
        robotRef.current.rotation.x,
        (-state.mouse.y * Math.PI) / 10,
        0.05
      )
    }
  })

  // Materials
  const shellMaterial = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    roughness: 0.2, // Glossy but not mirror-like
    metalness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  })

  const jointMaterial = new THREE.MeshStandardMaterial({
    color: '#111111', // Matte black
    roughness: 0.8,
    metalness: 0.2,
  })

  const faceplateMaterial = new THREE.MeshPhysicalMaterial({
    color: '#000000',
    roughness: 0.0,
    metalness: 0.8,
    transmission: 0,
    clearcoat: 1,
  })

  const glowMaterial = new THREE.MeshBasicMaterial({
    color: '#00ffff', // Cyan glow
    toneMapped: false,
  })

  return (
    <group ref={robotRef}>
      {/* --- HEAD --- */}
      <group position={[0, 1.3, 0]}>
        {/* Head Shell: Horizontally elongated */}
        <RoundedBox args={[1.8, 1.0, 1.0]} radius={0.25} material={shellMaterial} />
        
        {/* Faceplate: Convex Black Glass */}
        <group position={[0, 0, 0.45]}>
          <RoundedBox args={[1.5, 0.65, 0.2]} radius={0.15} material={faceplateMaterial} />
          
          {/* Eyes: Glowing Cyan Ovals */}
          <group position={[0, 0, 0.11]}>
             {/* Left Eye */}
            <mesh position={[-0.35, 0.05, 0]}>
               <capsuleGeometry args={[0.08, 0.2, 4, 16]} />
               <primitive object={glowMaterial} />
            </mesh>
             {/* Right Eye */}
            <mesh position={[0.35, 0.05, 0]}>
               <capsuleGeometry args={[0.08, 0.2, 4, 16]} />
               <primitive object={glowMaterial} />
            </mesh>
          </group>
        </group>

        {/* Ears: Flat Cylinders on sides */}
        <mesh position={[-0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
          <primitive object={shellMaterial} />
        </mesh>
        <mesh position={[0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
          <primitive object={shellMaterial} />
        </mesh>

        {/* Antenna: Short top cylinder with glowing bulb */}
        <group position={[0, 0.5, 0]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.3]} />
            <primitive object={jointMaterial} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.1]} />
            <primitive object={glowMaterial} />
          </mesh>
        </group>
      </group>

      {/* --- NECK --- */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4]} />
        <primitive object={jointMaterial} />
      </mesh>

      {/* --- BODY --- */}
      <group position={[0, -0.4, 0]}>
        {/* Torso Shell */}
        <RoundedBox args={[1.3, 1.5, 0.8]} radius={0.3} material={shellMaterial} />
        
        {/* Chest Screen: Black digital screen */}
        <group position={[0, 0.1, 0.41]}>
            <mesh>
              <planeGeometry args={[0.8, 0.4]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
            {/* Screen Icons (Glowing Cyan) */}
            <group position={[0, 0, 0.01]}>
               {/* Search Icon */}
               <group position={[-0.2, 0, 0]} scale={0.5}>
                  <mesh>
                     <ringGeometry args={[0.1, 0.13, 32]} />
                     <primitive object={glowMaterial} />
                  </mesh>
                  <mesh position={[0.1, -0.1, 0]} rotation={[0, 0, -Math.PI / 4]}>
                     <planeGeometry args={[0.04, 0.15]} />
                     <primitive object={glowMaterial} />
                  </mesh>
               </group>
               {/* Bar Chart Icon */}
               <group position={[0, 0, 0]} scale={0.6}>
                  <mesh position={[-0.1, -0.1, 0]}>
                     <planeGeometry args={[0.04, 0.1]} />
                     <primitive object={glowMaterial} />
                  </mesh>
                  <mesh position={[0, 0, 0]}>
                      <planeGeometry args={[0.04, 0.25]} />
                      <primitive object={glowMaterial} />
                  </mesh>
                  <mesh position={[0.1, -0.05, 0]}>
                      <planeGeometry args={[0.04, 0.18]} />
                      <primitive object={glowMaterial} />
                  </mesh>
               </group>
               {/* Gear Icon */}
               <group position={[0.2, 0, 0]} scale={0.5}>
                   <mesh>
                       <ringGeometry args={[0.08, 0.14, 8]} />
                       <primitive object={glowMaterial} />
                   </mesh>
               </group>
            </group>
        </group>

         {/* Glowing Blue Capsule Nodes below screen */}
         <group position={[0, -0.4, 0.35]}>
             <mesh position={[-0.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
               <capsuleGeometry args={[0.05, 0.12, 4, 16]} />
               <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.6} />
             </mesh>
             <mesh position={[0.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
               <capsuleGeometry args={[0.05, 0.12, 4, 16]} />
               <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.6} />
             </mesh>
         </group>
      </group>

      {/* --- ARMS --- */}
      {/* Left Arm */}
      <group position={[-0.85, 0.3, 0]}>
         {/* Shoulder Pad (White) */}
         <sphereGeometry args={[0.3]} />
         <primitive object={shellMaterial} />
         {/* Arm Segment (White) */}
         <mesh position={[-0.1, -0.3, 0]} rotation={[0, 0, 0.1]}>
             <capsuleGeometry args={[0.1, 0.6]} />
             <primitive object={shellMaterial} />
         </mesh>
         {/* Hand (Dark Metallic Chunky + Glossy) */}
         <mesh position={[-0.15, -0.75, 0]}>
              <boxGeometry args={[0.2, 0.25, 0.2]} />
              <primitive object={jointMaterial} />
         </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.85, 0.3, 0]}>
         {/* Shoulder Pad (White) */}
         <sphereGeometry args={[0.3]} />
         <primitive object={shellMaterial} />
         {/* Arm Segment (White) */}
         <mesh position={[0.1, -0.3, 0]} rotation={[0, 0, -0.1]}>
             <capsuleGeometry args={[0.1, 0.6]} />
             <primitive object={shellMaterial} />
         </mesh>
         {/* Hand (Dark Metallic Chunky) */}
         <mesh position={[0.15, -0.75, 0]}>
              <boxGeometry args={[0.2, 0.25, 0.2]} />
              <primitive object={jointMaterial} />
         </mesh>
      </group>
    </group>
  )
}

export default function RobotCanvas() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-full h-full" />

  return (
    <div className="w-full h-full absolute inset-0 cursor-move bg-gradient-to-b from-transparent to-slate-50/20">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#e0f2fe" />
        {/* Rim light for sci-fi edge */}
        <spotLight position={[0, 5, -5]} intensity={1} color="#00ffff" distance={15} angle={1} penumbra={1} />
        
        <Environment preset="city" />

        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
            <JerrilRobot />
        </Float>
        
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  )
}