"use client";

import { Eye, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

export default function ArtworkCard({ artwork, onSelect, onAddToCart, isInCart }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const getCategoryClass = (cat) => {
    switch (cat) {
      case "painting": return "tag-painting";
      case "sculpture": return "tag-sculpture";
      case "digital_art": return "tag-digital_art";
      default: return "";
    }
  };

  return (
    <article className="artwork-card">
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
          top: "16px",
          left: "16px",
          display: "flex",
          gap: "8px",
          zIndex: 2
        }}>
          <span className={`tag-badge ${getCategoryClass(artwork.category)}`}>
            {artwork.categoryLabel}
          </span>
          {artwork.featured && (
            <span style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: "999px",
              background: "rgba(226, 177, 112, 0.9)",
              color: "#090a0f"
            }}>
              Curator Pick
            </span>
          )}
        </div>

        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(9, 10, 15, 0.95) 0%, rgba(9, 10, 15, 0.1) 60%, transparent 100%)",
          opacity: 0,
          transition: "opacity 0.3s ease",
          display: "flex",
          alignItems: "flex-end",
          padding: "20px",
          zIndex: 3
        }}
        className="card-hover-overlay"
        >
          <div style={{ width: "100%", display: "flex", gap: "10px" }}>
            <button
              onClick={() => onSelect(artwork)}
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
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}
            >
              <Eye size={15} />
              Inspect
            </button>
            <button
              onClick={() => onAddToCart(artwork)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: isInCart ? "var(--gold-primary)" : "rgba(226, 177, 112, 0.85)",
                color: "#090a0f",
                border: "none",
                transition: "var(--transition)"
              }}
              title={isInCart ? "Already in acquisition list" : "Add to collection inquiry"}
            >
              {isInCart ? <Check size={18} /> : <ShoppingBag size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
            <h3 style={{ fontSize: "1.35rem", color: "#f8fafc", fontWeight: 500 }}>
              {artwork.title}
            </h3>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
              {artwork.year}
            </span>
          </div>

          <p style={{ fontSize: "0.88rem", color: "var(--gold-primary)", marginBottom: "8px", fontWeight: 500 }}>
            {artwork.artist}
          </p>

          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.4" }}>
            {artwork.medium}
          </p>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: "14px",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)"
        }}>
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Acquisition Price
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "#fff" }}>
              ${artwork.price.toLocaleString()} {artwork.currency}
            </div>
          </div>

          <button
            onClick={() => onSelect(artwork)}
            style={{
              fontSize: "0.8rem",
              color: "var(--gold-primary)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              fontWeight: 600,
              padding: "6px 0"
            }}
          >
            Details &rarr;
          </button>
        </div>
      </div>

      <style jsx>{`
        .artwork-card:hover .card-hover-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </article>
  );
}
