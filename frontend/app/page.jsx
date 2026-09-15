"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import PaintingCanvasHero from "../components/PaintingCanvasHero";
import CategoryFilter from "../components/CategoryFilter";
import ArtworkCard from "../components/ArtworkCard";
import ArtworkModal from "../components/ArtworkModal";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import { Sparkles, Award, ShieldCheck, Compass } from "lucide-react";

const fallbackArtworks = [
  {
    id: "art-01",
    title: "Celestial Resonance",
    slug: "celestial-resonance",
    artist: "Aurelia Vance",
    category: "painting",
    categoryLabel: "Painting",
    medium: "Oil and Gold Leaf on Linen",
    year: 2024,
    dimensions: "120 x 95 cm",
    price: 4800,
    originalPrice: 5200,
    currency: "USD",
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop",
    description: "An evocative study in layered ultramarine and radiant gold pigments, capturing the transient luminescence of dawn over abstract horizons.",
    provenance: "Acquired directly from the artist's studio in Lyon, France.",
    certificate: true,
    palette: ["#1e293b", "#d97706", "#0f172a", "#f59e0b"]
  },
  {
    id: "art-02",
    title: "Fractured Monolith IV",
    slug: "fractured-monolith-iv",
    artist: "Julian Thorne",
    category: "sculpture",
    categoryLabel: "Sculpture",
    medium: "Cast Bronze and Black Marquina Marble",
    year: 2023,
    dimensions: "68 x 32 x 28 cm",
    price: 8900,
    originalPrice: 9500,
    currency: "USD",
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop",
    description: "A monumental juxtaposition of polished dark marble and textured patinated bronze exploring geological time and urban fragmentation.",
    provenance: "Exhibited at Biennale di Scultura 2023, Venice.",
    certificate: true,
    palette: ["#27272a", "#71717a", "#a1a1aa", "#d4d4d8"]
  },
  {
    id: "art-03",
    title: "Hyper-Synthetic Dreamscape #8",
    slug: "hyper-synthetic-dreamscape-8",
    artist: "Kaelen Chen",
    category: "digital_art",
    categoryLabel: "Digital Art",
    medium: "Generative Algorithmic Render, 8K Ultra-Edition",
    year: 2025,
    dimensions: "8192 x 8192 px / Master Archival Print",
    price: 2400,
    originalPrice: 2800,
    currency: "USD",
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    description: "Multi-layered fluid neural simulation depicting organic topologies folding into holographic quantum lattice structures.",
    provenance: "Minted on private smart contract with 1/1 Museum Archival Dibond Print.",
    certificate: true,
    palette: ["#4f46e5", "#06b6d4", "#ec4899", "#8b5cf6"]
  },
  {
    id: "art-04",
    title: "Nocturne in Ochre & Zinc",
    slug: "nocturne-in-ochre-zinc",
    artist: "Elena Rostova",
    category: "painting",
    categoryLabel: "Painting",
    medium: "Encaustic & Heavy Pigment on Birch Wood Panel",
    year: 2024,
    dimensions: "140 x 110 cm",
    price: 6200,
    originalPrice: 6700,
    currency: "USD",
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop",
    description: "Tactile impasto textures meet warm earth tones, invoking silent nocturnal spaces and the raw materiality of mineral pigments.",
    provenance: "Private collection, Zurich.",
    certificate: true,
    palette: ["#b45309", "#78350f", "#fef3c7", "#451a03"]
  },
  {
    id: "art-05",
    title: "Symphony of Equilibrium",
    slug: "symphony-of-equilibrium",
    artist: "Mateo Silva",
    category: "sculpture",
    categoryLabel: "Sculpture",
    medium: "Hand-Carved Carrara Marble with Titanium Rods",
    year: 2024,
    dimensions: "52 x 40 x 30 cm",
    price: 11500,
    originalPrice: 12500,
    currency: "USD",
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
    description: "Flowing organic curves carved from pristine white marble that appear weightless despite their dense stone mass.",
    provenance: "Carrara Atelier Invitational 2024.",
    certificate: true,
    palette: ["#f8fafc", "#e2e8f0", "#94a3b8", "#334155"]
  },
  {
    id: "art-06",
    title: "Chrono-Metropolis Zero",
    slug: "chrono-metropolis-zero",
    artist: "Sora Takahashi",
    category: "digital_art",
    categoryLabel: "Digital Art",
    medium: "Raytraced 3D Architectural Simulation & Hologram File",
    year: 2025,
    dimensions: "3D Spatial Object + 4K Infinite Loop",
    price: 3600,
    originalPrice: 4000,
    currency: "USD",
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
    description: "A futuristic speculative city hovering within infinite crystalline dusk, exploring algorithmic geometry and cybernetic architecture.",
    provenance: "Tokyo Media Arts Fellowship Exhibition.",
    certificate: true,
    palette: ["#6366f1", "#a855f7", "#3b82f6", "#1e1b4b"]
  },
  {
    id: "art-07",
    title: "Ephemeral Solitude",
    slug: "ephemeral-solitude",
    artist: "Miriam Al-Hassan",
    category: "painting",
    categoryLabel: "Painting",
    medium: "Acrylic, Charcoal, and Sand on Raw Canvas",
    year: 2023,
    dimensions: "160 x 130 cm",
    price: 5400,
    originalPrice: 5900,
    currency: "USD",
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?q=80&w=1200&auto=format&fit=crop",
    description: "Sweeping gestural brushstrokes with rich volcanic sand textures that reflect desert winds and silent meditation.",
    provenance: "Doha Contemporary Salon.",
    certificate: true,
    palette: ["#d97706", "#92400e", "#451a03", "#fef3c7"]
  },
  {
    id: "art-08",
    title: "Torso in Obsidian Flux",
    slug: "torso-in-obsidian-flux",
    artist: "Antoine Delacroix",
    category: "sculpture",
    categoryLabel: "Sculpture",
    medium: "Smoked Cast Glass & Forged Iron",
    year: 2024,
    dimensions: "75 x 35 x 25 cm",
    price: 7800,
    originalPrice: 8400,
    currency: "USD",
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1569783723326-802c63c95971?q=80&w=1200&auto=format&fit=crop",
    description: "Translucent smoked glass reflecting subtle lighting shifts throughout the day, grounded by an industrial forged base.",
    provenance: "Galerie Moderne, Brussels.",
    certificate: true,
    palette: ["#18181b", "#27272a", "#52525b", "#a1a1aa"]
  },
  {
    id: "art-09",
    title: "Biomorphic Synthesis 01",
    slug: "biomorphic-synthesis-01",
    artist: "Dr. Freja Lindqvist",
    category: "digital_art",
    categoryLabel: "Digital Art",
    medium: "Cellular Automata Generative Visuals (GLSL / 60fps Loop)",
    year: 2025,
    dimensions: "Interactive Canvas File + 4K Display Master",
    price: 1950,
    originalPrice: 2300,
    currency: "USD",
    inStock: true,
    featured: false,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    description: "Living mathematical equations reacting gently to ambient sound, mimicking coral reef growth and bioluminescence.",
    provenance: "Nordic Digital Art Biennale.",
    certificate: true,
    palette: ["#10b981", "#06b6d4", "#3b82f6", "#064e3b"]
  }
];

