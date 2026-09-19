"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Maximize2, ShoppingBag, Check } from "lucide-react";

export default function ArtworkModal({ artwork, onClose, onAddToCart, isInCart }) {
  const [isZoomed, setIsZoomed] = useState(false);

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
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.12)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              transition: "var(--transition)"
            }}
            aria-label="Close Inspection Modal"
          >
            <X size={18} />
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr" }} className="modal-grid">
            <div style={{ 
              position: "relative", 
              background: "#08090d", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              overflow: "hidden",
              padding: "20px"
            }}>
              <img
                src={artwork.image}
                alt={artwork.title}
                style={{
                  maxHeight: "72vh",
                  width: "auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                  borderRadius: "8px",
                  cursor: isZoomed ? "zoom-out" : "zoom-in",
                  transform: isZoomed ? "scale(1.4)" : "scale(1)",
                  transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              <button
                onClick={() => setIsZoomed(!isZoomed)}
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "16px",
                  background: "rgba(9, 10, 15, 0.8)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "999px",
                  padding: "6px 12px",
                  color: "#fff",
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Maximize2 size={13} />
                <span>{isZoomed ? "Normal View" : "Enlarge Inspection"}</span>
              </button>
            </div>

            <div style={{
              padding: "32px clamp(20px, 3vw, 36px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              background: "#0f111a"
            }} className="modal-info-pane">
              <div>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px", alignItems: "center" }}>
                  <span className={`tag-badge tag-${artwork.category}`}>
                    {artwork.categoryLabel}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {artwork.year}
                  </span>
                  {artwork.certificate && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "var(--gold-primary)", marginLeft: "auto" }}>
                      <ShieldCheck size={14} />
                      Signed Provenance
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.3rem)", color: "#fff", marginBottom: "6px", lineHeight: "1.2" }}>
                  {artwork.title}
                </h2>

                <p style={{ fontSize: "1.1rem", color: "var(--gold-primary)", marginBottom: "18px", fontWeight: 500 }}>
                  {artwork.artist}
                </p>

                <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: "1.7", marginBottom: "24px" }}>
                  {artwork.description}
                </p>

                <div style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                  marginBottom: "24px"
                }}>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Medium
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#f8fafc", marginTop: "2px" }}>
                      {artwork.medium}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Dimensions
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#f8fafc", marginTop: "2px" }}>
                      {artwork.dimensions}
                    </div>
                  </div>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Provenance
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {artwork.provenance}
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className="modal-action-bar"
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  paddingTop: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Acquisition Valuation
                  </div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 600, color: "#fff", fontFamily: "var(--font-serif)" }}>
                    ${artwork.price.toLocaleString()} <span style={{ fontSize: "0.9rem", color: "var(--gold-primary)" }}>{artwork.currency}</span>
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart(artwork)}
                  className="btn-gold"
                  style={{ padding: "12px 24px" }}
                >
                  {isInCart ? (
                    <>
                      <Check size={17} />
                      Added to Portfolio
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={17} />
                      Acquire Artwork
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
