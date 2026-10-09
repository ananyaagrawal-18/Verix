import React, { useEffect, useState, useRef } from 'react';
import {
  X, ExternalLink, Shield, Globe, Factory, Cpu, HardDrive,
  Monitor, Battery, Thermometer
} from 'lucide-react';

function formatINR(usd) {
  if (usd == null || isNaN(Number(usd))) return '₹—';
  return '₹' + Math.round(Number(usd) * 83).toLocaleString('en-IN');
}

const BRAND_META = {
  Apple: { origin: 'Designed California · Assembled China/Vietnam', warranty: '1 Year Apple Limited + AppleCare optional', hq: 'Cupertino, USA' },
  Lenovo: { origin: 'Designed USA/China · Assembled China/India', warranty: '1 Year Onsite (India)', hq: 'Hong Kong / Beijing' },
  ASUS: { origin: 'Designed Taiwan · Assembled China/Taiwan', warranty: '1–2 Year Global (India onsite)', hq: 'Taipei, Taiwan' },
  Dell: { origin: 'Designed USA · Assembled China/India', warranty: '1 Year Premium Support (India)', hq: 'Round Rock, USA' },
  HP: { origin: 'Designed USA · Assembled China/India', warranty: '1 Year Onsite (India)', hq: 'Palo Alto, USA' },
  Acer: { origin: 'Designed Taiwan · Assembled China', warranty: '1 Year International Travelers', hq: 'New Taipei, Taiwan' },
  Samsung: { origin: 'Designed South Korea · Assembled Vietnam/India', warranty: '1 Year Manufacturer Warranty', hq: 'Suwon, South Korea' },
  Google: { origin: 'Designed USA · Assembled Vietnam/China', warranty: '1 Year Limited Warranty', hq: 'Mountain View, USA' },
  OnePlus: { origin: 'Designed China · Assembled India/China', warranty: '1 Year Manufacturer Warranty', hq: 'Shenzhen, China' },
  Xiaomi: { origin: 'Designed China · Assembled India/China', warranty: '1 Year Manufacturer Warranty', hq: 'Beijing, China' },
  Sony: { origin: 'Designed Japan · Assembled Malaysia/China', warranty: '1 Year International Warranty', hq: 'Tokyo, Japan' },
  Bose: { origin: 'Designed USA · Assembled Mexico/China', warranty: '1 Year Limited Warranty', hq: 'Framingham, USA' },
  Framework: { origin: 'Designed USA · Assembled Taiwan', warranty: '1 Year Limited + Modular parts', hq: 'San Francisco, USA' },
  System76: { origin: 'Designed USA · Assembled USA/Taiwan', warranty: '1 Year Parts & Labor', hq: 'Denver, USA' },
  MSI: { origin: 'Designed Taiwan · Assembled China', warranty: '2 Year Limited Warranty', hq: 'New Taipei, Taiwan' },
  Razer: { origin: 'Designed USA/Singapore · Assembled China', warranty: '1 Year Limited Warranty', hq: 'Irvine, USA' },
  Microsoft: { origin: 'Designed USA · Assembled China', warranty: '1 Year Limited Warranty', hq: 'Redmond, USA' },
  LG: { origin: 'Designed South Korea · Assembled China/Vietnam', warranty: '1 Year Manufacturer Warranty', hq: 'Seoul, South Korea' },
  Infinix: { origin: 'Designed China · Assembled India/China', warranty: '1 Year Manufacturer Warranty', hq: 'Hong Kong' },
  Nothing: { origin: 'Designed UK · Assembled China', warranty: '1 Year Manufacturer Warranty', hq: 'London, UK' },
  Motorola: { origin: 'Designed USA · Assembled India/China', warranty: '1 Year Manufacturer Warranty', hq: 'Chicago, USA' },
  Vivo: { origin: 'Designed China · Assembled India/China', warranty: '1 Year Manufacturer Warranty', hq: 'Dongguan, China' },
  realme: { origin: 'Designed China · Assembled India/China', warranty: '1 Year Manufacturer Warranty', hq: 'Shenzhen, China' },
  boAt: { origin: 'Designed India · Assembled India/China', warranty: '1 Year Brand Warranty', hq: 'New Delhi, India' },
  JBL: { origin: 'Designed USA · Assembled China', warranty: '1 Year Limited Warranty', hq: 'Los Angeles, USA' },
  Sennheiser: { origin: 'Designed Germany · Assembled China/Romania', warranty: '2 Year International Warranty', hq: 'Wedemark, Germany' },
};

function metaFor(brand) {
  return BRAND_META[brand] || { origin: 'Global supply chain', warranty: '1 Year Manufacturer Warranty', hq: '—' };
}

