import { useState, useEffect } from "react";
import {
  ScrollText, BookOpen, Gift, Home, Shirt, Wine, Flame,
  Crown, ShoppingBag, Phone, MessageCircle, MapPin, Clock, ShieldCheck,
  BadgeCheck, Star, Plus, Minus, X, Send, Sparkles, Award, LayoutDashboard,
  Palette, Package, ListOrdered, Settings, TrendingUp, AlertTriangle, Wand2,
  ChevronLeft, ChevronRight, Sliders, Bell, ShieldAlert, Trash2, ImagePlus, LogIn,
} from "lucide-react";

/* Luxury Clean 2.5D palette: pearl / cream marble, navy sapphire, brushed gold */
const THEMES = {
  pearl: { key: "pearl", navy: "#0E2A52", deep: "#0A1C38", gold: "#B8894A", goldL: "#E7C98A", copper: "#B5651D", ivory: "#F7F3EA", card: "#FFFFFF", label: "פנינה וזהב מוברש" },
  sapphire: { key: "sapphire", navy: "#0B1F4B", deep: "#06122E", gold: "#C9A24B", goldL: "#F0D98C", copper: "#A9601E", ivory: "#FBF8F1", card: "#FFFFFF", label: "כחול ספיר עמוק" },
  cream: { key: "cream", navy: "#3B2A1E", deep: "#26190F", gold: "#B08D57", goldL: "#E3C89A", copper: "#8C5A2B", ivory: "#FAF6EE", card: "#FFFDF8", label: "שמנת ונחושת" },
};
function tokens(C) {
  return {
    goldText: { backgroundImage: `linear-gradient(120deg,${C.gold},${C.goldL} 50%,${C.gold})`, WebkitBackgroundClip: "text", color: "transparent" },
    goldBg: { backgroundImage: `linear-gradient(135deg,${C.goldL},${C.gold} 55%,${C.copper})` },
    marble: { backgroundImage: `radial-gradient(circle at 12% 15%,${C.gold}14,transparent 42%),radial-gradient(circle at 88% 75%,${C.navy}0c,transparent 48%),repeating-linear-gradient(115deg,transparent 0 60px,${C.gold}06 60px 61px),linear-gradient(170deg,#ffffff,${C.ivory} 55%,#ffffff)` },
  };
}

/* --- Exact category set requested, matching the brand's own navigation --- */
const CATS = [
  { id: "shabbat", name: "שבת", icon: Flame, flagship: "פמוטי כסף לשבת" },
  { id: "events", name: "אירועים ושמחות", icon: Gift, flagship: "ערכת קידוש לחתן" },
  { id: "books", name: "ספרים", sub: "ארון הספרים היהודי", icon: BookOpen, flagship: "סידור בכריכת עור" },
  { id: "tallit", name: "טליתות", icon: Shirt, flagship: "טלית צמר מהודרת" },
  { id: "tallit_tzitzit", name: "טליתות וציציות", icon: ScrollText, flagship: "ציצית עם תפילין" },
  { id: "home", name: "עיצוב הבית", icon: Home, flagship: "בית מזוזה מעוצב" },
];

/* Each product carries an image array (front / side / close-up) described as styled
   panels — real photography is not available here, so each slot is a labeled visual
   placeholder that keeps the exact position a real photo would occupy. */
