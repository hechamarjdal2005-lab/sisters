/* ============================================================
   The Sisters Beauty — general interactions & page logic
   ------------------------------------------------------------
   • Sticky header + scroll shadow
   • Mobile menu (slide-in drawer)
   • Scroll reveal (Intersection Observer) with stagger
   • Home: featured products, category cards, ticker, carousels
   • Shop: render grid, category filter, live search (?cat= deep link)
   • Social-proof tiles + count-up stats (about)
   • Light page fade-in transitions
   ============================================================ */

(function () {
  'use strict';

  const $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  const $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------------- header shadow ---------------- */
  function headerScroll() {
    const header = $('#siteHeader');
    if (!header) return;
    const onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------- mobile menu ---------------- */
  function mobileMenu() {
    const btn = $('#menuBtn');
    const menu = $('#mobileMenu');
    const overlay = $('#menuOverlay');
    if (!btn || !menu) return;

    const set = function (open) {
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.classList.toggle('open', open);
      if (overlay) overlay.classList.toggle('show', open);
    };

    btn.addEventListener('click', function () {
      set(!menu.classList.contains('open'));
    });
    if (overlay) overlay.addEventListener('click', function () { set(false); });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { set(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') set(false);
    });
  }

  /* ---------------- scroll reveal ---------------- */
  function reveal() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- ticker: duplicate content for seamless loop ---------------- */
  function ticker() {
    const track = $('#tickerTrack');
    if (!track) return;
    track.innerHTML += track.innerHTML; // duplicate for a perfect CSS loop
  }

  /* ---------------- homepage: featured products ---------------- */
  function featuredProducts() {
    const grid = $('#featuredGrid');
    if (!grid) return;
    const featured = window.PRODUCTS.filter(function (p) { return p.featured; });
    grid.innerHTML = featured.map(function (p, i) {
      return '<div class="cell reveal" style="transition-delay:' + (i * 60) + 'ms">' +
        window.renderProductCard(p) + '</div>';
    }).join('');
  }

  /* ---------------- homepage: category cards ---------------- */
  function categoryCards() {
    const grid = $('#categoryGrid');
    if (!grid) return;
    grid.innerHTML = window.CATEGORIES.map(function (c, i) {
      return (
        '<a class="cat-card reveal" style="transition-delay:' + (i * 55) + 'ms" href="shop.html?cat=' + c.id + '">' +
          '<span class="cat-emoji" style="background:' + c.grad + '">' + c.emoji + '</span>' +
          '<h3 class="cat-name">' + c.label + '</h3>' +
          '<span class="cat-arrow">Shop now →</span>' +
        '</a>'
      );
    }).join('');
  }

  /* ---------------- homepage: featured brands ---------------- */
  function brandsCarousel() {
    const track = $('#brandsTrack');
    if (!track) return;
    const brands = ['Anua', 'COSRX', 'Medicube', 'SKIN1004', 'Axis-Y', 'Arencia'];
    track.innerHTML = brands.map(function (b) {
      return (
        '<div class="brand-badge">' +
          '<span class="brand-badge-ink" aria-hidden="true">' + b.charAt(0) + '</span>' +
          '<span class="brand-badge-name">' + b + '</span>' +
        '</div>'
      );
    }).join('') + track.innerHTML;
  }

  /* ---------------- homepage: social-proof tiles ---------------- */
  function socialTiles() {
    const grid = $('#socialGrid');
    if (!grid) return;
    const tiles = [
      { h: 'This toner is my holy grail ✨', u: '@sara.kbeauty', g: 'linear-gradient(135deg,#FFD3C2,#FFB7CD)' },
      { h: 'Glass skin achieved 💧', u: '@marrakechglow', g: 'linear-gradient(135deg,#D5F0E6,#FFE6C9)' },
      { h: 'Fast delivery to Casablanca 🚚', u: '@casablancabeauty', g: 'linear-gradient(135deg,#FFE7D1,#FFD0E2)' },
      { h: 'Zero Pore serum is magic ✨', u: '@glowinagadir', g: 'linear-gradient(135deg,#E6D9FF,#FFD6E6)' },
      { h: 'Snail cream, obsessed 🐌', u: '@rabat_routine', g: 'linear-gradient(135deg,#FFF2D6,#FFDCC9)' },
      { h: 'The sisters are so kind 💗', u: '@tanger_tresses', g: 'linear-gradient(135deg,#FFD9E3,#E8DDF6)' },
    ];
    grid.innerHTML = tiles.map(function (t) {
      return (
        '<figure class="social-tile reveal" style="background:' + t.g + '">' +
          '<span class="social-heart">❤</span>' +
          '<blockquote>“' + t.h + '”</blockquote>' +
          '<figcaption>' + t.u + '</figcaption>' +
        '</figure>'
      );
    }).join('');
  }

  /* ---------------- shop page ---------------- */
  function shopPage() {
    const grid = $('#shopGrid');
    if (!grid) return;

    const filterBar = $('#shopFilter');
    const searchInput = $('#shopSearch');
    const resultCount = $('#resultCount');
    const emptyState = $('#shopEmpty');
    const resetBtn = $('#resetShop');

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        activeCat = 'all';
        query = '';
        if (searchInput) searchInput.value = '';
        $$('.pill', filterBar).forEach(function (p) {
          p.classList.toggle('active', p.getAttribute('data-cat') === 'all');
        });
        const url = new URL(window.location);
        url.searchParams.delete('cat');
        history.replaceState(null, '', url);
        render();
      });
    }

    const params = new URLSearchParams(window.location.search);
    let activeCat = params.get('cat') || 'all';
    let query = '';

    /* filter pills */
    if (filterBar) {
      const all = window.CATEGORIES.slice();
      filterBar.innerHTML =
        '<button class="pill' + (activeCat === 'all' ? ' active' : '') + '" data-cat="all">All</button>' +
        all.map(function (c) {
          return '<button class="pill' + (activeCat === c.id ? ' active' : '') + '" data-cat="' + c.id + '">' +
            c.emoji + ' ' + c.label + '</button>';
        }).join('');

      filterBar.addEventListener('click', function (e) {
        const pill = e.target.closest('.pill');
        if (!pill) return;
        activeCat = pill.getAttribute('data-cat');
        $$('.pill', filterBar).forEach(function (p) {
          p.classList.toggle('active', p === pill);
        });
        // keep URL in sync (nice for sharing)
        const url = new URL(window.location);
        if (activeCat === 'all') url.searchParams.delete('cat');
        else url.searchParams.set('cat', activeCat);
        history.replaceState(null, '', url);
        render();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        query = searchInput.value.trim().toLowerCase();
        render();
      });
    }

    function matches(p) {
      if (activeCat !== 'all' && p.category !== activeCat) return false;
      if (!query) return true;
      return (p.name + ' ' + p.brand + ' ' + p.category).toLowerCase().indexOf(query) !== -1;
    }

    function render() {
      const list = window.PRODUCTS.filter(matches);
      if (resultCount) resultCount.textContent = list.length;

      if (!list.length) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
      }
      if (emptyState) emptyState.style.display = 'none';
      grid.innerHTML = list.map(function (p) {
        return '<div class="cell">' + window.renderProductCard(p) + '</div>';
      }).join('');
      reveal(); // re-observe freshly injected cards
    }

    render();
  }

  /* ---------------- about page: count-up stats ---------------- */
  function countUp() {
    const stats = $$('[data-count]');
    if (!stats.length) return;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const dur = 1200;
        const t0 = performance.now();
        const fmt = function (n) { return n.toLocaleString('fr-MA'); };
        const tick = function (now) {
          const p = Math.min((now - t0) / dur, 1);
          el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    stats.forEach(function (s) { io.observe(s); });
  }

  /* ---------------- contact form → WhatsApp ---------------- */
  function contactForm() {
    const form = $('#contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = $('#fName').value.trim();
      const phone = $('#fPhone').value.trim();
      const subject = $('#fSubject').value.trim();
      const message = $('#fMessage').value.trim();

      if (!name || !phone || !message) {
        form.querySelector('.form-note').textContent =
          'Please fill in your name, phone and message 💭';
        return;
      }

      const text =
        'Hello The Sisters Beauty ✨\n' +
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Subject: ' + subject + '\n\n' +
        message;

      window.open('https://wa.me/212623736859?text=' + encodeURIComponent(text), '_blank');
      form.querySelector('.form-note').textContent =
        'Opening WhatsApp… we\'ll reply soon 🌸';
      form.reset();
    });
  }

  /* ---------------- init ---------------- */
  function init() {
    headerScroll();
    mobileMenu();
    reveal();
    ticker();
    featuredProducts();
    categoryCards();
    brandsCarousel();
    socialTiles();
    shopPage();
    countUp();
    contactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();