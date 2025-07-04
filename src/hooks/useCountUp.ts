import { useState, useEffect } from 'react';

interface UseCountUpProps {
  end: number;
  duration?: number;
  delay?: number;
  trigger?: boolean;
}

export const useCountUp = ({ end, duration = 2000, delay = 0, trigger = true }: UseCountUpProps) => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    
    const timer = setTimeout(() => {
      setIsAnimating(true);
      const startTime = Date.now();
      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOut * end);
        
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [end, duration, delay, trigger]);

  return { count, isAnimating };
};