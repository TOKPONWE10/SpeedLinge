(function () {
  var NUMERO = '22995050715';
  var doc = document.documentElement;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  // Liens WhatsApp : le message prérempli est écrit en clair dans data-wa.
  $$('a[data-wa]').forEach(function (a) {
    a.href = 'https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(a.getAttribute('data-wa'));
  });

  // En-tête et bouton flottant
  var header = $('#hd');
  var waf = $('#waf');
  function onScroll() {
    var y = window.scrollY || doc.scrollTop;
    if (header) header.classList.toggle('is-solid', y > 24);
    if (waf) waf.classList.toggle('on', y > 480);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  var burger = $('#burger');
  var menu = $('#menu');
  function setMenu(open) {
    if (!burger || !menu) return;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    header.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 980 && !menu.hidden) setMenu(false); });
  }

  // Apparition au défilement (la classe js n'est posée que si c'est jouable)
  if (doc.classList.contains('js')) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('on');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    $$('.rv').forEach(function (el) { io.observe(el); });
  }

  // Ouvert ou fermé, à l'heure de Parakou (UTC+1 toute l'année).
  // Mardi au dimanche, 9 h – 19 h ; fermé le lundi.
  var status = $('#status');
  if (status) {
    var now = new Date(Date.now() + 3600000);
    var day = now.getUTCDay();
    var hour = now.getUTCHours();
    var isOpenDay = function (d) { return d !== 1; };
    var text;
    if (isOpenDay(day) && hour >= 9 && hour < 19) {
      status.classList.add('is-open');
      text = 'Ouvert en ce moment, jusqu’à 19 h';
    } else if (isOpenDay(day) && hour < 9) {
      text = 'Fermé pour l’instant, ouvre à 9 h';
    } else if (isOpenDay((day + 1) % 7)) {
      text = 'Fermé, ouvre demain à 9 h';
    } else {
      text = 'Fermé, ouvre mardi à 9 h';
    }
    status.querySelector('span').textContent = text;
  }

  // Le formulaire compose un message WhatsApp : rien n'est envoyé à un serveur.
  var form = $('#ct-form');
  if (form) {
    var err = $('#ct-err');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
      };
      if (!v('ct-prenom') || !v('ct-message')) {
        if (err) err.hidden = false;
        (v('ct-prenom') ? document.getElementById('ct-message') : document.getElementById('ct-prenom')).focus();
        return;
      }
      if (err) err.hidden = true;

      var lignes = ['Bonjour SpeedLinge,', ''];
      lignes.push('Nom : ' + (v('ct-prenom') + ' ' + v('ct-nom')).trim());
      if (v('ct-tel')) lignes.push('Téléphone : ' + v('ct-tel'));
      if (v('ct-sujet')) lignes.push('Sujet : ' + v('ct-sujet'));
      lignes.push('', v('ct-message'));

      window.open('https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(lignes.join('\n')), '_blank', 'noopener');
    });
  }
})();
