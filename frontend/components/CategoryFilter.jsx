"use client";

import { Paintbrush, Hammer, Cpu, Layers } from "lucide-react";

export default function CategoryFilter({ 
  selectedCategory, 
  onSelectCategory, 
  counts, 
  sortOrder, 
  onSortChange,
  priceFilter,
  onPriceFilterChange
}) {
  const categories = [
    { id: "all", label: "All Works", icon: Layers, count: counts.all || 9 },
    { id: "painting", label: "Paintings", icon: Paintbrush, count: counts.painting || 3 },
    { id: "sculpture", label: "Sculptures", icon: Hammer, count: counts.sculpture || 3 },
    { id: "digital_art", label: "Digital Art", icon: Cpu, count: counts.digital_art || 3 }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "36px" }}>
      <div 
        className="category-filter-bar"
        style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          alignItems: "center", 
          justifyContent: "space-between",
          gap: "16px",
          borderBottom: "1px solid var(--border-subtle)",
          paddingBottom: "18px"
        }}
      >
        <div className="category-buttons-group" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="category-tab-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 18px",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.03em",
                  border: isActive ? "1px solid var(--gold-primary)" : "1px solid var(--border-subtle)",
                  background: isActive ? "rgba(226, 177, 112, 0.12)" : "rgba(255, 255, 255, 0.03)",
                  color: isActive ? "var(--gold-primary)" : "var(--text-secondary)",
                  transition: "var(--transition)"
                }}
              >
                <Icon size={15} />
                <span>{cat.label}</span>
                <span style={{
                  fontSize: "0.72rem",
                  padding: "1px 6px",
                  borderRadius: "999px",
                  background: isActive ? "var(--gold-primary)" : "rgba(255, 255, 255, 0.08)",
                  color: isActive ? "#0b0c10" : "var(--text-muted)",
                  fontWeight: 700
                }}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="category-selects-group" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            style={{
              background: "rgba(19, 23, 34, 0.85)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              padding: "9px 14px",
              borderRadius: "999px",
              fontSize: "0.82rem",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="curated">Curated Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="year-desc">Year: Newest</option>
          </select>

          <select
            value={priceFilter}
            onChange={(e) => onPriceFilterChange(e.target.value)}
            style={{
              background: "rgba(19, 23, 34, 0.85)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              padding: "9px 14px",
              borderRadius: "999px",
              fontSize: "0.82rem",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="all">All Values</option>
            <option value="under3000">Under $3,000</option>
            <option value="3000to7000">$3,000 - $7,000</option>
            <option value="above7000">Above $7,000</option>
          </select>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .category-buttons-group {
            width: 100% !important;
          }
          .category-tab-btn {
            flex: 1 1 calc(50% - 4px);
            justifyContent: center;
            padding: 8px 10px !important;
            font-size: 0.8rem !important;
          }
          .category-selects-group {
            width: 100% !important;
          }
          .category-selects-group select {
            flex: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
