/* Shared utilities for Not2BeeHonest */

// ── Navigation ──────────────────────────────────────────────
(function () {
  const menuBtn  = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }

  // Mark active nav link
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') && path.endsWith(a.getAttribute('href'))) {
      a.classList.add('active');
    }
  });
})();

// ── Scroll to top ───────────────────────────────────────────
(function () {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ── Reveal on scroll ────────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();

// ── Toast ─────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; document.body.appendChild(toast); }
  toast.textContent = msg;
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  });
}
window.showToast = showToast;

// ── Data helpers (fetch JSON with localStorage cache fallback) ──
async function loadData(file) {
  const key = 'n2bh_' + file.replace(/\//g, '_');
  try {
    const res = await fetch(file + '?v=' + Date.now());
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    return data;
  } catch {
    const cached = localStorage.getItem(key);
    if (cached) { try { return JSON.parse(cached); } catch {} }
    return null;
  }
}
window.loadData = loadData;

function saveData(file, data) {
  const key = 'n2bh_' + file.replace(/\//g, '_');
  localStorage.setItem(key, JSON.stringify(data));
}
window.saveData = saveData;

// ── Format date ─────────────────────────────────────────────
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
window.fmtDate = fmtDate;

// ── Read time ───────────────────────────────────────────────
function readTime(text) {
  const words = (text || '').split(/\s+/).length;
  return Math.max(1, Math.round(words / 200)) + ' min read';
}
window.readTime = readTime;

// ── URL params ──────────────────────────────────────────────
function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}
window.getParam = getParam;

// ── SHA-256 (Web Crypto) ────────────────────────────────────
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
window.sha256 = sha256;