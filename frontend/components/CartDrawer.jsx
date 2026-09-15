"use client";

import { useState } from "react";
import { X, Trash2, ShieldCheck, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onClearCart }) {
  const [collectorName, setCollectorName] = useState("");
  const [collectorEmail, setCollectorEmail] = useState("");
  const [collectorPhone, setCollectorPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!collectorName || !collectorEmail) {
      setErrorMsg("Please provide your name and email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerName: collectorName,
          customerEmail: collectorEmail,
          phone: collectorPhone,
          shippingAddress: shippingAddress,
          items: cartItems.map(item => ({ id: item.id, title: item.title, price: item.price })),
          notes: notes,
          inquiryType: "acquisition_request"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit acquisition request.");
      }

      setConfirmedOrder(data.order);
      onClearCart();
    } catch (err) {
      setErrorMsg(err.message || "Could not reach the gallery server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmedOrder(null);
    setCollectorName("");
    setCollectorEmail("");
    setCollectorPhone("");
    setShippingAddress("");
    setNotes("");
    onClose();
  };

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer-panel">
        <div style={{
          padding: "24px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div>
            <h3 style={{ fontSize: "1.4rem", color: "#fff", fontWeight: 500 }}>
              Acquisition Portfolio
            </h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {cartItems.length} {cartItems.length === 1 ? "work" : "works"} selected
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {confirmedOrder ? (
            <div style={{ textAlign: "center", padding: "40px 10px" }}>
              <div style={{ 
                width: "64px", 
                height: "64px", 
                borderRadius: "50%", 
                background: "rgba(226, 177, 112, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px auto",
                color: "var(--gold-primary)"
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h4 style={{ fontSize: "1.6rem", color: "#fff", marginBottom: "8px" }}>
                Acquisition Registered
              </h4>

              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "20px" }}>
                Thank you, {confirmedOrder.customerName}. Your private acquisition dossier has been assigned to our Chief Curator.
              </p>

              <div style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "24px",
                textAlign: "left"
              }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Dossier Reference</div>
                <div style={{ fontSize: "0.92rem", color: "var(--gold-primary)", fontWeight: 600, marginBottom: "8px" }}>
                  {confirmedOrder.orderId}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Valuation Total</div>
                <div style={{ fontSize: "1.1rem", color: "#fff", fontWeight: 600 }}>
                  ${confirmedOrder.totalAmount.toLocaleString()} USD
                </div>
              </div>

              <button
                onClick={handleReset}
                className="btn-gold"
                style={{ width: "100%" }}
              >
                Return to Gallery
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "1rem", marginBottom: "12px" }}>Your collection inquiry is empty.</p>
              <p style={{ fontSize: "0.85rem" }}>Explore paintings, sculptures, and digital editions to begin your collection.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {cartItems.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "14px",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "10px",
                    padding: "12px"
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "72px",
                      height: "72px",
                      objectFit: "cover",
                      borderRadius: "6px"
                    }}
                  />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h4 style={{ fontSize: "1rem", color: "#fff", fontWeight: 500 }}>{item.title}</h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--gold-primary)" }}>{item.artist}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#fff" }}>
                        ${item.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        style={{ color: "#ef4444", padding: "4px" }}
                        title="Remove piece"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <form onSubmit={handleSubmitInquiry} style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--gold-primary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Collector Acquisition Details
                </div>

                {errorMsg && (
                  <div style={{ padding: "10px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#fca5a5", fontSize: "0.8rem" }}>
                    {errorMsg}
                  </div>
                )}

                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={collectorName}
                  onChange={(e) => setCollectorName(e.target.value)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "8px",
                    padding: "11px 14px",
                    color: "#fff",
                    fontSize: "0.86rem",
                    outline: "none"
                  }}
                />

                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={collectorEmail}
                  onChange={(e) => setCollectorEmail(e.target.value)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "8px",
                    padding: "11px 14px",
                    color: "#fff",
                    fontSize: "0.86rem",
                    outline: "none"
                  }}
                />

                <input
                  type="tel"
                  placeholder="Phone / WhatsApp (Optional)"
                  value={collectorPhone}
                  onChange={(e) => setCollectorPhone(e.target.value)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "8px",
                    padding: "11px 14px",
                    color: "#fff",
                    fontSize: "0.86rem",
                    outline: "none"
                  }}
                />

                <textarea
                  placeholder="Delivery Address / Private Vault Location (Optional)"
                  rows={2}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "8px",
                    padding: "11px 14px",
                    color: "#fff",
                    fontSize: "0.86rem",
                    outline: "none",
                    resize: "none"
                  }}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold"
                  style={{ width: "100%", marginTop: "10px", padding: "14px" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      Request Acquisition &bull; ${total.toLocaleString()} USD
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {!confirmedOrder && cartItems.length > 0 && (
          <div style={{
            padding: "20px 24px",
            borderTop: "1px solid var(--border-subtle)",
            background: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.78rem",
            color: "var(--text-muted)"
          }}>
            <ShieldCheck size={18} color="var(--gold-primary)" />
            <span>White-glove insured delivery with certified authenticity documentation.</span>
          </div>
        )}
      </aside>
    </>
  );
}
