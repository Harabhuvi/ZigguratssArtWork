import { Router } from "express";
import { artworks } from "../data/artworks.js";

const router = Router();
const ordersStore = [];

router.post("/orders", (req, res) => {
  const { customerName, customerEmail, phone, shippingAddress, items, inquiryType, notes } = req.body;

  if (!customerName || !customerEmail || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Customer name, email and artwork items are required." });
  }

  const resolvedItems = items.map(item => {
    const art = artworks.find(a => a.id === item.id);
    return {
      id: item.id,
      title: art ? art.title : item.title || "Custom Piece",
      price: art ? art.price : item.price || 0,
      artist: art ? art.artist : "Gallery Master",
      category: art ? art.category : "art"
    };
  });

  const totalAmount = resolvedItems.reduce((sum, item) => sum + item.price, 0);

  const newOrder = {
    orderId: "ORD-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(Math.random() * 1000),
    customerName,
    customerEmail,
    phone: phone || "",
    shippingAddress: shippingAddress || "",
    inquiryType: inquiryType || "acquisition",
    notes: notes || "",
    items: resolvedItems,
    totalAmount,
    currency: "USD",
    status: "confirmed",
    createdAt: new Date().toISOString()
  };

  ordersStore.push(newOrder);

  res.status(201).json({
    message: "Art acquisition request received successfully. Our curator will contact you shortly.",
    order: newOrder
  });
});

router.get("/orders/:id", (req, res) => {
  const order = ordersStore.find(o => o.orderId === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order inquiry not found." });
  }
  res.json(order);
});

export default router;
