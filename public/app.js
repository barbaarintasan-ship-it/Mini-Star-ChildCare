/* ============================================================
   Mini Star Child Care — Combined App
   Design: ministar-fly (night/gold/coral/teal palette)
   Features: auth, admin/teacher/parent portals, payments, messages
   Storage: localStorage (no server required)
   ============================================================ */

/* ---------- i18n ---------- */
let LANG = 'en';
let EDIT_CHILD_ID = null;
const I18N_ES = {
  nav_home:'Inicio',nav_about:'Nosotros',nav_programs:'Programas',nav_enrollment:'Inscripcion',nav_contact:'Contacto',nav_login:'Acceso',
  tab_home:'Inicio',tab_about:'Nosotros',tab_programs:'Programas',tab_enroll:'Inscribir',tab_contact:'Contacto',tab_login:'Acceso',
  hero_badge:'Cuidamos ninos desde recien nacidos hasta los 12 anos',
  hero_h1:'Bienvenidos a <span class="gold">Mini Star</span><br>Child Care',
  hero_tag:'Un lugar seguro, carinoso y acogedor donde cada nino puede aprender, crecer y brillar.',
  hero_enroll:'Inscribase Hoy',hero_progs:'Nuestros Programas',
  home_eyebrow:'Donde comienzan futuros brillantes',home_h2:'Cada nino es unico',
  home_p1:'En Mini Star Child Care, ofrecemos un lugar seguro, carinoso y acogedor donde cada nino puede aprender, crecer y brillar.',
  home_p2:'Nuestro objetivo es dar tranquilidad a las familias sabiendo que sus hijos estan en un ambiente de cuidado todos los dias.',
  home_lead:'Unase a la familia de Mini Star Child Care, donde comienzan futuros brillantes.',
  val_safe:'Seguro',val_loving:'Carinoso',val_learning:'Aprendizaje',val_growing:'Crecimiento',
  about_eyebrow:'Nosotros',about_h2:'Construido sobre amor, confianza, aprendizaje y apoyo familiar',
  about_p1:'Entendemos que elegir el cuidado infantil es una decision importante. Por eso estamos comprometidos a brindar un ambiente calido y hogareno.',
  about_p2:'Creemos que los ninos aprenden mejor a traves de experiencias positivas, juego significativo y relaciones de carino.',
  about_mission:'Nuestra mision es simple: cuidar a los ninos con amor mientras los ayudamos a aprender y prosperar cada dia.',
  about_btn:'Ver Nuestros Programas',
  prog_eyebrow:'Programas',prog_h2:'Cuidado para cada edad, desde recien nacidos hasta los 12 anos',
  prog_intro:'Nuestros programas estan disenados para satisfacer las necesidades de cada grupo de edad:',
  prog_infants:'Bebes',age_infants:'0-1 ano',prog_infants_p:'Cuidado tierno, confort, alimentacion y apoyo al desarrollo temprano.',
  prog_toddlers:'Ninos Pequenos',age_toddlers:'1-3 anos',prog_toddlers_p:'Juego seguro, desarrollo del lenguaje, movimiento y aprendizaje a traves de rutinas.',
  prog_pre:'Preescolares',age_pre:'3-5 anos',prog_pre_p:'Actividades de educacion temprana, creatividad y preparacion escolar.',
  prog_school:'Edad Escolar',age_school:'5-12 anos',prog_school_p:'Apoyo con tareas, actividades divertidas y cuidado despues de la escuela.',
  prog_daily:'Cada dia incluye:',
  prog_li1:'Aprendizaje apropiado para cada edad',prog_li2:'Tiempo de juego y desarrollo social',
  prog_li3:'Supervision atenta y carinosa',prog_li4:'Espacio para explorar, descubrir y crecer a su propio ritmo',
  prog_close:'Nuestro programa ayuda a los ninos a desarrollar confianza, independencia y amor por el aprendizaje.',
  prog_btn:'Pregunte por Cupos',
  en_eyebrow:'Inscripcion',en_h2:'Nos alegra dar la bienvenida a nuevas familias',
  en_p:'Si esta interesado en inscribir a su hijo, contactenos para preguntar sobre cupos y disponibilidad.',
  en_how:'Como inscribirse',en_s1b:'Contactenos',en_s1s:'Comuniquese por telefono o correo para preguntar sobre disponibilidad.',
  en_s2b:'Haga sus preguntas',en_s2s:'Estamos aqui para responder sus preguntas y hacer el proceso simple.',
  en_s3b:'Lo guiamos en los siguientes pasos',en_s3s:'Detalles de registro y todo lo que necesita para comenzar.',
  en_cta:'Para inscribirse, contactenos hoy y pregunte por disponibilidad.',en_btn:'Contactenos',
  c_eyebrow:'Contacto',c_h2:'Nos encantaria saber de usted',
  c_p:'Si tiene preguntas sobre nuestros servicios, inscripcion o cupos, comuniquese con Mini Star Child Care:',
  c_phone:'Telefono',c_email:'Correo Electronico',c_addr:'Direccion',c_hours:'Horario',c_hours_val:'Abierto 24 Horas - 7 Dias a la Semana',
  c_call:'Llamenos',c_directions:'Como Llegar',c_mail:'Escribanos',c_addr:'Direccion',c_serving:'Sirviendo a familias en SeaTac, Washington y sus alrededores.',
  footer:'Mini Star Child Care - donde comienzan futuros brillantes'
};
const I18N_EN = {};
document.querySelectorAll('[data-i18n]').forEach(el => { I18N_EN[el.dataset.i18n] = el.innerHTML; });

function t(en, es) { return LANG === 'es' ? es : en; }
function applyLang() {
  const dict = LANG === 'es' ? I18N_ES : I18N_EN;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = dict[el.dataset.i18n];
    if (v != null) el.innerHTML = v;
  });
  const tg = document.getElementById('lang-toggle');
  if (tg) tg.textContent = LANG === 'es' ? 'English' : 'Espanol';
  document.documentElement.lang = LANG;
}
function toggleLang() { LANG = LANG === 'es' ? 'en' : 'es'; applyLang(); renderPortal(); renderEnrollment(); }

/* ---------- helpers ---------- */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function uid() { return 'id' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function today() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function nowTime() {
  const d = new Date();
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}
function fmtDate(s) {
  try { return new Date(s + 'T00:00').toLocaleDateString(LANG === 'es' ? 'es-US' : 'en-US', {weekday:'short',month:'short',day:'numeric',year:'numeric'}); }
  catch(e) { return s; }
}
function fmtMoney(n) { return '$' + Number(n || 0).toFixed(2); }

const CLS_ES = {Infants:'Bebes',Toddlers:'Ninos Pequenos',Preschool:'Preescolar','School-Age':'Edad Escolar'};
function clsName(id) {
  const c = DB.classes.find(x => x.id === id);
  if (!c) return '-';
  return LANG === 'es' ? (CLS_ES[c.name] || c.name) : c.name;
}
function roleLabel(r) {
  return ({admin: t('Admin','Administrador'), teacher: t('Teacher','Maestro/a'), parent: t('Parent','Padre/Madre')})[r] || r;
}
function userById(id) { return DB.users.find(u => u.id === id); }
function childById(id) { return DB.children.find(c => c.id === id); }
function parentChildren(u) { return DB.children.filter(c => (c.parentIds || []).includes(u.id)); }
function childAge(dob) {
  if (!dob) return '';
  const diff = Date.now() - new Date(dob).getTime();
  const years = Math.floor(diff / (365.25 * 24 * 3600 * 1000));
  if (years < 1) {
    const months = Math.floor(diff / (30.44 * 24 * 3600 * 1000));
    return months + ' ' + t('mo','m');
  }
  return years + ' ' + t('yr','a');
}

/* ---------- localStorage storage ---------- */
const STORAGE_KEY = 'ministar_db';
let DB = null;
let CU = null; // current user
let AUTH_TAB = 'login';
let SUB = 'overview';
let FORM_MOOD = '';
let PARENT_CHILD = '';

function loadDB() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) { try { DB = JSON.parse(raw); } catch(e) { DB = null; } }
  if (!DB) seedDB();
  // ensure all collections exist
  DB.classes = DB.classes || [];
  DB.users = DB.users || [];
  DB.children = DB.children || [];
  DB.enrollments = DB.enrollments || [];
  DB.reports = DB.reports || [];
  DB.payments = DB.payments || [];
  DB.messages = DB.messages || [];
}
function saveDB() { localStorage.setItem(STORAGE_KEY, JSON.stringify(DB)); }

function seedDB() {
  const classIds = { infants: uid(), toddlers: uid(), preschool: uid(), school: uid() };
  const userIds = {
    admin: uid(), teacher1: uid(), teacher2: uid(),
    parent1: uid(), parent2: uid(), parent3: uid()
  };
  const childIds = [uid(), uid(), uid(), uid(), uid(), uid()];

  DB = {
    classes: [
      { id: classIds.infants, name: 'Infants' },
      { id: classIds.toddlers, name: 'Toddlers' },
      { id: classIds.preschool, name: 'Preschool' },
      { id: classIds.school, name: 'School-Age' }
    ],
    users: [
      { id: userIds.admin, name: 'Admin', username: 'admin', password: 'admin123', role: 'admin', classId: null },
      { id: userIds.teacher1, name: 'Maria Santos', username: 'teacher1', password: 'demo123', role: 'teacher', classId: classIds.infants },
      { id: userIds.teacher2, name: 'James Lee', username: 'teacher2', password: 'demo123', role: 'teacher', classId: classIds.preschool },
      { id: userIds.parent1, name: 'Sarah Johnson', username: 'parent1', password: 'demo123', role: 'parent', classId: null, phone: '(206) 555-0100', email: 'sarah@email.com' },
      { id: userIds.parent2, name: 'Carlos Garcia', username: 'parent2', password: 'demo123', role: 'parent', classId: null, phone: '(206) 555-0200', email: 'carlos@email.com' },
      { id: userIds.parent3, name: 'Amina Hassan', username: 'parent3', password: 'demo123', role: 'parent', classId: null, phone: '(206) 555-0300', email: 'amina@email.com' }
    ],
    children: [
      { id: childIds[0], name: 'Emma Johnson', dob: '2023-08-15', classId: classIds.infants, parentIds: [userIds.parent1], allergies: 'Peanuts', food: 'Pureed vegetables, formula', emergencyContact: 'David Johnson', emergencyPhone: '(206) 555-0101', notes: 'Loves music time' },
      { id: childIds[1], name: 'Liam Johnson', dob: '2022-03-22', classId: classIds.toddlers, parentIds: [userIds.parent1], allergies: '', food: 'No restrictions', emergencyContact: 'David Johnson', emergencyPhone: '(206) 555-0101', notes: '' },
      { id: childIds[2], name: 'Sofia Garcia', dob: '2021-11-05', classId: classIds.preschool, parentIds: [userIds.parent2], allergies: 'Dairy', food: 'Lactose-free meals only', emergencyContact: 'Ana Garcia', emergencyPhone: '(206) 555-0202', notes: 'Bilingual - Spanish/English' },
      { id: childIds[3], name: 'Noah Garcia', dob: '2020-06-18', classId: classIds.preschool, parentIds: [userIds.parent2], allergies: '', food: 'No restrictions', emergencyContact: 'Ana Garcia', emergencyPhone: '(206) 555-0202', notes: '' },
      { id: childIds[4], name: 'Mia Hassan', dob: '2019-01-30', classId: classIds.school, parentIds: [userIds.parent3], allergies: 'Tree nuts', food: 'No nuts of any kind', emergencyContact: 'Omar Hassan', emergencyPhone: '(206) 555-0303', notes: 'After-school pickup at 5pm' },
      { id: childIds[5], name: 'Oliver Hassan', dob: '2017-09-12', classId: classIds.school, parentIds: [userIds.parent3], allergies: '', food: 'No restrictions', emergencyContact: 'Omar Hassan', emergencyPhone: '(206) 555-0303', notes: '' }
    ],
    enrollments: [
      {
        id: uid(),
        parentInfo: { name: 'Fatima Ali', phone: '(206) 555-0404', email: 'fatima@email.com', username: 'fatima_ali' },
        childInfo: { name: 'Yusuf Ali', dob: '2022-09-10', classPreference: classIds.toddlers, allergies: '', food: 'Halal only', medical: '', emergencyName: 'Ahmed Ali', emergencyPhone: '(206) 555-0405', startDate: '2026-07-01', notes: 'Only halal food please' },
        status: 'pending', submittedDate: today(), assignedClassId: null, childId: null, parentId: null
      },
      {
        id: uid(),
        parentInfo: { name: 'Kevin Park', phone: '(206) 555-0505', email: 'kevin@email.com', username: 'kevin_park' },
        childInfo: { name: 'Lily Park', dob: '2020-04-15', classPreference: classIds.preschool, allergies: 'Eggs', food: 'No eggs in any form', medical: 'Mild eczema - has prescribed cream', emergencyName: 'Jenny Park', emergencyPhone: '(206) 555-0506', startDate: '2026-07-07', notes: '' },
        status: 'pending', submittedDate: today(), assignedClassId: null, childId: null, parentId: null
      }
    ],
    reports: [
      { id: uid(), childId: childIds[0], teacherId: userIds.teacher1, date: today(), checkIn: '07:30', checkOut: '', mood: 'happy', meals: 'Ate all of breakfast, good lunch', nap: '12:00 - 2:30 PM', activities: 'Tummy time, music, sensory play', note: 'Emma had a wonderful day! She smiled and cooed during music time.' },
      { id: uid(), childId: childIds[2], teacherId: userIds.teacher2, date: today(), checkIn: '08:00', checkOut: '', mood: 'energetic', meals: 'Full breakfast, half lunch', nap: '1:00 - 2:00 PM', activities: 'Painting, story time, outdoor play', note: 'Sofia led the class in a counting game today!' }
    ],
    payments: [
      { id: uid(), childId: childIds[0], amount: 850, description: 'June Care - Emma Johnson', dueDate: '2026-06-01', paid: true, paidDate: '2026-05-28' },
      { id: uid(), childId: childIds[1], amount: 780, description: 'June Care - Liam Johnson', dueDate: '2026-06-01', paid: true, paidDate: '2026-05-28' },
      { id: uid(), childId: childIds[2], amount: 750, description: 'June Care - Sofia Garcia', dueDate: '2026-06-01', paid: false, paidDate: null },
      { id: uid(), childId: childIds[3], amount: 720, description: 'June Care - Noah Garcia', dueDate: '2026-06-01', paid: false, paidDate: null },
      { id: uid(), childId: childIds[4], amount: 650, description: 'June Care - Mia Hassan', dueDate: '2026-06-01', paid: true, paidDate: '2026-06-02' },
      { id: uid(), childId: childIds[5], amount: 630, description: 'June Care - Oliver Hassan', dueDate: '2026-06-01', paid: false, paidDate: null }
    ],
    messages: [
      { id: uid(), fromId: userIds.teacher1, toId: userIds.parent1, childId: childIds[0], text: 'Emma had a great day today! She really enjoyed tummy time and responded well to music.', date: today(), time: '14:30', read: false },
      { id: uid(), fromId: userIds.parent1, toId: userIds.teacher1, childId: childIds[0], text: 'Thank you so much for the update! We will keep up the music at home too.', date: today(), time: '15:45', read: true }
    ]
  };
  saveDB();
}

