/* وكالة الدواحي — نظام دخول محلي (بدون سيرفر)
   حساب افتراضي واحد فقط، مخزَّن هنا. لا يوجد إنشاء حسابات جديدة. */

const DEFAULT_ACCOUNT = {
  email: "guest@dawahi.com",
  password: "dawahi123",
  username: "ضيف الدواحي"
};

const SESSION_KEY = "dawahi_session";

function doLogin(email, password) {
  email = (email || "").trim().toLowerCase();
  if (email === DEFAULT_ACCOUNT.email && password === DEFAULT_ACCOUNT.password) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      username: DEFAULT_ACCOUNT.username,
      email: DEFAULT_ACCOUNT.email
    }));
    return true;
  }
  return false;
}

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

// يوضع في بداية كل صفحة محمية: يحوّل لصفحة الدخول لو مفيش جلسة، ويملأ اسم المستخدم بالنافبار
function requireLogin() {
  const s = getSession();
  if (!s) {
    window.location.href = "login.html";
    return null;
  }
  const el = document.getElementById("navUsername");
  if (el) el.textContent = s.username;
  return s;
}

function doLogout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "login.html";
}
