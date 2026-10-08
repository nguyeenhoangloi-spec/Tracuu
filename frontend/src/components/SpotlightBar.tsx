'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  GraduationCap,
  Folder,
  Layers,
  LayoutGrid,
  CornerDownLeft,
  X,
  Award,
  Crown,
  BookOpen,
  Languages,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Laptop,
  Cpu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VanBangForm from './VanBangForm';
import CnttForm from './CnttForm';
import VstepForm from './VstepForm';

interface SpotlightBarProps {
  activeTab: 'vanbang' | 'cntt' | 'vstep';
  onTabChange: (tab: 'vanbang' | 'cntt' | 'vstep') => void;
  onSelectResult?: (type: 'vanbang' | 'cntt' | 'vstep', data: any) => void;
  onNotFound?: (type: 'vanbang' | 'cntt' | 'vstep', data: any) => void;
  onReset?: () => void;
  sampleData?: any;
  sampleToApply?: any;
  onOpenStateChange?: (state: { isOpen: boolean; isFormExpanded: boolean; panelHeight?: number }) => void;
}

// Cấu hình 7 Loại Bằng & Chứng chỉ xác thực chuẩn Apple Squircle
// "CÁC LOẠI BẰNG ĐỂ TRA CỨU: ĐẠI HỌC, THẠC SĨ, TIẾN SĨ... CHỨ KHÔNG CÓ PHÂN MÔN"
interface DegreeTypeConfig {
  id: string;
  category: 'vanbang' | 'cntt' | 'vstep';
  loaiDaoTao?: string;
  capDo?: 'coban' | 'nangcao';
  title: string;
  subTitle: string;
  badge: string;
  gradient: string;
  shadow: string;
  icon: any;
}

const DEGREE_TYPES: DegreeTypeConfig[] = [
  {
    id: 'dh',
    category: 'vanbang',
    loaiDaoTao: 'dh',
    title: 'Bằng Đại học',
    subTitle: 'Đại học chính quy',
    badge: 'Đại học',
    gradient: 'from-[#1E40AF] via-[#2563EB] to-[#3B82F6]',
    shadow: 'shadow-blue-600/35',
    icon: GraduationCap,
  },
  {
    id: 'ths',
    category: 'vanbang',
    loaiDaoTao: 'ths',
    title: 'Bằng Thạc sĩ',
    subTitle: 'Đào tạo Sau đại học',
    badge: 'Thạc sĩ',
    gradient: 'from-[#581C87] via-[#7C3AED] to-[#9333EA]',
    shadow: 'shadow-purple-600/35',
    icon: Award,
  },
  {
    id: 'ts',
    category: 'vanbang',
    loaiDaoTao: 'ts',
    title: 'Bằng Tiến sĩ',
    subTitle: 'Học vị Tiến sĩ',
    badge: 'Tiến sĩ',
    gradient: 'from-[#92400E] via-[#D97706] to-[#F59E0B]',
    shadow: 'shadow-amber-600/35',
    icon: Crown,
  },
  {
    id: 'cntt-cb',
    category: 'cntt',
    capDo: 'coban',
    title: 'CNTT Cơ bản',
    subTitle: 'Chuẩn TT 03/2014',
    badge: 'CNTT Cơ bản',
    gradient: 'from-[#0369A1] via-[#0284C7] to-[#0EA5E9]',
    shadow: 'shadow-cyan-600/35',
    icon: Laptop,
  },
  {
    id: 'cntt-nc',
    category: 'cntt',
    capDo: 'nangcao',
    title: 'CNTT Nâng cao',
    subTitle: 'Chuẩn TT 03/2014',
    badge: 'CNTT Nâng cao',
    gradient: 'from-[#0F766E] via-[#0D9488] to-[#14B8A6]',
    shadow: 'shadow-teal-600/35',
    icon: Cpu,
  },
  {
    id: 'vstep',
    category: 'vstep',
    title: 'Chứng chỉ VSTEP',
    subTitle: 'Tiếng Anh B1 - C1',
    badge: 'VSTEP',
    gradient: 'from-[#9F1239] via-[#E11D48] to-[#F43F5E]',
    shadow: 'shadow-rose-600/35',
    icon: Languages,
  },
  {
    id: 'cd',
    category: 'vanbang',
    loaiDaoTao: 'cd',
    title: 'Bằng Cao đẳng',
    subTitle: 'Chính quy',
    badge: 'Cao đẳng',
    gradient: 'from-[#065F46] via-[#059669] to-[#10B981]',
    shadow: 'shadow-emerald-600/35',
    icon: BookOpen,
  },
];

function normalizeText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

