"use client";
import { useEffect, useRef } from "react";

// Converts r,g,b (0-255) → hue in degrees (0-360)
function hue(r: number, g: number, b: number): number {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (d === 0) return 0;
  let h = 0;
  if (max === r)      h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else                h = (r - g) / d + 4;
  return (h / 6) * 360;
}

function lightness(r: number, g: number, b: number): number {
  return (Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 255;
}

// Recolours the GymTrainerVaruun sprite via canvas pixel manipulation:
//   jacket  (green/teal hue, h 80–200°) → yellow palette (#ffcc00 family)
//   trousers (blue hue, h 200–270°)     → near-black palette
export default function GymTrainerSprite({ height = 140 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.src = "/GymTrainerVaruun.png";
    img.onload = () => {
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
        if (a < 10) continue;

        const h = hue(r, g, b);
        const l = lightness(r, g, b);

        if (h >= 80 && h <= 200 && l > 0.12 && l < 0.9) {
          // Jacket → yellow family: keep relative brightness so shading survives
          const shade = l; // 0..1
          d[i]     = Math.round(Math.min(255, 80  + shade * 210)); // R
          d[i + 1] = Math.round(Math.min(255, 60  + shade * 180)); // G
          d[i + 2] = Math.round(Math.max(0,   -20 + shade * 40));  // B
        } else if (h >= 195 && h <= 275 && l > 0.08 && l < 0.72) {
          // Trousers → near-black, very slight cool tint
          const shade = l * 0.35; // compress to very dark range
          d[i]     = Math.round(shade * 180);
          d[i + 1] = Math.round(shade * 180);
          d[i + 2] = Math.round(shade * 200);
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Varuun — Gym Leader"
      style={{ height, width: "auto", imageRendering: "pixelated", display: "block" }}
    />
  );
}
