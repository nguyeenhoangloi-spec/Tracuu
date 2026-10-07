'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  GraduationCap,
  Folder,
  Layers,
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
}: SpotlightBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [selectedLoaiDaoTao, setSelectedLoaiDaoTao] = useState('dh');
  const [selectedCapDo, setSelectedCapDo] = useState<'coban' | 'nangcao'>('coban');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'dh' | 'sdh' | 'cntt' | 'vstep'>('all');
  const [selectedDegree, setSelectedDegree] = useState<DegreeTypeConfig>(DEGREE_TYPES[0]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Lắng nghe phím tắt toàn cục ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setIsFocused(true);
      }
      if (e.key === 'Escape') {
        setIsFocused(false);
        setIsFormExpanded(false);
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

      // KHÔNG đóng form khi người dùng click vào:
      // 1. Popover chọn ngày (DatePicker) hoặc Dropdown của LabelInput (.lbi-popover-shell)
      // 2. Icon nút mở lịch (.calendar-icon-btn)
      // 3. Popup thử thách hình ảnh / widget của Google reCAPTCHA
      // 4. Các role dialog / listbox portaled vào document.body
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
        target.closest('div[style*="z-index: 99999"]')
      ) {
        return;
      }

      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsFocused(false);
        setIsFormExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Kiểm tra 6 biểu tượng Loại Bằng có khớp danh mục hoặc từ khóa hay không (không cắt xén bớt để tránh rung giật khung)
  const isDegreeMatch = (deg: DegreeTypeConfig) => {
    // 1. Lọc theo danh mục
    if (categoryFilter === 'dh') {
      if (deg.id !== 'dh' && deg.id !== 'cd') return false;
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

  // Tìm kiếm hồ sơ học viên khớp nhanh từ dữ liệu mẫu
  const matchingStudentRecords = useMemo(() => {
    const qNorm = normalizeText(query);
    if (!qNorm || qNorm.length < 2) return [];

    const items: Array<{
      type: 'vanbang' | 'cntt' | 'vstep';
      id: string;
      ho_ten: string;
      ten_loai_bang: string;
      so_hieu_phoi: string;
      data: any;
    }> = [];

    // Văn bằng
    (sampleData?.vanbang || []).forEach((vb: any, i: number) => {
      const nameNorm = normalizeText(vb.ho_ten || '');
      const codeNorm = normalizeText(vb.so_hieu_phoi || '');
      if (nameNorm.includes(qNorm) || codeNorm.includes(qNorm)) {
        items.push({
          type: 'vanbang',
          id: vb.id || `vb-${i}`,
          ho_ten: vb.ho_ten,
          ten_loai_bang: vb.loai_dao_tao === 'ths' ? 'Bằng Thạc sĩ' : vb.loai_dao_tao === 'ts' ? 'Bằng Tiến sĩ' : 'Bằng tốt nghiệp Đại học',
          so_hieu_phoi: vb.so_hieu_phoi,
          data: vb,
        });
      }
    });

    // CNTT
    (sampleData?.cntt || []).forEach((cntt: any, i: number) => {
      const nameNorm = normalizeText(cntt.ho_ten || '');
      const codeNorm = normalizeText(cntt.so_hieu_phoi || '');
      if (nameNorm.includes(qNorm) || codeNorm.includes(qNorm)) {
        items.push({
          type: 'cntt',
          id: cntt.id || `cntt-${i}`,
          ho_ten: cntt.ho_ten,
          ten_loai_bang: `Chứng chỉ CNTT ${cntt.cap_do === 'nangcao' ? 'Nâng cao' : 'Cơ bản'}`,
          so_hieu_phoi: cntt.so_hieu_phoi,
          data: cntt,
        });
      }
    });

    // VSTEP
    (sampleData?.vstep || []).forEach((vs: any, i: number) => {
      const nameNorm = normalizeText(vs.ho_ten || '');
      const codeNorm = normalizeText(vs.so_hieu_phoi || '');
      const sbdNorm = normalizeText(vs.so_bao_danh || '');
      if (nameNorm.includes(qNorm) || codeNorm.includes(qNorm) || sbdNorm.includes(qNorm)) {
        items.push({
          type: 'vstep',
          id: vs.id || `vs-${i}`,
          ho_ten: vs.ho_ten,
          ten_loai_bang: 'Chứng chỉ Tiếng Anh VSTEP',
          so_hieu_phoi: vs.so_hieu_phoi || vs.so_bao_danh,
          data: vs,
        });
      }
    });

    return items;
  }, [query, sampleData]);

  // Trạng thái mở của cửa sổ Spotlight
  const isWindowOpen = isFocused || isFormExpanded;

  const cardContentRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  // ResizeObserver theo dõi và morphing chiều cao chính xác từng pixel chuẩn Apple Fluid Motion
  useEffect(() => {
    if (!cardContentRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const h = Math.round(
          entry.borderBoxSize?.[0]?.blockSize ?? entry.target.getBoundingClientRect().height
        );
        if (h > 0) {
          setContentHeight(h);
        }
      }
    });
    ro.observe(cardContentRef.current);
    return () => ro.disconnect();
  }, [isWindowOpen, isFormExpanded, activeTab, categoryFilter, selectedDegree]);

  // Xử lý khi nhấn chọn 1 loại bằng từ Grid -> Chuyển cảnh mượt sang Form
  const handleSelectDegreeType = (deg: DegreeTypeConfig) => {
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
    setIsFormExpanded(true);
    setIsFocused(true);
  };

  // Chọn 1 hồ sơ học viên khớp trực tiếp
  const handleSelectStudentItem = (record: any) => {
    setIsFocused(false);
    setIsFormExpanded(false);
    onSelectResult?.(record.type, record.data);
  };

  // Nút Tra cứu từ input
  const handleDirectSearch = () => {
    const val = query.trim();
    if (!val) {
      setIsFocused(true);
      return;
    }
    if (matchingStudentRecords.length > 0) {
      handleSelectStudentItem(matchingStudentRecords[0]);
    } else {
      setIsFocused(true);
    }
  };

  // 3 Nút Companion trên thanh Spotlight: CHỈ ĐỂ LỌC DANH MỤC TRONG LƯỚI, KHÔNG MỞ FORM TRỰC TIẾP
  const handleCompanionFilterClick = (filterCategory: 'dh' | 'cntt' | 'vstep') => {
    // Nếu đang mở đúng filter đó và đang ở chế độ xem lưới, bấm lại thì reset về tất cả
    if (isFocused && !isFormExpanded && categoryFilter === filterCategory) {
      setCategoryFilter('all');
      return;
    }

    setCategoryFilter(filterCategory);
    setIsFormExpanded(false); // Đảm bảo KHÔNG MỞ FORM, CHỈ HIỆN LƯỚI
    setIsFocused(true);        // Mở cửa sổ Spotlight dạng lưới
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
              inputRef.current?.focus();
              setIsFocused(true);
            }}
            className={`w-full h-[60px] sm:h-[66px] rounded-full backdrop-blur-3xl transition-[background-color,border-color,box-shadow,transform] duration-300 flex items-center px-4 sm:px-6 gap-3.5 outline-none focus:outline-none cursor-text ${
              isWindowOpen
                ? 'bg-white scale-[1.012] border border-blue-500/50 shadow-[0_24px_65px_-10px_rgba(20,43,111,0.28),0_0_0_4px_rgba(37,99,235,0.18),inset_0_1.5px_2px_rgba(255,255,255,1)]'
                : 'bg-white/90 hover:bg-white border border-white/80 shadow-[0_18px_45px_-10px_rgba(15,39,90,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.9)]'
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
              className={`flex-shrink-0 transition-colors duration-200 ${
                isWindowOpen ? 'text-blue-600' : 'text-[#142B6F]'
              }`}
            >
              <Search className="w-6 h-6 sm:w-[26px] sm:h-[26px] stroke-[2.3]" />
            </motion.div>

            {/* Input gõ tìm kiếm: Triệt tiêu hoàn toàn nền autofill / nền xám xanh của trình duyệt */}
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
              onFocus={() => setIsFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleDirectSearch();
                }
              }}
              placeholder="Chọn loại bằng cần tra cứu bên dưới hoặc nhập mã, họ tên..."
              className="flex-1 h-full py-0 my-0 min-w-0 bg-transparent text-[15.5px] sm:text-[17px] text-slate-900 placeholder:text-slate-400 font-medium tracking-tight outline-none focus:outline-none focus:ring-0 border-0 caret-blue-600"
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
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer outline-none focus:outline-none"
                title="Xóa nội dung"
              >
                <X className="w-4 h-4 stroke-[2.4]" />
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
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 rounded-full text-white text-[13.5px] sm:text-[14.5px] font-semibold transition-all duration-200 cursor-pointer shrink-0 select-none border-0 outline-none focus:outline-none focus-visible:outline-none ring-0 ${
                isWindowOpen || query.trim()
                  ? 'bg-gradient-to-r from-[#142B6F] to-[#2563EB] shadow-[0_4px_16px_rgba(37,99,235,0.4)]'
                  : 'bg-[#142B6F] hover:bg-[#0F1E4A] shadow-[0_4px_16px_rgba(20,43,111,0.3)]'
              }`}
              title="Tra cứu ngay"
            >
              <span>Tra cứu</span>
              <CornerDownLeft className="w-3.5 h-3.5 text-blue-200 hidden min-[400px]:inline" />
            </motion.button>
          </div>
        </div>

        {/* 3 NÚT TRÒN COMPANION: GIỮ NGUYÊN MÀU ĐẶC SẮC (ACTIVE XANH ĐẬM #142B6F, INACTIVE TRẮNG), HOÀN TOÀN KHÔNG CÓ VIỀN HAY HALO */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* Nút 1: Bằng Đại học (GraduationCap) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleCompanionFilterClick('dh')}
            className={`w-[58px] h-[58px] sm:w-[66px] sm:h-[66px] rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-0 border-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 active:outline-none active:border-0 select-none overflow-hidden ${
              categoryFilter === 'dh' && isFocused && !isFormExpanded
                ? 'bg-[#142B6F] text-white shadow-[0_12px_28px_rgba(20,43,111,0.45)] scale-105'
                : 'bg-white hover:bg-white text-[#142B6F] shadow-[0_10px_25px_-5px_rgba(15,39,90,0.14)]'
            }`}
            style={{ border: 'none', outline: 'none' }}
            title="Lọc: Bằng tốt nghiệp Đại học / Cao đẳng"
          >
            <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
          </motion.button>

          {/* Nút 2: Chứng chỉ CNTT (FolderCode - Chuẩn icon CNTT) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleCompanionFilterClick('cntt')}
            className={`w-[58px] h-[58px] sm:w-[66px] sm:h-[66px] rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-0 border-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 active:outline-none active:border-0 select-none overflow-hidden ${
              categoryFilter === 'cntt' && isFocused && !isFormExpanded
                ? 'bg-[#142B6F] text-white shadow-[0_12px_28px_rgba(20,43,111,0.45)] scale-105'
                : 'bg-white hover:bg-white text-[#142B6F] shadow-[0_10px_25px_-5px_rgba(15,39,90,0.14)]'
            }`}
            style={{ border: 'none', outline: 'none' }}
            title="Lọc: Chứng chỉ Ứng dụng CNTT"
          >
            <Laptop className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
          </motion.button>

          {/* Nút 3: Chứng chỉ VSTEP (Languages - Chuẩn icon Ngoại ngữ VSTEP) */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleCompanionFilterClick('vstep')}
            className={`w-[58px] h-[58px] sm:w-[66px] sm:h-[66px] rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-0 border-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 active:outline-none active:border-0 select-none overflow-hidden ${
              categoryFilter === 'vstep' && isFocused && !isFormExpanded
                ? 'bg-[#142B6F] text-white shadow-[0_12px_28px_rgba(20,43,111,0.45)] scale-105'
                : 'bg-white hover:bg-white text-[#142B6F] shadow-[0_10px_25px_-5px_rgba(15,39,90,0.14)]'
            }`}
            style={{ border: 'none', outline: 'none' }}
            title="Lọc: Chứng chỉ Tiếng Anh VSTEP"
          >
            <Languages className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
          </motion.button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CỬA SỔ SPOTLIGHT NỔI TUYỆT ĐỐI (ABSOLUTE OVERLAY): NỀN XANH CỐ ĐỊNH 100% */}
      {/* NỀN XANH CỐ ĐỊNH KHÔNG BAO GIỜ BỊ ĐẨY XUỐNG DƯỚI, KHÔNG BAO GIỜ GIẬT KHUNG   */}
      {/* ========================================================================= */}
      <AnimatePresence initial={false}>
        {isWindowOpen && (
          <motion.div
            key="spotlight-window-overlay"
            initial={{ opacity: 0, y: -10, scale: 0.985 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.38,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.985,
              transition: {
                duration: 0.28,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            className="absolute top-full left-0 right-0 pt-3 sm:pt-4 z-40 px-2 flex justify-center pointer-events-auto"
          >
            <div className="w-full max-w-[980px]">
              {/* Hộp card Apple Squircle: Morphing chiều cao mượt mà không bao giờ giật khung */}
              <motion.div
                className="w-full rounded-[24px] sm:rounded-[36px] bg-white border border-slate-100/90 shadow-[0_28px_70px_-15px_rgba(15,39,90,0.35),0_0_0_1px_rgba(0,0,0,0.06)] relative overflow-hidden max-h-[calc(100vh-210px)] sm:max-h-none overflow-y-auto"
                style={{
                  backgroundColor: '#ffffff',
                }}
                animate={{
                  height: contentHeight !== null ? contentHeight : 'auto',
                }}
                transition={{
                  height: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
                }}
              >
                {/* Vùng đo đạc ResizeObserver với padding cân chỉnh riêng cho Mobile và Desktop */}
                <div ref={cardContentRef} className="w-full p-4 sm:p-7">
                  {/* CHUYỂN CẢNH SIÊU MƯỢT MÀ CHUẨN APPLE: MODE="WAIT" KHÔNG BỊ GIẬT KHUNG HÌNH */}
                  <AnimatePresence mode="wait" initial={false}>
                    {!isFormExpanded ? (
                      /* ===================================================================== */
                      /* CHẾ ĐỘ 1: LƯỚI BIỂU TƯỢNG CÁC LOẠI BẰNG CHUẨN MACOS (7 APP SQUIRCLES)  */
                      /* ===================================================================== */
                      <motion.div
                        key="spotlight-grid-view"
                        initial={{ opacity: 0, scale: 0.988 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.988, transition: { duration: 0.12, ease: 'easeOut' } }}
                        transition={{
                          duration: 0.2,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="w-full"
                      >
                    {/* Header: Thanh lịch, chuẩn Apple macOS */}
                    <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100 gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#142B6F]" />
                        <span className="text-[13px] sm:text-[14px] font-bold text-slate-800 tracking-tight">
                          Chọn loại bằng / chứng chỉ cần tra cứu
                        </span>
                      </div>

                      {/* Nút đóng / thu gọn */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setIsFocused(false);
                          setIsFormExpanded(false);
                        }}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer outline-none focus:outline-none focus:ring-0 ring-0 border-0"
                        title="Thu gọn"
                      >
                        <X className="w-4 h-4 stroke-[2.2]" />
                      </motion.button>
                    </div>

                    {/* LƯỚI 7 BIỂU TƯỢNG LOẠI BẰNG: RỘNG RÃI, CHIỀU CAO THOÁNG ĐẠT, CHUẨN SQUIRCLE APPLE */}
                    <div className="grid grid-cols-2 min-[540px]:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 py-2 sm:py-3.5">
                      {DEGREE_TYPES.map((deg) => {
                        const IconComponent = deg.icon;
                        const isMatch = isDegreeMatch(deg);

                        return (
                          <motion.button
                            key={deg.id}
                            type="button"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleSelectDegreeType(deg)}
                            className={`group relative flex flex-col items-center justify-between p-3.5 sm:p-5 min-h-[136px] sm:min-h-[156px] rounded-[22px] sm:rounded-[28px] bg-slate-50/70 hover:bg-white border border-slate-100 hover:border-blue-200/80 hover:shadow-[0_14px_30px_-6px_rgba(20,43,111,0.14)] transition-all duration-200 cursor-pointer text-center min-w-0 outline-none focus:outline-none focus:ring-0 ring-0 select-none ${
                              isMatch
                                ? 'opacity-100 scale-100'
                                : 'opacity-35 grayscale-[50%] hover:opacity-100 hover:grayscale-0'
                            }`}
                          >
                            {/* Squircle Apple Icon */}
                            <div
                              className={`w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-[20px] sm:rounded-[24px] bg-gradient-to-br ${deg.gradient} text-white flex items-center justify-center shadow-md ${deg.shadow} group-hover:scale-105 transition-transform duration-200 relative shrink-0`}
                            >
                              <div className="absolute inset-0 rounded-[20px] sm:rounded-[24px] bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                              <IconComponent className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2] drop-shadow-xs" />
                            </div>

                            {/* Tên loại bằng to rõ chuẩn Apple macOS Launchpad / Spotlight */}
                            <div className="mt-3 flex flex-col items-center w-full">
                              <span className="text-[13px] sm:text-[14px] font-bold text-slate-800 group-hover:text-[#142B6F] transition-colors text-center leading-snug whitespace-normal w-full line-clamp-2">
                                {deg.title}
                              </span>
                              <span className="text-[11px] sm:text-[11.5px] text-slate-500 font-medium mt-1 text-center leading-tight line-clamp-1">
                                {deg.subTitle}
                              </span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* DANH SÁCH HỒ SƠ KHỚP NHANH (NẾU GÕ TÌM KIẾM) */}
                    {matchingStudentRecords.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-slate-200/80">
                        <div className="flex items-center gap-2 mb-2.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                            Hồ sơ tra cứu khớp nhanh:
                          </span>
                        </div>

                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {matchingStudentRecords.map((item) => (
                            <motion.div
                              key={item.id}
                              whileHover={{ scale: 1.01, x: 2 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => handleSelectStudentItem(item)}
                              className="flex items-center justify-between p-3 rounded-xl bg-white/70 hover:bg-white border border-slate-200/70 hover:border-blue-300 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#142B6F] flex items-center justify-center shrink-0">
                                  <GraduationCap className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                                      {item.ho_ten}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-mono font-semibold">
                                      {item.so_hieu_phoi}
                                    </span>
                                  </div>
                                  <span className="text-xs text-slate-500 font-medium">
                                    {item.ten_loai_bang}
                                  </span>
                                </div>
                              </div>

                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#142B6F] group-hover:translate-x-0.5 transition-all" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  /* ===================================================================== */
                  /* CHẾ ĐỘ 2: Ô THÔNG TIN NHẬP CHỈNH CHU, KHỚP VỊ TRÍ, ĐẸP MẮT CHUẨN APPLE */
                  /* ===================================================================== */
                  <motion.div
                    key="spotlight-form-view"
                    initial={{ opacity: 0, scale: 0.988, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.988, y: -4, transition: { duration: 0.12, ease: 'easeOut' } }}
                    transition={{
                      duration: 0.24,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="w-full"
                  >
                    {/* Header Form: Hiển thị đúng biểu tượng Squircle của loại bằng đã chọn + Nút quay lại gọn gàng 1 dòng trên Mobile */}
                    <div className="flex items-center justify-between pb-3 sm:pb-3.5 mb-3.5 sm:mb-5 border-b border-slate-200/80 gap-2">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
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
                          <h2 className="text-[15px] sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                            Tra cứu {selectedDegree.title}
                          </h2>
                        </div>
                      </div>

                      {/* Nút Đổi loại bằng khác & Nút Thu gọn */}
                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setIsFormExpanded(false);
                            setIsFocused(true);
                          }}
                          className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-[11.5px] sm:text-xs font-bold transition-all cursor-pointer outline-none focus:outline-none"
                        >
                          <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>Đổi loại bằng</span>
                        </motion.button>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setIsFormExpanded(false);
                            setIsFocused(false);
                          }}
                          className="p-1 sm:p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer outline-none focus:outline-none"
                          title="Thu gọn"
                        >
                          <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Form Content: To rõ, chỉnh chu, tích hợp Google reCAPTCHA chuẩn */}
                    <div className="w-full">
                      {activeTab === 'vanbang' && (
                        <VanBangForm
                          onSuccess={(data) => {
                            setIsFormExpanded(false);
                            setIsFocused(false);
                            onSelectResult?.('vanbang', data);
                          }}
                          onNotFound={(data) => onNotFound?.('vanbang', data)}
                          initialSoHieuPhoi={query}
                          initialLoaiDaoTao={selectedLoaiDaoTao}
                          sampleData={sampleData?.vanbang}
                        />
                      )}

                      {activeTab === 'cntt' && (
                        <CnttForm
                          onSuccess={(data) => {
                            setIsFormExpanded(false);
                            setIsFocused(false);
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
                        />
                      )}

                      {activeTab === 'vstep' && (
                        <VstepForm
                          onSuccess={(data) => {
                            setIsFormExpanded(false);
                            setIsFocused(false);
                            onSelectResult?.('vstep', data);
                          }}
                          onNotFound={(data) => onNotFound?.('vstep', data)}
                          initialSoHieuPhoi={query}
                          sampleData={sampleData?.vstep}
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
    </div>
  );
}
