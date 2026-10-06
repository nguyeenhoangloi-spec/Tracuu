'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, ArrowDown } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-gray-900 relative">

      {/* 1. NAVBAR */}
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 2. HERO STAGE - NỀN XANH HỌC THUẬT DNC CHUYỂN SẮC SANG TRỌNG, NÂNG TONE TRẮNG SÁNG, KHÔNG DÙNG HÌNH 3D CẮT CỤT */}
      <section
        id="hero-stage"
        className="relative min-h-[285px] sm:min-h-[400px] lg:min-h-[430px] flex flex-col justify-start items-center pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-24 lg:pb-26 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-[#0F275A] via-[#1E3A8A] to-[#1E40AF]"
      >
        {/* 1. LỚP ẢNH KHUÔN VIÊN TRƯỜNG ĐH KIẾN TRÚC HỌC THUẬT SIÊU NÉT (SHARP CAMPUS ARCHITECTURE, ZERO TEXT) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-cover bg-center opacity-[0.14] mix-blend-luminosity select-none"
          style={{
            backgroundImage: "url('/campus_architecture_sharp.jpg')",
            backgroundPosition: 'center 40%',
            filter: 'contrast(125%) brightness(105%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 95%)',
          }}
        />

        {/* 2. LỚP HOA VĂN BẢO MẬT PHÔI VĂN BẰNG (GUILLOCHE SECURITY WATERMARK CHUẨN ĐẠI HỌC) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.04] overflow-hidden select-none [mask-image:radial-gradient(ellipse_80%_65%_at_50%_45%,rgba(0,0,0,0.35)_0%,black_100%)]"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="hero-academic-guilloche"
                width="120"
                height="120"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="60" cy="60" r="28" fill="none" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="3 3" />
                <circle cx="60" cy="60" r="44" fill="none" stroke="#93C5FD" strokeWidth="0.6" />
                <path d="M 60 12 C 40 36 40 84 60 108 C 80 84 80 36 60 12 Z" fill="none" stroke="#BFDBFE" strokeWidth="0.75" />
                <path d="M 12 60 C 36 40 84 40 108 60 C 84 80 36 80 12 60 Z" fill="none" stroke="#BFDBFE" strokeWidth="0.75" />
                <path d="M 0 60 Q 30 12 60 12 Q 90 12 120 60 Q 90 108 60 108 Q 30 108 0 60" fill="none" stroke="#FFFFFF" strokeWidth="0.7" />
                <path d="M 60 0 Q 12 30 12 60 Q 12 90 60 120 Q 108 90 108 60 Q 108 30 60 0" fill="none" stroke="#FFFFFF" strokeWidth="0.7" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-academic-guilloche)" />
          </svg>
        </div>

        {/* 3. BIỂU TRƯNG VÒNG NGUYỆT QUẾ TRI THỨC & NÓN CỬ NHÂN HỌC THUẬT ẨN CHÌM NGHỆ THUẬT */}
        <div
          aria-hidden="true"
          className="absolute -top-10 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-10 lg:right-24 w-[320px] sm:w-[380px] h-[320px] sm:h-[380px] pointer-events-none opacity-[0.05] text-white select-none"
        >
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Vòng tròn đồng tâm la bàn tri thức */}
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="76" stroke="currentColor" strokeWidth="1" />
            <circle cx="100" cy="100" r="62" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" />
            {/* Biểu tượng nón cử nhân học thuật */}
            <path d="M 100 62 L 148 84 L 100 106 L 52 84 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
            <path d="M 72 94 L 72 118 C 72 128 128 128 128 118 L 128 94" stroke="currentColor" strokeWidth="1.8" />
            <path d="M 148 84 L 148 122 C 148 126 142 128 142 134" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="142" cy="136" r="3" fill="currentColor" />
            {/* Vòng nguyệt quế hai bên */}
            <path d="M 45 135 C 35 110 40 75 60 55" stroke="currentColor" strokeWidth="1.2" />
            <path d="M 155 135 C 165 110 160 75 140 55" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>

        {/* 4. LUỒNG SÁNG HÀO QUANG DỊU MẮT TẬP TRUNG VÀO TIÊU ĐỀ */}
        <div
          aria-hidden="true"
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-blue-400/20 rounded-full blur-3xl pointer-events-none"
        />

        {/* Khối nội dung tiêu đề: Căn giữa sang trọng, chữ trắng sáng tinh khôi */}
        <div className="w-full max-w-5xl mx-auto relative z-10 px-2 sm:px-4 flex flex-col items-center text-center mt-2 sm:mt-4 lg:mt-5">
          {/* Slider Tiêu đề lớn & Đoạn giới thiệu súc tích trượt ngang đồng bộ khi đổi tab */}
          <div className="w-full overflow-hidden max-w-4xl">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform:
                  activeTab === 'vanbang'
                    ? 'translate3d(0%, 0, 0)'
                    : activeTab === 'cntt'
                      ? 'translate3d(-100%, 0, 0)'
                      : 'translate3d(-200%, 0, 0)',
              }}
            >
              {/* Tab 1: Văn bằng tốt nghiệp */}
              <div className="w-full flex-shrink-0 text-center px-1 sm:px-2">
                <h1 className="animate-hero-title text-[22px] min-[360px]:text-[24px] min-[390px]:text-[26.5px] sm:text-[36px] md:text-[40px] lg:text-[44px] font-bold tracking-[-0.03em] sm:tracking-tight text-white leading-tight sm:leading-[1.18] [text-wrap:balance] drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
                  Tra cứu văn bằng tốt nghiệp
                </h1>
                <p className="animate-hero-desc text-[15px] sm:text-[16.5px] lg:text-[18px] text-blue-100/95 font-normal sm:font-medium mt-3 sm:mt-3.5 leading-relaxed max-w-4xl mx-auto [text-wrap:balance] drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                  Tra cứu thông tin và xác thực giá trị pháp lý văn bằng tốt nghiệp trực tuyến.
                </p>
              </div>

              {/* Tab 2: CNTT */}
              <div className="w-full flex-shrink-0 text-center px-1 sm:px-2">
                <h1 className="animate-hero-title text-[22px] min-[360px]:text-[24px] min-[390px]:text-[26.5px] sm:text-[36px] md:text-[40px] lg:text-[44px] font-bold tracking-[-0.03em] sm:tracking-tight text-white leading-tight sm:leading-[1.18] [text-wrap:balance] drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
                  Tra cứu chứng chỉ CNTT
                </h1>
                <p className="animate-hero-desc text-[15px] sm:text-[16.5px] lg:text-[18px] text-blue-100/95 font-normal sm:font-medium mt-3 sm:mt-3.5 leading-relaxed max-w-4xl mx-auto [text-wrap:balance] drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                  Tra cứu thông tin và xác thực giá trị pháp lý chứng chỉ ứng dụng công nghệ thông tin.
                </p>
              </div>

              {/* Tab 3: VSTEP */}
              <div className="w-full flex-shrink-0 text-center px-1 sm:px-2">
                <h1 className="animate-hero-title text-[22px] min-[360px]:text-[24px] min-[390px]:text-[26.5px] sm:text-[36px] md:text-[40px] lg:text-[44px] font-bold tracking-[-0.03em] sm:tracking-tight text-white leading-tight sm:leading-[1.18] [text-wrap:balance] drop-shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
                  Tra cứu chứng chỉ VSTEP
                </h1>
                <p className="animate-hero-desc text-[15px] sm:text-[16.5px] lg:text-[18px] text-blue-100/95 font-normal sm:font-medium mt-3 sm:mt-3.5 leading-relaxed max-w-4xl mx-auto [text-wrap:balance] drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                  Tra cứu thông tin và xác thực giá trị pháp lý chứng chỉ VSTEP trực tuyến.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KHUNG TRA CỨU TRUNG TÂM (GỐI NHẸ LÊN CHÂN NỀN XANH HỌC THUẬT) */}
      <main
        id="khung-tra-cuu"
        ref={cardSectionRef}
        className="w-full bg-[#FFFFFF] relative z-20 pb-20 sm:pb-24 pt-0"
      >
        <div className="w-full max-w-3xl lg:max-w-4xl xl:max-w-[980px] 2xl:max-w-[1020px] mx-auto px-4 sm:px-6 -mt-9 sm:-mt-12 lg:-mt-14 relative">
          <div
            id="khung-tra-cuu-card"
            className={`card-wrapper form-card-reveal relative bg-white border-0 border-none shadow-[0_20px_50px_-15px_rgba(15,23,42,0.12),0_0_1px_1px_rgba(0,0,0,0.04)] ${isCardRevealed ? 'active' : ''
              }`}
          >
            {/* LỚP BÓNG TRONG PHẢN CHIẾU ÁNH SÁNG MẶT KÍNH TRÊN NỀN TRẮNG (GLOSSY CRYSTAL SHEEN) */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[36px] sm:rounded-[38px] overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white via-white/50 to-transparent" />
              <div className="absolute -top-24 left-1/4 w-[480px] h-[200px] bg-gradient-to-b from-blue-100/35 via-white/60 to-transparent rounded-full blur-2xl" />
              {/* VỆT SÁNG PHA LÊ (CRYSTAL SHEEN) QUÉT NGANG KHI CARD XUẤT HIỆN */}
              <div className={`card-shine-sweep ${isCardRevealed ? 'active' : ''}`} />
            </div>

            {/* KHỐI NỘI DUNG PHÂN HỆ: CHUYỂN ĐỘNG SLIDER TRACK LIỀN MẠCH, TỰ ĐỘNG CO GIÃN CHIỀU CAO VỪA KHÍT TỪNG TAB */}
            <div
              className={`relative z-10 w-full overflow-hidden ${isSwitchingTab ? 'transition-[height] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]' : ''
                }`}
              style={{ height: isSwitchingTab && switchingHeight ? `${switchingHeight}px` : 'auto' }}
            >
              <div
                className="tab-carousel-track"
                style={{
                  transform:
                    activeTab === 'vanbang'
                      ? 'translate3d(0%, 0, 0)'
                      : activeTab === 'cntt'
                        ? 'translate3d(-33.333333%, 0, 0)'
                        : 'translate3d(-66.666666%, 0, 0)',
                }}
              >
                {/* PANE 1: VĂN BẰNG */}
                <div
                  ref={vanbangPaneRef}
                  className={`tab-carousel-pane px-1 pt-0.5 pb-1 transition-opacity duration-300 ${activeTab === 'vanbang'
                    ? 'opacity-100'
                    : `opacity-0 pointer-events-none ${!isSwitchingTab ? 'max-h-0 overflow-hidden' : ''}`
                    }`}
                >
                  <VanBangForm
                    resetTrigger={resetKey}
                    onSuccess={(data) => handleLookupSuccess('vanbang', data)}
                    onNotFound={(data) => handleLookupNotFound('vanbang', data)}
                    sampleData={sampleData.vanbang}
                    sampleToApply={sampleToApply}
                  />
                </div>

                {/* PANE 2: CNTT */}
                <div
                  ref={cnttPaneRef}
                  className={`tab-carousel-pane px-1 pt-0.5 pb-1 transition-opacity duration-300 ${activeTab === 'cntt'
                    ? 'opacity-100'
                    : `opacity-0 pointer-events-none ${!isSwitchingTab ? 'max-h-0 overflow-hidden' : ''}`
                    }`}
                >
                  <CnttForm
                    resetTrigger={resetKey}
                    onSuccess={(data) => handleLookupSuccess('cntt', data)}
                    onNotFound={(data) => handleLookupNotFound('cntt', data)}
                    sampleData={sampleData.cntt}
                    sampleToApply={sampleToApply}
                  />
                </div>

                {/* PANE 3: VSTEP */}
                <div
                  ref={vstepPaneRef}
                  className={`tab-carousel-pane px-1 pt-0.5 pb-1 transition-opacity duration-300 ${activeTab === 'vstep'
                    ? 'opacity-100'
                    : `opacity-0 pointer-events-none ${!isSwitchingTab ? 'max-h-0 overflow-hidden' : ''}`
                    }`}
                >
                  <VstepForm
                    resetTrigger={resetKey}
                    onSuccess={(data) => handleLookupSuccess('vstep', data)}
                    onNotFound={(data) => handleLookupNotFound('vstep', data)}
                    sampleData={sampleData.vstep}
                    sampleToApply={sampleToApply}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dòng ghi chú bên dưới (Footer Note) */}
        <p className="text-center text-xs sm:text-[13px] text-slate-500 mt-4 px-2 leading-relaxed">
          <span className="font-semibold text-slate-600">* Lưu ý:</span> Hệ thống chỉ hỗ trợ tra cứu các văn bằng, chứng chỉ do đơn vị đào tạo cấp và đã đồng bộ vào cơ sở dữ liệu số hóa.
        </p>

      </main>

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
            className="absolute inset-0 z-0 cursor-pointer select-none"
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
