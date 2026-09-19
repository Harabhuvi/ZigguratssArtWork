"use client";

import { Paintbrush, Hammer, Cpu, Layers, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
  counts,
  sortOrder,
  onSortChange,
  priceFilter,
  onPriceFilterChange
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = [
    { id: "all", label: "All Works", icon: Layers, count: counts.all || 9 },
    { id: "painting", label: "Paintings", icon: Paintbrush, count: counts.painting || 3 },
    { id: "sculpture", label: "Sculptures", icon: Hammer, count: counts.sculpture || 3 },
    { id: "digital_art", label: "Digital Art", icon: Cpu, count: counts.digital_art || 3 }
  ];

  const selectStyle = {
    background: "rgba(19, 23, 34, 0.9)",
    border: "1px solid var(--border-subtle)",
    color: "var(--text-secondary)",
    padding: "9px 14px",
    borderRadius: "999px",
    fontSize: "0.82rem",
    outline: "none",
    cursor: "pointer",
    flex: 1
  };

  return (
    <div style={{ marginBottom: "36px" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        marginBottom: "14px"
      }}>
        <div className="category-chips-scroll">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 18px",
                  borderRadius: "999px",
                  fontSize: "0.85rem",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.02em",
                  border: isActive ? "1px solid var(--gold-primary)" : "1px solid var(--border-subtle)",
                  background: isActive ? "rgba(226, 177, 112, 0.12)" : "rgba(255, 255, 255, 0.03)",
                  color: isActive ? "var(--gold-primary)" : "var(--text-secondary)",
                  transition: "var(--transition)",
                  whiteSpace: "nowrap",
                  minHeight: "40px",
                  flexShrink: 0
                }}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
                <span style={{
                  fontSize: "0.7rem",
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

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "9px 16px",
            borderRadius: "999px",
            fontSize: "0.82rem",
            fontWeight: 500,
            border: filtersOpen ? "1px solid var(--gold-primary)" : "1px solid var(--border-subtle)",
            background: filtersOpen ? "rgba(226, 177, 112, 0.1)" : "rgba(255, 255, 255, 0.03)",
            color: filtersOpen ? "var(--gold-primary)" : "var(--text-secondary)",
            transition: "var(--transition)",
            whiteSpace: "nowrap",
            minHeight: "40px",
            flexShrink: 0
          }}
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
        </button>
      </div>

      {filtersOpen && (
        <div style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          padding: "16px",
          background: "rgba(19, 23, 34, 0.6)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-md)",
          marginBottom: "4px",
          animation: "fadeIn 0.2s ease-out"
        }}>
          <select value={sortOrder} onChange={(e) => onSortChange(e.target.value)} style={selectStyle}>
            <option value="curated">Curated Order</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="year-desc">Year: Newest First</option>
          </select>
          <select value={priceFilter} onChange={(e) => onPriceFilterChange(e.target.value)} style={selectStyle}>
            <option value="all">All Values</option>
            <option value="under3000">Under $3,000</option>
            <option value="3000to7000">$3,000 – $7,000</option>
            <option value="above7000">Above $7,000</option>
          </select>
          {(sortOrder !== "curated" || priceFilter !== "all") && (
            <button
              onClick={() => { onSortChange("curated"); onPriceFilterChange("all"); }}
              style={{
                padding: "9px 16px",
                borderRadius: "999px",
                fontSize: "0.8rem",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                background: "rgba(244, 63, 94, 0.08)",
                color: "#f43f5e",
                whiteSpace: "nowrap",
                transition: "var(--transition)"
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      <div style={{ height: "1px", background: "var(--border-subtle)" }} />
    </div>
  );
}