export default function SpotlightBar({
  activeTab,
  onTabChange,
  onSelectResult,
  onNotFound,
  onReset,
  sampleData = { vanbang: [], cntt: [], vstep: [] },
  sampleToApply,
  onOpenStateChange,
}: SpotlightBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isSwitchingView, setIsSwitchingView] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const [selectedLoaiDaoTao, setSelectedLoaiDaoTao] = useState('dh');
  const [selectedCapDo, setSelectedCapDo] = useState<'coban' | 'nangcao'>('coban');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'dh' | 'sdh' | 'cntt' | 'vstep'>('all');
  const [selectedDegree, setSelectedDegree] = useState<DegreeTypeConfig>(DEGREE_TYPES[0]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Khóa cuộn trang nền khi mở Bottom Sheet trên mobile
  useEffect(() => {
    const isOpen = isFocused || isFormExpanded;
    if (isOpen && typeof window !== 'undefined' && window.innerWidth < 640) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFocused, isFormExpanded]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [gridHeight, setGridHeight] = useState<number>(265);
  const [formHeight, setFormHeight] = useState<number>(350);

  // Hàm cập nhật trạng thái mở/đóng đồng bộ tức thì 0ms sang component cha (page.tsx)
  const updateOpenState = (newFocused: boolean, newFormExpanded: boolean) => {
    if (newFormExpanded !== isFormExpanded) {
      setIsSwitchingView(true);
      setSlideDirection(newFormExpanded ? 'forward' : 'backward');
    }
    setIsFocused(newFocused);
    setIsFormExpanded(newFormExpanded);
    if (!newFocused && !newFormExpanded) {
      setIsSwitchingView(false);
    }
    const currentH = (newFocused || newFormExpanded)
      ? (newFormExpanded ? formHeight : gridHeight)
      : 0;
    onOpenStateChange?.({
      isOpen: newFocused || newFormExpanded,
      isFormExpanded: newFormExpanded,
      panelHeight: currentH,
    });
  };

  // Lắng nghe phím tắt toàn cục ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        updateOpenState(true, isFormExpanded);
      }
      if (e.key === 'Escape') {
        // Nếu modal xác thực bảo mật reCAPTCHA đang mở: để modal tự xử lý đóng của nó, TUYỆT ĐỐI KHÔNG đóng form SpotlightBar
        if (document.getElementById('security-captcha-overlay')) {
          return;
        }
        updateOpenState(false, false);
        setCategoryFilter('all');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Đóng cửa sổ khi click ra ngoài container (Bảo vệ không đóng khi click chọn ngày DatePicker hoặc reCAPTCHA)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 0. Nếu đang có modal xác thực bảo mật reCAPTCHA (#security-captcha-overlay) trên màn hình hoặc click tương tác với modal này:
      // TUYỆT ĐỐI KHÔNG đóng form SpotlightBar!
      if (
        document.getElementById('security-captcha-overlay') ||
        target.closest('#security-captcha-overlay')
      ) {
        return;
      }

      // KHÔNG đóng form khi người dùng click vào:
      // 1. Popover chọn ngày (DatePicker) hoặc Dropdown của LabelInput (.lbi-popover-shell)
      // 2. Icon nút mở lịch (.calendar-icon-btn)
      // 3. Popup thử thách hình ảnh / widget của Google reCAPTCHA
      // 4. Các role dialog / listbox portaled vào document.body
      // 5. Khối hồ sơ mẫu thử nghiệm QuickSampleWidget
      if (
        target.closest('.lbi-popover-shell') ||
        target.closest('.calendar-icon-btn') ||
        target.closest('[role="dialog"]') ||
        target.closest('[role="listbox"]') ||
        target.closest('#google-recaptcha-widget') ||
        target.closest('[id^="captcha-"]') ||
        target.closest('.recaptcha-clean-wrapper') ||
        target.closest('iframe') ||
        target.closest('div[style*="z-index: 2000000000"]') ||
        target.closest('div[style*="z-index: 99999"]') ||
        target.closest('#quick-sample-widget') ||
        target.closest('[data-quick-sample]')
      ) {
        return;
      }

      if (containerRef.current && !containerRef.current.contains(target)) {
        updateOpenState(false, false);
        setCategoryFilter('all');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lắng nghe khi người dùng bấm chọn 1 hồ sơ mẫu từ QuickSampleWidget
  useEffect(() => {
    if (!sampleToApply || !sampleToApply.data) return;
    const { tab, data } = sampleToApply;
    const targetTab = (tab || activeTab || 'vanbang') as 'vanbang' | 'cntt' | 'vstep';

    if (targetTab !== activeTab) {
      onTabChange(targetTab);
    }

    if (targetTab === 'vanbang') {
      const loai = data.loai_dao_tao || 'dh';
      setSelectedLoaiDaoTao(loai);
      const matched =
        DEGREE_TYPES.find((d) => d.category === 'vanbang' && d.loaiDaoTao === loai) ||
        DEGREE_TYPES[0];
      setSelectedDegree(matched);
    } else if (targetTab === 'cntt') {
      const cap = (data.cap_do || 'coban') as 'coban' | 'nangcao';
      setSelectedCapDo(cap);
      const matched =
        DEGREE_TYPES.find((d) => d.category === 'cntt' && d.capDo === cap) ||
        DEGREE_TYPES[3];
      setSelectedDegree(matched);
    } else if (targetTab === 'vstep') {
      const matched = DEGREE_TYPES.find((d) => d.category === 'vstep') || DEGREE_TYPES[5];
      setSelectedDegree(matched);
    }

    // Mở bung form ra ngay lập tức
    setIsSwitchingView(true);
    setSlideDirection('forward');
    updateOpenState(true, true);
  }, [sampleToApply]);

  // Kiểm tra 6 biểu tượng Loại Bằng có khớp danh mục hoặc từ khóa hay không (không cắt xén bớt để tránh rung giật khung)
  const isDegreeMatch = (deg: DegreeTypeConfig) => {
    // 1. Lọc theo danh mục
    if (categoryFilter === 'dh') {
      if (deg.category !== 'vanbang') return false;
    } else if (categoryFilter === 'sdh') {
      if (deg.id !== 'ths' && deg.id !== 'ts') return false;
    } else if (categoryFilter === 'cntt') {
      if (deg.category !== 'cntt') return false;
    } else if (categoryFilter === 'vstep') {
      if (deg.category !== 'vstep') return false;
    }

    // 2. Lọc theo từ khóa gõ
    const qNorm = normalizeText(query);
    if (qNorm) {
      const titleNorm = normalizeText(deg.title);
      const subNorm = normalizeText(deg.subTitle);
      const badgeNorm = normalizeText(deg.badge);
      return titleNorm.includes(qNorm) || subNorm.includes(qNorm) || badgeNorm.includes(qNorm);
    }

    return true;
  };


  // Trạng thái mở của cửa sổ Spotlight
  const isWindowOpen = isFocused || isFormExpanded;

  // Đồng bộ trạng thái mở/đóng lên component cha (page.tsx) làm fallback an toàn
  useEffect(() => {
    onOpenStateChange?.({
      isOpen: isWindowOpen,
      isFormExpanded,
      panelHeight: isWindowOpen ? (isFormExpanded ? formHeight : gridHeight) : 0,
    });
  }, [isWindowOpen, isFormExpanded, formHeight, gridHeight, onOpenStateChange]);

  // 1. Đo đạc chiều cao độc lập của Lưới Launchpad (Grid view)
  useEffect(() => {
    if (!gridRef.current) return;
    const initialH = Math.round(gridRef.current.getBoundingClientRect().height);
    if (initialH >= 140) setGridHeight(initialH);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = Math.round(
          entry.borderBoxSize?.[0]?.blockSize ?? entry.target.getBoundingClientRect().height
        );
        if (h >= 140) {
          setGridHeight(h);
        }
      }
    });
    ro.observe(gridRef.current);
    return () => ro.disconnect();
  }, [isWindowOpen, isFormExpanded, categoryFilter, query]);

  // 2. Đo đạc chiều cao độc lập của Form tra cứu (Form view)
  useEffect(() => {
    if (!formRef.current) return;
    const initialH = Math.round(formRef.current.getBoundingClientRect().height);
    if (initialH >= 140) setFormHeight(initialH);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = Math.round(
          entry.borderBoxSize?.[0]?.blockSize ?? entry.target.getBoundingClientRect().height
        );
        if (h >= 140) {
          setFormHeight(h);
        }
      }
    });
    ro.observe(formRef.current);
    return () => ro.disconnect();
  }, [isWindowOpen, isFormExpanded, activeTab, selectedDegree]);

  const currentTargetHeight = isFormExpanded ? formHeight : gridHeight;

  // Xử lý khi nhấn chọn 1 loại bằng từ Grid -> Chuyển cảnh mượt sang Form
  const handleSelectDegreeType = (deg: DegreeTypeConfig) => {
    setIsSwitchingView(true);
    setSlideDirection('forward');
    setSelectedDegree(deg);
    onTabChange(deg.category);
    if (deg.loaiDaoTao) {
      setSelectedLoaiDaoTao(deg.loaiDaoTao);
    }
    if (deg.capDo) {
      setSelectedCapDo(deg.capDo);
    } else if (deg.category === 'cntt') {
      setSelectedCapDo('coban');
    }
    updateOpenState(true, true);
  };

  // Nút Tra cứu từ input
  const handleDirectSearch = () => {
    updateOpenState(true, false);
  };

  // 3 Nút Companion trên thanh Spotlight: LỌC DANH MỤC TRONG LƯỚI & ĐỒNG BỘ TAB - MỞ BOTTOM SHEET TRÊN MOBILE KHÔNG GIẬT KHUNG
  const handleCompanionFilterClick = (filterCategory: 'dh' | 'cntt' | 'vstep') => {
    setCategoryFilter(filterCategory);
    if (filterCategory === 'dh') {
      onTabChange('vanbang');
      const matched = DEGREE_TYPES.find((d) => d.id === 'dh');
      if (matched) setSelectedDegree(matched);
    } else if (filterCategory === 'cntt') {
      onTabChange('cntt');
      const matched = DEGREE_TYPES.find((d) => d.id === 'cntt-cb');
      if (matched) setSelectedDegree(matched);
    } else if (filterCategory === 'vstep') {
      onTabChange('vstep');
      const matched = DEGREE_TYPES.find((d) => d.id === 'vstep');
      if (matched) setSelectedDegree(matched);
    }
    // Mở Bottom Sheet mượt mà từ đáy màn hình, tuyệt đối không đẩy khung nền
    updateOpenState(true, false);
  };

  // Cấu hình tiêu đề header động chuẩn Apple macOS Utility ([Icon] Tên danh mục — Tên cụ thể/mô tả)
  const headerConfig = useMemo(() => {
    // 1. Nhóm Công nghệ thông tin (khi bấm nút tròn Laptop)
    if (categoryFilter === 'cntt') {
      return {
        icon: Laptop,
        main: 'Công nghệ thông tin',
        sub: 'Chuẩn kỹ năng CNTT',
      };
    }
    // 2. Nhóm Ngoại ngữ VSTEP (khi bấm nút tròn Ngoại ngữ)
    if (categoryFilter === 'vstep') {
      return {
        icon: Languages,
        main: 'Ngoại ngữ',
        sub: 'Chứng chỉ Tiếng Anh VSTEP',
      };
    }
    // 3. Nhóm Văn bằng tốt nghiệp (khi bấm nút tròn Mũ cử nhân)
    if (categoryFilter === 'dh' || categoryFilter === 'sdh') {
      return {
        icon: GraduationCap,
        main: 'Văn bằng',
        sub: 'Bằng tốt nghiệp ĐH, ThS, TS',
      };
    }
    // 4. Mặc định ban đầu khi chưa bấm chọn nút nào (categoryFilter === 'all')
    return {
      icon: LayoutGrid,
      main: 'Tra cứu',
      sub: 'Chọn loại bằng / chứng chỉ',
    };
  }, [categoryFilter]);

  // Animation chuyển đổi siêu mượt chuẩn Apple giữa Chế độ Lưới và Chế độ Form
  const viewVariants = {
    enter: (direction: 'forward' | 'backward') => ({
      opacity: 0,
      y: direction === 'forward' ? 12 : -12,
      scale: 0.99,
      filter: 'blur(3px)',
    }),
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.40,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
    exit: (direction: 'forward' | 'backward') => ({
      opacity: 0,
      y: direction === 'forward' ? -10 : 10,
      scale: 0.99,
      filter: 'blur(3px)',
      transition: {
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center relative z-40">
      {/* ========================================================================= */}
      {/* 1. THANH APPLE SPOTLIGHT SEARCH CHUẨN MACOS: TO RỘNG, KÍNH MỜ             */}
      {/* ========================================================================= */}
      <div className="w-full max-w-[980px] px-2 flex flex-col sm:flex-row items-center gap-3 sm:gap-3.5 relative z-30">

        {/* THANH TÌM KIẾM VIÊN THUỐC CHUẨN APPLE SPOTLIGHT */}
        <div className="relative flex-1 w-full min-w-0">
          <div
            onClick={() => {
              if (!isMobile) {
                inputRef.current?.focus();
              }
              updateOpenState(true, false);
            }}
            className={`w-full h-[54px] sm:h-[66px] rounded-full backdrop-blur-3xl transition-[background-color,border-color,box-shadow,transform] duration-300 flex items-center px-3.5 sm:px-6 gap-2.5 sm:gap-3.5 outline-none focus:outline-none cursor-pointer sm:cursor-text select-none sm:select-auto ${isWindowOpen
                ? 'bg-white scale-[1.012] border border-blue-500/50 shadow-[0_24px_65px_-10px_rgba(20,43,111,0.28),0_0_0_4px_rgba(37,99,235,0.18),inset_0_1.5px_2px_rgba(255,255,255,1)]'
                : 'bg-white/95 hover:bg-white border border-white/80 shadow-[0_18px_45px_-10px_rgba(15,39,90,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.9)]'
              }`}
            style={{
              WebkitBackdropFilter: 'blur(30px) saturate(190%)',
              backdropFilter: 'blur(30px) saturate(190%)',
            }}
          >
            {/* Kính lúp icon: Hiệu ứng chuyển màu và zoom xoay nhẹ khi focus chuẩn Apple */}
            <motion.div
              animate={{
                scale: isWindowOpen ? 1.12 : 1,
                rotate: isWindowOpen ? -6 : 0,
              }}
              transition={{ type: 'spring', damping: 20, stiffness: 350 }}
              className={`flex-shrink-0 transition-colors duration-200 ${isWindowOpen ? 'text-blue-600' : 'text-[#142B6F]'
                }`}
            >
              <Search className="w-5 h-5 sm:w-[26px] sm:h-[26px] stroke-[2.3]" />
            </motion.div>

            {/* Input gõ tìm kiếm: Trên Mobile đóng vai trò trigger mở Bottom Sheet chống bật bàn phím ảo gây giật màn hình */}
            <input
              ref={inputRef}
              type="text"
              id="spotlight-search-input"
              name="degree_search_term"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-lpignore="true"
              data-form-type="other"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              readOnly={isMobile}
              onClick={(e) => {
                if (isMobile) {
                  e.preventDefault();
                  updateOpenState(true, false);
                } else {
                  updateOpenState(true, isFormExpanded);
                }
              }}
              onFocus={(e) => {
                if (isMobile) {
                  e.target.blur(); // Chống giật bàn phím ảo trên mobile
                  updateOpenState(true, false);
                  return;
                }
                updateOpenState(true, isFormExpanded);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleDirectSearch();
                }
              }}
              placeholder="Nhập họ tên, mã văn bằng hoặc chọn bên dưới..."
              className="flex-1 h-full py-0 my-0 min-w-0 bg-transparent text-[14px] sm:text-[17px] text-slate-900 placeholder:text-slate-400 font-medium tracking-tight outline-none focus:outline-none focus:ring-0 border-0 caret-blue-600"
              style={{
                backgroundColor: 'transparent',
                background: 'transparent',
                boxShadow: 'none',
                border: 'none',
                outline: 'none',
              }}
            />

            {/* Xóa nhanh */}
            {query && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="p-1 sm:p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer outline-none focus:outline-none"
                title="Xóa nội dung"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.4]" />
              </button>
            )}

            {/* Nút Tra cứu nhanh: Phản hồi tương tác mượt mà chuẩn Apple */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleDirectSearch();
              }}
              data-ripple="rgba(255, 255, 255, 0.35)"
              className={`relative overflow-hidden inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-white text-[12.5px] sm:text-[14.5px] font-semibold transition-all duration-200 cursor-pointer shrink-0 select-none border-0 outline-none focus:outline-none focus-visible:outline-none ring-0 ${isWindowOpen || query.trim()
                  ? 'bg-gradient-to-r from-[#142B6F] to-[#2563EB] shadow-[0_4px_16px_rgba(37,99,235,0.4)]'
                  : 'bg-[#142B6F] hover:bg-[#0F1E4A] shadow-[0_4px_16px_rgba(20,43,111,0.3)]'
                }`}
              title="Tra cứu ngay"
            >
              <span className="relative z-10">Tra cứu</span>
              <CornerDownLeft className="w-3.5 h-3.5 text-blue-200 hidden min-[400px]:inline relative z-10" />
            </motion.button>
          </div>
        </div>

        {/* 3 NÚT TRÒN COMPANION: TỐI ƯU GỌN GÀNG VỪA TAY TRÊN MOBILE */}
        <div className="flex items-center gap-3 sm:gap-3 shrink-0">

          {/* Nút 1: Bằng Đại học (GraduationCap) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleCompanionFilterClick('dh')}
            data-ripple="rgba(215, 33, 52, 0.28)"
            className={`relative overflow-hidden w-[50px] h-[50px] sm:w-[66px] sm:h-[66px] rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-0 border-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 active:outline-none active:border-0 select-none ${categoryFilter === 'dh' && isFocused && !isFormExpanded
                ? 'bg-[#142B6F] text-white shadow-[0_12px_28px_rgba(20,43,111,0.45)] scale-105'
                : 'bg-white hover:bg-white text-[#142B6F] shadow-[0_8px_20px_-4px_rgba(15,39,90,0.14)]'
              }`}
            style={{ border: 'none', outline: 'none' }}
            title="Lọc: Bằng tốt nghiệp Đại học / Cao đẳng"
          >
            <GraduationCap className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2] relative z-10" />
          </motion.button>

          {/* Nút 2: Chứng chỉ CNTT (FolderCode - Chuẩn icon CNTT) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleCompanionFilterClick('cntt')}
            data-ripple="rgba(215, 33, 52, 0.28)"
            className={`relative overflow-hidden w-[50px] h-[50px] sm:w-[66px] sm:h-[66px] rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-0 border-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 active:outline-none active:border-0 select-none ${categoryFilter === 'cntt' && isFocused && !isFormExpanded
                ? 'bg-[#142B6F] text-white shadow-[0_12px_28px_rgba(20,43,111,0.45)] scale-105'
                : 'bg-white hover:bg-white text-[#142B6F] shadow-[0_8px_20px_-4px_rgba(15,39,90,0.14)]'
              }`}
            style={{ border: 'none', outline: 'none' }}
            title="Lọc: Chứng chỉ Ứng dụng CNTT"
          >
            <Laptop className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2] relative z-10" />
          </motion.button>

          {/* Nút 3: Chứng chỉ VSTEP (Languages - Chuẩn icon Ngoại ngữ VSTEP) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleCompanionFilterClick('vstep')}
            data-ripple="rgba(215, 33, 52, 0.28)"
            className={`relative overflow-hidden w-[50px] h-[50px] sm:w-[66px] sm:h-[66px] rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-0 border-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 active:outline-none active:border-0 select-none ${categoryFilter === 'vstep' && isFocused && !isFormExpanded
                ? 'bg-[#142B6F] text-white shadow-[0_12px_28px_rgba(20,43,111,0.45)] scale-105'
                : 'bg-white hover:bg-white text-[#142B6F] shadow-[0_8px_20px_-4px_rgba(15,39,90,0.14)]'
              }`}
            style={{ border: 'none', outline: 'none' }}
            title="Lọc: Chứng chỉ Tiếng Anh VSTEP"
          >
            <Languages className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.2] relative z-10" />
          </motion.button>
        </div>
      </div>

      {/* LINK KHÁM PHÁ NHANH DANH MỤC: HIỆN KHI ĐÓNG; KHI MỞ THÌ CARD ĐÈ LÊN LUÔN.
          Mặt nạ overflow-hidden có mép trên sát đáy thanh tìm kiếm => khi tải trang link trượt xuống mượt mà từ thanh. */}
      <div
        className={`mt-2.5 sm:mt-3.5 pb-1 overflow-hidden z-20 transition-opacity duration-150 ${isWindowOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
      >
        <motion.button
          type="button"
          initial={{ y: -35, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            y: { duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.35, delay: 0.22 },
          }}
          onClick={() => {
            setCategoryFilter('all');
            updateOpenState(true, false);
          }}
          className="text-[13.5px] sm:text-[14.5px] text-white hover:text-white/90 underline underline-offset-4 decoration-white/70 hover:decoration-white font-medium transition-colors cursor-pointer select-none outline-none focus:outline-none"
        >
          Khám phá danh mục tra cứu
        </motion.button>
      </div>

      {/* ========================================================================= */}
      {/* 2. CỬA SỔ SPOTLIGHT NỔI TUYỆT ĐỐI (ABSOLUTE OVERLAY): NỀN XANH CỐ ĐỊNH 100% */}
      {/* NỀN XANH CỐ ĐỊNH KHÔNG BAO GIỜ BỊ ĐẨY XUỐNG DƯỚI, KHÔNG BAO GIỜ GIẬT KHUNG   */}
      {/* ========================================================================= */}
      <AnimatePresence initial={false}>
        {isWindowOpen && (
          <>
            {/* Lớp nền mờ tối trên Mobile giúp nổi bật Modal ở trên và đóng khi chạm ra ngoài - Đồng bộ 100% với backdrop popup kết quả */}
            <motion.div
              key="spotlight-mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              onClick={(e) => {
                if (document.getElementById('security-captcha-overlay')) {
                  return;
                }
                const target = e.target as HTMLElement | null;
                if (target?.closest('#quick-sample-widget') || target?.closest('[data-quick-sample]')) {
                  return;
                }
                updateOpenState(false, false);
                setCategoryFilter('all');
              }}
              className="fixed inset-0 bg-slate-950/25 backdrop-blur-[3.5px] z-[90] sm:hidden pointer-events-auto"
            />

            {/* Cửa sổ tra cứu: Trên Mobile mở dạng Bottom Sheet trượt từ đáy màn hình lên, Trên Desktop là dropdown neo sát dưới thanh search đè lên dòng link */}
            <motion.div
              key="spotlight-window-overlay"
              style={{
                transformOrigin: 'top center',
              }}
              initial={
                isMobile
                  ? { y: '100%' }
                  : { opacity: 0, y: -12, scale: 0.985 }
              }
              animate={
                isMobile
                  ? { y: 0 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                isMobile
                  ? {
                    y: '100%',
                    transition: { duration: 0.30, ease: [0.32, 0, 0.67, 0] },
                  }
                  : {
                    opacity: 0,
                    y: -8,
                    scale: 0.99,
                    transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
                  }
              }
              transition={
                isMobile
                  ? { duration: 0.40, ease: [0.22, 1, 0.36, 1] }
                  : {
                    duration: 0.40,
                    ease: [0.22, 1, 0.36, 1],
                  }
              }
              className="fixed inset-x-0 bottom-0 z-[100] sm:z-20 sm:absolute sm:top-[66px] sm:bottom-auto sm:inset-x-auto sm:left-0 sm:right-0 sm:pt-2 sm:px-2 flex justify-center pointer-events-auto"
            >
              <div className="w-full max-w-[980px] rounded-t-[36px] rounded-b-none sm:rounded-[38px] sm:rounded-b-[38px]">
                {/* Hộp card Apple: Bo góc rounded-t-[36px] trên mobile, sm:rounded-[38px] trên desktop, đổ bóng đồng bộ popup kết quả */}
                <motion.div
                  id="spotlight-card-panel"
                  className={`w-full rounded-t-[36px] rounded-b-none sm:rounded-[38px] sm:rounded-b-[38px] bg-white border-0 shadow-[0_24px_70px_-15px_rgba(15,23,42,0.28),0_10px_28px_-4px_rgba(15,23,42,0.12)] relative overflow-hidden no-scrollbar ${isFormExpanded
                      ? 'max-h-[88vh] sm:max-h-[min(540px,calc(100vh-210px))] overflow-y-auto pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:pb-0'
                      : 'max-h-[82vh] sm:max-h-none overflow-y-auto sm:overflow-hidden pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:pb-0'
                    }`}
                  style={{
                    backgroundColor: '#ffffff',
                    borderTopLeftRadius: isMobile ? '36px' : '38px',
                    borderTopRightRadius: isMobile ? '36px' : '38px',
                    borderBottomLeftRadius: isMobile ? '0px' : '38px',
                    borderBottomRightRadius: isMobile ? '0px' : '38px',
                    WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                    maskImage: 'radial-gradient(white, black)',
                    transform: 'translateZ(0)',
                    WebkitTransform: 'translateZ(0)',
                    isolation: 'isolate',
                    willChange: 'transform, height',
                  }}
                  animate={{
                    height: currentTargetHeight,
                  }}
                  transition={{
                    height: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                  }}
                >
                  {/* Vùng đo đạc ResizeObserver: container relative, phần tử thoát ra trở thành absolute nên không bao giờ lưu chiều cao thừa */}
                  <div className="w-full relative rounded-t-[36px] sm:rounded-t-[38px]">
                    {/* CHUYỂN CẢNH SIÊU MƯỢT MÀ CHUẨN APPLE: CROSSFADE MƯỢT KHÔNG BỊ GIẬT KHUNG VÀ KHÔNG CHỒNG ĐÈ CHIỀU CAO */}
                    <AnimatePresence mode="popLayout" custom={slideDirection} initial={false}>
                      {!isFormExpanded ? (
                        /* ===================================================================== */
                        /* CHẾ ĐỘ 1: LƯỚI BIỂU TƯỢNG CÁC LOẠI BẰNG CHUẨN MACOS LAUNCHPAD (7 ICONS) */
                        /* ===================================================================== */
                        <motion.div
                          key="spotlight-grid-view"
                          ref={gridRef}
                          custom={slideDirection}
                          variants={viewVariants}
                          initial={isSwitchingView ? "enter" : false}
                          animate="center"
                          exit="exit"
                          style={{ willChange: 'transform, opacity, filter' }}
                          className="w-full px-5 min-[390px]:px-6 sm:px-9 lg:px-10 pt-5.5 min-[390px]:pt-6 pb-2.5 sm:pt-4.5 sm:pb-4 rounded-t-[36px] sm:rounded-t-[38px]"
                        >
                          {/* Header: Thanh lịch, chuẩn Apple macOS Utility (Cỡ chữ 18px, nền xám pill dày dặn cao ráo) */}
                          <div className="flex items-center justify-between pb-3 sm:pb-4 mb-3.5 sm:mb-5 gap-3">
                            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                              {(() => {
                                const HeaderIcon = headerConfig.icon;
                                return <HeaderIcon className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-slate-800 stroke-[2.2] shrink-0" />;
                              })()}
                              <span className="text-[20px] sm:text-[22px] font-medium text-slate-900 tracking-tight leading-none shrink-0">
                                {headerConfig.main}
                              </span>
                              <span className="hidden sm:inline-flex items-center h-7 sm:h-[30px] px-2.5 sm:px-3 rounded-[8px] bg-slate-100 text-slate-500 text-[12px] sm:text-[13.5px] font-normal leading-none select-none shrink min-w-0 truncate">
                                — {headerConfig.sub}
                              </span>
                            </div>

                            {/* Nút đóng / thu gọn: Kích thước bự w-10 h-10 sm:w-11 sm:h-11 đồng bộ 100% với popup kết quả văn bằng & báo không có dữ liệu */}
                            <button
                              type="button"
                              onClick={() => {
                                updateOpenState(false, false);
                                setCategoryFilter('all');
                              }}
                              data-ripple="rgba(215, 33, 52, 0.28)"
                              className="relative overflow-hidden w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 text-slate-700 hover:text-slate-900 transition-all duration-150 cursor-pointer flex-shrink-0 active:scale-90 outline-none border-0 border-none select-none [-webkit-tap-highlight-color:transparent]"
                              title="Thu gọn (Esc)"
                            >
                              <X className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-slate-700 pointer-events-none" strokeWidth={2.4} />
                            </button>
                          </div>

                          {/* LƯỚI 7 BIỂU TƯỢNG LOẠI BẰNG: KHÔNG VIỀN HỘP, NỔI BẬT TỰ NHIÊN CHUẨN MACOS LAUNCHPAD */}
                          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-4 lg:gap-5 py-1.5 sm:py-2">
                            {DEGREE_TYPES.map((deg) => {
                              const IconComponent = deg.icon;
                              const isMatch = isDegreeMatch(deg);

                              return (
                                <motion.button
                                  key={deg.id}
                                  type="button"
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSelectDegreeType(deg)}
                                  className={`degree-launchpad-btn group relative flex flex-col items-center justify-start p-2 sm:p-3 rounded-2xl bg-transparent hover:bg-slate-50/80 transition-all duration-200 cursor-pointer text-center min-w-0 outline-none focus:outline-none focus:ring-0 ring-0 border-0 shadow-none select-none ${isMatch
                                      ? 'opacity-100 scale-100'
                                      : 'opacity-35 grayscale-[50%] hover:opacity-100 hover:grayscale-0'
                                    }`}
                                >
                                  {/* Squircle Apple Icon - Nổi bật tự nhiên, đổ bóng nhẹ nhàng chuẩn macOS */}
                                  <div
                                    className={`degree-squircle-target w-[48px] h-[48px] min-[360px]:w-14 min-[360px]:h-14 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[22px] bg-gradient-to-br ${deg.gradient} text-white flex items-center justify-center shadow-[0_8px_20px_-4px_rgba(0,0,0,0.18)] ${deg.shadow} group-hover:scale-105 group-hover:shadow-[0_12px_26px_-4px_rgba(0,0,0,0.24)] transition-all duration-200 relative shrink-0 overflow-hidden`}
                                  >
                                    <div className="absolute inset-0 rounded-[16px] sm:rounded-[22px] bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                                    <IconComponent className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7 sm:w-8 sm:h-8 stroke-[2.2] drop-shadow-xs relative z-10" />
                                  </div>

                                  {/* Tên loại bằng to rõ, duy nhất 1 nhãn chuẩn Apple Launchpad */}
                                  <div className="mt-2.5 sm:mt-3 flex flex-col items-center w-full px-0.5">
                                    <span className="text-[11.5px] min-[360px]:text-[12px] sm:text-[13px] font-bold text-slate-800 group-hover:text-[#142B6F] transition-colors text-center leading-snug whitespace-normal w-full line-clamp-2">
                                      {deg.title}
                                    </span>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>

                        </motion.div>
                      ) : (
                        /* ===================================================================== */
                        /* CHẾ ĐỘ 2: Ô THÔNG TIN NHẬP CHỈNH CHU, KHỚP VỊ TRÍ, ĐẸP MẮT CHUẨN APPLE */
                        /* ===================================================================== */
                        <motion.div
                          key="spotlight-form-view"
                          ref={formRef}
                          custom={slideDirection}
                          variants={viewVariants}
                          initial={isSwitchingView ? "enter" : false}
                          animate="center"
                          exit="exit"
                          style={{ willChange: 'transform, opacity, filter' }}
                          className="w-full px-5 min-[390px]:px-6 sm:px-9 lg:px-10 pt-5.5 min-[390px]:pt-6 pb-2.5 sm:pt-4.5 sm:pb-4 rounded-t-[36px] sm:rounded-t-[38px]"
                        >
                          {/* Header Form: Hiển thị đúng biểu tượng Squircle của loại bằng đã chọn + Nút quay lại gọn gàng 1 dòng trên Mobile */}
                          <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-5 gap-2.5">
                            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                              {/* Icon Squircle chuẩn xác của loại bằng đang chọn */}
                              <div
                                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br ${selectedDegree.gradient} text-white flex items-center justify-center shrink-0 shadow-md ${selectedDegree.shadow}`}
                              >
                                {(() => {
                                  const DegreeHeaderIcon = selectedDegree.icon || GraduationCap;
                                  return <DegreeHeaderIcon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />;
                                })()}
                              </div>

                              <div className="min-w-0">
                                <h2 className="text-[18px] sm:text-[20px] font-medium text-slate-900 tracking-tight leading-none truncate">
                                  Tra cứu {selectedDegree.title}
                                </h2>
                              </div>
                            </div>

                            {/* Nút Quay lại duy nhất trong Form View (Đã bỏ hoàn toàn nút X): Hiệu ứng trượt lùi đàn hồi đát đát (arrow nudge) khi hover/tap chuẩn Apple */}
                            <div className="flex items-center shrink-0">
                              <motion.button
                                type="button"
                                initial="rest"
                                whileHover="hover"
                                whileTap="tap"
                                transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                                onClick={() => {
                                  setIsSwitchingView(true);
                                  setSlideDirection('backward');
                                  updateOpenState(true, false);
                                }}
                                data-ripple="rgba(215, 33, 52, 0.28)"
                                className="group relative overflow-hidden w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200/90 active:bg-slate-300 text-slate-700 hover:text-[#142B6F] transition-colors duration-150 cursor-pointer flex-shrink-0 outline-none border-0 border-none select-none [-webkit-tap-highlight-color:transparent]"
                                title="Đổi loại bằng (Quay lại)"
                                aria-label="Đổi loại bằng (Quay lại)"
                              >
                                <motion.div
                                  variants={{
                                    rest: { x: 0 },
                                    hover: {
                                      x: [0, -4, -1, -3],
                                      transition: {
                                        duration: 0.45,
                                        times: [0, 0.4, 0.7, 1],
                                        ease: 'easeOut',
                                      },
                                    },
                                    tap: { x: -5, scale: 0.94 },
                                  }}
                                  className="flex items-center justify-center"
                                >
                                  <ArrowLeft
                                    className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-slate-700 group-hover:text-[#142B6F] pointer-events-none transition-colors duration-150"
                                    strokeWidth={2.4}
                                  />
                                </motion.div>
                              </motion.button>
                            </div>
                          </div>

                          {/* Form Content: To rõ, chỉnh chu, tích hợp Google reCAPTCHA chuẩn */}
                          <div className="w-full">
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                              >
                                {activeTab === 'vanbang' && (
                                  <VanBangForm
                                    onSuccess={(data) => {
                                      updateOpenState(false, false);
                                      onSelectResult?.('vanbang', data);
                                    }}
                                    onNotFound={(data) => onNotFound?.('vanbang', data)}
                                    initialSoHieuPhoi={query}
                                    initialLoaiDaoTao={selectedLoaiDaoTao}
                                    sampleData={sampleData?.vanbang}
                                    sampleToApply={sampleToApply}
                                  />
                                )}

                                {activeTab === 'cntt' && (
                                  <CnttForm
                                    onSuccess={(data) => {
                                      updateOpenState(false, false);
                                      onSelectResult?.('cntt', data);
                                    }}
                                    onNotFound={(data) => onNotFound?.('cntt', data)}
                                    initialSoHieuPhoi={query}
                                    initialCapDo={selectedCapDo}
                                    onCapDoChange={(newCapDo) => {
                                      setSelectedCapDo(newCapDo);
                                      const matched = DEGREE_TYPES.find(
                                        (d) => d.id === (newCapDo === 'nangcao' ? 'cntt-nc' : 'cntt-cb')
                                      );
                                      if (matched) setSelectedDegree(matched);
                                    }}
                                    sampleData={sampleData?.cntt}
                                    sampleToApply={sampleToApply}
                                  />
                                )}

                                {activeTab === 'vstep' && (
                                  <VstepForm
                                    onSuccess={(data) => {
                                      updateOpenState(false, false);
                                      onSelectResult?.('vstep', data);
                                    }}
                                    onNotFound={(data) => onNotFound?.('vstep', data)}
                                    initialSoHieuPhoi={query}
                                    sampleData={sampleData?.vstep}
                                    sampleToApply={sampleToApply}
                                  />
                                )}
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
