/* ============================================================
   The Sisters Beauty — Cart logic (vanilla JS)
   ------------------------------------------------------------
   • Cart persisted in localStorage so it survives page changes
   • Sidebar / bottom-sheet panel + badge count
   • "Order via WhatsApp" builds a formatted recap message
   ============================================================ */

(function () {
  'use strict';

  const CART_KEY = 'sisters_cart_v1';
  const WHATSAPP_NUMBER = '212623736859'; // +212 6 23 73 68 59

  let cart = {};           // { productId: quantity }
  let open = false;

  /* ---------------- helpers ---------------- */
  const $ = function (sel) { return document.querySelector(sel); };

  function load() {
    try {
      cart = JSON.parse(localStorage.getItem(CART_KEY)) || {};
    } catch (e) {
      cart = {};
    }
    // prune unknown / invalid entries
    Object.keys(cart).forEach(function (id) {
      const p = window.getProduct(id);
      if (!p || !(cart[id] > 0)) delete cart[id];
    });
  }

  function save() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  function totalItems() {
    return Object.keys(cart).reduce(function (sum, id) { return sum + cart[id]; }, 0);
  }

  function totalPrice() {
    return Object.keys(cart).reduce(function (sum, id) {
      return sum + (window.getProduct(id).price * cart[id]);
    }, 0);
  }

  /* ---------------- cart panel DOM ---------------- */
  function buildPanel() {
    if ($('#cartPanel')) return;

    const markup =
      '<div class="cart-overlay" id="cartOverlay"></div>' +
      '<aside class="cart-panel" id="cartPanel" aria-label="Shopping cart" aria-hidden="true">' +
        '<header class="cart-head">' +
          '<h2 class="cart-title">Your Bag <span id="cartCountLabel"></span></h2>' +
          '<button class="cart-close icon-btn" id="cartClose" aria-label="Close cart">' +
            '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
          '</button>' +
        '</header>' +
        '<div class="cart-body">' +
          '<div class="cart-items" id="cartItems"></div>' +
          '<div class="cart-empty" id="cartEmpty">' +
            '<span class="cart-empty-emoji">🛍️</span>' +
            '<h3>Your bag is feeling light</h3>' +
            '<p>Add some glass-skin glow to your routine.</p>' +
            '<a href="shop.html" class="btn btn-primary" id="cartShopLink">Explore the shop</a>' +
          '</div>' +
        '</div>' +
        '<footer class="cart-foot">' +
          '<div class="cart-subtotal">' +
            '<span>Subtotal</span>' +
            '<strong id="cartSubtotal">0 DH</strong>' +
          '</div>' +
          '<p class="cart-note">Delivery all over Morocco — calculated on WhatsApp</p>' +
          '<a class="btn-wa" id="waCheckout" target="_blank" rel="noopener">' +
            '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.58-.35ZM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.9 7 9.9 9.9 0 0 1-9.9 9.87Zm8.4-18.3A11.8 11.8 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.6 5.95L.05 24l6.33-1.66a11.9 11.9 0 0 0 5.67 1.44h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.5-8.4Z"/></svg>' +
            'Order via WhatsApp' +
          '</a>' +
          '<a href="shop.html" class="cart-continue">Continue shopping</a>' +
        '</footer>' +
      '</aside>';

    const wrap = document.createElement('div');
    wrap.innerHTML = markup;
    document.body.appendChild(wrap);

    $('#cartOverlay').addEventListener('click', closeCart);
    $('#cartClose').addEventListener('click', closeCart);
    $('#waCheckout').addEventListener('click', checkoutWhatsApp);

    // quantity / remove handled by event delegation on the item list
    $('#cartItems').addEventListener('click', function (e) {
      const btn = e.target.closest('[data-cart]');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-cart');
      if (action === 'inc') changeQty(id, 1);
      if (action === 'dec') changeQty(id, -1);
      if (action === 'remove') removeFromCart(id);
    });
  }

  /* ---------------- cart row markup ---------------- */
  function renderRow(id) {
    const p = window.getProduct(id);
    const qty = cart[id];
    const img = p.image
      ? '<img src="' + p.image + '" alt="' + p.name + '">'
      : '<span class="c-ph" style="background:' + window.brandTint(p.brand) + '">' +
        '<span class="c-ph-letter">' + p.brand.charAt(0) + '</span></span>';

    return (
      '<div class="cart-item" data-id="' + id + '">' +
        '<div class="c-thumb">' + img + '</div>' +
        '<div class="c-info">' +
          '<span class="c-brand">' + p.brand + '</span>' +
          '<h4 class="c-name">' + p.name + '</h4>' +
          '<span class="c-price">' + window.formatPrice(p.price) + '</span>' +
        '</div>' +
        '<div class="c-right">' +
          '<button class="c-remove" data-cart="remove" data-id="' + id + '" aria-label="Remove ' + p.name + '">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
          '</button>' +
          '<div class="c-qty">' +
            '<button data-cart="dec" data-id="' + id + '" aria-label="Decrease quantity">−</button>' +
            '<span>' + qty + '</span>' +
            '<button data-cart="inc" data-id="' + id + '" aria-label="Increase quantity">+</button>' +
          '</div>' +
          '<span class="c-line">' + window.formatPrice(p.price * qty) + '</span>' +
        '</div>' +
      '</div>'
    );
  }

  /* ---------------- render / badge ---------------- */
  function render() {
    const panel = $('#cartPanel');
    const itemsEl = $('#cartItems');
    const emptyEl = $('#cartEmpty');
    const foot = panel.querySelector('.cart-foot');
    const ids = Object.keys(cart);

    itemsEl.innerHTML = ids.map(renderRow).join('');

    const hasItems = ids.length > 0;
    emptyEl.style.display = hasItems ? 'none' : 'block';
    foot.style.display = hasItems ? '' : 'none';

    $('#cartCountLabel').textContent = hasItems ? '(' + totalItems() + ')' : '';
    $('#cartSubtotal').textContent = window.formatPrice(totalPrice());
    updateBadge();
  }

  function updateBadge() {
    const badge = $('#cartBadge');
    if (!badge) return;
    const n = totalItems();
    badge.textContent = n;
    badge.classList.toggle('hidden', n === 0);
    if (n > 0) {
      badge.classList.remove('pulse');
      void badge.offsetWidth; // restart animation
      badge.classList.add('pulse');
    }
  }

  /* ---------------- public actions ---------------- */
  function addToCart(id, qty) {
    const p = window.getProduct(id);
    if (!p) return;
    cart[id] = (cart[id] || 0) + (qty || 1);
    save();
    render();

    const btn = $('#cartBtn');
    if (btn) {
      btn.classList.remove('bounce');
      void btn.offsetWidth;
      btn.classList.add('bounce');
    }
    showToast(p.name);
  }

  function changeQty(id, delta) {
    const p = window.getProduct(id);
    if (!p) return;
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    save();
    render();
  }

  function removeFromCart(id) {
    delete cart[id];
    save();
    render();
  }

  /* ---------------- open / close ---------------- */
  function openCart() {
    if (!open) {
      open = true;
      document.body.classList.add('cart-open');
      $('#cartPanel').setAttribute('aria-hidden', 'false');
      $('#cartOverlay').classList.add('show');
      $('#cartPanel').classList.add('open');
    }
  }

  function closeCart() {
    if (!open) return;
    open = false;
    document.body.classList.remove('cart-open');
    $('#cartPanel').classList.remove('open');
    $('#cartOverlay').classList.remove('show');
    $('#cartPanel').setAttribute('aria-hidden', 'true');
  }

  /* ---------------- WhatsApp checkout ---------------- */
  function checkoutWhatsApp(e) {
    const ids = Object.keys(cart);
    if (!ids.length) {
      e.preventDefault();
      showToast('Your bag is empty 💭');
      return;
    }
    const lines = ids.map(function (id) {
      const p = window.getProduct(id);
      return '• ' + p.name + ' (x' + cart[id] + ') — ' + window.formatPrice(p.price * cart[id]);
    });
    const message =
      'Hello The Sisters Beauty ✨\n' +
      'I would like to order:\n' +
      lines.join('\n') + '\n\n' +
      'Total: ' + window.formatPrice(totalPrice()) + '\n\n' +
      'Thank you! 🌸';

    e.currentTarget.setAttribute('href',
      'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message));
  }

  /* ---------------- toast ---------------- */
  function showToast(msg) {
    let toast = $('#toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML =
      '<span class="toast-check">✓</span><span>' + msg + '</span><em>added to bag</em>';
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  /* ---------------- init ---------------- */
  function init() {
    load();
    buildPanel();
    render();

    const cartBtn = $('#cartBtn');
    if (cartBtn) cartBtn.addEventListener('click', openCart);

    // Escape key closes the cart
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCart();
    });

    // Any element carrying a [data-add] attribute adds to cart
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-add]');
      if (!btn) return;
      addToCart(btn.getAttribute('data-add'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.openCart = openCart;
  window.closeCart = closeCart;
  window.addToCart = addToCart;
})();