import React from 'react';
import { Cpu, Eye, Battery, Weight, AlertOctagon, CheckCircle2, Layers, ShieldAlert } from 'lucide-react';

export default function ProductCard({
  product,
  tag = "RECOMMENDATION",
  tagType = "default", // "initial", "verified", "alternative"
  reasons = [],
  pitfalls = [],
  showPitfalls = true
}) {
  if (!product) return null;

  let headerColor = "border-[#D8CDC0] bg-[#F7F2EC] text-[#5C4D44]";
  let borderStyle = "border-[#E8E1D7]";
  if (tagType === "verified") {
    headerColor = "border-[#C8DFCD] bg-[#EEF5EF] text-[#2A5A3B]";
    borderStyle = "border-[#C8DFCD]";
  } else if (tagType === "initial") {
    headerColor = "border-[#D8CDC0] bg-[#FAF8F5] text-[#7C6C63]";
    borderStyle = "border-[#E8E1D7]";
  } else if (tagType === "alternative") {
    headerColor = "border-[#E8D4C8] bg-[#F8EDE7] text-[#7B482C]";
    borderStyle = "border-[#E8D4C8]";
  }

  return (
    <div className={`w-full rounded-2xl border ${borderStyle} bg-[#FFFFFF] p-5 shadow-xs transition-all`}>
      
      {/* Top Banner & Price */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md border ${headerColor} font-semibold`}>
          {tag}
        </span>
        <div className="text-right">
          <span className="text-lg font-bold font-mono text-[#221813]">${product.price}</span>
          <span className="text-[10px] text-[#8E7F75] block">MSRP</span>
        </div>
      </div>

      {/* Title & Brand */}
      <div className="mb-4">
        <span className="text-[10px] font-semibold text-[#8E7F75] uppercase tracking-wider">{product.brand}</span>
        <h3 className="text-base font-semibold text-[#221813] tracking-tight leading-snug">{product.name}</h3>
      </div>

      {/* Spec Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 text-xs">
        
        {/* CPU */}
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC]">
          <div className="flex items-center space-x-1.5 text-[#8E7F75] mb-1">
            <Cpu className="w-3.5 h-3.5 text-[#7B482C] shrink-0" />
            <span className="text-[9px] uppercase font-mono font-semibold">Processor</span>
          </div>
          <span className="text-[#221813] font-medium truncate block text-xs" title={product.cpu}>{product.cpu}</span>
          <span className="text-[10px] text-[#7C6C63] truncate block mt-0.5" title={product.gpu}>
            {product.gpu} ({product.gpu_tgp_w}W)
          </span>
        </div>

        {/* RAM */}
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC]">
          <div className="flex items-center space-x-1.5 text-[#8E7F75] mb-1">
            <Layers className="w-3.5 h-3.5 text-[#7B482C] shrink-0" />
            <span className="text-[9px] uppercase font-mono font-semibold">Memory</span>
          </div>
          <span className="text-[#221813] font-medium block text-xs">{product.ram_gb}GB {product.ram_type}</span>
          <span className={`text-[9px] font-semibold mt-0.5 inline-block px-1.5 py-0.2 rounded ${
            product.ram_soldered ? 'bg-[#FBF2E8] text-[#9E6218] border border-[#ECD9C0]' : 'bg-[#EEF5EF] text-[#2A5A3B] border-[#C8DFCD]'
          }`}>
            {product.ram_soldered ? 'Soldered' : 'Upgradable'}
          </span>
        </div>

        {/* Display */}
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC]">
          <div className="flex items-center space-x-1.5 text-[#8E7F75] mb-1">
            <Eye className="w-3.5 h-3.5 text-[#7B482C] shrink-0" />
            <span className="text-[9px] uppercase font-mono font-semibold">Display</span>
          </div>
          <span className="text-[#221813] font-medium block text-xs">
            {product.display?.size_inches}" {product.display?.resolution}
          </span>
          <span className="text-[10px] text-[#7C6C63] block truncate" title={product.display?.color_gamut}>
            {product.display?.color_gamut} ({product.display?.refresh_rate_hz}Hz)
          </span>
        </div>

        {/* Battery */}
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC]">
          <div className="flex items-center space-x-1.5 text-[#8E7F75] mb-1">
            <Battery className="w-3.5 h-3.5 text-[#2A5A3B] shrink-0" />
            <span className="text-[9px] uppercase font-mono font-semibold">Battery</span>
          </div>
          <span className="text-[#221813] font-medium block text-xs">~{product.battery?.real_world_hours} Hours</span>
          <span className="text-[10px] text-[#7C6C63] block">
            {product.battery?.capacity_wh}Wh
          </span>
        </div>

        {/* Weight */}
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC]">
          <div className="flex items-center space-x-1.5 text-[#8E7F75] mb-1">
            <Weight className="w-3.5 h-3.5 text-[#7B482C] shrink-0" />
            <span className="text-[9px] uppercase font-mono font-semibold">Weight</span>
          </div>
          <span className="text-[#221813] font-medium block text-xs">{product.weight_kg} kg</span>
          <span className="text-[10px] text-[#7C6C63] block">
            {product.weight_kg < 1.6 ? 'Ultra-portable' : 'Moderate'}
          </span>
        </div>

        {/* Thermals */}
        <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC]">
          <div className="flex items-center space-x-1.5 text-[#8E7F75] mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-[#9E623E] shrink-0" />
            <span className="text-[9px] uppercase font-mono font-semibold">Cooling</span>
          </div>
          <span className="text-[#221813] font-medium block text-xs">{product.thermals?.noise_under_load_db} dB noise</span>
          <span className="text-[10px] text-[#7C6C63] truncate block" title={product.thermals?.cooling_type}>
            {product.thermals?.cooling_type}
          </span>
        </div>

      </div>

      {/* Rationale */}
      {reasons && reasons.length > 0 && (
        <div className="mb-3 pt-3 border-t border-[#F0EBE3]">
          <span className="text-xs font-semibold text-[#221813] block mb-1.5 flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2A5A3B]" />
            <span>Key Rationale:</span>
          </span>
          <ul className="space-y-1 text-xs text-[#5C4D44]">
            {reasons.map((r, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-[#7B482C] font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pitfalls */}
      {showPitfalls && product.pitfalls && product.pitfalls.length > 0 && (
        <div className="pt-2.5 border-t border-[#F0EBE3]">
          <span className="text-xs font-semibold text-[#9E6218] block mb-1.5 flex items-center space-x-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-[#9E6218]" />
            <span>Hardware Pitfalls Checked:</span>
          </span>
          <ul className="space-y-1 text-xs text-[#7C6C63]">
            {product.pitfalls.slice(0, 2).map((p, i) => (
              <li key={i} className="flex items-start space-x-1.5 bg-[#FAF6F0] p-1.5 rounded-lg border border-[#EDE2D4]">
                <span className="text-[#9E6218] font-bold shrink-0">⚠️</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
