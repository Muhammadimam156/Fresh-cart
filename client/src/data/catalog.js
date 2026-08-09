const categoryList = [
  { name: 'Salt', slug: 'salt' },
  { name: 'Flour', slug: 'flour' },
  { name: 'Rice', slug: 'rice' },
  { name: 'Sugar', slug: 'sugar' },
  { name: 'Oil', slug: 'oil' },
  { name: 'Tea', slug: 'tea' },
  { name: 'Spices', slug: 'spices' },
];

function createProductImage(title, from, to) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" role="img" aria-label="${title}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${from}" />
          <stop offset="100%" stop-color="${to}" />
        </linearGradient>
      </defs>
      <rect width="600" height="450" rx="36" fill="url(#g)" />
      <circle cx="480" cy="100" r="86" fill="rgba(255,255,255,0.16)" />
      <circle cx="120" cy="330" r="120" fill="rgba(255,255,255,0.10)" />
      <rect x="72" y="92" width="456" height="266" rx="28" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)" />
      <text x="300" y="222" text-anchor="middle" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#ffffff">${title}</text>
      <text x="300" y="272" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#ffffff">Fresh & quality picked</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export const categories = categoryList.map((category) => ({
  ...category,
  image: createProductImage(category.name, '#2f9d47', '#154d25'),
}));

export const products = [
  {
    id: 'p-1',
    name: 'Fine Salt',
    slug: 'fine-salt',
    category: 'salt',
    price: 75,
    stock: 64,
    description: 'Pure fine salt packaged for everyday cooking and baking.',
    featured: true,
    latest: false,
    image: createProductImage('Fine Salt', '#6b7280', '#111827'),
  },
  {
    id: 'p-2',
    name: 'Whole Wheat Flour',
    slug: 'whole-wheat-flour',
    category: 'flour',
    price: 420,
    stock: 40,
    description: 'Stone-ground wheat flour with a soft texture and balanced taste.',
    featured: true,
    latest: true,
    image: createProductImage('Wheat Flour', '#c08457', '#8b4513'),
  },
  {
    id: 'p-3',
    name: 'Sugar Free Flour',
    slug: 'sugar-free-flour',
    category: 'flour',
    price: 460,
    stock: 28,
    description: 'Low-glycemic blend designed for health-conscious households.',
    featured: false,
    latest: true,
    image: createProductImage('Sugar Free', '#d1a05b', '#91672b'),
  },
  {
    id: 'p-4',
    name: 'Organic Flour',
    slug: 'organic-flour',
    category: 'flour',
    price: 520,
    stock: 18,
    description: 'Certified organic flour with a clean, natural aroma.',
    featured: true,
    latest: false,
    image: createProductImage('Organic Flour', '#84cc16', '#166534'),
  },
  {
    id: 'p-5',
    name: 'Maida',
    slug: 'maida',
    category: 'flour',
    price: 380,
    stock: 52,
    description: 'Fine refined flour for soft breads, pastries, and desserts.',
    featured: false,
    latest: true,
    image: createProductImage('Maida', '#f3f4f6', '#d1d5db'),
  },
  {
    id: 'p-6',
    name: 'Basmati Rice',
    slug: 'basmati-rice',
    category: 'rice',
    price: 980,
    stock: 34,
    description: 'Premium long-grain rice with a rich aroma and fluffy finish.',
    featured: true,
    latest: false,
    image: createProductImage('Basmati Rice', '#d4a017', '#8a5c00'),
  },
  {
    id: 'p-7',
    name: 'Classic Sugar',
    slug: 'classic-sugar',
    category: 'sugar',
    price: 190,
    stock: 61,
    description: 'Granulated sugar for everyday tea, coffee, and baking.',
    featured: false,
    latest: true,
    image: createProductImage('Sugar', '#e5e7eb', '#9ca3af'),
  },
  {
    id: 'p-8',
    name: 'Sunflower Oil',
    slug: 'sunflower-oil',
    category: 'oil',
    price: 1490,
    stock: 22,
    description: 'Light, clean oil suitable for frying and daily cooking.',
    featured: true,
    latest: false,
    image: createProductImage('Sunflower Oil', '#f59e0b', '#b45309'),
  },
  {
    id: 'p-9',
    name: 'Green Tea',
    slug: 'green-tea',
    category: 'tea',
    price: 340,
    stock: 48,
    description: 'Refreshing tea with a smooth profile and natural aroma.',
    featured: false,
    latest: true,
    image: createProductImage('Green Tea', '#22c55e', '#166534'),
  },
  {
    id: 'p-10',
    name: 'Cumin Powder',
    slug: 'cumin-powder',
    category: 'spices',
    price: 220,
    stock: 57,
    description: 'Ground cumin for bold flavor in curries and marinades.',
    featured: true,
    latest: true,
    image: createProductImage('Cumin', '#ca8a04', '#713f12'),
  },
  {
    id: 'p-11',
    name: 'Red Chili Powder',
    slug: 'red-chili-powder',
    category: 'spices',
    price: 260,
    stock: 31,
    description: 'Fine red chili powder with a deep color and lively heat.',
    featured: false,
    latest: true,
    image: createProductImage('Chili', '#ef4444', '#991b1b'),
  },
  {
    id: 'p-12',
    name: 'Iodized Salt',
    slug: 'iodized-salt',
    category: 'salt',
    price: 60,
    stock: 88,
    description: 'Essential iodized salt for daily household use.',
    featured: false,
    latest: true,
    image: createProductImage('Iodized Salt', '#64748b', '#0f172a'),
  },
];

export const categoryMap = Object.fromEntries(categories.map((category) => [category.slug, category]));

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(slug) {
  return products.filter((product) => product.category === slug);
}

export function getProducts({
  search: query
} = {}) {
  const normalized = String(query || '').trim().toLowerCase();

  if (!normalized) {
    return list;
  }

  return list.filter((product) => {
    const haystack = [product.name, product.description, categoryMap[product.category]?.name].join(' ').toLowerCase();
    return haystack.includes(normalized);
  });
}