/* ============================================================
   The Sisters Beauty — Product data
   ------------------------------------------------------------
   Single source of truth for every product & category.
   Swap `image` with a real photo URL later; empty = auto
   generated glossy placeholder. Prices are in MAD (DH).
   ============================================================ */

window.CATEGORIES = [
  { id: 'cleansers',    label: 'Cleansers',        emoji: '🧴', grad: 'linear-gradient(135deg,#FFE0D1,#FFC9D9)' },
  { id: 'toners',       label: 'Toners',           emoji: '💧', grad: 'linear-gradient(135deg,#FFDCE8,#FFE7D6)' },
  { id: 'serums',       label: 'Serums & Ampoules',emoji: '✨', grad: 'linear-gradient(135deg,#F6E3FF,#FFE0D8)' },
  { id: 'moisturizers', label: 'Moisturizers',     emoji: '🧈', grad: 'linear-gradient(135deg,#FFE9D6,#F3E8FF)' },
  { id: 'sunscreen',    label: 'Sunscreen',        emoji: '☀️', grad: 'linear-gradient(135deg,#FFF2D6,#FFDCC9)' },
  { id: 'masks',        label: 'Masks',            emoji: '🧖', grad: 'linear-gradient(135deg,#E5E9FF,#FFE3E9)' },
];

/* brand → signature tint used for the glossy placeholders */
const BRAND_TINT = {
  'Anua':     'linear-gradient(135deg,#FFD3C2,#FFB7CD)',
  'COSRX':    'linear-gradient(135deg,#FFE7D1,#FFD0E2)',
  'Medicube': 'linear-gradient(135deg,#E6D9FF,#FFD6E6)',
  'SKIN1004': 'linear-gradient(135deg,#D5F0E6,#FFE6C9)',
  'Axis-Y':   'linear-gradient(135deg,#FFD9E3,#E8DDF6)',
  'Arencia':  'linear-gradient(135deg,#E4E9FF,#FFDFE7)',
};

window.PRODUCTS = [
  {
    id: 'p01', name: 'Heartleaf Pore Control Cleansing Oil', brand: 'Anua',
    category: 'cleansers', price: 185, rating: 4.9, reviews: 214,
    badge: 'Best Seller', featured: true,
  },
  {
    id: 'p02', name: 'Low pH Good Morning Gel Cleanser', brand: 'COSRX',
    category: 'cleansers', price: 95, rating: 4.8, reviews: 342,
  },
  {
    id: 'p03', name: 'Heartleaf Quercetin Ampoule Foam', brand: 'Anua',
    category: 'cleansers', price: 130, rating: 4.8, reviews: 97,
    featured: true,
  },
  {
    id: 'p04', name: 'Centella Light Cleansing Oil', brand: 'SKIN1004',
    category: 'cleansers', price: 175, rating: 4.7, reviews: 156,
  },
  {
    id: 'p05', name: 'Heartleaf 77% Soothing Toner', brand: 'Anua',
    category: 'toners', price: 165, rating: 4.9, reviews: 431,
    badge: 'Best Seller', featured: true,
  },
  {
    id: 'p06', name: 'Full Fit Propolis Synergy Toner', brand: 'COSRX',
    category: 'toners', price: 185, rating: 4.8, reviews: 203,
  },
  {
    id: 'p07', name: 'Centella Toning Toner', brand: 'SKIN1004',
    category: 'toners', price: 160, rating: 4.7, reviews: 118,
  },
  {
    id: 'p08', name: 'Dark Spot Correcting Glow Serum', brand: 'Axis-Y',
    category: 'serums', price: 195, rating: 4.9, reviews: 387,
    badge: 'Best Seller', featured: true,
  },
  {
    id: 'p09', name: 'The 6 Peptide Skin Booster Serum', brand: 'COSRX',
    category: 'serums', price: 215, rating: 4.8, reviews: 174,
    badge: 'New', featured: true,
  },
  {
    id: 'p10', name: 'Heartleaf Quercetin Ampoule', brand: 'Anua',
    category: 'serums', price: 230, rating: 4.9, reviews: 259,
  },
  {
    id: 'p11', name: 'Zero Pore Serum 2.0', brand: 'Medicube',
    category: 'serums', price: 245, rating: 4.8, reviews: 142,
    badge: 'New',
  },
  {
    id: 'p12', name: 'Centella Asiatica Ampoule', brand: 'SKIN1004',
    category: 'serums', price: 210, rating: 4.8, reviews: 168,
  },
  {
    id: 'p13', name: 'Advanced Snail 92 All In One Cream', brand: 'COSRX',
    category: 'moisturizers', price: 220, rating: 4.9, reviews: 498,
    badge: 'Best Seller', featured: true,
  },
  {
    id: 'p14', name: 'Peach 70 Niacin Glow Cream', brand: 'Anua',
    category: 'moisturizers', price: 175, rating: 4.7, reviews: 87,
    featured: true,
  },
  {
    id: 'p15', name: 'Collagen Jelly Cream', brand: 'Medicube',
    category: 'moisturizers', price: 285, rating: 4.8, reviews: 96,
  },
  {
    id: 'p16', name: 'Hyalu-Cica Water-Fit Sun Serum SPF50+', brand: 'SKIN1004',
    category: 'sunscreen', price: 185, rating: 4.9, reviews: 376,
    badge: 'Best Seller', featured: true,
  },
  {
    id: 'p17', name: 'Aloe Soothing Sun Cream SPF50+', brand: 'COSRX',
    category: 'sunscreen', price: 150, rating: 4.8, reviews: 212,
  },
  {
    id: 'p18', name: 'Heartleaf Silky Moisture Sun SPF50+', brand: 'Anua',
    category: 'sunscreen', price: 175, rating: 4.8, reviews: 145,
  },
  {
    id: 'p19', name: 'Ultimate Nourishing Rice Overnight Spa Mask', brand: 'COSRX',
    category: 'masks', price: 170, rating: 4.8, reviews: 231,
  },
  {
    id: 'p20', name: 'Heartleaf Pore Control Cleansing Mask', brand: 'Anua',
    category: 'masks', price: 135, rating: 4.7, reviews: 88,
  },
];

