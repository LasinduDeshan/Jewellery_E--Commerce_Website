'use client';

import React from 'react';
import Image from 'next/image';
import customizeHeroImage from '../../assets/img/c.png';

export const CustomizeHero: React.FC = () => {
  return (
    <section
      aria-label="Custom jewellery showcase"
      className="relative min-h-[640px] overflow-hidden bg-black sm:min-h-[720px] lg:min-h-[460px]"
    >
      <Image
        src={customizeHeroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-center"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/40" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent to-black" />
    </section>
  );
};
