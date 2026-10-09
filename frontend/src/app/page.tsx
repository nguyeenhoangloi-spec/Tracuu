'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, ArrowDown, X } from 'lucide-react';
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
  const [isClosingResult, setIsClosingResult] = useState(false);
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
    setIsClosingResult(true);
    // Giữ nguyên form nhập liệu, không tự động thu lại khi đóng kết quả
    setTimeout(() => {
      setResult(null);
      setIsResultVisible(false);
      setIsClosingResult(false);
      setIsCardExpanded(false);
    }, 280);
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

  useEffect(() => {
    if (result && isResultVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [result, isResultVisible]);

  const handleLookupSuccess = (type: 'vanbang' | 'cntt' | 'vstep', data: any) => {
    setResultType(type);
    setResult(data);
    setIsClosingResult(false);
    overlayOpenedAtRef.current = Date.now();
    setIsResultVisible(true);
  };

  const handleLookupNotFound = (type: 'vanbang' | 'cntt' | 'vstep', notFoundData: { query?: any; message?: string }) => {
    setResultType(type);
    setResult({ notFound: true, ...notFoundData });
    setIsClosingResult(false);
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

      {/* 2. HERO — SÂN KHẤU TRA CỨU NỀN SÁNG + CHÙM SÁNG HỔ PHÁCH TINH TẾ */}
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

      {/* 3. MAIN ANCHOR */}
      <main
        id="khung-tra-cuu"
        ref={cardSectionRef}
        className="flex-1 min-h-0 no-print"
      />

      {/* 4. KẾT QUẢ TRA CỨU: DRAWER TRÊN MOBILE, POPUP OMNINOTCH TRÊN DESKTOP */}
      {result && isResultVisible && (
        <div
          id="omninotch-overlay"
          className={`fixed inset-0 z-[1000] flex flex-col justify-end sm:justify-center items-center p-0 sm:p-5 md:p-6 overflow-hidden sm:overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-colors duration-300 ${isCardExpanded ? 'bg-slate-950/60 backdrop-blur-[6px]' : 'bg-slate-950/50 backdrop-blur-[6px]'
            } ${isClosingResult ? 'animate-omninotch-backdrop-exit' : 'animate-omninotch-backdrop-enter'}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleBackdropClick(e);
            }
          }}
        >
          {/* Lớp Backdrop bấm ra ngoài để đóng */}
          <div
            className="absolute inset-0 z-0 cursor-pointer select-none no-print"
            onClick={handleBackdropClick}
            aria-label="Bấm ra ngoài để đóng"
          />

          <div
            className={`w-full flex justify-center mt-auto sm:my-auto relative z-10 pointer-events-none ${isClosingResult
              ? 'mobile-drawer-exit sm:animate-omninotch-exit'
              : 'mobile-drawer-enter sm:animate-omninotch-enter'
              }`}
          >
            <div
              className={`w-full relative certificate-expand-shell pointer-events-auto ${result?.notFound
                ? 'max-w-[540px]'
                : 'max-w-4xl lg:max-w-5xl xl:max-w-[1100px] 2xl:max-w-[1160px]'
                } ${isCardExpanded
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
          </div>
        </div>
      )}

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
