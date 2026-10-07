'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, ArrowDown, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpotlightBar from '@/components/SpotlightBar';
import VanBangForm from '@/components/VanBangForm';
import CnttForm from '@/components/CnttForm';
import VstepForm from '@/components/VstepForm';
import CertificateCard from '@/components/CertificateCard';
import NotFoundResultCard from '@/components/NotFoundResultCard';
import QuickSampleWidget from '@/components/QuickSampleWidget';

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
    setSampleToApply({
      tab: activeTab,
      data: sample,
      ts: Date.now(),
    });
    const cardEl = document.getElementById('khung-tra-cuu-card');
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        setIsCardRevealed(true);
      }, 140);
    } else {
      setIsCardRevealed(true);
    }
  };

  // Vị trí dock của thanh Dynamic Island: Giữa trên, Giữa dưới và 4 Góc
  type DockPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  const [dockPosition, setDockPosition] = useState<DockPosition>('top-center');
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingPill, setIsDraggingPill] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);
  const pillRef = useRef<HTMLButtonElement | null>(null);
  const dragInfoRef = useRef<{
    startX: number;
    startY: number;
    initialLeft: number;
    initialTop: number;
    hasMoved: boolean;
  }>({ startX: 0, startY: 0, initialLeft: 0, initialTop: 0, hasMoved: false });
  // Thời điểm mở modal gần nhất để chống ghost-click trên mobile khi vừa chạm mở
  const overlayOpenedAtRef = useRef<number>(0);

  // Mở popup/drawer kết quả tra cứu với timestamp bảo vệ chống ghost-click
  const openResultModal = () => {
    setDragPos(null);
    setIsDraggingPill(false);
    setIsClosingResult(false);
    overlayOpenedAtRef.current = Date.now();
    setIsResultVisible(true);
  };

  // Tính tọa độ chuẩn của 6 vị trí neo (dock)
  const getDockCoordinates = (dock: DockPosition, pillWidth: number, pillHeight: number) => {
    if (typeof window === 'undefined') return { x: 0, y: 48 };

    const isLg = window.innerWidth >= 1024;
    const topY = isLg ? 48 : 39;
    const bottomY = Math.max(topY + 60, window.innerHeight - pillHeight - 20);

    const marginX = isLg ? 20 : 12;
    const leftX = marginX;
    const centerX = (window.innerWidth - pillWidth) / 2;
    const rightX = Math.max(leftX, window.innerWidth - pillWidth - marginX);

    switch (dock) {
      case 'top-left':
        return { x: leftX, y: topY };
      case 'top-center':
        return { x: centerX, y: topY };
      case 'top-right':
        return { x: rightX, y: topY };
      case 'bottom-left':
        return { x: leftX, y: bottomY };
      case 'bottom-center':
        return { x: centerX, y: bottomY };
      case 'bottom-right':
        return { x: rightX, y: bottomY };
    }
  };

  const handlePillPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    if (!pillRef.current) return;

    const rect = pillRef.current.getBoundingClientRect();
    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialLeft: rect.left,
      initialTop: rect.top,
      hasMoved: false,
    };

    // QUAN TRỌNG: Không gán dragPos hay isDragging ngay khi vừa chạm (pointerdown)
    // để tránh giật vị trí pill khi người dùng chỉ muốn chạm (tap) để mở xem trên mobile!
    setIsSnapping(false);

    const isTouch = e.pointerType === 'touch';
    const moveThreshold = isTouch ? 14 : 6;

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - dragInfoRef.current.startX;
      const deltaY = moveEvent.clientY - dragInfoRef.current.startY;
      if (Math.hypot(deltaX, deltaY) > moveThreshold) {
        dragInfoRef.current.hasMoved = true;
        setIsDraggingPill(true);
      }

      if (dragInfoRef.current.hasMoved && pillRef.current) {
        moveEvent.preventDefault();
        const pillWidth = pillRef.current.scrollWidth || rect.width;
        const pillHeight = pillRef.current.offsetHeight || rect.height;
        const minX = 8;
        const maxX = window.innerWidth - pillWidth - 8;
        const minY = 8;
        const maxY = window.innerHeight - pillHeight - 8;

        const currentX = Math.max(minX, Math.min(maxX, dragInfoRef.current.initialLeft + deltaX));
        const currentY = Math.max(minY, Math.min(maxY, dragInfoRef.current.initialTop + deltaY));

        setDragPos({ x: currentX, y: currentY });
      }
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      setIsDraggingPill(false);

      const deltaX = upEvent.clientX - dragInfoRef.current.startX;
      const deltaY = upEvent.clientY - dragInfoRef.current.startY;
      const hasActuallyMoved = Math.hypot(deltaX, deltaY) > moveThreshold || dragInfoRef.current.hasMoved;

      if (!hasActuallyMoved) {
        // Chỉ nhấp/chạm nhẹ: Mở bung kết quả tra cứu
        openResultModal();
        return;
      }

      // Kéo thả hoàn tất: Đọc chính xác tọa độ lúc nhả chuột từ upEvent
      if (pillRef.current) {
        const pillWidth = pillRef.current.scrollWidth || rect.width;
        const pillHeight = pillRef.current.offsetHeight || rect.height;
        const minX = 8;
        const maxX = window.innerWidth - pillWidth - 8;
        const minY = 8;
        const maxY = window.innerHeight - pillHeight - 8;

        const finalX = Math.max(minX, Math.min(maxX, dragInfoRef.current.initialLeft + deltaX));
        const finalY = Math.max(minY, Math.min(maxY, dragInfoRef.current.initialTop + deltaY));

        const centerPillX = finalX + pillWidth / 2;
        const centerPillY = finalY + pillHeight / 2;

        const vert: 'top' | 'bottom' = centerPillY < window.innerHeight / 2 ? 'top' : 'bottom';
        let horiz: 'left' | 'center' | 'right' = 'center';
        if (centerPillX < window.innerWidth * 0.35) {
          horiz = 'left';
        } else if (centerPillX > window.innerWidth * 0.65) {
          horiz = 'right';
        } else {
          horiz = 'center';
        }

        const targetDock: DockPosition = `${vert}-${horiz}` as DockPosition;
        const targetCoords = getDockCoordinates(targetDock, pillWidth, pillHeight);

        // Kích hoạt hiệu ứng nam châm hít mượt mà (smooth glide snap) về vị trí dock
        setIsSnapping(true);
        setDragPos(targetCoords);

        setTimeout(() => {
          setDockPosition(targetDock);
          setDragPos(null);
          setIsSnapping(false);
        }, 280);
      } else {
        setDragPos(null);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const dockPositionClasses: Record<DockPosition, string> = {
    'top-left': 'top-[39px] lg:top-[48px] left-3 sm:left-5',
    'top-center': 'top-[39px] lg:top-[48px] left-0 right-0 flex justify-center',
    'top-right': 'top-[39px] lg:top-[48px] right-3 sm:right-5',
    'bottom-left': 'bottom-5 left-3 sm:left-5',
    'bottom-center': 'bottom-5 left-0 right-0 flex justify-center',
    'bottom-right': 'bottom-5 right-3 sm:right-5',
  };

  // Thu gọn OmniNotch về pill Dynamic Island ở header
  const handleMinimizeResult = () => {
    setIsClosingResult(true);
    setTimeout(() => {
      setIsResultVisible(false);
      setIsClosingResult(false);
    }, 320);
  };

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
    if (result?.notFound) {
      handleResetResult();
    } else {
      handleMinimizeResult();
    }
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

  // Lắng nghe phím ESC để thu gọn OmniNotch
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isResultVisible) {
        if (result?.notFound) {
          handleResetResult();
        } else {
          handleMinimizeResult();
        }
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
    <div className="min-h-screen print:min-h-0 print:h-auto flex flex-col bg-[#F8FAFC] print:bg-white text-gray-900 relative">

      {/* 1. NAVBAR */}
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 2. HERO STAGE & SPOTLIGHT SEARCH - CĂN GIỮA VỊ TRÍ GỐC (KHÔNG DỜI LÊN TRÊN, CHUẨN 100% ẢNH GỐC) */}
      <section
        id="hero-stage"
        className="relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-[#0F275A] via-[#1E3A8A] to-[#1E40AF] text-white no-print min-h-[calc(100vh-70px)] sm:min-h-[calc(100vh-80px)] py-12 sm:py-16"
      >
        {/* 1. LỚP ẢNH NỀN HỌC THUẬT DNC CHÍNH THỨC (TRỌN VẸN 100% ẢNH GỐC ĐHCT) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none select-none bg-cover bg-right sm:bg-center mix-blend-luminosity opacity-[0.24] sm:opacity-[0.28]"
          style={{
            backgroundImage: "url('/images/hero/dnc-hero-campus-banner.png')",
            filter: 'contrast(115%) brightness(115%)',
          }}
        />

        {/* 2. KHỐI TIÊU ĐỀ & THANH SPOTLIGHT CĂN GIỮA HOÀN TOÀN (KHÔNG DỜI LÊN TRÊN, ĐỨNG YÊN VỊ TRÍ TỰ NHIÊN) */}
        <div className="w-full max-w-[1080px] mx-auto flex flex-col items-center text-center relative z-20">
          {/* Tiêu đề cổng tra cứu */}
          <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-white tracking-tight leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)] mb-3 sm:mb-3.5">
            Cổng Tra Cứu Văn Bằng Chứng Chỉ
          </h1>

          {/* Phụ đề mô tả quyền hạn và dịch vụ */}
          <p className="text-[13.5px] sm:text-[15.5px] text-blue-100/90 max-w-xl mx-auto font-normal leading-relaxed mb-7 sm:mb-9 drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]">
            Hệ thống xác thực văn bằng điện tử chính thức Trường Đại học Nam Cần Thơ
          </p>

          {/* Thanh tra cứu Spotlight căn giữa: Nền cố định 100%, popover mở nổi tuyệt đối */}
          <div className="w-full max-w-[980px] relative">
            <SpotlightBar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onSelectResult={handleLookupSuccess}
              onNotFound={handleLookupNotFound}
              onReset={handleGlobalReset}
              sampleData={sampleData}
            />
          </div>
        </div>

        {/* 3. ĐƯỜNG LƯỢN SÓNG CHUYỂN NỀN MỀM MẠI Ở CHÂN TRANG NỐI VÀO NỀN DƯỚI */}
        <div
          aria-hidden="true"
          className="absolute -bottom-px left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10"
        >
          <svg
            className="w-full h-10 sm:h-16 md:h-20 lg:h-24 block text-[#F8FAFC]"
            viewBox="0 0 1440 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 45C320 72 680 24 1040 60C1240 76 1360 54 1440 46V90H0V45Z"
              fill="rgba(255, 255, 255, 0.18)"
            />
            <path
              d="M0 52C360 82 760 32 1120 70C1280 84 1380 66 1440 58V90H0V52Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      {/* 3. MAIN ANCHOR */}
      <main
        id="khung-tra-cuu"
        ref={cardSectionRef}
        className="flex-1 bg-[#F8FAFC] min-h-[30px] sm:min-h-[50px] no-print"
      />

      {/* THANH THÔNG BÁO DYNAMIC ISLAND (KHI KẾT QUẢ ĐANG Ở CHẾ ĐỘ THU GỌN - ĐEN TRONG SUỐT APPLE SMOKED GLASS, BỎ CHẤM XANH, KHÔNG VIỀN, HỖ TRỢ KÉO ĐẶT Ở GIỮA TRÊN, GIỮA DƯỚI VÀ 4 GÓC, HIỆU ỨNG ĐỒNG BỘ 100%) */}
      {result && !result.notFound && !isResultVisible && (
        <div
          className={`fixed z-[56] pointer-events-none no-print ${dragPos === null ? dockPositionClasses[dockPosition] : 'w-max'
            } ${dragPos === null
              ? dockPosition.startsWith('bottom')
                ? 'animate-omninotch-pill-enter-bottom'
                : 'animate-omninotch-pill-enter-top'
              : ''
            }`}
          style={
            dragPos !== null
              ? {
                left: `${dragPos.x}px`,
                top: `${dragPos.y}px`,
                transition: isSnapping
                  ? 'left 0.28s cubic-bezier(0.16, 1, 0.3, 1), top 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
                  : 'none',
              }
              : undefined
          }
        >
          <button
            ref={pillRef}
            type="button"
            onPointerDown={handlePillPointerDown}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (dragInfoRef.current.hasMoved) return;
              openResultModal();
            }}
            onDoubleClick={() => {
              setDockPosition('top-center');
              setDragPos(null);
            }}
            className={`pointer-events-auto inline-flex items-center gap-2.5 sm:gap-3 px-5 py-2 sm:py-2.5 rounded-full bg-black/85 hover:bg-black/95 text-white shadow-[0_12px_32px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)] border-0 border-none outline-none ring-0 select-none font-google-sans touch-none transition-all duration-150 whitespace-nowrap shrink-0 w-max min-w-max flex-nowrap ${isDraggingPill
              ? 'cursor-grabbing scale-[1.03] shadow-[0_20px_50px_rgba(0,0,0,0.85)] ring-1 ring-white/20'
              : 'cursor-grab active:scale-95'
              }`}
            style={{
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              maxWidth: 'max-content',
            }}
            title="Kéo đặt vào Giữa Trên, Giữa Dưới hoặc 4 Góc. Nhấn để mở xem, nhấp đúp để về lại giữa trên"
          >
            <span className="text-xs sm:text-sm font-medium text-slate-300 tracking-wide flex items-center gap-1.5 pointer-events-none whitespace-nowrap shrink-0">
              <span className="whitespace-nowrap">Kết quả:</span>
              <strong className="text-[#FFD24B] font-bold tracking-wide uppercase whitespace-nowrap">{result.ho_ten}</strong>
            </span>
            <span className="text-[11px] sm:text-xs bg-white/10 group-hover:bg-white/20 text-white font-semibold px-2.5 py-0.5 rounded-full transition-all border-0 border-none flex items-center gap-1 pointer-events-none whitespace-nowrap shrink-0">
              <span className="whitespace-nowrap">Mở xem</span>
              <span className="text-[10px]">{dockPosition.startsWith('bottom') ? '▴' : '▾'}</span>
            </span>
          </button>
        </div>
      )}

      {/* 4. KẾT QUẢ TRA CỨU: TRÊN MOBILE LÀ CỬA SỔ DRAWER VUỐT TỪ DƯỚI LÊN, TRÊN PC LÀ POPUP OMNINOTCH */}
      {result && isResultVisible && (
        <div
          id="omninotch-overlay"
          className={`fixed inset-0 z-[60] flex flex-col justify-end sm:justify-center items-center p-0 sm:p-5 md:p-6 overflow-hidden sm:overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-colors duration-300 ${isCardExpanded ? 'bg-slate-950/25' : 'bg-slate-950/15'
            } ${isClosingResult ? 'animate-omninotch-backdrop-exit' : 'animate-omninotch-backdrop-enter'
            }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleBackdropClick(e);
            }
          }}
        >
          {/* LỚP BACKDROP BẤM RA NGOÀI ĐỂ THU GỌN / ĐÓNG (BẢO ĐẢM 100% HOẠT ĐỘNG CẢ MOBILE VÀ DESKTOP, CÓ CHỐNG GHOST-CLICK) */}
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
            style={{
              transformOrigin: dockPosition.startsWith('bottom')
                ? dockPosition === 'bottom-left'
                  ? 'bottom left'
                  : dockPosition === 'bottom-right'
                    ? 'bottom right'
                    : 'bottom center'
                : dockPosition === 'top-left'
                  ? 'top left'
                  : dockPosition === 'top-right'
                    ? 'top right'
                    : 'top center',
            }}
          >
            {/* SHELL PHÓNG TO / THU NHỎ ĐỘC LẬP SIÊU MƯỢT (RỘNG RÃI THOÁNG ĐÃNG CHỨA ĐỦ CỠ CHỮ 20PX) */}
            <div
              className={`w-full relative certificate-expand-shell pointer-events-auto ${result?.notFound
                ? 'max-w-lg'
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
                  onClose={handleMinimizeResult}
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
      />

      {/* 5. FOOTER */}
      <Footer />
    </div>
  );
}
