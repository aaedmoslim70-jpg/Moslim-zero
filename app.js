/* ======================================================================
   وكالة جامعة البطانة للسفر والسياحة — التطبيق الكامل
   ====================================================================== */

/* ---------- إدارة الحالة ---------- */
const STATE_KEY = 'batana_agency_state';

function getState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? JSON.parse(raw) : { users: [], bookings: [], recovery: [], visits: 0, session: null };
  } catch (e) {
    return { users: [], bookings: [], recovery: [], visits: 0, session: null };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (e) {}
  return state;
}

function loadState() {
  const state = getState();
  state.visits = (state.visits || 0) + 1;
  saveState(state);
  return state;
}

let state = loadState();

/* ---------- دوال السمات واللغة ---------- */
function setTheme(theme) {
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add('theme-' + theme);
}

let currentLang = 'ar';

const TR = {
  brand: {ar:'وكالة جامعة البطانة ✦', en:'Batana Agency ✦'},
  subBrand: {ar:'للسفر والسياحة', en:'Travel & Tourism'},
  login: {ar:'تسجيل الدخول', en:'Login'},
  welcome: {ar:'وكالة جامعة البطانة للسفر والسياحة', en:'Batana Travel & Tourism Agency'},
  titleRegister: {ar:'إنشاء حساب جديد', en:'Create New Account'},
  fullname: {ar:'الاسم الثلاثي', en:'Full Name (3 parts)'},
  phone: {ar:'رقم الهاتف', en:'Phone Number'},
  email: {ar:'البريد الإلكتروني', en:'Email'},
  password: {ar:'كلمة المرور', en:'Password'},
  confirmPassword: {ar:'إعادة كلمة المرور', en:'Confirm Password'},
  loginButton: {ar:'تسجيل الدخول', en:'Login'},
  btnRegister: {ar:'إنشاء الحساب', en:'Create Account'},
  haveAccount: {ar:'لديك حساب بالفعل؟', en:'Already have an account?'},
  noAccount: {ar:'ليس لديك حساب؟', en:"Don't have an account?"},
  registerLink: {ar:'إنشاء حساب جديد', en:'Create new account'},
  footer: {ar:'وكالة جامعة البطانة للسفر والسياحة — رحلتك تبدأ من هنا', en:'Batana Travel & Tourism — Your journey starts here'},
  errName: {ar:'يرجى كتابة الاسم الثلاثي كاملاً (ثلاث كلمات على الأقل)', en:'Please enter your full name (at least 3 parts)'},
  errPhone: {ar:'رقم الهاتف غير صحيح', en:'Invalid phone number'},
  errEmail: {ar:'البريد الإلكتروني غير صحيح', en:'Invalid email address'},
  errPasswordShort: {ar:'كلمة المرور يجب ألا تقل عن 6 أحرف', en:'Password must be at least 6 characters'},
  errPasswordMatch: {ar:'كلمة المرور وإعادة كلمة المرور غير متطابقتين', en:'Passwords do not match'},
  errExists: {ar:'هذا البريد الإلكتروني مسجّل بالفعل، جرّب تسجيل الدخول', en:'This email is already registered, try logging in'},
  errLogin: {ar:'البريد الإلكتروني أو كلمة المرور غير صحيحة', en:'Incorrect email or password'},
};

function setLang(lang) {
  currentLang = lang;
  const body = document.getElementById('pageBody');
  const html = document.getElementById('htmlRoot');
  body.classList.remove('lang-ar', 'lang-en');
  body.classList.add('lang-' + lang);
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const brandText = document.getElementById('brandText');
  if (brandText && brandText.childNodes[0]) brandText.childNodes[0].textContent = TR.brand[lang] + ' ';
  setText('subBrandText', TR.subBrand[lang]);
  setText('loginNavLabel', TR.login[lang]);
  setText('welcomeText', TR.welcome[lang]);
  setText('footerText', TR.footer[lang]);
  document.getElementById('pageTitle').textContent = TR.welcome[lang];

  setText('titleLogin', TR.login[lang]);
  setText('labelEmail', TR.email[lang]);
  setText('labelPassword', TR.password[lang]);
  setText('btnLogin', TR.loginButton[lang]);
  setText('noAccountText', TR.noAccount[lang]);
  setText('registerLink', TR.registerLink[lang]);

  setText('titleRegister', TR.titleRegister[lang]);
  setText('labelFullname', TR.fullname[lang]);
  setText('labelPhone', TR.phone[lang]);
  setText('labelConfirmPassword', TR.confirmPassword[lang]);
  setText('btnRegister', TR.btnRegister[lang]);
  setText('haveAccountText', TR.haveAccount[lang]);
  setText('loginLink', TR.login[lang]);
}

/* ---------- بيانات الفنادق ---------- */
const HOTELS = {
  royal7: { name: "برج البطانة الملكي", stars: 7, city: "الخرطوم - السودان", scope: "local", rooms: [
    { type: "single", label: "غرفة مفردة ملكية",  capacity: "شخص واحد", price: 150000 },
    { type: "double", label: "غرفة مزدوجة ملكية", capacity: "شخصان",    price: 220000 },
    { type: "family", label: "جناح عائلي ملكي",   capacity: "4 أشخاص",  price: 380000 }
  ]},
  diamond6: { name: "فندق الواحة الماسية", stars: 6, city: "الخرطوم - السودان", scope: "local", rooms: [
    { type: "single", label: "غرفة مفردة ديلوكس",  capacity: "شخص واحد", price: 110000 },
    { type: "double", label: "غرفة مزدوجة ديلوكس", capacity: "شخصان",    price: 170000 },
    { type: "family", label: "جناح عائلي ديلوكس",  capacity: "4 أشخاص",  price: 290000 }
  ]},
  palm5: { name: "فندق النخيل الذهبي", stars: 5, city: "الخرطوم - السودان", scope: "local", rooms: [
    { type: "single", label: "غرفة مفردة",  capacity: "شخص واحد", price: 35000 },
    { type: "double", label: "غرفة مزدوجة", capacity: "شخصان",    price: 55000 },
    { type: "family", label: "جناح عائلي",  capacity: "4 أشخاص",  price: 95000 }
  ]},
  ufuq4: { name: "فندق الأفق", stars: 4, city: "الخرطوم - السودان", scope: "local", rooms: [
    { type: "single", label: "غرفة مفردة",  capacity: "شخص واحد", price: 25000 },
    { type: "double", label: "غرفة مزدوجة", capacity: "شخصان",    price: 40000 },
    { type: "family", label: "جناح عائلي",  capacity: "4 أشخاص",  price: 70000 }
  ]},
  musafir3: { name: "فندق المسافر", stars: 3, city: "بورتسودان - السودان", scope: "local", rooms: [
    { type: "single", label: "غرفة مفردة",  capacity: "شخص واحد", price: 15000 },
    { type: "double", label: "غرفة مزدوجة", capacity: "شخصان",    price: 25000 },
    { type: "family", label: "جناح عائلي",  capacity: "4 أشخاص",  price: 45000 }
  ]},
  dubai7: { name: "فندق برج البطانة - دبي", stars: 7, city: "دبي - الإمارات", scope: "intl", rooms: [
    { type: "single", label: "غرفة مفردة ملكية",  capacity: "شخص واحد", price: 400000 },
    { type: "double", label: "غرفة مزدوجة ملكية", capacity: "شخصان",    price: 600000 },
    { type: "family", label: "جناح عائلي ملكي",   capacity: "4 أشخاص",  price: 950000 }
  ]},
  cairo5: { name: "فندق النيل الدولي - القاهرة", stars: 5, city: "القاهرة - مصر", scope: "intl", rooms: [
    { type: "single", label: "غرفة مفردة ديلوكس",  capacity: "شخص واحد", price: 90000 },
    { type: "double", label: "غرفة مزدوجة ديلوكس", capacity: "شخصان",    price: 140000 },
    { type: "family", label: "جناح عائلي",         capacity: "4 أشخاص",  price: 230000 }
  ]},
  jeddah4: { name: "فندق الكورنيش - جدة", stars: 4, city: "جدة - السعودية", scope: "intl", rooms: [
    { type: "single", label: "غرفة مفردة",  capacity: "شخص واحد", price: 70000 },
    { type: "double", label: "غرفة مزدوجة", capacity: "شخصان",    price: 110000 },
    { type: "family", label: "جناح عائلي",  capacity: "4 أشخاص",  price: 190000 }
  ]}
};
const DEFAULT_HOTEL_ID = "palm5";
function starsToText(n) { return "★".repeat(n); }
function getHotel(id) { return HOTELS[id] || HOTELS[DEFAULT_HOTEL_ID]; }

