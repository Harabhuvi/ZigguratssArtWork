"use client";

import { useRef, useEffect, useState } from "react";
import { Sparkles, RefreshCw, Palette, ArrowRight, Play, Pause } from "lucide-react";

export default function PaintingCanvasHero({ onExploreArt }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [artistAction, setArtistAction] = useState("Artist applying underglaze...");
  const [currentPaintColor, setCurrentPaintColor] = useState("#e2b170");

  const paletteColors = [
    { name: "Gold Leaf", hex: "#e2b170" },
    { name: "Prussian Ultramarine", hex: "#1e40af" },
    { name: "Crimson Lake", hex: "#e11d48" },
    { name: "Raw Umber", hex: "#78350f" },
    { name: "Luminous Teal", hex: "#0d9488" }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animId;
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    const easelW = isMobile ? Math.min(width * 0.55, 240) : isTablet ? width * 0.42 : width * 0.38;
    const easelH = isMobile ? Math.min(height * 0.55, 300) : height * 0.72;
    const easelX = isMobile ? width - easelW - 15 : isTablet ? width * 0.52 : width * 0.58;
    const easelY = isMobile ? height * 0.32 : height * 0.12;

    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = easelW;
    offscreenCanvas.height = easelH;
    const offCtx = offscreenCanvas.getContext("2d");

    const initOffscreenCanvas = () => {
      offCtx.fillStyle = "#12141d";
      offCtx.fillRect(0, 0, easelW, easelH);

      const imgData = offCtx.getImageData(0, 0, easelW, easelH);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const grain = (Math.random() - 0.5) * 16;
        d[i] = Math.min(255, Math.max(0, d[i] + grain));
        d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + grain));
        d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + grain));
      }
      offCtx.putImageData(imgData, 0, 0);

      const wash = offCtx.createLinearGradient(0, 0, easelW, easelH);
      wash.addColorStop(0, "rgba(226, 177, 112, 0.08)");
      wash.addColorStop(0.5, "rgba(30, 64, 175, 0.06)");
      wash.addColorStop(1, "rgba(225, 29, 72, 0.08)");
      offCtx.fillStyle = wash;
      offCtx.fillRect(0, 0, easelW, easelH);
    };

    initOffscreenCanvas();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
      initBackground();
    };

    window.addEventListener("resize", handleResize);

    const initBackground = () => {
      ctx.fillStyle = "#08090e";
      ctx.fillRect(0, 0, width, height);

      const lampGrad = ctx.createRadialGradient(
        easelX + easelW * 0.5,
        easelY * 0.5,
        20,
        easelX + easelW * 0.5,
        easelY + easelH * 0.5,
        Math.max(width, height) * 0.7
      );
      lampGrad.addColorStop(0, "rgba(226, 177, 112, 0.14)");
      lampGrad.addColorStop(0.5, "rgba(226, 177, 112, 0.03)");
      lampGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = lampGrad;
      ctx.fillRect(0, 0, width, height);
    };

    const paintingScript = [
      {
        desc: "Laying base ultramarine background wash...",
        color: "rgba(30, 64, 175, 0.45)",
        width: isMobile ? 26 : 44,
        pts: [
          { x: easelW * 0.1, y: easelH * 0.2 },
          { x: easelW * 0.5, y: easelH * 0.15 },
          { x: easelW * 0.9, y: easelH * 0.28 }
        ]
      },
      {
        desc: "Sweeping warm amber oil foundation...",
        color: "rgba(120, 53, 15, 0.5)",
        width: isMobile ? 22 : 38,
        pts: [
          { x: easelW * 0.85, y: easelH * 0.8 },
          { x: easelW * 0.45, y: easelH * 0.65 },
          { x: easelW * 0.15, y: easelH * 0.75 }
        ]
      },
      {
        desc: "Blending rich crimson lake strokes...",
        color: "rgba(225, 29, 72, 0.5)",
        width: isMobile ? 18 : 30,
        pts: [
          { x: easelW * 0.2, y: easelH * 0.45 },
          { x: easelW * 0.55, y: easelH * 0.35 },
          { x: easelW * 0.8, y: easelH * 0.55 }
        ]
      },
      {
        desc: "Sculpting radiant gold leaf horizon...",
        color: "rgba(226, 177, 112, 0.8)",
        width: isMobile ? 14 : 24,
        pts: [
          { x: easelW * 0.15, y: easelH * 0.55 },
          { x: easelW * 0.35, y: easelH * 0.4 },
          { x: easelW * 0.65, y: easelH * 0.45 },
          { x: easelW * 0.88, y: easelH * 0.3 }
        ]
      },
      {
        desc: "Adding thick impasto highlights...",
        color: "rgba(255, 245, 210, 0.9)",
        width: isMobile ? 10 : 16,
        pts: [
          { x: easelW * 0.3, y: easelH * 0.42 },
          { x: easelW * 0.48, y: easelH * 0.38 },
          { x: easelW * 0.72, y: easelH * 0.32 }
        ]
      },
      {
        desc: "Applying verdigris atmospheric glaze...",
        color: "rgba(13, 148, 136, 0.5)",
        width: isMobile ? 16 : 28,
        pts: [
          { x: easelW * 0.85, y: easelH * 0.2 },
          { x: easelW * 0.5, y: easelH * 0.5 },
          { x: easelW * 0.2, y: easelH * 0.35 }
        ]
      },
      {
        desc: "Finishing calligraphic signature filament...",
        color: "rgba(226, 177, 112, 0.95)",
        width: isMobile ? 5 : 8,
        pts: [
          { x: easelW * 0.65, y: easelH * 0.85 },
          { x: easelW * 0.78, y: easelH * 0.83 },
          { x: easelW * 0.88, y: easelH * 0.86 }
        ]
      }
    ];

    let strokeIdx = 0;
    let progress = 0;
    let lastOffPoint = null;
    let brushTipCanvasX = easelX + easelW * 0.3;
    let brushTipCanvasY = easelY + easelH * 0.4;

    const drawEaselStructure = () => {
      ctx.save();
      ctx.strokeStyle = "#271c14";
      ctx.lineWidth = isMobile ? 8 : 14;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(easelX + easelW * 0.5, easelY - (isMobile ? 20 : 40));
      ctx.lineTo(easelX - (isMobile ? 15 : 30), easelY + easelH + (isMobile ? 40 : 80));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(easelX + easelW * 0.5, easelY - (isMobile ? 20 : 40));
      ctx.lineTo(easelX + easelW + (isMobile ? 15 : 30), easelY + easelH + (isMobile ? 40 : 80));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(easelX + easelW * 0.5, easelY - (isMobile ? 25 : 50));
      ctx.lineTo(easelX + easelW * 0.5, easelY + easelH + (isMobile ? 45 : 90));
      ctx.stroke();

      ctx.strokeStyle = "#3a2a1d";
      ctx.lineWidth = isMobile ? 10 : 18;
      ctx.beginPath();
      ctx.moveTo(easelX - (isMobile ? 18 : 35), easelY + easelH + 4);
      ctx.lineTo(easelX + easelW + (isMobile ? 18 : 35), easelY + easelH + 4);
      ctx.stroke();

      ctx.restore();
    };

    const drawPainterMan = (targetX, targetY) => {
      ctx.save();

      const painterScale = isMobile ? 0.65 : 1;
      const painterX = easelX - (isMobile ? 42 : 70);
      const painterY = easelY + easelH * 0.5;

      ctx.fillStyle = "#07080b";
      ctx.beginPath();
      ctx.moveTo(painterX - 35 * painterScale, painterY + 160 * painterScale);
      ctx.lineTo(painterX - 25 * painterScale, painterY + 80 * painterScale);
      ctx.lineTo(painterX + 15 * painterScale, painterY + 80 * painterScale);
      ctx.lineTo(painterX + 30 * painterScale, painterY + 160 * painterScale);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#11141e";
      ctx.beginPath();
      ctx.moveTo(painterX - 42 * painterScale, painterY + 85 * painterScale);
      ctx.lineTo(painterX - 28 * painterScale, painterY - 35 * painterScale);
      ctx.lineTo(painterX + 28 * painterScale, painterY - 35 * painterScale);
      ctx.lineTo(painterX + 38 * painterScale, painterY + 85 * painterScale);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#1a1e2d";
      ctx.beginPath();
      ctx.moveTo(painterX - 20 * painterScale, painterY - 20 * painterScale);
      ctx.lineTo(painterX + 18 * painterScale, painterY - 20 * painterScale);
      ctx.lineTo(painterX + 24 * painterScale, painterY + 75 * painterScale);
      ctx.lineTo(painterX - 24 * painterScale, painterY + 75 * painterScale);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#d4a373";
      ctx.beginPath();
      ctx.arc(painterX - 2 * painterScale, painterY - 55 * painterScale, 20 * painterScale, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1c1815";
      ctx.beginPath();
      ctx.ellipse(painterX - 4 * painterScale, painterY - 65 * painterScale, 24 * painterScale, 12 * painterScale, -0.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(painterX - 35 * painterScale, painterY + 30 * painterScale);
      ctx.rotate(-0.25);
      ctx.fillStyle = "#4a3319";
      ctx.beginPath();
      ctx.ellipse(0, 0, 32 * painterScale, 22 * painterScale, 0, 0, Math.PI * 2);
      ctx.fill();

      const blobColors = ["#e2b170", "#1e40af", "#e11d48", "#78350f", "#0d9488"];
      blobColors.forEach((c, idx) => {
        const bx = (-20 + idx * 10) * painterScale;
        const by = (-8 + Math.sin(idx) * 6) * painterScale;
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(bx, by, 4 * painterScale, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      const shoulderX = painterX + 16 * painterScale;
      const shoulderY = painterY - 22 * painterScale;

      const armDx = targetX - shoulderX;
      const armDy = targetY - shoulderY;
      const armDist = Math.hypot(armDx, armDy);
      const midAngle = Math.atan2(armDy, armDx) - 0.25;
      const elbowX = shoulderX + Math.cos(midAngle) * (armDist * 0.52);
      const elbowY = shoulderY + Math.sin(midAngle) * (armDist * 0.52);

      const handX = targetX - 35 * painterScale;
      const handY = targetY + 10 * painterScale;

      ctx.strokeStyle = "#1a1e2d";
      ctx.lineWidth = isMobile ? 9 : 15;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(shoulderX, shoulderY);
      ctx.lineTo(elbowX, elbowY);
      ctx.lineTo(handX, handY);
      ctx.stroke();

      ctx.fillStyle = "#d4a373";
      ctx.beginPath();
      ctx.arc(handX, handY, 6 * painterScale, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#854d0e";
      ctx.lineWidth = isMobile ? 2.5 : 4;
      ctx.beginPath();
      ctx.moveTo(handX - 12 * painterScale, handY + 5 * painterScale);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      ctx.fillStyle = currentPaintColor;
      ctx.beginPath();
      ctx.ellipse(targetX, targetY, 4 * painterScale, 3 * painterScale, Math.atan2(armDy, armDx), 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawBristles = (p1, p2, bWidth, color) => {
      offCtx.save();
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.hypot(dx, dy) || 1;
      const nx = -dy / dist;
      const ny = dx / dist;

      offCtx.lineCap = "round";

      const count = isMobile ? 8 : 12;
      for (let i = 0; i < count; i++) {
        const offset = (i / (count - 1) - 0.5) * bWidth;
        const jitter = (Math.random() - 0.5) * (bWidth * 0.15);
        const actual = offset + jitter;

        offCtx.beginPath();
        offCtx.moveTo(p1.x + nx * actual, p1.y + ny * actual);
        offCtx.lineTo(p2.x + nx * actual, p2.y + ny * actual);
        offCtx.strokeStyle = color;
        offCtx.lineWidth = Math.max(1.2, bWidth / count);
        offCtx.stroke();
      }

      offCtx.restore();
    };

    const getBezierPt = (pts, t) => {
      const segs = pts.length - 1;
      const seg = Math.min(Math.floor(t * segs), segs - 1);
      const localT = t * segs - seg;
      const p0 = pts[seg];
      const p1 = pts[seg + 1];
      return {
        x: p0.x + (p1.x - p0.x) * localT,
        y: p0.y + (p1.y - p0.y) * localT
      };
    };

    const render = () => {
      initBackground();

      drawEaselStructure();

      if (isPlaying && strokeIdx < paintingScript.length) {
        const stroke = paintingScript[strokeIdx];
        setArtistAction(stroke.desc);
        setCurrentPaintColor(stroke.color);

        progress += isMobile ? 0.018 : 0.012;

        if (progress <= 1) {
          const offPt = getBezierPt(stroke.pts, progress);
          brushTipCanvasX = easelX + offPt.x;
          brushTipCanvasY = easelY + offPt.y;

          if (lastOffPoint) {
            drawBristles(lastOffPoint, offPt, stroke.width, stroke.color);
          }
          lastOffPoint = offPt;
        } else {
          progress = 0;
          lastOffPoint = null;
          strokeIdx++;
        }
      } else if (strokeIdx >= paintingScript.length) {
        setArtistAction("Masterpiece Complete • Master Painter resting brush");
        brushTipCanvasX = easelX - 10;
        brushTipCanvasY = easelY + easelH * 0.55;
      }

      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.85)";
      ctx.shadowBlur = isMobile ? 20 : 35;
      ctx.shadowOffsetX = isMobile ? 6 : 12;
      ctx.shadowOffsetY = isMobile ? 8 : 16;
      ctx.drawImage(offscreenCanvas, easelX, easelY, easelW, easelH);

      ctx.strokeStyle = "rgba(226, 177, 112, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(easelX, easelY, easelW, easelH);
      ctx.restore();

      drawPainterMan(brushTipCanvasX, brushTipCanvasY);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setTimeout(() => {
      setIsPlaying(true);
    }, 60);
  };

  return (
    <section style={{ position: "relative", paddingTop: "90px", paddingBottom: "40px", overflow: "hidden" }}>
      <div className="container">
        <div className="paint-canvas-container" style={{ position: "relative", borderRadius: "20px", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              zIndex: 1
            }}
          />

          <div
            className="artist-status-pill"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(9, 10, 15, 0.88)",
              backdropFilter: "blur(14px)",
              border: "1px solid var(--border-active)",
              borderRadius: "999px",
              padding: "6px 14px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
              maxWidth: "calc(100% - 32px)"
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: currentPaintColor, flexShrink: 0 }} />
            <span style={{ fontSize: "0.78rem", color: "#f8fafc", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {artistAction}
            </span>
          </div>

          <div
            className="hero-overlay-content"
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "36px 24px",
              minHeight: "580px",
              pointerEvents: "none",
              background: "linear-gradient(to right, rgba(9, 10, 15, 0.95) 0%, rgba(9, 10, 15, 0.72) 50%, rgba(9, 10, 15, 0.2) 80%, rgba(9, 10, 15, 0.75) 100%)"
            }}
          >
            <div style={{ maxWidth: "560px", pointerEvents: "auto", marginTop: "24px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                <span className="tag-badge tag-painting">
                  <Sparkles size={13} />
                  Live Atelier Studio
                </span>
                <span style={{ fontSize: "0.74rem", color: "var(--gold-primary)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Fine Art &bull; Sculptures &bull; Editions
                </span>
              </div>

              <h1 style={{
                fontSize: "clamp(2.1rem, 5vw, 4.2rem)",
                lineHeight: "1.08",
                marginBottom: "18px",
                fontWeight: 300,
                color: "#ffffff"
              }}>
                Witness the Master <br />
                <span className="gold-gradient-text" style={{ fontStyle: "italic", fontWeight: 400 }}>
                  Paint Live at Easel.
                </span>
              </h1>

              <p style={{
                fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                lineHeight: "1.7",
                color: "var(--text-secondary)",
                marginBottom: "30px",
                maxWidth: "460px"
              }}>
                Watch our studio master paint original oil canvases stroke by stroke. Collect authenticated paintings, hand-carved sculptures, and certified digital art.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                <button
                  onClick={onExploreArt}
                  className="btn-gold"
                  style={{ minWidth: "180px" }}
                >
                  Acquire Masterworks
                  <ArrowRight size={17} />
                </button>

                <button
                  onClick={handleReset}
                  className="btn-secondary"
                  title="Watch Painter Restart Painting"
                >
                  <RefreshCw size={16} />
                  Restart Painting
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="btn-secondary"
                  style={{ width: "44px", height: "44px", padding: 0 }}
                  title={isPlaying ? "Pause Artist" : "Resume Artist"}
                >
                  {isPlaying ? <Pause size={17} /> : <Play size={17} />}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "14px",
                pointerEvents: "auto",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                paddingTop: "16px",
                marginTop: "24px"
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
                <Palette size={16} color="var(--gold-primary)" />
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  Painter's palette:
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  {paletteColors.map((color) => (
                    <div
                      key={color.hex}
                      title={color.name}
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        backgroundColor: color.hex,
                        border: "1px solid rgba(255, 255, 255, 0.3)"
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                Authentic kinetic artist simulation
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .hero-overlay-content {
            padding: 24px 16px !important;
          }
          .artist-status-pill {
            top: 10px !important;
            right: 10px !important;
            font-size: 0.72rem !important;
          }
        }
      `}</style>
    </section>
  );
}
