import React, { useMemo } from 'react';
import {Color, MeshBasicMaterial, SphereBufferGeometry} from 'three';

export const Stars = () => {
  const [geo, mat, vertices, coords] = useMemo(() => {
    const geo = new SphereBufferGeometry(1, 5, 5)
    const mat = new MeshBasicMaterial({ color: new Color('white') })
    const coords = new Array(2000).fill().map(i => [Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400])
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