const SEED_PRODUCTS = [
  { id: 1, cat: "shabbat", name: "פמוטי כסף לשבת", note: "זוג, גימור זהב מוברש", price: 520, images: [{ tag: "חזית", icon: Flame }, { tag: "זווית צד", icon: Flame }, { tag: "תקריב חריטה", icon: Sparkles }] },
  { id: 2, cat: "shabbat", name: "גביע קידוש מכסף", note: "חריטה אישית לבחירה", price: 680, images: [{ tag: "חזית", icon: Wine }, { tag: "זווית צד", icon: Wine }, { tag: "תקריב חריטה", icon: Sparkles }] },
  { id: 3, cat: "shabbat", name: "כיסוי חלה רקום", note: "רקמת יד, פסוקי שבת", price: 210, images: [{ tag: "חזית", icon: Gift }, { tag: "זווית צד", icon: Gift }, { tag: "תקריב רקמה", icon: Sparkles }] },
  { id: 4, cat: "events", name: "חבילת בר-מצוה מלאה", note: "תפילין, טלית, נרתיק עור עם חריטת שם וסידור", price: 3200, images: [{ tag: "חזית", icon: Gift }, { tag: "זווית צד", icon: Gift }, { tag: "תקריב חריטה", icon: Sparkles }] },
  { id: 5, cat: "events", name: "ערכת קידוש לחתן", note: "גביע, כיסוי טלית וסידור", price: 780, images: [{ tag: "חזית", icon: Wine }, { tag: "זווית צד", icon: Wine }, { tag: "תקריב עיטור", icon: Sparkles }] },
  { id: 6, cat: "events", name: "כוס שבירה מעוצבת", note: "כולל שקית קטיפה", price: 160, images: [{ tag: "חזית", icon: Wine }, { tag: "זווית צד", icon: Wine }, { tag: "תקריב", icon: Sparkles }] },
  { id: 7, cat: "books", name: "סידור בכריכת עור", note: "עיטורי זהב, נוסח לבחירה", price: 390, images: [{ tag: "חזית", icon: BookOpen }, { tag: "זווית צד", icon: BookOpen }, { tag: "תקריב עור וזהב", icon: Sparkles }] },
  { id: 8, cat: "books", name: "חומש בכריכת עור", note: "הוצאה יוקרתית", price: 420, images: [{ tag: "חזית", icon: BookOpen }, { tag: "זווית צד", icon: BookOpen }, { tag: "תקריב כריכה", icon: Sparkles }] },
  { id: 9, cat: "books", name: "מעיל לספר תורה", note: "רקמת יד, חוט זהב", price: 1200, images: [{ tag: "חזית", icon: BookOpen }, { tag: "זווית צד", icon: BookOpen }, { tag: "תקריב רקמה", icon: Sparkles }] },
  { id: 10, cat: "tallit", name: "טלית צמר מהודרת", note: "עם עטרה רקומה", price: 450, images: [{ tag: "חזית", icon: Shirt }, { tag: "זווית צד", icon: Shirt }, { tag: "תקריב עטרה", icon: Sparkles }] },
  { id: 11, cat: "tallit", name: "טלית משי מהודרת", note: "ללובן חתן, גימור זהב", price: 690, images: [{ tag: "חזית", icon: Shirt }, { tag: "זווית צד", icon: Shirt }, { tag: "תקריב אריגה", icon: Sparkles }] },
  { id: 12, cat: "tallit_tzitzit", name: "תפילין רש\"י ורבנו תם", note: "קלף משוח, כתיבה תמה, בדיקת מחשב כלולה", price: 2400, images: [{ tag: "חזית", icon: ScrollText }, { tag: "זווית צד", icon: ScrollText }, { tag: "תקריב כתב", icon: Sparkles }] },
  { id: 13, cat: "tallit_tzitzit", name: "ציצית עם תפילין", note: "צמר לבן, כשרות מהודרת", price: 90, images: [{ tag: "חזית", icon: ScrollText }, { tag: "זווית צד", icon: ScrollText }, { tag: "תקריב חוטים", icon: Sparkles }] },
  { id: 14, cat: "tallit_tzitzit", name: "טלית קטן מבד איכותי", note: "מידות לילד ולמבוגר", price: 70, images: [{ tag: "חזית", icon: ScrollText }, { tag: "זווית צד", icon: ScrollText }, { tag: "תקריב אריגה", icon: Sparkles }] },
  { id: 15, cat: "home", name: "בית מזוזה מעוצב", note: "אבן ירושלמית, פרזול זהב", price: 180, images: [{ tag: "חזית", icon: Home }, { tag: "זווית צד", icon: Home }, { tag: "תקריב פרזול", icon: Sparkles }] },
  { id: 16, cat: "home", name: "מזוזה מהודרת 15 ס\"מ", note: "כתב אר\"י, סופר סת\"ם מוסמך", price: 260, images: [{ tag: "חזית", icon: Home }, { tag: "זווית צד", icon: Home }, { tag: "תקריב כתב", icon: Sparkles }] },
  { id: 17, cat: "home", name: "חנוכיית כסף", note: "עיצוב קלאסי, כולל שמן זך", price: 720, images: [{ tag: "חזית", icon: Flame }, { tag: "זווית צד", icon: Flame }, { tag: "תקריב", icon: Sparkles }] },
];
const REVIEWS = [
  { n: "יוסי כהן", w: "טבריה", t: "שירות אישי, הסבירו לנו כל הבדל בין סוגי התפילין. יצאנו בטוחים בבחירה." },
  { n: "משפחת לוי", w: "חיפה", t: "הזמנו חבילת בר-מצוה והכל הגיע מסודר, מהודר וכמו שביקשנו." },
  { n: "הרב דוד א.", w: "צפת", t: "בדיקת המחשב והאחריות נתנו לנו שקט. ממליץ." },
];
const SALES = [
  { m: "תשרי (חגים)", v: 42 }, { m: "חשוון", v: 18 }, { m: "כסלו (חנוכה)", v: 30 },
  { m: "אדר", v: 22 }, { m: "ניסן (פסח)", v: 38 }, { m: "עונת בר-מצוה", v: 55 },
];
const SEED_ORDERS = [
  { id: "1042", name: "אבי גולן", item: "תפילין רש\"י ורבנו תם", status: "נקלטה" },
  { id: "1041", name: "משפחת פרץ", item: "חבילת בר-מצוה מלאה", status: "בבדיקת סופר" },
  { id: "1040", name: "נועה שם-טוב", item: "מזוזה בכתב אר\"י", status: "באריזה" },
  { id: "1039", name: "יעקב מזרחי", item: "גביע קידוש", status: "יצא למשלוח" },
  { id: "1038", name: "דנה אשכנזי", item: "טלית צמר מהודרת", status: "סופק" },
];
const ORDER_STAGES = ["נקלטה", "בבדיקת סופר", "באריזה", "יצא למשלוח", "סופק"];

