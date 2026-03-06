'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

function Stars({ color = "#22d3ee", count = 5000, size = 0.002, ...props }: any) {
  const ref = useRef<any>()
  const [sphere] = useState(() => random.inSphere(new Float32Array(count), { radius: 1.5 }))

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 45
    ref.current.rotation.y -= delta / 60
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color={color}
          size={size}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  )
}

function Nebula() {
  const ref = useRef<any>()
  const [points] = useState(() => random.inSphere(new Float32Array(1000), { radius: 0.8 }))
  
  useFrame((state, delta) => {
    ref.current.rotation.z += delta / 100
  })

  return (
    <group rotation={[Math.PI / 4, 0, 0]}>
       <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color="#f59e0b"
            size={0.004}
            sizeAttenuation={true}
            depthWrite={false}
            opacity={0.4}
          />
       </Points>
    </group>
  )
}

import { useState } from 'react'

export function InteractiveBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#020617]">
      {/* Dynamic Deep Space Gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-void-deep via-transparent to-stellar/5 z-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-stellar/5 rounded-full blur-[120px] pointer-events-none z-10 opacity-30 animate-pulse" />
      
      <Canvas camera={{ position: [0, 0, 0.5] }}>
        <Stars color="#22d3ee" count={4000} size={0.002} />
        <Stars color="#ffffff" count={2000} size={0.001} />
        <Nebula />
      </Canvas>
    </div>
  )
}
