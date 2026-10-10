'use client';

import React from 'react';

interface HeroBadgeProps {
  className?: string;
  watermark?: boolean;
}

/**
 * HeroBadge: Biểu tượng minh họa "Tra cứu Văn bằng Đại học"
 * Hỗ trợ chế độ Watermark chìm phía sau tiêu đề tựa như hoa văn phôi bằng bảo mật:
 * - Kích thước bề thế ôm trọn trung tâm tiêu đề
 * - Độ mờ dịu mắt 18%, không làm cản trở việc đọc chữ
 * - Chuỗi chuyển động lướt kính lúp và nở dấu tích êm ái
 */
export default function HeroBadge({ className = '', watermark = false }: HeroBadgeProps) {
  return (
    <div
      className={`flex items-center justify-center select-none pointer-events-none ${
        watermark ? 'opacity-[0.16] sm:opacity-[0.20]' : 'drop-shadow-[0_8px_20px_rgba(37,99,235,0.09)]'
      } ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes hero-diploma-enter {
          0% { opacity: 0; transform: translateY(14px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes hero-cap-enter {
          0% { opacity: 0; transform: translateY(10px) scale(0.85); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes hero-lens-glide {
          0% { opacity: 0; transform: translate(-14px, -12px) rotate(-12deg) scale(0.82); }
          65% { opacity: 1; transform: translate(1.5px, 1px) rotate(2deg) scale(1.03); }
          100% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
        }
        @keyframes hero-lens-shine {
          0% { transform: translateX(-35px) translateY(-20px); opacity: 0; }
          40% { opacity: 0.9; }
          100% { transform: translateX(35px) translateY(20px); opacity: 0; }
        }
        @keyframes hero-check-pop {
          0% { opacity: 0; transform: scale(0); }
          65% { opacity: 1; transform: scale(1.28); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes hero-seal-stamp {
          0% { opacity: 0; transform: scale(1.35); }
          100% { opacity: 1; transform: scale(1); }
        }

        .anim-diploma {
          animation: hero-diploma-enter 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .anim-cap {
          animation: hero-cap-enter 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.12s forwards;
          opacity: 0;
        }
        .anim-lens {
          animation: hero-lens-glide 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.22s forwards;
          opacity: 0;
        }
        .anim-shine {
          animation: hero-lens-shine 0.9s cubic-bezier(0.25, 1, 0.5, 1) 0.55s forwards;
        }
        .anim-check {
          animation: hero-check-pop 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.68s forwards;
          transform-origin: 18.5px 18px;
          opacity: 0;
        }
        .anim-seal {
          animation: hero-seal-stamp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.78s forwards;
          transform-origin: 63px 45px;
          opacity: 0;
        }
      `}</style>

      <svg
        width="165"
        height="118"
        viewBox="-10 -8 165 118"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[136px] h-[98px] sm:w-[155px] sm:h-[111px] block"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Bóng đổ êm dịu */}
          <filter id="lensDeepShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4.5" stdDeviation="4.5" floodColor="#1E3A8A" floodOpacity="0.14" />
          </filter>

          {/* Dải sáng phản chiếu quét qua mặt kính */}
          <linearGradient id="lensShineSweep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Vầng sáng nhẹ cho dấu tích xanh */}
          <filter id="glowGreen" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#10B981" floodOpacity="0.35" />
          </filter>

          {/* Mặt nạ tròn giới hạn tia sáng trong lòng mặt kính */}
          <clipPath id="lensGlassClip">
            <circle cx="18" cy="18" r="14.5" />
          </clipPath>
        </defs>

        {/* 1. Tấm Bằng Tốt Nghiệp Đại học (Diploma Certificate Sheet) */}
        <g className="anim-diploma">
          <g transform="translate(24, 12) rotate(-3.5)">
            {/* Lớp nền bằng đại học trắng ngà */}
            <rect
              x="0"
              y="0"
              width="84"
              height="64"
              rx="5"
              fill="#FFFFFF"
              stroke="#94A3B8"
              strokeWidth="1.8"
            />

            {/* Khung viền chỉ xanh DNC bên trong */}
            <rect
              x="4.5"
              y="4.5"
              width="75"
              height="55"
              rx="3.5"
              fill="#F8FAFC"
              stroke="#60A5FA"
              strokeWidth="1.2"
              strokeDasharray="3 2"
            />

            {/* Dải ruy băng xanh góc đỉnh bằng */}
            <path d="M0 11L11 0H19L0 19V11Z" fill="#2563EB" />

            {/* Các dòng chữ mô phỏng nội dung văn bằng sắc nét */}
            <line x1="22" y1="14" x2="62" y2="14" stroke="#1D4ED8" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="16" y1="22" x2="68" y2="22" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
            <line x1="18" y1="30" x2="66" y2="30" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="18" y1="37" x2="54" y2="37" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="18" y1="44" x2="48" y2="44" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" />

            {/* Dấu mộc đỏ tròn chứng thực của nhà trường - Đóng cộp xác nhận */}
            <g className="anim-seal">
              <circle cx="63" cy="45" r="8" fill="#DC2626" />
              <circle cx="63" cy="45" r="6.2" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 1" />
              <path d="M60 45L62.2 47.2L66.5 42.8" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        </g>

        {/* 2. Mũ Cử nhân đại học (Mortarboard) đặt góc trái phía trước */}
        <g className="anim-cap">
          <g transform="translate(12, 60)">
            {/* Chóp mũ hình thoi */}
            <path d="M20 0L40 7L20 14L0 7L20 0Z" fill="#1E3A8A" />
            {/* Thân mũ bên dưới */}
            <path d="M9 10.5V16C9 19.5 31 19.5 31 16V10.5L20 14.5L9 10.5Z" fill="#172554" />
            {/* Nút đính tua rua */}
            <circle cx="20" cy="7" r="1.8" fill="#D97706" />
            {/* Dải tua rua vàng kim thả xuống */}
            <path d="M20 7C20 11 11 12 10 18" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="10" cy="19.5" r="1.8" fill="#D97706" />
          </g>
        </g>

        {/* 3. Kính Lúp Tra Cứu (Magnifying Glass) - LƯỚT TỚI SOI VĂN BẰNG */}
        <g className="anim-lens">
          <g transform="translate(58, 16) rotate(14)" filter="url(#lensDeepShadow)">
            {/* Cán cầm kính lúp kim loại */}
            <path
              d="M34 34L50 50"
              stroke="#475569"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M34 34L50 50"
              stroke="#0284C7"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Vành kính lúp xanh dương thương hiệu DNC */}
            <circle
              cx="18"
              cy="18"
              r="18"
              fill="#FFFFFF"
              stroke="#1D4ED8"
              strokeWidth="3.8"
            />

            {/* Mặt kính thủy tinh xanh ngọc trong trẻo */}
            <circle
              cx="18"
              cy="18"
              r="14.5"
              fill="#DBEAFE"
              fillOpacity="0.85"
            />

            {/* Vệt sáng lướt qua mặt kính (Glass Glint Sweep Animation) */}
            <g clipPath="url(#lensGlassClip)">
              <rect
                x="-10"
                y="-10"
                width="56"
                height="56"
                fill="url(#lensShineSweep)"
                className="anim-shine"
              />
            </g>

            {/* Vệt sáng cong viền trong mặt kính */}
            <path
              d="M10 12C13 8 18 7 24 10"
              stroke="#60A5FA"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Dấu tích xanh lục ngọc nảy bung xác thực (Checkmark Pop Animation) */}
            <g className="anim-check">
              <path
                filter="url(#glowGreen)"
                d="M13 18L17 22L24 14"
                stroke="#059669"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
