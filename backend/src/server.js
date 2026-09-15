import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import artworksRouter from "./routes/artworks.js";
import ordersRouter from "./routes/orders.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const apiPrefix = process.env.API_PREFIX || "/api";

app.use(cors({
  origin: [clientOrigin, "http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));

app.use(express.json());

app.use(apiPrefix, artworksRouter);
app.use(apiPrefix, ordersRouter);

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Artwork Gallery API running on http://localhost:${port}`);
});
