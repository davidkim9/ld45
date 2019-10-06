import React from 'react';

export const Lights = () => {
  return (
    <>
    <ambientLight args={[0x444444]} />
    <directionalLight args={[0xFFFFFF]} position={[10, 20, 15]} />
    </>
  );
}