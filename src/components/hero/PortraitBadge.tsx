"use client";

interface Props {
  imageSrc: string;
  imageAlt: string;
  overlayImageSrc?: string;
  overlayImageAlt?: string;
  showOverlay?: boolean;
  curvedText?: string;
  size?: number | string;
  ringTextColor?: string;
  bgColor?: string;
}

export function PortraitBadge({
  imageSrc,
  imageAlt,
  overlayImageSrc,
  overlayImageAlt,
  showOverlay = false,
  curvedText = "NAMASTE, I AM VARUUN REDDY",
  size = 320,
  ringTextColor = "rgba(20, 30, 60, 0.85)",
  bgColor = "rgba(20, 30, 60, 0.08)",
}: Props) {
  const reps = 3;

  return (
    <>
      <style>{`
        .portrait-badge {
          position: relative;
          display: inline-block;
          flex-shrink: 0;
          overflow: visible;
        }

        /* Background disc — must exactly match the clip circle.
           cy=0.65, r=0.35 → top=(0.65-0.35)=30%, left/right=(0.5-0.35)=15%, bottom=0 */
        .portrait-badge-disc {
          position: absolute;
          top: 30%;
          left: 15%;
          right: 15%;
          bottom: 0;
          border-radius: 50%;
          z-index: 1;
        }

        /* Rotating text ring — transform-origin must match the disc center (50% 65%)
           so the ring spins in place around the circle, not the badge center */
        .portrait-badge-ring {
          position: absolute;
          inset: 0;
          z-index: 2;
          animation: ringRotate 30s linear 2.5s infinite;
          transform-origin: 50% 65%;
          pointer-events: none;
        }
        .portrait-badge-ring svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .portrait-badge-ring { animation: none; }
        }

        /* Portrait image — full bounding box, clipped to the lollipop shape.
           The transparent image background means only the character shows in
           the rect zone above the circle. */
        .portrait-badge-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          image-rendering: pixelated;
          display: block;
          z-index: 3;
          clip-path: url(#portrait-badge-clip);
          transition: opacity 600ms ease;
        }
      `}</style>

      {/* Lollipop clip-path: rectangle (head zone) + circle (body zone) */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <clipPath id="portrait-badge-clip" clipPathUnits="objectBoundingBox">
            {/* Rect covers the head zone */}
            <rect x="0" y="0" width="1" height="0.6" />
            {/* Circle sits lower — more head shows above */}
            <circle cx="0.5" cy="0.65" r="0.35" />
          </clipPath>
        </defs>
      </svg>

      <div className="portrait-badge" style={{ width: size, height: size }}>

        {/* Background disc */}
        <div className="portrait-badge-disc" style={{ background: bgColor }} />

        {/* Rotating text ring */}
        <div className="portrait-badge-ring">
          <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" overflow="visible" style={{ overflow: "visible" }}>
            <defs>
              {/* Ring centered on the disc: disc center ≈ (150,195) in 300×300 viewBox,
                  radius 114 = disc radius 105 + ~10px clearance for text */}
              <path
                id="portrait-ring-path"
                d="M 150,195 m -114,0 a 114,114 0 1,1 228,0 a 114,114 0 1,1 -228,0"
                fill="none"
              />
            </defs>
            <text>
              <textPath
                href="#portrait-ring-path"
                startOffset="0"
                textLength="716"
                lengthAdjust="spacing"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  letterSpacing: "0.12em",
                  fill: ringTextColor,
                  transition: "fill 700ms ease",
                } as React.CSSProperties}
              >
                {Array.from({ length: reps }).flatMap((_, i) => [
                  <tspan key={`star-${i}`} style={{ fontSize: "13px" }}>★</tspan>,
                  <tspan key={`text-${i}`} style={{ fontSize: "8px" }}>{` ${curvedText} `}</tspan>,
                ])}
              </textPath>
            </text>
          </svg>
        </div>

        {/* Character image — clipped to lollipop shape */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="portrait-badge-image"
          style={{ opacity: showOverlay ? 0 : 1 }}
        />
        {overlayImageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={overlayImageSrc}
            alt={overlayImageAlt ?? ""}
            className="portrait-badge-image"
            style={{ opacity: showOverlay ? 1 : 0 }}
          />
        )}

      </div>
    </>
  );
}
