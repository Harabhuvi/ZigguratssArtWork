"use client";

import { useEffect, useState } from "react";
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
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
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
                maxWidth: "100%",
                maxHeight: isZoomed ? "115%" : "440px",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8)",
                cursor: "zoom-in",
                transition: "transform 0.4s ease"
              }}
              onClick={() => setIsZoomed(!isZoomed)}
            />

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                background: "rgba(9, 10, 15, 0.85)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "999px",
                padding: "6px 14px",
                fontSize: "0.75rem",
                color: "var(--gold-primary)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backdropFilter: "blur(10px)"
              }}
            >
              <Maximize2 size={13} />
              {isZoomed ? "Reset" : "Zoom"}
            </button>
          </div>

          <div 
            className="modal-info-pane"
            style={{ 
              padding: "32px 28px", 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "space-between",
              background: "#0f111a"
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span className="tag-badge tag-painting">
                  {artwork.categoryLabel}
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  Ref: {artwork.id.toUpperCase()}
                </span>
              </div>

              <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", color: "#fff", lineHeight: "1.15", marginBottom: "6px" }}>
                {artwork.title}
              </h2>

              <div style={{ fontSize: "1rem", color: "var(--gold-primary)", marginBottom: "16px", fontWeight: 500 }}>
                {artwork.artist}, {artwork.year}
              </div>

              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.65", marginBottom: "20px" }}>
                {artwork.description}
              </p>

              <div 
                className="modal-meta-grid"
                style={{ 
                  background: "rgba(255, 255, 255, 0.02)", 
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "20px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "12px"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Medium</div>
                  <div style={{ fontSize: "0.84rem", color: "#f8fafc", fontWeight: 500 }}>{artwork.medium}</div>
                </div>

                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Dimensions</div>
                  <div style={{ fontSize: "0.84rem", color: "#f8fafc", fontWeight: 500 }}>{artwork.dimensions}</div>
                </div>

                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Provenance</div>
                  <div style={{ fontSize: "0.82rem", color: "#f8fafc" }}>{artwork.provenance}</div>
                </div>

                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Authenticity</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--gold-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <ShieldCheck size={15} /> Atelier Verified
                  </div>
                </div>
              </div>

              {artwork.palette && (
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
                    Pigment Spectrum
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {artwork.palette.map((color, idx) => (
                      <div 
                        key={idx}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "6px",
                          background: color,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                          border: "1px solid rgba(255,255,255,0.2)"
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div 
              className="modal-action-bar"
              style={{ 
                borderTop: "1px solid rgba(255, 255, 255, 0.08)", 
                paddingTop: "20px",
                display: "flex",
                flexWrap: "wrap",
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
      </div>
    </div>
  );
}
