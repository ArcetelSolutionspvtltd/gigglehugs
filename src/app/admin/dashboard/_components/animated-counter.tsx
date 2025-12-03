'use client';

import { useEffect, useState } from 'react';
import { animate } from 'motion';

type AnimatedCounterProps = {
  to: number;
};

export function AnimatedCounter({ to }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(
      (progress) => {
        setDisplayValue(Math.round(progress * to));
      },
      { duration: 1, ease: 'ease-out' }
    );
    return () => controls.stop();
  }, [to]);

  return <span className="text-4xl font-bold">{displayValue}</span>;
}
