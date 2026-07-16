/* وكالة الدواحي — تخزين الحجوزات محلياً (بدون سيرفر) باستخدام localStorage */

const BOOKINGS_KEY = "dawahi_bookings";

function genBookingCode() {
  return "DWH-" + Math.random().toString(16).slice(2, 12).toUpperCase();
}

function getBookings() {
  const raw = localStorage.getItem(BOOKINGS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveBookings(list) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
}

function addBooking({ kind, title, details, price }) {
  const list = getBookings();
  const code = genBookingCode();
  list.unshift({
    code,
    kind,
    title,
    details: details || "",
    price,
    status: "مؤكدة",
    created_at: new Date().toISOString()
  });
  saveBookings(list);
  return code;
}

function getBookingByCode(code) {
  return getBookings().find(b => b.code === code) || null;
}

function cancelBookingByCode(code) {
  const list = getBookings();
  const b = list.find(x => x.code === code);
  if (!b) return false;
  b.status = "ملغاة";
  saveBookings(list);
  return true;
}
