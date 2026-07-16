/* وكالة الدواحي — بيانات الفنادق والغرف (فنادق من 7 نجوم إلى 3 نجوم) */

const HOTELS = {
  royal7: {
    name: "برج الدواحي الملكي",
    stars: 7,
    city: "الخرطوم - السودان",
    rooms: [
      { type: "single", label: "غرفة مفردة ملكية",  capacity: "شخص واحد", price: 150000 },
      { type: "double", label: "غرفة مزدوجة ملكية", capacity: "شخصان",    price: 220000 },
      { type: "family", label: "جناح عائلي ملكي",   capacity: "4 أشخاص",  price: 380000 }
    ]
  },
  diamond6: {
    name: "فندق الواحة الماسية",
    stars: 6,
    city: "الخرطوم - السودان",
    rooms: [
      { type: "single", label: "غرفة مفردة ديلوكس",  capacity: "شخص واحد", price: 110000 },
      { type: "double", label: "غرفة مزدوجة ديلوكس", capacity: "شخصان",    price: 170000 },
      { type: "family", label: "جناح عائلي ديلوكس",  capacity: "4 أشخاص",  price: 290000 }
    ]
  },
  palm5: {
    name: "فندق النخيل الذهبي",
    stars: 5,
    city: "الخرطوم - السودان",
    rooms: [
      { type: "single", label: "غرفة مفردة",  capacity: "شخص واحد", price: 35000 },
      { type: "double", label: "غرفة مزدوجة", capacity: "شخصان",    price: 55000 },
      { type: "family", label: "جناح عائلي",  capacity: "4 أشخاص",  price: 95000 }
    ]
  },
  ufuq4: {
    name: "فندق الأفق",
    stars: 4,
    city: "الخرطوم - السودان",
    rooms: [
      { type: "single", label: "غرفة مفردة",  capacity: "شخص واحد", price: 25000 },
      { type: "double", label: "غرفة مزدوجة", capacity: "شخصان",    price: 40000 },
      { type: "family", label: "جناح عائلي",  capacity: "4 أشخاص",  price: 70000 }
    ]
  },
  musafir3: {
    name: "فندق المسافر",
    stars: 3,
    city: "بورتسودان - السودان",
    rooms: [
      { type: "single", label: "غرفة مفردة",  capacity: "شخص واحد", price: 15000 },
      { type: "double", label: "غرفة مزدوجة", capacity: "شخصان",    price: 25000 },
      { type: "family", label: "جناح عائلي",  capacity: "4 أشخاص",  price: 45000 }
    ]
  }
};

const DEFAULT_HOTEL_ID = "palm5";

function starsToText(n) {
  return "★".repeat(n);
}

function getHotel(id) {
  return HOTELS[id] || HOTELS[DEFAULT_HOTEL_ID];
}