function buyLinks(product) {
  const q = encodeURIComponent(product.name || product.brand || 'product');
  return [
    { name: 'Amazon.in', url: `https://www.amazon.in/s?k=${q}`, accent: 'from-amber-500/25 to-orange-500/10 border-amber-400/40 text-amber-100' },
    { name: 'Flipkart', url: `https://www.flipkart.com/search?q=${q}`, accent: 'from-sky-500/25 to-blue-500/10 border-sky-400/40 text-sky-100' },
    { name: 'Croma', url: `https://www.croma.com/search/?q=${q}`, accent: 'from-teal-500/25 to-emerald-500/10 border-teal-400/40 text-teal-100' },
  ];
}

function Row({ label, value }) {
  if (value == null || value === '' || value === 'undefined') return null;
  return (
    <div className="flex justify-between gap-3 py-1.5 border-b border-white/[0.07] last:border-0">
      <span className="text-[11px] text-slate-400 shrink-0 w-[40%] font-medium">{label}</span>
      <span className="text-[11px] text-slate-50 font-semibold text-right flex-1 leading-snug break-words">{value}</span>
    </div>
  );
}

function Section({ icon: Icon, title, children, tint }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg border ${tint}`}>
          <Icon className="w-3.5 h-3.5" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-300">{title}</span>
      </div>
      <div className="rounded-xl bg-white/[0.06] border border-white/10 px-3 py-1 backdrop-blur-md">
        {children}
      </div>
    </section>
  );
}

/**
 * Fixed-position glass datasheet that always sits ABOVE the anchor element.
 * anchorRef: ref to the product card DOM node
 */
export default function ProductDetailPopup({ product, onClose, onKeepOpen, anchorRef }) {
  const panelRef = useRef(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!product) return;

    const place = () => {
      const el = anchorRef?.current;
      const panel = panelRef.current;
      if (!el) {
        // fallback: top center of viewport
        setCoords({
          position: 'fixed',
          left: '50%',
          top: '12px',
          transform: 'translateX(-50%)',
          width: 'min(440px, calc(100vw - 24px))',
          maxHeight: 'min(72vh, 560px)',
          zIndex: 9999,
        });
        return;
      }
      const r = el.getBoundingClientRect();
      const gap = 10;
      const width = Math.min(440, Math.max(280, r.width), window.innerWidth - 16);
      let left = r.left + (r.width - width) / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - width - 8));

      // Prefer above the card
      const panelH = panel?.offsetHeight || 420;
      let top = r.top - panelH - gap;
      // If not enough space above, still try above with max height shrink, else below
      if (top < 8) {
        const spaceAbove = r.top - 8;
        if (spaceAbove > 180) {
          top = 8;
        } else {
          top = r.bottom + gap;
        }
      }

      setCoords({
        position: 'fixed',
        left: `${left}px`,
        top: `${Math.max(8, top)}px`,
        width: `${width}px`,
        maxHeight: `${Math.min(window.innerHeight - 16, 560)}px`,
        zIndex: 9999,
      });
    };

    place();
    // remeasure after paint for accurate height
    const t = requestAnimationFrame(place);
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      cancelAnimationFrame(t);
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [product, anchorRef]);

  if (!product) return null;

  const m = metaFor(product.brand);
  const d = product.display || {};
  const b = product.battery || {};
  const t = product.thermals || {};
  const links = buyLinks(product);
  const dtype = product.device_type || 'laptop';

  return (
    <>
      {/* mobile only: dim backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/40 sm:hidden"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        style={coords || { position: 'fixed', top: 8, left: 8, right: 8, zIndex: 9999 }}
        className="overflow-y-auto rounded-2xl text-white animate-fade-in
          bg-[rgba(12,16,32,0.88)] backdrop-blur-2xl backdrop-saturate-150
          border border-white/15
          shadow-[0_8px_40px_-8px_rgba(0,0,0,0.65),0_0_0_1px_rgba(167,139,250,0.2),0_0_48px_-12px_rgba(99,102,241,0.45)]"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => onKeepOpen && onKeepOpen()}
        onMouseLeave={() => onClose && onClose()}
      >
        {/* glass highlight edge */}
        <div className="h-[2px] w-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 rounded-t-2xl opacity-90" />

        {/* Header */}
        <div className="sticky top-0 z-10 px-3.5 sm:px-4 pt-3 pb-2.5 flex items-start justify-between gap-2
          bg-[rgba(12,16,32,0.85)] backdrop-blur-xl border-b border-white/10">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-violet-500/25 border border-violet-300/30 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-pulse" />
              <span className="text-[9px] uppercase font-bold tracking-widest text-violet-100">
                {product.brand} · Product Datasheet
              </span>
            </div>
            <h3 className="text-xs sm:text-[13px] font-bold text-white leading-snug pr-1 line-clamp-2">{product.name}</h3>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black font-mono bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                {formatINR(product.price)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-3.5 sm:px-4 py-3 space-y-3">
          <Section icon={Factory} title="Manufacturer & Warranty" tint="text-violet-200 bg-violet-500/20 border-violet-400/30">
            <Row label="Brand / OEM" value={product.brand} />
            <Row label="Model" value={product.name} />
            <Row label="Category" value={(product.category || dtype || '').replace(/_/g, ' ')} />
            <Row label="Device Type" value={dtype} />
            <Row label="Headquarters" value={m.hq} />
            <Row label="Origin / Assembly" value={m.origin} />
            <Row label="Warranty" value={m.warranty} />
            <Row label="SKU / ID" value={product.id} />
          </Section>

          <Section icon={Cpu} title="Processor & Graphics" tint="text-cyan-200 bg-cyan-500/20 border-cyan-400/30">
            <Row label="CPU / Chipset" value={product.cpu} />
            <Row label="GPU / Graphics" value={product.gpu} />
            {product.gpu_tgp_w ? <Row label="GPU TGP" value={`${product.gpu_tgp_w}W`} /> : null}
          </Section>

          <Section icon={HardDrive} title="Memory & Storage" tint="text-sky-200 bg-sky-500/20 border-sky-400/30">
            <Row label="RAM" value={product.ram_gb ? `${product.ram_gb} GB` : null} />
            <Row label="RAM Type" value={product.ram_type} />
            <Row label="RAM Expandable" value={product.ram_soldered === true ? 'No (soldered)' : product.ram_soldered === false ? 'Yes (upgradable)' : null} />
            <Row label="Storage (ROM)" value={product.storage_gb ? `${product.storage_gb} GB SSD` : null} />
          </Section>

          {(d.size_inches || d.resolution) && (
            <Section icon={Monitor} title="Display" tint="text-rose-200 bg-rose-500/20 border-rose-400/30">
              <Row label="Size" value={d.size_inches ? `${d.size_inches} inch` : null} />
              <Row label="Resolution" value={d.resolution} />
              <Row label="Refresh Rate" value={d.refresh_rate_hz ? `${d.refresh_rate_hz} Hz` : null} />
              <Row label="Panel Type" value={d.panel_type} />
              <Row label="Brightness" value={d.brightness_nits ? `${d.brightness_nits} nits` : null} />
              <Row label="Color Gamut" value={d.color_gamut} />
            </Section>
          )}

          {(b.capacity_wh || b.real_world_hours) && (
            <Section icon={Battery} title="Battery & Power" tint="text-emerald-200 bg-emerald-500/20 border-emerald-400/30">
              <Row label="Capacity" value={b.capacity_wh ? `${b.capacity_wh} Wh` : null} />
              <Row label="Real-world Life" value={b.real_world_hours ? `~${b.real_world_hours} hours` : null} />
              <Row label="USB-C Charging" value={b.usb_c_charging === true ? 'Yes' : b.usb_c_charging === false ? 'No (barrel/pin)' : null} />
            </Section>
          )}

          <Section icon={Thermometer} title="Thermals & Build" tint="text-amber-200 bg-amber-500/20 border-amber-400/30">
            <Row label="Cooling" value={t.cooling_type} />
            <Row label="Throttle Risk" value={t.throttle_risk} />
            <Row label="Noise under load" value={t.noise_under_load_db != null ? `${t.noise_under_load_db} dB` : null} />
            <Row label="Weight" value={product.weight_kg != null ? `${product.weight_kg} kg` : null} />
            <Row label="Ports" value={(product.ports || []).join(' · ') || null} />
          </Section>

          {product.strengths?.length > 0 && (
            <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/25 px-3 py-2 backdrop-blur-sm">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200 mb-1">Strengths</div>
              <ul className="space-y-1">
                {product.strengths.map((s, i) => (
                  <li key={i} className="text-[11px] text-emerald-50/95 flex gap-2">
                    <span className="text-emerald-300 font-bold">✓</span><span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.pitfalls?.length > 0 && (
            <div className="rounded-xl bg-amber-500/15 border border-amber-400/25 px-3 py-2 backdrop-blur-sm">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-amber-200 mb-1">Things to note</div>
              <ul className="space-y-1">
                {product.pitfalls.map((s, i) => (
                  <li key={i} className="text-[11px] text-amber-50/95 flex gap-2">
                    <span className="text-amber-300 font-bold">!</span><span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <section className="pb-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg border text-sky-200 bg-sky-500/20 border-sky-400/30">
                <Globe className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-300">Where to buy</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {links.map((l) => (
                <a
                  key={l.name}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border bg-gradient-to-br text-xs font-bold transition-transform hover:scale-[1.03] active:scale-95 ${l.accent}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {l.name}
                </a>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              Check seller rating & return policy before purchase
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
