/* Auto-hiding nav bar.
   - Scrolling down past a small threshold slides the nav (and the ticker strip
     riding just under it) up out of view.
   - Scrolling up, sitting near the top of the page, moving the mouse to the very
     top edge of the viewport, or opening the mobile menu all bring it back.
   Kept as its own plain file on purpose, same reasoning as gh-activity.js and
   snowflake-widget.js — see PROTECTED-BUILD-README.md. */
(function () {
  var nav = document.querySelector('nav');
  if (!nav) return;
  var ticker = document.querySelector('.ticker-wrap');

  var lastY = Math.max(0, window.scrollY || 0);
  var hidden = false;
  var ticking = false;
  var SHOW_AT_TOP = 80;   // always show while near the very top of the page
  var DELTA = 4;          // ignore tiny scroll jitter

  function isMobileMenuOpen() {
    var m = document.getElementById('mobileMenu');
    return !!m && getComputedStyle(m).display === 'block';
  }

  function setHidden(state) {
    if (state === hidden) return;
    hidden = state;
    nav.classList.toggle('nav-autohidden', hidden);
    if (ticker) {
      var navH = nav.offsetHeight;
      ticker.style.transform = hidden ? 'translateY(-' + navH + 'px)' : 'translateY(0)';
    }
  }

  function onScroll() {
    var y = Math.max(0, window.scrollY || 0);
    if (isMobileMenuOpen()) {
      setHidden(false);
    } else if (y <= SHOW_AT_TOP) {
      setHidden(false);
    } else if (y > lastY + DELTA) {
      setHidden(true);
    } else if (y < lastY - DELTA) {
      setHidden(false);
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // Desktop convenience: nudging the cursor to the top edge reveals the nav
  // even mid-scroll, without needing to scroll back up.
  window.addEventListener('mousemove', function (e) {
    if (e.clientY <= 6) setHidden(false);
  });

  window.addEventListener('resize', function () {
    if (!hidden && ticker) ticker.style.transform = 'translateY(0)';
  });
})();
