import React, { useMemo } from 'react';
import {Color, MeshBasicMaterial, SphereBufferGeometry} from 'three';

export const Debris = () => {
  const [geo, mat, vertices, coords] = useMemo(() => {
    const geo = new SphereBufferGeometry(0.01, 5, 5)
    const mat = new MeshBasicMaterial({ color: new Color('grey') })
    const coords = new Array(2000).fill().map(i => [Math.random() * 50 - 25, 0, Math.random() * 50 - 25])
    return [geo, mat, vertices, coords]
  }, [])
  return (
    <group>
      {coords.map(([p1, p2, p3], i) => (
        <mesh key={i} geometry={geo} material={mat} position={[p1, p2, p3]} />
      ))}
    </group>
  )
}