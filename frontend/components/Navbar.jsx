"use client";

import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Search, Menu, X } from "lucide-react";

export default function Navbar({ cartCount, onOpenCart, onSearch, activeCategory, onSelectCategory }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const navLinks = [
    { id: "all", label: "All Works" },
    { id: "painting", label: "Paintings" },
    { id: "sculpture", label: "Sculptures" },
    { id: "digital_art", label: "Digital Art" }
  ];

  const linkStyle = (id) => ({
    fontSize: "0.88rem",
    letterSpacing: "0.05em",
    color: activeCategory === id ? "var(--gold-primary)" : "var(--text-secondary)",
    transition: "color 0.2s ease",
    fontWeight: activeCategory === id ? 600 : 400,
    padding: "4px 0",
    position: "relative",
    whiteSpace: "nowrap"
  });

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.35s ease",
        background: isScrolled ? "rgba(9, 10, 15, 0.94)" : "transparent",
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(20px)" : "none",
        borderBottom: isScrolled ? "1px solid rgba(226, 177, 112, 0.15)" : "1px solid transparent"
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: isScrolled ? "14px clamp(16px, 4vw, 32px)" : "22px clamp(16px, 4vw, 32px)",
          transition: "padding 0.35s ease"
        }}
      >
        <a href="#" style={{ display: "flex", flexDirection: "column", gap: "2px", flexShrink: 0 }}>
          <span style={{
            fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
            letterSpacing: "0.28em",
            fontWeight: 400,
            textTransform: "uppercase",
            fontFamily: "var(--font-serif)",
            color: "#f8fafc",
            lineHeight: 1
          }}>
            Ziggurat
          </span>
          <span style={{
            fontSize: "clamp(0.58rem, 1.2vw, 0.68rem)",
            letterSpacing: "0.22em",
            color: "var(--gold-primary)",
            textTransform: "uppercase",
            fontWeight: 600
          }}>
            Atelier &amp; Fine Art
          </span>
        </a>

        <nav
          className="desktop-nav"
          style={{
            display: "none",
            alignItems: "center",
            gap: "clamp(20px, 3vw, 36px)",
            flex: 1,
            justifyContent: "center"
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onSelectCategory(link.id)}
              style={linkStyle(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {searchOpen ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid var(--border-active)",
              borderRadius: "999px",
              padding: "7px 14px",
              transition: "var(--transition)"
            }}>
              <Search size={15} color="var(--gold-primary)" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search artworks, artists..."
                value={searchVal}
                onChange={handleSearchChange}
                onKeyDown={(e) => { if (e.key === "Escape") { setSearchOpen(false); setSearchVal(""); if (onSearch) onSearch(""); } }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "0.84rem",
                  outline: "none",
                  width: "clamp(140px, 20vw, 220px)"
                }}
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchVal(""); if (onSearch) onSearch(""); }}
                style={{ color: "var(--text-muted)", lineHeight: 0, padding: "2px" }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-secondary)",
                transition: "var(--transition)"
              }}
            >
              <Search size={17} />
            </button>
          )}

          <button
            onClick={onOpenCart}
            aria-label="View cart"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
              transition: "var(--transition)"
            }}
          >
            <ShoppingBag size={18} color="var(--gold-primary)" />
            {cartCount > 0 && (
              <span style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "var(--gold-primary)",
                color: "#0b0c10",
                fontSize: "0.7rem",
                fontWeight: 700,
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)"
              }}>
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            aria-label="Toggle menu"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              color: "#f8fafc",
              borderRadius: "50%",
              background: mobileMenuOpen ? "rgba(226, 177, 112, 0.1)" : "transparent",
              border: mobileMenuOpen ? "1px solid var(--border-active)" : "1px solid transparent",
              transition: "var(--transition)"
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid var(--border-active)",
          padding: "20px clamp(16px, 4vw, 32px)",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          animation: "slideUp 0.2s ease-out"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "999px",
            padding: "10px 16px",
            marginBottom: "12px"
          }}>
            <Search size={15} color="var(--gold-primary)" />
            <input
              type="text"
              placeholder="Search artworks, artists..."
              value={searchVal}
              onChange={handleSearchChange}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "0.9rem",
                outline: "none",
                flex: 1
              }}
            />
          </div>

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { onSelectCategory(link.id); setMobileMenuOpen(false); }}
              style={{
                textAlign: "left",
                fontSize: "1.05rem",
                color: activeCategory === link.id ? "var(--gold-primary)" : "#fff",
                padding: "12px 4px",
                fontWeight: activeCategory === link.id ? 600 : 400,
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                transition: "color 0.2s ease"
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
