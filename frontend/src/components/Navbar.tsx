'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  activeTab?: 'vanbang' | 'cntt' | 'vstep';
  onTabChange?: (tab: 'vanbang' | 'cntt' | 'vstep') => void;
}

interface RippleWave {
  x: number;
  y: number;
  size: number;
  id: number;
}

// ══ NÚT BẤM MENU TRÊN HEADER CÓ HIỆU ỨNG LOANG RÕ (TOUCH RIPPLE) & XOAY MƯỢT MÀ ══
function RippleIconButton({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  const [ripples, setRipples] = useState<RippleWave[]>([]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.6;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now() + Math.random();

    setRipples((prev) => [...prev, { x, y, size, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.84 }}
      onPointerDown={handlePointerDown}
      onClick={onClick}
      className={`relative overflow-hidden p-2 rounded-full bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent transition-colors cursor-pointer outline-none border-none select-none [-webkit-tap-highlight-color:transparent] ${
        isOpen ? 'text-[#EC1E24]' : 'text-[#3C3C3C] hover:text-[#EC1E24]'
      }`}
      aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.div
            key="close-icon"
            initial={{ rotate: -90, opacity: 0, scale: 0.75 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10"
          >
            <X className="w-6 h-6 stroke-[2.3]" />
          </motion.div>
        ) : (
          <motion.div
            key="menu-icon"
            initial={{ rotate: 90, opacity: 0, scale: 0.75 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10"
          >
            <Menu className="w-6 h-6 stroke-[2.3]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sóng nước loang từ vị trí bấm ngón tay trên nút Menu */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full pointer-events-none animate-ripple z-0"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            backgroundColor: 'rgba(236, 30, 36, 0.32)',
          }}
        />
      ))}
    </motion.button>
  );
}

// ══ COMPONENT LIÊN KẾT CÓ HIỆU ỨNG NHẤN LOANG SÓNG NƯỚC RÕ RÀNG (VISIBLE RIPPLE EFFECT) ══
function RippleLink({
  href,
  children,
  onClick,
  className = '',
  isExternal = false,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isExternal?: boolean;
}) {
  const [ripples, setRipples] = useState<RippleWave[]>([]);

  const handlePointerDown = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.4;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now() + Math.random();

    setRipples((prev) => [...prev, { x, y, size, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  const handleClick = () => {
    if (onClick) {
      setTimeout(onClick, 180);
    }
  };

  const sharedProps = {
    onPointerDown: handlePointerDown,
    onClick: handleClick,
    className: `relative overflow-hidden block py-2 px-3 sm:py-2.5 sm:px-3.5 rounded-xl whitespace-nowrap transition-colors duration-150 active:bg-red-50/70 cursor-pointer select-none outline-none focus:outline-none not-italic [-webkit-tap-highlight-color:transparent] ${className}`,
  };

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...sharedProps}>
        <span className="relative z-10">{children}</span>
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute rounded-full pointer-events-none animate-ripple z-0"
            style={{
              left: r.x,
              top: r.y,
              width: r.size,
              height: r.size,
              backgroundColor: 'rgba(236, 30, 36, 0.32)',
            }}
          />
        ))}
      </a>
    );
  }

  return (
    <Link href={href} {...sharedProps}>
      <span className="relative z-10">{children}</span>
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full pointer-events-none animate-ripple z-0"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            backgroundColor: 'rgba(236, 30, 36, 0.32)',
          }}
        />
      ))}
    </Link>
  );
}

