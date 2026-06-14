const VALUE_DATA = {
  safe: {
    icon: '\uD83D\uDEE1\uFE0F',
    en_title: 'Safe',
    es_title: 'Seguro',
    art: `<img class="vm-img" src="images/values-safe.jpg" alt="Children safely welcomed at the Mini Star Child Care entrance">`,
    en_desc: 'At Mini Star Child Care, safety always comes first. Our facility is secure, clean, and fully child-proofed. We maintain careful supervision at all times, follow strict safety protocols, and ensure every child is protected throughout the day. Parents can have complete peace of mind knowing their children are in a safe, well-maintained environment with trained, attentive caregivers.',
    es_desc: 'En Mini Star Child Care, la seguridad siempre es lo primero. Nuestras instalaciones son seguras, limpias y completamente adaptadas para ninos. Mantenemos una supervision cuidadosa en todo momento, seguimos estrictos protocolos de seguridad y nos aseguramos de que cada nino este protegido durante todo el dia.'
  },
  loving: {
    icon: '\uD83D\uDC9B',
    en_title: 'Loving',
    es_title: 'Carinoso',
    art: `<img class="vm-img" src="images/values-loving.jpg" alt="Caring teacher warmly helping children paint">`,
    en_desc: 'Every child deserves to feel loved and valued. Our caregivers build warm, nurturing bonds with each child, offering comfort, encouragement, and emotional support every single day. We believe that when children feel genuinely cared for, they develop confidence, trust, and a strong sense of belonging. At Mini Star, love is at the heart of everything we do.',
    es_desc: 'Cada nino merece sentirse amado y valorado. Nuestros cuidadores construyen vinculos calidos y afectuosos con cada nino, ofreciendo consuelo, aliento y apoyo emocional todos los dias. Creemos que cuando los ninos se sienten genuinamente queridos, desarrollan confianza y un fuerte sentido de pertenencia.'
  },
  learning: {
    icon: '\uD83D\uDCDA',
    en_title: 'Learning',
    es_title: 'Aprendizaje',
    art: `<img class="vm-img" src="images/values-learning.jpg" alt="Teacher reading a learning book with classroom materials">`,
    en_desc: 'We believe every moment is a chance to learn something new. Through age-appropriate activities, stories, songs, creative art, and hands-on exploration, we spark curiosity and build a strong foundation for lifelong learning. Our programs are designed to develop early literacy, math concepts, problem-solving skills, and a genuine love for discovery — all through the joy of play.',
    es_desc: 'Creemos que cada momento es una oportunidad para aprender algo nuevo. A traves de actividades apropiadas para cada edad, cuentos, canciones, arte creativo y exploracion practica, despertamos la curiosidad y construimos una base solida para el aprendizaje de toda la vida.'
  },
  growing: {
    icon: '\u2B50',
    en_title: 'Growing',
    es_title: 'Crecimiento',
    art: `<img class="vm-img" src="images/values-growing.jpg" alt="Children growing, building and measuring their height">`,
    en_desc: 'We celebrate every milestone, big and small. From first steps to first friendships, we support each child\'s physical, social, and emotional growth at their own pace. Our caring environment helps children build confidence, independence, resilience, and essential life skills. At Mini Star, we nurture the whole child — mind, body, and spirit — so they can blossom into their brightest selves.',
    es_desc: 'Celebramos cada logro, grande y pequeno. Desde los primeros pasos hasta las primeras amistades, apoyamos el crecimiento fisico, social y emocional de cada nino a su propio ritmo. En Mini Star, nutrimos al nino completo para que puedan florecer y brillar.'
  }
};

let CURRENT_VALUE = null;
function openValue(key) {
  CURRENT_VALUE = key;
  renderValuePage();
  goTo('value');
}
function renderValuePage() {
  const d = VALUE_DATA[CURRENT_VALUE];
  const root = document.getElementById('value-page-root');
  if (!d || !root) return;
  const isEs = typeof LANG !== 'undefined' && LANG === 'es';
  root.innerHTML = `
    <button class="back-btn" onclick="goTo('home')">← ${isEs ? 'Volver al Inicio' : 'Back to Home'}</button>
    ${d.art}
    <div class="vp-badge"><span class="vp-icon">${d.icon}</span> <span>${isEs ? d.es_title : d.en_title}</span></div>
    <p class="vp-desc">${isEs ? d.es_desc : d.en_desc}</p>
    <button class="back-btn" onclick="goTo('home')">← ${isEs ? 'Volver al Inicio' : 'Back to Home'}</button>`;
}
const _langBtn = document.getElementById('lang-toggle');
if (_langBtn) _langBtn.addEventListener('click', () => {
  const vp = document.getElementById('page-value');
  if (vp && vp.classList.contains('active')) renderValuePage();
});
