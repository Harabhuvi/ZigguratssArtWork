"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Eye, ShoppingBag, Check, ZoomIn, ShieldCheck } from "lucide-react";

export default function ArtworkCard({ artwork, onSelect, onAddToCart, isInCart }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 220 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["9deg", "-9deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-9deg", "9deg"]);

  const [glareState, setGlareState] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    setGlareState({
      x: Math.round((mouseX / width) * 100),
      y: Math.round((mouseY / height) * 100),
      opacity: 0.28
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    setGlareState((prev) => ({ ...prev, opacity: 0 }));
  };

  const getCategoryClass = (cat) => {
    if (cat === "painting") return "tag-painting";
    if (cat === "sculpture") return "tag-sculpture";
    if (cat === "digital_art") return "tag-digital_art";
    return "";
  };

  return (
    <div style={{ perspective: "1100px" }}>
      <motion.article
        ref={cardRef}
        className="artwork-card"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(artwork)}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          position: "relative",
          cursor: "pointer",
          willChange: "transform"
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            pointerEvents: "none",
            zIndex: 4,
            background: `radial-gradient(circle 280px at ${glareState.x}% ${glareState.y}%, rgba(255, 255, 255, ${glareState.opacity}), transparent 70%)`,
            transition: "opacity 0.2s ease"
          }}
        />

        <div className="artwork-image-wrap" style={{ position: "relative", overflow: "hidden" }}>
          <img
            src={artwork.image}
            alt={artwork.title}
            className="artwork-image"
            onLoad={() => setImgLoaded(true)}
            style={{
              opacity: imgLoaded ? 1 : 0.3,
              transition: "opacity 0.6s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: isHovered ? "scale(1.08)" : "scale(1.01)"
            }}
          />

          <div
            style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              display: "flex",
              gap: "7px",
              zIndex: 3,
              flexWrap: "wrap",
              pointerEvents: "none"
            }}
          >
            <span className={`tag-badge ${getCategoryClass(artwork.category)}`}>
              {artwork.categoryLabel}
            </span>
            {artwork.featured && (
              <motion.span
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(226, 177, 112, 0.4)",
                    "0 0 0 8px rgba(226, 177, 112, 0)",
                    "0 0 0 0 rgba(226, 177, 112, 0)"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "4px 11px",
                  borderRadius: "999px",
                  background: "var(--gold-primary)",
                  color: "#090a0f",
                  whiteSpace: "nowrap"
                }}
              >
                Curator Pick
              </motion.span>
            )}
          </div>

          <div
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              zIndex: 3,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? "scale(1)" : "scale(0.85)",
              transition: "opacity 0.25s ease, transform 0.25s ease"
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: "rgba(9, 10, 15, 0.82)",
                backdropFilter: "blur(12px)",
                border: "1px solid var(--border-active)",
                borderRadius: "999px",
                padding: "5px 11px",
                fontSize: "0.72rem",
                color: "var(--gold-primary)",
                fontWeight: 600
              }}
            >
              <ZoomIn size={12} />
              <span>Inspect Loupe</span>
            </div>
          </div>

          <div
            className="card-hover-overlay"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(9, 10, 15, 0.96) 0%, rgba(9, 10, 15, 0.4) 50%, transparent 100%)",
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.25s ease",
              display: "flex",
              alignItems: "flex-end",
              padding: "16px",
              zIndex: 3
            }}
          >
            <div style={{ width: "100%", display: "flex", gap: "10px" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(artwork);
                }}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "11px 16px",
                  borderRadius: "999px",
                  background: "rgba(226, 177, 112, 0.18)",
                  backdropFilter: "blur(12px)",
                  color: "#fff",
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  border: "1px solid var(--gold-primary)",
                  minHeight: "44px",
                  cursor: "pointer",
                  transition: "background 0.2s, transform 0.2s"
                }}
              >
                <Eye size={15} color="var(--gold-primary)" />
                <span>Inspect Masterwork</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(artwork);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: isInCart ? "var(--gold-primary)" : "rgba(255, 255, 255, 0.12)",
                  color: isInCart ? "#090a0f" : "#fff",
                  border: "1px solid var(--border-subtle)",
                  transition: "var(--transition)",
                  flexShrink: 0,
                  cursor: "pointer"
                }}
                title={isInCart ? "In acquisition list" : "Add to collection inquiry"}
              >
                {isInCart ? <Check size={18} /> : <ShoppingBag size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: "18px 20px 22px 20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px", gap: "8px" }}>
              <h3 style={{ fontSize: "1.25rem", color: "#f8fafc", fontWeight: 500, lineHeight: "1.2" }}>
                {artwork.title}
              </h3>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", flexShrink: 0 }}>
                {artwork.year}
              </span>
            </div>

            <p style={{ fontSize: "0.9rem", color: "var(--gold-primary)", marginBottom: "6px", fontWeight: 500 }}>
              {artwork.artist}
            </p>

            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.45" }}>
              {artwork.medium}
            </p>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "14px",
            borderTop: "1px solid rgba(255, 255, 255, 0.07)",
            gap: "8px"
          }}>
            <div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                Acquisition Value
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
                ${artwork.price.toLocaleString()} <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400 }}>USD</span>
              </div>
            </div>

            <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--gold-primary)", fontSize: "0.78rem", fontWeight: 600 }}>
              <ShieldCheck size={14} />
              <span>Certified</span>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