/* ---------- بيانات الرحلات المحلية ---------- */
const LOCAL_LAND_TRIPS = {
  taxi: [
    { route: 'الخرطوم (المطار) ✕ الخرطوم بحري', subtitle: 'حجز فوري - يصل خلال 10-15 دقيقة', price: 6000 },
    { route: 'الخرطوم ✕ أم درمان', subtitle: 'حجز فوري - يصل خلال 15-20 دقيقة', price: 5500 },
    { route: 'الخرطوم ✕ ودمدني - ولاية الجزيرة', subtitle: 'مدة الرحلة تقريباً 2س', price: 35000 },
    { route: 'الخرطوم ✕ سنار', subtitle: 'مدة الرحلة تقريباً 3س', price: 48000 }
  ],
  bus: [
    { route: 'الخرطوم 🚌 بورتسودان - ولاية البحر الأحمر', subtitle: 'مغادرة 07:00 - وصول 17:00 (10س)', price: 28000 },
    { route: 'الخرطوم 🚌 كسلا - ولاية كسلا', subtitle: 'مغادرة 08:00 - وصول 15:00 (7س)', price: 22000 },
    { route: 'الخرطوم 🚌 الأبيض - ولاية شمال كردفان', subtitle: 'مغادرة 09:00 - وصول 15:30 (6س 30د)', price: 18000 },
    { route: 'الخرطوم 🚌 نيالا - ولاية جنوب دارفور', subtitle: 'مغادرة 06:00 - وصول 20:00 (14س)', price: 40000 }
  ],
  coach: [
    { route: 'الخرطوم 🚍 القضارف - ولاية القضارف', subtitle: 'خدمة حافلة ممتازة VIP - مغادرة 07:30 - وصول 13:30 (6س)', price: 32000 },
    { route: 'الخرطوم 🚍 الدمازين - ولاية النيل الأزرق', subtitle: 'خدمة حافلة ممتازة VIP - مغادرة 06:30 - وصول 14:00 (7س 30د)', price: 36000 },
    { route: 'الخرطوم 🚍 الفاشر - ولاية شمال دارفور', subtitle: 'خدمة نوم Sleeper - مغادرة 05:00 - وصول (اليوم التالي) 06:00', price: 60000 }
  ]
};
const LOCAL_AIRLINES = [
  { id: 'sudanair', name: 'الخطوط الجوية السودانية' },
  { id: 'badr', name: 'بدر إيرلاينز' },
  { id: 'target', name: 'طيران تارجت' }
];
const LOCAL_FLIGHTS = [
  { route: 'الخرطوم ✈ بورتسودان', subtitle: 'مغادرة 08:00 - وصول 09:15 (1س 15د)', price: 45000 },
  { route: 'الخرطوم ✈ نيالا', subtitle: 'مغادرة 11:30 - وصول 13:00 (1س 30د)', price: 52000 },
  { route: 'الخرطوم ✈ كسلا', subtitle: 'مغادرة 15:00 - وصول 16:00 (1س)', price: 38000 },
  { route: 'الخرطوم ✈ الفاشر', subtitle: 'مغادرة 10:00 - وصول 11:45 (1س 45د)', price: 56000 }
];

/* ---------- بيانات الرحلات الدولية ---------- */
const INTL_BUS_COMPANIES = [
  { id: 'nileblue', name: 'حافلات النيل الأزرق' },
  { id: 'baraka', name: 'بركة السودان للنقل' },
  { id: 'fastline', name: 'الخط السريع' }
];
const INTL_BUS_ROUTES = [
  { route: 'الخرطوم 🚌 القاهرة (عبر أسوان)', subtitle: 'مغادرة 06:00 - وصول (اليوم التالي) 14:00', price: 95000 },
  { route: 'كسلا 🚌 القضارف - الحدود الإثيوبية', subtitle: 'مغادرة 07:30 - وصول 13:00 (5س 30د)', price: 30000 },
  { route: 'الخرطوم 🚌 جوبا - جنوب السودان', subtitle: 'مغادرة 05:00 - وصول (اليوم التالي) 18:00', price: 120000 }
];
const INTL_AIRLINES = LOCAL_AIRLINES;
const INTL_FLIGHTS = [
  { route: 'الخرطوم ✈ القاهرة', subtitle: 'مغادرة 09:00 - وصول 12:30 (2س 30د)', price: 210000 },
  { route: 'الخرطوم ✈ دبي', subtitle: 'مغادرة 14:00 - وصول 19:30 (3س 30د)', price: 320000 },
  { route: 'الخرطوم ✈ جدة', subtitle: 'مغادرة 20:00 - وصول 22:30 (2س 30د)', price: 250000 },
  { route: 'الخرطوم ✈ إسطنبول', subtitle: 'مغادرة 23:00 - وصول 04:30 (4س 30د)', price: 410000 }
];
const INTL_BOAT_COMPANIES = [
  { id: 'wadihalfa', name: 'معديات وادي حلفا النيلية' },
  { id: 'portsudansea', name: 'خطوط بورتسودان البحرية' },
  { id: 'royalnile', name: 'بواخر النيل الملكية' }
];
const INTL_BOAT_ROUTES = [
  { route: 'وادي حلفا ⛴ أسوان (مصر)', subtitle: 'مغادرة الأحد 12:00 - وصول الاثنين 08:00 (نهرية)', price: 55000 },
  { route: 'بورتسودان ⛴ جدة (السعودية)', subtitle: 'مغادرة 18:00 - وصول اليوم التالي 06:00 (12س)', price: 180000 },
  { route: 'بورتسودان ⛴ سواكن', subtitle: 'مغادرة 09:00 - وصول 11:30 (2س 30د)', price: 20000 }
];

