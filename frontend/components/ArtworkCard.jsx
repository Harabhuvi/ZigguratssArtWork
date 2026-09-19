"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, ShoppingBag, Check } from "lucide-react";

export default function ArtworkCard({ artwork, onSelect, onAddToCart, isInCart }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [tapped, setTapped] = useState(false);

  const getCategoryClass = (cat) => {
    if (cat === "painting") return "tag-painting";
    if (cat === "sculpture") return "tag-sculpture";
    if (cat === "digital_art") return "tag-digital_art";
    return "";
  };

  const handleCardTap = () => {
    setTapped((prev) => !prev);
  };

  return (
    <motion.article
      className="artwork-card"
      onClick={handleCardTap}
      whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }}
      viewport={{ once: true, margin: "-40px" }}
    >
      <div className="artwork-image-wrap">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="artwork-image"
          onLoad={() => setImgLoaded(true)}
          style={{
            opacity: imgLoaded ? 1 : 0.4,
            transition: "opacity 0.6s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        />

        <div style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          display: "flex",
          gap: "6px",
          zIndex: 2,
          flexWrap: "wrap"
        }}>
          <span className={`tag-badge ${getCategoryClass(artwork.category)}`}>
            {artwork.categoryLabel}
          </span>
          {artwork.featured && (
            <span style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: "999px",
              background: "rgba(226, 177, 112, 0.9)",
              color: "#090a0f",
              whiteSpace: "nowrap"
            }}>
              Curator Pick
            </span>
          )}
        </div>

        <div
          className="card-hover-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(9, 10, 15, 0.95) 0%, rgba(9, 10, 15, 0.1) 60%, transparent 100%)",
            opacity: tapped ? 1 : 0,
            transition: "opacity 0.25s ease",
            display: "flex",
            alignItems: "flex-end",
            padding: "16px",
            zIndex: 3
          }}
        >
          <div style={{ width: "100%", display: "flex", gap: "8px" }}>
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(artwork); }}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "11px",
                borderRadius: "999px",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                color: "#fff",
                fontSize: "0.84rem",
                fontWeight: 600,
                border: "1px solid rgba(255, 255, 255, 0.2)",
                minHeight: "44px"
              }}
            >
              <Eye size={15} />
              Inspect
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(artwork); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: isInCart ? "var(--gold-primary)" : "rgba(226, 177, 112, 0.85)",
                color: "#090a0f",
                border: "none",
                transition: "var(--transition)",
                flexShrink: 0
              }}
              title={isInCart ? "In acquisition list" : "Add to collection inquiry"}
            >
              {isInCart ? <Check size={18} /> : <ShoppingBag size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "clamp(14px, 2vw, 20px)", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px", gap: "8px" }}>
            <h3 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)", color: "#f8fafc", fontWeight: 500, lineHeight: "1.25" }}>
              {artwork.title}
            </h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", flexShrink: 0 }}>
              {artwork.year}
            </span>
          </div>

          <p style={{ fontSize: "0.88rem", color: "var(--gold-primary)", marginBottom: "6px", fontWeight: 500 }}>
            {artwork.artist}
          </p>

          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "14px", lineHeight: "1.4" }}>
            {artwork.medium}
          </p>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "12px",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          gap: "8px"
        }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>
              Acquisition
            </div>
            <div style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 600, color: "#fff" }}>
              ${artwork.price.toLocaleString()}
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onSelect(artwork); }}
            style={{
              fontSize: "0.78rem",
              color: "var(--gold-primary)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              fontWeight: 600,
              padding: "8px 0",
              minHeight: "36px"
            }}
          >
            Details &rarr;
          </button>
        </div>
      </div>
    </motion.article>
  );
}
