// script.js - tiles expand in-place, visuals hidden when expanded, reveal animations
document.addEventListener('DOMContentLoaded', () => {
  // set year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // collapse all expanded tiles
  function collapseAll() {
    document.querySelectorAll('.tile.expanded').forEach(t => {
      t.classList.remove('expanded');
    });
    document.querySelectorAll('.nav-btn').forEach(b => b.setAttribute('aria-expanded','false'));
  }

  // expand a tile (only one at a time)
  function expandTile(tile) {
    if (!tile) return;
    const was = tile.classList.contains('expanded');
    collapseAll();
    if (!was) {
      tile.classList.add('expanded');

      // mark nav button aria-expanded
      const key = tile.dataset.key || tile.dataset.target;
      if (key) {
        const nav = document.querySelector(`.nav-btn[data-target="${key}"]`);
        if (nav) nav.setAttribute('aria-expanded','true');
      }

      // animate content entrance: small delay so CSS transitions for hiding visual finish
      const body = tile.querySelector('.tile-body');
      if (body) {
        body.style.opacity = '0';
        body.style.transform = 'translateY(8px)';
        // force paint then animate
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            body.style.transition = 'opacity 320ms ease, transform 320ms ease';
            body.style.opacity = '1';
            body.style.transform = 'translateY(0)';
          });
        });
      }

      // bring into view
      tile.scrollIntoView({ behavior: 'smooth', block: 'center' });
      tile.focus();
    }
  }

  // attach handlers to tiles
  document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', (e) => {
      // allow links inside tiles to keep normal behavior
      if (e.target.closest('a')) return;
      expandTile(tile);
    });

    tile.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        expandTile(tile);
      } else if (e.key === 'Escape') {
        collapseAll();
      }
    });
  });

  // nav buttons -> open matching tile
  document.querySelectorAll('.nav-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.target;
      const tile = document.querySelector(`.tile[data-key="${key}"], .tile[data-target="${key}"]`);
      if (tile) expandTile(tile);
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const key = btn.dataset.target;
        const tile = document.querySelector(`.tile[data-key="${key}"], .tile[data-target="${key}"]`);
        if (tile) expandTile(tile);
      }
    });
  });

  // clicking outside collapses all
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.tile') && !e.target.closest('.nav-btn')) collapseAll();
  });

  // Esc closes
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') collapseAll(); });

  // Scroll reveal (fade + slide up)
  const revealEls = document.querySelectorAll('.reveal, .exp-card, .proj-card, .tiles-section');
  revealEls.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) en.target.classList.add('visible');
    });
  }, { threshold: 0.08 });
  revealEls.forEach(el => io.observe(el));
});