/* ---------------- Elegant CSS-only 2.5D hero: a rotating gilded siddur ---------------- */
function HeroSiddur({ C, goldBg, depth = 40, glow = true }) {
  const [angle, setAngle] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    let raf;
    const spin = () => { setAngle((a) => (a + 0.06) % 360); raf = requestAnimationFrame(spin); };
    raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(raf);
  }, []);
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };
  const rot = -18 + angle * (depth / 60) + tilt.x * 30;
  return (
    <div onMouseMove={move} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative mx-auto h-[420px] w-full max-w-[440px]" style={{ perspective: 1400 }}>
      {glow && <div className="absolute inset-0 rounded-full blur-3xl" style={{ background: `radial-gradient(circle,${C.gold}30,transparent 65%)` }} />}
      <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: `radial-gradient(ellipse 70% 30% at 50% 78%,rgba(14,42,82,.16),transparent 70%)` }} />
      <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d", transition: "transform .12s ease-out",
        transform: `rotateX(${14 - tilt.y * 10}deg) rotateY(${rot}deg)` }}>
        {/* Right cover */}
        <div className="absolute h-[230px] w-[150px] rounded-r-2xl rounded-l-sm" style={{ transform: "translateX(4px) rotateY(18deg) translateZ(2px)", background: `linear-gradient(135deg,${C.navy},${C.deep})`, border: `2px solid ${C.gold}`, boxShadow: `0 25px 60px rgba(14,42,82,.35)` }}>
          <div className="absolute inset-3 rounded-lg" style={{ border: `1px solid ${C.goldL}77` }} />
          <div className="absolute left-1/2 top-1/2 -ml-6 -mt-6 flex h-12 w-12 items-center justify-center rounded-full" style={goldBg}><Sparkles size={20} color={C.deep} /></div>
        </div>
        {/* Left cover */}
        <div className="absolute h-[230px] w-[150px] rounded-l-2xl rounded-r-sm" style={{ transform: "translateX(-4px) rotateY(-18deg) translateZ(2px)", background: `linear-gradient(225deg,${C.navy},${C.deep})`, border: `2px solid ${C.gold}`, boxShadow: `0 25px 60px rgba(14,42,82,.35)` }}>
          <div className="absolute inset-3 rounded-lg" style={{ border: `1px solid ${C.goldL}77` }} />
        </div>
        {/* Spine + gilded page edges */}
        <div className="absolute h-[224px] w-3 rounded" style={{ background: `linear-gradient(180deg,${C.goldL},${C.gold})`, boxShadow: glow ? `0 0 24px ${C.gold}aa` : "none" }} />
        <div className="absolute h-[210px] w-1 translate-x-10" style={{ background: C.goldL, opacity: 0.8 }} />
        <div className="absolute h-[210px] w-1 -translate-x-10" style={{ background: C.goldL, opacity: 0.8 }} />
      </div>
    </div>
  );
}

function Tilt({ children, className = "", depth = 12 }) {
  const [s, setS] = useState({});
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    setS({ transform: `perspective(800px) rotateY(${x * depth}deg) rotateX(${-y * depth}deg) translateZ(8px)` });
  };
  return (
    <div onMouseMove={move} onMouseLeave={() => setS({})} style={{ ...s, transition: "transform .2s ease-out" }} className={className}>
      {children}
    </div>
  );
}

function Card({ C, className = "", style = {}, children }) {
  return (
    <div className={className} style={{ background: C.card, border: `1px solid ${C.gold}2a`, boxShadow: "0 2px 6px rgba(14,42,82,.05),0 14px 28px rgba(14,42,82,.08),0 32px 55px rgba(14,42,82,.06)", ...style }}>
      {children}
    </div>
  );
}

/* Small panel standing in for a real product photo, keeping the exact slot
   (front / side / close-up) a real photo would occupy. */
function ImageSlot({ C, goldBg, tag, icon: I, big = false }) {
  return (
    <div className={`flex ${big ? "h-72" : "h-20"} flex-col items-center justify-center gap-1 rounded-xl`} style={{ background: `linear-gradient(135deg,${C.navy},${C.deep})` }}>
      <span className={`flex ${big ? "h-16 w-16" : "h-9 w-9"} items-center justify-center rounded-full`} style={goldBg}><I size={big ? 30 : 16} color={C.deep} /></span>
      <span className={`${big ? "text-sm" : "text-[10px]"} font-bold text-white/80`}>{tag}</span>
    </div>
  );
}

