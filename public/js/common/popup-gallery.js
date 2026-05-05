/**
 * Popup Gallery — Vanilla JS lightbox with swipe, keyboard, and click navigation.
 *
 * Usage:
 *   <script src="https://knuckleheadsff.com/js/common/popup-gallery.min.js"></script>
 *   <script>
 *     initPopupGallery({
 *       triggerSelector: '.popup-gallery-trigger',
 *       imageApiUrl: 'https://knuckleheadsff.com/api/slider-images?league=kdl'
 *     });
 *   </script>
 *
 * Or auto-detect league from page:
 *   <script>initPopupGallery();</script>
 */
function initPopupGallery(options) {
  'use strict';

  var opts = options || {};
  var triggerSelector = opts.triggerSelector || '.popup-gallery-trigger';
  var imageApiUrl = opts.imageApiUrl || null;

  // Auto-detect league from body ID if no URL provided
  if (!imageApiUrl) {
    var bodyId = document.querySelector('[id^="body-"]');
    var league = bodyId ? bodyId.id.replace('body-', '') : '';
    imageApiUrl = 'https://knuckleheadsff.com/api/slider-images' + (league ? '?league=' + league : '');
  }

  var images = null;
  var currentIndex = 0;
  var overlay = null;
  var imgEl = null;
  var counterEl = null;
  var touchStartX = 0;
  var touchStartY = 0;

  // Inject styles once
  if (!document.getElementById('popup-gallery-styles')) {
    var style = document.createElement('style');
    style.id = 'popup-gallery-styles';
    style.textContent =
      '.pg-overlay{position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.88);display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;cursor:pointer}' +
      '.pg-overlay.pg-active{opacity:1;visibility:visible}' +
      '.pg-img-wrap{position:relative;max-width:90vw;max-height:85vh;cursor:default}' +
      '.pg-img-wrap img{display:block;max-width:90vw;max-height:85vh;object-fit:contain;border-radius:4px;transition:opacity .25s ease;user-select:none;-webkit-user-drag:none}' +
      '.pg-img-wrap img.pg-loading{opacity:0}' +
      '.pg-close{position:fixed;top:16px;right:20px;color:#fff;font-size:28px;cursor:pointer;z-index:100001;opacity:.7;transition:opacity .2s;font-family:Arial,sans-serif;line-height:1;padding:8px}' +
      '.pg-close:hover{opacity:1}' +
      '.pg-arrow{position:fixed;top:50%;transform:translateY(-50%);color:#fff;font-size:36px;cursor:pointer;z-index:100001;opacity:.6;transition:opacity .2s;font-family:Arial,sans-serif;padding:12px;user-select:none}' +
      '.pg-arrow:hover{opacity:1}' +
      '.pg-arrow-left{left:12px}' +
      '.pg-arrow-right{right:12px}' +
      '.pg-counter{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);color:#ccc;font-size:14px;font-family:Arial,sans-serif;z-index:100001;user-select:none}';
    document.head.appendChild(style);
  }

  // Build overlay DOM
  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'pg-overlay';

    var close = document.createElement('span');
    close.className = 'pg-close';
    close.innerHTML = '&#10005;';
    close.addEventListener('click', hideGallery);

    var arrowLeft = document.createElement('span');
    arrowLeft.className = 'pg-arrow pg-arrow-left';
    arrowLeft.innerHTML = '&#10094;';
    arrowLeft.addEventListener('click', function(e) { e.stopPropagation(); showPrev(); });

    var arrowRight = document.createElement('span');
    arrowRight.className = 'pg-arrow pg-arrow-right';
    arrowRight.innerHTML = '&#10095;';
    arrowRight.addEventListener('click', function(e) { e.stopPropagation(); showNext(); });

    var wrap = document.createElement('div');
    wrap.className = 'pg-img-wrap';
    wrap.addEventListener('click', function(e) { e.stopPropagation(); });

    imgEl = document.createElement('img');
    imgEl.alt = 'Gallery image';
    imgEl.draggable = false;
    wrap.appendChild(imgEl);

    counterEl = document.createElement('div');
    counterEl.className = 'pg-counter';

    overlay.appendChild(close);
    overlay.appendChild(arrowLeft);
    overlay.appendChild(arrowRight);
    overlay.appendChild(wrap);
    overlay.appendChild(counterEl);

    // Click backdrop to close
    overlay.addEventListener('click', hideGallery);

    // Touch/swipe
    overlay.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    overlay.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].screenX - touchStartX;
      var dy = e.changedTouches[0].screenY - touchStartY;
      // Only swipe if horizontal movement > vertical and > 50px threshold
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) showNext();
        else showPrev();
      }
    }, { passive: true });

    document.body.appendChild(overlay);
  }

  function showImage(index) {
    if (!images || images.length === 0) return;
    currentIndex = ((index % images.length) + images.length) % images.length;
    imgEl.classList.add('pg-loading');
    imgEl.onload = function() { imgEl.classList.remove('pg-loading'); };
    imgEl.src = images[currentIndex];
    counterEl.textContent = (currentIndex + 1) + ' / ' + images.length;
  }

  function showNext() { showImage(currentIndex + 1); }
  function showPrev() { showImage(currentIndex - 1); }

  function showGallery() {
    if (!overlay) buildOverlay();
    if (!images) {
      // Fetch images on first open
      fetch(imageApiUrl)
        .then(function(r) { return r.json(); })
        .then(function(data) {
          images = data;
          showImage(0);
          overlay.classList.add('pg-active');
          document.body.style.overflow = 'hidden';
        })
        .catch(function(err) { console.error('Popup Gallery: failed to load images', err); });
    } else {
      showImage(0);
      overlay.classList.add('pg-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function hideGallery() {
    if (overlay) {
      overlay.classList.remove('pg-active');
      document.body.style.overflow = '';
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!overlay || !overlay.classList.contains('pg-active')) return;
    if (e.key === 'Escape') hideGallery();
    else if (e.key === 'ArrowRight') showNext();
    else if (e.key === 'ArrowLeft') showPrev();
  });

  // Bind trigger elements
  function bindTriggers() {
    var triggers = document.querySelectorAll(triggerSelector);
    triggers.forEach(function(el) {
      if (el.dataset.pgBound) return;
      el.dataset.pgBound = 'true';
      el.addEventListener('click', function(e) {
        e.preventDefault();
        showGallery();
      });
    });
  }

  // Init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindTriggers);
  } else {
    bindTriggers();
  }

  // Return API for programmatic control
  return { show: showGallery, hide: hideGallery, next: showNext, prev: showPrev };
}
