import React from 'react';

export default function AmbientBackground({ deviceType }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
      {/* Soft warm radial ambient glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#EFE8DF]/60 to-[#FAF5EE]/20 blur-3xl -top-20 -right-20 opacity-70 transition-all duration-1000"></div>
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#EAE2D5]/50 to-transparent blur-3xl -bottom-20 -left-20 opacity-60 transition-all duration-1000"></div>

      {/* Floating Ambient Device Silhouette */}
      <div className="relative w-full h-full flex items-center justify-center">
        {deviceType === 'laptop' && (
          <div className="transition-all duration-1000 ease-out transform scale-100 opacity-[0.06] sm:opacity-[0.08] text-[#7B482C]">
            <svg
              width="700"
              height="500"
              viewBox="0 0 700 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="max-w-[85vw] max-h-[60vh]"
            >
              {/* Laptop Screen Lid */}
              <rect x="130" y="50" width="440" height="280" rx="18" stroke="currentColor" strokeWidth="8" />
              <rect x="150" y="70" width="400" height="240" rx="10" fill="currentColor" fillOpacity="0.3" />
              {/* Display Bezel Notch */}
              <circle cx="350" cy="62" r="4" fill="currentColor" />
              {/* Laptop Keyboard Base */}
              <path d="M50 340 L650 340 L600 400 L100 400 Z" stroke="currentColor" strokeWidth="8" fill="currentColor" fillOpacity="0.1" />
              <rect x="280" y="360" width="140" height="28" rx="4" stroke="currentColor" strokeWidth="4" />
            </svg>
          </div>
        )}

        {deviceType === 'smartphone' && (
          <div className="transition-all duration-1000 ease-out transform scale-100 opacity-[0.06] sm:opacity-[0.08] text-[#7B482C]">
            <svg
              width="400"
              height="650"
              viewBox="0 0 400 650"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="max-w-[70vw] max-h-[65vh]"
            >
              {/* Smartphone Outer Chassis */}
              <rect x="50" y="40" width="300" height="570" rx="48" stroke="currentColor" strokeWidth="9" />
              {/* Screen Area */}
              <rect x="66" y="56" width="268" height="538" rx="36" fill="currentColor" fillOpacity="0.25" />
              {/* Dynamic Island / Camera Pill */}
              <rect x="155" y="75" width="90" height="26" rx="13" fill="currentColor" />
              {/* Speaker Ear-piece */}
              <line x1="175" y1="50" x2="225" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {!deviceType && (
          <div className="transition-all duration-1000 ease-out opacity-[0.04] text-[#7B482C]">
            <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
              <circle cx="250" cy="250" r="180" stroke="currentColor" strokeWidth="6" strokeDasharray="16 16" />
              <circle cx="250" cy="250" r="120" stroke="currentColor" strokeWidth="4" />
              <circle cx="250" cy="250" r="60" stroke="currentColor" strokeWidth="3" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
