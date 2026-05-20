import React from 'react';
import { Composition } from 'remotion';
import { PokedexBoot } from './PokedexBoot';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PokedexBoot"
        component={PokedexBoot}
        durationInFrames={360}
        fps={30}
        width={960}
        height={560}
      />
    </>
  );
};
