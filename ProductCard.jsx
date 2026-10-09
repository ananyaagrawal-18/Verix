import React, { useState, useRef } from 'react';
import {
  Cpu, Battery, Weight, AlertOctagon, CheckCircle2, Layers,
  ExternalLink, HardDrive, Monitor
} from 'lucide-react';
import ProductDetailPopup from './ProductDetailPopup';

function formatINR(usd) {
  if (usd == null || isNaN(Number(usd))) return '₹—';
  return '₹' + Math.round(Number(usd) * 83).toLocaleString('en-IN');
}

function buyLinks(product) {
  const q = encodeURIComponent(product.name || product.brand || 'laptop');
  return [
    { name: 'Amazon.in', url: `https://www.amazon.in/s?k=${q}`, color: 'bg-amber-500/15 text-amber-700 border-amber-500/40' },
    { name: 'Flipkart', url: `https://www.flipkart.com/search?q=${q}`, color: 'bg-blue-500/15 text-blue-700 border-blue-500/40' },
    { name: 'Croma', url: `https://www.croma.com/search/?q=${q}`, color: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/40' },
  ];
}

export default function ProductCard({
  product,
  tag = 'RECOMMENDATION',
  tagType = 'default',
  reasons = [],
  pitfalls = [],
  showPitfalls = true,
}) {
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef(null);
  const leaveTimer = useRef(null);
  const open = () => { clearTimeout(leaveTimer.current); setShowDetails(true); };
  const close = () => { clearTimeout(leaveTimer.current); leaveTimer.current = setTimeout(() => setShowDetails(false), 200); };

  if (!product) return null;

  let headerColor = 'border-[#D8CDC0] bg-[#F7F2EC] text-[#5C4D44]';
  let borderStyle = 'border-[#E8E1D7]';
  if (tagType === 'verified') {
    headerColor = 'border-[#C8DFCD] bg-[#EEF5EF] text-[#2A5A3B]';
    borderStyle = 'border-[#C8DFCD]';
  } else if (tagType === 'initial') {
    headerColor = 'border-[#D8CDC0] bg-[#FAF8F5] text-[#7C6C63]';
    borderStyle = 'border-[#E8E1D7]';
  } else if (tagType === 'alternative') {
    headerColor = 'border-[#E8D4C8] bg-[#F8EDE7] text-[#7B482C]';
    borderStyle = 'border-[#E8D4C8]';
  }

  const display = product.display || {};
  const battery = product.battery || {};
  const links = buyLinks(product);

  return (
    <div
      ref={cardRef}
      className={`relative w-full rounded-2xl border ${borderStyle} bg-white p-5 shadow-xs transition-all ${showDetails ? 'z-50' : ''}`}
      onMouseEnter={open}
      onMouseLeave={close}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md border ${headerColor} font-semibold`}>
          {tag}
        </span>
        <div className="text-right">
          <span className="text-lg font-bold font-mono text-[#221813]">{formatINR(product.price)}</span>
          <span className="text-[10px] text-[#8E7F75] block">MRP</span>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-[10px] font-semibold text-[#8E7F75] uppercase tracking-wider">{product.brand}</span>
        <h3 className="text-base font-semibold text-[#221813] tracking-tight leading-snug">{product.name}</h3>
        <p className="text-[11px] text-blue-600 mt-1 font-medium">Hover → full datasheet (warranty, origin, specs)</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 text-xs">
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC]">
          <div className="flex items-center space-x-1.5 text-[#8E7F75] mb-1">
            <Cpu className="w-3.5 h-3.5 text-[#7B482C] shrink-0" />
            <span className="text-[9px] uppercase font-mono font-semibold">Processor</span>
          </div>
          <span className="text-[#221813] font-medium truncate block text-xs" title={product.cpu}>{product.cpu}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC]">
          <div className="flex items-center space-x-1.5 text-[#8E7F75] mb-1">
            <Layers className="w-3.5 h-3.5 text-[#7B482C] shrink-0" />
            <span className="text-[9px] uppercase font-mono font-semibold">Graphics</span>
          </div>
          <span className="text-[#221813] font-medium truncate block text-xs" title={product.gpu}>{product.gpu}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC]">
          <div className="flex items-center space-x-1.5 text-[#8E7F75] mb-1">
            <HardDrive className="w-3.5 h-3.5 text-[#7B482C] shrink-0" />
            <span className="text-[9px] uppercase font-mono font-semibold">RAM / SSD</span>
          </div>
          <span className="text-[#221813] font-medium text-xs">{product.ram_gb}GB · {product.storage_gb}GB</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC]">
          <div className="flex items-center space-x-1.5 text-[#8E7F75] mb-1">
            <Monitor className="w-3.5 h-3.5 text-[#7B482C] shrink-0" />
            <span className="text-[9px] uppercase font-mono font-semibold">Display</span>
          </div>
          <span className="text-[#221813] font-medium text-xs truncate block">
            {display.size_inches}&quot; {display.panel_type || ''}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC]">
          <div className="flex items-center space-x-1.5 text-[#8E7F75] mb-1">
            <Battery className="w-3.5 h-3.5 text-[#7B482C] shrink-0" />
            <span className="text-[9px] uppercase font-mono font-semibold">Battery</span>
          </div>
          <span className="text-[#221813] font-medium text-xs">{battery.real_world_hours || '—'}h real-world</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC]">
          <div className="flex items-center space-x-1.5 text-[#8E7F75] mb-1">
            <Weight className="w-3.5 h-3.5 text-[#7B482C] shrink-0" />
            <span className="text-[9px] uppercase font-mono font-semibold">Weight</span>
          </div>
          <span className="text-[#221813] font-medium text-xs">{product.weight_kg} kg</span>
        </div>
      </div>

      {(reasons.length > 0 || (product.strengths && product.strengths.length > 0)) && (
        <div className="mb-3">
          <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-[#8E7F75] mb-1.5 uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Why this pick</span>
          </div>
          <ul className="space-y-1">
            {(reasons.length ? reasons : product.strengths.slice(0, 3)).map((r, i) => (
              <li key={i} className="text-xs text-[#221813] flex items-start space-x-1.5">
                <span className="text-emerald-600 mt-0.5">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showPitfalls && (pitfalls.length > 0 || (product.pitfalls && product.pitfalls.length > 0)) && (
        <div className="mb-3">
          <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-[#8E7F75] mb-1.5 uppercase tracking-wider">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
            <span>Watch outs</span>
          </div>
          <ul className="space-y-1">
            {(pitfalls.length ? pitfalls : product.pitfalls.slice(0, 2)).map((r, i) => (
              <li key={i} className="text-xs text-[#5C4D44] flex items-start space-x-1.5">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-dashed border-[#E8E1D7]">
        {links.map((l) => (
          <a
            key={l.name}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-[10px] font-semibold transition-all ${l.color}`}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3" />
            <span>{l.name}</span>
          </a>
        ))}
      </div>

      {showDetails && (
        <ProductDetailPopup product={product} onClose={close} onKeepOpen={open} anchorRef={cardRef} />
      )}
    </div>
  );
}
