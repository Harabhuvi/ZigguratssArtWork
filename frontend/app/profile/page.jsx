"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";
import { 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Package, 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Check, 
  ArrowRight, 
  Sliders, 
  Crown,
  Download,
  Calendar,
  Layers
} from "lucide-react";

export default function ProfilePage() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("collection");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "Alexander von Berg",
    email: "a.vonberg@patron-atelier.ch",
    phone: "+41 22 819 4020",
    address: "7 Rue du Rhône, Private Vault Suite 4B",
    city: "Geneva",
    country: "Switzerland",
    tier: "Grand Connoisseur",
    memberSince: "October 2023",
    advisor: "Lady Vivienne Dubois (Geneva Advisory)",
    currency: "USD ($)",
    vernissageInvites: true,
    smsAlerts: true
  });

  const [acquiredArtworks] = useState([
    {
      id: "acq-01",
      title: "Celestial Resonance",
      artist: "Aurelia Vance",
      category: "Oil and Gold Leaf on Linen",
      year: 2024,
      acquisitionDate: "January 14, 2025",
      price: 4800,
      certificateId: "CERT-ZIG-2025-0811",
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop",
      status: "Vault Secured & Insured"
    },
    {
      id: "acq-02",
      title: "Fractured Monolith IV",
      artist: "Julian Thorne",
      category: "Cast Bronze and Black Marquina Marble",
      year: 2023,
      acquisitionDate: "August 22, 2024",
      price: 8900,
      certificateId: "CERT-ZIG-2024-4902",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop",
      status: "On Physical Display (Geneva Residence)"
    },
    {
      id: "acq-03",
      title: "Symphony of Equilibrium",
      artist: "Mateo Silva",
      category: "Hand-Carved Carrara Marble with Titanium Rods",
      year: 2024,
      acquisitionDate: "November 05, 2024",
      price: 11500,
      certificateId: "CERT-ZIG-2024-7128",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
      status: "Vault Secured & Insured"
    }
  ]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ziggurat_patron_profile");
      if (saved) {
        setProfileData(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem("ziggurat_patron_profile", JSON.stringify(profileData));
    } catch (e) {}
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const totalValuation = acquiredArtworks.reduce((acc, cur) => acc + cur.price, 0);

  return (
    <>
      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={() => {}}
        activeCategory=""
        onSelectCategory={() => {}}
      />

      <main style={{ minHeight: "100vh", paddingTop: "clamp(90px, 12vw, 120px)", paddingBottom: "70px" }}>
        <div className="container">
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "36px"
          }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span className="tag-badge tag-painting">
                  <Crown size={13} />
                  Private Dossier
                </span>
                <span style={{ fontSize: "0.82rem", color: "var(--gold-primary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Patron #{profileData.tier.toUpperCase()}
                </span>
              </div>
              <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", lineHeight: 1.15 }}>
                Collector Profile
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "4px" }}>
                Private art holdings, atelier provenance certificates, and acquisition settings.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/orders" className="btn-secondary" style={{ padding: "11px 22px", borderRadius: "999px" }}>
                <Package size={16} />
                <span>My Acquisitions & Orders</span>
              </Link>
              <Link href="/payment" className="btn-gold" style={{ padding: "11px 22px" }}>
                <CreditCard size={16} />
                <span>Acquisition Desk</span>
              </Link>
            </div>
          </div>

          <div style={{
            background: "linear-gradient(135deg, rgba(26, 32, 48, 0.7) 0%, rgba(17, 19, 26, 0.85) 100%)",
            border: "1px solid var(--border-active)",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(20px, 4vw, 36px)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
            marginBottom: "40px",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "28px",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #e2b170 0%, #a67c3b 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "#090a0f",
                  boxShadow: "0 0 25px rgba(226, 177, 112, 0.4)",
                  flexShrink: 0
                }}>
                  {profileData.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <h2 style={{ fontSize: "1.5rem", color: "#fff", fontWeight: 600 }}>
                      {profileData.name}
                    </h2>
                    <ShieldCheck size={18} color="var(--gold-primary)" />
                  </div>
                  <p style={{ color: "var(--gold-primary)", fontSize: "0.86rem", fontWeight: 500, marginTop: "2px" }}>
                    {profileData.tier} &bull; Member since {profileData.memberSince}
                  </p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginTop: "4px" }}>
                    {profileData.email}
                  </p>
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                background: "rgba(9, 10, 15, 0.5)",
                padding: "16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                textAlign: "center"
              }}>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Acquired
                  </div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginTop: "2px" }}>
                    {acquiredArtworks.length}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--gold-primary)" }}>Masterworks</div>
                </div>
                <div style={{ borderLeft: "1px solid var(--border-subtle)", borderRight: "1px solid var(--border-subtle)" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Valuation
                  </div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--gold-primary)", marginTop: "2px" }}>
                    ${totalValuation.toLocaleString()}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Certified Assets</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Certificates
                  </div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginTop: "2px" }}>
                    {acquiredArtworks.length}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#10b981" }}>100% Verified</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: "flex",
            gap: "12px",
            borderBottom: "1px solid var(--border-subtle)",
            marginBottom: "32px",
            overflowX: "auto",
            scrollbarWidth: "none"
          }}>
            <button
              onClick={() => setActiveTab("collection")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                fontSize: "0.92rem",
                fontWeight: activeTab === "collection" ? 600 : 400,
                color: activeTab === "collection" ? "var(--gold-primary)" : "var(--text-secondary)",
                borderBottom: activeTab === "collection" ? "2px solid var(--gold-primary)" : "2px solid transparent",
                transition: "var(--transition)"
              }}
            >
              <Layers size={16} />
              <span>Acquired Collection ({acquiredArtworks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                fontSize: "0.92rem",
                fontWeight: activeTab === "settings" ? 600 : 400,
                color: activeTab === "settings" ? "var(--gold-primary)" : "var(--text-secondary)",
                borderBottom: activeTab === "settings" ? "2px solid var(--gold-primary)" : "2px solid transparent",
                transition: "var(--transition)"
              }}
            >
              <Sliders size={16} />
              <span>Patron Settings</span>
            </button>

            <button
              onClick={() => setActiveTab("advisory")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                fontSize: "0.92rem",
                fontWeight: activeTab === "advisory" ? 600 : 400,
                color: activeTab === "advisory" ? "var(--gold-primary)" : "var(--text-secondary)",
                borderBottom: activeTab === "advisory" ? "2px solid var(--gold-primary)" : "2px solid transparent",
                transition: "var(--transition)"
              }}
            >
              <Award size={16} />
              <span>Curatorial Advisory</span>
            </button>
          </div>

          {activeTab === "collection" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(280px, 30vw, 360px), 1fr))", gap: "24px" }}>
                {acquiredArtworks.map((art) => (
                  <div
                    key={art.id}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      overflow: "hidden",
                      transition: "var(--transition)"
                    }}
                  >
                    <div style={{ position: "relative", width: "100%", height: "240px", overflow: "hidden" }}>
                      <img
                        src={art.image}
                        alt={art.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        background: "rgba(9, 10, 15, 0.85)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid var(--border-active)",
                        borderRadius: "999px",
                        padding: "4px 12px",
                        fontSize: "0.72rem",
                        color: "var(--gold-primary)",
                        fontWeight: 600
                      }}>
                        {art.status}
                      </div>
                    </div>

                    <div style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                        <h3 style={{ fontSize: "1.2rem", color: "#fff", fontWeight: 600 }}>{art.title}</h3>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{art.year}</span>
                      </div>
                      <p style={{ color: "var(--gold-primary)", fontSize: "0.88rem", fontWeight: 500, marginBottom: "8px" }}>
                        {art.artist}
                      </p>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginBottom: "16px" }}>
                        {art.category}
                      </p>

                      <div style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        marginBottom: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem" }}>
                          <span style={{ color: "var(--text-muted)" }}>Acquisition Value:</span>
                          <span style={{ color: "#fff", fontWeight: 600 }}>${art.price.toLocaleString()}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem" }}>
                          <span style={{ color: "var(--text-muted)" }}>Provenance Ref:</span>
                          <span style={{ color: "var(--gold-primary)", fontFamily: "monospace" }}>{art.certificateId}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem" }}>
                          <span style={{ color: "var(--text-muted)" }}>Date Inscribed:</span>
                          <span style={{ color: "var(--text-secondary)" }}>{art.acquisitionDate}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Certificate ${art.certificateId} downloaded with cryptographic atelier signature.`)}
                        className="btn-secondary"
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", fontSize: "0.82rem" }}
                      >
                        <Download size={14} />
                        <span>Download Certificate of Authenticity</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div style={{ maxWidth: "720px", background: "var(--bg-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "32px" }}>
              <h3 style={{ fontSize: "1.3rem", color: "#fff", marginBottom: "8px" }}>
                Patron Contact & Vault Preferences
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.86rem", marginBottom: "24px" }}>
                Updated details are directly mirrored into our private curatorial dispatch system.
              </p>

              {saveSuccess && (
                <div style={{
                  padding: "12px 18px",
                  borderRadius: "8px",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid #10b981",
                  color: "#6ee7b7",
                  fontSize: "0.86rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "20px"
                }}>
                  <Check size={16} />
                  <span>Patron profile preferences updated successfully.</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                      Full Legal / Collector Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "8px",
                        padding: "11px 14px",
                        color: "#fff",
                        fontSize: "0.88rem",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                      Direct Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "8px",
                        padding: "11px 14px",
                        color: "#fff",
                        fontSize: "0.88rem",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                      Private Telephone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "8px",
                        padding: "11px 14px",
                        color: "#fff",
                        fontSize: "0.88rem",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                      Preferred Valuation Currency
                    </label>
                    <select
                      value={profileData.currency}
                      onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
                      style={{
                        width: "100%",
                        background: "#12141d",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "8px",
                        padding: "11px 14px",
                        color: "#fff",
                        fontSize: "0.88rem",
                        outline: "none"
                      }}
                    >
                      <option value="USD ($)">USD ($) - United States Dollar</option>
                      <option value="EUR (€)">EUR (€) - Eurozone</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                      <option value="GBP (£)">GBP (£) - British Pound</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                    Private Vault / Gallery Delivery Address
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    style={{
                      width: "100%",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "8px",
                      padding: "11px 14px",
                      color: "#fff",
                      fontSize: "0.88rem",
                      outline: "none"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                      City / Canton
                    </label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "8px",
                        padding: "11px 14px",
                        color: "#fff",
                        fontSize: "0.88rem",
                        outline: "none"
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                      Country of Residence
                    </label>
                    <input
                      type="text"
                      value={profileData.country}
                      onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                      style={{
                        width: "100%",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "8px",
                        padding: "11px 14px",
                        color: "#fff",
                        fontSize: "0.88rem",
                        outline: "none"
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  padding: "16px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginTop: "6px"
                }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.86rem", color: "#f8fafc" }}>
                    <input
                      type="checkbox"
                      checked={profileData.vernissageInvites}
                      onChange={(e) => setProfileData({ ...profileData, vernissageInvites: e.target.checked })}
                      style={{ width: "16px", height: "16px", accentColor: "var(--gold-primary)" }}
                    />
                    <span>Receive VIP private vernissage invitations 48 hours prior to public drops</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.86rem", color: "#f8fafc" }}>
                    <input
                      type="checkbox"
                      checked={profileData.smsAlerts}
                      onChange={(e) => setProfileData({ ...profileData, smsAlerts: e.target.checked })}
                      style={{ width: "16px", height: "16px", accentColor: "var(--gold-primary)" }}
                    />
                    <span>Real-time courier SMS updates for climate-controlled transit</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-gold"
                  style={{ alignSelf: "flex-start", marginTop: "10px", minWidth: "200px" }}
                >
                  Save Patron Dossier
                </button>
              </form>
            </div>
          )}

          {activeTab === "advisory" && (
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "clamp(24px, 4vw, 36px)",
              maxWidth: "840px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(226, 177, 112, 0.15)",
                  border: "1px solid var(--gold-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--gold-primary)",
                  flexShrink: 0
                }}>
                  <Award size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.35rem", color: "#fff", fontWeight: 600 }}>
                    Assigned Curatorial Director
                  </h3>
                  <p style={{ color: "var(--gold-primary)", fontSize: "0.88rem" }}>
                    {profileData.advisor}
                  </p>
                </div>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: 1.7, marginBottom: "24px" }}>
                As a Grand Connoisseur Patron, you hold direct concierge access to our international curatorial panel. We facilitate museum loans, arrange private atelier studio tours with represented sculptors, and source unreleased masterworks directly from European estates.
              </p>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "32px"
              }}>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ color: "var(--gold-primary)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px" }}>
                    Private Commission
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.5 }}>
                    Commission site-specific bronze monuments or bespoke canvas formats tailored to your residence.
                  </p>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ color: "var(--accent-cyan)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px" }}>
                    Vault Storage
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.5 }}>
                    Complimentary bonded freeport storage in Geneva, Zurich, and Singapore with full Lloyd's insurance.
                  </p>
                </div>

                <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-subtle)", borderRadius: "8px", padding: "16px" }}>
                  <div style={{ color: "var(--accent-crimson)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", marginBottom: "4px" }}>
                    Tax & Customs Advisory
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.5 }}>
                    Dedicated assistance with international fine art tariff classification and museum donation credits.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <a
                  href={`mailto:curator@ziggurat-atelier.com?subject=Patron%20Consultation%20-%20${profileData.name}`}
                  className="btn-gold"
                >
                  <Mail size={16} />
                  <span>Request Curatorial Briefing</span>
                </a>
                <Link href="/orders" className="btn-secondary">
                  <Package size={16} />
                  <span>Review Active Shipments</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer onSelectCategory={() => {}} />

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
