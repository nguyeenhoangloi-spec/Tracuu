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
    <div className="min-h-screen print:min-h-0 print:h-auto flex flex-col bg-white print:bg-white text-gray-900 relative">

      {/* 1. NAVBAR */}
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 2. HERO STAGE WRAPPER - THU VỪA PHẢI 2 BÊN NẰM TRÊN NỀN TRẮNG, GIỮ NGUYÊN ĐỘ DÀI/CAO GỐC, BO 4 GÓC, KHÔNG VIỀN, KHÔNG BÓNG ĐỔ */}
      <div className="w-full bg-white px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3 lg:pt-4 pb-3 sm:pb-5 lg:pb-6 no-print border-0 border-none shadow-none">
        <section
          id="hero-stage"
          className="relative w-full max-w-[1420px] mx-auto flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1E52A4] via-[#2767CC] to-[#3A82E6] text-white rounded-2xl sm:rounded-3xl lg:rounded-[32px] border-0 border-none shadow-none min-h-[380px] sm:min-h-[480px] lg:min-h-[685px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
        >
          {/* 1. LỚP ẢNH NỀN HỌC THUẬT DNC CHÍNH THỨC (WEBP SIÊU NHẸ 98KB LOAD TỨC THÌ 0MS KHÔNG CHỚP SÁNG) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -right-4 sm:-right-10 pointer-events-none select-none bg-cover bg-right mix-blend-luminosity opacity-[0.06] sm:opacity-[0.28]"
            style={{
              backgroundImage: "url('/images/hero/dnc-hero-campus-banner.webp')",
              filter: 'contrast(115%) brightness(120%)',
              maskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 92%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 92%)',
            }}
          />

          {/* 2. HOA VĂN BẢO MẬT PHÔI VĂN BẰNG CHÌM CHUẨN HỌC THUẬT (GUILLOCHE ROSETTE BẢO MẬT TINH TẾ, ĐƠN SẮC, KHÔNG RỐI MẮT) */}
          <div
            aria-hidden="true"
            className="absolute left-3 sm:left-8 lg:left-14 top-1/2 -translate-y-1/2 w-[300px] sm:w-[350px] lg:w-[380px] h-[300px] sm:h-[350px] lg:h-[380px] pointer-events-none select-none opacity-[0.05] sm:opacity-[0.07] text-blue-100 z-[1] hidden min-[640px]:block"
            style={{
              position: 'absolute',
              width: '360px',
              height: '360px',
              maxWidth: '380px',
              maxHeight: '380px',
            }}
          >
            <svg viewBox="0 0 400 400" className="w-full h-full fill-none stroke-current" style={{ width: '100%', height: '100%' }}>
              {/* Các vòng tròn đồng tâm hoa văn an toàn phôi bằng */}
              <circle cx="200" cy="200" r="185" strokeWidth="0.8" strokeDasharray="3 3" />
              <circle cx="200" cy="200" r="168" strokeWidth="0.7" />
              <circle cx="200" cy="200" r="148" strokeWidth="0.6" strokeDasharray="4 2" />
              <circle cx="200" cy="200" r="95" strokeWidth="0.65" />
              <circle cx="200" cy="200" r="50" strokeWidth="0.5" strokeDasharray="2 2" />

              {/* Mạng lưới đường vân Guilloche hình học bảo mật học thuật đan xen đối xứng */}
              <g strokeWidth="0.65" opacity="0.9">
                <path d="M 200 32 C 120 120 120 280 200 368 C 280 280 280 120 200 32 Z" />
                <path d="M 32 200 C 120 120 280 120 368 200 C 280 280 120 280 32 200 Z" />
                <path d="M 81 81 C 120 176 280 224 319 319 C 280 224 120 176 81 81 Z" />
                <path d="M 319 81 C 224 120 176 280 81 319 C 176 280 224 120 319 81 Z" />
                <path d="M 200 52 C 145 130 145 270 200 348 C 255 270 255 130 200 52 Z" />
                <path d="M 52 200 C 130 145 270 145 348 200 C 270 255 130 255 52 200 Z" />
                <path d="M 200 75 C 160 140 160 260 200 325 C 240 260 240 140 200 75 Z" />
                <path d="M 75 200 C 140 160 260 160 325 200 C 260 240 140 240 75 200 Z" />
              </g>
            </svg>
          </div>

          {/* 2. KHỐI TIÊU ĐỀ & THANH SPOTLIGHT: CĂN GIỮA NGUYÊN BẢN, TRƯỢT LƯỚT SIÊU MƯỢT ĐỒNG BỘ 100% */}
          <motion.div
            animate={{ y: isMobile ? 0 : heroGlideY }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full max-w-[1080px] mx-auto flex flex-col items-center text-center relative z-20 sm:transform"
          >
            {/* KHỐI CHỮ PHÍA TRÊN: Mặt nạ overflow-hidden có mép dưới trùng mép trên thanh tìm kiếm.
                Khi tải trang, chữ nằm khuất dưới mép này rồi trồi lên mượt mà từ thanh tìm kiếm. */}
            <div className="w-full overflow-hidden pt-1 flex flex-col items-center">
              <motion.h1
                initial={false}
                animate={{
                  y: 0,
                  opacity: 1,
                  marginBottom: spotlightState.isFormExpanded ? (isMobile ? 16 : 24) : (isMobile ? 8 : 12),
                }}
                transition={{
                  marginBottom: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                }}
                className="text-[25px] min-[360px]:text-[28px] sm:text-3xl lg:text-[42px] font-bold sm:font-semibold text-white tracking-tight leading-[1.2] sm:leading-[1.25] drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.3)] max-w-[360px] sm:max-w-none origin-center text-balance"
              >
                <span className="block sm:inline">Tra cứu Văn bằng </span>
                <span className="block sm:inline">&amp; Chứng chỉ</span>
              </motion.h1>

              {/* Phụ đề: Khi mở Form tra cứu sẽ thu gọn mượt mà (animate height: 0, opacity: 0) để nhường khoảng trống cho Form, chống đụng viền */}
              <motion.div
                initial={false}
                animate={
                  spotlightState.isFormExpanded
                    ? {
                        height: 0,
                        opacity: 0,
                        marginBottom: 0,
                        y: -8,
                        filter: 'blur(3.5px)',
                      }
                    : {
                        height: 'auto',
                        opacity: 1,
                        marginBottom: isMobile ? 14 : 24,
                        y: 0,
                        filter: 'blur(0px)',
                      }
                }
                transition={{
                  duration: 0.42,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="overflow-hidden"
              >
                <p className="text-[13.5px] min-[360px]:text-[14.5px] sm:text-[15px] lg:text-[15.5px] text-blue-100/95 max-w-[340px] sm:max-w-xl mx-auto font-normal leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] select-none pb-0.5">
                  Hệ thống xác thực văn bằng điện tử – Trường Đại học Nam Cần Thơ
                </p>
              </motion.div>
            </div>

            {/* Thanh tra cứu Spotlight: Nền tảng vững chắc, sẵn sàng tức thì 0ms, không nhấp nháy */}
            <div className="w-full max-w-[980px] relative z-10">
              <SpotlightBar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onSelectResult={handleLookupSuccess}
                onNotFound={handleLookupNotFound}
                onReset={handleGlobalReset}
                sampleData={sampleData}
                sampleToApply={sampleToApply}
                onOpenStateChange={setSpotlightState}
              />
            </div>
          </motion.div>
        </section>
      </div>

      {/* 3. MAIN ANCHOR */}
      <main
        id="khung-tra-cuu"
        ref={cardSectionRef}
        className="flex-1 bg-white min-h-0 no-print border-0 border-none"
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
        isSpotlightOpen={spotlightState.isOpen}
        isResultOpen={Boolean(result && isResultVisible)}
      />

      {/* 5. FOOTER */}
      <Footer />
    </div>
  );
}
