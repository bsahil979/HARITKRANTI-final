// Local fallback sample products used when API returns none
const products = [
  {
    _id: "local-veg-tomato-1",
    name: "Organic Tomatoes (1kg)",
    category: { name: "Vegetables" },
    price: 80,
    unit: "kg",
    images: [
      "https://images.unsplash.com/photo-1547514701-9cdcb1f5942a?q=80&w=1200&auto=format&fit=crop"
    ],
    isOrganic: true,
    createdAt: "2025-07-01"
  },
  {
    _id: "local-grain-rice-1",
    name: "Basmati Rice (5kg)",
    category: { name: "Grains" },
    price: 520,
    unit: "5kg",
    images: [
      "https://images.unsplash.com/photo-1615485737651-6cfb3f1c4d73?q=80&w=1200&auto=format&fit=crop"
    ],
    createdAt: "2025-07-02"
  },
  {
    _id: "local-veg-spinach-1",
    name: "Fresh Spinach (500g)",
    category: { name: "Vegetables" },
    price: 40,
    unit: "500g",
    images: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200&auto=format&fit=crop"
    ],
    createdAt: "2025-07-03"
  },
  {
    _id: "local-fruit-mango-1",
    name: "Alphonso Mangoes (Dozen)",
    category: { name: "Fruits" },
    price: 600,
    unit: "dozen",
    images: [
      "https://images.unsplash.com/photo-1587049352851-8d0a01f0f5fb?q=80&w=1200&auto=format&fit=crop"
    ],
    createdAt: "2025-07-04"
  },
  {
    _id: "local-grain-chickpea-1",
    name: "Desi Chickpeas (2kg)",
    category: { name: "Grains" },
    price: 220,
    unit: "2kg",
    images: [
      "https://images.unsplash.com/photo-1604908553833-90a55338183b?q=80&w=1200&auto=format&fit=crop"
    ],
    createdAt: "2025-07-05"
  },
  {
    _id: "local-veg-onion-1",
    name: "Red Onions (1kg)",
    category: { name: "Vegetables" },
    price: 45,
    unit: "kg",
    images: [
      "/red-onion.jpg"
    ],
    createdAt: "2025-07-06"
  },
  {
    _id: "local-fruit-banana-1",
    name: "Bananas (1kg)",
    category: { name: "Fruits" },
    price: 55,
    unit: "kg",
    images: [
      "/banana.jpg"
    ],
    createdAt: "2025-07-07"
  },
  {
    _id: "local-veg-carrot-1",
    name: "Carrots (1kg)",
    category: { name: "Vegetables" },
    price: 50,
    unit: "kg",
    images: [
      "/carrots.jpg"
    ],
    createdAt: "2025-07-08"
  }
];

export default products;
