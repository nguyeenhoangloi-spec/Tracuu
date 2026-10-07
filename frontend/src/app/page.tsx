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
  }>({ isOpen: false, isFormExpanded: false });

  // Kiểm tra thiết bị Mobile để tối ưu hóa biên độ lướt mượt mà chuẩn Apple
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Tọa độ lướt mượt mà chuẩn Apple: Khi đóng nằm chính giữa, khi mở lướt lên giữ card 100% trong nền xanh
  const heroGlideY = !spotlightState.isOpen
    ? 0
    : isMobile
    ? 0
    : (spotlightState.isFormExpanded ? -145 : -55);

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
    <div className="min-h-screen print:min-h-0 print:h-auto flex flex-col bg-[#ECEFF3] lg:bg-[#F8FAFC] print:bg-white text-gray-900 relative">

      {/* 1. NAVBAR */}
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 2. HERO STAGE & SPOTLIGHT SEARCH - TRÊN MOBILE LÀ CARD BO GÓC TRÒN NỔI BẬT CHUẨN APP UI, TRÊN PC LÀ HERO RỘNG RÃI */}
      <section
        id="hero-stage"
        className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#143B80] via-[#1D54A8] to-[#2267CA] text-white no-print mx-3 sm:mx-6 lg:mx-0 my-2.5 sm:my-4 lg:my-0 rounded-[24px] sm:rounded-[32px] lg:rounded-none shadow-[0_12px_36px_rgba(20,59,128,0.22)] lg:shadow-none min-h-[330px] sm:min-h-[380px] lg:min-h-[685px] px-3 sm:px-6 lg:px-8 py-5.5 sm:py-8 lg:py-12 transition-all duration-300"
      >
        {/* 1. LỚP ẢNH NỀN HỌC THUẬT DNC CHÍNH THỨC (TRÊN MOBILE LÀM DỊU OPACITY ĐỂ CHỮ NỔI RÕ RÀNG KHÔNG BỊ RỐI MẮT) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -right-4 sm:-right-10 pointer-events-none select-none bg-cover bg-right mix-blend-luminosity opacity-[0.06] sm:opacity-[0.28]"
          style={{
            backgroundImage: "url('/images/hero/dnc-hero-campus-banner.png')",
            filter: 'contrast(115%) brightness(120%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 92%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 80%, transparent 92%)',
          }}
        />

        {/* 2. HOA VĂN BẢO MẬT PHÔI VĂN BẰNG CHÌM (GUILLOCHE ROSETTE THEO ĐÚNG ẢNH MẪU BẠN CHỤP) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] sm:opacity-[0.07] overflow-hidden select-none z-0"
          aria-hidden="true"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="hero-guilloche-rosette"
                width="110"
                height="110"
                patternUnits="userSpaceOnUse"
              >
                {/* Vòng tròn chấm bi vàng kim bảo mật */}
                <circle cx="55" cy="55" r="20" fill="none" stroke="#FDE68A" strokeWidth="0.8" strokeDasharray="3 3" />
                {/* Vòng tròn cánh hoa đan xen màu xanh ngọc nhạt */}
                <circle cx="55" cy="55" r="33" fill="none" stroke="#BFDBFE" strokeWidth="0.65" />
                {/* Cánh hoa dọc đối xứng */}
                <path d="M 55 11 C 37 33 37 77 55 99 C 73 77 73 33 55 11 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.75" />
                {/* Cánh hoa ngang đối xứng */}
                <path d="M 11 55 C 33 37 77 37 99 55 C 77 73 33 73 11 55 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.75" />
                {/* Đường uốn lượn liên hoàn kết nối các mắt lưới */}
                <path d="M 0 55 Q 27.5 11 55 11 Q 82.5 11 110 55 Q 82.5 99 55 99 Q 27.5 99 0 55" fill="none" stroke="#93C5FD" strokeWidth="0.7" />
                <path d="M 55 0 Q 11 27.5 11 55 Q 11 82.5 55 110 Q 99 82.5 99 55 Q 99 27.5 55 0" fill="none" stroke="#93C5FD" strokeWidth="0.7" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-guilloche-rosette)" />
          </svg>
        </div>

        {/* 3. DẤU ẤN VĂN BẰNG & NÓN CỬ NHÂN TỐT NGHIỆP CHÌM ĐẶT VÀO KHOẢNG TRỐNG BÊN TRÁI (CHUẨN 100% ẢNH MẪU - CHỈ HIỆN TRÊN DESKTOP/TABLET ĐỂ MOBILE GỌN GÀNG) */}
        <div
          className="absolute left-2 sm:left-6 lg:left-12 top-1/2 -translate-y-1/2 w-[320px] sm:w-[420px] lg:w-[480px] h-[320px] sm:h-[420px] lg:h-[480px] pointer-events-none select-none opacity-[0.09] sm:opacity-[0.13] text-blue-100 z-[1] hidden min-[640px]:block"
          aria-hidden="true"
        >
          <svg viewBox="0 0 300 300" className="w-full h-full fill-none stroke-current">
            {/* Các vòng tròn bảo mật đồng tâm */}
            <circle cx="150" cy="150" r="142" strokeWidth="1.2" />
            <circle cx="150" cy="150" r="134" strokeWidth="0.9" strokeDasharray="4 3" />
            <circle cx="150" cy="150" r="120" strokeWidth="0.7" />
            <circle cx="150" cy="150" r="95" strokeWidth="0.85" />

            {/* Vòng nhành nguyệt quế vinh danh tốt nghiệp */}
            <path d="M 75 150 C 75 198 108 232 150 232 C 192 232 225 198 225 150" strokeWidth="1.3" />

            {/* Biểu tượng Nón Cử nhân (Graduation Mortarboard Cap) */}
            <polygon points="150,88 210,114 150,140 90,114" strokeWidth="1.8" fill="rgba(255,255,255,0.06)" />
            <path d="M 118 128 L 118 150 C 118 164 182 164 182 150 L 182 128" strokeWidth="1.8" />
            {/* Dây tua nón tốt nghiệp */}
            <path d="M 150 114 Q 172 120 180 134 L 180 166" strokeWidth="1.4" stroke="#FBBF24" />
            <circle cx="180" cy="170" r="3.5" fill="#FBBF24" stroke="none" />

            {/* Cuộn Văn bằng Tốt nghiệp (Diploma Scroll) */}
            <rect x="114" y="178" width="72" height="15" rx="3" strokeWidth="1.4" />
            <path d="M 150 174 L 150 196" strokeWidth="1.4" stroke="#FBBF24" />
            <path d="M 146 196 L 154 196" strokeWidth="1.4" stroke="#FBBF24" />

            {/* Ngôi sao chứng thực đỉnh và đáy */}
            <polygon
              points="150,44 153,52 161,52 155,57 157,65 150,60 143,65 145,57 139,52 147,52"
              fill="#FBBF24"
              stroke="none"
            />
            <polygon
              points="150,238 153,246 161,246 155,251 157,259 150,254 143,259 145,251 139,246 147,246"
              fill="#FBBF24"
              stroke="none"
            />
          </svg>
        </div>

        {/* 4. CHÒM SAO TRI THỨC ĐIỂM XUYẾT GÓC TRÊN TRÁI */}
        <div
          aria-hidden="true"
          className="absolute left-6 sm:left-12 lg:left-16 top-6 sm:top-10 pointer-events-none select-none opacity-[0.25] sm:opacity-[0.32] hidden sm:block z-[1]"
        >
          <svg className="w-20 sm:w-26 h-auto text-blue-100" viewBox="0 0 140 100" fill="none">
            <path d="M20 12L22 19L29 21L22 23L20 30L18 23L11 21L18 19L20 12Z" fill="#FBBF24" opacity="0.85" />
            <path d="M110 20L111 24L115 25L111 26L110 30L109 26L105 25L109 24L110 20Z" fill="#93C5FD" opacity="0.85" />
          </svg>
        </div>

        {/* 5. CUỘN BẰNG DANH DỰ Ở GÓC DƯỚI BÊN TRÁI */}
        <div
          aria-hidden="true"
          className="absolute left-8 sm:left-14 bottom-8 sm:bottom-12 pointer-events-none select-none opacity-[0.22] sm:opacity-[0.28] hidden sm:block z-[1]"
        >
          <svg className="w-24 sm:w-32 h-auto text-blue-100" viewBox="0 0 160 110" fill="none">
            <g transform="translate(10, 10) rotate(-6)">
              <rect x="25" y="30" width="85" height="18" rx="4" fill="rgba(255,255,255,0.75)" stroke="#93C5FD" strokeWidth="1.8" />
              <path d="M60 28 L60 50" stroke="#F59E0B" strokeWidth="2.5" />
              <circle cx="60" cy="51" r="5" fill="#F59E0B" />
              <path d="M60 54 L54 68 L60 64 L66 68 Z" fill="#FBBF24" />
            </g>
          </svg>
        </div>

        {/* 2. KHỐI TIÊU ĐỀ & THANH SPOTLIGHT: CĂN GIỮA NGUYÊN BẢN, TRƯỢT LƯỚT SIÊU MƯỢT ĐỒNG BỘ 100% */}
        <motion.div
          animate={{ y: isMobile ? 0 : heroGlideY }}
          transition={{
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-full max-w-[1080px] mx-auto flex flex-col items-center text-center relative z-20 sm:transform"
        >
          {/* Tiêu đề cổng tra cứu: Cố định vị trí tự nhiên, không reflow margin gây giật khung */}
          <h1 className="text-[22px] min-[360px]:text-[24px] sm:text-4xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.25] drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)] max-w-[340px] sm:max-w-none origin-center mb-1.5 sm:mb-3.5">
            Cổng Tra Cứu Văn Bằng Chứng Chỉ
          </h1>

          {/* Phụ đề mô tả quyền hạn và dịch vụ: Luôn ổn định trong layout, không làm giật khung khi mở */}
          <p className="text-[12px] min-[360px]:text-[13px] sm:text-[15.5px] text-blue-100/90 max-w-[320px] sm:max-w-xl mx-auto font-normal leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)] mb-3.5 sm:mb-8">
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
              onOpenStateChange={setSpotlightState}
            />
          </div>
        </motion.div>

        {/* 3. ĐƯỜNG LƯỢN SÓNG CHUYỂN NỀN MỀM MẠI Ở CHÂN TRANG NỐI VÀO NỀN DƯỚI (CHỈ TRÊN DESKTOP) */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute -bottom-px left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10"
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
        isSpotlightOpen={spotlightState.isOpen}
      />

      {/* 5. FOOTER */}
      <Footer />
    </div>
  );
}
