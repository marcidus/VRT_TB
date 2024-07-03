import React, { useEffect } from 'react';
import { gsap } from 'gsap';

const ExampleComponent: React.FC = () => {
  useEffect(() => {
    gsap.to('.animate-me', { x: 100, duration: 1 });
  }, []);

  return <div className="animate-me"></div>;
};

export default ExampleComponent;
