"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Award, Globe, User, Package, CreditCard } from "lucide-react";

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

  const handleCategoryClick = (cat) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      window.location.href = `/?category=${cat}#gallery-section`;
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
            <Link href="/" style={{ display: "inline-block", textDecoration: "none" }}>
              <div style={{ fontSize: "1.6rem", letterSpacing: "0.22em", fontFamily: "var(--font-serif)", color: "#fff", marginBottom: "4px" }}>
                ZIGGURAT
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--gold-primary)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>
                International Fine Art Salon
              </p>
            </Link>
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
                  onClick={() => handleCategoryClick("painting")}
                  style={{ color: "var(--text-secondary)", fontSize: "0.88rem", transition: "var(--transition)" }}
                >
                  Oil &amp; Encaustic Paintings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick("sculpture")}
                  style={{ color: "var(--text-secondary)", fontSize: "0.88rem", transition: "var(--transition)" }}
                >
                  Marble &amp; Bronze Sculptures
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick("digital_art")}
                  style={{ color: "var(--text-secondary)", fontSize: "0.88rem", transition: "var(--transition)" }}
                >
                  Generative &amp; 3D Digital Editions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick("all")}
                  style={{ color: "var(--text-secondary)", fontSize: "0.88rem", transition: "var(--transition)" }}
                >
                  Masterworks Archive
                </button>
              </li>
            </ul>
          </div>

          <div id="collector-services">
            <h4 style={{ fontSize: "1rem", color: "#fff", letterSpacing: "0.06em", marginBottom: "16px", textTransform: "uppercase" }}>
              Patron Portal &amp; Services
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              <li>
                <Link
                  href="/profile"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "0.88rem", transition: "var(--transition)" }}
                >
                  <User size={15} color="var(--gold-primary)" />
                  <span>Patron Profile Dossier</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "0.88rem", transition: "var(--transition)" }}
                >
                  <Package size={15} color="var(--gold-primary)" />
                  <span>Acquisition Orders &amp; Tracking</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/payment"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "0.88rem", transition: "var(--transition)" }}
                >
                  <CreditCard size={15} color="var(--gold-primary)" />
                  <span>Acquisition Desk &amp; Checkout</span>
                </Link>
              </li>
              <li>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.84rem", marginTop: "4px" }}>
                  <ShieldCheck size={14} color="var(--gold-primary)" />
                  <span>Atelier Authenticity Guarantee</span>
                </div>
              </li>
            </ul>
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
                  aria-label="Subscribe"
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
            <Link href="/" style={{ color: "inherit" }}>Fine Art Salon</Link>
            <Link href="/orders" style={{ color: "inherit" }}>Provenance Ledger</Link>
            <Link href="/profile" style={{ color: "inherit" }}>Patron Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
