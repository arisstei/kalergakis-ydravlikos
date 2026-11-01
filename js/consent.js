/* Cookie consent: Google Consent Mode v2 (analytics only) */
(function () {
  var KEY = 'cookie-consent';
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function update(v) {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: v === 'granted' ? 'granted' : 'denied' });
    }
  }

  function clearGaCookies() {
    var host = location.hostname.split('.');
    var domains = ['', location.hostname, '.' + location.hostname];
    if (host.length > 2) domains.push('.' + host.slice(-2).join('.'));
    else domains.push('.' + location.hostname.replace(/^www\./, ''));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid' || name.indexOf('_gat') === 0) {
        domains.forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }

  var banner;
  function build() {
    banner = document.createElement('div');
    banner.id = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Συναίνεση για cookies');
    banner.innerHTML =
      '<div class="cc-box">' +
        '<div><div class="cc-title">Χρησιμοποιούμε cookies στατιστικών</div>' +
        '<div>Με τη συναίνεσή σας χρησιμοποιούμε το Google Analytics για να καταλάβουμε πώς χρησιμοποιείται το site και να το βελτιώνουμε. Δεν χρησιμοποιούμε cookies διαφήμισης. ' +
        '<a href="/politiki-aporritou/">Περισσότερα</a></div></div>' +
        '<div class="cc-actions">' +
          '<button type="button" class="cc-reject">Απόρριψη</button>' +
          '<button type="button" class="cc-accept">Αποδοχή</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);
    banner.querySelector('.cc-accept').addEventListener('click', function () { choose('granted'); });
    banner.querySelector('.cc-reject').addEventListener('click', function () { choose('denied'); });
  }

  function show() {
    if (!banner) build();
    banner.classList.add('cc-show');
  }
  function hide() { if (banner) banner.classList.remove('cc-show'); }

  function choose(v) {
    set(v);
    update(v);
    if (v !== 'granted') clearGaCookies();
    hide();
  }

  function init() {
    var saved = get();
    if (saved === 'granted' || saved === 'denied') update(saved);
    else show();
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-cookie-settings]');
      if (t) { e.preventDefault(); show(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