/* ---------- بيانات اختيار الدرجة ---------- */
const SELECT_CLASS_DATA = {
  'local-taxi': {
    title: 'تكسي محلي — داخل السودان',
    subtitle: 'اختر الدرجة المناسبة لرحلتك',
    kind: 'taxi',
    classes: [{name:'VIP', price:12000},{name:'مريح', price:8000},{name:'اقتصادي', price:5500}],
    bookTitlePrefix: 'رحلة تكسي محلية — ',
    bookDetails: 'تكسي محلي داخل السودان',
    confirmLabel: 'تأكيد الحجز'
  },
  'local-bus': {
    title: 'باصات محلية — داخل السودان',
    subtitle: 'اختر الدرجة المناسبة لرحلتك',
    kind: 'bus',
    classes: [{name:'ممتاز VIP', price:38000},{name:'عادي', price:28000}],
    bookTitlePrefix: 'رحلة باص محلية — ',
    bookDetails: 'باصات محلية داخل السودان',
    confirmLabel: 'تأكيد الحجز وإصدار التذكرة'
  },
  'local-coach': {
    title: 'حافلات محلية — خدمة ممتازة',
    subtitle: 'اختر الدرجة المناسبة لرحلتك',
    kind: 'bus',
    classes: [{name:'نوم (Sleeper)', price:55000},{name:'ممتاز VIP', price:38000}],
    bookTitlePrefix: 'رحلة حافلة محلية — ',
    bookDetails: 'حافلات ممتازة داخل السودان',
    confirmLabel: 'تأكيد الحجز وإصدار التذكرة'
  },
  'local-flight': {
    title: 'رحلات جوية محلية',
    subtitle: 'اختر الدرجة المناسبة لرحلتك',
    kind: 'flight',
    classes: [{name:'الدرجة الأولى', price:120000},{name:'درجة رجال الأعمال والمستثمرين', price:85000},{name:'الدرجة الثانية', price:60000},{name:'الدرجة العادية', price:45000}],
    bookTitlePrefix: 'رحلة جوية محلية — ',
    bookDetails: 'طيران محلي داخل السودان',
    confirmLabel: 'تأكيد الحجز وإصدار التذكرة'
  },
  'intl-bus': {
    title: 'باصات دولية',
    subtitle: 'اختر الدرجة المناسبة لرحلتك',
    kind: 'bus',
    classes: [{name:'نوم (Sleeper)', price:55000},{name:'ممتاز VIP', price:38000},{name:'عادي', price:28000}],
    bookTitlePrefix: 'رحلة باص دولية — ',
    bookDetails: 'باصات دولية عبر الحدود',
    confirmLabel: 'تأكيد الحجز وإصدار التذكرة'
  },
  'intl-flight': {
    title: 'رحلات جوية دولية',
    subtitle: 'اختر الدرجة المناسبة لرحلتك',
    kind: 'flight',
    classes: [{name:'الدرجة الأولى', price:320000},{name:'درجة رجال الأعمال والمستثمرين', price:210000},{name:'الدرجة الثانية', price:140000},{name:'الدرجة العادية', price:95000}],
    bookTitlePrefix: 'رحلة جوية دولية — ',
    bookDetails: 'طيران دولي',
    confirmLabel: 'تأكيد الحجز وإصدار التذكرة'
  },
  'intl-boat': {
    title: 'بواخر دولية',
    subtitle: 'اختر الدرجة المناسبة لرحلتك',
    kind: 'boat',
    classes: [{name:'كابينة VIP', price:95000},{name:'كابينة عادية', price:70000},{name:'درجة عامة', price:55000}],
    bookTitlePrefix: 'رحلة بحرية دولية — ',
    bookDetails: 'بواخر دولية',
    confirmLabel: 'تأكيد الحجز وإصدار التذكرة'
  }
};

/* ---------- دوال مساعدة ---------- */
function genBookingCode() { return "BTN-" + Math.random().toString(16).slice(2, 12).toUpperCase(); }
function nightsBetween(inDate, outDate) {
  const ms = new Date(outDate) - new Date(inDate);
  return Math.max(1, Math.round(ms / 86400000));
}
function normalizePhone(phone) {
  let p = String(phone).replace(/\D/g, '');
  if (p.startsWith('0')) p = '249' + p.slice(1);
  return p;
}
function footerNote() {
  return `<div class="footer-note">وكالة جامعة البطانة للسفر والسياحة — رحلتك تبدأ من هنا</div>`;
}
function tripRow(t, kindKey) {
  return `<div class="flight-row">
    <div>
      <div class="route">${t.route}</div>
      <div class="subtitle">${t.subtitle}</div>
    </div>
    <div class="price">${t.price.toLocaleString('en-US')} ج.س</div>
    <a class="btn small" href="#/select-class?kind=${kindKey}">اختيار الدرجة</a>
  </div>`;
}

/* ---------- إدارة المصادقة ---------- */
function findUserByEmail(email) {
  email = (email || "").trim().toLowerCase();
  return state.users.find(u => u.email.toLowerCase() === email) || null;
}

function doRegister(fullname, phone, email, password, confirmPassword) {
  fullname = (fullname || "").trim();
  phone = (phone || "").trim();
  email = (email || "").trim().toLowerCase();
  const nameParts = fullname.split(/\s+/).filter(Boolean);
  if (nameParts.length < 3) return { ok: false, error: "name" };
  if (!/^[0-9+\s-]{8,15}$/.test(phone)) return { ok: false, error: "phone" };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "email" };
  if (!password || password.length < 6) return { ok: false, error: "passwordShort" };
  if (password !== confirmPassword) return { ok: false, error: "passwordMatch" };
  if (findUserByEmail(email)) return { ok: false, error: "exists" };
  state.users.push({ fullname, phone, email, password, role: 'user', created_at: new Date().toISOString() });
  state.session = { username: fullname, email, role: 'user' };
  saveState(state);
  return { ok: true };
}

function doLogin(email, password, role) {
  email = (email || "").trim().toLowerCase();
  const user = findUserByEmail(email);
  if (role === 'admin' && email === 'admin@batana.local' && password === 'ChangeMe123!') {
    state.session = { username: 'مدير النظام', email, role: 'admin' };
    saveState(state);
    return true;
  }
  if (user && user.password === password && user.role === role) {
    state.session = { username: user.fullname, email: user.email, role: user.role };
    saveState(state);
    return true;
  }
  return false;
}

function getSession() { return state.session || null; }

function doLogout() {
  state.session = null;
  saveState(state);
  location.hash = '#/login';
}

function addRecoveryRequest(name, phone, email) {
  state.recovery = state.recovery || [];
  state.recovery.push({ name, phone, email, status: 'قيد المراجعة', created_at: new Date().toISOString() });
  saveState(state);
  return true;
}

function approveRecovery(index) {
  const r = (state.recovery || [])[index];
  if (!r) return false;
  r.status = 'مقبول';
  r.tempPassword = 'TEMP-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  saveState(state);
  const text = encodeURIComponent(
    `وكالة جامعة البطانة للسفر والسياحة\nتمت الموافقة على طلب استعادة الحساب.\nكلمة المرور المؤقتة: ${r.tempPassword}`
  );
  window.open(`https://wa.me/${normalizePhone(r.phone)}?text=${text}`, '_blank');
  return true;
}

/* ---------- إدارة الحجوزات ---------- */
function getBookings() { return state.bookings || []; }

function addBooking({ kind, title, details, price, email }) {
  const list = state.bookings || [];
  const code = genBookingCode();
  const session = getSession();
  list.unshift({ 
    code, kind, title, details: details || "", price, 
    status: "قيد المراجعة", 
    email: email || session?.email || 'guest@batana.com',
    created_at: new Date().toISOString() 
  });
  state.bookings = list;
  saveState(state);
  return code;
}