export default function HomePage() {
  const [artworks, setArtworks] = useState(fallbackArtworks);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("curated");
  const [priceFilter, setPriceFilter] = useState("all");
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    fetch(`${apiUrl}/artworks`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data && data.data.length > 0) {
          setArtworks(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const counts = useMemo(() => {
    return {
      all: artworks.length,
      painting: artworks.filter(a => a.category === "painting").length,
      sculpture: artworks.filter(a => a.category === "sculpture").length,
      digital_art: artworks.filter(a => a.category === "digital_art").length
    };
  }, [artworks]);

  const filteredArtworks = useMemo(() => {
    let list = [...artworks];

    if (selectedCategory !== "all") {
      list = list.filter(art => art.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(art =>
        art.title.toLowerCase().includes(q) ||
        art.artist.toLowerCase().includes(q) ||
        art.medium.toLowerCase().includes(q)
      );
    }

    if (priceFilter === "under3000") {
      list = list.filter(art => art.price < 3000);
    } else if (priceFilter === "3000to7000") {
      list = list.filter(art => art.price >= 3000 && art.price <= 7000);
    } else if (priceFilter === "above7000") {
      list = list.filter(art => art.price > 7000);
    }

    if (sortOrder === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "year-desc") {
      list.sort((a, b) => b.year - a.year);
    }

    return list;
  }, [artworks, selectedCategory, searchQuery, priceFilter, sortOrder]);

  const handleAddToCart = (artwork) => {
    setCartItems(prev => {
      const exists = prev.some(item => item.id === artwork.id);
      if (exists) {
        return prev.filter(item => item.id !== artwork.id);
      } else {
        return [...prev, artwork];
      }
    });
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const scrollToGallery = () => {
    const el = document.getElementById("gallery-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={setSearchQuery}
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToGallery();
        }}
      />

      <main>
        <PaintingCanvasHero onExploreArt={scrollToGallery} />

        <section id="gallery-section" style={{ paddingTop: "40px", paddingBottom: "80px" }}>
          <div className="container">
            <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 40px auto" }}>
              <span className="tag-badge tag-painting" style={{ marginBottom: "12px" }}>
                Curated Atelier
              </span>
              <h2 style={{ fontSize: "2.8rem", color: "#fff", lineHeight: "1.15", marginBottom: "14px" }}>
                The Masterworks
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.98rem", lineHeight: "1.6" }}>
                Handcrafted canvases, tactile sculptures, and certified digital art created by leading international contemporary masters.
              </p>
            </div>

            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              counts={counts}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              priceFilter={priceFilter}
              onPriceFilterChange={setPriceFilter}
            />

            {filteredArtworks.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "80px 20px",
                background: "var(--bg-card)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)"
              }}>
                <h3 style={{ fontSize: "1.4rem", color: "#fff", marginBottom: "8px" }}>No works matching your selection</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "20px" }}>
                  Adjust your search or reset the filters to discover additional gallery pieces.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                    setPriceFilter("all");
                  }}
                  className="btn-secondary"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div 
                className="artworks-responsive-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "24px"
                }}
              >
                {filteredArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    onSelect={setSelectedArtwork}
                    onAddToCart={handleAddToCart}
                    isInCart={cartItems.some(i => i.id === artwork.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section style={{ padding: "70px 0", background: "rgba(17, 19, 26, 0.6)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "12px", 
                  background: "rgba(226, 177, 112, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--gold-primary)",
                  flexShrink: 0
                }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "6px" }}>Certificate of Authenticity</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    Every physical painting and sculpture includes an atelier-signed certificate of provenance with security seal.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "12px", 
                  background: "rgba(56, 189, 248, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-cyan)",
                  flexShrink: 0
                }}>
                  <Award size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "6px" }}>Museum Provenance</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    Selected artists have works exhibited across prestigious biennales, private foundations, and international salons.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "12px", 
                  background: "rgba(244, 63, 94, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-crimson)",
                  flexShrink: 0
                }}>
                  <Compass size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", color: "#fff", marginBottom: "6px" }}>Private Advisory</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    Our curatorial directors assist corporate collectors and private estates with custom commissions and framing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onSelectCategory={(cat) => { setSelectedCategory(cat); scrollToGallery(); }} />

      <ArtworkModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onAddToCart={handleAddToCart}
        isInCart={selectedArtwork ? cartItems.some(i => i.id === selectedArtwork.id) : false}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
      />
    </>
  );
}
