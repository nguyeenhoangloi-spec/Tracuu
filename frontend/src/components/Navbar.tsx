'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUp } from 'lucide-react';

interface NavbarProps {
  activeTab: 'vanbang' | 'cntt' | 'vstep';
  onTabChange: (tab: 'vanbang' | 'cntt' | 'vstep') => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Refs cho các tab header chính
  const vanbangRef = useRef<HTMLButtonElement | null>(null);
  const cnttRef = useRef<HTMLButtonElement | null>(null);
  const vstepRef = useRef<HTMLButtonElement | null>(null);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastToggleTimeRef = useRef<number>(0);

  const handleToggleMobileMenu = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const now = Date.now();
    // Ngăn chặn hiện tượng double-trigger / ghost-click do touchstart và click liên tiếp trên mobile
    if (now - lastToggleTimeRef.current < 280) {
      return;
    }
    lastToggleTimeRef.current = now;
    setMobileMenuOpen((prev) => !prev);
  };

  // Refs cho 3 tab trong Thanh Viên Thuốc (Floating Pill)
  const pillVanbangRef = useRef<HTMLButtonElement | null>(null);
  const pillCnttRef = useRef<HTMLButtonElement | null>(null);
  const pillVstepRef = useRef<HTMLButtonElement | null>(null);

  const [sliderStyle, setSliderStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [pillSliderStyle, setPillSliderStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [isInitialMount, setIsInitialMount] = useState(true);

  const getTabElement = (tab: 'vanbang' | 'cntt' | 'vstep') => {
    if (tab === 'vanbang') return vanbangRef.current;
    if (tab === 'cntt') return cnttRef.current;
    if (tab === 'vstep') return vstepRef.current;
    return null;
  };

  const getPillTabElement = (tab: 'vanbang' | 'cntt' | 'vstep') => {
    if (tab === 'vanbang') return pillVanbangRef.current;
    if (tab === 'cntt') return pillCnttRef.current;
    if (tab === 'vstep') return pillVstepRef.current;
    return null;
  };

  const updateSliders = (tab?: 'vanbang' | 'cntt' | 'vstep') => {
    const targetTab = tab || activeTab;

    const targetEl = getTabElement(targetTab);
    if (targetEl) {
      setSliderStyle({
        left: targetEl.offsetLeft,
        width: targetEl.offsetWidth,
        opacity: 1,
      });
    }

    const pillEl = getPillTabElement(targetTab);
    if (pillEl) {
      setPillSliderStyle({
        left: pillEl.offsetLeft,
        width: pillEl.offsetWidth,
        opacity: 1,
      });
    }
  };

  useEffect(() => {
    updateSliders(activeTab);
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        updateSliders(activeTab);
      });
    }
    const timer = setTimeout(() => {
      updateSliders(activeTab);
      setIsInitialMount(false);
    }, 70);
    const handleResize = () => updateSliders(activeTab);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTab]);

  useEffect(() => {
    if (isScrolled) {
      // Đảm bảo cập nhật vị trí thanh trượt đỏ khi thanh viên thuốc xuất hiện
      const timer = setTimeout(() => updateSliders(activeTab), 40);
      return () => clearTimeout(timer);
    }
  }, [isScrolled, activeTab]);

  const handleTabClick = (tab: 'vanbang' | 'cntt' | 'vstep') => {
    updateSliders(tab);
    onTabChange(tab);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sy = typeof window !== 'undefined' ? (window.scrollY || document.documentElement.scrollTop || 0) : 0;
      setIsScrolled((prev) => {
        const next = !prev ? sy > 95 : sy > 55;
        if (next !== prev && next) {
          setMobileMenuOpen(false);
        }
        return next;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Đóng menu khi bấm ra ngoài hoặc nhấn phím Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      // Nếu vừa mới bấm nút toggle (trong vòng 300ms) thì không can thiệp
      if (Date.now() - lastToggleTimeRef.current < 300) {
        return;
      }

      const target = e.target as Node;
      if (!target) return;

      // Nếu bấm vào nút toggle (hoặc icon/con bên trong nút) thì để nút tự xử lý
      if (
        toggleBtnRef.current &&
        (toggleBtnRef.current === target || toggleBtnRef.current.contains(target))
      ) {
        return;
      }

      // Nếu bấm ngoài menu container thì mới đóng menu
      if (menuContainerRef.current && !menuContainerRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[55] no-print antialiased pointer-events-none">
      {/* 1. THANH TOP BAR ĐẦY ĐỦ Ở ĐẦU TRANG: NỀN TRẮNG TINH THANH LỊCH (CHUẨN TRƯỜNG ĐH NAM CẦN THƠ) */}
      <div
        className={`w-full relative z-[60] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border-b border-slate-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)] ${
          !isScrolled
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="max-w-[1590px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[64px] lg:h-[72px]">
            {/* Cột 1 (Trái): Logo trường */}
            <div className="flex-1 flex items-center justify-start">
              <Link href="/" className="flex-shrink-0 flex items-center py-1 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://nctu.edu.vn/images/png/logo_truong_3.png"
                  alt="Nam Can Tho University"
                  className="w-auto h-[38px] lg:h-[46px] object-contain transition-all duration-200 group-hover:opacity-95"
                />
              </Link>
            </div>

            {/* Cột 2 (Giữa): Phân hệ tra cứu dạng menu phẳng thanh lịch chuẩn Đại học */}
            <nav className="hidden lg:flex items-center gap-1 h-11 my-auto relative font-google-sans">
              {/* Thanh gạch đỏ lướt mượt mà chuẩn 3px cố định - neo chuẩn left: 0 */}
              <div
                className="absolute left-0 bottom-0 h-[3px] rounded-none pointer-events-none"
                style={{
                  left: 0,
                  transform: `translate3d(${sliderStyle.left}px, 0, 0)`,
                  width: `${sliderStyle.width}px`,
                  opacity: sliderStyle.opacity,
                  backgroundColor: '#D72134',
                  boxShadow: '0 2px 8px rgba(215, 33, 52, 0.4)',
                  transition: isInitialMount
                    ? 'opacity 200ms ease'
                    : 'transform 360ms cubic-bezier(0.25, 1, 0.5, 1), width 360ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms ease',
                  willChange: 'transform, width',
                }}
              />

              <button
                ref={vanbangRef}
                type="button"
                data-ripple="rgba(215, 33, 52, 0.22)"
                onClick={() => handleTabClick('vanbang')}
                className={`h-full flex items-center px-4 transition-colors duration-200 cursor-pointer select-none relative overflow-hidden text-[17px] lg:text-[18px] tracking-[-0.01em] outline-none focus:outline-none ring-0 font-google-sans font-semibold rounded-none ${
                  activeTab === 'vanbang'
                    ? 'text-[#D72134]'
                    : 'text-slate-700 hover:text-[#D72134] hover:bg-slate-50'
                }`}
              >
                <span className="font-google-sans relative z-10">
                  Văn bằng tốt nghiệp
                </span>
              </button>

              <button
                ref={cnttRef}
                type="button"
                data-ripple="rgba(215, 33, 52, 0.22)"
                onClick={() => handleTabClick('cntt')}
                className={`h-full flex items-center px-4 transition-colors duration-200 cursor-pointer select-none relative overflow-hidden text-[17px] lg:text-[18px] tracking-[-0.01em] outline-none focus:outline-none ring-0 font-google-sans font-semibold rounded-none ${
                  activeTab === 'cntt'
                    ? 'text-[#D72134]'
                    : 'text-slate-700 hover:text-[#D72134] hover:bg-slate-50'
                }`}
              >
                <span className="font-google-sans relative z-10">
                  Chứng chỉ CNTT
                </span>
              </button>

              <button
                ref={vstepRef}
                type="button"
                data-ripple="rgba(215, 33, 52, 0.22)"
                onClick={() => handleTabClick('vstep')}
                className={`h-full flex items-center px-4 transition-colors duration-200 cursor-pointer select-none relative overflow-hidden text-[17px] lg:text-[18px] tracking-[-0.01em] outline-none focus:outline-none ring-0 font-google-sans font-semibold rounded-none ${
                  activeTab === 'vstep'
                    ? 'text-[#D72134]'
                    : 'text-slate-700 hover:text-[#D72134] hover:bg-slate-50'
                }`}
              >
                <span className="font-google-sans relative z-10">
                  Chứng chỉ VSTEP
                </span>
              </button>
            </nav>

            {/* Cột 3 (Phải): Khoảng đệm cân bằng đối xứng giúp Menu luôn nằm chính giữa tuyệt đối */}
            <div className="hidden lg:flex flex-1 items-center justify-end" />

            {/* Mobile & Tablet hamburger */}
            <div className="flex lg:hidden">
              <button
                ref={toggleBtnRef}
                type="button"
                onClick={handleToggleMobileMenu}
                onPointerDown={(e) => e.stopPropagation()}
                className="p-2 rounded-xl transition-all duration-200 outline-none focus:outline-none ring-0 border-0 border-none select-none text-slate-700 hover:text-[#D72134] active:bg-slate-100"
                style={{
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
                aria-label="Toggle Navigation"
              >
                <div className="relative w-6 h-6 flex items-center justify-center pointer-events-none">
                  <Menu
                    className={`w-6 h-6 stroke-[2.2] absolute transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      mobileMenuOpen
                        ? 'opacity-0 rotate-90 scale-75'
                        : 'opacity-100 rotate-0 scale-100'
                    }`}
                  />
                  <X
                    className={`w-6 h-6 stroke-[2.2] absolute transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      mobileMenuOpen
                        ? 'opacity-100 rotate-0 scale-100'
                        : 'opacity-0 -rotate-90 scale-75'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THANH VIÊN THUỐC CỐ ĐỊNH (FLOATING PILL NAVIGATION): DỜI LÊN ĐẦU TRANG (DYNAMIC ISLAND) CHO CẢ MOBILE & DESKTOP (KHÔNG CHE NÚT TRA CỨU) */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-[55] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] top-[calc(0.75rem+env(safe-area-inset-top,0px))] sm:top-4 lg:top-5 ${
          isScrolled
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-y-8 scale-[0.94] pointer-events-none'
        }`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div
          className="inline-flex items-center p-1 sm:p-1.5 rounded-full bg-white/94 backdrop-blur-2xl border border-slate-200/90 shadow-[0_12px_40px_rgba(15,23,42,0.18),0_2px_8px_rgba(15,23,42,0.06),inset_0_1px_0_0_rgba(255,255,255,0.95)] max-w-[calc(100vw-20px)]"
          style={{
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            backdropFilter: 'blur(24px) saturate(180%)',
          }}
        >
          {/* 3 Tabs trong Viên Thuốc với Thanh trượt đỏ di chuyển mượt mà */}
          <div className="relative flex items-center p-0.5 rounded-full bg-slate-100/90">
            {/* Animated Red Pill Indicator */}
            <div
              className="absolute left-0 top-0.5 bottom-0.5 rounded-full bg-[#D72134] shadow-[0_2px_8px_rgba(215,33,52,0.38)] pointer-events-none"
              style={{
                left: 0,
                transform: `translate3d(${pillSliderStyle.left}px, 0, 0)`,
                width: `${pillSliderStyle.width}px`,
                opacity: pillSliderStyle.opacity,
                transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), width 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 250ms ease',
                willChange: 'transform, width',
              }}
            />

            <button
              ref={pillVanbangRef}
              type="button"
              data-ripple={activeTab === 'vanbang' ? 'rgba(255, 255, 255, 0.35)' : 'rgba(215, 33, 52, 0.22)'}
              onClick={() => handleTabClick('vanbang')}
              className={`relative overflow-hidden z-10 px-3.5 min-[390px]:px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[16px] sm:text-[18px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer select-none outline-none font-google-sans whitespace-nowrap ${
                activeTab === 'vanbang' ? 'text-white' : 'text-slate-700 hover:text-[#D72134]'
              }`}
            >
              <span className="hidden sm:inline relative z-10">Văn bằng tốt nghiệp</span>
              <span className="sm:hidden relative z-10">Văn bằng</span>
            </button>

            <button
              ref={pillCnttRef}
              type="button"
              data-ripple={activeTab === 'cntt' ? 'rgba(255, 255, 255, 0.35)' : 'rgba(215, 33, 52, 0.22)'}
              onClick={() => handleTabClick('cntt')}
              className={`relative overflow-hidden z-10 px-3.5 min-[390px]:px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[16px] sm:text-[18px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer select-none outline-none font-google-sans whitespace-nowrap ${
                activeTab === 'cntt' ? 'text-white' : 'text-slate-700 hover:text-[#D72134]'
              }`}
            >
              <span className="hidden sm:inline relative z-10">Chứng chỉ CNTT</span>
              <span className="sm:hidden relative z-10">CNTT</span>
            </button>

            <button
              ref={pillVstepRef}
              type="button"
              data-ripple={activeTab === 'vstep' ? 'rgba(255, 255, 255, 0.35)' : 'rgba(215, 33, 52, 0.22)'}
              onClick={() => handleTabClick('vstep')}
              className={`relative overflow-hidden z-10 px-3.5 min-[390px]:px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[16px] sm:text-[18px] font-semibold tracking-[-0.01em] transition-colors duration-200 cursor-pointer select-none outline-none font-google-sans whitespace-nowrap ${
                activeTab === 'vstep' ? 'text-white' : 'text-slate-700 hover:text-[#D72134]'
              }`}
            >
              <span className="hidden sm:inline relative z-10">Chứng chỉ VSTEP</span>
              <span className="sm:hidden relative z-10">VSTEP</span>
            </button>
          </div>

          {/* Nút mũi tên cuộn lên đầu trang (Desktop) */}
          <div className="hidden lg:flex items-center pl-1 pr-1 shrink-0">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-200/80 text-slate-600 hover:text-[#D72134] transition-colors cursor-pointer outline-none"
              title="Cuộn lên đầu trang"
            >
              <ArrowUp className="w-5 h-5 stroke-[2.4]" />
            </button>
          </div>
        </div>
      </div>


      {/* MOBILE & TABLET FLOATING DROPDOWN CARD: NẰM NGOÀI ĐỘC LẬP DƯỚI HEADER, KÍNH MỜ TRONG SUỐT FROSTED GLASS */}
      <div className={`w-full max-w-[1590px] mx-auto relative ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Lớp mờ nền (Backdrop) khi mở menu trên Mobile: Fade in / Fade out mượt mà, Bấm ra ngoài để đóng */}
        <div
          className={`fixed inset-0 bg-slate-950/40 backdrop-blur-[4px] z-40 lg:hidden transition-all ease-out ${
            mobileMenuOpen
              ? 'opacity-100 pointer-events-auto duration-350'
              : 'opacity-0 pointer-events-none duration-280'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            const now = Date.now();
            if (now - lastToggleTimeRef.current < 280) return;
            lastToggleTimeRef.current = now;
            setMobileMenuOpen(false);
          }}
          aria-hidden="true"
        />

        {/* Card menu: Nền kính mờ sang trọng, chuyển động mở ra thu lại mượt mà êm ái tuyệt đối chuẩn Apple */}
        <div
          ref={menuContainerRef}
          className={`relative z-50 lg:hidden p-3.5 space-y-2 font-google-sans rounded-2xl mx-3 mt-2 backdrop-blur-2xl bg-gradient-to-b from-[rgba(14,59,117,0.92)] via-[rgba(24,78,144,0.85)] to-[rgba(255,255,255,0.96)] text-slate-900 border border-white/40 shadow-[0_24px_60px_-10px_rgba(15,23,42,0.35)] ${
            mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          style={{
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            transformOrigin: 'top right',
            transform: mobileMenuOpen
              ? 'translate3d(0, 0, 0) scale(1)'
              : 'translate3d(0, -18px, 0) scale(0.95)',
            opacity: mobileMenuOpen ? 1 : 0,
            visibility: mobileMenuOpen ? 'visible' : 'hidden',
            transition: mobileMenuOpen
              ? 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1), opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear 0s'
              : 'transform 300ms cubic-bezier(0.25, 1, 0.5, 1), opacity 240ms cubic-bezier(0.25, 1, 0.5, 1), visibility 0s linear 300ms',
            willChange: 'transform, opacity',
          }}
        >
          {/* PHẦN 1: PHÂN HỆ TRA CỨU (CHỮ TRẮNG RÕ NÉT, TAB ĐANG CHỌN NỀN TRẮNG CHỮ ĐỎ) */}
          <div className="pb-2.5 mb-2 border-b border-white/20 space-y-1">
            <span className="block text-[11.5px] font-bold uppercase tracking-wider px-3.5 text-blue-100/90 font-google-sans">
              Phân hệ tra cứu
            </span>

            {/* Tab 1: Văn bằng tốt nghiệp */}
            <button
              type="button"
              data-ripple={activeTab === 'vanbang' ? 'rgba(215, 33, 52, 0.18)' : 'rgba(255, 255, 255, 0.22)'}
              onClick={() => {
                handleTabClick('vanbang');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left relative overflow-hidden px-3.5 py-2.5 rounded-xl text-[16px] font-google-sans font-bold transition-colors outline-none cursor-pointer active:scale-[0.98] select-none ${
                activeTab === 'vanbang'
                  ? 'bg-white text-[#D72134] shadow-sm'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
            >
              <span className="relative z-10 pointer-events-none">Văn bằng tốt nghiệp</span>
            </button>

            {/* Tab 2: CNTT */}
            <button
              type="button"
              data-ripple={activeTab === 'cntt' ? 'rgba(215, 33, 52, 0.18)' : 'rgba(255, 255, 255, 0.22)'}
              onClick={() => {
                handleTabClick('cntt');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left relative overflow-hidden px-3.5 py-2.5 rounded-xl text-[16px] font-google-sans font-bold transition-colors outline-none cursor-pointer active:scale-[0.98] select-none ${
                activeTab === 'cntt'
                  ? 'bg-white text-[#D72134] shadow-sm'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
            >
              <span className="relative z-10 pointer-events-none">Chứng chỉ CNTT</span>
            </button>

            {/* Tab 3: VSTEP */}
            <button
              type="button"
              data-ripple={activeTab === 'vstep' ? 'rgba(215, 33, 52, 0.18)' : 'rgba(255, 255, 255, 0.22)'}
              onClick={() => {
                handleTabClick('vstep');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left relative overflow-hidden px-3.5 py-2.5 rounded-xl text-[16px] font-google-sans font-bold transition-colors outline-none cursor-pointer active:scale-[0.98] select-none ${
                activeTab === 'vstep'
                  ? 'bg-white text-[#D72134] shadow-sm'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
            >
              <span className="relative z-10 pointer-events-none">Chứng chỉ VSTEP</span>
            </button>
          </div>

          {/* PHẦN 2: 4 LIÊN KẾT CỔNG THÔNG TIN (CHỮ PHẲNG THANH LỊCH, KHÔNG ĐÓNG KHUNG, CHẠM KHÔNG BỊ VIỀN ĐEN) */}
          <div className="space-y-1">
            <a
              href="https://www.nctu.edu.vn/"
              target="_blank"
              rel="noreferrer"
              data-ripple="rgba(215, 33, 52, 0.15)"
              className="block relative overflow-hidden px-3.5 py-2.5 text-[16px] font-google-sans font-semibold rounded-xl text-slate-800 hover:text-[#D72134] hover:bg-red-50/70 active:scale-[0.98] transition-all outline-none select-none"
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
            >
              <span className="relative z-10 pointer-events-none">Trang chủ</span>
            </a>

            <a
              href="https://nctu.edu.vn/trang-sinh-vien"
              target="_blank"
              rel="noreferrer"
              data-ripple="rgba(215, 33, 52, 0.15)"
              className="block relative overflow-hidden px-3.5 py-2.5 text-[16px] font-google-sans font-semibold rounded-xl text-slate-800 hover:text-[#D72134] hover:bg-red-50/70 active:scale-[0.98] transition-all outline-none select-none"
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
            >
              <span className="relative z-10 pointer-events-none">Cổng Sinh viên</span>
            </a>

            <a
              href="https://alumni.nctu.edu.vn/"
              target="_blank"
              rel="noreferrer"
              data-ripple="rgba(215, 33, 52, 0.15)"
              className="block relative overflow-hidden px-3.5 py-2.5 text-[16px] font-google-sans font-semibold rounded-xl text-slate-800 hover:text-[#D72134] hover:bg-red-50/70 active:scale-[0.98] transition-all outline-none select-none"
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
            >
              <span className="relative z-10 pointer-events-none">Cựu sinh viên</span>
            </a>

            <a
              href="https://nctu.edu.vn/cb-gv"
              target="_blank"
              rel="noreferrer"
              data-ripple="rgba(215, 33, 52, 0.15)"
              className="block relative overflow-hidden px-3.5 py-2.5 text-[16px] font-google-sans font-semibold rounded-xl text-slate-800 hover:text-[#D72134] hover:bg-red-50/70 active:scale-[0.98] transition-all outline-none select-none"
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
            >
              <span className="relative z-10 pointer-events-none">Cán bộ - Giảng viên</span>
            </a>
          </div>

          {/* PHẦN 3: HOTLINE CHỮ ĐỎ RÕ NÉT, KHÔNG ĐÓNG KHUNG */}
          <div className="pt-2 border-t border-slate-200/80">
            <a
              href="tel:02923798798"
              data-ripple="rgba(215, 33, 52, 0.22)"
              className="block relative overflow-hidden py-2 px-3.5 text-[16px] font-google-sans font-bold text-[#D72134] hover:text-[#b71526] hover:bg-red-50/60 rounded-xl active:scale-[0.98] transition-all outline-none select-none"
              style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
            >
              <span className="relative z-10 pointer-events-none">Hotline: (0292) 3 798 798</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

