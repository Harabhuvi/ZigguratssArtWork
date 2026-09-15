"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Search, Compass, Menu, X } from "lucide-react";

export default function Navbar({ cartCount, onOpenCart, onSearch, activeCategory, onSelectCategory }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchVal);
  };

  return (
    <header 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.4s ease",
        background: isScrolled ? "rgba(9, 10, 15, 0.92)" : "transparent",
        backdropFilter: isScrolled ? "blur(18px)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(226, 177, 112, 0.15)" : "1px solid transparent",
        padding: isScrolled ? "16px 0" : "24px 0"
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
        <a href="#" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ 
            fontSize: "1.6rem", 
            letterSpacing: "0.28em", 
            fontWeight: 400,
            textTransform: "uppercase", 
            fontFamily: "var(--font-serif)",
            color: "#f8fafc"
          }}>
            Ziggurat
          </span>
          <span style={{ 
            fontSize: "0.68rem", 
            letterSpacing: "0.22em", 
            color: "var(--gold-primary)", 
            textTransform: "uppercase",
            fontWeight: 600
          }}>
            Atelier & Fine Art
          </span>
        </a>

        <nav style={{ display: "none", alignItems: "center", gap: "32px" }} className="desktop-nav">
          <button 
            onClick={() => onSelectCategory("all")}
            style={{ 
              fontSize: "0.9rem", 
              letterSpacing: "0.06em",
              color: activeCategory === "all" ? "var(--gold-primary)" : "var(--text-secondary)",
              transition: "var(--transition)",
              fontWeight: activeCategory === "all" ? 600 : 400
            }}
          >
            All Works
          </button>
          <button 
            onClick={() => onSelectCategory("painting")}
            style={{ 
              fontSize: "0.9rem", 
              letterSpacing: "0.06em",
              color: activeCategory === "painting" ? "var(--gold-primary)" : "var(--text-secondary)",
              transition: "var(--transition)",
              fontWeight: activeCategory === "painting" ? 600 : 400
            }}
          >
            Paintings
          </button>
          <button 
            onClick={() => onSelectCategory("sculpture")}
            style={{ 
              fontSize: "0.9rem", 
              letterSpacing: "0.06em",
              color: activeCategory === "sculpture" ? "var(--gold-primary)" : "var(--text-secondary)",
              transition: "var(--transition)",
              fontWeight: activeCategory === "sculpture" ? 600 : 400
            }}
          >
            Sculptures
          </button>
          <button 
            onClick={() => onSelectCategory("digital_art")}
            style={{ 
              fontSize: "0.9rem", 
              letterSpacing: "0.06em",
              color: activeCategory === "digital_art" ? "var(--gold-primary)" : "var(--text-secondary)",
              transition: "var(--transition)",
              fontWeight: activeCategory === "digital_art" ? 600 : 400
            }}
          >
            Digital Art
          </button>
          <a 
            href="#collector-services"
            style={{ 
              fontSize: "0.9rem", 
              letterSpacing: "0.06em",
              color: "var(--text-secondary)",
              transition: "var(--transition)"
            }}
          >
            Advisory
          </a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <form onSubmit={handleSearchSubmit} style={{ display: "none" }} className="search-form">
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "999px",
              padding: "8px 16px"
            }}>
              <Search size={16} color="var(--gold-primary)" />
              <input 
                type="text"
                placeholder="Search masterworks, artists..."
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  if (onSearch) onSearch(e.target.value);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "0.85rem",
                  outline: "none",
                  width: "180px"
                }}
              />
            </div>
          </form>

          <button 
            onClick={onOpenCart}
            aria-label="View Cart"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              transition: "var(--transition)"
            }}
          >
            <ShoppingBag size={19} color="var(--gold-primary)" />
            {cartCount > 0 && (
              <span style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "var(--gold-primary)",
                color: "#0b0c10",
                fontSize: "0.72rem",
                fontWeight: 700,
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.5)"
              }}>
                {cartCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              color: "#f8fafc"
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "rgba(9, 10, 15, 0.98)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-active)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "18px"
        }}>
          <button 
            onClick={() => { onSelectCategory("all"); setMobileMenuOpen(false); }}
            style={{ textAlign: "left", fontSize: "1.1rem", color: activeCategory === "all" ? "var(--gold-primary)" : "#fff", padding: "8px 0" }}
          >
            All Works
          </button>
          <button 
            onClick={() => { onSelectCategory("painting"); setMobileMenuOpen(false); }}
            style={{ textAlign: "left", fontSize: "1.1rem", color: activeCategory === "painting" ? "var(--gold-primary)" : "#fff", padding: "8px 0" }}
          >
            Paintings
          </button>
          <button 
            onClick={() => { onSelectCategory("sculpture"); setMobileMenuOpen(false); }}
            style={{ textAlign: "left", fontSize: "1.1rem", color: activeCategory === "sculpture" ? "var(--gold-primary)" : "#fff", padding: "8px 0" }}
          >
            Sculptures
          </button>
          <button 
            onClick={() => { onSelectCategory("digital_art"); setMobileMenuOpen(false); }}
            style={{ textAlign: "left", fontSize: "1.1rem", color: activeCategory === "digital_art" ? "var(--gold-primary)" : "#fff", padding: "8px 0" }}
          >
            Digital Art
          </button>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .search-form {
            display: block !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