function getBookingByCode(code) {
  return (state.bookings || []).find(b => b.code === code) || null;
}

function updateBookingStatus(code, status) {
  const list = state.bookings || [];
  const b = list.find(x => x.code === code);
  if (!b) return false;
  b.status = status;
  state.bookings = list;
  saveState(state);
  return true;
}

function cancelBookingByCode(code) { return updateBookingStatus(code, 'ملغاة'); }

/* ---------- دوال شريط التنقل ---------- */
function navbarLoggedIn() {
  const s = getSession();
  const username = s ? s.username : '';
  const isAdmin = s?.role === 'admin';
  return `
  <div class="navbar">
    <div class="brand">وكالة جامعة البطانة ✦ <span>للسفر والسياحة</span></div>
    <div class="nav-links">
      <a href="#/home">الرئيسية</a>
      <a href="#/hotels">الفنادق</a>
      <a href="#/my-bookings">حجوزاتي</a>
      ${isAdmin ? `<a href="#/admin" style="color:var(--gold)">👑 المدير</a>` : ''}
      <span style="color:var(--sand)">${username}</span>
      <a href="#" class="btn small danger" onclick="doLogout(); return false;">خروج</a>
      <span class="nav-controls">
        <button type="button" class="theme-btn" onclick="setTheme('light')">☀️</button>
        <button type="button" class="theme-btn" onclick="setTheme('dark')">🌙</button>
      </span>
    </div>
  </div>`;
}

function navbarGuest() {
  return `
  <div class="navbar">
    <div class="brand" id="brandText">وكالة جامعة البطانة ✦ <span id="subBrandText">للسفر والسياحة</span></div>
    <div class="nav-links">
      <a href="#/login" class="btn small" id="loginNavLabel">تسجيل الدخول</a>
      <span class="nav-controls">
        <button type="button" class="lang-btn" onclick="setLang('ar')">🇸🇦 عربي</button>
        <button type="button" class="lang-btn" onclick="setLang('en')">🇬🇧 English</button>
        <button type="button" class="theme-btn" onclick="setTheme('light')">☀️</button>
        <button type="button" class="theme-btn" onclick="setTheme('dark')">🌙</button>
      </span>
    </div>
  </div>`;
}

/* ---------- صفحات المصادقة ---------- */
function renderLogin() {
  return `
  ${navbarGuest()}
  <div class="wrap">
    <div class="form-box card glow-form">
      <h2 class="center" id="titleLogin">تسجيل الدخول</h2>
      <p class="subtitle center" id="welcomeText">وكالة جامعة البطانة للسفر والسياحة</p>
      <div class="flash error" id="flashMsg" style="display:none"></div>
      <form id="loginForm" onsubmit="return handleLogin(event)">
        <label id="labelEmail">البريد الإلكتروني</label>
        <input type="email" name="email" id="emailInput" required>
        <label id="labelPassword">كلمة المرور</label>
        <input type="password" name="password" id="passwordInput" required>
        <label>الدور</label>
        <select name="role">
          <option value="user">مستخدم</option>
          <option value="admin">مدير</option>
        </select>
        <div class="center" style="margin-top:20px">
          <button class="btn" type="submit" style="width:100%" id="btnLogin">تسجيل الدخول</button>
        </div>
      </form>
      <p class="center" style="margin-top:10px">
        <span id="noAccountText">ليس لديك حساب؟</span>
        <a href="#/register" style="color:var(--gold-soft); font-weight:700" id="registerLink">إنشاء حساب جديد</a>
      </p>
      <p class="center" style="margin-top:8px">
        <a href="#/recovery" style="color:var(--muted); font-size:.85rem;">نسيت كلمة المرور؟</a>
      </p>
    </div>
  </div>
  ${footerNote()}`;
}

function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const flash = document.getElementById('flashMsg');
  flash.className = 'flash error';
  const ok = doLogin(form.email.value, form.password.value, form.role.value);
  if (!ok) {
    flash.textContent = TR.errLogin[currentLang];
    flash.style.display = 'block';
    return false;
  }
  const session = getSession();
  if (session?.role === 'admin') location.hash = '#/admin';
  else location.hash = '#/home';
  return false;
}

function renderRegister() {
  return `
  ${navbarGuest()}
  <div class="wrap">
    <div class="form-box card glow-form">
      <h2 class="center" id="titleRegister">إنشاء حساب جديد</h2>
      <p class="subtitle center" id="welcomeText">وكالة جامعة البطانة للسفر والسياحة</p>
      <div class="flash error" id="flashMsg" style="display:none"></div>
      <form id="registerForm" onsubmit="return handleRegister(event)">
        <label id="labelFullname">الاسم الثلاثي</label>
        <input type="text" name="fullname" id="fullnameInput" placeholder="مثال: أحمد محمد علي" required>
        <label id="labelPhone">رقم الهاتف</label>
        <input type="tel" name="phone" id="phoneInput" placeholder="09XXXXXXXX" required>
        <label id="labelEmail">البريد الإلكتروني</label>
        <input type="email" name="email" id="emailInput" required>
        <label id="labelPassword">كلمة المرور</label>
        <input type="password" name="password" id="passwordInput" required>
        <label id="labelConfirmPassword">إعادة كلمة المرور</label>
        <input type="password" name="confirmPassword" id="confirmPasswordInput" required>
        <div class="center" style="margin-top:20px">
          <button class="btn" type="submit" style="width:100%" id="btnRegister">إنشاء الحساب</button>
        </div>
      </form>
      <p class="center" style="margin-top:16px">
        <span id="haveAccountText">لديك حساب بالفعل؟</span>
        <a href="#/login" style="color:var(--gold-soft); font-weight:700" id="loginLink">تسجيل الدخول</a>
      </p>
    </div>
  </div>
  ${footerNote()}`;
}

function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const flash = document.getElementById('flashMsg');
  flash.className = 'flash error';
  const result = doRegister(form.fullname.value, form.phone.value, form.email.value, form.password.value, form.confirmPassword.value);
  if (!result.ok) {
    const messages = {
      name: TR.errName[currentLang], phone: TR.errPhone[currentLang], email: TR.errEmail[currentLang],
      passwordShort: TR.errPasswordShort[currentLang], passwordMatch: TR.errPasswordMatch[currentLang], exists: TR.errExists[currentLang],
    };
    flash.textContent = messages[result.error] || messages.exists;
    flash.style.display = 'block';
    return false;
  }
  location.hash = '#/home';
  return false;
}

function renderRecovery() {
  return `
  ${navbarGuest()}
  <div class="wrap">
    <div class="form-box card glow-form">
      <h2 class="center">طلب استعادة كلمة المرور</h2>
      <p class="subtitle center">سيتم مراجعة الطلب من المدير وإرسال كلمة مرور مؤقتة عبر واتساب</p>
      <div class="flash error" id="flashMsg" style="display:none"></div>
      <form id="recoveryForm" onsubmit="return handleRecovery(event)">
        <label>الاسم الثلاثي</label>
        <input type="text" name="name" required>
        <label>رقم الهاتف</label>
        <input type="tel" name="phone" placeholder="09XXXXXXXX" required>
        <label>البريد الإلكتروني</label>
        <input type="email" name="email" required>
        <div class="center" style="margin-top:20px">
          <button class="btn" type="submit" style="width:100%">إرسال الطلب</button>
        </div>
      </form>
      <p class="center" style="margin-top:16px">
        <a href="#/login" style="color:var(--gold-soft); font-weight:700">العودة لتسجيل الدخول</a>
      </p>
    </div>
  </div>
  ${footerNote()}`;
}

