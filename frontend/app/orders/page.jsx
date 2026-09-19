"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CartDrawer from "../../components/CartDrawer";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  Calendar,
  CreditCard,
  Copy,
  Check
} from "lucide-react";

const initialOrders = [
  {
    orderId: "ZIG-8942-CH",
    date: "January 18, 2025",
    status: "in_transit",
    statusLabel: "White-Glove Courier In Transit",
    estimatedDelivery: "January 24, 2025",
    courier: "Cadogan Tate Fine Art Logistics (Geneva Hub)",
    trackingCode: "CT-FA-94021-SWISS",
    deliveryAddress: "7 Rue du Rhône, Private Vault Suite 4B, Geneva, Switzerland",
    paymentMethod: "VIP Private Banking Wire (Settled)",
    items: [
      {
        id: "art-01",
        title: "Celestial Resonance",
        artist: "Aurelia Vance",
        medium: "Oil and Gold Leaf on Linen",
        price: 4800,
        image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop",
        certificateNumber: "CERT-ZIG-2025-0811"
      }
    ],
    totalAmount: 4800
  },
  {
    orderId: "ZIG-7719-NY",
    date: "December 02, 2024",
    status: "delivered",
    statusLabel: "Delivered & Inspected by Atelier Agent",
    estimatedDelivery: "Delivered December 08, 2024",
    courier: "Hasenkamp Specialized Fine Art Freight",
    trackingCode: "HK-EXP-38102-VAULT",
    deliveryAddress: "7 Rue du Rhône, Private Vault Suite 4B, Geneva, Switzerland",
    paymentMethod: "Amex Centurion Private Card (Approved)",
    items: [
      {
        id: "art-02",
        title: "Fractured Monolith IV",
        artist: "Julian Thorne",
        medium: "Cast Bronze and Black Marquina Marble",
        price: 8900,
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop",
        certificateNumber: "CERT-ZIG-2024-4902"
      }
    ],
    totalAmount: 8900
  },
  {
    orderId: "ZIG-6530-LON",
    date: "October 14, 2024",
    status: "delivered",
    statusLabel: "Delivered to Private Vault",
    estimatedDelivery: "Delivered October 20, 2024",
    courier: "Hedley's Fine Art Transport International",
    trackingCode: "HD-SEC-11930-UK",
    deliveryAddress: "St. Moritz Mountain Residence Vault, Switzerland",
    paymentMethod: "Art Escrow Clearinghouse (Completed)",
    items: [
      {
        id: "art-05",
        title: "Symphony of Equilibrium",
        artist: "Mateo Silva",
        medium: "Hand-Carved Carrara Marble with Titanium Rods",
        price: 11500,
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
        certificateNumber: "CERT-ZIG-2024-7128"
      }
    ],
    totalAmount: 11500
  }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeFilter, setActiveFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("ziggurat_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted = parsed.map(o => ({
            orderId: o.orderId || `ZIG-${Math.floor(Math.random() * 9000 + 1000)}`,
            date: o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Today",
            status: o.status || "processing",
            statusLabel: o.status === "in_transit" 
              ? "White-Glove Courier In Transit" 
              : o.status === "delivered" 
                ? "Delivered & Inspected" 
                : "Atelier Framing & Provenance Sealing",
            estimatedDelivery: "Estimated in 3-5 business days",
            courier: "Cadogan Tate Fine Art Logistics",
            trackingCode: `CT-${Math.floor(Math.random() * 80000 + 10000)}-EXP`,
            deliveryAddress: o.shippingAddress || "Client VIP Address On File",
            paymentMethod: o.paymentMethod || "VIP Private Settlement",
            items: (o.items || []).map(i => ({
              id: i.id,
              title: i.title || "Curated Masterwork",
              artist: i.artist || "Gallery Artist",
              medium: i.medium || "Fine Art Medium",
              price: i.price || 0,
              image: i.image || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop",
              certificateNumber: `CERT-ZIG-${Math.floor(Math.random() * 9000 + 1000)}`
            })),
            totalAmount: o.totalAmount || 0
          }));
          setOrders([...formatted, ...initialOrders]);
        }
      }
    } catch (e) {}
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredOrders = orders.filter(order => {
    if (activeFilter === "all") return true;
    if (activeFilter === "in_transit") return order.status === "in_transit";
    if (activeFilter === "processing") return order.status === "processing" || order.status === "confirmed";
    if (activeFilter === "delivered") return order.status === "delivered";
    return true;
  });

  const getStatusColor = (status) => {
    if (status === "in_transit") return "var(--accent-cyan)";
    if (status === "delivered") return "#10b981";
    return "var(--gold-primary)";
  };

  const getStatusIcon = (status) => {
    if (status === "in_transit") return <Truck size={15} />;
    if (status === "delivered") return <CheckCircle2 size={15} />;
    return <Clock size={15} />;
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
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "32px"
          }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span className="tag-badge tag-painting">
                  <Package size={13} />
                  Atelier Logistics
                </span>
                <span style={{ fontSize: "0.82rem", color: "var(--gold-primary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Insured Consignments
                </span>
              </div>
              <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", color: "#fff", lineHeight: 1.15 }}>
                Acquisition Orders & Provenance
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginTop: "4px" }}>
                Real-time climate-controlled courier tracking, atelier receipts, and physical wax seal certificates.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <Link href="/profile" className="btn-secondary" style={{ padding: "11px 22px" }}>
                Patron Dossier
              </Link>
              <Link href="/payment" className="btn-gold" style={{ padding: "11px 22px" }}>
                New Acquisition
              </Link>
            </div>
          </div>

          <div style={{
            display: "flex",
            gap: "10px",
            borderBottom: "1px solid var(--border-subtle)",
            paddingBottom: "12px",
            marginBottom: "32px",
            overflowX: "auto",
            scrollbarWidth: "none"
          }}>
            <button
              onClick={() => setActiveFilter("all")}
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "0.86rem",
                fontWeight: activeFilter === "all" ? 600 : 400,
                background: activeFilter === "all" ? "var(--gold-primary)" : "rgba(255, 255, 255, 0.04)",
                color: activeFilter === "all" ? "#090a0f" : "var(--text-secondary)",
                border: activeFilter === "all" ? "none" : "1px solid var(--border-subtle)",
                transition: "var(--transition)",
                whiteSpace: "nowrap"
              }}
            >
              All Orders ({orders.length})
            </button>

            <button
              onClick={() => setActiveFilter("in_transit")}
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "0.86rem",
                fontWeight: activeFilter === "in_transit" ? 600 : 400,
                background: activeFilter === "in_transit" ? "var(--accent-cyan)" : "rgba(255, 255, 255, 0.04)",
                color: activeFilter === "in_transit" ? "#090a0f" : "var(--text-secondary)",
                border: activeFilter === "in_transit" ? "none" : "1px solid var(--border-subtle)",
                transition: "var(--transition)",
                whiteSpace: "nowrap"
              }}
            >
              In Transit ({orders.filter(o => o.status === "in_transit").length})
            </button>

            <button
              onClick={() => setActiveFilter("delivered")}
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "0.86rem",
                fontWeight: activeFilter === "delivered" ? 600 : 400,
                background: activeFilter === "delivered" ? "#10b981" : "rgba(255, 255, 255, 0.04)",
                color: activeFilter === "delivered" ? "#090a0f" : "var(--text-secondary)",
                border: activeFilter === "delivered" ? "none" : "1px solid var(--border-subtle)",
                transition: "var(--transition)",
                whiteSpace: "nowrap"
              }}
            >
              Delivered ({orders.filter(o => o.status === "delivered").length})
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {filteredOrders.map((order) => (
              <div
                key={order.orderId}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.5)",
                  transition: "var(--transition)"
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "14px",
                  padding: "18px 24px",
                  background: "rgba(9, 10, 15, 0.7)",
                  borderBottom: "1px solid var(--border-subtle)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Acquisition Order
                      </div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", letterSpacing: "0.04em", fontFamily: "monospace" }}>
                        #{order.orderId}
                      </div>
                    </div>

                    <div style={{ borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: "16px" }}>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Date Placed
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                        {order.date}
                      </div>
                    </div>

                    <div style={{ borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: "16px" }}>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Total Settlement
                      </div>
                      <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--gold-primary)" }}>
                        ${order.totalAmount.toLocaleString()} USD
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    background: `rgba(${order.status === "in_transit" ? "56, 189, 248" : order.status === "delivered" ? "16, 185, 129" : "226, 177, 112"}, 0.12)`,
                    border: `1px solid ${getStatusColor(order.status)}`,
                    color: getStatusColor(order.status),
                    fontSize: "0.82rem",
                    fontWeight: 600
                  }}>
                    {getStatusIcon(order.status)}
                    <span>{order.statusLabel}</span>
                  </div>
                </div>

                <div style={{ padding: "24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "24px" }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "16px",
                          paddingBottom: idx !== order.items.length - 1 ? "18px" : 0,
                          borderBottom: idx !== order.items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              width: "72px",
                              height: "72px",
                              objectFit: "cover",
                              borderRadius: "10px",
                              border: "1px solid var(--border-subtle)"
                            }}
                          />
                          <div>
                            <h3 style={{ fontSize: "1.1rem", color: "#fff", fontWeight: 600 }}>{item.title}</h3>
                            <p style={{ color: "var(--gold-primary)", fontSize: "0.86rem", fontWeight: 500 }}>{item.artist}</p>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{item.medium}</p>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--gold-primary)", fontSize: "0.78rem" }}>
                              <ShieldCheck size={14} />
                              <span>{item.certificateNumber}</span>
                            </div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#fff", marginTop: "2px" }}>
                              ${item.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "16px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "10px",
                    padding: "16px",
                    marginBottom: "20px"
                  }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                        Courier & Logistics
                      </div>
                      <div style={{ fontSize: "0.86rem", color: "#fff", fontWeight: 500 }}>{order.courier}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--gold-primary)", fontFamily: "monospace" }}>
                          {order.trackingCode}
                        </span>
                        <button
                          onClick={() => handleCopy(order.trackingCode)}
                          style={{ color: "var(--text-secondary)", lineHeight: 0, padding: "2px" }}
                          title="Copy tracking code"
                        >
                          {copiedCode === order.trackingCode ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                        Vault Transit Destination
                      </div>
                      <div style={{ fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                        {order.deliveryAddress}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>
                        Status / ETA
                      </div>
                      <div style={{ fontSize: "0.86rem", color: "#fff", fontWeight: 500 }}>
                        {order.estimatedDelivery}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
                        Insured Transit by Lloyd's Fine Art Underwriters
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => alert(`Official cryptographic provenance receipt for #${order.orderId} prepared for download.`)}
                      className="btn-secondary"
                      style={{ padding: "9px 18px", fontSize: "0.82rem" }}
                    >
                      <Download size={14} />
                      <span>Download Atelier Receipt</span>
                    </button>

                    <button
                      onClick={() => alert(`Authenticity Certificate with red wax seal for #${order.orderId} ready for archival print.`)}
                      className="btn-secondary"
                      style={{ padding: "9px 18px", fontSize: "0.82rem" }}
                    >
                      <ShieldCheck size={14} />
                      <span>Authenticity Certificate</span>
                    </button>

                    <a
                      href={`mailto:logistics@ziggurat-atelier.com?subject=Inquiry%20Regarding%20Consignment%20${order.orderId}`}
                      className="btn-gold"
                      style={{ padding: "9px 20px", fontSize: "0.82rem" }}
                    >
                      <span>Courier Concierge</span>
                      <ChevronRight size={14} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

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
