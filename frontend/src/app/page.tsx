'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, ArrowDown, X, ArrowRight, GraduationCap, Search, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpotlightBar from '@/components/SpotlightBar';
import VanBangForm from '@/components/VanBangForm';
import CnttForm from '@/components/CnttForm';
import VstepForm from '@/components/VstepForm';
import CertificateCard from '@/components/CertificateCard';
import NotFoundResultCard from '@/components/NotFoundResultCard';
import QuickSampleWidget from '@/components/QuickSampleWidget';
import './degree-lookup.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'vanbang' | 'cntt' | 'vstep'>('vanbang');

  // Hỗ trợ link trực tiếp tab từ URL ?tab=vstep hoặc ?tab=cntt & Khởi tạo luôn ở đỉnh trang
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);

      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'vstep' || tab === 'cntt' || tab === 'vanbang') {
        setActiveTab(tab);
      }
    }
  }, []);
  const [tabDirection, setTabDirection] = useState<'right' | 'left' | 'initial'>('initial');
  const [result, setResult] = useState<any | null>(null);
  const [resultType, setResultType] = useState<'vanbang' | 'cntt' | 'vstep'>('vanbang');
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [spotlightCollapseTrigger, setSpotlightCollapseTrigger] = useState(0);
  const [spotlightState, setSpotlightState] = useState({ isOpen: false, isFormExpanded: false });

  // Kiểm tra thiết bị Mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hồ sơ mẫu được áp dụng từ Floating Widget

  // Hồ sơ mẫu được áp dụng từ Floating Widget
  const [sampleToApply, setSampleToApply] = useState<{
    tab: 'vanbang' | 'cntt' | 'vstep';
    data: any;
    ts: number;
  } | null>(null);

  // Dynamic height cho khung card ôm vừa vặn từng phân hệ (Văn bằng / CNTT / VSTEP)
  const vanbangPaneRef = useRef<HTMLDivElement | null>(null);
  const cnttPaneRef = useRef<HTMLDivElement | null>(null);
  const vstepPaneRef = useRef<HTMLDivElement | null>(null);
  const [isSwitchingTab, setIsSwitchingTab] = useState(false);
  const [switchingHeight, setSwitchingHeight] = useState<number | null>(null);
  const switchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cardSectionRef = useRef<HTMLElement | null>(null);

  const [isCardRevealed, setIsCardRevealed] = useState(true);

  useEffect(() => {
    setIsCardRevealed(true);
  }, []);

  // ══ SCROLL-REVEAL KIỂU APPLE: IntersectionObserver nhẹ, trigger 1 lần ══
  useEffect(() => {
    const els = document.querySelectorAll('.reveal-on-scroll, .reveal-scale-on-scroll');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleScrollToHero = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplySample = (sample: any) => {
    const targetTab = sample._targetTab || activeTab;
    if (targetTab !== activeTab) {
      setActiveTab(targetTab);
    }
    setSampleToApply({
      tab: targetTab,
      data: sample,
      ts: Date.now(),
    });
    if (typeof window !== 'undefined' && window.scrollY > 160) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const overlayOpenedAtRef = useRef<number>(0);

  const handleResetResult = () => {
    setIsResultVisible(false);
    setIsCardExpanded(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (Date.now() - overlayOpenedAtRef.current < 500) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    handleResetResult();
  };

  const handleGlobalReset = () => {
    setIsResetting(true);
    setResetKey((prev) => prev + 1);
    if (result) {
      handleResetResult();
    }
    setTimeout(() => setIsResetting(false), 550);
  };

  const [sampleData, setSampleData] = useState<any>({
    vanbang: [],
    cntt: [],
    vstep: [],
  });

  useEffect(() => {
    fetch('/api/tracuu/sample-data')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setSampleData(json.data);
      })
      .catch((err) => console.log('Backend sample fetch:', err));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const verifyCode = params.get('verify');
    if (!verifyCode) return;

    const raw = decodeURIComponent(verifyCode).trim();
    const clean = raw.toLowerCase();

    const vb = sampleData.vanbang?.find(
      (item: any) =>
        item.so_hieu_phoi?.toLowerCase() === clean ||
        item.id?.toLowerCase() === clean
    );
    if (vb) {
      handleLookupSuccess('vanbang', vb);
      return;
    }

    const cntt = sampleData.cntt?.find(
      (item: any) =>
        item.so_hieu_phoi?.toLowerCase() === clean ||
        item.id?.toLowerCase() === clean
    );
    if (cntt) {
      handleLookupSuccess('cntt', cntt);
      return;
    }

    const vstep = sampleData.vstep?.find(
      (item: any) =>
        item.so_hieu_phoi?.toLowerCase() === clean ||
        item.id?.toLowerCase() === clean
    );
    if (vstep) {
      handleLookupSuccess('vstep', vstep);
      return;
    }

    if (clean.includes('006026') || clean.includes('dnc/cn')) {
      handleLookupSuccess('vanbang', {
        id: 'VB-2026-DNC006026',
        loai_dao_tao: 'dh',
        ten_van_bang: 'Bằng tốt nghiệp đại học',
        ho_ten: 'DƯƠNG THỊ ANH THƯ',
        ngay_sinh: '2004-12-24',
        gioi_tinh: 'Nữ',
        nganh_dao_tao: 'Truyền thông đa phương tiện',
        xep_loai: 'Xuất sắc',
        hinh_thuc_dao_tao: 'Chính quy',
        so_vao_so: 'K10/1947',
        so_hieu_phoi: 'DNC/CN.006026',
        so_quyet_dinh: '776/QĐ-ĐHNCT',
        ngay_ban_hanh: '2026-06-23',
        nam_tot_nghiep: 2026,
        don_vi_cap: 'Trường Đại học Nam Cần Thơ',
        nguoi_ky: 'TS. Nguyễn Văn Quang - Hiệu trưởng',
        trang_thai: 'Hợp lệ',
      });
    }
  }, [sampleData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isResultVisible) {
        handleResetResult();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isResultVisible]);

  // Chặn cuộn nền bằng overscroll containment của overlay, không đổi body.style.overflow để tránh reflow giật trang
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleLookupSuccess = (type: 'vanbang' | 'cntt' | 'vstep', data: any) => {
    setResultType(type);
    setResult(data);
    overlayOpenedAtRef.current = Date.now();
    setIsResultVisible(true);
  };

  const handleLookupNotFound = (type: 'vanbang' | 'cntt' | 'vstep', notFoundData: { query?: any; message?: string }) => {
    setResultType(type);
    setResult({ notFound: true, ...notFoundData });
    overlayOpenedAtRef.current = Date.now();
    setIsResultVisible(true);
  };

  const TAB_ORDER: Record<'vanbang' | 'cntt' | 'vstep', number> = {
    vanbang: 0,
    cntt: 1,
    vstep: 2,
  };

  const handleTabChange = (tab: 'vanbang' | 'cntt' | 'vstep') => {
    if (tab === activeTab) return;

    let currentPane: HTMLDivElement | null = null;
    let nextPane: HTMLDivElement | null = null;
    if (activeTab === 'vanbang') currentPane = vanbangPaneRef.current;
    else if (activeTab === 'cntt') currentPane = cnttPaneRef.current;
    else if (activeTab === 'vstep') currentPane = vstepPaneRef.current;

    if (tab === 'vanbang') nextPane = vanbangPaneRef.current;
    else if (tab === 'cntt') nextPane = cnttPaneRef.current;
    else if (tab === 'vstep') nextPane = vstepPaneRef.current;

    const startH = currentPane?.offsetHeight || 400;
    const targetH = nextPane?.scrollHeight || startH;

    setIsSwitchingTab(true);
    setSwitchingHeight(startH);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setSwitchingHeight(targetH);
      });
    });

    const currIdx = TAB_ORDER[activeTab];
    const nextIdx = TAB_ORDER[tab];
    setTabDirection(nextIdx > currIdx ? 'right' : 'left');
    setActiveTab(tab);
    setResult(null);

    if (switchTimerRef.current) clearTimeout(switchTimerRef.current);
    switchTimerRef.current = setTimeout(() => {
      setIsSwitchingTab(false);
      setSwitchingHeight(null);
    }, 430);
  };

  return (
    <div className="degree-lookup-root min-h-screen print:min-h-0 print:h-auto flex flex-col bg-white print:bg-white text-gray-900 relative">

      {/* 1. NAVBAR CHÍNH THỨC CỦA TRƯỜNG ĐẠI HỌC NAM CẦN THƠ */}
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 2. HERO — SÂN KHẤU TRA CỨU NỀN SÁNG CHUẨN APPLE MINIMALIST */}
      <section className="degree-lookup-hero no-print">
        <div className="degree-lookup-hero__copy degree-lookup-wrap">

          {/* Tiêu đề chính */}
          <h1
            className="degree-lookup-h1 text-[32px] md:text-[64px] text-apple-text mb-1 sm:mb-2"
            style={{ color: 'var(--color-apple-text)' }}
          >
            Tra Cứu Văn Bằng
          </h1>

          {/* Phụ đề */}
          <div className="mb-3.5 sm:mb-6">
            <p className="degree-lookup-lede text-apple-text whitespace-normal sm:whitespace-nowrap" style={{ color: 'var(--color-apple-text)' }}>
              Cổng tra cứu văn bằng điện tử chính thức <br className="sm:hidden" />– Trường Đại học Nam Cần Thơ
            </p>
          </div>
        </div>

        {/* SÂN KHẤU: CHÙM SÁNG SÂN KHẤU + THANH TRA CỨU SPOTLIGHT */}
        <div className="degree-lookup-hero__stage">
          <div className="degree-lookup-stage">

            {/* Thanh tra cứu Spotlight: Nền trắng kính mờ, chữ đen */}
            <SpotlightBar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onSelectResult={handleLookupSuccess}
              onNotFound={handleLookupNotFound}
              onReset={handleGlobalReset}
              sampleData={sampleData}
              sampleToApply={sampleToApply}
              collapseTrigger={spotlightCollapseTrigger}
              onOpenStateChange={setSpotlightState}
              variant="light"
            />
          </div>
        </div>
      </section>

      {/* 3. THÔNG TIN HƯỚNG DẪN QUY TRÌNH TRA CỨU CHÍNH THỨC (BỐ CỤC MỞ, TRỰC QUAN HIỆN ĐẠI, BỀ NGANG THOÁNG ĐÃNG) */}
      <main
        id="khung-tra-cuu"
        ref={cardSectionRef}
        className="flex-1 min-h-0 no-print w-full max-w-[1140px] lg:max-w-[1180px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 sm:pb-16 select-none"
      >
        {/* Tiêu đề phân khu — scroll reveal */}
        <div className="reveal-on-scroll flex items-baseline justify-between border-b border-black/10 pb-3.5 mb-7 sm:mb-9">
          <h2 className="text-[18px] font-bold text-[#1D1D1F] tracking-tight">
            Quy trình tra cứu
          </h2>
          <span className="text-[16px] font-medium text-[#1D1D1F]">
            3 bước xác thực trực tuyến
          </span>
        </div>

        {/* 3 bước quy trình trải ngang tuần tự dạng thẻ bề mặt xám #F5F5F7 chuẩn Apple */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 relative">
          {/* Bước 1 */}
          <div className="reveal-scale-on-scroll reveal-d1 group flex flex-col justify-between bg-[#F5F5F7] rounded-[22px] sm:rounded-[24px] p-6 sm:p-7 transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-[14px] bg-white text-[#1D1D1F] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-[1.06] transition-transform duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <GraduationCap className="w-5.5 h-5.5 stroke-[1.9]" />
                  </div>
                  <span className="text-[13px] font-bold text-[#1D1D1F] tracking-wider uppercase">
                    Bước 01
                  </span>
                </div>
                <ArrowRight className="hidden md:inline-block w-4.5 h-4.5 text-[#1D1D1F]/30 group-hover:text-[#1D1D1F] group-hover:translate-x-1 transition-all duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)] stroke-[2.2] select-none" aria-hidden="true" />
              </div>
              <h3 className="text-[18px] font-bold text-[#1D1D1F] tracking-tight mb-2">
                Chọn loại văn bằng
              </h3>
              <p className="text-[15.5px] sm:text-[16px] text-[#1D1D1F] leading-[1.6] font-normal">
                Chọn trình độ đào tạo (Đại học, Thạc sĩ, Tiến sĩ) hoặc loại chứng chỉ (CNTT, VSTEP) cần xác thực.
              </p>
            </div>
          </div>

          {/* Bước 2 */}
          <div className="reveal-scale-on-scroll reveal-d2 group flex flex-col justify-between bg-[#F5F5F7] rounded-[22px] sm:rounded-[24px] p-6 sm:p-7 transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-[14px] bg-white text-[#1D1D1F] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-[1.06] transition-transform duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <Search className="w-5 h-5 stroke-[2.1]" />
                  </div>
                  <span className="text-[13px] font-bold text-[#1D1D1F] tracking-wider uppercase">
                    Bước 02
                  </span>
                </div>
                <ArrowRight className="hidden md:inline-block w-4.5 h-4.5 text-[#1D1D1F]/30 group-hover:text-[#1D1D1F] group-hover:translate-x-1 transition-all duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)] stroke-[2.2] select-none" aria-hidden="true" />
              </div>
              <h3 className="text-[18px] font-bold text-[#1D1D1F] tracking-tight mb-2">
                Nhập thông tin tra cứu
              </h3>
              <p className="text-[15.5px] sm:text-[16px] text-[#1D1D1F] leading-[1.6] font-normal">
                Điền chính xác Họ tên, Ngày sinh, Số hiệu phôi văn bằng và Số vào sổ cấp bằng của người học.
              </p>
            </div>
          </div>

          {/* Bước 3 */}
          <div className="reveal-scale-on-scroll reveal-d3 group flex flex-col justify-between bg-[#F5F5F7] rounded-[22px] sm:rounded-[24px] p-6 sm:p-7 transition-[transform,box-shadow] duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-[14px] bg-white text-[#1D1D1F] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-[1.06] transition-transform duration-[350ms] ease-[cubic-bezier(0.32,0.72,0,1)]">
                    <QrCode className="w-5 h-5 stroke-[2.1]" />
                  </div>
                  <span className="text-[13px] font-bold text-[#1D1D1F] tracking-wider uppercase">
                    Bước 03
                  </span>
                </div>
              </div>
              <h3 className="text-[18px] font-bold text-[#1D1D1F] tracking-tight mb-2">
                Xem kết quả xác thực
              </h3>
              <p className="text-[15.5px] sm:text-[16px] text-[#1D1D1F] leading-[1.6] font-normal">
                Hệ thống đối soát dữ liệu gốc, hiển thị văn bằng điện tử chi tiết kèm mã QR xác thực trực tuyến.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 4. KẾT QUẢ TRA CỨU: DRAWER TRÊN MOBILE, POPUP OMNINOTCH TRÊN DESKTOP */}
      <AnimatePresence>
        {result && isResultVisible && (
          <div
            id="omninotch-overlay"
            className="fixed inset-0 z-[1000] flex flex-col justify-end sm:justify-center items-center p-0 sm:p-5 md:p-6 overflow-hidden sm:overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleBackdropClick(e);
              }
            }}
          >
            {/* Lớp Backdrop bấm ra ngoài để đóng: Fade-in 1 nhịp êm ái, loại bỏ transform-gpu để tránh hiện tượng GPU Chromium chớp/giật 2 lần */}
            <motion.div
              key="omninotch-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute inset-0 z-0 cursor-pointer select-none no-print backdrop-blur-[4px] ${
                isCardExpanded ? 'bg-slate-900/35' : 'bg-slate-900/22'
              }`}
              onClick={handleBackdropClick}
              aria-label="Bấm ra ngoài để đóng"
            />

            {/* Popup Card: Đục đặc 100% ngay từ Frame 0 (không xuyên thấu chữ nền), bung mở êm ái chuẩn Apple Critically Damped Spring */}
            <motion.div
              key="omninotch-card-wrapper"
              initial={isMobile ? { y: '100%' } : { scale: 0.94, y: 14 }}
              animate={isMobile ? { y: 0 } : { scale: 1, y: 0 }}
              exit={
                isMobile
                  ? { y: '100%' }
                  : { scale: 0.95, y: 12, opacity: 0 }
              }
              transition={
                isMobile
                  ? { type: 'spring', bounce: 0, duration: 0.36 }
                  : { type: 'spring', bounce: 0, duration: 0.38 }
              }
              className="w-full flex justify-center mt-auto sm:my-auto relative z-10 pointer-events-none"
            >
              <div
                className={`w-full relative pointer-events-auto transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  result?.notFound
                    ? 'max-w-[540px]'
                    : 'max-w-4xl lg:max-w-5xl xl:max-w-[1100px] 2xl:max-w-[1160px]'
                } ${
                  isCardExpanded
                    ? 'sm:scale-[1.02] lg:scale-[1.05]'
                    : 'scale-100'
                }`}
              >
                {result?.notFound ? (
                  <NotFoundResultCard
                    type={resultType}
                    data={result}
                    onClose={handleResetResult}
                    onReset={handleResetResult}
                  />
                ) : result ? (
                  <CertificateCard
                    type={resultType}
                    data={result}
                    isExpanded={isCardExpanded}
                    onToggleExpand={() => setIsCardExpanded((prev) => !prev)}
                    onReset={handleResetResult}
                    onClose={handleResetResult}
                  />
                ) : null}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING ACTION BUTTON & PANEL: HỒ SƠ MẪU TEST NHANH Ở GÓC MÀN HÌNH */}
      <QuickSampleWidget
        activeTab={activeTab}
        sampleData={sampleData}
        onApplySample={handleApplySample}
        isSpotlightOpen={Boolean(spotlightState.isFormExpanded)}
        isResultOpen={Boolean(result && isResultVisible)}
      />

      {/* 5. FOOTER: THÔNG TIN LIÊN HỆ ĐẦY ĐỦ CỦA TRƯỜNG ĐẠI HỌC NAM CẦN THƠ */}
      <Footer />
    </div>
  );
}
