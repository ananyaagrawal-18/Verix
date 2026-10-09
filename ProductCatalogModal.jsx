import React, { useState } from 'react';
import { X, Search, Database, Layers, Battery, Weight, Cpu, ExternalLink } from 'lucide-react';

export default function ProductCatalogModal({ isOpen, onClose, products = [] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  if (!isOpen) return null;

  const categories = [
    { id: "all", label: "All Hardware" },
    { id: "creator_workstation", label: "Creators" },
    { id: "gaming_performance", label: "Gaming" },
    { id: "cs_student_developer", label: "CS Students" },
    { id: "ultralight_productivity", label: "Ultralights" },
    { id: "budget_allrounder", label: "Budget" },
  ];

  const filtered = products.filter((p) => {
    const matchesCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.cpu.toLowerCase().includes(search.toLowerCase()) ||
      p.gpu.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-4xl bg-[#FFFFFF] border border-[#E8E1D7] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E8E1D7] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#221813] text-[#FAF8F5]">
              <Database className="w-5 h-5 text-[#EFEAE2]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#221813]">
                Synthetic Hardware Catalog
              </h2>
              <p className="text-xs text-[#7C6C63]">
                15 benchmarked laptops with verified thermal ratings and soldered memory flags
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E7F75] hover:text-[#221813] hover:bg-[#F4EFEB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-4 border-b border-[#E8E1D7] bg-[#FAF8F5]/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8E7F75]" />
            <input
              type="text"
              placeholder="Search specs, CPU, GPU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E8E1D7] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#221813] placeholder-[#8E7F75] focus:outline-none focus:border-[#7B482C]"
            />
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === c.id
                    ? "bg-[#221813] text-[#FAF8F5] border-[#221813] font-medium"
                    : "bg-[#FFFFFF] text-[#5C4D44] border-[#E8E1D7] hover:border-[#D8CFBF]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E1D7] flex flex-col justify-between hover:border-[#D8CFBF] transition-all text-xs shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-mono font-semibold text-[#7B482C]">{p.brand}</span>
                  <span className="font-mono font-bold text-[#221813] text-sm">₹{Math.round(Number(p.price) * 83).toLocaleString('en-IN')}</span>
                </div>
                <h4 className="font-semibold text-[#221813] text-sm mb-2">{p.name}</h4>

                <div className="space-y-1 text-[#5C4D44] mb-3">
                  <div className="flex items-center space-x-1.5 truncate">
                    <Cpu className="w-3 h-3 text-[#7B482C] shrink-0" />
                    <span>{p.cpu}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 truncate">
                    <Layers className="w-3 h-3 text-[#7B482C] shrink-0" />
                    <span>{p.gpu} ({p.gpu_tgp_w}W)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Battery className="w-3 h-3 text-[#2A5A3B] shrink-0" />
                    <span>~{p.battery?.real_world_hours}h battery</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Weight className="w-3 h-3 text-[#8E7F75] shrink-0" />
                    <span>{p.weight_kg} kg</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                    p.ram_soldered ? 'bg-[#FBF2E8] text-[#9E6218] border border-[#ECD9C0]' : 'bg-[#EEF5EF] text-[#2A5A3B] border-[#C8DFCD]'
                  }`}>
                    {p.ram_soldered ? 'Soldered RAM' : 'Dual SO-DIMM'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF8F5] text-[#5C4D44] border border-[#E8E1D7] font-mono">
                    {p.display?.color_gamut}
                  </span>
                </div>
              </div>

              {p.pitfalls?.[0] && (
                <div className="mt-2 pt-2 border-t border-[#F0EBE3] text-[10px] text-[#9E6218]">
                  ⚠️ {p.pitfalls[0]}
                </div>
              )}

              <div className="mt-3 flex flex-wrap gap-1.5">
                {[
                  { n: 'Amazon', u: `https://www.amazon.in/s?k=${encodeURIComponent(p.name)}` },
                  { n: 'Flipkart', u: `https://www.flipkart.com/search?q=${encodeURIComponent(p.name)}` },
                  { n: 'Croma', u: `https://www.croma.com/search/?q=${encodeURIComponent(p.name)}` },
                ].map((l) => (
                  <a
                    key={l.n}
                    href={l.u}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-2 py-1 rounded-md border border-[#E8E1D7] bg-[#FAF8F5] text-[10px] font-semibold text-[#5C4D44] hover:border-blue-400 hover:text-blue-600 transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{l.n}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
