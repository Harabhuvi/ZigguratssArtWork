import { Router } from "express";
import { artworks, categories } from "../data/artworks.js";

const router = Router();

router.get("/artworks", (req, res) => {
  const { category, search, minPrice, maxPrice, featured } = req.query;
  let results = [...artworks];

  if (category && category !== "all") {
    results = results.filter(art => art.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(art => 
      art.title.toLowerCase().includes(q) ||
      art.artist.toLowerCase().includes(q) ||
      art.medium.toLowerCase().includes(q)
    );
  }

  if (minPrice) {
    results = results.filter(art => art.price >= Number(minPrice));
  }

  if (maxPrice) {
    results = results.filter(art => art.price <= Number(maxPrice));
  }

  if (featured === "true") {
    results = results.filter(art => art.featured === true);
  }

  res.json({
    total: results.length,
    data: results
  });
});

router.get("/artworks/:id", (req, res) => {
  const artwork = artworks.find(art => art.id === req.params.id || art.slug === req.params.id);
  if (!artwork) {
    return res.status(404).json({ error: "Artwork not found" });
  }
  res.json(artwork);
});

router.get("/categories", (req, res) => {
  res.json(categories);
});

router.get("/featured", (req, res) => {
  const featuredWorks = artworks.filter(art => art.featured);
  res.json(featuredWorks);
});

export default router;