function handleRecovery(e) {
  e.preventDefault();
  const form = e.target;
  const flash = document.getElementById('flashMsg');
  flash.className = 'flash error';
  const result = addRecoveryRequest(form.name.value, form.phone.value, form.email.value);
  if (!result) {
    flash.textContent = 'حدث خطأ، حاول مرة أخرى';
    flash.style.display = 'block';
    return false;
  }
  flash.className = 'flash ok';
  flash.textContent = 'تم إرسال طلب الاستعادة إلى المدير';
  flash.style.display = 'block';
  form.reset();
  return false;
}

/* ---------- صفحات الرحلات ---------- */
function renderHome() {
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <h1>نوع السفر</h1>
    <p class="subtitle">اختر نوع الرحلة - الدولة: <b style="color:var(--gold-soft)">السودان</b></p>
    <div class="grid">
      <a class="airline-card" href="#/local-type"><div class="emoji-big">🗺️</div><h3>محلي</h3><div class="badge">داخل السودان</div></a>
      <a class="airline-card" href="#/intl-type"><div class="emoji-big">🌍</div><h3>دولي</h3><div class="badge">خارج السودان</div></a>
      <a class="airline-card" href="#/hotels"><div class="emoji-big">🏨</div><h3>الفنادق</h3><div class="badge">محلية ودولية</div></a>
    </div>
  </div>
  ${footerNote()}`;
}

function renderLocalType() {
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <a class="btn secondary small" href="#/home">→ رجوع</a>
    <h1 style="margin-top:14px">السفر المحلي</h1>
    <p class="subtitle">داخل السودان - اختر وسيلة السفر</p>
    <div class="grid">
      <a class="airline-card" href="#/local-land"><div class="emoji-big">🚗</div><h3>بري</h3><div class="badge">تكاسي، باصات، حافلات</div></a>
      <a class="airline-card" href="#/local-air"><div class="emoji-big">✈️</div><h3>جوي</h3><div class="badge">شركات الطيران</div></a>
    </div>
  </div>
  ${footerNote()}`;
}

function renderLocalLand() {
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <a class="btn secondary small" href="#/local-type">→ رجوع</a>
    <h1 style="margin-top:14px">🚗 السفر البري المحلي</h1>
    <p class="subtitle">وجهات الرحلات في ولايات السودان</p>
    <div class="tabs">
      <a class="tab active" id="landTabTaxi" onclick="localLandShowTab('taxi')">🚕 تكاسي</a>
      <a class="tab" id="landTabBus" onclick="localLandShowTab('bus')">🚌 باصات</a>
      <a class="tab" id="landTabCoach" onclick="localLandShowTab('coach')">🚍 حافلات</a>
    </div>
    <div class="card" id="landPanelTaxi">${LOCAL_LAND_TRIPS.taxi.map(t => tripRow(t, 'local-taxi')).join('')}</div>
    <div class="card" id="landPanelBus" style="display:none">${LOCAL_LAND_TRIPS.bus.map(t => tripRow(t, 'local-bus')).join('')}</div>
    <div class="card" id="landPanelCoach" style="display:none">${LOCAL_LAND_TRIPS.coach.map(t => tripRow(t, 'local-coach')).join('')}</div>
  </div>
  ${footerNote()}`;
}

function localLandShowTab(tab) {
  document.getElementById('landPanelTaxi').style.display = tab === 'taxi' ? 'block' : 'none';
  document.getElementById('landPanelBus').style.display = tab === 'bus' ? 'block' : 'none';
  document.getElementById('landPanelCoach').style.display = tab === 'coach' ? 'block' : 'none';
  document.getElementById('landTabTaxi').classList.toggle('active', tab === 'taxi');
  document.getElementById('landTabBus').classList.toggle('active', tab === 'bus');
  document.getElementById('landTabCoach').classList.toggle('active', tab === 'coach');
}

function renderLocalAir() {
  const cards = LOCAL_AIRLINES.map(a => `<a class="airline-card" href="#/local-air-flights?airline=${a.id}"><div class="emoji-big">✈️</div><h3>${a.name}</h3><div class="badge">محلي</div></a>`).join('');
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <a class="btn secondary small" href="#/local-type">→ رجوع</a>
    <h1 style="margin-top:14px">✈️ السفر الجوي المحلي</h1>
    <p class="subtitle">اختر شركة الطيران المناسبة</p>
    <div class="grid">${cards}</div>
  </div>
  ${footerNote()}`;
}

function renderLocalAirFlights(airlineId) {
  const airline = LOCAL_AIRLINES.find(a => a.id === airlineId) || LOCAL_AIRLINES[0];
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <a class="btn secondary small" href="#/local-air">→ رجوع</a>
    <h1 style="margin-top:14px">✈️ ${airline.name}</h1>
    <p class="subtitle">وجهات السفر المحلية داخل ولايات السودان</p>
    <div class="card">${LOCAL_FLIGHTS.map(t => tripRow(t, 'local-flight')).join('')}</div>
  </div>
  ${footerNote()}`;
}

function renderIntlType() {
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <a class="btn secondary small" href="#/home">→ رجوع</a>
    <h1 style="margin-top:14px">السفر الدولي</h1>
    <p class="subtitle">خارج السودان - اختر وسيلة السفر</p>
    <div class="grid">
      <a class="airline-card" href="#/intl-land"><div class="emoji-big">🚌</div><h3>بري</h3><div class="badge">شركات الباصات</div></a>
      <a class="airline-card" href="#/intl-air"><div class="emoji-big">✈️</div><h3>جوي</h3><div class="badge">شركات الطيران</div></a>
      <a class="airline-card" href="#/intl-sea"><div class="emoji-big">⛴</div><h3>بحري</h3><div class="badge">شركات البواخر</div></a>
    </div>
  </div>
  ${footerNote()}`;
}

function renderIntlLand() {
  const cards = INTL_BUS_COMPANIES.map(c => `<a class="airline-card" href="#/intl-bus-company?co=${c.id}"><div class="emoji-big">🚌</div><h3>${c.name}</h3><div class="badge">دولي</div></a>`).join('');
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <a class="btn secondary small" href="#/intl-type">→ رجوع</a>
    <h1 style="margin-top:14px">🚌 السفر البري الدولي</h1>
    <p class="subtitle">اختر شركة الباصات</p>
    <div class="grid">${cards}</div>
  </div>
  ${footerNote()}`;
}

function renderIntlBusCompany(coId) {
  const co = INTL_BUS_COMPANIES.find(c => c.id === coId) || INTL_BUS_COMPANIES[0];
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <a class="btn secondary small" href="#/intl-land">→ رجوع</a>
    <h1 style="margin-top:14px">🚌 ${co.name}</h1>
    <p class="subtitle">وجهة الرحلة الدولية وسعرها</p>
    <div class="card">${INTL_BUS_ROUTES.map(t => tripRow(t, 'intl-bus')).join('')}</div>
  </div>
  ${footerNote()}`;
}

