"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ShieldCheck, 
  Maximize2, 
  ShoppingBag, 
  Check, 
  ZoomIn, 
  SunMedium, 
  Sparkles, 
  Layers, 
  Compass, 
  Award,
  Move
} from "lucide-react";

export default function ArtworkModal({ artwork, onClose, onAddToCart, isInCart }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loupeActive, setLoupeActive] = useState(true);
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50 });
  const [loupeVisible, setLoupeVisible] = useState(false);
  const [lightingPreset, setLightingPreset] = useState("natural");
  const imgContainerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleMouseMove = (e) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setLoupePos({ x, y });
  };

  const getLightingFilter = () => {
    if (lightingPreset === "warm") return "sepia(0.12) contrast(1.04) brightness(1.03)";
    if (lightingPreset === "dramatique") return "contrast(1.15) brightness(0.95) saturate(1.1)";
    return "contrast(1.02) brightness(1.0)";
  };

  if (!artwork) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 24 }}
          transition={{ type: "spring", damping: 28, stiffness: 340 }}
          style={{ maxWidth: "1140px", borderRadius: "20px", overflow: "hidden" }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(9, 10, 15, 0.85)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--border-subtle)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 30,
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
            aria-label="Close Inspection Modal"
          >
            <X size={18} />
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
            <div
              style={{
                position: "relative",
                background: "#06070a",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                minHeight: "480px",
                padding: "36px 24px"
              }}
            >
              <div
                ref={imgContainerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setLoupeVisible(true)}
                onMouseLeave={() => setLoupeVisible(false)}
                style={{
                  position: "relative",
                  display: "inline-block",
                  cursor: loupeActive ? "crosshair" : "default",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.95)"
                }}
              >
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  style={{
                    maxHeight: "68vh",
                    width: "auto",
                    maxWidth: "100%",
                    objectFit: "contain",
                    display: "block",
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: `${loupePos.x}% ${loupePos.y}%`,
                    transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    filter: getLightingFilter()
                  }}
                />

                {loupeActive && loupeVisible && zoomLevel === 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    style={{
                      position: "absolute",
                      left: `${loupePos.x}%`,
                      top: `${loupePos.y}%`,
                      width: "160px",
                      height: "160px",
                      transform: "translate(-50%, -50%)",
                      borderRadius: "50%",
                      border: "2px solid var(--gold-primary)",
                      boxShadow: "0 10px 35px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(226, 177, 112, 0.3)",
                      pointerEvents: "none",
                      backgroundImage: `url(${artwork.image})`,
                      backgroundPosition: `${loupePos.x}% ${loupePos.y}%`,
                      backgroundSize: "360%",
                      backgroundRepeat: "no-repeat",
                      zIndex: 20
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      bottom: "-22px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(9, 10, 15, 0.9)",
                      border: "1px solid var(--gold-primary)",
                      borderRadius: "999px",
                      padding: "2px 8px",
                      fontSize: "0.62rem",
                      color: "var(--gold-primary)",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      whiteSpace: "nowrap"
                    }}>
                      3.6X LOUPE
                    </div>
                  </motion.div>
                )}
              </div>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  maxWidth: "520px",
                  gap: "10px",
                  flexWrap: "wrap"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    onClick={() => { setZoomLevel(1); setLoupeActive(true); }}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: zoomLevel === 1 && loupeActive ? "var(--gold-primary)" : "rgba(255, 255, 255, 0.06)",
                      color: zoomLevel === 1 && loupeActive ? "#090a0f" : "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer"
                    }}
                  >
                    Loupe Lens
                  </button>

                  <button
                    onClick={() => { setZoomLevel(zoomLevel === 1.8 ? 1 : 1.8); setLoupeActive(false); }}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: zoomLevel > 1 ? "var(--gold-primary)" : "rgba(255, 255, 255, 0.06)",
                      color: zoomLevel > 1 ? "#090a0f" : "var(--text-secondary)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer"
                    }}
                  >
                    {zoomLevel > 1 ? "Normal Scale" : "Full Zoom 1.8X"}
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <SunMedium size={13} color="var(--gold-primary)" />
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.04em" }}>Light:</span>
                  <select
                    value={lightingPreset}
                    onChange={(e) => setLightingPreset(e.target.value)}
                    style={{
                      background: "rgba(19, 23, 34, 0.9)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-secondary)",
                      padding: "5px 10px",
                      borderRadius: "999px",
                      fontSize: "0.75rem",
                      cursor: "pointer"
                    }}
                  >
                    <option value="natural">Curatorial (4500K)</option>
                    <option value="warm">Atelier Warm (3000K)</option>
                    <option value="dramatique">Spotlight Dramatique</option>
                  </select>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "36px clamp(20px, 3.5vw, 42px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "#0d0f17",
                borderLeft: "1px solid rgba(226, 177, 112, 0.1)"
              }}
            >
              <div>
                <div style={{ display: "flex", gap: "8px", marginBottom: "14px", alignItems: "center", flexWrap: "wrap" }}>
                  <span className={`tag-badge tag-${artwork.category}`}>
                    {artwork.categoryLabel}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {artwork.year}
                  </span>
                  {artwork.certificate && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.76rem", color: "var(--gold-primary)", marginLeft: "auto" }}>
                      <ShieldCheck size={14} />
                      Signed Provenance &bull; Vault Insured
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: "clamp(2rem, 3.2vw, 2.5rem)", color: "#fff", marginBottom: "8px", lineHeight: "1.15" }}>
                  {artwork.title}
                </h2>

                <p style={{ fontSize: "1.15rem", color: "var(--gold-primary)", marginBottom: "18px", fontWeight: 500 }}>
                  {artwork.artist}
                </p>

                <p style={{ color: "var(--text-secondary)", fontSize: "0.94rem", lineHeight: "1.7", marginBottom: "26px" }}>
                  {artwork.description}
                </p>

                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "14px",
                    padding: "20px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "18px",
                    marginBottom: "28px"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" }}>
                      Medium & Support
                    </div>
                    <div style={{ fontSize: "0.88rem", color: "#fff", fontWeight: 500 }}>
                      {artwork.medium}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" }}>
                      Physical Dimensions
                    </div>
                    <div style={{ fontSize: "0.88rem", color: "#fff", fontWeight: 500 }}>
                      {artwork.dimensions}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" }}>
                      Provenance Registry
                    </div>
                    <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)" }}>
                      {artwork.provenance || "Acquired from the master atelier"}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" }}>
                      Authentication
                    </div>
                    <div style={{ fontSize: "0.84rem", color: "var(--gold-primary)", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
                      <Award size={13} />
                      <span>Cadogan Tate Vault Seal</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  paddingTop: "16px",
                  borderTop: "1px solid rgba(255, 255, 255, 0.07)"
                }}>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Acquisition Value
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", lineHeight: "1.1" }}>
                      ${artwork.price.toLocaleString()} <span style={{ fontSize: "0.86rem", color: "var(--gold-primary)", fontWeight: 500 }}>USD</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", fontSize: "0.76rem", color: "var(--text-muted)" }}>
                    <div>Includes Museum Freight</div>
                    <div style={{ color: "#10b981", fontWeight: 500 }}>In Stock & Bullion Escrow Ready</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => onAddToCart(artwork)}
                    className="btn-gold"
                    style={{ flex: 1, padding: "14px 24px", fontSize: "0.95rem", justifyContent: "center" }}
                  >
                    {isInCart ? <Check size={18} /> : <ShoppingBag size={18} />}
                    <span>{isInCart ? "Reserved in Portfolio" : "Acquire Masterwork"}</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="btn-secondary"
                    style={{ padding: "14px 20px", fontSize: "0.9rem" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