export default function Navbar({ activeTab = 'vanbang', onTabChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Đóng Popup khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 left-0 right-0 w-full z-50 no-print antialiased select-none bg-white border-0 border-none shadow-none">
      <div className="max-w-[1430px] mx-auto px-3.5 sm:px-6 relative">
        <div className="flex items-center justify-between gap-3 sm:gap-6 h-[58px] sm:h-[68px] lg:h-[76px]">
          
          {/* LOGO TRƯỜNG: CO GIÃN THÔNG MINH, KHÔNG BAO GIỜ TRÀN MÀN HÌNH HOẶC BỊ NHẢY KÍCH THƯỚC KHI TẢI TRANG */}
          <Link
            href="/"
            className="flex items-center select-none shrink-0 h-[36px] min-[400px]:h-[40px] sm:h-[50px] lg:h-[56px] overflow-hidden"
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '56px',
              maxHeight: '56px',
              overflow: 'hidden',
            }}
            title="Trường Đại học Nam Cần Thơ"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo_truong_3.png"
              alt="Trường Đại học Nam Cần Thơ"
              width={193}
              height={56}
              style={{
                height: '56px',
                maxHeight: '56px',
                width: 'auto',
                aspectRatio: '1920/558',
              }}
              className="w-auto h-[36px] min-[400px]:h-[40px] sm:h-[50px] lg:h-[56px] max-w-[180px] min-[400px]:max-w-[210px] sm:max-w-none object-contain"
            />
          </Link>

          {/* MENU LIÊN KẾT TRẢI NGANG TRÊN DESKTOP (CỠ CHỮ 18PX, FONT HỆ THỐNG, CHỮ ĐỨNG THẲNG, ĐỘ ĐẬM FONT-MEDIUM RÕ NÉT) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[18px] font-sans">
            <a
              href="https://www.nctu.edu.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#1A1A1A] hover:text-[#EC1E24] transition-colors py-1 cursor-pointer select-none outline-none focus:outline-none not-italic"
            >
              Trang chủ
            </a>

            <Link
              href="/"
              className="font-bold text-[#EC1E24] py-1 cursor-pointer select-none relative outline-none focus:outline-none not-italic"
              title="Cổng tra cứu văn bằng & chứng chỉ điện tử"
            >
              <span>Tra cứu</span>
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#EC1E24] rounded-full" />
            </Link>

            <a
              href="https://nctu.edu.vn/trang-sinh-vien"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#1A1A1A] hover:text-[#EC1E24] transition-colors py-1 cursor-pointer select-none outline-none focus:outline-none not-italic"
            >
              Sinh viên
            </a>

            <a
              href="https://alumni.nctu.edu.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#1A1A1A] hover:text-[#EC1E24] transition-colors py-1 cursor-pointer select-none outline-none focus:outline-none not-italic"
            >
              Cựu sinh viên
            </a>

            <a
              href="https://nctu.edu.vn/cb-gv"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#1A1A1A] hover:text-[#EC1E24] transition-colors py-1 cursor-pointer select-none outline-none focus:outline-none not-italic"
            >
              CB-GV
            </a>

            <a
              href="https://vr360.nctu.edu.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#1A1A1A] hover:text-[#EC1E24] transition-colors py-1 cursor-pointer select-none outline-none focus:outline-none not-italic"
            >
              Tham quan trường
            </a>
          </nav>

          {/* CỤM NÚT MENU TRÊN MOBILE/TABLET: NÚT TRONG SUỐT, LOANG RÕ TỪ TÂM KHI NHẤN */}
          <div className="lg:hidden flex items-center shrink-0">
            <RippleIconButton
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>

        </div>

        {/* ══ POPUP MENU NỔI: CHUYỂN ĐỘNG MỞ & ĐÓNG SIÊU MƯỢT MÀ CHUẨN APPLE FLUID MOTION ══ */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Lớp nền mờ bắt sự kiện click ra ngoài để đóng êm ái */}
              <motion.div
                key="popup-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
                className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[2px] lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Chiếc Popup Card nổi: MỞ RA BUNG NỞ VÀ THU LẠI SIÊU MƯỢT TỪ NÚT MENU */}
              <motion.div
                ref={popupRef}
                key="mobile-popup-menu"
                initial={{ opacity: 0, scale: 0.85, y: -12 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1], // Chuẩn Apple Fluid Curve: mở bung êm ru, lướt nhẹ không rung
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.86,
                  y: -10,
                  transition: {
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1], // Thu gọn mượt mà về góc nút menu
                  },
                }}
                style={{
                  transformOrigin: 'top right',
                  willChange: 'transform, opacity',
                }}
                className="absolute top-[calc(100%+8px)] right-3 sm:right-6 w-max min-w-[315px] max-w-[calc(100vw-24px)] bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_55px_-10px_rgba(0,0,0,0.22),0_8px_20px_-6px_rgba(0,0,0,0.08)] border border-slate-100 p-3 sm:p-3.5 z-50 lg:hidden overflow-hidden"
              >
                {/* Nội dung 6 mục link hiển thị thanh lịch, chữ nét căng 100% */}
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: 0.04, ease: 'easeOut' }}
                  className="grid grid-cols-2 gap-x-4 gap-y-1 text-[16px] min-[380px]:text-[17px] font-sans"
                >
                  {/* Cột 1: Đúng 3 mục gốc */}
                  <div className="flex flex-col space-y-0.5">
                    <RippleLink
                      href="https://www.nctu.edu.vn/"
                      isExternal
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-medium text-[#1A1A1A] hover:text-[#EC1E24]"
                    >
                      Trang chủ
                    </RippleLink>

                    <RippleLink
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-bold text-[#EC1E24]"
                    >
                      Tra cứu
                    </RippleLink>

                    <RippleLink
                      href="https://nctu.edu.vn/cb-gv"
                      isExternal
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-medium text-[#1A1A1A] hover:text-[#EC1E24]"
                    >
                      CB-GV
                    </RippleLink>
                  </div>

                  {/* Cột 2: Đúng 3 mục gốc */}
                  <div className="flex flex-col space-y-0.5">
                    <RippleLink
                      href="https://nctu.edu.vn/trang-sinh-vien"
                      isExternal
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-medium text-[#1A1A1A] hover:text-[#EC1E24]"
                    >
                      Sinh viên
                    </RippleLink>

                    <RippleLink
                      href="https://alumni.nctu.edu.vn/"
                      isExternal
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-medium text-[#1A1A1A] hover:text-[#EC1E24]"
                    >
                      Cựu sinh viên
                    </RippleLink>

                    <RippleLink
                      href="https://vr360.nctu.edu.vn/"
                      isExternal
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-medium text-[#1A1A1A] hover:text-[#EC1E24]"
                    >
                      Tham quan trường
                    </RippleLink>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
}
