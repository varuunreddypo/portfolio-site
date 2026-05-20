'use client';

import { useEffect, useRef } from 'react';

type Dir = 'up' | 'down' | 'left' | 'right';

const FW = 48, FH = 48;   // body frame px
const HW = 32, HH = 32;   // head/hair frame px

// Walk cycle: manifest WALK_ID uses columns 1→0→2
const WALK_X = [48, 0, 96];

// Body layer row per direction (S=down, W=left, E=right, N=up)
const BODY_ROW: Record<Dir, number> = { down: 0, left: 48, right: 96, up: 144 };

// Head/hair column per direction (5-frame 160px sheet: S W E N tilt)
const HEAD_COL: Record<Dir, number> = { down: 0, left: 32, right: 64, up: 96 };

// Eyes column (4-frame 128px sheet: S W E N)
const EYE_COL: Record<Dir, number> = { down: 0, left: 32, right: 64, up: 96 };

// pok4 placeholder → real colors  [fromR,fromG,fromB, toR,toG,toB]
const PALETTE: [number, number, number, number, number, number][] = [
  // skin
  [184, 248, 184,  248, 200, 168],
  [152, 232, 152,  220, 165, 128],
  [112, 216, 112,  185, 130,  90],
  // outline
  [ 85, 120,  64,   40,  25,  12],
  [ 54,  64,  48,   20,  12,   6],
  // hair → dark brown/black
  [176, 176, 248,   45,  35,  30],
  [128, 128, 240,   35,  25,  22],
  [ 72,  72, 200,   25,  18,  15],
  [ 48,  48, 112,   18,  12,  10],
  // iris → brown
  [255,   0,   0,   92,  58,  28],
  [136,  72,  72,   64,  38,  18],
  // eye white → off-white
  [  0, 255, 255,  238, 235, 250],
  [168, 216, 216,  208, 208, 230],
  // cloth0 → blue (gi body)
  [240, 128, 128,   64,  96, 220],
  [248, 176, 176,  100, 135, 240],
  [200,  72,  72,   40,  65, 175],
  [112,  48,  48,   22,  38, 115],
  // cloth1 → light gray (gi lining)
  [240, 184, 128,  210, 215, 230],
  [248, 212, 176,  228, 232, 245],
  [200, 136,  72,  170, 180, 200],
  [112,  80,  48,  115, 122, 148],
  // cloth2 → white (belt)
  [240, 240, 128,  245, 245, 245],
  [248, 248, 176,  252, 252, 252],
  [200, 200,  72,  210, 210, 210],
  [112, 112,  48,  150, 150, 150],
  // cloth3 → dark navy trim
  [184, 240, 128,   32,  52, 148],
  [212, 248, 176,   55,  80, 175],
  [136, 200,  72,   22,  38, 115],
  [ 80, 112,  48,   14,  24,  78],
];

function loadImg(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

function renderFrame(
  canvas: HTMLCanvasElement,
  imgs: HTMLImageElement[],
  dir: Dir,
  step: number,
  isMoving: boolean,
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, FW, FH);
  ctx.imageSmoothingEnabled = false;

  const [hairBack, body, outfit, head, eyes, hair] = imgs;
  const fx  = isMoving ? WALK_X[step % 3] : 0;
  const by  = BODY_ROW[dir];
  const hx  = HEAD_COL[dir];
  const ex  = EYE_COL[dir];
  const hy  = 8 + (isMoving && step % 3 === 1 ? 1 : 0); // subtle head bob

  // z-order: hair-back → body → outfit → head → eyes → hair-front
  ctx.drawImage(hairBack, hx, 0,  HW, HH, 8, hy, HW, HH);
  ctx.drawImage(body,     fx, by, FW, FH, 0,  0, FW, FH);
  ctx.drawImage(outfit,   fx, by, FW, FH, 0,  0, FW, FH);
  ctx.drawImage(head,     hx, 0,  HW, HH, 8, hy, HW, HH);
  ctx.drawImage(eyes,     ex, 0,  HW, HH, 8, hy, HW, HH);
  ctx.drawImage(hair,     hx, 0,  HW, HH, 8, hy, HW, HH);

  // Color-swap placeholder palette → real colors
  try {
    const id = ctx.getImageData(0, 0, FW, FH);
    const d = id.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 10) continue;
      const r = d[i], g = d[i + 1], b = d[i + 2];
      for (const [fr, fg, fb, tr, tg, tb] of PALETTE) {
        if (Math.abs(r - fr) < 6 && Math.abs(g - fg) < 6 && Math.abs(b - fb) < 6) {
          d[i] = tr; d[i + 1] = tg; d[i + 2] = tb;
          break;
        }
      }
    }
    ctx.putImageData(id, 0, 0);
  } catch { /* cross-origin guard */ }
}

interface Props {
  dir: Dir;
  step: number;
  isMoving: boolean;
  size: number; // display size in px (square)
}

export default function CharacterCanvas({ dir, step, isMoving, size }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgsRef   = useRef<HTMLImageElement[] | null>(null);

  // drawRef always holds a closure over the latest props — safe to call from async
  const drawRef = useRef<() => void>(() => {});
  drawRef.current = () => {
    if (imgsRef.current && canvasRef.current)
      renderFrame(canvasRef.current, imgsRef.current, dir, step, isMoving);
  };

  // Load all layers once on mount
  useEffect(() => {
    let alive = true;
    Promise.all([
      loadImg('/pok4/bases/hair-back/cowlick.png'),
      loadImg('/pok4/bases/body/average-body.png'),
      loadImg('/pok4/bases/av-outfit/gi.png'),
      loadImg('/pok4/bases/head/round-head.png'),
      loadImg('/pok4/bases/eyes/determined.png'),
      loadImg('/pok4/bases/hair/cowlick.png'),
    ]).then(imgs => {
      if (!alive) return;
      imgsRef.current = imgs;
      drawRef.current();
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  // Redraw whenever direction / step / moving changes
  useEffect(() => { drawRef.current(); }, [dir, step, isMoving]);

  return (
    <canvas
      ref={canvasRef}
      width={FW}
      height={FH}
      style={{ imageRendering: 'pixelated', width: size, height: size, display: 'block' }}
    />
  );
}
