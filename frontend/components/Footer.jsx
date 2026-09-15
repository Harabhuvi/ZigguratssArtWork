"use client";

import { useState } from "react";
import { ArrowRight, ShieldCheck, Award, Globe } from "lucide-react";

export default function Footer({ onSelectCategory }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer style={{ 
      background: "#06070a", 
      borderTop: "1px solid var(--border-subtle)", 
      paddingTop: "70px", 
      paddingBottom: "40px",
      marginTop: "80px"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "40px",
          marginBottom: "60px"
        }}>
          <div>
            <div style={{ fontSize: "1.6rem", letterSpacing: "0.22em", fontFamily: "var(--font-serif)", color: "#fff", marginBottom: "8px" }}>
              ZIGGURAT
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--gold-primary)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>
              International Fine Art Salon
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.7" }}>
              Curating rare oil paintings, museum-grade bronze and marble sculptures, and certified generative digital art for discerning private collections.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: "1rem", color: "#fff", letterSpacing: "0.06em", marginBottom: "16px", textTransform: "uppercase" }}>
              Curated Collections
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <button 
                  onClick={() => onSelectCategory("painting")}
                  style={{ color: "var(--text-secondary)", fontSize: "0.88rem", transition: "var(--transition)" }}
                >
                  Oil & Encaustic Paintings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory("sculpture")}
                  style={{ color: "var(--text-secondary)", fontSize: "0.88rem", transition: "var(--transition)" }}
                >
                  Marble & Bronze Sculptures
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory("digital_art")}
                  style={{ color: "var(--text-secondary)", fontSize: "0.88rem", transition: "var(--transition)" }}
                >
                  Generative & 3D Digital Editions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory("all")}
                  style={{ color: "var(--text-secondary)", fontSize: "0.88rem", transition: "var(--transition)" }}
                >
                  Masterworks Archive
                </button>
              </li>
            </ul>
          </div>

          <div id="collector-services">
            <h4 style={{ fontSize: "1rem", color: "#fff", letterSpacing: "0.06em", marginBottom: "16px", textTransform: "uppercase" }}>
              Collector Services
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={16} color="var(--gold-primary)" />
                <span>Atelier Authenticity Guarantee</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Globe size={16} color="var(--gold-primary)" />
                <span>Worldwide Secure Transit & Customs</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Award size={16} color="var(--gold-primary)" />
                <span>Private Auction Consignment</span>
              </div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: "1rem", color: "#fff", letterSpacing: "0.06em", marginBottom: "16px", textTransform: "uppercase" }}>
              Salon Gazette
            </h4>
            <p style={{ fontSize: "0.84rem", color: "var(--text-secondary)", marginBottom: "14px", lineHeight: "1.5" }}>
              Receive private vernissage previews and new artist acquisition releases.
            </p>

            {subscribed ? (
              <div style={{ color: "var(--gold-primary)", fontSize: "0.86rem", fontWeight: 500 }}>
                &bull; You are subscribed to the Salon Gazette.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "8px" }}>
                <input
                  type="email"
                  placeholder="Enter email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "999px",
                    padding: "9px 16px",
                    color: "#fff",
                    fontSize: "0.82rem",
                    outline: "none"
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "var(--gold-primary)",
                    color: "#090a0f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          paddingTop: "24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          fontSize: "0.78rem",
          color: "var(--text-muted)"
        }}>
          <div>&copy; {new Date().getFullYear()} ZIGGURAT Art Gallery. All Rights Reserved.</div>
          <div style={{ display: "flex", gap: "20px" }}>
            <span>Privacy Policy</span>
            <span>Provenance Guidelines</span>
            <span>Terms of Acquisition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
