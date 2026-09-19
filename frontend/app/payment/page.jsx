"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";
import {
  ShieldCheck,
  CreditCard,
  Building2,
  Lock,
  Truck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2,
  AlertCircle,
  Clock,
  Layers,
  Award
} from "lucide-react";

const defaultArtwork = {
  id: "art-01",
  title: "Celestial Resonance",
  artist: "Aurelia Vance",
  medium: "Oil and Gold Leaf on Linen",
  year: 2024,
  price: 4800,
  image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop"
};

export default function PaymentPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([defaultArtwork]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wire");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "Alexander von Berg",
    email: "a.vonberg@patron-atelier.ch",
    phone: "+41 22 819 4020",
    address: "7 Rue du Rhône, Private Vault Suite 4B",
    city: "Geneva",
    country: "Switzerland",
    instructions: "Armed courier reception at vault lobby. Notify curator prior to arrival.",
    cardNumber: "•••• •••• •••• 8820",
    cardExpiry: "08/28",
    cardCvc: "891",
    cardHolder: "ALEXANDER VON BERG",
    wireBank: "UBS Private Banking Switzerland",
    cryptoAddress: "0x71C...39aB (USDC - Ethereum)",
    agreeTerms: true
  });

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("ziggurat_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCartItems(parsed);
        }
      }
    } catch (e) {}
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const handleSubmitAcquisition = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.address) {
      setFormErrors({ general: "Please complete all required patron and transit fields." });
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newOrder = {
        orderId: `ZIG-${Math.floor(Math.random() * 9000 + 1000)}-${formData.city.substring(0, 3).toUpperCase()}`,
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        status: "processing",
        statusLabel: "Atelier Framing & Authenticity Sealing",
        estimatedDelivery: "Estimated in 3-5 business days",
        courier: "Cadogan Tate Fine Art Logistics (White-Glove Division)",
        trackingCode: `CT-${Math.floor(Math.random() * 80000 + 10000)}-EXP`,
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.country}`,
        paymentMethod: paymentMethod === "wire" 
          ? "VIP Private Banking Wire" 
          : paymentMethod === "card" 
            ? "Centurion / Black Card" 
            : paymentMethod === "escrow"
              ? "Art Escrow Custody"
              : "Web3 Digital Treasury",
        items: cartItems,
        totalAmount: totalAmount,
        createdAt: new Date().toISOString()
      };

      try {
        const existing = JSON.parse(localStorage.getItem("ziggurat_orders") || "[]");
        localStorage.setItem("ziggurat_orders", JSON.stringify([newOrder, ...existing]));
        localStorage.removeItem("ziggurat_cart");
      } catch (e) {}

      setIsProcessing(false);
      setOrderComplete(newOrder);
    }, 2000);
  };

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
          <div style={{ marginBottom: "36px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <span className="tag-badge tag-painting">
                <Lock size={13} />
                Private Atelier Settlement
              </span>
              <span style={{ fontSize: "0.82rem", color: "var(--gold-primary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Encrypted Transaction
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fff", lineHeight: 1.15 }}>
              Masterwork Acquisition Desk
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "4px" }}>
              Confirm your transit parameters and select your bespoke fine art settlement channel.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(clamp(320px, 45vw, 680px), 1fr))",
            gap: "clamp(24px, 4vw, 44px)",
            alignItems: "start"
          }}>
            <div>
              <form onSubmit={handleSubmitAcquisition} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "clamp(20px, 3vw, 28px)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "rgba(226, 177, 112, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--gold-primary)",
                      fontWeight: 700,
                      fontSize: "0.88rem"
                    }}>
                      1
                    </div>
                    <h2 style={{ fontSize: "1.25rem", color: "#fff", fontWeight: 600 }}>
                      Patron & White-Glove Transit Details
                    </h2>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                          Full Legal Collector Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          style={{
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "8px",
                            padding: "11px 14px",
                            color: "#fff",
                            fontSize: "0.86rem",
                            outline: "none"
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                          Confidential Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          style={{
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "8px",
                            padding: "11px 14px",
                            color: "#fff",
                            fontSize: "0.86rem",
                            outline: "none"
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                          Direct Phone / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          style={{
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "8px",
                            padding: "11px 14px",
                            color: "#fff",
                            fontSize: "0.86rem",
                            outline: "none"
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                          Country of Delivery *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          style={{
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "8px",
                            padding: "11px 14px",
                            color: "#fff",
                            fontSize: "0.86rem",
                            outline: "none"
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                        Vault / Residence Delivery Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        style={{
                          width: "100%",
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid var(--border-subtle)",
                          borderRadius: "8px",
                          padding: "11px 14px",
                          color: "#fff",
                          fontSize: "0.86rem",
                          outline: "none"
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                          City / Canton *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          style={{
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "8px",
                            padding: "11px 14px",
                            color: "#fff",
                            fontSize: "0.86rem",
                            outline: "none"
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                          Special Courier Instructions
                        </label>
                        <input
                          type="text"
                          value={formData.instructions}
                          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                          placeholder="e.g. Vault reception / call ahead"
                          style={{
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "8px",
                            padding: "11px 14px",
                            color: "#fff",
                            fontSize: "0.86rem",
                            outline: "none"
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  padding: "clamp(20px, 3vw, 28px)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
                    <div style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "rgba(226, 177, 112, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--gold-primary)",
                      fontWeight: 700,
                      fontSize: "0.88rem"
                    }}>
                      2
                    </div>
                    <h2 style={{ fontSize: "1.25rem", color: "#fff", fontWeight: 600 }}>
                      Bespoke Settlement Channel
                    </h2>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "20px" }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("wire")}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: paymentMethod === "wire" ? "1px solid var(--gold-primary)" : "1px solid var(--border-subtle)",
                        background: paymentMethod === "wire" ? "rgba(226, 177, 112, 0.12)" : "rgba(255, 255, 255, 0.02)",
                        color: paymentMethod === "wire" ? "var(--gold-primary)" : "var(--text-secondary)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                        transition: "var(--transition)"
                      }}
                    >
                      <Building2 size={20} />
                      <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Bank Wire / SWIFT</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: paymentMethod === "card" ? "1px solid var(--gold-primary)" : "1px solid var(--border-subtle)",
                        background: paymentMethod === "card" ? "rgba(226, 177, 112, 0.12)" : "rgba(255, 255, 255, 0.02)",
                        color: paymentMethod === "card" ? "var(--gold-primary)" : "var(--text-secondary)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                        transition: "var(--transition)"
                      }}
                    >
                      <CreditCard size={20} />
                      <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Black Card / Amex</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("escrow")}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: paymentMethod === "escrow" ? "1px solid var(--gold-primary)" : "1px solid var(--border-subtle)",
                        background: paymentMethod === "escrow" ? "rgba(226, 177, 112, 0.12)" : "rgba(255, 255, 255, 0.02)",
                        color: paymentMethod === "escrow" ? "var(--gold-primary)" : "var(--text-secondary)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                        transition: "var(--transition)"
                      }}
                    >
                      <ShieldCheck size={20} />
                      <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Art Escrow</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("crypto")}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        border: paymentMethod === "crypto" ? "1px solid var(--gold-primary)" : "1px solid var(--border-subtle)",
                        background: paymentMethod === "crypto" ? "rgba(226, 177, 112, 0.12)" : "rgba(255, 255, 255, 0.02)",
                        color: paymentMethod === "crypto" ? "var(--gold-primary)" : "var(--text-secondary)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                        transition: "var(--transition)"
                      }}
                    >
                      <Sparkles size={20} />
                      <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Web3 Treasury</span>
                    </button>
                  </div>

                  {paymentMethod === "wire" && (
                    <div style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px"
                    }}>
                      <div style={{ fontSize: "0.82rem", color: "var(--gold-primary)", fontWeight: 600 }}>
                        Atelier Institutional Wire Clearing
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        Upon confirmation, an invoice with unique SWIFT / IBAN escrow coordinates will be encrypted and dispatched to your email for private wealth settlement.
                      </p>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        Bank: UBS Switzerland AG &bull; Clearing Code: ZIGGURAT-SWISS-01
                      </div>
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                          Card Number (Visa Infinite / Centurion / Black Card)
                        </label>
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                          style={{
                            width: "100%",
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "8px",
                            padding: "11px 14px",
                            color: "#fff",
                            fontSize: "0.86rem",
                            outline: "none",
                            fontFamily: "monospace"
                          }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={formData.cardExpiry}
                            onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                            style={{
                              width: "100%",
                              background: "rgba(255, 255, 255, 0.04)",
                              border: "1px solid var(--border-subtle)",
                              borderRadius: "8px",
                              padding: "11px 14px",
                              color: "#fff",
                              fontSize: "0.86rem",
                              outline: "none"
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px" }}>
                            Security Code (CVC)
                          </label>
                          <input
                            type="password"
                            value={formData.cardCvc}
                            onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                            style={{
                              width: "100%",
                              background: "rgba(255, 255, 255, 0.04)",
                              border: "1px solid var(--border-subtle)",
                              borderRadius: "8px",
                              padding: "11px 14px",
                              color: "#fff",
                              fontSize: "0.86rem",
                              outline: "none"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "escrow" && (
                    <div style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "8px",
                      padding: "16px"
                    }}>
                      <div style={{ fontSize: "0.82rem", color: "var(--gold-primary)", fontWeight: 600, marginBottom: "6px" }}>
                        Third-Party Fine Art Escrow Guarantee
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        Acquisition funds are locked in an independent Swiss fiduciary escrow account until you or your certified art inspector physically inspects and approves the masterwork.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "crypto" && (
                    <div style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--border-subtle)",
                      borderRadius: "8px",
                      padding: "16px"
                    }}>
                      <div style={{ fontSize: "0.82rem", color: "var(--accent-cyan)", fontWeight: 600, marginBottom: "6px" }}>
                        Direct Web3 Settlement (USDC / ETH)
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "8px" }}>
                        Instant on-chain verification with non-fungible provenance token minted to your custody wallet.
                      </p>
                      <div style={{ fontSize: "0.78rem", color: "var(--gold-primary)", fontFamily: "monospace" }}>
                        Settlement Treasury: 0x89F1...B492 (Multi-Sig Curatorial Vault)
                      </div>
                    </div>
                  )}
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "14px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--border-subtle)"
                }}>
                  <input
                    type="checkbox"
                    id="agree"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    style={{ width: "18px", height: "18px", accentColor: "var(--gold-primary)" }}
                  />
                  <label htmlFor="agree" style={{ fontSize: "0.8rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                    I agree to the Ziggurat Atelier Acquisition Protocols, Provenance Security Terms, and insured transit custody guidelines.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-gold"
                  style={{ width: "100%", padding: "16px", fontSize: "0.95rem" }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Authorizing Atelier Acquisition...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Authorize Acquisition Settlement (${totalAmount.toLocaleString()} USD)</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div>
              <div style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "24px",
                position: "sticky",
                top: "100px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
              }}>
                <h3 style={{ fontSize: "1.2rem", color: "#fff", fontWeight: 600, marginBottom: "18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>Acquisition Portfolio</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--gold-primary)", fontWeight: 500 }}>
                    {cartItems.length} Piece{cartItems.length > 1 ? "s" : ""}
                  </span>
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
                  {cartItems.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.92rem", color: "#fff", fontWeight: 600 }}>{item.title}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--gold-primary)" }}>{item.artist}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{item.medium || "Curated Edition"}</div>
                      </div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#fff" }}>
                        ${item.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  paddingTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <span>Masterworks Subtotal</span>
                    <span style={{ color: "#fff" }}>${totalAmount.toLocaleString()} USD</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <span>Climate-Controlled Courier</span>
                    <span style={{ color: "#10b981", fontWeight: 500 }}>Complimentary (VIP)</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <span>Lloyd's Fine Art Insurance</span>
                    <span style={{ color: "#10b981", fontWeight: 500 }}>Covered by Atelier</span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    <span>Certificate of Provenance</span>
                    <span style={{ color: "var(--gold-primary)", fontWeight: 500 }}>Wax Seal Included</span>
                  </div>

                  <div style={{
                    borderTop: "1px solid var(--border-active)",
                    paddingTop: "14px",
                    marginTop: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline"
                  }}>
                    <span style={{ fontSize: "1rem", color: "#fff", fontWeight: 600 }}>Total Settlement</span>
                    <span style={{ fontSize: "1.5rem", color: "var(--gold-primary)", fontWeight: 700 }}>
                      ${totalAmount.toLocaleString()} USD
                    </span>
                  </div>
                </div>

                <div style={{
                  marginTop: "24px",
                  padding: "16px",
                  background: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "8px",
                  border: "1px solid var(--border-subtle)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--gold-primary)", fontSize: "0.8rem", fontWeight: 600 }}>
                    <ShieldCheck size={16} />
                    <span>Ziggurat Atelier Guarantee</span>
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    Every acquisition is cataloged in the salon ledger, accompanied by a registered certificate of provenance, and transported under strict environmental protocols.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {orderComplete && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(4, 5, 8, 0.9)",
          backdropFilter: "blur(16px)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "#0e1017",
            border: "1px solid var(--border-active)",
            borderRadius: "var(--radius-lg)",
            padding: "clamp(24px, 4vw, 40px)",
            maxWidth: "540px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(226, 177, 112, 0.2)"
          }}>
            <div style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid #10b981",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto"
            }}>
              <CheckCircle2 size={36} />
            </div>

            <div style={{ fontSize: "0.8rem", color: "var(--gold-primary)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>
              Acquisition Confirmed
            </div>

            <h2 style={{ fontSize: "1.8rem", color: "#fff", marginBottom: "10px", lineHeight: 1.2 }}>
              Masterwork Reserved
            </h2>

            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "24px" }}>
              Your acquisition has been logged in the atelier registry. Our senior curatorial director will coordinate white-glove climate transit directly with your reception.
            </p>

            <div style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "28px",
              textAlign: "left"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>Order Reference:</span>
                <span style={{ color: "var(--gold-primary)", fontWeight: 600, fontFamily: "monospace" }}>#{orderComplete.orderId}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>Settlement Total:</span>
                <span style={{ color: "#fff", fontWeight: 600 }}>${orderComplete.totalAmount.toLocaleString()} USD</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Transit Logistics:</span>
                <span style={{ color: "var(--text-secondary)" }}>{orderComplete.courier}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link href="/orders" className="btn-gold" style={{ padding: "12px 26px" }}>
                Track in Orders
                <ArrowRight size={16} />
              </Link>
              <Link href="/" className="btn-secondary" style={{ padding: "12px 22px" }}>
                Return to Gallery
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer onSelectCategory={() => {}} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
        onClearCart={() => setCartItems([])}
      />
    </>
  );
}