function renderIntlAir() {
  const cards = INTL_AIRLINES.map(a => `<a class="airline-card" href="#/intl-air-flights?airline=${a.id}"><div class="emoji-big">✈️</div><h3>${a.name}</h3><div class="badge">دولي</div></a>`).join('');
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <a class="btn secondary small" href="#/intl-type">→ رجوع</a>
    <h1 style="margin-top:14px">✈️ السفر الجوي الدولي</h1>
    <p class="subtitle">اختر شركة الطيران المناسبة</p>
    <div class="grid">${cards}</div>
  </div>
  ${footerNote()}`;
}

function renderIntlAirFlights(airlineId) {
  const airline = INTL_AIRLINES.find(a => a.id === airlineId) || INTL_AIRLINES[0];
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <a class="btn secondary small" href="#/intl-air">→ رجوع</a>
    <h1 style="margin-top:14px">✈️ ${airline.name}</h1>
    <p class="subtitle">وجهات السفر الدولية</p>
    <div class="card">${INTL_FLIGHTS.map(t => tripRow(t, 'intl-flight')).join('')}</div>
  </div>
  ${footerNote()}`;
}

function renderIntlSea() {
  const cards = INTL_BOAT_COMPANIES.map(c => `<a class="airline-card" href="#/intl-boat-company?co=${c.id}"><div class="emoji-big">⛴</div><h3>${c.name}</h3><div class="badge">دولي</div></a>`).join('');
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <a class="btn secondary small" href="#/intl-type">→ رجوع</a>
    <h1 style="margin-top:14px">⛴ السفر البحري الدولي</h1>
    <p class="subtitle">اختر شركة البواخر</p>
    <div class="grid">${cards}</div>
  </div>
  ${footerNote()}`;
}

function renderIntlBoatCompany(coId) {
  const co = INTL_BOAT_COMPANIES.find(c => c.id === coId) || INTL_BOAT_COMPANIES[0];
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <a class="btn secondary small" href="#/intl-sea">→ رجوع</a>
    <h1 style="margin-top:14px">⛴ ${co.name}</h1>
    <p class="subtitle">وجهة الرحلة وسعرها</p>
    <div class="card">${INTL_BOAT_ROUTES.map(t => tripRow(t, 'intl-boat')).join('')}</div>
  </div>
  ${footerNote()}`;
}

/* ---------- صفحات الفنادق ---------- */
function hotelsGrid(scope) {
  const entries = Object.entries(HOTELS).filter(([id, h]) => h.scope === scope);
  return `<div class="grid">` + entries.map(([id, h]) => `
    <a class="hotel-card" href="#/hotel-rooms?hotel=${id}">
      <div class="emoji-big">🏨</div>
      <h3>${h.name}</h3>
      <div class="stars">${starsToText(h.stars)}</div>
      <div class="badge">${h.city}</div>
    </a>
  `).join('') + `</div>`;
}

function renderHotels() {
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <h1>🏨 الفنادق</h1>
    <p class="subtitle">فنادق محلية ودولية</p>
    <div class="tabs">
      <a class="tab active" id="hotelScopeLocal" onclick="hotelsShowScope('local')">محلية</a>
      <a class="tab" id="hotelScopeIntl" onclick="hotelsShowScope('intl')">دولية</a>
    </div>
    <div id="hotelsPanelLocal">${hotelsGrid('local')}</div>
    <div id="hotelsPanelIntl" style="display:none">${hotelsGrid('intl')}</div>
  </div>
  ${footerNote()}`;
}

function hotelsShowScope(scope) {
  document.getElementById('hotelsPanelLocal').style.display = scope === 'local' ? 'block' : 'none';
  document.getElementById('hotelsPanelIntl').style.display = scope === 'intl' ? 'block' : 'none';
  document.getElementById('hotelScopeLocal').classList.toggle('active', scope === 'local');
  document.getElementById('hotelScopeIntl').classList.toggle('active', scope === 'intl');
}

function renderHotelRooms(hotelIdRaw) {
  const hotel = getHotel(hotelIdRaw);
  const actualId = HOTELS[hotelIdRaw] ? hotelIdRaw : DEFAULT_HOTEL_ID;
  const rooms = hotel.rooms.map(r => `
    <div class="card">
      <h3>${r.label}</h3>
      <p class="subtitle">السعة: ${r.capacity}</p>
      <p class="price">${r.price.toLocaleString('en-US')} ج.س / لليلة</p>
      <a class="btn small" href="#/book-room?hotel=${encodeURIComponent(actualId)}&room=${encodeURIComponent(r.type)}">حجز الغرفة</a>
    </div>`).join('');
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <h1>${hotel.name} <span class="stars">${starsToText(hotel.stars)}</span></h1>
    <p class="subtitle">${hotel.stars} نجوم</p>
    <p class="subtitle">${hotel.city}</p>
    <div id="roomsList">${rooms}</div>
  </div>
  ${footerNote()}`;
}