/* ------------------------------------------------------------
   Helpers
   ------------------------------------------------------------ */
window.getProduct = function (id) {
  return window.PRODUCTS.find(function (p) { return p.id === id; });
};

window.getCategory = function (id) {
  return window.CATEGORIES.find(function (c) { return c.id === id; });
};

window.formatPrice = function (num) {
  return num.toLocaleString('fr-MA') + ' DH';
};

/* stars: return filled/empty ★ symbols for a rating */
window.stars = function (rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
};

/* brand → signature gradient (reused by cart thumbnails) */
window.brandTint = function (brand) {
  return BRAND_TINT[brand] || 'linear-gradient(135deg,#FFD9C9,#FFC9D9)';
};

/* ------------------------------------------------------------
   Glossy placeholder image (used until a real photo URL exists)
   ------------------------------------------------------------ */
function placeholderImage(product) {
  const grad = window.brandTint(product.brand);
  const initial = product.brand.charAt(0);
  return (
    '<div class="ph" style="background:' + grad + '">' +
      '<span class="ph-shine" aria-hidden="true"></span>' +
      '<span class="ph-initial">' + initial + '</span>' +
      '<span class="ph-cat">' + window.getCategory(product.category).emoji + '</span>' +
    '</div>'
  );
}

/* ------------------------------------------------------------
   Product card markup
   ------------------------------------------------------------ */
window.renderProductCard = function (product) {
  const img = product.image
    ? '<img class="p-img" src="' + product.image + '" alt="' + product.name + '" loading="lazy">'
    : placeholderImage(product);

  const badge = product.badge ? '<span class="p-badge">' + product.badge + '</span>' : '';

  return (
    '<article class="product-card reveal" data-cat="' + product.category + '">' +
      '<div class="p-media">' + img + badge +
        '<button class="p-quick" data-add="' + product.id + '" aria-label="Add ' + product.name + ' to cart">' +
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="p-body">' +
        '<span class="p-brand">' + product.brand + '</span>' +
        '<h3 class="p-name">' + product.name + '</h3>' +
        '<div class="p-meta">' +
          '<span class="p-rating">' + window.stars(product.rating) + ' <em>' + product.rating.toFixed(1) + '</em></span>' +
        '</div>' +
        '<div class="p-foot">' +
          '<span class="p-price">' + window.formatPrice(product.price) + '</span>' +
          '<button class="p-add" data-add="' + product.id + '">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' +
            'Add to cart' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
};