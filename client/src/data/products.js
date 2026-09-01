const products = [
  {
    id: 1,
    slug: "rolex-submariner",

    title: "Rolex Submariner",

    brand: "Rolex",

    category: "Luxury Watches",

    collection: "Luxury Watches",

    badge: "Best Seller",

    price: 12999,

    oldPrice: 14999,

    rating: 4.9,

    reviews: 254,

    stock: 18,

    inStock: true,

    description:
      "Swiss automatic luxury watch with iconic design and exceptional craftsmanship.",

    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1400&auto=format&fit=crop",

    colors: ["Black", "Gold", "Silver"],

    sizes: ["38mm", "40mm", "42mm"],

    features: [
      "Swiss Automatic Movement",
      "300m Water Resistance",
      "Scratch Resistant Sapphire Crystal",
      "Luxury Stainless Steel Bracelet",
    ],

    specifications: {
      material: "316L Stainless Steel",
      movement: "Automatic",
      warranty: "5 Years",
      origin: "Switzerland",
    },
  },

  {
    id: 2,

    slug: "premium-leather-jacket",

    title: "Premium Leather Jacket",

    brand: "Gucci",

    category: "Fashion",

    collection: "Luxury Fashion",

    badge: "Trending",

    price: 599,

    oldPrice: 749,

    rating: 4.8,

    reviews: 180,

    stock: 24,

    inStock: true,

    description:
      "Premium handcrafted Italian leather jacket with timeless styling.",

    images: [
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1400&auto=format&fit=crop",

    colors: [
      "Black",
      "Brown",
      "Tan",
    ],

    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],

    features: [
      "Italian Leather",
      "Premium Stitching",
      "Luxury Fit",
      "Soft Inner Lining",
    ],

    specifications: {
      material: "Italian Leather",
      warranty: "2 Years",
      origin: "Italy",
    },
  },

  {
    id: 3,

    slug: "apple-macbook-pro",

    title: "Apple MacBook Pro",

    brand: "Apple",

    category: "Electronics",

    collection: "Premium Tech",

    badge: "Editor's Pick",

    price: 2499,

    oldPrice: 2699,

    rating: 5,

    reviews: 942,

    stock: 12,

    inStock: true,

    description:
      "Apple M3 powered professional laptop built for creators and developers.",

    images: [
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=1400&auto=format&fit=crop",

    colors: [
      "Silver",
      "Space Black",
    ],

    sizes: [
      "14-inch",
      "16-inch",
    ],

    features: [
      "Apple M3 Chip",
      "Liquid Retina XDR",
      "22 Hour Battery",
      "Thunderbolt 4",
    ],

    specifications: {
      processor: "Apple M3",
      ram: "18GB",
      storage: "512GB SSD",
      warranty: "1 Year",
    },
  },

  {
    id: 4,

    slug: "sony-wh1000xm5",

    title: "Luxury Headphones",

    brand: "Sony",

    category: "Electronics",

    collection: "Premium Audio",

    badge: "New Arrival",

    price: 799,

    oldPrice: 899,

    rating: 4.8,

    reviews: 321,

    stock: 16,

    inStock: true,

    description:
      "Premium wireless noise cancelling headphones with immersive sound.",

    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1400&auto=format&fit=crop",

    colors: [
      "Black",
      "Silver",
      "Blue",
    ],

    sizes: [],

    features: [
      "Active Noise Cancellation",
      "30 Hour Battery",
      "Hi-Res Audio",
      "Fast Charging",
    ],

    specifications: {
      battery: "30 Hours",
      connectivity: "Bluetooth 5.3",
      warranty: "2 Years",
    },
  },
    {
    id: 5,

    slug: "nike-air-jordan-1",

    title: "Nike Air Jordan 1",

    brand: "Nike",

    category: "Sneakers",

    collection: "Streetwear",

    badge: "Hot",

    price: 299,

    oldPrice: 349,

    rating: 4.9,

    reviews: 1248,

    stock: 35,

    inStock: true,

    description:
      "Legendary Air Jordan sneakers designed for everyday comfort and iconic style.",

    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600181516264-3ea807ff44b9?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1400&auto=format&fit=crop",

    colors: ["Black", "Red", "White"],

    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],

    features: [
      "Air Cushion",
      "Premium Leather",
      "Classic Design",
      "Rubber Sole",
    ],

    specifications: {
      material: "Leather",
      warranty: "1 Year",
      origin: "Vietnam",
    },
  },

  {
    id: 6,

    slug: "rayban-aviator",

    title: "Ray-Ban Aviator",

    brand: "Ray-Ban",

    category: "Sunglasses",

    collection: "Accessories",

    badge: "Trending",

    price: 249,

    oldPrice: 299,

    rating: 4.8,

    reviews: 520,

    stock: 42,

    inStock: true,

    description:
      "Classic aviator sunglasses with premium UV protection.",

    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1400&auto=format&fit=crop",

    colors: ["Gold", "Black"],

    sizes: ["Standard"],

    features: [
      "UV400 Protection",
      "Polarized Lens",
      "Metal Frame",
      "Lightweight",
    ],

    specifications: {
      frame: "Metal",
      lens: "Polarized",
      warranty: "2 Years",
    },
  },

  {
    id: 7,

    slug: "gucci-ophelia-bag",

    title: "Gucci Ophidia Bag",

    brand: "Gucci",

    category: "Luxury Bags",

    collection: "Luxury Bags",

    badge: "Premium",

    price: 1899,

    oldPrice: 2100,

    rating: 4.9,

    reviews: 189,

    stock: 11,

    inStock: true,

    description:
      "Luxury designer handbag crafted with signature Gucci styling.",

    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542291026-fb3b6f0f6e1d?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1400&auto=format&fit=crop",

    colors: ["Brown", "Black"],

    sizes: ["Medium"],

    features: [
      "Italian Leather",
      "Luxury Finish",
      "Gold Hardware",
      "Premium Stitching",
    ],

    specifications: {
      material: "Leather",
      warranty: "2 Years",
      origin: "Italy",
    },
  },

  {
    id: 8,

    slug: "dior-sauvage",

    title: "Dior Sauvage Perfume",

    brand: "Dior",

    category: "Perfumes",

    collection: "Luxury Fragrance",

    badge: "Popular",

    price: 189,

    oldPrice: 220,

    rating: 4.9,

    reviews: 932,

    stock: 28,

    inStock: true,

    description:
      "A bold masculine fragrance with fresh bergamot and woody notes.",

    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1400&auto=format&fit=crop",

    colors: ["100ml"],

    sizes: ["100ml"],

    features: [
      "Long Lasting",
      "Luxury Fragrance",
      "Premium Bottle",
      "Original Formula",
    ],

    specifications: {
      type: "EDP",
      volume: "100ml",
      origin: "France",
    },
  },
    {
    id: 9,

    slug: "omega-speedmaster",

    title: "Omega Speedmaster",

    brand: "Omega",

    category: "Luxury Watches",

    collection: "Luxury Watches",

    badge: "Classic",

    price: 8999,

    oldPrice: 9599,

    rating: 4.9,

    reviews: 318,

    stock: 14,

    inStock: true,

    description:
      "Legendary Swiss chronograph with timeless craftsmanship.",

    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1400&auto=format&fit=crop",

    colors: ["Black", "Silver"],

    sizes: ["40mm", "42mm"],

    features: [
      "Swiss Automatic",
      "Chronograph",
      "Sapphire Crystal",
      "Luxury Bracelet",
    ],

    specifications: {
      material: "Stainless Steel",
      warranty: "5 Years",
      movement: "Automatic",
    },
  },

  {
    id: 10,

    slug: "adidas-ultraboost",

    title: "Adidas Ultraboost",

    brand: "Adidas",

    category: "Sneakers",

    collection: "Running",

    badge: "Best Seller",

    price: 249,

    oldPrice: 299,

    rating: 4.8,

    reviews: 1140,

    stock: 40,

    inStock: true,

    description:
      "Responsive Boost cushioning built for everyday running and comfort.",

    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600181516264-3ea807ff44b9?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1400&auto=format&fit=crop",

    colors: ["Black", "White", "Blue"],

    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],

    features: [
      "Boost Cushioning",
      "Primeknit Upper",
      "Lightweight",
      "Breathable",
    ],

    specifications: {
      material: "Mesh",
      warranty: "1 Year",
      origin: "Vietnam",
    },
  },

  {
    id: 11,

    slug: "apple-watch-ultra",

    title: "Apple Watch Ultra",

    brand: "Apple",

    category: "Luxury Watches",

    collection: "Smart Wearables",

    badge: "New",

    price: 999,

    oldPrice: 1099,

    rating: 4.9,

    reviews: 612,

    stock: 23,

    inStock: true,

    description:
      "Premium rugged smartwatch with advanced fitness tracking.",

    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1400&auto=format&fit=crop",

    colors: ["Titanium", "Black"],

    sizes: ["49mm"],

    features: [
      "GPS",
      "Heart Rate",
      "Water Resistant",
      "Long Battery",
    ],

    specifications: {
      material: "Titanium",
      warranty: "1 Year",
    },
  },

  {
    id: 12,

    slug: "louis-vuitton-wallet",

    title: "Louis Vuitton Wallet",

    brand: "Louis Vuitton",

    category: "Luxury Accessories",

    collection: "Accessories",

    badge: "Premium",

    price: 699,

    oldPrice: 799,

    rating: 4.9,

    reviews: 206,

    stock: 17,

    inStock: true,

    description:
      "Premium leather wallet crafted with iconic Louis Vuitton styling.",

    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542291026-fb3b6f0f6e1d?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1400&auto=format&fit=crop",

    colors: ["Brown", "Black"],

    sizes: ["Standard"],

    features: [
      "Italian Leather",
      "Handcrafted",
      "Luxury Finish",
      "RFID Protection",
    ],

    specifications: {
      material: "Leather",
      warranty: "2 Years",
    },
  },
    {
    id: 13,

    slug: "samsung-galaxy-s25-ultra",

    title: "Samsung Galaxy S25 Ultra",

    brand: "Samsung",

    category: "Electronics",

    collection: "Premium Smartphones",

    badge: "Flagship",

    price: 1499,

    oldPrice: 1649,

    rating: 4.9,

    reviews: 712,

    stock: 28,

    inStock: true,

    description:
      "Premium flagship smartphone featuring Galaxy AI, professional cameras and an immersive display.",

    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1400&auto=format&fit=crop",

    colors: ["Titanium Black", "Silver", "Blue"],

    sizes: ["256GB", "512GB"],

    features: [
      "Galaxy AI",
      "200MP Camera",
      "120Hz AMOLED",
      "Fast Charging",
    ],

    specifications: {
      processor: "Snapdragon",
      display: "6.9-inch AMOLED",
      warranty: "1 Year",
    },
  },

  {
    id: 14,

    slug: "cartier-love-bracelet",

    title: "Cartier Love Bracelet",

    brand: "Cartier",

    category: "Jewelry",

    collection: "Luxury Jewelry",

    badge: "Luxury",

    price: 7499,

    oldPrice: 7999,

    rating: 5,

    reviews: 176,

    stock: 9,

    inStock: true,

    description:
      "Iconic Cartier bracelet crafted from premium precious metal.",

    images: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1400&auto=format&fit=crop",

    colors: ["Gold", "Rose Gold"],

    sizes: ["16", "17", "18"],

    features: [
      "Luxury Finish",
      "Premium Craftsmanship",
      "Elegant Design",
      "Gift Packaging",
    ],

    specifications: {
      material: "18K Gold",
      warranty: "Lifetime Service",
    },
  },

  {
    id: 15,

    slug: "bose-qc-ultra",

    title: "Bose QuietComfort Ultra",

    brand: "Bose",

    category: "Electronics",

    collection: "Premium Audio",

    badge: "Top Rated",

    price: 499,

    oldPrice: 549,

    rating: 4.9,

    reviews: 694,

    stock: 22,

    inStock: true,

    description:
      "Industry-leading noise cancellation with immersive premium audio.",

    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1400&auto=format&fit=crop",

    colors: ["Black", "White"],

    sizes: [],

    features: [
      "Noise Cancelling",
      "Bluetooth 5.3",
      "24 Hour Battery",
      "Premium Audio",
    ],

    specifications: {
      battery: "24 Hours",
      warranty: "2 Years",
    },
  },

  {
    id: 16,

    slug: "prada-crossbody-bag",

    title: "Prada Crossbody Bag",

    brand: "Prada",

    category: "Luxury Bags",

    collection: "Luxury Bags",

    badge: "Exclusive",

    price: 2199,

    oldPrice: 2399,

    rating: 4.8,

    reviews: 162,

    stock: 13,

    inStock: true,

    description:
      "Elegant designer crossbody bag with iconic Prada craftsmanship.",

    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542291026-fb3b6f0f6e1d?q=80&w=1400&auto=format&fit=crop",
    ],

    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1400&auto=format&fit=crop",

    colors: ["Black", "Beige"],

    sizes: ["Medium"],

    features: [
      "Luxury Leather",
      "Adjustable Strap",
      "Gold Hardware",
      "Designer Finish",
    ],

    specifications: {
      material: "Leather",
      warranty: "2 Years",
    },
  },
    {
    id: 17,
    slug: "nike-air-max-270-black-red",
    title: "Nike Air Max 270",
    brand: "Nike",
    category: "Footwear",
    collection: "Men",
    badge: "Trending",
    price: 12999,
    oldPrice: 14999,
    rating: 4.8,
    reviews: 642,
    stock: 28,
    inStock: true,
    description:
      "The Nike Air Max 270 combines responsive cushioning with breathable mesh construction for all-day comfort and modern street style.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    ],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    colors: ["Black", "Red", "White"],
    sizes: ["7", "8", "9", "10", "11"],
    features: [
      "Air Max cushioning",
      "Breathable mesh",
      "Rubber outsole",
      "Lightweight design",
    ],
    specifications: {
      material: "Mesh & Synthetic",
      sole: "Rubber",
      closure: "Lace-Up",
      fit: "Regular",
      warranty: "6 Months",
    },
  },

  {
    id: 18,
    slug: "adidas-ultraboost-22-white",
    title: "Adidas Ultraboost 22",
    brand: "Adidas",
    category: "Footwear",
    collection: "Men",
    badge: "Best Seller",
    price: 14999,
    oldPrice: 16999,
    rating: 4.9,
    reviews: 538,
    stock: 24,
    inStock: true,
    description:
      "Premium running shoes featuring Boost cushioning technology for superior energy return and exceptional comfort.",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    ],
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
    colors: ["White", "Grey", "Black"],
    sizes: ["7", "8", "9", "10"],
    features: [
      "Boost midsole",
      "Primeknit upper",
      "Energy return",
      "Continental rubber outsole",
    ],
    specifications: {
      material: "Primeknit",
      sole: "Rubber",
      closure: "Lace-Up",
      fit: "Regular",
      warranty: "6 Months",
    },
  },

  {
    id: 19,
    slug: "puma-rsx-reinvention-blue",
    title: "Puma RS-X Reinvention",
    brand: "Puma",
    category: "Footwear",
    collection: "Unisex",
    badge: "New",
    price: 9999,
    oldPrice: 11999,
    rating: 4.7,
    reviews: 318,
    stock: 40,
    inStock: true,
    description:
      "Chunky lifestyle sneakers inspired by retro running silhouettes with bold color combinations.",
    images: [
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
    ],
    image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f",
    colors: ["Blue", "White", "Black"],
    sizes: ["6", "7", "8", "9", "10"],
    features: [
      "Retro design",
      "Soft cushioning",
      "Premium finish",
      "Durable outsole",
    ],
    specifications: {
      material: "Mesh & Leather",
      sole: "Rubber",
      closure: "Lace-Up",
      fit: "Regular",
      warranty: "6 Months",
    },
  },

  {
    id: 20,
    slug: "levi-511-slim-fit-jeans",
    title: "Levi's 511 Slim Fit Jeans",
    brand: "Levi's",
    category: "Clothing",
    collection: "Men",
    badge: "Popular",
    price: 3499,
    oldPrice: 4299,
    rating: 4.6,
    reviews: 812,
    stock: 55,
    inStock: true,
    description:
      "Classic slim-fit stretch denim jeans crafted for everyday comfort and timeless style.",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
      "https://images.unsplash.com/photo-1514996937319-344454492b37",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
    ],
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    colors: ["Blue", "Black"],
    sizes: ["30", "32", "34", "36"],
    features: [
      "Stretch denim",
      "Slim fit",
      "Five-pocket style",
      "Soft fabric",
    ],
    specifications: {
      material: "98% Cotton, 2% Elastane",
      fit: "Slim",
      wash: "Machine Wash",
      pattern: "Solid",
      warranty: "No Warranty",
    },
  },

  {
    id: 21,
    slug: "tommy-hilfiger-polo-navy",
    title: "Tommy Hilfiger Polo T-Shirt",
    brand: "Tommy Hilfiger",
    category: "Clothing",
    collection: "Men",
    badge: "Trending",
    price: 2999,
    oldPrice: 3799,
    rating: 4.7,
    reviews: 456,
    stock: 62,
    inStock: true,
    description:
      "Premium cotton polo t-shirt featuring a classic collar and signature embroidered branding.",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
      "https://images.unsplash.com/photo-1514996937319-344454492b37",
    ],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
    colors: ["Navy", "White", "Black"],
    sizes: ["S", "M", "L", "XL"],
    features: [
      "Premium cotton",
      "Breathable fabric",
      "Classic fit",
      "Embroidered logo",
    ],
    specifications: {
      material: "100% Cotton",
      fit: "Regular",
      sleeve: "Half Sleeve",
      pattern: "Solid",
      warranty: "No Warranty",
    },
  },

  {
    id: 22,
    slug: "zara-casual-shirt-beige",
    title: "Zara Casual Linen Shirt",
    brand: "Zara",
    category: "Clothing",
    collection: "Men",
    badge: "New",
    price: 3999,
    oldPrice: 4999,
    rating: 4.5,
    reviews: 264,
    stock: 37,
    inStock: true,
    description:
      "Relaxed-fit linen shirt designed for breathable comfort and effortless everyday fashion.",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
      "https://images.unsplash.com/photo-1514996937319-344454492b37",
    ],
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
    colors: ["Beige", "White", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    features: [
      "Linen blend",
      "Lightweight",
      "Button closure",
      "Relaxed fit",
    ],
    specifications: {
      material: "Linen Blend",
      fit: "Regular",
      sleeve: "Full Sleeve",
      pattern: "Solid",
      warranty: "No Warranty",
    },
  },

  {
    id: 23,
    slug: "uniqlo-airism-tshirt",
    title: "Uniqlo AIRism T-Shirt",
    brand: "Uniqlo",
    category: "Clothing",
    collection: "Men",
    badge: "Best Seller",
    price: 1499,
    oldPrice: 1999,
    rating: 4.8,
    reviews: 983,
    stock: 90,
    inStock: true,
    description:
      "Ultra-light AIRism technology keeps you cool and dry with moisture-wicking comfort.",
    images: [
      "https://images.unsplash.com/photo-1514996937319-344454492b37",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    ],
    image: "https://images.unsplash.com/photo-1514996937319-344454492b37",
    colors: ["Black", "White", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    features: [
      "AIRism fabric",
      "Moisture wicking",
      "Quick drying",
      "Soft feel",
    ],
    specifications: {
      material: "Polyester Blend",
      fit: "Regular",
      sleeve: "Half Sleeve",
      pattern: "Solid",
      warranty: "No Warranty",
    },
  },

  {
    id: 24,
    slug: "casio-gshock-ga2100",
    title: "Casio G-Shock GA-2100",
    brand: "Casio",
    category: "Accessories",
    collection: "Men",
    badge: "Trending",
    price: 8995,
    oldPrice: 9995,
    rating: 4.9,
    reviews: 725,
    stock: 18,
    inStock: true,
    description:
      "Shock-resistant analog-digital watch featuring carbon core guard structure and 200m water resistance.",
    images: [
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3",
      "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade",
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d",
    ],
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3",
    colors: ["Black", "Grey"],
    sizes: ["Standard"],
    features: [
      "Shock resistant",
      "200m water resistant",
      "LED light",
      "World time",
    ],
    specifications: {
      material: "Resin",
      display: "Analog-Digital",
      waterResistance: "200m",
      battery: "3 Years",
      warranty: "2 Years",
    },
  },

  {
    id: 25,
    slug: "fossil-grant-chronograph",
    title: "Fossil Grant Chronograph",
    brand: "Fossil",
    category: "Accessories",
    collection: "Men",
    badge: "Premium",
    price: 11995,
    oldPrice: 13995,
    rating: 4.7,
    reviews: 389,
    stock: 16,
    inStock: true,
    description:
      "Elegant stainless-steel chronograph watch crafted for both business and casual occasions.",
    images: [
      "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3",
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade",
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d",
    ],
    image: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56",
    colors: ["Brown", "Silver"],
    sizes: ["Standard"],
    features: [
      "Chronograph movement",
      "Leather strap",
      "Mineral crystal",
      "Date display",
    ],
    specifications: {
      material: "Stainless Steel",
      strap: "Leather",
      display: "Analog",
      waterResistance: "50m",
      warranty: "2 Years",
    },
  },
    {
    id: 26,
    slug: "apple-airpods-pro-2",
    title: "Apple AirPods Pro (2nd Gen)",
    brand: "Apple",
    category: "Electronics",
    collection: "Audio",
    badge: "Best Seller",
    price: 24999,
    oldPrice: 26999,
    rating: 4.9,
    reviews: 1842,
    stock: 35,
    inStock: true,
    description:
      "Premium wireless earbuds featuring Active Noise Cancellation, Adaptive Transparency, Spatial Audio, and MagSafe charging case.",
    images: [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46",
      "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb",
    ],
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46",
    colors: ["White"],
    sizes: ["Standard"],
    features: [
      "Active Noise Cancellation",
      "Spatial Audio",
      "USB-C Charging",
      "IP54 Rated",
    ],
    specifications: {
      connectivity: "Bluetooth 5.3",
      battery: "Up to 30 Hours",
      charging: "USB-C / MagSafe",
      microphone: "Dual Beamforming",
      warranty: "1 Year",
    },
  },

  {
    id: 27,
    slug: "sony-wh1000xm5-headphones",
    title: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Electronics",
    collection: "Audio",
    badge: "Premium",
    price: 29990,
    oldPrice: 34990,
    rating: 4.9,
    reviews: 1134,
    stock: 20,
    inStock: true,
    description:
      "Industry-leading wireless noise cancelling headphones with crystal-clear calls and exceptional battery life.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944",
      "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd",
    ],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    colors: ["Black", "Silver"],
    sizes: ["Standard"],
    features: [
      "30-hour battery",
      "ANC",
      "Quick Charge",
      "Touch Controls",
    ],
    specifications: {
      connectivity: "Bluetooth 5.2",
      battery: "30 Hours",
      weight: "250g",
      microphone: "Built-in",
      warranty: "1 Year",
    },
  },

  {
    id: 28,
    slug: "jbl-flip-6-speaker",
    title: "JBL Flip 6 Bluetooth Speaker",
    brand: "JBL",
    category: "Electronics",
    collection: "Audio",
    badge: "Trending",
    price: 9999,
    oldPrice: 11999,
    rating: 4.8,
    reviews: 867,
    stock: 41,
    inStock: true,
    description:
      "Portable Bluetooth speaker delivering powerful JBL Original Pro Sound with waterproof durability.",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d",
      "https://images.unsplash.com/photo-1512446733611-9099a758e5e0",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a",
    ],
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d",
    colors: ["Black", "Blue", "Red"],
    sizes: ["Standard"],
    features: [
      "IP67 Waterproof",
      "12 Hours Playback",
      "USB-C Charging",
      "PartyBoost",
    ],
    specifications: {
      connectivity: "Bluetooth 5.1",
      battery: "12 Hours",
      charging: "USB-C",
      waterResistance: "IP67",
      warranty: "1 Year",
    },
  },

  {
    id: 29,
    slug: "samsung-990-pro-1tb-ssd",
    title: "Samsung 990 PRO 1TB SSD",
    brand: "Samsung",
    category: "Electronics",
    collection: "Storage",
    badge: "New",
    price: 11999,
    oldPrice: 13999,
    rating: 4.9,
    reviews: 421,
    stock: 52,
    inStock: true,
    description:
      "Ultra-fast PCIe Gen4 NVMe SSD engineered for gaming, creative workloads, and high-performance computing.",
    images: [
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea",
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
      "https://images.unsplash.com/photo-1518770660439-4636190af475",
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
    ],
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea",
    colors: ["Black"],
    sizes: ["1TB"],
    features: [
      "PCIe Gen4",
      "NVMe M.2",
      "High Speed",
      "Low Power",
    ],
    specifications: {
      interface: "PCIe Gen4 x4",
      capacity: "1TB",
      readSpeed: "7450 MB/s",
      writeSpeed: "6900 MB/s",
      warranty: "5 Years",
    },
  },

  {
    id: 30,
    slug: "logitech-mx-master-3s",
    title: "Logitech MX Master 3S",
    brand: "Logitech",
    category: "Electronics",
    collection: "Accessories",
    badge: "Editor's Choice",
    price: 9995,
    oldPrice: 11495,
    rating: 4.9,
    reviews: 1288,
    stock: 45,
    inStock: true,
    description:
      "Advanced wireless productivity mouse with ultra-fast scrolling, quiet clicks, and multi-device support.",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae",
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a",
    ],
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db",
    colors: ["Graphite"],
    sizes: ["Standard"],
    features: [
      "Silent Clicks",
      "USB-C Rechargeable",
      "Multi-Device",
      "MagSpeed Scroll",
    ],
    specifications: {
      connectivity: "Bluetooth / USB Receiver",
      battery: "70 Days",
      dpi: "8000",
      compatibility: "Windows/macOS/Linux",
      warranty: "1 Year",
    },
  },

  {
    id: 31,
    slug: "anker-737-power-bank",
    title: "Anker 737 Power Bank",
    brand: "Anker",
    category: "Electronics",
    collection: "Accessories",
    badge: "Fast Charging",
    price: 11999,
    oldPrice: 13999,
    rating: 4.8,
    reviews: 534,
    stock: 39,
    inStock: true,
    description:
      "High-capacity portable charger supporting ultra-fast USB-C charging for laptops, tablets, and smartphones.",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "https://images.unsplash.com/photo-1510557880182-3f8a7c1d35ca",
      "https://images.unsplash.com/photo-1512058564366-18510be2db19",
    ],
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0",
    colors: ["Black"],
    sizes: ["24000mAh"],
    features: [
      "140W Output",
      "Smart Display",
      "USB-C PD",
      "Laptop Charging",
    ],
    specifications: {
      capacity: "24000mAh",
      output: "140W",
      ports: "3",
      charging: "USB-C",
      warranty: "18 Months",
    },
  },

  {
    id: 32,
    slug: "kindle-paperwhite-2024",
    title: "Kindle Paperwhite",
    brand: "Amazon",
    category: "Electronics",
    collection: "Reading",
    badge: "Popular",
    price: 15999,
    oldPrice: 17999,
    rating: 4.8,
    reviews: 972,
    stock: 33,
    inStock: true,
    description:
      "Glare-free e-reader with adjustable warm light, waterproof design, and weeks of battery life.",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
      "https://images.unsplash.com/photo-1524578271613-d550eacf6090",
    ],
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    colors: ["Black"],
    sizes: ["16GB"],
    features: [
      "Waterproof",
      "Warm Light",
      "Weeks Battery",
      "Glare-Free Display",
    ],
    specifications: {
      display: "6.8-inch",
      storage: "16GB",
      connectivity: "Wi-Fi",
      battery: "Up to 10 Weeks",
      warranty: "1 Year",
    },
  },

  {
    id: 33,
    slug: "fitbit-charge-6",
    title: "Fitbit Charge 6",
    brand: "Fitbit",
    category: "Wearables",
    collection: "Fitness",
    badge: "Fitness",
    price: 16999,
    oldPrice: 18999,
    rating: 4.7,
    reviews: 608,
    stock: 27,
    inStock: true,
    description:
      "Advanced fitness tracker with heart-rate monitoring, built-in GPS, sleep tracking, and Google integration.",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1",
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b",
    ],
    image: "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6",
    colors: ["Black", "Silver"],
    sizes: ["Standard"],
    features: [
      "Built-in GPS",
      "Heart Rate",
      "Sleep Tracking",
      "7-Day Battery",
    ],
    specifications: {
      display: "AMOLED",
      battery: "7 Days",
      waterResistance: "50m",
      connectivity: "Bluetooth",
      warranty: "1 Year",
    },
  },
    {
    id: 34,
    slug: "apple-watch-series-10-gps",
    title: "Apple Watch Series 10 GPS",
    brand: "Apple",
    category: "Wearables",
    collection: "Smart Watches",
    badge: "Best Seller",
    price: 46999,
    oldPrice: 49999,
    rating: 4.9,
    reviews: 1284,
    stock: 22,
    inStock: true,
    description:
      "Premium smartwatch with advanced health tracking, fitness features, Always-On Retina display, and seamless Apple ecosystem integration.",
    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
    ],
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d",
    colors: ["Midnight", "Silver", "Starlight"],
    sizes: ["41mm", "45mm"],
    features: [
      "Always-On Retina Display",
      "ECG",
      "Blood Oxygen",
      "Fast Charging",
    ],
    specifications: {
      display: "OLED Retina",
      battery: "18 Hours",
      connectivity: "Bluetooth / GPS / Wi-Fi",
      waterResistance: "50m",
      warranty: "1 Year",
    },
  },

  {
    id: 35,
    slug: "garmin-forerunner-265",
    title: "Garmin Forerunner 265",
    brand: "Garmin",
    category: "Wearables",
    collection: "Fitness",
    badge: "Running",
    price: 42990,
    oldPrice: 45990,
    rating: 4.8,
    reviews: 612,
    stock: 19,
    inStock: true,
    description:
      "AMOLED GPS running smartwatch designed for athletes with advanced training metrics and long battery life.",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3",
    ],
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1",
    colors: ["Black", "White"],
    sizes: ["42mm", "46mm"],
    features: [
      "GPS Tracking",
      "AMOLED Display",
      "Training Readiness",
      "Music Storage",
    ],
    specifications: {
      display: "AMOLED",
      battery: "13 Days",
      connectivity: "Bluetooth / GPS",
      waterResistance: "5 ATM",
      warranty: "1 Year",
    },
  },

  {
    id: 36,
    slug: "ray-ban-wayfarer-classic",
    title: "Ray-Ban Wayfarer Classic",
    brand: "Ray-Ban",
    category: "Accessories",
    collection: "Eyewear",
    badge: "Iconic",
    price: 9990,
    oldPrice: 11490,
    rating: 4.8,
    reviews: 953,
    stock: 46,
    inStock: true,
    description:
      "Legendary Wayfarer sunglasses offering timeless style with premium UV protection and durable acetate frames.",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    ],
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
    colors: ["Black", "Brown"],
    sizes: ["Standard"],
    features: [
      "UV400 Protection",
      "Classic Design",
      "Lightweight",
      "Scratch Resistant",
    ],
    specifications: {
      frame: "Acetate",
      lens: "Glass",
      protection: "100% UV",
      gender: "Unisex",
      warranty: "1 Year",
    },
  },

  {
    id: 37,
    slug: "american-tourister-curio-luggage",
    title: "American Tourister Curio Spinner",
    brand: "American Tourister",
    category: "Travel",
    collection: "Luggage",
    badge: "Travel",
    price: 8499,
    oldPrice: 9999,
    rating: 4.7,
    reviews: 534,
    stock: 31,
    inStock: true,
    description:
      "Durable hard-shell suitcase with smooth spinner wheels, TSA lock, and spacious interior.",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60",
      "https://images.unsplash.com/photo-1502920917128-1aa500764ce7",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
    ],
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    colors: ["Blue", "Black", "Grey"],
    sizes: ["Medium", "Large"],
    features: [
      "360° Spinner Wheels",
      "TSA Lock",
      "Expandable",
      "Scratch Resistant",
    ],
    specifications: {
      material: "Polycarbonate",
      capacity: "68L",
      wheels: "4 Spinner",
      lock: "TSA",
      warranty: "3 Years",
    },
  },

  {
    id: 38,
    slug: "nike-utility-backpack",
    title: "Nike Utility Elite Backpack",
    brand: "Nike",
    category: "Bags",
    collection: "Sports",
    badge: "Popular",
    price: 4999,
    oldPrice: 5999,
    rating: 4.8,
    reviews: 488,
    stock: 57,
    inStock: true,
    description:
      "Versatile sports backpack with dedicated laptop compartment, water-resistant fabric, and ergonomic shoulder straps.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    ],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    colors: ["Black", "Grey"],
    sizes: ["30L"],
    features: [
      "Laptop Sleeve",
      "Water Resistant",
      "Multiple Compartments",
      "Padded Back",
    ],
    specifications: {
      material: "Polyester",
      capacity: "30L",
      closure: "Zip",
      laptop: "15.6 Inch",
      warranty: "1 Year",
    },
  },

  {
    id: 39,
    slug: "herschel-little-america-backpack",
    title: "Herschel Little America Backpack",
    brand: "Herschel",
    category: "Bags",
    collection: "Lifestyle",
    badge: "Classic",
    price: 7999,
    oldPrice: 9499,
    rating: 4.8,
    reviews: 374,
    stock: 25,
    inStock: true,
    description:
      "Stylish everyday backpack with padded laptop sleeve, magnetic strap closures, and spacious storage.",
    images: [
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    ],
    image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa",
    colors: ["Black", "Navy", "Olive"],
    sizes: ["25L"],
    features: [
      "Laptop Sleeve",
      "Magnetic Straps",
      "Padded Shoulder Straps",
      "Large Capacity",
    ],
    specifications: {
      material: "Polyester",
      capacity: "25L",
      laptop: "15 Inch",
      closure: "Drawstring + Magnetic",
      warranty: "1 Year",
    },
  },

  {
    id: 40,
    slug: "boat-storm-smartwatch",
    title: "boAt Storm Smartwatch",
    brand: "boAt",
    category: "Wearables",
    collection: "Fitness",
    badge: "Budget Pick",
    price: 2499,
    oldPrice: 3999,
    rating: 4.4,
    reviews: 2851,
    stock: 120,
    inStock: true,
    description:
      "Affordable fitness smartwatch with heart rate monitoring, SpO2 tracking, and multiple sports modes.",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1",
    ],
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
    colors: ["Black", "Blue"],
    sizes: ["Standard"],
    features: [
      "SpO2 Monitor",
      "Heart Rate",
      "Sports Modes",
      "IP68 Rating",
    ],
    specifications: {
      display: "1.3-inch LCD",
      battery: "10 Days",
      connectivity: "Bluetooth",
      waterResistance: "IP68",
      warranty: "1 Year",
    },
  },

  {
    id: 41,
    slug: "mi-band-9",
    title: "Xiaomi Smart Band 9",
    brand: "Xiaomi",
    category: "Wearables",
    collection: "Fitness",
    badge: "Trending",
    price: 3499,
    oldPrice: 4299,
    rating: 4.6,
    reviews: 1095,
    stock: 83,
    inStock: true,
    description:
      "Slim fitness tracker with AMOLED display, health monitoring, sleep tracking, and impressive battery life.",
    images: [
      "https://images.unsplash.com/photo-1510017803434-a899398421b3",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
    ],
    image: "https://images.unsplash.com/photo-1510017803434-a899398421b3",
    colors: ["Black", "Pink", "Blue"],
    sizes: ["Standard"],
    features: [
      "AMOLED Display",
      "Heart Rate",
      "Sleep Tracking",
      "Water Resistant",
    ],
    specifications: {
      display: "AMOLED",
      battery: "21 Days",
      connectivity: "Bluetooth",
      waterResistance: "5 ATM",
      warranty: "1 Year",
    },
  },

  {
    id: 42,
    slug: "philips-air-fryer-xl",
    title: "Philips Air Fryer XL",
    brand: "Philips",
    category: "Home Appliances",
    collection: "Kitchen",
    badge: "Healthy Choice",
    price: 12999,
    oldPrice: 14999,
    rating: 4.8,
    reviews: 642,
    stock: 29,
    inStock: true,
    description:
      "Large-capacity digital air fryer with Rapid Air Technology for healthier cooking using little to no oil.",
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c",
      "https://images.unsplash.com/photo-1586201375800-2c2a0e1b5d70",
      "https://images.unsplash.com/photo-1517705008128-361805f42e86",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    ],
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
    colors: ["Black"],
    sizes: ["6.2L"],
    features: [
      "Rapid Air Technology",
      "Digital Controls",
      "Dishwasher Safe",
      "Large Capacity",
    ],
    specifications: {
      capacity: "6.2L",
      power: "2000W",
      control: "Digital Touch",
      voltage: "230V",
      warranty: "2 Years",
    },
  },
    {
    id: 43,
    slug: "dyson-v12-detect-slim",
    title: "Dyson V12 Detect Slim",
    brand: "Dyson",
    category: "Home Appliances",
    collection: "Cleaning",
    badge: "Premium",
    price: 52999,
    oldPrice: 57999,
    rating: 4.9,
    reviews: 436,
    stock: 14,
    inStock: true,
    description:
      "Cordless vacuum cleaner with laser dust detection, powerful suction, and lightweight ergonomic design.",
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f",
    ],
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001",
    colors: ["Yellow", "Silver"],
    sizes: ["Standard"],
    features: [
      "Laser Dust Detection",
      "Cordless",
      "HEPA Filtration",
      "Up to 60 Minutes Runtime",
    ],
    specifications: {
      power: "545W",
      runtime: "60 Minutes",
      dustbin: "0.35L",
      filtration: "HEPA",
      warranty: "2 Years",
    },
  },

  {
    id: 44,
    slug: "ikea-linnmon-study-desk",
    title: "IKEA LINNMON Study Desk",
    brand: "IKEA",
    category: "Furniture",
    collection: "Home Office",
    badge: "Popular",
    price: 6999,
    oldPrice: 7999,
    rating: 4.6,
    reviews: 512,
    stock: 38,
    inStock: true,
    description:
      "Minimalist study desk with a spacious tabletop, sturdy construction, and modern Scandinavian styling.",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f",
    ],
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    colors: ["White", "Black", "Oak"],
    sizes: ["120cm"],
    features: [
      "Minimal Design",
      "Scratch Resistant",
      "Easy Assembly",
      "Stable Legs",
    ],
    specifications: {
      material: "Engineered Wood",
      dimensions: "120 x 60 cm",
      weightCapacity: "50kg",
      finish: "Matte",
      warranty: "1 Year",
    },
  },

  {
    id: 45,
    slug: "green-soul-monster-gaming-chair",
    title: "Green Soul Monster Gaming Chair",
    brand: "Green Soul",
    category: "Furniture",
    collection: "Gaming",
    badge: "Best Seller",
    price: 16999,
    oldPrice: 18999,
    rating: 4.8,
    reviews: 891,
    stock: 26,
    inStock: true,
    description:
      "Ergonomic gaming chair with adjustable lumbar support, reclining backrest, and premium cushioning.",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f",
    ],
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    colors: ["Black", "Red"],
    sizes: ["Standard"],
    features: [
      "180° Recline",
      "Lumbar Support",
      "Adjustable Armrests",
      "Heavy Duty Base",
    ],
    specifications: {
      material: "PU Leather",
      maxLoad: "120kg",
      recline: "180 Degrees",
      wheels: "360°",
      warranty: "3 Years",
    },
  },

  {
    id: 46,
    slug: "instant-pot-duo-7l",
    title: "Instant Pot Duo 7L",
    brand: "Instant Pot",
    category: "Home Appliances",
    collection: "Kitchen",
    badge: "Kitchen Essential",
    price: 9999,
    oldPrice: 11999,
    rating: 4.8,
    reviews: 765,
    stock: 34,
    inStock: true,
    description:
      "7-in-1 electric pressure cooker with multiple cooking modes for faster and healthier meal preparation.",
    images: [
      "https://images.unsplash.com/photo-1517705008128-361805f42e86",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1586201375800-2c2a0e1b5d70",
    ],
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86",
    colors: ["Silver"],
    sizes: ["7L"],
    features: [
      "7-in-1 Cooking",
      "Pressure Cook",
      "Slow Cook",
      "Delay Timer",
    ],
    specifications: {
      capacity: "7 Litres",
      power: "1000W",
      control: "Digital",
      voltage: "230V",
      warranty: "1 Year",
    },
  },

  {
    id: 47,
    slug: "lego-star-wars-xwing-fighter",
    title: "LEGO Star Wars X-Wing Fighter",
    brand: "LEGO",
    category: "Toys",
    collection: "Star Wars",
    badge: "Collector",
    price: 8499,
    oldPrice: 9499,
    rating: 4.9,
    reviews: 628,
    stock: 21,
    inStock: true,
    description:
      "Highly detailed LEGO Star Wars X-Wing Fighter building set for collectors and fans of all ages.",
    images: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420",
      "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64",
      "https://images.unsplash.com/photo-1542751110-97427bbecf20",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088",
    ],
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420",
    colors: ["Multi"],
    sizes: ["1949 Pieces"],
    features: [
      "Collector Edition",
      "Display Stand",
      "Detailed Build",
      "Premium Packaging",
    ],
    specifications: {
      pieces: "1949",
      age: "18+",
      theme: "Star Wars",
      material: "ABS Plastic",
      warranty: "No Warranty",
    },
  },

  {
    id: 48,
    slug: "wilson-evolution-basketball",
    title: "Wilson Evolution Basketball",
    brand: "Wilson",
    category: "Sports",
    collection: "Basketball",
    badge: "Top Rated",
    price: 4999,
    oldPrice: 5999,
    rating: 4.8,
    reviews: 584,
    stock: 48,
    inStock: true,
    description:
      "Professional indoor basketball with premium composite leather cover for exceptional grip and control.",
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc",
      "https://images.unsplash.com/photo-1519861531473-9200262188bf",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b",
      "https://images.unsplash.com/photo-1505666287802-931dc83948e9",
    ],
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    colors: ["Orange"],
    sizes: ["Size 7"],
    features: [
      "Composite Leather",
      "Indoor Use",
      "Excellent Grip",
      "Professional Quality",
    ],
    specifications: {
      material: "Composite Leather",
      size: "7",
      usage: "Indoor",
      weight: "Official",
      warranty: "6 Months",
    },
  },

  {
    id: 49,
    slug: "yonex-astrox-88d-pro",
    title: "Yonex Astrox 88D Pro",
    brand: "Yonex",
    category: "Sports",
    collection: "Badminton",
    badge: "Professional",
    price: 18999,
    oldPrice: 20999,
    rating: 4.9,
    reviews: 342,
    stock: 17,
    inStock: true,
    description:
      "Professional badminton racket engineered for powerful smashes, precision control, and tournament-level performance.",
    images: [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea",
      "https://images.unsplash.com/photo-1542144582-1ba00456b5e3",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b",
      "https://images.unsplash.com/photo-1505666287802-931dc83948e9",
    ],
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea",
    colors: ["Black", "Green"],
    sizes: ["4U G5"],
    features: [
      "Rotational Generator System",
      "High Flex Shaft",
      "Professional Grade",
      "Made in Japan",
    ],
    specifications: {
      material: "HM Graphite",
      weight: "4U",
      grip: "G5",
      balance: "Head Heavy",
      warranty: "1 Year",
    },
  },

  {
    id: 50,
    slug: "the-north-face-base-camp-duffel",
    title: "The North Face Base Camp Duffel",
    brand: "The North Face",
    category: "Travel",
    collection: "Adventure",
    badge: "Adventure",
    price: 14999,
    oldPrice: 16999,
    rating: 4.9,
    reviews: 471,
    stock: 29,
    inStock: true,
    description:
      "Legendary expedition duffel bag with water-resistant construction, durable materials, and multiple carrying options.",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60",
      "https://images.unsplash.com/photo-1502920917128-1aa500764ce7",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
    ],
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    colors: ["Black", "Yellow", "Red"],
    sizes: ["50L"],
    features: [
      "Water Resistant",
      "Expedition Grade",
      "Multiple Carry Handles",
      "Compression Straps",
    ],
    specifications: {
      material: "Laminated Nylon",
      capacity: "50L",
      closure: "Heavy Duty Zip",
      usage: "Travel / Adventure",
      warranty: "2 Years",
    },
  },
]

export default products;