function renderBookRoom(hotelIdRaw, roomTypeRaw) {
  const hotelId = HOTELS[hotelIdRaw] ? hotelIdRaw : DEFAULT_HOTEL_ID;
  const hotel = HOTELS[hotelId];
  const room = hotel.rooms.find(r => r.type === roomTypeRaw) || hotel.rooms[1];
  window.__bookRoomCtx = { hotel, room };
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <div class="form-box card glow-form">
      <h2 class="center">حجز الغرفة</h2>
      <p class="subtitle center">${hotel.name} (${starsToText(hotel.stars)}) — ${room.label} — ${room.price.toLocaleString('en-US')} ج.س / لليلة</p>
      <form onsubmit="return handleBook(event)">
        <label>تاريخ الوصول</label>
        <input type="date" name="checkin" id="checkinDate" required>
        <label>وقت الوصول (تسجيل الدخول)</label>
        <input type="time" name="checkinTime" id="checkinTime" value="14:00" required>
        <label>تاريخ المغادرة</label>
        <input type="date" name="checkout" id="checkoutDate" required>
        <label>وقت المغادرة (تسجيل الخروج)</label>
        <input type="time" name="checkoutTime" id="checkoutTime" value="12:00" required>
        <p class="subtitle" id="totalPreview" style="margin-top:14px"></p>
        <div class="center" style="margin-top:20px">
          <button class="btn" type="submit" style="width:100%">تأكيد حجز الغرفة</button>
        </div>
      </form>
    </div>
  </div>
  ${footerNote()}`;
}

function afterRenderBookRoom() {
  const checkinDateEl = document.getElementById('checkinDate');
  const checkoutDateEl = document.getElementById('checkoutDate');
  const totalPreview = document.getElementById('totalPreview');
  if (!checkinDateEl) return;
  function updatePreview() {
    const { room } = window.__bookRoomCtx;
    if (!checkinDateEl.value || !checkoutDateEl.value) { totalPreview.textContent = ''; return; }
    if (new Date(checkoutDateEl.value) <= new Date(checkinDateEl.value)) {
      totalPreview.textContent = 'تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول';
      return;
    }
    const nights = nightsBetween(checkinDateEl.value, checkoutDateEl.value);
    const total = nights * room.price;
    totalPreview.innerHTML = 'عدد الليالي: <b>' + nights + '</b> — الإجمالي: <span class="price">' + total.toLocaleString('en-US') + ' ج.س</span>';
  }
  checkinDateEl.addEventListener('change', updatePreview);
  checkoutDateEl.addEventListener('change', updatePreview);
}

function handleBook(e) {
  e.preventDefault();
  const form = e.target;
  const { hotel, room } = window.__bookRoomCtx;
  const checkin = form.checkin.value, checkinTime = form.checkinTime.value;
  const checkout = form.checkout.value, checkoutTime = form.checkoutTime.value;
  const btn = form.querySelector('button[type=submit]');
  if (new Date(checkout) <= new Date(checkin)) {
    alert('تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول');
    return false;
  }
  btn.disabled = true;
  btn.textContent = 'جارٍ الحجز...';
  const nights = nightsBetween(checkin, checkout);
  const total = nights * room.price;
  const code = addBooking({
    kind: 'hotel',
    title: hotel.name + ' — ' + room.label,
    details: 'تسجيل الدخول: ' + checkin + ' الساعة ' + checkinTime + ' / تسجيل الخروج: ' + checkout + ' الساعة ' + checkoutTime + ' — ' + nights + ' ليالٍ',
    price: total
  });
  location.hash = '#/booking-detail?code=' + encodeURIComponent(code);
  return false;
}

/* ---------- صفحة اختيار الدرجة ---------- */
let scSelected = { name: '', price: 0 };

function renderSelectClass(kindKeyRaw) {
  const kindKey = SELECT_CLASS_DATA[kindKeyRaw] ? kindKeyRaw : 'local-flight';
  const d = SELECT_CLASS_DATA[kindKey];
  const optsHtml = d.classes.map(c => `
    <div class="class-opt" onclick="scChoose('${c.name.replace(/'/g, "\\'")}', ${c.price})">
      <h3>${c.name}</h3>
      <div class="price">${c.price.toLocaleString('en-US')} ج.س</div>
    </div>`).join('');
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <h1>اختيار الدرجة</h1>
    <div class="card">
      <h3>${d.title}</h3>
      <p class="subtitle">${d.subtitle}</p>
      <div class="class-grid">${optsHtml}</div>
      <div id="confirmBox" style="display:none; margin-top:20px">
        <p class="subtitle">الدرجة المختارة: <b id="chosenClass" style="color:var(--gold-soft)"></b> — <span class="price" id="chosenPrice"></span></p>
        <button class="btn" onclick="scConfirm('${kindKey}')" id="confirmBtn">${d.confirmLabel}</button>
        <div class="flash error" id="bookFlash" style="display:none; margin-top:10px"></div>
      </div>
    </div>
  </div>
  ${footerNote()}`;
}

function scChoose(name, price) {
  scSelected = { name, price };
  document.getElementById('chosenClass').textContent = name;
  document.getElementById('chosenPrice').textContent = price.toLocaleString('en-US') + ' ج.س';
  document.getElementById('confirmBox').style.display = 'block';
}

function scConfirm(kindKey) {
  const d = SELECT_CLASS_DATA[kindKey];
  const btn = document.getElementById('confirmBtn');
  btn.disabled = true;
  btn.textContent = 'جارٍ الحجز...';
  const code = addBooking({
    kind: d.kind,
    title: d.bookTitlePrefix + scSelected.name,
    details: d.bookDetails,
    price: scSelected.price
  });
  location.hash = '#/booking-detail?code=' + encodeURIComponent(code);
}

/* ---------- صفحات الحجوزات ---------- */
function renderMyBookings() {
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <h1>حجوزاتي</h1>
    <div class="card" id="bookingsCard"><p>جارٍ التحميل...</p></div>
  </div>
  ${footerNote()}`;
}

function refreshMyBookingsList() {
  const bookingsCard = document.getElementById('bookingsCard');
  if (!bookingsCard) return;
  const list = getBookings();
  const session = getSession();
  const mine = list.filter(b => b.email === session?.email);
  if (mine.length === 0) { bookingsCard.innerHTML = '<p>لا توجد حجوزات حتى الآن.</p>'; return; }
  bookingsCard.innerHTML = mine.map(b => `
    <div class="flight-row">
      <div>
        <div class="route">${b.title}</div>
        <div class="subtitle">${b.code} — ${b.details || ''}
          <span class="badge ${b.status === 'ملغاة' ? 'cancel' : b.status === 'مقبول' ? 'ok' : 'pending'}">${b.status}</span>
        </div>
      </div>
      <div class="price">${b.price.toLocaleString('en-US')} ج.س</div>
      <a class="btn small secondary" href="#/booking-detail?code=${encodeURIComponent(b.code)}">التفاصيل</a>
      ${b.status !== 'ملغاة' ? `<button class="btn small danger" onclick="cancelBooking('${b.code}')">إلغاء</button>` : ''}
    </div>
  `).join('');
}

function cancelBooking(code) {
  if (!confirm('هل أنت متأكد من الإلغاء؟')) return;
  cancelBookingByCode(code);
  refreshMyBookingsList();
}

function renderBookingDetail(code) {
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <h1>تفاصيل الحجز — <span id="bkCode">...</span> <span class="badge ok" id="bkStatus"></span></h1>
    <div class="card" id="bkCard"><p>جارٍ التحميل...</p></div>
  </div>
  ${footerNote()}`;
}

function refreshBookingDetail(code) {
  const card = document.getElementById('bkCard');
  if (!card) return;
  if (!code) { card.innerHTML = '<p>لا يوجد رقم حجز محدد. <a href="#/my-bookings">اذهب إلى حجوزاتي</a></p>'; return; }
  const b = getBookingByCode(code);
  if (!b) { card.innerHTML = '<p>الحجز غير موجود</p>'; return; }
  document.getElementById('bkCode').textContent = b.code;
  const statusBadge = document.getElementById('bkStatus');
  statusBadge.textContent = b.status;
  statusBadge.className = 'badge ' + (b.status === 'ملغاة' ? 'cancel' : b.status === 'مقبول' ? 'ok' : 'pending');

  const kindLabels = {
    flight: 'تفاصيل الرحلة', taxi: 'تفاصيل رحلة التكسي', bus: 'تفاصيل رحلة الباص',
    boat: 'تفاصيل رحلة الباخرة', hotel: 'حجز الفندق'
  };
  card.innerHTML = `
    <h3>${kindLabels[b.kind] || 'تفاصيل الحجز'}</h3>
    <p>${b.title}<br>${b.details || ''}<br>
    السعر: <span class="price">${b.price.toLocaleString('en-US')} ج.س</span></p>
    <a class="btn" href="#" onclick="alert('في النسخة الحقيقية سيتم تحميل ملف PDF للتذكرة'); return false;">تحميل التذكرة PDF</a>
    <a class="btn secondary" href="#/my-bookings">حجوزاتي</a>
    ${b.status !== 'ملغاة' && b.status !== 'مقبول' ? `<button class="btn danger" onclick="cancelBookingDetail('${b.code}')">إلغاء الحجز</button>` : ''}
  `;
}

function cancelBookingDetail(code) {
  if (!confirm('هل أنت متأكد من الإلغاء؟')) return;
  cancelBookingByCode(code);
  refreshBookingDetail(code);
}

