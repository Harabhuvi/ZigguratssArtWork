"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import CategoryFilter from "../components/CategoryFilter";
import ArtworkCard from "../components/ArtworkCard";
import ArtworkModal from "../components/ArtworkModal";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import { Sparkles, Award, ShieldCheck, Compass, Truck, Lock } from "lucide-react";

const curatedArtworks = [
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
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1600&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?q=80&w=1600&auto=format&fit=crop",
    description: "A meditation on desert winds and temporal stillness rendered through layered natural mineral textures on unprimed canvas.",
    provenance: "Acquired from Sharjah Biennial Curated Pavilions.",
    certificate: true,
    palette: ["#d97706", "#92400e", "#451a03", "#fef3c7"]
  },
  {
    id: "art-08",
    title: "Torso of Chronos",
    slug: "torso-of-chronos",
    artist: "Dimitri Volkoff",
    category: "sculpture",
    categoryLabel: "Sculpture",
    medium: "Oxidized Corten Steel and Cast Glass",
    year: 2024,
    dimensions: "85 x 44 x 36 cm",
    price: 9200,
    originalPrice: 9900,
    currency: "USD",
    inStock: false,
    featured: false,
    image: "https://images.unsplash.com/photo-1569783723326-802c63c95971?q=80&w=1600&auto=format&fit=crop",
    description: "Raw industrial oxidation meets translucent cyan optical glass, expressing the collision between classical ruin and modern glass architecture.",
    provenance: "Berlin Kunsthalle Contemporary Showcase.",
    certificate: true,
    palette: ["#78350f", "#0369a1", "#334155", "#0f172a"]
  },
  {
    id: "art-09",
    title: "Bioluminescent Singularity",
    slug: "bioluminescent-singularity",
    artist: "Zephyr & Co.",
    category: "digital_art",
    categoryLabel: "Digital Art",
    medium: "Real-time Shader Simulation with Physical Holographic Display",
    year: 2025,
    dimensions: "Variable Spatial Installation + 8K Video Master",
    price: 7800,
    originalPrice: 8500,
    currency: "USD",
    inStock: true,
    featured: true,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
    description: "Deep-sea biological luminescence reimagined as mathematical manifolds that pulse in response to viewer proximity.",
    provenance: "Venice Art Biennale Digital Pavilion 2024.",
    certificate: true,
    palette: ["#0284c7", "#06b6d4", "#3b82f6", "#0f172a"]
  }
];

export default function HomePage() {
  const [artworks] = useState(curatedArtworks);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("curated");
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("ziggurat_cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (e) {}
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
      const updated = exists ? prev.filter(item => item.id !== artwork.id) : [...prev, artwork];
      try {
        localStorage.setItem("ziggurat_cart", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem("ziggurat_cart", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <>
      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={setSearchQuery}
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      <main style={{ minHeight: "100vh", paddingTop: "clamp(90px, 11vw, 125px)", paddingBottom: "80px" }}>
        <section id="gallery-section">
          <div className="container">
            <motion.div
              style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 36px auto" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
                <span className="tag-badge tag-painting" style={{ padding: "5px 14px", fontSize: "0.76rem" }}>
                  <Sparkles size={13} />
                  Curated Atelier
                </span>
              </div>

              <h1 style={{
                fontSize: "clamp(2.4rem, 4.8vw, 3.8rem)",
                color: "#fff",
                lineHeight: "1.1",
                marginBottom: "14px",
                letterSpacing: "-0.02em"
              }}>
                The Masterworks
              </h1>

              <p style={{
                color: "var(--text-secondary)",
                fontSize: "clamp(0.92rem, 1.8vw, 1.05rem)",
                lineHeight: "1.65"
              }}>
                Handcrafted canvases, tactile sculptures, and certified digital art created by leading international contemporary masters.
              </p>
            </motion.div>

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
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  textAlign: "center",
                  padding: "80px 20px",
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-subtle)"
                }}
              >
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
              </motion.div>
            ) : (
              <motion.div
                layout
                className="artworks-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, staggerChildren: 0.08 }}
              >
                <AnimatePresence mode="popLayout">
                  {filteredArtworks.map((artwork) => (
                    <motion.div
                      key={artwork.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArtworkCard
                        artwork={artwork}
                        onSelect={setSelectedArtwork}
                        onAddToCart={handleAddToCart}
                        isInCart={cartItems.some(i => i.id === artwork.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                marginTop: "clamp(60px, 8vw, 90px)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "24px"
              }}
            >
              <div style={{
                background: "rgba(19, 23, 34, 0.5)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "26px",
                display: "flex",
                gap: "16px"
              }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(226, 177, 112, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--gold-primary)",
                  flexShrink: 0
                }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "6px" }}>Authenticity & Provenance</h4>
                  <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: "1.55" }}>
                    Every masterwork includes a signed atelier Certificate of Authenticity and cryptographic blockchain registry ledger.
                  </p>
                </div>
              </div>

              <div style={{
                background: "rgba(19, 23, 34, 0.5)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "26px",
                display: "flex",
                gap: "16px"
              }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(56, 189, 248, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-cyan)",
                  flexShrink: 0
                }}>
                  <Truck size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "6px" }}>White-Glove Fine Art Transit</h4>
                  <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: "1.55" }}>
                    Climate-controlled, armored transport managed worldwide by Cadogan Tate and Hasenkamp specialized couriers.
                  </p>
                </div>
              </div>

              <div style={{
                background: "rgba(19, 23, 34, 0.5)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "26px",
                display: "flex",
                gap: "16px"
              }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "rgba(244, 63, 94, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-crimson)",
                  flexShrink: 0
                }}>
                  <Lock size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: "1.1rem", color: "#fff", marginBottom: "6px" }}>Private Vault Custody</h4>
                  <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: "1.55" }}>
                    Complimentary bonded freeport vault storage in Geneva, Zurich, and Singapore prior to private collection delivery.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer onSelectCategory={(cat) => setSelectedCategory(cat)} />

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
