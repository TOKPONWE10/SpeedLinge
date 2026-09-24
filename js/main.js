/* ============================================
   SPEEDLINGE — Scripts principaux
   ============================================ */

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* ============================================
   MENU MOBILE
   ============================================ */
const ham = $('#ham');
const drawer = $('#m-dr');
const overlay = $('#m-ov');
const closeBtn = $('#m-x');

const openDrawer = () => {
    drawer.classList.add('on');
    overlay.classList.add('on');
    document.body.style.overflow = 'hidden';
};

const closeDrawer = () => {
    drawer.classList.remove('on');
    overlay.classList.remove('on');
    document.body.style.overflow = '';
};

ham.onclick = openDrawer;
closeBtn.onclick = closeDrawer;
overlay.onclick = closeDrawer;
drawer.querySelectorAll('a').forEach(a => a.onclick = closeDrawer);

/* ============================================
   NAVBAR — fond au scroll
   ============================================ */
const nav = $('#nav');

window.addEventListener('scroll', () => {
    nav.classList.toggle('solid', scrollY > 60);
});

/* ============================================
   BOUTON RETOUR EN HAUT
   ============================================ */
const btt = $('#btt');

window.addEventListener('scroll', () => {
    btt.classList.toggle('on', scrollY > 500);
});

btt.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

/* ============================================
   SCROLL FLUIDE SUR LES ANCRES
   ============================================ */
$$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target) scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    });
});

/* ============================================
   SCROLL REVEAL — apparition au défilement
   ============================================ */
const revealObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('on');
            revealObserver.unobserve(entry.target);
        }
    }),
    { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
);

$$('.rv').forEach(el => revealObserver.observe(el));

/* ============================================
   EFFET IMAGE AU SCROLL (clip-path reveal)
   ============================================ */
const srSection = $('#sr');
const srImg = $('#sr-img');
const srOverlay = $('#sr-over');

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function updateScrollReveal() {
    if (!srSection) return;

    const rect = srSection.getBoundingClientRect();
    const height = srSection.offsetHeight;
    const vh = innerHeight;

    const progress = Math.max(0, Math.min(1, (vh - rect.top) / (height + vh)));
    const eased = easeOutCubic(progress);

    const inset = 35 - 35 * eased;
    const scale = 1.25 - 0.25 * eased;
    const radius = 24 - 20 * eased;

    srImg.style.clipPath = `inset(${inset}% round ${radius}px)`;
    srImg.style.transform = `scale(${scale})`;
    srOverlay.classList.toggle('on', progress > 0.7);
}

window.addEventListener('scroll', updateScrollReveal, { passive: true });
updateScrollReveal();

/* Formulaire de contact.
   Il n'avait ni action ni gestionnaire, et aucun champ ne portait de name :
   l'envoi rechargeait la page et le message du visiteur était perdu. Il compose
   désormais un message WhatsApp, comme le reste des boutons du site. */
(function () {
  var form = document.getElementById('ct-form');
  if (!form) return;

  var NUMERO = '22995050715';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    var lignes = [
      'Bonjour SpeedLinge,',
      '',
      'Nom : ' + v('ct-prenom') + ' ' + v('ct-nom'),
      v('ct-tel') ? 'Téléphone : ' + v('ct-tel') : '',
      v('ct-email') ? 'Email : ' + v('ct-email') : '',
      v('ct-sujet') ? 'Sujet : ' + v('ct-sujet') : '',
      '',
      v('ct-message')
    ].filter(function (l, i) { return l !== '' || i === 1 || i === 6; });

    window.open('https://wa.me/' + NUMERO + '?text=' +
                encodeURIComponent(lignes.join('\n')), '_blank');
  });
})();