/* ---------- auth ---------- */
function doLogin(username, password) {
  return DB.users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password) || null;
}
function errT(e) {
  const m = String(e && e.message || '');
  if (m === 'taken') return t('That username is already taken.', 'Ese usuario ya esta en uso.');
  if (m === 'missing') return t('Please fill in all fields.', 'Por favor complete todos los campos.');
  if (m === 'wrong') return t('Wrong username or password.', 'Usuario o contrasena incorrectos.');
  if (m === 'short') return t('Password must be at least 6 characters.', 'La contrasena debe tener al menos 6 caracteres.');
  return t('Something went wrong. Please try again.', 'Algo salio mal. Intentelo de nuevo.');
}
function msg(id, text, ok) {
  const el = document.getElementById(id);
  if (el) { el.textContent = text; el.className = 'form-msg ' + (ok ? 'ok' : 'err'); }
}

/* ---------- render root ---------- */
function renderPortal() {
  const root = document.getElementById('portal-root');
  if (!root) return;
  if (!CU) { root.innerHTML = authView(); return; }
  let body = '';
  if (CU.role === 'admin') body = adminView();
  else if (CU.role === 'teacher') body = teacherView();
  else body = parentView();
  root.innerHTML = `
    <div class="portal-head">
      <div>
        <h2>${t('Hello','Hola')}, ${esc(CU.name)} &#128075;</h2>
        <span class="role-chip role-${CU.role}">${roleLabel(CU.role)}</span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="mini-btn ghost" onclick="renderPortal()">&#8635; ${t('Refresh','Actualizar')}</button>
        <button class="mini-btn ghost" onclick="changePassword()">&#128273; ${t('Change Password','Cambiar Contrasena')}</button>
        <button class="mini-btn danger" onclick="logout()">&#128682; ${t('Log out','Cerrar sesion')}</button>
      </div>
    </div>` + body;
}

/* ---------- auth view ---------- */
function authView() {
  return `
  <div class="demo-banner">
    <b>${t('Demo Accounts','Cuentas de Demostración')}</b><br>
    ${t('Admin:','Admin:')} admin / admin123 &nbsp;|&nbsp;
    ${t('Teacher:','Maestro:')} teacher1 / demo123 &nbsp;|&nbsp;
    ${t('Parent:','Padre/Madre:')} parent1 / demo123
  </div>
  <div class="portal-card">
    <div class="portal-logo"><img src="images/logo.png" alt="Mini Star logo"></div>
    <h2 style="text-align:center;font-size:1.4rem">${t('Family &amp; Staff Portal','Portal de Familias y Personal')}</h2>
    <p class="soft" style="text-align:center;font-size:.9rem;margin-bottom:4px">${t('Sign in to access daily reports, payments, and messages.','Inicia sesion para ver reportes, pagos y mensajes.')}</p>
    <div class="pill-tabs">
      <button class="${AUTH_TAB === 'login' ? 'active' : ''}" onclick="AUTH_TAB='login';renderPortal()">${t('Sign In','Iniciar Sesion')}</button>
      <button class="${AUTH_TAB === 'signup' ? 'active' : ''}" onclick="AUTH_TAB='signup';renderPortal()">${t('Parent Sign Up','Registro de Padres')}</button>
    </div>
    ${AUTH_TAB === 'login' ? `
      <div class="field"><label>${t('Username','Usuario')}</label><input id="li-user" autocomplete="username" placeholder="admin"></div>
      <div class="field"><label>${t('Password','Contrasena')}</label><input id="li-pass" type="password" autocomplete="current-password" placeholder="admin123"></div>
      <button class="btn btn-night btn-full" onclick="login()">${t('Sign In','Iniciar Sesion')}</button>
    ` : `
      <div class="field"><label>${t('Your full name','Su nombre completo')}</label><input id="su-name" placeholder="${t('e.g. Maria Gonzalez','Ej.: Maria Gonzalez')}"></div>
      <div class="field"><label>${t('Choose a username','Elija un usuario')}</label><input id="su-user"></div>
      <div class="field"><label>${t('Choose a password (min 6 chars)','Elija una contrasena (min 6)')}</label><input id="su-pass" type="password"></div>
      <button class="btn btn-teal btn-full" onclick="signupParent()">${t('Create Parent Account','Crear Cuenta de Padre')}</button>
      <p class="soft" style="font-size:.82rem;margin-top:10px">${t('After signing up, an admin will link your child to your account.','Despues de registrarse, el admin vinculara a su hijo.')}</p>
    `}
    <div class="form-msg" id="auth-msg"></div>
  </div>`;
}

function login() {
  const u = document.getElementById('li-user').value.trim();
  const p = document.getElementById('li-pass').value;
  if (!u || !p) { msg('auth-msg', errT(new Error('missing'))); return; }
  const found = doLogin(u, p);
  if (!found) { msg('auth-msg', errT(new Error('wrong'))); return; }
  CU = found;
  SUB = CU.role === 'admin' ? 'overview' : (CU.role === 'teacher' ? 'class' : 'children');
  PARENT_CHILD = '';
  renderPortal();
}

function logout() { CU = null; AUTH_TAB = 'login'; SUB = 'overview'; renderPortal(); }

function signupParent() {
  const name = (document.getElementById('su-name').value || '').trim();
  const u = (document.getElementById('su-user').value || '').trim();
  const p = (document.getElementById('su-pass').value || '');
  if (!name || !u || !p) { msg('auth-msg', errT(new Error('missing'))); return; }
  if (p.length < 6) { msg('auth-msg', errT(new Error('short'))); return; }
  if (DB.users.find(x => x.username.toLowerCase() === u.toLowerCase())) { msg('auth-msg', errT(new Error('taken'))); return; }
  const nu = { id: uid(), name, username: u, password: p, role: 'parent', classId: null };
  DB.users.push(nu);
  saveDB();
  CU = nu;
  SUB = 'children';
  renderPortal();
}

/* ---------- subtabs helper ---------- */
function subtabs(items) {
  return '<div class="subtabs">' + items.map(([k, l]) =>
    `<button class="${SUB === k ? 'active' : ''}" onclick="SUB='${k}';EDIT_CHILD_ID=null;renderPortal()">${l}</button>`
  ).join('') + '</div>';
}