function ProductModal({ C, goldBg, product, onClose, onAdd }) {
  const [imgIdx, setImgIdx] = useState(0);
  if (!product) return null;
  const imgs = product.images || [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-label={product.name}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl p-6" style={{ background: C.card }}>
        <button onClick={onClose} aria-label="סגירה" className="absolute left-4 top-4 rounded-full border p-1" style={{ borderColor: "#ddd" }}><X size={18} /></button>
        <ImageSlot C={C} goldBg={goldBg} tag={imgs[imgIdx]?.tag} icon={imgs[imgIdx]?.icon || Sparkles} big />
        <div className="mt-3 flex gap-2">
          {imgs.map((im, i) => (
            <button key={i} onClick={() => setImgIdx(i)} aria-label={im.tag} className="flex-1 rounded-lg border p-1" style={{ borderColor: i === imgIdx ? C.gold : "#eee" }}>
              <ImageSlot C={C} goldBg={goldBg} tag={im.tag} icon={im.icon} />
            </button>
          ))}
        </div>
        <h3 className="serif mt-5 text-2xl font-bold" style={{ color: C.navy }}>{product.name}</h3>
        <p className="mt-1 text-slate-600">{product.note}</p>
        <div className="mt-5 flex items-center justify-between">
          <b className="text-xl" style={{ color: C.copper }}>₪{product.price.toLocaleString()}</b>
          <button onClick={() => { onAdd(product.id); onClose(); }} className="rounded-full px-6 py-2 font-bold text-white" style={goldBg}>הוספה לסל</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Storefront ---------------- */
function Storefront({ C, goldText, goldBg, marble, depth, glow, heroTitle, heroSubtitle, announcement, products }) {
  const [cat, setCat] = useState("shabbat");
  const [cart, setCart] = useState({});
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [viewing, setViewing] = useState(null);

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = products.reduce((s, p) => s + (cart[p.id] || 0) * p.price, 0);
  const add = (id, d = 1) => setCart((c) => { const n = Math.max(0, (c[id] || 0) + d); const r = { ...c, [id]: n }; if (!n) delete r[id]; return r; });
  const shown = products.filter((p) => p.cat === cat);

  return (
    <div dir="rtl" className="min-h-screen text-slate-800" style={{ background: C.ivory, fontFamily: "'Heebo',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@500;700;900&family=Heebo:wght@400;500;700&display=swap');
        .serif{font-family:'Frank Ruhl Libre',serif} html{scroll-behavior:smooth}
        @keyframes glow{0%,100%{opacity:.55}50%{opacity:1}} .glow{animation:glow 4s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){.glow{animation:none}html{scroll-behavior:auto}}`}</style>

      {announcement && <div className="py-2 text-center text-sm font-bold text-white" style={{ background: C.navy }}>{announcement}</div>}

      <header className="sticky top-0 z-30 border-b backdrop-blur" style={{ background: "#FFFFFFEE", borderColor: `${C.gold}33` }}>
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <a href="#home" className="flex items-center gap-3">
              <span className="glow flex h-12 w-12 items-center justify-center rounded-full text-white" style={goldBg}><Crown size={24} /></span>
              <span className="serif leading-tight" style={{ color: C.navy }}><b className="block text-lg">עידן - תשמישי קדושה</b><span className="text-xs" style={{ color: C.copper }}>טבריה · רחוב הגליל</span></span>
            </a>
            <div className="flex items-center gap-2">
              <a href="tel:0000000000" aria-label="חיוג" className="rounded-full p-2 hover:bg-black/5" style={{ color: C.navy }}><Phone size={20} /></a>
              <a href="https://wa.me/972000000000" aria-label="וואטסאפ" className="rounded-full p-2 hover:bg-black/5" style={{ color: C.navy }}><MessageCircle size={20} /></a>
              <button onClick={() => setOpen(true)} aria-label="סל קניות" className="relative rounded-full px-4 py-2 font-bold text-white" style={goldBg}>
                <ShoppingBag size={20} />
                {count > 0 && <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs" style={{ color: C.navy }}>{count}</span>}
              </button>
              <a href="?admin=1" title="כניסת מנהל" className="rounded-full border p-2 hover:bg-black/5" style={{ borderColor: `${C.gold}55`, color: C.navy }}>
                <LogIn size={18} />
              </a>
            </div>
          </div>
          <nav className="flex flex-wrap justify-center gap-1 border-t pt-2" style={{ borderColor: "#eee" }}>
            {CATS.map((c) => (
              <div key={c.id} className="group relative">
                <button onClick={() => { setCat(c.id); document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" }); }}
                  aria-pressed={cat === c.id}
                  className="rounded-full px-4 py-2 text-sm font-bold transition"
                  style={cat === c.id ? { ...goldBg, color: "#fff" } : { color: C.navy }}>
                  {c.name}
                </button>
                <div className="pointer-events-none absolute right-1/2 top-full z-20 mt-2 w-44 translate-x-1/2 rounded-2xl p-3 opacity-0 shadow-xl transition group-hover:pointer-events-auto group-hover:opacity-100"
                  style={{ background: C.card, border: `1px solid ${C.gold}44` }}>
                  <ImageSlot C={C} goldBg={goldBg} tag={c.flagship} icon={c.icon} />
                  <p className="mt-2 text-center text-xs text-slate-500">{c.sub || c.flagship}</p>
                </div>
              </div>
            ))}
          </nav>
        </div>
      </header>

      <section id="home" className="relative overflow-hidden" style={marble}>
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <h1 className="serif text-4xl font-black leading-tight md:text-6xl" style={{ color: C.navy }}>
              {heroTitle} <span style={goldText}>{heroSubtitle}</span>
            </h1>
            <p className="mt-5 max-w-md text-lg text-slate-600">תשמישי קדושה ויודאיקה ברמת גימור יוקרתית, בהשגחה הלכתית מלאה. רחוב הגליל, טבריה.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#catalog" className="rounded-full px-7 py-3 font-bold text-white shadow-lg" style={goldBg}>לקטלוג המהודר</a>
              <a href="#contact" className="rounded-full border px-7 py-3 font-bold hover:bg-black/5" style={{ borderColor: C.navy, color: C.navy }}>ייעוץ אישי</a>
            </div>
          </div>
          <HeroSiddur C={C} goldBg={goldBg} depth={depth} glow={glow} />
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="serif text-3xl font-black md:text-4xl" style={{ color: C.navy }}>{CATS.find((c) => c.id === cat)?.name}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <Tilt key={p.id} className="overflow-hidden rounded-2xl" depth={depth / 3}>
              <Card C={C} className="cursor-pointer rounded-2xl" style={{}}>
                <button onClick={() => setViewing(p)} className="block w-full text-right">
                  <ImageSlot C={C} goldBg={goldBg} tag={p.images[0].tag} icon={p.images[0].icon} big />
                </button>
                <div className="p-5">
                  <h3 className="serif text-xl font-bold" style={{ color: C.navy }}>{p.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{p.note}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <b className="text-lg" style={{ color: C.copper }}>₪{p.price.toLocaleString()}</b>
                    <button onClick={() => add(p.id)} className="rounded-full px-4 py-2 text-sm font-bold text-white" style={{ background: C.navy }}>הוספה לסל</button>
                  </div>
                </div>
              </Card>
            </Tilt>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[[ShieldCheck, "בדיקת מחשב", "כל תפילין ומזוזה נבדקים ומתועדים לפני המסירה."], [BadgeCheck, "סופרי סת\"ם מוסמכים", "כתיבה תמה בהשגחה והוראות הלכתיות ברורות."], [Award, "אחריות מלאה", "אחריות בכתב על הכשרות ועל הבדיקות."]].map(([I, t, d]) => (
            <Card key={t} C={C} className="rounded-2xl p-6">
              <I size={28} style={{ color: C.gold }} /><h3 className="serif mt-3 text-xl font-bold" style={{ color: C.navy }}>{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p>
            </Card>
          ))}
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.n} className="rounded-2xl p-6 text-white" style={{ background: C.navy }}>
              <div className="flex gap-1" style={{ color: C.goldL }}>{[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
              <blockquote className="mt-3 text-slate-200">{r.t}</blockquote>
              <figcaption className="mt-4 text-sm" style={{ color: C.goldL }}>{r.n}, {r.w}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <footer id="contact" className="text-slate-200" style={{ background: C.deep }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
          <div>
            <h3 className="serif text-2xl font-bold text-white">עידן - תשמישי קדושה</h3>
            <p className="mt-4 flex items-center gap-2"><MapPin size={18} style={{ color: C.gold }} />רחוב הגליל, טבריה</p>
            <p className="mt-2 flex items-center gap-2"><Phone size={18} style={{ color: C.gold }} />04-000-0000</p>
            <p className="mt-2 flex items-start gap-2"><Clock size={18} className="mt-1" style={{ color: C.gold }} />א׳–ה׳ 09:00–19:00 · ו׳ וערבי חג 09:00–13:00</p>
          </div>
          <div className="relative h-52 overflow-hidden rounded-2xl border" style={{ borderColor: `${C.gold}44`, background: C.navy }} aria-label="הוראות הגעה">
            <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: "perspective(500px) rotateX(55deg) scale(1.5)", backgroundImage: `linear-gradient(${C.gold}33 1px,transparent 1px),linear-gradient(90deg,${C.gold}33 1px,transparent 1px)`, backgroundSize: "36px 36px" }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="glow mx-auto flex h-12 w-12 items-center justify-center rounded-full text-white" style={goldBg}><MapPin /></span>
              <p className="mt-2 text-sm font-bold text-white">רחוב הגליל, טבריה</p>
            </div>
          </div>
          {sent ? (
            <p className="self-center rounded-2xl border p-6 text-center" style={{ borderColor: C.gold }}>ההודעה נשלחה. נחזור אליכם בהקדם.</p>
          ) : (
            <div className="space-y-3">
              {["שם מלא", "טלפון"].map((p) => <input key={p} placeholder={p} aria-label={p} className="w-full rounded-xl border-0 bg-white/10 px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#C9A24B]" />)}
              <textarea placeholder="במה נוכל לעזור?" aria-label="הודעה" rows={3} className="w-full rounded-xl border-0 bg-white/10 px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#C9A24B]" />
              <button onClick={() => setSent(true)} className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-white" style={goldBg}><Send size={18} />שליחת הודעה</button>
            </div>
          )}
        </div>
        <p className="border-t py-4 text-center text-xs text-slate-400" style={{ borderColor: `${C.gold}33` }}>© עידן תשמישי קדושה, טבריה</p>
      </footer>

      {viewing && <ProductModal C={C} goldBg={goldBg} product={viewing} onClose={() => setViewing(null)} onAdd={add} />}

      {open && (
        <div className="fixed inset-0 z-40 flex" role="dialog" aria-label="סל קניות">
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="order-first flex w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between p-5" style={{ background: C.navy }}>
              <h3 className="serif text-xl font-bold text-white">הסל שלי</h3>
              <button onClick={() => setOpen(false)} aria-label="סגירה" className="text-white"><X /></button>
            </div>
            <div className="flex-1 space-y-4 overflow-auto p-5">
              {count === 0 && <p className="text-slate-500">הסל ריק. בחרו מוצר מהקטלוג כדי להתחיל.</p>}
              {products.filter((p) => cart[p.id]).map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 border-b pb-3">
                  <div><b style={{ color: C.navy }}>{p.name}</b><p className="text-sm text-slate-500">₪{(p.price * cart[p.id]).toLocaleString()}</p></div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => add(p.id, -1)} aria-label="הפחתה" className="rounded-full border p-1"><Minus size={14} /></button>
                    <span className="w-5 text-center">{cart[p.id]}</span>
                    <button onClick={() => add(p.id, 1)} aria-label="הוספה" className="rounded-full border p-1"><Plus size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-5">
              <div className="flex justify-between text-lg font-bold" style={{ color: C.navy }}><span>סה״כ</span><span>₪{total.toLocaleString()}</span></div>
              <a href="#contact" onClick={() => setOpen(false)} className="mt-4 block rounded-full py-3 text-center font-bold text-white" style={goldBg}>שליחת הזמנה לחנות</a>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

/* ---------------- Admin (standalone portal, separate URL: ?admin=1) ---------------- */
const ADMIN_TABS = [
  ["dash", "דאשבורד", LayoutDashboard],
  ["theme", "עיצוב ותצוגה", Palette],
  ["products", "מוצרים ותמונות", Package],
  ["orders", "הזמנות", ListOrdered],
  ["settings", "הגדרות סניף", Settings],
];

function KPI({ C, goldBg, icon: I, label, value, sub }) {
  return (
    <Card C={C} className="rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={goldBg}><I size={20} /></span>
        <TrendingUp size={16} style={{ color: C.gold }} />
      </div>
      <p className="mt-4 text-2xl font-black" style={{ color: C.navy }}>{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
      {sub && <p className="mt-1 text-xs" style={{ color: C.copper }}>{sub}</p>}
    </Card>
  );
}

function AdminApp({ C, goldBg, theme, setTheme, depth, setDepth, glow, setGlow,
  heroTitle, setHeroTitle, heroSubtitle, setHeroSubtitle, announcement, setAnnouncement,
  products, setProducts, orders, setOrders }) {
  const [tab, setTab] = useState("dash");
  const [newP, setNewP] = useState({ name: "", cat: "shabbat", price: "", note: "" });
  const [newImgs, setNewImgs] = useState(["חזית", "זווית צד", "תקריב"]);
  const [aiText, setAiText] = useState("");

  const dailySales = 4320, monthlySales = 118600, newOrders = orders.length, avgCart = Math.round(monthlySales / Math.max(1, orders.length * 4));
  const maxSale = Math.max(...SALES.map((s) => s.v));

  const addImgSlot = () => setNewImgs((im) => [...im, `תמונה ${im.length + 1}`]);
  const removeImgSlot = (i) => setNewImgs((im) => im.filter((_, idx) => idx !== i));
  const updateImgSlot = (i, val) => setNewImgs((im) => im.map((x, idx) => (idx === i ? val : x)));

  const addProduct = () => {
    if (!newP.name || !newP.price) return;
    setProducts((ps) => [...ps, {
      id: Date.now(), cat: newP.cat, name: newP.name, note: aiText || newP.note || "מוצר חדש", price: +newP.price,
      images: newImgs.map((tag) => ({ tag, icon: Sparkles })),
    }]);
    setNewP({ name: "", cat: "shabbat", price: "", note: "" });
    setNewImgs(["חזית", "זווית צד", "תקריב"]);
    setAiText("");
  };
  const removeProduct = (id) => setProducts((ps) => ps.filter((p) => p.id !== id));
  const generateDesc = () => {
    if (!newP.name) return;
    setAiText(`${newP.name} ברמת גימור יוקרתית, נבחר בקפידה תחת השגחה הלכתית מלאה — שילוב של מסורת עתיקה ואיכות שאין להתפשר עליה, מתאים כמתנה מכובדת או לשימוש יומיומי.`);
  };
  const moveOrder = (id, dir) => setOrders((os) => os.map((o) => {
    if (o.id !== id) return o;
    const i = ORDER_STAGES.indexOf(o.status);
    const next = ORDER_STAGES[Math.min(ORDER_STAGES.length - 1, Math.max(0, i + dir))];
    return { ...o, status: next };
  }));

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: C.ivory, fontFamily: "'Heebo',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@700;900&family=Heebo:wght@400;500;700&display=swap');
        .serif{font-family:'Frank Ruhl Libre',serif}`}</style>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b px-6 py-4" style={{ background: "#FFFFFFEE", borderColor: `${C.gold}33` }}>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={goldBg}><ShieldAlert size={20} /></span>
          <div>
            <h1 className="serif text-lg font-bold" style={{ color: C.navy }}>פורטל ניהול · עידן תשמישי קדושה</h1>
            <p className="text-xs text-slate-500">אפליקציה נפרדת מהחנות · טבריה, רחוב הגליל</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Bell size={18} style={{ color: C.navy }} />
          <a href="?" className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold" style={{ borderColor: C.gold, color: C.navy }}>
            <ChevronLeft size={16} />יציאה לחנות
          </a>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-8">
        <nav className="hidden w-56 shrink-0 flex-col gap-1 md:flex">
          {ADMIN_TABS.map(([id, label, I]) => (
            <button key={id} onClick={() => setTab(id)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition"
              style={tab === id ? { ...goldBg, color: "#fff" } : { color: C.navy }}>
              <I size={18} />{label}
            </button>
          ))}
        </nav>

        <div className="flex-1 space-y-6">
          <div className="flex gap-2 overflow-x-auto md:hidden">
            {ADMIN_TABS.map(([id, label, I]) => (
              <button key={id} onClick={() => setTab(id)} className="flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
                style={tab === id ? { ...goldBg, color: "#fff" } : { border: `1px solid ${C.gold}55`, color: C.navy }}><I size={14} />{label}</button>
            ))}
          </div>

          {tab === "dash" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KPI C={C} goldBg={goldBg} icon={TrendingUp} label="מכירות היום" value={`₪${dailySales.toLocaleString()}`} sub="+12% מאתמול" />
                <KPI C={C} goldBg={goldBg} icon={Package} label="מכירות החודש" value={`₪${monthlySales.toLocaleString()}`} sub="עונת בר-מצוה חזקה" />
                <KPI C={C} goldBg={goldBg} icon={ListOrdered} label="הזמנות פתוחות" value={newOrders} sub="כולל בדיקות סת״ם" />
                <KPI C={C} goldBg={goldBg} icon={ShoppingBag} label="עגלה ממוצעת" value={`₪${avgCart.toLocaleString()}`} sub="מסניף רחוב הגליל" />
              </div>
              <Card C={C} className="rounded-2xl p-6">
                <h3 className="serif text-lg font-bold" style={{ color: C.navy }}>מכירות וביקושים לפי עונה</h3>
                <div className="mt-6 flex items-end gap-4" style={{ height: 160 }}>
                  {SALES.map((s) => (
                    <div key={s.m} className="flex flex-1 flex-col items-center gap-2">
                      <div className="w-full rounded-t-lg" style={{ height: `${(s.v / maxSale) * 130}px`, ...tokens(C).goldBg }} />
                      <span className="text-center text-[11px] text-slate-500">{s.m}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card C={C} className="rounded-2xl p-6">
                <h3 className="serif flex items-center gap-2 text-lg font-bold" style={{ color: C.navy }}><AlertTriangle size={18} style={{ color: C.gold }} />סת״ם ובדיקות פעילות</h3>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between rounded-xl border px-4 py-3" style={{ borderColor: `${C.gold}33` }}><span>תפילין רש"י ורבנו תם — בדיקת מחשב</span><span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "#dcf7e3", color: "#1b7a3d" }}>פעילה</span></div>
                  <div className="flex items-center justify-between rounded-xl border px-4 py-3" style={{ borderColor: `${C.gold}33` }}><span>מזוזה 15 ס"מ — בדיקת סופר</span><span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "#fde2e2", color: "#b42318" }}>ממתינה</span></div>
                </div>
              </Card>
            </>
          )}

          {tab === "theme" && (
            <div className="space-y-6">
              <Card C={C} className="rounded-2xl p-6">
                <h3 className="serif flex items-center gap-2 text-lg font-bold" style={{ color: C.navy }}><Palette size={18} style={{ color: C.gold }} />צבעי רקע האתר</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {Object.values(THEMES).map((t) => (
                    <button key={t.key} onClick={() => setTheme(t.key)} className="rounded-2xl border p-4 text-right"
                      style={{ borderColor: theme === t.key ? t.gold : "#e5dcc3", background: theme === t.key ? `${t.gold}18` : "white" }}>
                      <div className="flex gap-1"><span className="h-6 w-6 rounded-full" style={{ background: t.navy }} /><span className="h-6 w-6 rounded-full" style={{ background: t.gold }} /></div>
                      <p className="mt-2 text-sm font-bold" style={{ color: C.navy }}>{t.label}</p>
                    </button>
                  ))}
                </div>
              </Card>
              <Card C={C} className="rounded-2xl p-6">
                <h3 className="serif flex items-center gap-2 text-lg font-bold" style={{ color: C.navy }}><Sliders size={18} style={{ color: C.gold }} />עוצמת תלת-ממד בכניסה לאתר</h3>
                <label className="mt-4 block text-sm text-slate-600">מהירות סיבוב הסידור המרכזי: <b style={{ color: C.copper }}>{depth}</b></label>
                <input type="range" min="10" max="80" value={depth} onChange={(e) => setDepth(+e.target.value)} className="mt-2 w-full accent-[#B8894A]" />
                <label className="mt-5 flex items-center gap-3 text-sm text-slate-600">
                  <input type="checkbox" checked={glow} onChange={(e) => setGlow(e.target.checked)} className="h-4 w-4 accent-[#B8894A]" />
                  אפקט תאורת זהב עדינה סביב האובייקט
                </label>
              </Card>
              <Card C={C} className="rounded-2xl p-6">
                <h3 className="serif text-lg font-bold" style={{ color: C.navy }}>עורך תוכן ובאנרים</h3>
                <label className="mt-4 block text-sm text-slate-600">כותרת ראשית (Hero)</label>
                <input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#B8894A]" style={{ borderColor: "#e5dcc3" }} />
                <label className="mt-4 block text-sm text-slate-600">כותרת מודגשת (זהב)</label>
                <input value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#B8894A]" style={{ borderColor: "#e5dcc3" }} />
                <label className="mt-4 block text-sm text-slate-600">הודעה רצה בראש האתר</label>
                <input value={announcement} onChange={(e) => setAnnouncement(e.target.value)} placeholder="לדוגמה: מבצע לקראת בר-המצווה — 10% הנחה השבוע" className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#B8894A]" style={{ borderColor: "#e5dcc3" }} />
              </Card>
            </div>
          )}

          {tab === "products" && (
            <div className="space-y-6">
              <Card C={C} className="rounded-2xl p-6">
                <h3 className="serif text-lg font-bold" style={{ color: C.navy }}>הוספת מוצר חדש</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <input placeholder="שם המוצר" value={newP.name} onChange={(e) => setNewP({ ...newP, name: e.target.value })} className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#B8894A]" style={{ borderColor: "#e5dcc3" }} />
                  <input placeholder="מחיר" type="number" value={newP.price} onChange={(e) => setNewP({ ...newP, price: e.target.value })} className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#B8894A]" style={{ borderColor: "#e5dcc3" }} />
                  <select value={newP.cat} onChange={(e) => setNewP({ ...newP, cat: e.target.value })} className="rounded-xl border px-4 py-3 outline-none sm:col-span-2" style={{ borderColor: "#e5dcc3" }}>
                    {CATS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <label className="mt-4 flex items-center gap-2 text-sm font-bold" style={{ color: C.navy }}><ImagePlus size={16} />מערך תמונות (Image Array)</label>
                <div className="mt-2 space-y-2">
                  {newImgs.map((tag, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={tag} onChange={(e) => updateImgSlot(i, e.target.value)} placeholder={`תווית תמונה ${i + 1}`} className="flex-1 rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-[#B8894A]" style={{ borderColor: "#e5dcc3" }} />
                      <button onClick={() => removeImgSlot(i)} aria-label="הסרת תמונה" className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  ))}
                  <button onClick={addImgSlot} className="rounded-full border px-4 py-2 text-sm font-bold" style={{ borderColor: C.gold, color: C.copper }}>+ הוספת תמונה למערך</button>
                </div>
                <button onClick={generateDesc} className="mt-4 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold" style={{ borderColor: C.gold, color: C.copper }}>
                  <Wand2 size={16} />צור תיאור מוצר יוקרתי באמצעות AI
                </button>
                {aiText && <p className="mt-3 rounded-xl border p-3 text-sm text-slate-600" style={{ borderColor: "#e5dcc3" }}>{aiText}</p>}
                <button onClick={addProduct} className="mt-4 rounded-full px-6 py-2 font-bold text-white" style={goldBg}>הוספת מוצר לקטלוג</button>
              </Card>

              <Card C={C} className="overflow-x-auto rounded-2xl p-2">
                <table className="w-full min-w-[640px] text-right text-sm">
                  <thead><tr className="text-slate-500"><th className="p-3">מוצר</th><th className="p-3">קטגוריה</th><th className="p-3">תמונות</th><th className="p-3">מחיר</th><th className="p-3"></th></tr></thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t" style={{ borderColor: "#eee" }}>
                        <td className="p-3 font-medium" style={{ color: C.navy }}>{p.name}</td>
                        <td className="p-3 text-slate-500">{CATS.find((c) => c.id === p.cat)?.name || "—"}</td>
                        <td className="p-3 text-slate-500">{p.images?.length || 0} תמונות</td>
                        <td className="p-3">₪{p.price.toLocaleString()}</td>
                        <td className="p-3"><button onClick={() => removeProduct(p.id)} aria-label="מחיקה" className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {tab === "orders" && (
            <div className="grid gap-4 lg:grid-cols-5">
              {ORDER_STAGES.map((stage) => (
                <div key={stage} className="rounded-2xl p-3" style={{ background: "white", border: `1px solid ${C.gold}33` }}>
                  <h4 className="mb-3 text-center text-sm font-bold" style={{ color: C.navy }}>{stage}</h4>
                  <div className="space-y-2">
                    {orders.filter((o) => o.status === stage).map((o) => (
                      <div key={o.id} className="rounded-xl p-3 text-xs" style={{ background: C.ivory, border: "1px solid #eee" }}>
                        <p className="font-bold" style={{ color: C.navy }}>{o.name}</p>
                        <p className="mt-1 text-slate-500">{o.item}</p>
                        <p className="mt-1 text-slate-400">#{o.id}</p>
                        <div className="mt-2 flex justify-between">
                          <button onClick={() => moveOrder(o.id, -1)} className="rounded border px-2 py-1" style={{ borderColor: "#ddd" }}>←</button>
                          <button onClick={() => moveOrder(o.id, 1)} className="rounded border px-2 py-1" style={{ borderColor: "#ddd" }}>→</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "settings" && (
            <Card C={C} className="rounded-2xl p-6">
              <h3 className="serif text-lg font-bold" style={{ color: C.navy }}>הגדרות סניף טבריה</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-sm text-slate-600">שעות פתיחה, ימות החול<input defaultValue="09:00–19:00" className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#B8894A]" style={{ borderColor: "#e5dcc3" }} /></label>
                <label className="text-sm text-slate-600">שעות פתיחה, ערבי שבת וחג<input defaultValue="09:00–13:00" className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#B8894A]" style={{ borderColor: "#e5dcc3" }} /></label>
                <label className="text-sm text-slate-600">טלפון החנות<input defaultValue="04-000-0000" className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#B8894A]" style={{ borderColor: "#e5dcc3" }} /></label>
                <label className="text-sm text-slate-600">וואטסאפ למענה מהיר<input defaultValue="050-000-0000" className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-[#B8894A]" style={{ borderColor: "#e5dcc3" }} /></label>
              </div>
              <p className="mt-4 text-xs text-slate-400">שדות אלה להדגמה בפורטל הניהול; לשמירה קבועה יש לחבר אחסון נתונים.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Root: reads the URL to decide which fully separate app to render ---------------- */
export default function IdanJudaica() {
  const isAdmin = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("admin") === "1";
  const [themeKey, setThemeKey] = useState("pearl");
  const [depth, setDepth] = useState(40);
  const [glow, setGlow] = useState(true);
  const [heroTitle, setHeroTitle] = useState("עידן תשמישי קדושה,");
  const [heroSubtitle, setHeroSubtitle] = useState("מסורת של איכות וקדושה בלב טבריה");
  const [announcement, setAnnouncement] = useState("");
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [orders, setOrders] = useState(SEED_ORDERS);

  const C = THEMES[themeKey];
  const { goldText, goldBg, marble } = tokens(C);

  if (isAdmin) {
    return (
      <AdminApp
        C={C} goldBg={goldBg}
        theme={themeKey} setTheme={setThemeKey}
        depth={depth} setDepth={setDepth} glow={glow} setGlow={setGlow}
        heroTitle={heroTitle} setHeroTitle={setHeroTitle}
        heroSubtitle={heroSubtitle} setHeroSubtitle={setHeroSubtitle}
        announcement={announcement} setAnnouncement={setAnnouncement}
        products={products} setProducts={setProducts}
        orders={orders} setOrders={setOrders}
      />
    );
  }
  return (
    <Storefront
      C={C} goldText={goldText} goldBg={goldBg} marble={marble} depth={depth} glow={glow}
      heroTitle={heroTitle} heroSubtitle={heroSubtitle} announcement={announcement}
      products={products}
    />
  );
}