/* ---------- لوحة المدير ---------- */
function renderAdmin() {
  const session = getSession();
  if (session?.role !== 'admin') {
    return `
    ${navbarLoggedIn()}
    <div class="wrap">
      <div class="card"><h2>وصول ممنوع</h2><p>هذه الصفحة مخصصة للمدير فقط.</p><a href="#/home" class="btn">الرجوع للرئيسية</a></div>
    </div>
    ${footerNote()}`;
  }
  const users = state.users || [];
  const bookings = state.bookings || [];
  const recovery = state.recovery || [];
  return `
  ${navbarLoggedIn()}
  <div class="wrap">
    <h1>👑 لوحة المدير</h1>
    <div class="grid">
      <div class="card"><h3>الزوار</h3><div class="stat">${state.visits || 0}</div></div>
      <div class="card"><h3>المستخدمون</h3><div class="stat">${users.length}</div></div>
      <div class="card"><h3>الحجوزات</h3><div class="stat">${bookings.length}</div></div>
      <div class="card"><h3>طلبات الاستعادة</h3><div class="stat">${recovery.length}</div></div>
    </div>
    <div class="card">
      <h2>📋 الحجوزات</h2>
      ${bookings.length ? `
      <table>
        <tr><th>الرمز</th><th>المستخدم</th><th>الخدمة</th><th>السعر</th><th>الحالة</th><th>إجراء</th></tr>
        ${bookings.map((b) => `
          <tr>
            <td>${b.code}</td>
            <td>${b.email}</td>
            <td>${b.title}</td>
            <td>${b.price.toLocaleString('en-US')} ج.س</td>
            <td><span class="badge ${b.status === 'ملغاة' ? 'cancel' : b.status === 'مقبول' ? 'ok' : 'pending'}">${b.status}</span></td>
            <td>
              ${b.status === 'قيد المراجعة' ? `
                <button class="btn small success" onclick="adminApproveBooking('${b.code}')">موافقة</button>
                <button class="btn small danger" onclick="adminRejectBooking('${b.code}')">رفض</button>
              ` : ''}
            </td>
          </tr>
        `).join('')}
      </table>` : '<p>لا توجد حجوزات.</p>'}
    </div>
    <div class="card">
      <h2>🔑 طلبات استعادة كلمة المرور</h2>
      ${recovery.length ? `
      <table>
        <tr><th>الاسم</th><th>الهاتف</th><th>البريد</th><th>الحالة</th><th>إجراء</th></tr>
        ${recovery.map((r, i) => `
          <tr>
            <td>${r.name}</td>
            <td>${r.phone}</td>
            <td>${r.email}</td>
            <td><span class="badge ${r.status === 'مقبول' ? 'ok' : 'pending'}">${r.status}</span></td>
            <td>
              ${r.status === 'قيد المراجعة' ? `
                <button class="btn small success" onclick="adminApproveRecovery(${i})">موافقة وإرسال</button>
              ` : r.status === 'مقبول' ? '✅ تم' : ''}
            </td>
          </tr>
        `).join('')}
      </table>` : '<p>لا توجد طلبات.</p>'}
    </div>
    <div class="card">
      <h2>👤 المستخدمون</h2>
      ${users.length ? `
      <table>
        <tr><th>الاسم</th><th>الهاتف</th><th>البريد</th><th>الدور</th></tr>
        ${users.map(u => `
          <tr><td>${u.fullname}</td><td>${u.phone}</td><td>${u.email}</td><td>${u.role}</td></tr>
        `).join('')}
      </table>` : '<p>لا يوجد مستخدمون.</p>'}
    </div>
  </div>
  ${footerNote()}`;
}

function adminApproveBooking(code) {
  if (!confirm('تأكيد الموافقة على هذا الحجز؟')) return;
  updateBookingStatus(code, 'مقبول');
  router();
}

function adminRejectBooking(code) {
  if (!confirm('تأكيد رفض هذا الحجز؟')) return;
  updateBookingStatus(code, 'مرفوض');
  router();
}

function adminApproveRecovery(index) {
  approveRecovery(index);
  router();
}

/* ---------- التوجيه (Router) ---------- */
const PROTECTED_PATHS = ['/home', '/local-type','/local-land','/local-air','/local-air-flights',
  '/intl-type','/intl-land','/intl-bus-company','/intl-air','/intl-air-flights','/intl-sea','/intl-boat-company',
  '/hotels','/select-class','/my-bookings','/booking-detail','/hotel-rooms','/book-room','/admin'];

function parseRoute() {
  const raw = location.hash.slice(1) || '/login';
  const [path, queryString] = raw.split('?');
  return { path, params: new URLSearchParams(queryString || '') };
}

function router() {
  const { path, params } = parseRoute();
  const app = document.getElementById('app');

  if (PROTECTED_PATHS.includes(path) && !getSession()) {
    location.hash = '#/login';
    return;
  }

  switch (path) {
    case '/login': app.innerHTML = renderLogin(); break;
    case '/register': app.innerHTML = renderRegister(); break;
    case '/recovery': app.innerHTML = renderRecovery(); break;
    case '/home': app.innerHTML = renderHome(); break;
    case '/local-type': app.innerHTML = renderLocalType(); break;
    case '/local-land': app.innerHTML = renderLocalLand(); break;
    case '/local-air': app.innerHTML = renderLocalAir(); break;
    case '/local-air-flights': app.innerHTML = renderLocalAirFlights(params.get('airline')); break;
    case '/intl-type': app.innerHTML = renderIntlType(); break;
    case '/intl-land': app.innerHTML = renderIntlLand(); break;
    case '/intl-bus-company': app.innerHTML = renderIntlBusCompany(params.get('co')); break;
    case '/intl-air': app.innerHTML = renderIntlAir(); break;
    case '/intl-air-flights': app.innerHTML = renderIntlAirFlights(params.get('airline')); break;
    case '/intl-sea': app.innerHTML = renderIntlSea(); break;
    case '/intl-boat-company': app.innerHTML = renderIntlBoatCompany(params.get('co')); break;
    case '/hotels': app.innerHTML = renderHotels(); break;
    case '/select-class': app.innerHTML = renderSelectClass(params.get('kind')); break;
    case '/my-bookings': app.innerHTML = renderMyBookings(); refreshMyBookingsList(); break;
    case '/booking-detail': app.innerHTML = renderBookingDetail(params.get('code')); refreshBookingDetail(params.get('code')); break;
    case '/hotel-rooms': app.innerHTML = renderHotelRooms(params.get('hotel') || DEFAULT_HOTEL_ID); break;
    case '/book-room': app.innerHTML = renderBookRoom(params.get('hotel') || DEFAULT_HOTEL_ID, params.get('room')); afterRenderBookRoom(); break;
    case '/admin': app.innerHTML = renderAdmin(); break;
    default: location.hash = '#/login'; return;
  }
  window.scrollTo(0, 0);
}

/* ---------- جعل الدوال متاحة في النطاق العمومي ---------- */
window.setTheme = setTheme;
window.setLang = setLang;
window.doLogout = doLogout;
window.scChoose = scChoose;
window.scConfirm = scConfirm;
window.localLandShowTab = localLandShowTab;
window.hotelsShowScope = hotelsShowScope;
window.cancelBooking = cancelBooking;
window.cancelBookingDetail = cancelBookingDetail;
window.adminApproveBooking = adminApproveBooking;
window.adminRejectBooking = adminRejectBooking;
window.adminApproveRecovery = adminApproveRecovery;
window.handleBook = handleBook;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleRecovery = handleRecovery;

/* ---------- تشغيل التطبيق ---------- */
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
