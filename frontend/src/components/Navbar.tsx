'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

interface NavbarProps {
  activeTab?: 'vanbang' | 'cntt' | 'vstep';
  onTabChange?: (tab: 'vanbang' | 'cntt' | 'vstep') => void;
}

// ══ NÚT BẤM MENU TRÊN HEADER: 2 THANH GẠCH BIẾN HÌNH THÀNH DẤU X ĐỒNG BỘ ZERO-LATENCY CHUẨN APPLE ══
function AppleMenuButton({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      className="relative w-10 h-10 flex items-center justify-center rounded-full bg-transparent cursor-pointer outline-none border-none select-none [-webkit-tap-highlight-color:transparent]"
      aria-label={isOpen ? 'Đóng menu' : 'Mở menu'}
    >
      <div className="relative w-[21px] h-[13px] flex flex-col justify-between items-center pointer-events-none">
        {/* Thanh gạch trên: khi mở trượt xuống 5.5px và xoay 45 độ */}
        <motion.span
          animate={
            isOpen
              ? { y: 5.5, rotate: 45, backgroundColor: '#EC1E24' }
              : { y: 0, rotate: 0, backgroundColor: '#1d1d1f' }
          }
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[2px] rounded-full origin-center block"
        />
        {/* Thanh gạch dưới: khi mở trượt lên -5.5px và xoay -45 độ */}
        <motion.span
          animate={
            isOpen
              ? { y: -5.5, rotate: -45, backgroundColor: '#EC1E24' }
              : { y: 0, rotate: 0, backgroundColor: '#1d1d1f' }
          }
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[2px] rounded-full origin-center block"
        />
      </div>
    </motion.button>
  );
}

const NAV_LINKS = [
  { name: 'Trang chủ', href: 'https://www.nctu.edu.vn/', isExternal: true },
  { name: 'Tra cứu', href: '/', isExternal: false, isCurrent: true },
  { name: 'Sinh viên', href: 'https://nctu.edu.vn/trang-sinh-vien', isExternal: true },
  { name: 'Cựu sinh viên', href: 'https://alumni.nctu.edu.vn/', isExternal: true },
  { name: 'CB-GV', href: 'https://nctu.edu.vn/cb-gv', isExternal: true },
  { name: 'Tham quan trường', href: 'https://vr360.nctu.edu.vn/', isExternal: true },
];

const menuListVariants: Variants = {
  open: {
    transition: { staggerChildren: 0.05, delayChildren: 0.06 },
  },
  closed: {
    transition: { staggerChildren: 0.025, staggerDirection: -1 },
  },
};

const menuItemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: [0.16, 1, 0.3, 1], // Chuẩn Apple WWDC Fluid Curve: đồng bộ chuyển động xuôi chiều mượt mà
    },
  },
  closed: {
    opacity: 0,
    y: -16,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export default function Navbar({ activeTab = 'vanbang', onTabChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Theo dõi hướng cuộn trang siêu nhạy (Wheel + Touch + Scroll): Bắt ngay cử chỉ cuộn lên/xuống tức thì
  useEffect(() => {
    let ticking = false;
    let touchStartY = 0;

    // Bỏ qua cử chỉ nếu sự kiện phát sinh từ bên trong một container cuộn nội bộ (Spotlight, popover, modal,...)
    const isInsideScrollableContainer = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof Element)) return false;

      // 1. Kiểm tra nhanh các container nội bộ đặc thù
      if (
        target.closest(
          '#floodlight-panel, [data-spotlight-body], #spotlight-bar-root, #spotlight-window, .lbi-popover-shell, [role="dialog"], [role="listbox"], [role="menu"], .custom-scrollbar, #omninotch-overlay, .certificate-card'
        )
      ) {
        return true;
      }

      // 2. Duyệt ngược cây DOM tìm phần tử cha có overflow-y: auto hoặc scroll
      let el: Element | null = target;
      while (el && el !== document.body && el !== document.documentElement) {
        if (
          el.classList.contains('overflow-y-auto') ||
          el.classList.contains('overflow-auto') ||
          el.classList.contains('overflow-y-scroll') ||
          el.classList.contains('overflow-scroll')
        ) {
          return true;
        }

        const style = window.getComputedStyle(el);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          return true;
        }
        el = el.parentElement;
      }

      return false;
    };

    const handleScroll = (e?: Event) => {
      if (e && e.target && e.target !== document && e.target !== window) {
        return;
      }
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Luôn hiện khi ở gần đỉnh trang
          if (currentScrollY <= 25) {
            setHeaderVisible(true);
          } else if (currentScrollY > lastScrollYRef.current + 5) {
            // Đang cuộn xuống > 5px -> Cuộn né (ẩn) Header
            setHeaderVisible(false);
          } else if (currentScrollY < lastScrollYRef.current - 2) {
            // Đang cuộn lên dù chỉ 2px -> Lập tức hiện lại Header
            setHeaderVisible(true);
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    // Bắt ngay cử chỉ lăn chuột (Mouse / Trackpad) cực nhạy
    const handleWheel = (e: WheelEvent) => {
      if (isInsideScrollableContainer(e.target)) return;
      if (e.deltaY < -2) {
        setHeaderVisible(true);
      } else if (e.deltaY > 6 && window.scrollY > 40) {
        setHeaderVisible(false);
      }
    };

    // Bắt ngay cử chỉ vuốt chạm trên Mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (isInsideScrollableContainer(e.target)) {
        touchStartY = 0;
        return;
      }
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY === 0 || isInsideScrollableContainer(e.target)) return;
      if (e.touches && e.touches.length > 0) {
        const currentTouchY = e.touches[0].clientY;
        const diff = currentTouchY - touchStartY;
        if (diff > 8) {
          // Vuốt kéo xuống (cuộn lên trên) -> Hiện ngay lập tức
          setHeaderVisible(true);
        } else if (diff < -12 && window.scrollY > 50) {
          // Vuốt kéo lên (cuộn xuống dưới) -> Né ngay
          setHeaderVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Khóa cuộn trang nền tuyệt đối khi menu mobile đang mở (chuẩn iOS & Android)
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    };
  }, [mobileMenuOpen]);

  // Đóng Menu khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: headerVisible || mobileMenuOpen ? 0 : -85 }}
        transition={{
          duration: 0.24,
          ease: [0.22, 1, 0.36, 1], // Chuẩn Apple WWDC Fluid Curve: cực nhạy, lướt êm ru không giật
        }}
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
        className={`sticky top-0 w-full z-[210] no-print antialiased select-none border-none shadow-none transition-colors ${
          mobileMenuOpen ? 'bg-white' : 'bg-white/95 backdrop-blur-md'
        }`}
      >
      <div className="max-w-[1430px] mx-auto px-3.5 sm:px-6 relative">
        <div className="flex items-center justify-between gap-3 sm:gap-6 h-[58px] sm:h-[68px] lg:h-[76px]">
          
          {/* LOGO TRƯỜNG: CO GIÃN THÔNG MINH, CĂN GIỮA DỌC HOÀN HẢO */}
          <Link
            href="/"
            className="flex items-center select-none shrink-0 overflow-hidden"
            title="Trường Đại học Nam Cần Thơ"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo_truong_3.png"
              alt="Trường Đại học Nam Cần Thơ"
              width={193}
              height={56}
              className="w-auto h-[38px] min-[400px]:h-[40px] sm:h-[48px] lg:h-[54px] max-w-[185px] min-[400px]:max-w-[210px] sm:max-w-none object-contain"
            />
          </Link>

          {/* MENU LIÊN KẾT TRẢI NGANG TRÊN DESKTOP (CỠ CHỮ 18PX, FONT HỆ THỐNG, CHỮ ĐỨNG THẲNG, ĐỘ ĐẬM FONT-MEDIUM RÕ NÉT, CÓ HIỆU ỨNG RIPPLE & THANH GẠCH CỐ ĐỊNH 100%, VUÔNG GÓC ROUNDED-NONE) */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-5 text-[18px] font-sans">
            <a
              href="https://www.nctu.edu.vn/"
              target="_blank"
              rel="noopener noreferrer"
              data-ripple="rgba(236, 30, 36, 0.15)"
              className="relative px-3 py-1.5 rounded-none font-medium text-apple-text hover:text-brand-red transition-colors duration-150 cursor-pointer select-none outline-none focus:outline-none not-italic overflow-hidden hover:bg-black/[0.03]"
            >
              <span className="relative z-40">Trang chủ</span>
            </a>

            <Link
              href="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              data-ripple="rgba(236, 30, 36, 0.18)"
              className="relative px-3 py-1.5 rounded-none font-medium text-brand-red cursor-pointer select-none outline-none focus:outline-none not-italic overflow-hidden transition-colors duration-150 hover:bg-red-50/50"
              title="Cổng tra cứu văn bằng & chứng chỉ điện tử"
            >
              <span className="relative z-40">Tra cứu</span>
              {/* Thanh gạch đỏ cố định 100%, z-40 nổi bật trên ripple, vuông góc chuẩn xác */}
              <span className="absolute bottom-1 left-3 right-3 h-[1.5px] bg-brand-red rounded-none z-40 pointer-events-none" />
            </Link>

            <a
              href="https://nctu.edu.vn/trang-sinh-vien"
              target="_blank"
              rel="noopener noreferrer"
              data-ripple="rgba(236, 30, 36, 0.15)"
              className="relative px-3 py-1.5 rounded-none font-medium text-apple-text hover:text-brand-red transition-colors duration-150 cursor-pointer select-none outline-none focus:outline-none not-italic overflow-hidden hover:bg-black/[0.03]"
            >
              <span className="relative z-40">Sinh viên</span>
            </a>

            <a
              href="https://alumni.nctu.edu.vn/"
              target="_blank"
              rel="noopener noreferrer"
              data-ripple="rgba(236, 30, 36, 0.15)"
              className="relative px-3 py-1.5 rounded-none font-medium text-apple-text hover:text-brand-red transition-colors duration-150 cursor-pointer select-none outline-none focus:outline-none not-italic overflow-hidden hover:bg-black/[0.03]"
            >
              <span className="relative z-40">Cựu sinh viên</span>
            </a>

            <a
              href="https://nctu.edu.vn/cb-gv"
              target="_blank"
              rel="noopener noreferrer"
              data-ripple="rgba(236, 30, 36, 0.15)"
              className="relative px-3 py-1.5 rounded-none font-medium text-apple-text hover:text-brand-red transition-colors duration-150 cursor-pointer select-none outline-none focus:outline-none not-italic overflow-hidden hover:bg-black/[0.03]"
            >
              <span className="relative z-40">CB-GV</span>
            </a>

            <a
              href="https://vr360.nctu.edu.vn/"
              target="_blank"
              rel="noopener noreferrer"
              data-ripple="rgba(236, 30, 36, 0.15)"
              className="relative px-3 py-1.5 rounded-none font-medium text-apple-text hover:text-brand-red transition-colors duration-150 cursor-pointer select-none outline-none focus:outline-none not-italic overflow-hidden hover:bg-black/[0.03]"
            >
              <span className="relative z-40">Tham quan trường</span>
            </a>
          </nav>

          {/* CỤM NÚT MENU TRÊN MOBILE/TABLET: 2 THANH GẠCH BIẾN HÌNH MORPHING CHUẨN APPLE WWDC */}
          <div className="lg:hidden flex items-center shrink-0">
            <AppleMenuButton
              isOpen={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          </div>

        </div>
      </div>
    </motion.header>

      {/* ══ TOÀN MÀN HÌNH MOBILE MENU PHONG CÁCH APPLE: NỀN TRẮNG, TYPOGRAPHY LỚN, STAGGERED FLUID MOTION ══ */}
      {mounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                key="apple-fullscreen-menu"
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.36,
                    ease: [0.16, 1, 0.3, 1], // Chuẩn Apple WWDC Fluid Curve: bung mở đồng bộ liền mạch
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -14,
                  transition: {
                    duration: 0.22,
                    ease: [0.4, 0, 0.2, 1],
                  },
                }}
                className="fixed top-[58px] sm:top-[68px] inset-x-0 bottom-0 z-[200] bg-white text-[#1d1d1f] flex flex-col justify-between overflow-y-auto overscroll-contain touch-pan-y lg:hidden"
              >
                {/* Danh sách 6 mục liên kết phong cách Apple với chữ lớn & chuyển động so le */}
                <motion.nav
                  variants={menuListVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="px-6 min-[400px]:px-8 sm:px-10 pt-7 sm:pt-9 pb-8 flex flex-col space-y-1 sm:space-y-1.5 flex-1"
                >
                  {NAV_LINKS.map((item) => (
                    <motion.div key={item.name} variants={menuItemVariants}>
                      {item.isExternal ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-ripple="rgba(236, 30, 36, 0.15)"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`relative overflow-hidden block px-1.5 py-2 sm:py-2.5 rounded-none text-[24px] min-[390px]:text-[26px] sm:text-[30px] font-medium tracking-[-0.015em] transition-all duration-150 outline-none select-none active:scale-[0.98] [-webkit-tap-highlight-color:transparent] ${
                            item.isCurrent
                              ? 'text-[#EC1E24]'
                              : 'text-[#1d1d1f] hover:text-[#EC1E24] active:text-[#EC1E24]'
                          }`}
                        >
                          {item.name}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          data-ripple="rgba(236, 30, 36, 0.18)"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`relative overflow-hidden block px-1.5 py-2 sm:py-2.5 rounded-none text-[24px] min-[390px]:text-[26px] sm:text-[30px] font-medium tracking-[-0.015em] transition-all duration-150 outline-none select-none active:scale-[0.98] [-webkit-tap-highlight-color:transparent] ${
                            item.isCurrent
                              ? 'text-[#EC1E24]'
                              : 'text-[#1d1d1f] hover:text-[#EC1E24] active:text-[#EC1E24]'
                          }`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </motion.div>
                  ))}

                  {/* Chân menu tối giản thanh lịch: trôi nhẹ sau các mục liên kết */}
                  <motion.div
                    variants={menuItemVariants}
                    className="pt-6 sm:pt-8 mt-auto border-t border-slate-100"
                  >
                    <p className="text-[13px] text-footer-copyright font-normal">
                      Trường Đại học Nam Cần Thơ · Cổng tra cứu trực tuyến
                    </p>
                  </motion.div>
                </motion.nav>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
