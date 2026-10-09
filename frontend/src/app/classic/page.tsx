'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, ArrowDown, X, Shield, Zap, Globe, Lock } from 'lucide-react';
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
import '../degree-lookup.css';

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

  // Trạng thái mở của thanh tra cứu Spotlight (đóng/mở & chế độ lưới/form)
  const [spotlightState, setSpotlightState] = useState<{
    isOpen: boolean;
    isFormExpanded: boolean;
    panelHeight?: number;
  }>({ isOpen: false, isFormExpanded: false, panelHeight: 0 });

  // Kiểm tra thiết bị Mobile để tối ưu hóa biên độ lướt mượt mà chuẩn Apple
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Tọa độ lướt mượt mà chuẩn Apple:
  // - Khi đóng: nằm chính giữa tự nhiên (0)
  // - Khi mở danh mục tra cứu (Grid): lướt nhẹ -55px
  // - Khi mở Form chuẩn: lướt vừa vặn -130px (không chừa sẵn quá cao làm dồn lên trên)
  // - Khi có báo lỗi khiến form dài thêm: tự động lướt đẩy lên thêm tương ứng để không bị đụng viền
  const baseFormGlideY = -130;
  const extraErrorGlideY = spotlightState.isFormExpanded && spotlightState.panelHeight
    ? Math.max(0, spotlightState.panelHeight - 355)
    : 0;
  const heroGlideY = !spotlightState.isOpen
    ? 0
    : isMobile
    ? 0
    : (spotlightState.isFormExpanded ? (baseFormGlideY - extraErrorGlideY) : -55);

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

  // Hiệu ứng Card trung tâm luôn hiển thị sẵn sàng, sắc nét trên màn hình
  const [isCardRevealed, setIsCardRevealed] = useState(true);

  useEffect(() => {
    setIsCardRevealed(true);
  }, []);

  // Cuộn xuống Card trung tâm khi nhấn nút
  const handleScrollToCard = () => {
    const cardEl = document.getElementById('khung-tra-cuu-card');
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Trì hoãn nhẹ 140ms để mắt người dùng bắt kịp nhịp camera lướt xuống,
      // thấy rõ card trồi lên, mở rộng và phát sáng crystal sắc nét
      setTimeout(() => {
        setIsCardRevealed(true);
      }, 140);
    } else {
      setIsCardRevealed(true);
    }
  };

  // Cuộn mượt mà về đỉnh trang
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

  // Thời điểm mở modal gần nhất để chống ghost-click trên mobile khi vừa chạm mở
  const overlayOpenedAtRef = useRef<number>(0);

  // Đóng hoàn toàn và reset kết quả tra cứu
  const handleResetResult = () => {
    setIsClosingResult(true);
    setTimeout(() => {
      setResult(null);
      setIsResultVisible(false);
      setIsClosingResult(false);
      setIsCardExpanded(false);
    }, 320);
  };

  // Xử lý bấm ra ngoài nền (Backdrop click) với chốt chống ghost-click an toàn 100% trên mobile
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Nếu vừa mới mở modal/drawer trong vòng 500ms, bỏ qua synthetic click từ cử chỉ chạm ban đầu
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

  // Fetch sample data from NestJS Backend on mount
  useEffect(() => {
    fetch('/api/tracuu/sample-data')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setSampleData(json.data);
      })
      .catch((err) => console.log('Backend sample fetch:', err));
  }, []);

  // Tự động mở kết quả xác thực khi truy cập qua liên kết xác minh trực tiếp (?verify=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const verifyCode = params.get('verify');
    if (!verifyCode) return;

    const raw = decodeURIComponent(verifyCode).trim();
    const clean = raw.toLowerCase();

    // 1. Tìm trong sampleData
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

    // 2. Hồ sơ chuẩn của Dương Thị Anh Thư
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

  // Lắng nghe phím ESC để đóng OmniNotch
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isResultVisible) {
        handleResetResult();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isResultVisible]);

  // Khóa cuộn trang nền khi OmniNotch đang mở để tạo cảm giác app native
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

  const HERO_CONFIG: Record<
    'vanbang' | 'cntt' | 'vstep',
    { title: string; subtitle: string }
  > = {
    vanbang: {
      title: 'Tra cứu văn bằng tốt nghiệp',
      subtitle: 'Tra cứu thông tin và xác thực giá trị pháp lý văn bằng tốt nghiệp trực tuyến.',
    },
    cntt: {
      title: 'Tra cứu chứng chỉ CNTT',
      subtitle: 'Tra cứu thông tin và xác thực giá trị pháp lý chứng chỉ ứng dụng công nghệ thông tin.',
    },
    vstep: {
      title: 'Tra cứu chứng chỉ VSTEP',
      subtitle: 'Tra cứu thông tin và xác thực giá trị pháp lý chứng chỉ VSTEP trực tuyến.',
    },
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

      {/* 1. NAVBAR */}
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 2. HERO — SÂN KHẤU TRA CỨU NỀN SÁNG + CHÙM SÁNG HỔ PHÁCH + 4 CAM KẾT */}
      <section className="degree-lookup-hero no-print">
        <div className="degree-lookup-hero__copy degree-lookup-wrap">

          {/* Tiêu đề chính chữ đen #1D1D1F sắc nét */}
          <h1
            className="degree-lookup-h1 text-[32px] md:text-[64px] text-apple-text mb-2 sm:mb-3"
            style={{ color: 'var(--color-apple-text)' }}
          >
            Xác Thực Văn Bằng
            <br />
            &amp; Chứng Chỉ
          </h1>

          {/* Phụ đề chữ chuẩn Apple thanh lịch - LUÔN HIỂN THỊ CỐ ĐỊNH, KHÔNG ẨN KHI MỞ FORM */}
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
              onOpenStateChange={setSpotlightState}
              variant="light"
            />
          </div>

          {/* Bốn cam kết hệ thống (chữ đen, không dùng màu xanh) */}
          <ul className="degree-lookup-claims">
            <li>
              <span className="degree-lookup-claims__icon"><Shield size={18} /></span>
              <span className="degree-lookup-claims__copy">
                <span className="degree-lookup-claims__lead">Xác thực chính xác</span>
                <span className="degree-lookup-claims__sub">Dữ liệu từ hệ thống chính thức của trường</span>
              </span>
            </li>
            <li>
              <span className="degree-lookup-claims__icon"><Zap size={18} /></span>
              <span className="degree-lookup-claims__copy">
                <span className="degree-lookup-claims__lead">Tra cứu tức thì</span>
                <span className="degree-lookup-claims__sub">Kết quả trả về ngay trong tích tắc</span>
              </span>
            </li>
            <li>
              <span className="degree-lookup-claims__icon"><Globe size={18} /></span>
              <span className="degree-lookup-claims__copy">
                <span className="degree-lookup-claims__lead">Truy cập mọi lúc</span>
                <span className="degree-lookup-claims__sub">Hoạt động 24/7 trên mọi thiết bị</span>
              </span>
            </li>
            <li>
              <span className="degree-lookup-claims__icon"><Lock size={18} /></span>
              <span className="degree-lookup-claims__copy">
                <span className="degree-lookup-claims__lead">Bảo mật cao</span>
                <span className="degree-lookup-claims__sub">Mã hóa đầu cuối, an toàn tuyệt đối</span>
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* 3. MAIN ANCHOR */}
      <main
        id="khung-tra-cuu"
        ref={cardSectionRef}
        className="flex-1 bg-white min-h-0 no-print border-0 border-none"
      />

      {/* 4. KẾT QUẢ TRA CỨU: TRÊN MOBILE LÀ CỬA SỔ DRAWER VUỐT TỪ DƯỚI LÊN, TRÊN PC LÀ POPUP OMNINOTCH */}
      {result && isResultVisible && (
        <div
          id="omninotch-overlay"
          className={`fixed inset-0 z-[60] flex flex-col justify-end sm:justify-center items-center p-0 sm:p-5 md:p-6 overflow-hidden sm:overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-colors duration-300 ${isCardExpanded ? 'bg-slate-950/60 backdrop-blur-[6px]' : 'bg-slate-950/50 backdrop-blur-[6px]'
            } ${isClosingResult ? 'animate-omninotch-backdrop-exit' : 'animate-omninotch-backdrop-enter'
            }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleBackdropClick(e);
            }
          }}
        >
          {/* LỚP BACKDROP BẤM RA NGOÀI ĐỂ ĐÓNG (BẢO ĐẢM 100% HOẠT ĐỘNG CẢ MOBILE VÀ DESKTOP, CÓ CHỐNG GHOST-CLICK) */}
          <div
            className="absolute inset-0 z-0 cursor-pointer select-none no-print"
            onClick={handleBackdropClick}
            aria-label="Bấm ra ngoài để đóng"
          />

          {/* KHUNG THẺ DRAWER / OMNINOTCH: MOBILE TRƯỢT TỪ ĐÁY LÊN, DESKTOP BUNG MỞ TỪ NEO */}
          <div
            className={`w-full flex justify-center mt-auto sm:my-auto relative z-10 pointer-events-none ${isClosingResult
              ? 'mobile-drawer-exit sm:animate-omninotch-exit'
              : 'mobile-drawer-enter sm:animate-omninotch-enter'
              }`}
          >
            {/* SHELL PHÓNG TO / THU NHỎ ĐỘC LẬP SIÊU MƯỢT (RỘNG RÃI THOÁNG ĐÃNG CHỨA ĐỦ CỠ CHỮ 20PX) */}
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
        isSpotlightOpen={spotlightState.isOpen}
        isResultOpen={Boolean(result && isResultVisible)}
      />

      {/* 5. FOOTER */}
      <Footer />
    </div>
  );
}
