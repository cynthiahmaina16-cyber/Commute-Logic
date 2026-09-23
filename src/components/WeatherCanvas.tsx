import React, { useEffect, useRef } from 'react';

interface WeatherCanvasProps {
  isRaining: boolean;
}

export const WeatherCanvas: React.FC<WeatherCanvasProps> = ({ isRaining }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 300);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const dropCount = isRaining ? 70 : 0;
    const drops = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 15 + 8,
      speed: Math.random() * 6 + 6,
      opacity: Math.random() * 0.4 + 0.15,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isRaining) {
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 1.2;

        for (let i = 0; i < dropCount; i++) {
          const d = drops[i];
          ctx.beginPath();
          ctx.globalAlpha = d.opacity;
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 2, d.y + d.len);
          ctx.stroke();

          d.y += d.speed;
          d.x -= 0.6; // gentle wind slant

          if (d.y > height) {
            d.y = -10;
            d.x = Math.random() * (width + 50);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isRaining]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      aria-hidden="true"
    />
  );
};