/* ===================== ADMIN ===================== */
function adminView() {
  const pendingCount = DB.enrollments.filter(e => e.status === 'pending').length;
  let h = subtabs([
    ['overview',    '&#128202; ' + t('Overview','Resumen')],
    ['enrollments', '&#128221; ' + t('Enrollments','Inscripciones') + (pendingCount ? ` <span style="background:var(--coral);color:#fff;border-radius:999px;font-size:.65rem;padding:1px 7px;margin-left:2px">${pendingCount}</span>` : '')],
    ['children',    '&#128118; ' + t('Children','Ninos')],
    ['staff',       '&#129489; ' + t('Staff','Personal')],
    ['parents',     '&#128106; ' + t('Parents','Padres')],
    ['reports',     '&#128203; ' + t('Reports','Reportes')],
    ['payments',    '&#128176; ' + t('Payments','Pagos')],
    ['messages',    '&#128172; ' + t('Messages','Mensajes')]
  ]);

  /* --- overview --- */
  if (SUB === 'overview') {
    const td = today();
    const totalPaid = DB.payments.filter(p => p.paid).reduce((s, p) => s + Number(p.amount), 0);
    const totalUnpaid = DB.payments.filter(p => !p.paid).reduce((s, p) => s + Number(p.amount), 0);
    h += `
    <div class="stat-grid">
      <div class="stat-box"><div class="stat-num">${DB.children.length}</div><div class="stat-lbl">${t('Children','Ninos')}</div></div>
      <div class="stat-box"><div class="stat-num">${DB.users.filter(u => u.role === 'teacher').length}</div><div class="stat-lbl">${t('Teachers','Maestros')}</div></div>
      <div class="stat-box"><div class="stat-num">${DB.users.filter(u => u.role === 'parent').length}</div><div class="stat-lbl">${t('Parents','Padres')}</div></div>
      <div class="stat-box"><div class="stat-num">${DB.reports.filter(r => r.date === td).length}</div><div class="stat-lbl">${t("Today's Reports",'Reportes Hoy')}</div></div>
    </div>
    <div class="stat-grid" style="margin-top:0">
      <div class="stat-box" style="border-top:4px solid var(--teal)"><div class="stat-num" style="color:var(--teal)">${fmtMoney(totalPaid)}</div><div class="stat-lbl">${t('Collected','Cobrado')}</div></div>
      <div class="stat-box" style="border-top:4px solid var(--coral)"><div class="stat-num" style="color:var(--coral)">${fmtMoney(totalUnpaid)}</div><div class="stat-lbl">${t('Outstanding','Pendiente')}</div></div>
      <div class="stat-box" style="border-top:4px solid var(--gold)"><div class="stat-num">${DB.messages.filter(m => !m.read).length}</div><div class="stat-lbl">${t('Unread Msgs','Mensajes')}</div></div>
      <div class="stat-box" style="border-top:4px solid var(--night)"><div class="stat-num">${DB.classes.length}</div><div class="stat-lbl">${t('Classrooms','Salones')}</div></div>
    </div>
    <div class="card" style="margin-top:6px">
      <p class="lead">${t('Quick Guide','Guia Rapida')}</p>
      <ul class="star-list">
        <li>${t('Add teachers under <b>Staff</b> and assign each a classroom.','Agregue maestros en <b>Personal</b> y asigne un salon a cada uno.')}</li>
        <li>${t('Add children under <b>Children</b> and link them to parents.','Agregue ninos en <b>Ninos</b> y vinculelos con sus padres.')}</li>
        <li>${t('Create payment records under <b>Payments</b>.','Cree registros de pago en <b>Pagos</b>.')}</li>
        <li>${t('View all teacher-parent messages under <b>Messages</b>.','Vea los mensajes en <b>Mensajes</b>.')}</li>
      </ul>
    </div>`;
  }

  /* --- enrollments --- */
  if (SUB === 'enrollments') {
    const pending = DB.enrollments.filter(e => e.status === 'pending');
    const done = DB.enrollments.filter(e => e.status !== 'pending');
    if (!DB.enrollments.length) {
      h += `<div class="empty">${t('No enrollment requests yet.','Aun no hay solicitudes de inscripcion.')}</div>`;
    }
    if (pending.length) {
      h += `<p class="lead" style="color:var(--coral);margin-bottom:10px">&#9888; ${pending.length} ${t('Pending Review','Pendientes de Revision')}</p>`;
      h += pending.map(e => enrollmentCard(e, true)).join('');
    }
    if (done.length) {
      h += `<p class="lead" style="margin-top:18px;margin-bottom:10px">&#9989; ${t('Processed','Procesadas')}</p>`;
      h += done.map(e => enrollmentCard(e, false)).join('');
    }
  }

  /* --- children --- */
  if (SUB === 'children') {
    const parents = DB.users.filter(u => u.role === 'parent');
    h += `<div class="card">
      <p class="lead">${t('Add a Child','Agregar un Nino')}</p>
      <div class="field"><label>${t("Child's Name",'Nombre del Nino')}</label><input id="nc-name"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="field" style="margin:0"><label>${t('Date of Birth','Fecha de Nacimiento')}</label><input type="date" id="nc-dob"></div>
        <div class="field" style="margin:0"><label>${t('Classroom','Salon')}</label><select id="nc-class">${DB.classes.map(c => `<option value="${c.id}">${esc(LANG === 'es' ? (CLS_ES[c.name] || c.name) : c.name)}</option>`).join('')}</select></div>
      </div>
      <div class="field"><label>${t('Allergies (if any)','Alergias (si aplica)')}</label><input id="nc-allergy" placeholder="${t('e.g. Peanuts','Ej.: Cacahuates')}"></div>
      <div class="field"><label>${t('Emergency Contact','Contacto de Emergencia')}</label><input id="nc-ec" placeholder="${t('Name & phone number','Nombre y telefono')}"></div>
      <div class="field"><label>${t('Notes','Notas')}</label><input id="nc-notes" placeholder="${t('Special instructions...','Instrucciones especiales...')}"></div>
      <div class="field"><label>${t('Link Parents','Vincular Padres')}</label>
        ${parents.length
          ? `<div style="display:flex;flex-direction:column;gap:6px;background:var(--cream);border-radius:14px;padding:10px 12px;border:2px solid #EAE2DA">
              ${parents.map(p => `<label style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;background:#fff;border:2px solid #EAE2DA;cursor:pointer;transition:.15s" onchange="this.style.background=this.querySelector('input').checked?'#DCEFE9':'#fff';this.style.borderColor=this.querySelector('input').checked?'var(--teal)':'#EAE2DA'">
                <input type="checkbox" class="nc-parent" value="${p.id}" style="width:18px;height:18px;accent-color:var(--teal);flex-shrink:0">
                <div>
                  <div style="font-weight:800;color:var(--night);font-size:.95rem">${esc(p.name)}</div>
                  <div style="font-size:.76rem;color:var(--muted)">@${esc(p.username)}${p.phone ? '  &middot;  ' + esc(p.phone) : ''}</div>
                </div>
              </label>`).join('')}
            </div>`
          : `<p class="soft" style="font-size:.85rem;margin:0">${t('No parent accounts yet.','Aun no hay cuentas de padres.')}</p>`}
      </div>
      <button class="btn btn-teal" onclick="addChild()">${t('Add Child','Agregar Nino')}</button>
      <div class="form-msg" id="nc-msg"></div>
    </div>`;
    if (EDIT_CHILD_ID) {
      const ec = DB.children.find(x => x.id === EDIT_CHILD_ID);
      if (ec) h += childEditForm(ec, true);
    }
    h += DB.children.length ? DB.children.map(c => childListItem(c, true)).join('')
      : `<div class="empty">${t('No children added yet.','Aun no se han agregado ninos.')}</div>`;
  }

  /* --- staff --- */
  if (SUB === 'staff') {
    h += `<div class="card">
      <p class="lead">${t('Add a Teacher','Agregar un Maestro')}</p>
      <div class="field"><label>${t("Teacher's Name",'Nombre del Maestro')}</label><input id="nt-name"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="field" style="margin:0"><label>${t('Username','Usuario')}</label><input id="nt-user"></div>
        <div class="field" style="margin:0"><label>${t('Password','Contrasena')}</label><input id="nt-pass" type="password"></div>
      </div>
      <div class="field"><label>${t('Assign Classroom','Asignar Salon')}</label><select id="nt-class">${DB.classes.map(c => `<option value="${c.id}">${esc(LANG === 'es' ? (CLS_ES[c.name] || c.name) : c.name)}</option>`).join('')}</select></div>
      <button class="btn btn-teal" onclick="addTeacher()">${t('Add Teacher','Agregar Maestro')}</button>
      <div class="form-msg" id="nt-msg"></div>
    </div>`;
    const teachers = DB.users.filter(u => u.role === 'teacher');
    h += teachers.length ? teachers.map(te => `
      <div class="list-item">
        <div class="grow">
          <b>${esc(te.name)}</b><span class="tag navy">${esc(clsName(te.classId))}</span><br>
          <span class="soft" style="font-size:.82rem">${t('Username','Usuario')}: ${esc(te.username)}</span>
        </div>
        <button class="mini-btn danger" onclick="delUser('${te.id}')">${t('Remove','Eliminar')}</button>
      </div>`).join('')
      : `<div class="empty">${t('No teachers yet.','Aun no hay maestros.')}</div>`;
  }

  /* --- parents --- */
  if (SUB === 'parents') {
    const ps = DB.users.filter(u => u.role === 'parent');
    h += ps.length ? ps.map(p => {
      const linked = parentChildren(p).map(c => c.id);
      return `<div class="list-item" style="align-items:flex-start">
        <div class="grow">
          <b>${esc(p.name)}</b> <span class="soft" style="font-size:.82rem">(${esc(p.username)})</span>
          <div style="margin-top:8px">
            ${DB.children.length
              ? `<div class="check-list">${DB.children.map(c => `<label><input type="checkbox" ${linked.includes(c.id) ? 'checked' : ''} onchange="toggleLink('${p.id}','${c.id}',this.checked)"> ${esc(c.name)} <span class="tag" style="margin-left:auto">${esc(clsName(c.classId))}</span></label>`).join('')}</div>`
              : `<span class="soft" style="font-size:.85rem">${t('Add children first.','Agregue ninos primero.')}</span>`}
          </div>
        </div>
        <button class="mini-btn danger" onclick="delUser('${p.id}')">${t('Remove','Eliminar')}</button>
      </div>`;
    }).join('')
      : `<div class="empty">${t('No parent accounts yet.','Aun no hay cuentas de padres.')}</div>`;
  }

  /* --- reports --- */
  if (SUB === 'reports') {
    h += `<div class="card"><div class="field"><label>${t('Filter by Date','Filtrar por Fecha')}</label><input type="date" id="ar-date" value="${window.__arDate || today()}" onchange="window.__arDate=this.value;renderPortal()"></div></div>`;
    const d = window.__arDate || today();
    const rs = DB.reports.filter(r => r.date === d);
    h += rs.length ? rs.map(r => reportCard(r, true)).join('')
      : `<div class="empty">${t('No reports for','No hay reportes para')} ${fmtDate(d)}.</div>`;
  }

  /* --- payments --- */
  if (SUB === 'payments') {
    const unpaid = DB.payments.filter(p => !p.paid);
    const totalDue = unpaid.reduce((s, p) => s + Number(p.amount), 0);
    h += `
    <div class="card">
      <p class="lead">${t('Create Payment Record','Crear Registro de Pago')}</p>
      <div class="field"><label>${t('Child','Nino')}</label><select id="np-child">${DB.children.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="field" style="margin:0"><label>${t('Amount ($)','Monto ($)')}</label><input type="number" id="np-amount" placeholder="750"></div>
        <div class="field" style="margin:0"><label>${t('Due Date','Fecha Limite')}</label><input type="date" id="np-due"></div>
      </div>
      <div class="field"><label>${t('Description','Descripcion')}</label><input id="np-desc" placeholder="${t('e.g. July Care Fee','Ej.: Cuota de Julio')}"></div>
      <button class="btn btn-teal" onclick="addPayment()">${t('Create Payment','Crear Pago')}</button>
      <div class="form-msg" id="np-msg"></div>
    </div>`;
    if (unpaid.length) {
      h += `<p class="lead" style="color:var(--coral)">${t('Outstanding: ','Pendiente: ')}${fmtMoney(totalDue)}</p>`;
    }
    h += DB.payments.length ? DB.payments.sort((a, b) => (a.paid ? 1 : -1)).map(p => {
      const ch = childById(p.childId);
      return `<div class="payment-card">
        <div class="pay-info">
          <b>${esc(p.description || (ch ? ch.name : '-'))}</b>
          ${ch ? `<span class="tag" style="margin-left:6px">${esc(clsName(ch.classId))}</span>` : ''}
          <br>
          <span class="soft">${t('Due:','Vence:')} ${fmtDate(p.dueDate)}${p.paid && p.paidDate ? ' &nbsp;&#10003; ' + t('Paid','Pagado') + ' ' + fmtDate(p.paidDate) : ''}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="pay-amount">${fmtMoney(p.amount)}</span>
          <span class="tag ${p.paid ? 'paid' : 'unpaid'}">${p.paid ? t('Paid','Pagado') : t('Unpaid','Pendiente')}</span>
          ${!p.paid ? `<button class="mini-btn success" onclick="markPaid('${p.id}')">${t('Mark Paid','Marcar Pagado')}</button>` : ''}
          <button class="mini-btn danger" onclick="delPayment('${p.id}')">${t('Delete','Eliminar')}</button>
        </div>
      </div>`;
    }).join('')
      : `<div class="empty">${t('No payment records yet.','Aun no hay registros de pago.')}</div>`;
  }

  /* --- messages --- */
  if (SUB === 'messages') {
    const allMsgs = DB.messages.slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    h += `<div class="card">
      <p class="lead">${t('Send a Message','Enviar Mensaje')}</p>
      <div class="field"><label>${t('To','Para')}</label><select id="am-to">${DB.users.filter(u => u.id !== CU.id).map(u => `<option value="${u.id}">${esc(u.name)} (${roleLabel(u.role)})</option>`).join('')}</select></div>
      <div class="field"><label>${t('About (child)','Sobre (nino)')} ${t('optional','opcional')}</label><select id="am-child"><option value="">${t('General','General')}</option>${DB.children.map(c => `<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></div>
      <div class="field"><label>${t('Message','Mensaje')}</label><textarea id="am-text" placeholder="${t('Type your message...','Escriba su mensaje...')}"></textarea></div>
      <button class="btn btn-teal" onclick="adminSendMsg()">${t('Send','Enviar')}</button>
      <div class="form-msg" id="am-msg"></div>
    </div>`;
    h += allMsgs.length ? allMsgs.map(m => msgCard(m, true)).join('')
      : `<div class="empty">${t('No messages yet.','Aun no hay mensajes.')}</div>`;
  }

  return h;
}

/* ===================== TEACHER ===================== */
function teacherView() {
  let h = `<p class="soft" style="margin-bottom:2px">${t('Classroom:','Salon:')} <b style="color:var(--night)">${esc(clsName(CU.classId))}</b></p>`;
  h += subtabs([
    ['class',   '&#127979; ' + t('My Class','Mi Salon')],
    ['report',  '&#128221; ' + t('Daily Report','Reporte Diario')],
    ['history', '&#128193; ' + t('History','Historial')],
    ['messages','&#128172; ' + t('Messages','Mensajes')]
  ]);
  const kids = DB.children.filter(c => c.classId === CU.classId);

  /* class */
  if (SUB === 'class') {
    const td = today();
    if (EDIT_CHILD_ID && kids.some(k => k.id === EDIT_CHILD_ID)) {
      const ec = DB.children.find(x => x.id === EDIT_CHILD_ID);
      if (ec) h += childEditForm(ec, false);
    }
    h += kids.length ? kids.map(c => {
      const r = getReport(c.id, td);
      const isEditing = EDIT_CHILD_ID === c.id;
      return `<div class="list-item" style="${isEditing ? 'border:2px solid var(--teal)' : ''}">
        <div class="grow">
          <b style="cursor:pointer" onclick="editChild('${c.id}')">${esc(c.name)}</b><span class="tag">${childAge(c.dob)}</span>
          ${c.allergies ? `<span class="tag coral">&#9888; ${esc(c.allergies)}</span>` : ''}
          <br>
          ${c.food ? `<span class="soft" style="font-size:.78rem">&#127860; ${esc(c.food)}</span><br>` : ''}
          <span class="soft" style="font-size:.82rem">
            ${r && r.checkIn ? '&#9989; ' + t('In','Entro') + ' ' + esc(r.checkIn) : '&#9634; ' + t('Not checked in','Sin entrada')}
            ${r && r.checkOut ? ' &middot; &#127968; ' + t('Out','Salio') + ' ' + esc(r.checkOut) : ''}
          </span>
        </div>
        <button class="mini-btn ghost" onclick="editChild('${c.id}')">&#9998; ${t('Edit','Editar')}</button>
        ${!(r && r.checkIn) ? `<button class="mini-btn in" onclick="quickCheck('${c.id}','in')">${t('Check In','Entrada')}</button>` : ''}
        ${(r && r.checkIn && !r.checkOut) ? `<button class="mini-btn out" onclick="quickCheck('${c.id}','out')">${t('Check Out','Salida')}</button>` : ''}
        <button class="mini-btn ghost" onclick="SUB='report';window.__repChild='${c.id}';renderPortal()">${t('Report','Reporte')}</button>
      </div>`;
    }).join('')
      : `<div class="empty">${t('No children in your classroom yet.','Aun no hay ninos en su salon.')}</div>`;
  }

  /* report */
  if (SUB === 'report') {
    if (!kids.length) { h += `<div class="empty">${t('No children in your classroom yet.','Aun no hay ninos.')}</div>`; return h; }
    const selId = window.__repChild && kids.some(k => k.id === window.__repChild) ? window.__repChild : kids[0].id;
    window.__repChild = selId;
    const d = window.__repDate || today();
    const ex = getReport(selId, d) || {};
    if (!FORM_MOOD) FORM_MOOD = ex.mood || '';
    const moods = [['happy','&#128522;',t('Happy','Feliz')],['energetic','&#129321;',t('Energetic','Energico')],['calm','&#128528;',t('Calm','Tranquilo')],['tired','&#128564;',t('Tired','Cansado')],['upset','&#128546;',t('Upset','Triste')]];
    h += `<div class="card">
      <div class="field"><label>${t('Child','Nino')}</label><select id="rp-child" onchange="window.__repChild=this.value;FORM_MOOD='';renderPortal()">${kids.map(k => `<option value="${k.id}" ${k.id === selId ? 'selected' : ''}>${esc(k.name)}</option>`).join('')}</select></div>
      <div class="field"><label>${t('Date','Fecha')}</label><input type="date" id="rp-date" value="${d}" onchange="window.__repDate=this.value;FORM_MOOD='';renderPortal()"></div>
      <div class="rc-grid">
        <div class="field" style="margin:0"><label>${t('Arrived','Llegada')}</label><input type="time" id="rp-in" value="${esc(ex.checkIn || '')}"></div>
        <div class="field" style="margin:0"><label>${t('Picked Up','Salida')}</label><input type="time" id="rp-out" value="${esc(ex.checkOut || '')}"></div>
      </div>
      <div class="field" style="margin-top:14px"><label>${t('Mood','Estado de Animo')}</label>
        <div class="mood-row">${moods.map(m => `<button class="mood-btn ${FORM_MOOD === m[0] ? 'sel' : ''}" onclick="FORM_MOOD='${m[0]}';renderPortal()">${m[1]}<small>${m[2]}</small></button>`).join('')}</div>
      </div>
      <div class="field"><label>${t('Meals','Comidas')}</label><input id="rp-meals" value="${esc(ex.meals || '')}" placeholder="${t('Ate all of lunch...','Comio todo el almuerzo...')}"></div>
      <div class="field"><label>${t('Nap','Siesta')}</label><input id="rp-nap" value="${esc(ex.nap || '')}" placeholder="${t('e.g. 1:00 - 2:30 PM','Ej.: 1:00 - 2:30 PM')}"></div>
      <div class="field"><label>${t("Today's Activities","Actividades de Hoy")}</label><textarea id="rp-act" placeholder="${t('What did the child do today?','Que hizo el nino hoy?')}">${esc(ex.activities || '')}</textarea></div>
      <div class="field"><label>${t('Message to Parent','Mensaje para los Padres')}</label><textarea id="rp-note">${esc(ex.note || '')}</textarea></div>
      <button class="btn btn-teal btn-full" onclick="saveReport()">${t('Save Daily Report','Guardar Reporte Diario')}</button>
      <div class="form-msg" id="rp-msg"></div>
    </div>`;
  }

  /* history */
  if (SUB === 'history') {
    const ids = kids.map(k => k.id);
    const rs = DB.reports.filter(r => ids.includes(r.childId)).sort((a, b) => b.date.localeCompare(a.date));
    h += rs.length ? rs.map(r => reportCard(r, true)).join('')
      : `<div class="empty">${t('No reports yet.','Aun no hay reportes.')}</div>`;
  }

  /* messages */
  if (SUB === 'messages') {
    const parentIds = [...new Set(kids.flatMap(k => k.parentIds || []))];
    h += `<div class="card">
      <p class="lead">${t('Send a Message','Enviar Mensaje')}</p>
      ${parentIds.length ? `
        <div class="field"><label>${t('To (Parent)','Para (Padre/Madre)')}</label><select id="tm-to">${parentIds.map(id => { const p = userById(id); return p ? `<option value="${p.id}">${esc(p.name)}</option>` : ''; }).join('')}</select></div>
        <div class="field"><label>${t('About (child)','Sobre (nino)')}</label><select id="tm-child">${kids.map(k => `<option value="${k.id}">${esc(k.name)}</option>`).join('')}</select></div>
        <div class="field"><label>${t('Message','Mensaje')}</label><textarea id="tm-text" placeholder="${t('Type your message...','Escriba su mensaje...')}"></textarea></div>
        <button class="btn btn-teal" onclick="teacherSendMsg()">${t('Send','Enviar')}</button>
        <div class="form-msg" id="tm-msg"></div>
      ` : `<p class="soft">${t('No parents linked to your students yet.','Aun no hay padres vinculados a sus alumnos.')}</p>`}
    </div>`;
    const myMsgs = DB.messages.filter(m => m.fromId === CU.id || m.toId === CU.id).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    // mark as read
    myMsgs.filter(m => m.toId === CU.id && !m.read).forEach(m => { m.read = true; });
    saveDB();
    h += myMsgs.length ? myMsgs.map(m => msgCard(m, false)).join('')
      : `<div class="empty">${t('No messages yet.','Aun no hay mensajes.')}</div>`;
  }

  return h;
}

/* ===================== PARENT ===================== */
function parentView() {
  const kids = parentChildren(CU);
  let h = subtabs([
    ['children', '&#128118; ' + t('My Children','Mis Hijos')],
    ['reports',  '&#128203; ' + t('Daily Reports','Reportes Diarios')],
    ['payments', '&#128176; ' + t('Payments','Pagos')],
    ['messages', '&#128172; ' + t('Messages','Mensajes')]
  ]);

  if (!kids.length && SUB !== 'messages' && SUB !== 'payments') {
    h += `<div class="empty">
      ${t('Your account is not linked to a child yet.','Su cuenta aun no esta vinculada a un nino.')}<br>
      ${t('Please contact Mini Star Childcare:','Por favor contacte a Mini Star:')} <a href="tel:+12062554000" style="color:var(--gold)">(206) 255-4000</a>
    </div>`;
    return h;
  }

  /* my children */
  if (SUB === 'children') {
    const td = today();
    h += kids.map(c => {
      const r = getReport(c.id, td);
      const ageStr = childAge(c.dob);
      return `<div class="child-card">
        <div class="child-header">
          <div class="child-avatar">${esc(c.name[0])}</div>
          <div>
            <b style="color:var(--night);font-size:1.1rem">${esc(c.name)}</b><br>
            <span class="tag">${esc(clsName(c.classId))}</span>
            ${ageStr ? `<span class="tag navy">${ageStr}</span>` : ''}
          </div>
        </div>
        <div class="child-detail-row">
          ${c.allergies ? `<span class="detail-chip allergy">&#9888; ${esc(c.allergies)}</span>` : ''}
          ${c.food ? `<span class="detail-chip">&#127860; ${esc(c.food)}</span>` : ''}
          ${c.emergencyContact ? `<span class="detail-chip">&#128222; ${esc(c.emergencyContact)}${c.emergencyPhone ? ' ' + esc(c.emergencyPhone) : ''}</span>` : ''}
          ${c.notes ? `<span class="detail-chip">&#128221; ${esc(c.notes)}</span>` : ''}
        </div>
        <div style="margin-top:10px">
          <span class="soft" style="font-size:.85rem">
            ${t('Today:','Hoy:')}
            ${r && r.checkIn ? '&#9989; ' + t('Arrived','Llego') + ' ' + esc(r.checkIn) : t('No check-in yet','Aun sin entrada')}
            ${r && r.checkOut ? ' &middot; &#127968; ' + t('Picked up','Salio') + ' ' + esc(r.checkOut) : ''}
          </span>
        </div>
        ${r && r.mood ? `<div style="margin-top:8px;font-size:1.4rem">${moodEmoji(r.mood)}</div>` : ''}
      </div>`;
    }).join('');
  }

  /* reports */
  if (SUB === 'reports') {
    if (kids.length > 1) {
      const sel = PARENT_CHILD && kids.some(k => k.id === PARENT_CHILD) ? PARENT_CHILD : kids[0].id;
      PARENT_CHILD = sel;
      h += `<div class="subtabs" style="padding-top:0">${kids.map(k => `<button class="${k.id === sel ? 'active' : ''}" onclick="PARENT_CHILD='${k.id}';renderPortal()">${esc(k.name)}</button>`).join('')}</div>`;
      const rs = DB.reports.filter(r => r.childId === sel).sort((a, b) => b.date.localeCompare(a.date));
      h += rs.length ? rs.map(r => reportCard(r, false)).join('')
        : `<div class="empty">${t('No reports yet.','Aun no hay reportes.')}</div>`;
    } else if (kids.length === 1) {
      const rs = DB.reports.filter(r => r.childId === kids[0].id).sort((a, b) => b.date.localeCompare(a.date));
      h += rs.length ? rs.map(r => reportCard(r, false)).join('')
        : `<div class="empty">${t('No reports yet for your child.','Aun no hay reportes para su hijo.')}</div>`;
    }
  }

  /* payments */
  if (SUB === 'payments') {
    const myKidIds = kids.map(k => k.id);
    const myPayments = DB.payments.filter(p => myKidIds.includes(p.childId)).sort((a, b) => (a.paid ? 1 : -1));
    const totalDue = myPayments.filter(p => !p.paid).reduce((s, p) => s + Number(p.amount), 0);
    if (totalDue > 0) {
      h += `<div class="card t-coral" style="background:#FFF0EE">
        <p class="lead" style="color:var(--coral)">${t('Balance Due','Saldo Pendiente')}: ${fmtMoney(totalDue)}</p>
        <p style="margin:0;font-size:.9rem">${t('Please contact us to arrange payment.','Por favor contactenos para arreglar el pago.')}<br><a href="tel:+12062554000" style="color:var(--gold);font-weight:800">(206) 255-4000</a></p>
      </div>`;
    }
    h += myPayments.length ? myPayments.map(p => {
      return `<div class="payment-card">
        <div class="pay-info">
          <b>${esc(p.description)}</b><br>
          <span class="soft">${t('Due:','Vence:')} ${fmtDate(p.dueDate)}${p.paid && p.paidDate ? ' &nbsp;&#10003; ' + t('Paid','Pagado') + ' ' + fmtDate(p.paidDate) : ''}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="pay-amount">${fmtMoney(p.amount)}</span>
          <span class="tag ${p.paid ? 'paid' : 'unpaid'}">${p.paid ? t('Paid','Pagado') : t('Unpaid','Pendiente')}</span>
        </div>
      </div>`;
    }).join('')
      : `<div class="empty">${t('No payment records.','No hay registros de pago.')}</div>`;
  }

  /* messages */
  if (SUB === 'messages') {
    const teacherIds = [...new Set(kids.flatMap(k => {
      const cls = DB.classes.find(c => c.id === k.classId);
      return DB.users.filter(u => u.role === 'teacher' && u.classId === k.classId).map(u => u.id);
    }))];
    h += `<div class="card">
      <p class="lead">${t('Send a Message','Enviar Mensaje')}</p>
      ${teacherIds.length ? `
        <div class="field"><label>${t('To (Teacher)','Para (Maestro/a)')}</label><select id="pm-to">${teacherIds.map(id => { const te = userById(id); return te ? `<option value="${te.id}">${esc(te.name)}</option>` : ''; }).join('')}</select></div>
        ${kids.length > 1 ? `<div class="field"><label>${t('About (child)','Sobre (nino)')}</label><select id="pm-child">${kids.map(k => `<option value="${k.id}">${esc(k.name)}</option>`).join('')}</select></div>` : `<input type="hidden" id="pm-child" value="${kids.length ? kids[0].id : ''}">`}
        <div class="field"><label>${t('Message','Mensaje')}</label><textarea id="pm-text" placeholder="${t('Type your message...','Escriba su mensaje...')}"></textarea></div>
        <button class="btn btn-teal" onclick="parentSendMsg()">${t('Send','Enviar')}</button>
        <div class="form-msg" id="pm-msg"></div>
      ` : `<p class="soft">${t('No teachers linked to your children yet.','Aun no hay maestros para sus hijos.')}</p>`}
    </div>`;
    const myMsgs = DB.messages.filter(m => m.fromId === CU.id || m.toId === CU.id).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    myMsgs.filter(m => m.toId === CU.id && !m.read).forEach(m => { m.read = true; });
    saveDB();
    h += myMsgs.length ? myMsgs.map(m => msgCard(m, false)).join('')
      : `<div class="empty">${t('No messages yet.','Aun no hay mensajes.')}</div>`;
  }

  return h;
}

/* ===================== SHARED HELPERS ===================== */
function getReport(childId, date) { return DB.reports.find(r => r.childId === childId && r.date === date); }
function moodEmoji(m) { return ({happy:'&#128522;',energetic:'&#129321;',calm:'&#128528;',tired:'&#128564;',upset:'&#128546;'})[m] || ''; }

function childListItem(c, isAdmin) {
  const pNames = (c.parentIds || []).map(id => { const p = userById(id); return p ? esc(p.name) : ''; }).filter(Boolean).join(', ');
  const isEditing = EDIT_CHILD_ID === c.id;
  return `<div class="list-item" style="${isEditing ? 'border:2px solid var(--teal)' : ''}">
    <div class="child-avatar" style="width:42px;height:42px;font-size:1.1rem;flex-shrink:0">${esc(c.name[0])}</div>
    <div class="grow">
      <b style="cursor:pointer;color:var(--night)" onclick="editChild('${c.id}')">${esc(c.name)}</b>
      <span class="tag">${esc(clsName(c.classId))}</span>
      ${c.allergies ? `<span class="tag coral">&#9888; ${esc(c.allergies)}</span>` : ''}
      <br>
      <span class="soft" style="font-size:.82rem">${childAge(c.dob)} &middot; ${t('Parents:','Padres:')} ${pNames || '-'}</span>
      ${c.food ? `<br><span class="soft" style="font-size:.78rem">&#127860; ${esc(c.food)}</span>` : ''}
      ${c.notes ? `<br><span class="soft" style="font-size:.78rem">&#128221; ${esc(c.notes)}</span>` : ''}
    </div>
    <button class="mini-btn ghost" onclick="editChild('${c.id}')">&#9998; ${t('Edit','Editar')}</button>
    ${isAdmin ? `<button class="mini-btn danger" onclick="delChild('${c.id}')">${t('Remove','Eliminar')}</button>` : ''}
  </div>`;
}

function reportCard(r, showChild) {
  const ch = childById(r.childId), te = userById(r.teacherId);
  return `<div class="report-card">
    <div class="rc-head">
      <b>${showChild && ch ? esc(ch.name) + ' &middot; ' : ''}${fmtDate(r.date)}</b>
      <span style="font-size:1.5rem">${moodEmoji(r.mood)}</span>
    </div>
    <div class="rc-grid">
      <div class="rc-cell"><b>${t('Arrived','Llegada')}</b>${esc(r.checkIn) || '-'}</div>
      <div class="rc-cell"><b>${t('Picked Up','Salida')}</b>${esc(r.checkOut) || '-'}</div>
      <div class="rc-cell"><b>${t('Meals','Comidas')}</b>${esc(r.meals) || '-'}</div>
      <div class="rc-cell"><b>${t('Nap','Siesta')}</b>${esc(r.nap) || '-'}</div>
    </div>
    ${r.activities ? `<div class="rc-note"><b>${t("Today's Activities",'Actividades')}</b>${esc(r.activities)}</div>` : ''}
    ${r.note ? `<div class="rc-note"><b>${t('Message from Teacher','Mensaje del Maestro')}</b>${esc(r.note)}</div>` : ''}
    ${te ? `<p class="soft" style="font-size:.8rem;margin:8px 0 0">${t('Reported by','Reportado por')} ${esc(te.name)}</p>` : ''}
  </div>`;
}

function msgCard(m, isAdmin) {
  const fromUser = userById(m.fromId);
  const toUser = userById(m.toId);
  const child = m.childId ? childById(m.childId) : null;
  const isMe = m.fromId === CU.id;
  return `<div class="msg-card ${isMe ? 'from-me' : 'from-other'}">
    <div class="msg-meta">
      <span class="name">${fromUser ? esc(fromUser.name) : '?'}</span>
      <span>&#8594; ${toUser ? esc(toUser.name) : '?'}</span>
      ${child ? `<span class="tag">${esc(child.name)}</span>` : ''}
      ${!m.read && !isMe ? `<span class="unread-dot"></span>` : ''}
      <span style="margin-left:auto">${m.date} ${m.time}</span>
    </div>
    <div class="msg-text">${esc(m.text)}</div>
  </div>`;
}

/* ===================== CHILD EDIT FORM ===================== */
function editChild(id) { EDIT_CHILD_ID = id; renderPortal(); }
function cancelEditChild() { EDIT_CHILD_ID = null; renderPortal(); }

function childEditTeacherHtml(classId) {
  const teachers = DB.users.filter(u => u.role === 'teacher');
  // find teacher currently assigned to this classroom
  const currentTeacher = teachers.find(te => te.classId === classId);
  return `<select id="ec-teacher" style="width:100%;border:2px solid #EAE2DA;border-radius:14px;padding:11px 14px;font-family:'Nunito',sans-serif;font-size:1rem;background:#FFFDFB">
    <option value="">${t('No specific teacher','Sin maestro especifico')}</option>
    ${teachers.map(te => `<option value="${te.id}" ${te.id === (currentTeacher && currentTeacher.id) ? 'selected' : ''}>${esc(te.name)} — ${esc(clsName(te.classId))}</option>`).join('')}
  </select>`;
}

function onEditClassChange(newClassId) {
  // auto-pick teacher of that classroom if one exists
  const wrap = document.getElementById('ec-teacher-wrap');
  if (!wrap) return;
  wrap.innerHTML = childEditTeacherHtml(newClassId);
}

function childEditForm(c, isAdmin) {
  const allTeachers = DB.users.filter(u => u.role === 'teacher');
  const currentTeacher = allTeachers.find(te => te.classId === c.classId);
  const parents = DB.users.filter(u => u.role === 'parent');
  return `<div class="card" style="border-left:5px solid var(--teal);margin-bottom:18px">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:16px">
      <p class="lead" style="margin:0">&#9998; ${t('Editing:','Editando:')} <span style="color:var(--teal)">${esc(c.name)}</span></p>
      <button class="mini-btn ghost" onclick="cancelEditChild()">&#10005; ${t('Cancel','Cancelar')}</button>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="field" style="margin:0"><label>${t("Child's Name *","Nombre del Nino *")}</label><input id="ec-name" value="${esc(c.name)}"></div>
      <div class="field" style="margin:0"><label>${t('Date of Birth','Fecha de Nacimiento')}</label><input type="date" id="ec-dob" value="${esc(c.dob || '')}"></div>
    </div>

    ${isAdmin ? `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
      <div class="field" style="margin:0">
        <label>${t('Classroom','Salon')}</label>
        <select id="ec-class" onchange="onEditClassChange(this.value)" style="width:100%;border:2px solid #EAE2DA;border-radius:14px;padding:11px 14px;font-family:'Nunito',sans-serif;font-size:1rem;background:#FFFDFB">
          ${DB.classes.map(cl => `<option value="${cl.id}" ${cl.id === c.classId ? 'selected' : ''}>${esc(LANG==='es'?(CLS_ES[cl.name]||cl.name):cl.name)}</option>`).join('')}
        </select>
      </div>
      <div class="field" style="margin:0">
        <label>${t('Assign Teacher','Asignar Maestro')}</label>
        <div id="ec-teacher-wrap">${childEditTeacherHtml(c.classId)}</div>
      </div>
    </div>
    <div class="field" style="margin-top:12px">
      <label>${t('Linked Parents','Padres Vinculados')}</label>
      <div style="display:flex;flex-direction:column;gap:6px;background:var(--cream);border-radius:14px;padding:10px 12px;border:2px solid #EAE2DA">
        ${parents.map(p => {
          const checked = (c.parentIds||[]).includes(p.id);
          return `<label style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;background:${checked?'#DCEFE9':'#fff'};border:2px solid ${checked?'var(--teal)':'#EAE2DA'};cursor:pointer;transition:.15s" onclick="toggleEcParent(this,'${p.id}','${c.id}')">
            <input type="checkbox" class="ec-parent" value="${p.id}" ${checked?'checked':''} style="width:18px;height:18px;accent-color:var(--teal);flex-shrink:0">
            <div>
              <div style="font-weight:800;color:var(--night);font-size:.95rem">${esc(p.name)}</div>
              <div style="font-size:.76rem;color:var(--muted)">@${esc(p.username)}${p.phone?'  &middot;  '+esc(p.phone):''}</div>
            </div>
          </label>`;
        }).join('')}
        ${parents.length === 0 ? `<p class="soft" style="font-size:.85rem;margin:0">${t('No parent accounts yet.','Aun no hay cuentas de padres.')}</p>` : ''}
      </div>
    </div>` : `<input type="hidden" id="ec-class" value="${esc(c.classId)}">`}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">
      <div class="field" style="margin:0"><label>${t('Allergies','Alergias')}</label><input id="ec-allergy" value="${esc(c.allergies||'')}" placeholder="${t('e.g. Peanuts','Ej.: Cacahuates')}"></div>
      <div class="field" style="margin:0"><label>${t('Food / Dietary Needs','Comida / Dieta')}</label><input id="ec-food" value="${esc(c.food||'')}" placeholder="${t('e.g. Halal only','Ej.: Solo halal')}"></div>
    </div>
    <div class="field" style="margin-top:12px"><label>${t('Medical Conditions / Notes','Condiciones Medicas / Notas')}</label><textarea id="ec-notes" style="min-height:60px">${esc(c.notes||'')}</textarea></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="field" style="margin:0"><label>${t('Emergency Contact Name','Contacto de Emergencia')}</label><input id="ec-ecname" value="${esc(c.emergencyContact||'')}"></div>
      <div class="field" style="margin:0"><label>${t('Emergency Phone','Telefono de Emergencia')}</label><input id="ec-ecphone" value="${esc(c.emergencyPhone||'')}"></div>
    </div>

    <div style="display:flex;gap:10px;margin-top:6px">
      <button class="btn btn-teal" onclick="saveChildEdit()">&#10003; ${t('Save Changes','Guardar Cambios')}</button>
      <button class="mini-btn ghost" onclick="cancelEditChild()" style="padding:13px 20px">&#10005; ${t('Cancel','Cancelar')}</button>
    </div>
    <div class="form-msg" id="ec-msg"></div>
  </div>`;
}

/* ===================== ENROLLMENT PAGE ===================== */
function renderEnrollment() {
  const root = document.getElementById('enrollment-root');
  if (!root) return;
  root.innerHTML = enrollmentView();
}

function enrollmentView() {
  // If logged in as admin or teacher, show message
  if (CU && (CU.role === 'admin' || CU.role === 'teacher')) {
    return `<div class="card t-teal">
      <p class="lead">${t('You are logged in as','Usted esta conectado como')} ${esc(CU.name)}.</p>
      <p>${t('To manage enrollments, go to your portal.','Para gestionar inscripciones, vaya a su portal.')}</p>
      <button class="btn btn-night" onclick="goTo('portal')">${t('Go to Portal','Ir al Portal')}</button>
    </div>`;
  }

  // If logged in as parent
  if (CU && CU.role === 'parent') {
    const myEnrollments = DB.enrollments.filter(e => e.parentId === CU.id);
    let h = `<div class="card t-teal" style="margin-bottom:18px">
      <p class="lead">&#128075; ${t('Welcome back,','Bienvenido/a,')} ${esc(CU.name)}!</p>
      <p style="margin-bottom:0">${t('You can enroll another child below, or view your existing enrollments.','Puede inscribir otro hijo abajo, o ver sus inscripciones existentes.')}</p>
    </div>`;
    if (myEnrollments.length) {
      h += `<p class="lead" style="margin-bottom:10px">${t('Your Enrollment Requests','Sus Solicitudes de Inscripcion')}</p>`;
      h += myEnrollments.map(e => {
        const statusColor = {pending:'var(--gold)',approved:'var(--teal)',rejected:'var(--coral)'}[e.status] || 'var(--muted)';
        const statusLabel = {pending:t('Under Review','En Revision'),approved:t('Approved','Aprobado'),rejected:t('Not Approved','No Aprobado')}[e.status] || e.status;
        return `<div class="list-item">
          <div class="grow">
            <b>${esc(e.childInfo.name)}</b>
            <span class="tag" style="background:${statusColor}20;color:${statusColor}">${statusLabel}</span><br>
            <span class="soft" style="font-size:.82rem">${t('Submitted:','Enviado:')} ${fmtDate(e.submittedDate)}</span>
            ${e.status === 'approved' ? `<br><span class="soft" style="font-size:.82rem;color:var(--teal)">&#9989; ${t('Your child has been enrolled. You can view their info in your portal.','Su hijo fue inscrito. Puede verlo en su portal.')}</span>` : ''}
            ${e.status === 'rejected' ? `<br><span class="soft" style="font-size:.82rem;color:var(--coral)">&#128222; ${t('Please call us: (206) 255-4000','Por favor llamenos: (206) 255-4000')}</span>` : ''}
          </div>
          ${e.status === 'approved' ? `<button class="mini-btn ghost" onclick="goTo('portal')">${t('My Portal','Mi Portal')}</button>` : ''}
        </div>`;
      }).join('');
      h += '<hr style="border:none;border-top:1px solid #EAE2DA;margin:24px 0">';
    }
    h += enrollmentForm(true);
    return h;
  }

  // Not logged in — show intro + form
  return `
  <p style="margin-bottom:20px">${t('Fill out the form below to enroll your child. Your account will be created automatically so you can log in and track your child\'s progress.','Complete el formulario a continuacion para inscribir a su hijo. Su cuenta se creara automaticamente para que pueda iniciar sesion y seguir el progreso de su hijo.')}</p>
  ${enrollmentForm(false)}`;
}

function enrollmentForm(isLoggedIn) {
  const suggestClass = (dobVal) => {
    if (!dobVal) return '';
    const ageMonths = (Date.now() - new Date(dobVal).getTime()) / (30.44 * 24 * 3600 * 1000);
    if (ageMonths < 12) return DB.classes.find(c => c.name === 'Infants')?.id || '';
    if (ageMonths < 36) return DB.classes.find(c => c.name === 'Toddlers')?.id || '';
    if (ageMonths < 60) return DB.classes.find(c => c.name === 'Preschool')?.id || '';
    return DB.classes.find(c => c.name === 'School-Age')?.id || '';
  };

  let h = '';

  if (!isLoggedIn) {
    h += `
    <div class="card t-night" style="margin-bottom:0;border-radius:var(--radius) var(--radius) 0 0;border-bottom:none">
      <p class="lead">&#128100; ${t('Parent / Guardian Information','Informacion del Padre / Tutor')}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="field" style="margin:0"><label>${t('Full Name *','Nombre Completo *')}</label><input id="ef-pname" placeholder="${t('Maria Gonzalez','Maria Gonzalez')}"></div>
        <div class="field" style="margin:0"><label>${t('Phone Number *','Numero de Telefono *')}</label><input id="ef-phone" type="tel" placeholder="(206) 555-0000"></div>
      </div>
      <div class="field" style="margin-top:12px"><label>${t('Email Address','Correo Electronico')}</label><input id="ef-email" type="email" placeholder="email@example.com"></div>
      <div class="field"><label>${t('Home Address *','Direccion de Casa *')}</label><input id="ef-addr" placeholder="${t('e.g. 123 Main St, SeaTac, WA 98188','Ej.: 123 Main St, SeaTac, WA 98188')}"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:4px">
        <div class="field" style="margin:0"><label>${t('Choose a Username *','Elija un Usuario *')}</label><input id="ef-user" placeholder="mariag"></div>
        <div class="field" style="margin:0"><label>${t('Password * (min 6 chars)','Contrasena * (min 6)')}</label><input id="ef-pass" type="password"></div>
      </div>
    </div>`;
  }

  h += `
  <div class="card t-gold" style="margin-bottom:0;border-radius:${isLoggedIn ? 'var(--radius) var(--radius)' : '0 0'} 0 0;border-bottom:none">
    <p class="lead">&#128118; ${t("Child's Information","Informacion del Nino")}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="field" style="margin:0"><label>${t("Child's Full Name *","Nombre Completo del Nino *")}</label><input id="ef-cname" placeholder="${t('Emma Johnson','Emma Johnson')}"></div>
      <div class="field" style="margin:0"><label>${t('Date of Birth *','Fecha de Nacimiento *')}</label><input type="date" id="ef-dob" onchange="suggestClassroom(this.value)"></div>
    </div>
    <div class="field" style="margin-top:12px"><label>${t('Preferred Classroom','Salon Preferido')}</label>
      <select id="ef-class">${DB.classes.map(c => `<option value="${c.id}">${LANG === 'es' ? (CLS_ES[c.name] || c.name) : c.name}</option>`).join('')}</select>
      <small class="soft" style="font-size:.78rem">${t('Auto-suggested based on age. You may change it.','Sugerido por edad. Puede cambiarlo.')}</small>
    </div>
  </div>
  <div class="card t-coral" style="margin-bottom:0;border-radius:0;border-bottom:none">
    <p class="lead">&#9888; ${t('Health & Dietary Information','Informacion de Salud y Dieta')}</p>
    <div class="field"><label>${t('Allergies','Alergias')}</label><input id="ef-allergy" placeholder="${t('e.g. Peanuts, Dairy, Eggs (leave blank if none)','Ej.: Cacahuates, Lacteos, Huevos (dejar en blanco si no tiene)')}"></div>
    <div class="field"><label>${t('Food Preferences & Dietary Needs','Preferencias de Comida y Dieta')}</label><textarea id="ef-food" placeholder="${t('e.g. Halal only, vegetarian, no dairy...','Ej.: Solo halal, vegetariano, sin lacteos...')}"></textarea></div>
    <div class="field" style="margin-bottom:0"><label>${t('Medical Conditions / Other Health Notes','Condiciones Medicas / Notas de Salud')}</label><textarea id="ef-medical" placeholder="${t('e.g. Asthma (has inhaler), mild eczema...','Ej.: Asma (tiene inhalador), eczema leve...')}"></textarea></div>
  </div>
  <div class="card" style="margin-bottom:0;border-radius:0">
    <p class="lead">&#128222; ${t('Emergency Contact','Contacto de Emergencia')}</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="field" style="margin:0"><label>${t('Contact Name *','Nombre del Contacto *')}</label><input id="ef-ecname" placeholder="${t('John Smith','Juan Garcia')}"></div>
      <div class="field" style="margin:0"><label>${t('Contact Phone *','Telefono del Contacto *')}</label><input id="ef-ecphone" type="tel" placeholder="(206) 555-0000"></div>
    </div>
    <div class="field" style="margin-top:12px"><label>${t('Desired Start Date','Fecha Deseada de Inicio')}</label><input type="date" id="ef-start"></div>
    <div class="field"><label>${t('Additional Notes for Staff','Notas Adicionales para el Personal')}</label><textarea id="ef-notes" placeholder="${t('Pickup schedule, special routines, other important info...','Horario de recogida, rutinas especiales...')}"></textarea></div>
  </div>
  <div class="card" style="border-radius:0;border-top:none;border-bottom:none;background:#FFF8F4">
    <div style="display:flex;align-items:flex-start;gap:14px">
      <span style="font-size:1.5rem;flex-shrink:0">&#128222;</span>
      <div>
        <p class="lead" style="margin-bottom:6px">${t('Not sure? Contact us first!','No esta seguro? Contactenos primero!')}</p>
        <p style="font-size:.9rem;color:var(--ink);margin-bottom:12px">${t('If you have questions before enrolling, or prefer to speak with someone directly, we are happy to help.','Si tiene preguntas antes de inscribirse, o prefiere hablar con alguien directamente, con mucho gusto le ayudamos.')}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <a href="tel:+12062554000" class="btn btn-night" style="font-size:.9rem;padding:11px 20px">
            &#128222; ${t('Call Us','Llamenos')} &mdash; (206) 255-4000
          </a>
          <a href="mailto:ministarchildcare14@gmail.com" class="btn btn-gold" style="font-size:.9rem;padding:11px 20px">
            &#9993; ${t('Email Us','Escribanos')}
          </a>
        </div>
        <a href="https://maps.google.com/?q=17735+38th+Ave+South,+SeaTac,+WA+98188" target="_blank" rel="noopener" class="btn btn-teal" style="font-size:.9rem;padding:11px 20px;margin-top:4px;display:inline-block">
          &#128205; ${t('Visit Us — Get Directions','Visítenos — Como Llegar')}
        </a>
        <p style="font-size:.78rem;color:var(--muted);margin-top:10px;margin-bottom:0">
          &#128336; ${t('Open 24 Hours, 7 Days a Week','Abierto 24 Horas, 7 Dias a la Semana')}
          &nbsp;&middot;&nbsp; 17735 38th Ave South, SeaTac, WA 98188
        </p>
      </div>
    </div>
  </div>
  <div class="card t-teal" style="border-radius:0 0 var(--radius) var(--radius);border-top:none">
    <button class="btn btn-night btn-full" style="font-size:1.05rem;padding:15px" onclick="${isLoggedIn ? 'submitEnrollmentExisting()' : 'submitEnrollmentNew()'}">
      &#127775; ${t('Submit Enrollment Request','Enviar Solicitud de Inscripcion')}
    </button>
    <p class="soft" style="font-size:.8rem;margin-top:10px;margin-bottom:0;text-align:center">
      ${t('An admin will review your request and contact you within 1–2 business days.','Un administrador revisara su solicitud y se pondra en contacto en 1-2 dias habiles.')}
    </p>
    <div class="form-msg" id="ef-msg" style="margin-top:12px"></div>
  </div>`;

  return h;
}

function suggestClassroom(dobVal) {
  if (!dobVal) return;
  const ageMonths = (Date.now() - new Date(dobVal).getTime()) / (30.44 * 24 * 3600 * 1000);
  let suggested;
  if (ageMonths < 12) suggested = DB.classes.find(c => c.name === 'Infants');
  else if (ageMonths < 36) suggested = DB.classes.find(c => c.name === 'Toddlers');
  else if (ageMonths < 60) suggested = DB.classes.find(c => c.name === 'Preschool');
  else suggested = DB.classes.find(c => c.name === 'School-Age');
  if (suggested) {
    const el = document.getElementById('ef-class');
    if (el) el.value = suggested.id;
  }
}

function enrollmentCard(e, canAct) {
  const statusColor = {pending:'var(--gold)',approved:'var(--teal)',rejected:'#C03434'}[e.status] || 'var(--muted)';
  const statusLabel = {pending:t('Pending Review','En Revision'),approved:t('Approved','Aprobado'),rejected:t('Rejected','Rechazado')}[e.status] || e.status;
  const c = e.childInfo;
  const p = e.parentInfo;
  return `<div class="card" style="border-left:5px solid ${statusColor};margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:12px">
      <div>
        <b style="font-size:1.1rem;color:var(--night)">${esc(c.name)}</b>
        <span class="tag" style="background:${statusColor}20;color:${statusColor};margin-left:6px">${statusLabel}</span>
        <br><span class="soft" style="font-size:.8rem">${t('Submitted:','Enviado:')} ${fmtDate(e.submittedDate)}</span>
      </div>
      ${canAct ? `<div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start">
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <div>
            <div style="font-size:.72rem;font-weight:800;color:var(--muted);text-transform:uppercase;margin-bottom:3px">${t('Classroom','Salon')}</div>
            <select id="approve-cls-${e.id}" onchange="onApproveClassChange('${e.id}',this.value)" style="border:2px solid #EAE2DA;border-radius:10px;padding:7px 10px;font-family:'Nunito',sans-serif;font-size:.88rem">
              ${DB.classes.map(cl => `<option value="${cl.id}" ${cl.id === c.classPreference ? 'selected' : ''}>${LANG==='es'?(CLS_ES[cl.name]||cl.name):cl.name}</option>`).join('')}
            </select>
          </div>
          <div id="teacher-select-${e.id}">
            <div style="font-size:.72rem;font-weight:800;color:var(--muted);text-transform:uppercase;margin-bottom:3px">${t('Assign Teacher','Asignar Maestro')}</div>
            ${teacherSelectHtml(e.id, c.classPreference)}
          </div>
          <div style="align-self:flex-end">
            <button class="mini-btn success" onclick="approveEnrollment('${e.id}')">&#9989; ${t('Approve','Aprobar')}</button>
          </div>
        </div>
        <button class="mini-btn danger" onclick="rejectEnrollment('${e.id}')">&#10005; ${t('Reject','Rechazar')}</button>
      </div>` : ''}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:.88rem">
      <div class="rc-cell"><b>${t('Child DOB','Fecha Nac.')}</b>${esc(c.dob) || '-'}</div>
      <div class="rc-cell"><b>${t('Preferred Class','Salon Pref.')}</b>${esc(LANG==='es'?(CLS_ES[DB.classes.find(x=>x.id===c.classPreference)?.name||'']||DB.classes.find(x=>x.id===c.classPreference)?.name||'-'):DB.classes.find(x=>x.id===c.classPreference)?.name||'-')}</div>
      <div class="rc-cell"><b>${t('Allergies','Alergias')}</b>${esc(c.allergies)||t('None','Ninguna')}</div>
      <div class="rc-cell"><b>${t('Start Date','Fecha Inicio')}</b>${c.startDate ? fmtDate(c.startDate) : '-'}</div>
    </div>
    ${c.food ? `<div class="rc-note" style="margin-top:8px"><b>${t('Food / Diet','Comida / Dieta')}</b>${esc(c.food)}</div>` : ''}
    ${c.medical ? `<div class="rc-note" style="margin-top:6px"><b>${t('Medical Notes','Notas Medicas')}</b>${esc(c.medical)}</div>` : ''}
    ${c.notes ? `<div class="rc-note" style="margin-top:6px"><b>${t('Additional Notes','Notas Adicionales')}</b>${esc(c.notes)}</div>` : ''}
    <hr style="border:none;border-top:1px solid #EAE2DA;margin:12px 0 8px">
    <div style="font-size:.85rem;color:var(--muted)">
      <b style="color:var(--night)">${t('Parent:','Padre/Madre:')} ${esc(p.name)}</b>
      &nbsp;|&nbsp; &#128222; <a href="tel:${esc(p.phone.replace(/\D/g,''))}" class="contact-link">${esc(p.phone)}</a>
      ${p.email ? `&nbsp;|&nbsp; &#9993; <a href="mailto:${esc(p.email)}" class="contact-link">${esc(p.email)}</a>` : ''}
      ${p.address ? `<br>&#128205; ${esc(p.address)}` : ''}
    </div>
    <div style="font-size:.83rem;color:var(--muted);margin-top:4px">
      ${t('Emergency:','Emergencia:')} ${esc(c.emergencyName)} &mdash; <a href="tel:${esc(c.emergencyPhone.replace(/\D/g,''))}" class="contact-link">${esc(c.emergencyPhone)}</a>
    </div>
    ${e.status === 'approved' && e.assignedClassId ? `<div style="margin-top:8px;font-size:.83rem;color:var(--teal);font-weight:800">&#9989; ${t('Enrolled in:','Inscrito en:')} ${esc(LANG==='es'?(CLS_ES[DB.classes.find(x=>x.id===e.assignedClassId)?.name||'']||DB.classes.find(x=>x.id===e.assignedClassId)?.name||'-'):DB.classes.find(x=>x.id===e.assignedClassId)?.name||'-')}</div>` : ''}
  </div>`;
}

/* ===================== ACTIONS ===================== */
function toggleEcParent(labelEl, parentId, childId) {
  const cb = labelEl.querySelector('input[type="checkbox"]');
  if (!cb) return;
  // checkbox state toggled by the click already — just update visual
  setTimeout(() => {
    const on = cb.checked;
    labelEl.style.background = on ? '#DCEFE9' : '#fff';
    labelEl.style.borderColor = on ? 'var(--teal)' : '#EAE2DA';
  }, 0);
}

function saveChildEdit() {
  const c = DB.children.find(x => x.id === EDIT_CHILD_ID);
  if (!c) return;
  const name = (document.getElementById('ec-name').value || '').trim();
  if (!name) { msg('ec-msg', errT(new Error('missing'))); return; }

  const newClassId = document.getElementById('ec-class').value;
  const teacherEl  = document.getElementById('ec-teacher');
  const teacherId  = teacherEl ? teacherEl.value : '';

  // If a specific teacher was chosen, assign them to this classroom
  if (teacherId) {
    const te = DB.users.find(u => u.id === teacherId);
    if (te) te.classId = newClassId;
  }

  c.name             = name;
  c.dob              = document.getElementById('ec-dob').value || c.dob;
  c.classId          = newClassId;
  c.allergies        = (document.getElementById('ec-allergy').value || '').trim();
  c.food             = (document.getElementById('ec-food').value || '').trim();
  c.notes            = (document.getElementById('ec-notes').value || '').trim();
  c.emergencyContact = (document.getElementById('ec-ecname').value || '').trim();
  c.emergencyPhone   = (document.getElementById('ec-ecphone').value || '').trim();

  // Update parent links if admin form
  const parentBoxes = document.querySelectorAll('.ec-parent');
  if (parentBoxes.length) {
    c.parentIds = [...parentBoxes].filter(b => b.checked).map(b => b.value);
  }

  saveDB();
  EDIT_CHILD_ID = null;
  renderPortal();
}

function _collectChildInfo() {
  return {
    name: (document.getElementById('ef-cname').value || '').trim(),
    dob: document.getElementById('ef-dob').value || '',
    classPreference: document.getElementById('ef-class').value,
    allergies: (document.getElementById('ef-allergy').value || '').trim(),
    food: (document.getElementById('ef-food').value || '').trim(),
    medical: (document.getElementById('ef-medical').value || '').trim(),
    emergencyName: (document.getElementById('ef-ecname').value || '').trim(),
    emergencyPhone: (document.getElementById('ef-ecphone').value || '').trim(),
    startDate: document.getElementById('ef-start').value || '',
    notes: (document.getElementById('ef-notes').value || '').trim()
  };
}

function submitEnrollmentNew() {
  const pname = (document.getElementById('ef-pname').value || '').trim();
  const phone = (document.getElementById('ef-phone').value || '').trim();
  const email = (document.getElementById('ef-email').value || '').trim();
  const addr  = (document.getElementById('ef-addr').value || '').trim();
  const uname = (document.getElementById('ef-user').value || '').trim();
  const pass  = (document.getElementById('ef-pass').value || '');
  const child = _collectChildInfo();
  if (!pname || !phone || !addr || !uname || !pass || !child.name || !child.dob || !child.emergencyName || !child.emergencyPhone) {
    msg('ef-msg', t('Please fill in all required fields (marked with *).', 'Por favor complete todos los campos obligatorios (marcados con *).'));
    return;
  }
  if (pass.length < 6) { msg('ef-msg', errT(new Error('short'))); return; }
  if (DB.users.find(u => u.username.toLowerCase() === uname.toLowerCase())) { msg('ef-msg', errT(new Error('taken'))); return; }
  const newParent = { id: uid(), name: pname, username: uname, password: pass, role: 'parent', classId: null, phone, email, address: addr };
  DB.users.push(newParent);
  const enrollment = { id: uid(), parentId: newParent.id, parentInfo: { name: pname, phone, email, address: addr, username: uname }, childInfo: child, status: 'pending', submittedDate: today(), assignedClassId: null, childId: null };
  DB.enrollments.push(enrollment);
  saveDB();
  CU = newParent;
  SUB = 'children';
  const root = document.getElementById('enrollment-root');
  if (root) root.innerHTML = `<div class="card t-teal">
    <p class="lead" style="font-size:1.2rem">&#127775; ${t('Enrollment Submitted!','Inscripcion Enviada!')}</p>
    <p>${t('Thank you, ','Gracias, ')}${esc(pname)}! ${t('Your account has been created and your enrollment request for','Su cuenta ha sido creada y su solicitud de inscripcion para')} <b>${esc(child.name)}</b> ${t('has been submitted for admin review.','ha sido enviada para revision del administrador.')}</p>
    <p>${t('You will be contacted within 1–2 business days. In the meantime, you can log in with your new account to check your enrollment status.','Sera contactado en 1-2 dias habiles. Mientras tanto, puede iniciar sesion con su nueva cuenta para verificar el estado.')}</p>
    <button class="btn btn-night" onclick="goTo('portal')">${t('Go to My Account', 'Ir a Mi Cuenta')} &rarr;</button>
  </div>`;
  renderPortal();
}

function submitEnrollmentExisting() {
  const child = _collectChildInfo();
  if (!child.name || !child.dob || !child.emergencyName || !child.emergencyPhone) {
    msg('ef-msg', t('Please fill in all required fields (marked with *).', 'Por favor complete todos los campos obligatorios (marcados con *).'));
    return;
  }
  const p = CU;
  const enrollment = { id: uid(), parentId: p.id, parentInfo: { name: p.name, phone: p.phone || '', email: p.email || '', username: p.username }, childInfo: child, status: 'pending', submittedDate: today(), assignedClassId: null, childId: null };
  DB.enrollments.push(enrollment);
  saveDB();
  renderEnrollment();
  msg('ef-msg', t('Enrollment submitted! An admin will review it shortly.', 'Inscripcion enviada! Un administrador la revisara pronto.'), true);
}

/* --- email helpers (mailto: opens device email client) --- */
function emailEnrollmentApproved(parentEmail, parentName, childName, className) {
  if (!parentEmail) return;
  const sub = encodeURIComponent('Mini Star Child Care - Enrollment Approved for ' + childName);
  const body = encodeURIComponent(
    'Dear ' + parentName + ',\n\n' +
    'Great news! Your enrollment request for ' + childName + ' has been APPROVED.\n\n' +
    'Your child has been enrolled in the ' + className + ' classroom.\n\n' +
    'You can now log in to your account on our website to track daily reports, messages, and payments.\n\n' +
    'Welcome to the Mini Star Child Care family!\n\n' +
    'Mini Star Child Care\n(206) 255-4000\nministarchildcare14@gmail.com\n17735 38th Ave South, SeaTac, WA 98188'
  );
  window.open('mailto:' + parentEmail + '?subject=' + sub + '&body=' + body);
}

function emailEnrollmentRejected(parentEmail, parentName, childName) {
  if (!parentEmail) return;
  const sub = encodeURIComponent('Mini Star Child Care - Enrollment Update for ' + childName);
  const body = encodeURIComponent(
    'Dear ' + parentName + ',\n\n' +
    'Thank you for your interest in Mini Star Child Care.\n\n' +
    'Unfortunately, we are unable to process the enrollment request for ' + childName + ' at this time. This may be due to limited availability.\n\n' +
    'Please contact us directly so we can assist you further.\n\n' +
    'Mini Star Child Care\n(206) 255-4000\nministarchildcare14@gmail.com\n17735 38th Ave South, SeaTac, WA 98188'
  );
  window.open('mailto:' + parentEmail + '?subject=' + sub + '&body=' + body);
}

function emailNewMessage(toEmail, toName, fromName, childName) {
  if (!toEmail) return;
  const sub = encodeURIComponent('New message from Mini Star Child Care');
  const body = encodeURIComponent(
    'Dear ' + toName + ',\n\n' +
    'You have a new message from ' + fromName + (childName ? ' regarding ' + childName : '') + '.\n\n' +
    'Please log in to your account on our website to read the message.\n\n' +
    'Mini Star Child Care\n(206) 255-4000\nministarchildcare14@gmail.com'
  );
  window.open('mailto:' + toEmail + '?subject=' + sub + '&body=' + body);
}

/* --- teacher select helpers for enrollment card --- */
function teacherSelectHtml(enrollId, classId) {
  const teachers = DB.users.filter(u => u.role === 'teacher' && u.classId === classId);
  return `<select id="approve-teacher-${enrollId}" style="border:2px solid #EAE2DA;border-radius:10px;padding:7px 10px;font-family:'Nunito',sans-serif;font-size:.88rem">
    <option value="">${t('Any (by classroom)','Cualquier maestro')}</option>
    ${teachers.map(te => `<option value="${te.id}">${esc(te.name)}</option>`).join('')}
  </select>`;
}

function onApproveClassChange(enrollId, classId) {
  const container = document.getElementById('teacher-select-' + enrollId);
  if (!container) return;
  container.innerHTML = `<div style="font-size:.72rem;font-weight:800;color:var(--muted);text-transform:uppercase;margin-bottom:3px">${t('Assign Teacher','Asignar Maestro')}</div>` + teacherSelectHtml(enrollId, classId);
}

function approveEnrollment(id) {
  const e = DB.enrollments.find(x => x.id === id);
  if (!e) return;
  const classId = document.getElementById('approve-cls-' + id).value;
  const teacherEl = document.getElementById('approve-teacher-' + id);
  const teacherId = teacherEl ? teacherEl.value : '';

  // If a specific teacher is chosen, make sure their classId matches
  if (teacherId) {
    const te = DB.users.find(u => u.id === teacherId);
    if (te && te.classId !== classId) {
      te.classId = classId;
    }
  }

  // Create or find parent user
  let parentUser = DB.users.find(u => u.id === e.parentId);
  if (!parentUser) {
    parentUser = DB.users.find(u => u.username && u.username.toLowerCase() === (e.parentInfo.username || '').toLowerCase());
  }
  if (!parentUser) {
    parentUser = { id: uid(), name: e.parentInfo.name, username: e.parentInfo.username, password: 'changeme', role: 'parent', classId: null, phone: e.parentInfo.phone || '', email: e.parentInfo.email || '', address: e.parentInfo.address || '' };
    DB.users.push(parentUser);
    e.parentId = parentUser.id;
  }

  // Create child record
  const c = e.childInfo;
  const newChild = {
    id: uid(), name: c.name, dob: c.dob, classId,
    parentIds: [parentUser.id],
    allergies: c.allergies || '', food: c.food || '',
    emergencyContact: c.emergencyName, emergencyPhone: c.emergencyPhone,
    notes: [c.medical, c.notes].filter(Boolean).join(' | ')
  };
  DB.children.push(newChild);
  e.status = 'approved';
  e.assignedClassId = classId;
  e.childId = newChild.id;
  saveDB();

  // Send approval email
  const cls = DB.classes.find(x => x.id === classId);
  emailEnrollmentApproved(parentUser.email, parentUser.name, c.name, cls ? cls.name : '');

  renderPortal();
}

function rejectEnrollment(id) {
  if (!confirm(t('Reject this enrollment request?', 'Rechazar esta solicitud de inscripcion?'))) return;
  const e = DB.enrollments.find(x => x.id === id);
  if (!e) return;
  e.status = 'rejected';
  saveDB();

  // Find parent to send rejection email
  const parentUser = DB.users.find(u => u.id === e.parentId);
  const email = (parentUser && parentUser.email) || e.parentInfo.email;
  emailEnrollmentRejected(email, e.parentInfo.name, e.childInfo.name);

  renderPortal();
}

function addChild() {
  const name = (document.getElementById('nc-name').value || '').trim();
  if (!name) { msg('nc-msg', errT(new Error('missing'))); return; }
  const parentIds = [...document.querySelectorAll('.nc-parent:checked')].map(x => x.value);
  const child = {
    id: uid(),
    name,
    dob: document.getElementById('nc-dob').value || '',
    classId: document.getElementById('nc-class').value,
    parentIds,
    allergies: (document.getElementById('nc-allergy').value || '').trim(),
    emergencyContact: (document.getElementById('nc-ec').value || '').trim(),
    notes: (document.getElementById('nc-notes').value || '').trim()
  };
  DB.children.push(child);
  saveDB();
  msg('nc-msg', t('Child added!', 'Nino agregado!'), true);
  renderPortal();
}

function delChild(id) {
  if (!confirm(t('Remove this child and all their data?', 'Eliminar este nino y todos sus datos?'))) return;
  DB.children = DB.children.filter(c => c.id !== id);
  DB.reports = DB.reports.filter(r => r.childId !== id);
  DB.payments = DB.payments.filter(p => p.childId !== id);
  DB.messages = DB.messages.filter(m => m.childId !== id);
  saveDB();
  renderPortal();
}

function addTeacher() {
  const name = (document.getElementById('nt-name').value || '').trim();
  const u = (document.getElementById('nt-user').value || '').trim();
  const p = (document.getElementById('nt-pass').value || '');
  if (!name || !u || !p) { msg('nt-msg', errT(new Error('missing'))); return; }
  if (p.length < 6) { msg('nt-msg', errT(new Error('short'))); return; }
  if (DB.users.find(x => x.username.toLowerCase() === u.toLowerCase())) { msg('nt-msg', errT(new Error('taken'))); return; }
  DB.users.push({ id: uid(), name, username: u, password: p, role: 'teacher', classId: document.getElementById('nt-class').value });
  saveDB();
  renderPortal();
}

function delUser(id) {
  if (!confirm(t('Remove this account?', 'Eliminar esta cuenta?'))) return;
  DB.users = DB.users.filter(u => u.id !== id);
  DB.children.forEach(c => { c.parentIds = (c.parentIds || []).filter(x => x !== id); });
  saveDB();
  renderPortal();
}

function toggleLink(parentId, childId, on) {
  const c = DB.children.find(x => x.id === childId);
  if (!c) return;
  c.parentIds = c.parentIds || [];
  if (on) { if (!c.parentIds.includes(parentId)) c.parentIds.push(parentId); }
  else { c.parentIds = c.parentIds.filter(x => x !== parentId); }
  saveDB();
}

function quickCheck(childId, kind) {
  const d = today();
  let r = getReport(childId, d);
  if (!r) {
    r = { id: uid(), childId, teacherId: CU.id, date: d, checkIn: '', checkOut: '', mood: '', meals: '', nap: '', activities: '', note: '' };
    DB.reports.push(r);
  }
  if (kind === 'in') r.checkIn = nowTime();
  else r.checkOut = nowTime();
  saveDB();
  renderPortal();
}

function saveReport() {
  const childId = document.getElementById('rp-child').value;
  const date = document.getElementById('rp-date').value || today();
  let r = getReport(childId, date);
  const body = {
    childId, date, teacherId: CU.id,
    checkIn: document.getElementById('rp-in').value,
    checkOut: document.getElementById('rp-out').value,
    mood: FORM_MOOD,
    meals: (document.getElementById('rp-meals').value || '').trim(),
    nap: (document.getElementById('rp-nap').value || '').trim(),
    activities: (document.getElementById('rp-act').value || '').trim(),
    note: (document.getElementById('rp-note').value || '').trim()
  };
  if (r) { Object.assign(r, body); }
  else { DB.reports.push({ id: uid(), ...body }); }
  saveDB();
  FORM_MOOD = '';
  msg('rp-msg', t('Report saved! Parents can now see it.', 'Reporte guardado! Los padres ya pueden verlo.'), true);
  renderPortal();
}

function addPayment() {
  const childId = document.getElementById('np-child').value;
  const amount = parseFloat(document.getElementById('np-amount').value);
  const dueDate = document.getElementById('np-due').value;
  const description = (document.getElementById('np-desc').value || '').trim();
  if (!childId || !amount || !dueDate) { msg('np-msg', errT(new Error('missing'))); return; }
  DB.payments.push({ id: uid(), childId, amount, description, dueDate, paid: false, paidDate: null });
  saveDB();
  renderPortal();
}

function markPaid(id) {
  const p = DB.payments.find(x => x.id === id);
  if (p) { p.paid = true; p.paidDate = today(); saveDB(); renderPortal(); }
}

function delPayment(id) {
  if (!confirm(t('Delete this payment record?', 'Eliminar este registro de pago?'))) return;
  DB.payments = DB.payments.filter(p => p.id !== id);
  saveDB();
  renderPortal();
}

function _notifyRecipientByEmail(toId, childId) {
  const toUser = userById(toId);
  if (!toUser || !toUser.email) return;
  // Only email if recipient is a parent or teacher (has email set)
  const child = childId ? childById(childId) : null;
  emailNewMessage(toUser.email, toUser.name, CU.name, child ? child.name : '');
}

function adminSendMsg() {
  const toId = document.getElementById('am-to').value;
  const childId = document.getElementById('am-child').value;
  const text = (document.getElementById('am-text').value || '').trim();
  if (!toId || !text) { msg('am-msg', errT(new Error('missing'))); return; }
  DB.messages.push({ id: uid(), fromId: CU.id, toId, childId: childId || null, text, date: today(), time: nowTime(), read: false });
  saveDB();
  document.getElementById('am-text').value = '';
  msg('am-msg', t('Message sent!', 'Mensaje enviado!'), true);
  _notifyRecipientByEmail(toId, childId || null);
  renderPortal();
}

function teacherSendMsg() {
  const toId = document.getElementById('tm-to').value;
  const childId = document.getElementById('tm-child').value;
  const text = (document.getElementById('tm-text').value || '').trim();
  if (!toId || !text) { msg('tm-msg', errT(new Error('missing'))); return; }
  DB.messages.push({ id: uid(), fromId: CU.id, toId, childId: childId || null, text, date: today(), time: nowTime(), read: false });
  saveDB();
  document.getElementById('tm-text').value = '';
  msg('tm-msg', t('Message sent!', 'Mensaje enviado!'), true);
  _notifyRecipientByEmail(toId, childId || null);
  renderPortal();
}

function parentSendMsg() {
  const toId = document.getElementById('pm-to').value;
  const childEl = document.getElementById('pm-child');
  const childId = childEl ? childEl.value : '';
  const text = (document.getElementById('pm-text').value || '').trim();
  if (!toId || !text) { msg('pm-msg', errT(new Error('missing'))); return; }
  DB.messages.push({ id: uid(), fromId: CU.id, toId, childId: childId || null, text, date: today(), time: nowTime(), read: false });
  saveDB();
  document.getElementById('pm-text').value = '';
  msg('pm-msg', t('Message sent!', 'Mensaje enviado!'), true);
  _notifyRecipientByEmail(toId, childId || null);
  renderPortal();
}

/* ---------- change password ---------- */
function changePassword() {
  const oldPass = prompt(t('Enter your current password:', 'Ingrese su contrasena actual:'));
  if (oldPass == null) return;
  if (oldPass !== CU.password) {
    alert(t('Current password is incorrect.', 'La contrasena actual es incorrecta.'));
    return;
  }
  const newPass = prompt(t('Enter your new password (at least 6 characters):', 'Ingrese su nueva contrasena (minimo 6 caracteres):'));
  if (newPass == null) return;
  if (newPass.length < 6) {
    alert(t('Password must be at least 6 characters.', 'La contrasena debe tener al menos 6 caracteres.'));
    return;
  }
  const confirmPass = prompt(t('Confirm your new password:', 'Confirme su nueva contrasena:'));
  if (confirmPass !== newPass) {
    alert(t('Passwords do not match.', 'Las contrasenas no coinciden.'));
    return;
  }
  // Update in DB
  const u = DB.users.find(x => x.id === CU.id);
  if (u) u.password = newPass;
  CU.password = newPass;
  saveDB();
  alert(t('Password changed successfully!', 'Contrasena cambiada exitosamente!'));
}

/* ---------- init ---------- */
loadDB();
applyLang();
document.querySelectorAll('[data-page="portal"]').forEach(b => b.addEventListener('click', () => { if (CU) renderPortal(); }));
document.querySelectorAll('[data-page="enrollment"]').forEach(b => b.addEventListener('click', () => setTimeout(renderEnrollment, 0)));
renderPortal();
renderEnrollment();
