'use client';

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

interface NavbarProps {
  activeTab?: 'vanbang' | 'cntt' | 'vstep';
  onTabChange?: (tab: 'vanbang' | 'cntt' | 'vstep') => void;
}

export default function Navbar({ activeTab = 'vanbang', onTabChange }: NavbarProps) {
  return (
    <header className="sticky top-0 left-0 right-0 w-full z-50 no-print antialiased select-none bg-white border-none shadow-none">
      <div className="max-w-[1430px] mx-auto px-3.5 sm:px-6">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-[58px] sm:h-[68px] lg:h-[76px]">
          
          {/* LOGO TRƯỜNG: CO GIÃN THÔNG MINH, KHÔNG BAO GIỜ TRÀN MÀN HÌNH */}
          <Link href="/" className="flex items-center select-none shrink-0" title="Trường Đại học Nam Cần Thơ">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://nctu.edu.vn/images/png/logo_truong_3.png"
              alt="Trường Đại học Nam Cần Thơ"
              className="w-auto h-[36px] min-[400px]:h-[40px] sm:h-[50px] lg:h-[56px] max-w-[180px] min-[400px]:max-w-[210px] sm:max-w-none object-contain"
            />
          </Link>

          {/* NÚT TRANG CHỦ: SHRINK-0, WHITESPACE-NOWRAP, KHÔNG BỊ TRÀN VIỀN HAY MẤT CHỮ TRÊN MỌI MÀN HÌNH */}
          <a
            href="https://www.nctu.edu.vn/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 min-[400px]:px-3.5 min-[400px]:py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#D72134] hover:bg-[#b81829] text-white text-[12.5px] min-[400px]:text-[13px] sm:text-[14.5px] font-bold shadow-[0_2px_8px_rgba(215,33,52,0.25)] hover:shadow-[0_4px_14px_rgba(215,33,52,0.35)] transition-all duration-200 cursor-pointer select-none active:scale-95"
            title="Về Trang chủ Trường Đại học Nam Cần Thơ"
          >
            <Home className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2.2] text-white shrink-0" />
            <span className="leading-none">Trang chủ</span>
          </a>

        </div>
      </div>
    </header>
  );
}
