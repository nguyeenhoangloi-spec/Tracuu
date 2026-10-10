'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  Globe,
  Scroll,
  ArrowLeft,
  ChevronLeft,
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
  collapseTrigger?: number;
  /** 'dark' = giao diện kính tối, điểm nhấn hổ phách. Mặc định 'light' cho giao diện nền sáng. */
  variant?: 'light' | 'dark';
}

// Cấu hình 7 Loại Bằng & Chứng chỉ xác thực chuẩn Apple Squircle & Floodlight
interface DegreeTypeConfig {
  id: string;
  category: 'vanbang' | 'cntt' | 'vstep';
  loaiDaoTao?: string;
  capDo?: 'coban' | 'nangcao';
  title: string;
  subTitle: string;
  badge: string;
  kindLabel: string;
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
    subTitle: 'Cử nhân, Kỹ sư, Dược sĩ, Bác sĩ chính quy',
    badge: 'Đại học',
    kindLabel: 'Bằng tốt nghiệp',
    gradient: 'from-[#1D4ED8] to-[#3B82F6]',
    shadow: 'shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
    icon: GraduationCap,
  },
  {
    id: 'ths',
    category: 'vanbang',
    loaiDaoTao: 'ths',
    title: 'Bằng Thạc sĩ',
    subTitle: 'Đào tạo Sau đại học - Học vị Thạc sĩ',
    badge: 'Thạc sĩ',
    kindLabel: 'Sau đại học',
    gradient: 'from-[#6D28D9] to-[#8B5CF6]',
    shadow: 'shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
    icon: Scroll,
  },
  {
    id: 'ts',
    category: 'vanbang',
    loaiDaoTao: 'ts',
    title: 'Bằng Tiến sĩ',
    subTitle: 'Nghiên cứu sinh - Học vị Tiến sĩ',
    badge: 'Tiến sĩ',
    kindLabel: 'Sau đại học',
    gradient: 'from-[#B45309] to-[#D97706]',
    shadow: 'shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
    icon: Award,
  },
  {
    id: 'cntt-cb',
    category: 'cntt',
    capDo: 'coban',
    title: 'CNTT Cơ bản',
    subTitle: 'Chuẩn kỹ năng CNTT cơ bản TT 03/2014',
    badge: 'CNTT Cơ bản',
    kindLabel: 'Tin học',
    gradient: 'from-[#0284C7] to-[#0EA5E9]',
    shadow: 'shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
    icon: Laptop,
  },
  {
    id: 'cntt-nc',
    category: 'cntt',
    capDo: 'nangcao',
    title: 'CNTT Nâng cao',
    subTitle: 'Chuẩn kỹ năng CNTT nâng cao TT 03/2014',
    badge: 'CNTT Nâng cao',
    kindLabel: 'Tin học',
    gradient: 'from-[#0F766E] to-[#14B8A6]',
    shadow: 'shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
    icon: Cpu,
  },
  {
    id: 'vstep',
    category: 'vstep',
    title: 'Chứng chỉ VSTEP',
    subTitle: 'Đánh giá năng lực tiếng Anh B1 - C1',
    badge: 'VSTEP',
    kindLabel: 'Ngoại ngữ',
    gradient: 'from-[#BE123C] to-[#E11D48]',
    shadow: 'shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
    icon: Globe,
  },
  {
    id: 'cd',
    category: 'vanbang',
    loaiDaoTao: 'cd',
    title: 'Bằng Cao đẳng',
    subTitle: 'Hệ Cao đẳng chính quy DNC',
    badge: 'Cao đẳng',
    kindLabel: 'Cao đẳng',
    gradient: 'from-[#047857] to-[#10B981]',
    shadow: 'shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
    icon: BookOpen,
  },
];

const FILTER_CHIPS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'dh', label: 'Đại học' },
  { id: 'sdh', label: 'Sau đại học' },
  { id: 'cntt', label: 'Tin học' },
  { id: 'vstep', label: 'Ngoại ngữ' },
  { id: 'cd', label: 'Cao đẳng' },
] as const;

type FilterChipId = typeof FILTER_CHIPS[number]['id'];

interface PopularShortcut {
  id: string;
  title: string;
  shortTitle: string;
  desc: string;
  degreeId: string;
  icon: any;
  gradient: string;
  shadow: string;
}

const POPULAR_SEARCH_SHORTCUTS: PopularShortcut[] = [
  {
    id: 'dh',
    title: 'Bằng Đại học',
    shortTitle: 'Đại học',
    desc: 'Cử nhân • Kỹ sư',
    degreeId: 'dh',
    icon: GraduationCap,
    gradient: 'from-[#1D4ED8] to-[#3B82F6]',
    shadow: 'shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
  },
  {
    id: 'vstep',
    title: 'Chứng chỉ VSTEP',
    shortTitle: 'VSTEP',
    desc: 'Bậc 3 – 5 tiếng Anh',
    degreeId: 'vstep',
    icon: Globe,
    gradient: 'from-[#BE123C] to-[#E11D48]',
    shadow: 'shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
  },
  {
    id: 'cntt-cb',
    title: 'Chứng chỉ CNTT',
    shortTitle: 'CNTT',
    desc: 'Chuẩn TT 03/2014',
    degreeId: 'cntt-cb',
    icon: Laptop,
    gradient: 'from-[#0284C7] to-[#0EA5E9]',
    shadow: 'shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
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
  collapseTrigger,
  variant = 'light',
}: SpotlightBarProps) {
  const isDark = variant === 'dark';
  const [query, setQuery] = useState('');
  // Mở sẵn danh sách loại văn bằng trên Desktop để giao diện đầy đặn, trực quan ngay từ đầu
  const [isFocused, setIsFocused] = useState(true);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isSwitchingView, setIsSwitchingView] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const [selectedLoaiDaoTao, setSelectedLoaiDaoTao] = useState('dh');
  const [selectedCapDo, setSelectedCapDo] = useState<'coban' | 'nangcao'>('coban');
  const [categoryFilter, setCategoryFilter] = useState<FilterChipId>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedDegree, setSelectedDegree] = useState<DegreeTypeConfig>(DEGREE_TYPES[0]);
  const [isOpenedFromShortcut, setIsOpenedFromShortcut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isWindowOpen = isFocused || (isFormExpanded && !isMobile);

  // Thu gọn khung SpotlightBar khi nhận trigger đóng kết quả từ trang chủ (page.tsx)
  const prevCollapseTriggerRef = useRef(collapseTrigger);
  useEffect(() => {
    if (collapseTrigger && collapseTrigger !== prevCollapseTriggerRef.current) {
      prevCollapseTriggerRef.current = collapseTrigger;
      updateOpenState(false, false);
    }
  }, [collapseTrigger]);

  const [isMounted, setIsMounted] = useState(false);
  const [isClosingMobileSheet, setIsClosingMobileSheet] = useState(false);

  // Đóng/thu lại Mobile Bottom Sheet mượt mà đồng bộ đúng hiệu ứng mobile-drawer-exit (280ms)
  const handleCloseMobileSheet = (targetIsFocused: boolean) => {
    if (isClosingMobileSheet) return;
    setIsClosingMobileSheet(true);
    setTimeout(() => {
      updateOpenState(targetIsFocused, false);
      setIsClosingMobileSheet(false);
    }, 280);
  };

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Không khóa cuộn trang nền để trải nghiệm mở rộng tự nhiên đẩy nội dung bên dưới (chuẩn Floodlight)
  useEffect(() => {
    document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const platterRef = useRef<HTMLDivElement | null>(null);
  const platterHeaderRef = useRef<HTMLDivElement | null>(null);
  const gridContentRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Tọa độ và kích thước viên con nhộng trượt liên tục chuẩn Apple Mac
  const [tabIndicator, setTabIndicator] = useState<{ left: number; width: number; ready: boolean }>({
    left: 5,
    width: 65,
    ready: false,
  });

  // Đo đạc tọa độ offsetLeft và offsetWidth của tab đang chọn để trượt mượt mà không dùng scaleX
  useEffect(() => {
    const measure = () => {
      const activeEl = chipRefs.current[categoryFilter];
      if (activeEl) {
        const newLeft = activeEl.offsetLeft;
        const newWidth = activeEl.offsetWidth;
        setTabIndicator((prev) => {
          if (
            prev.ready &&
            Math.abs(prev.left - newLeft) < 0.5 &&
            Math.abs(prev.width - newWidth) < 0.5
          ) {
            return prev;
          }
          return {
            left: newLeft,
            width: newWidth,
            ready: true,
          };
        });
      }
    };
    measure();
    // Đo lại phòng khi font chữ tải xong hoặc cửa sổ co giãn
    const t = setTimeout(measure, 60);
    const t2 = setTimeout(measure, 200);
    window.addEventListener('resize', measure);
    let ro: ResizeObserver | null = null;
    if (platterRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure());
      ro.observe(platterRef.current);
    }
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
      window.removeEventListener('resize', measure);
      if (ro) ro.disconnect();
    };
  }, [categoryFilter, isFocused]);

  const [gridHeight, setGridHeight] = useState<number>(253);
  const [formHeight, setFormHeight] = useState<number>(285);
  const bodyContentRef = useRef<HTMLDivElement | null>(null);
  const gridRoRef = useRef<ResizeObserver | null>(null);
  const formRoRef = useRef<ResizeObserver | null>(null);

  const isFocusedRef = useRef(isFocused);
  const isFormExpandedRef = useRef(isFormExpanded);
  const isMobileRef = useRef(isMobile);
  const categoryFilterRef = useRef(categoryFilter);
  const queryRef = useRef(query);
  isFocusedRef.current = isFocused;
  isFormExpandedRef.current = isFormExpanded;
  isMobileRef.current = isMobile;
  categoryFilterRef.current = categoryFilter;
  queryRef.current = query;

  // Hàm cập nhật trạng thái mở/đóng đồng bộ tức thì 0ms sang component cha (page.tsx)
  const updateOpenState = (newFocused: boolean, newFormExpanded: boolean) => {
    // Chống kích hoạt dồn dập nhiều lần (focus + click + bubble): chỉ cập nhật khi trạng thái thực sự thay đổi
    if (newFocused === isFocusedRef.current && newFormExpanded === isFormExpandedRef.current) {
      return;
    }
    const prevFormExpanded = isFormExpandedRef.current;
    isFocusedRef.current = newFocused;
    isFormExpandedRef.current = newFormExpanded;

    if (newFormExpanded !== prevFormExpanded) {
      // Chỉ kích hoạt hiệu ứng trượt đổi view trên Desktop (nơi Form thay thế Lưới trong cùng khung)
      // Trên Mobile, Form hiển thị ở Bottom Sheet độc lập nên khung bự ở nền sau đứng yên 100%, không bị giật nảy y: 12px
      if (!isMobile) {
        setIsSwitchingView(true);
        setSlideDirection(newFormExpanded ? 'forward' : 'backward');
      }
    }
    setIsFocused(newFocused);
    setIsFormExpanded(newFormExpanded);
    if (!newFocused && !newFormExpanded) {
      setIsSwitchingView(false);
      inputRef.current?.blur();
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
        // Nếu modal xác thực bảo mật reCAPTCHA hoặc khung kết quả tra cứu đang mở: để các thành phần này tự xử lý đóng của nó, TUYỆT ĐỐI KHÔNG đóng form SpotlightBar
        if (
          document.getElementById('security-captcha-overlay') ||
          document.getElementById('omninotch-overlay')
        ) {
          return;
        }
        if (isMobile && (isFormExpanded || isClosingMobileSheet)) {
          handleCloseMobileSheet(true);
          return;
        }
        if (isFormExpanded && !isOpenedFromShortcut) {
          setIsSwitchingView(true);
          setSlideDirection('backward');
          updateOpenState(true, false);
          return;
        }
        updateOpenState(false, false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, isFormExpanded, isClosingMobileSheet]);

  // Khóa cuộn trang nền khi Bottom Sheet Form đang mở trên mobile
  useEffect(() => {
    if (isMobile && (isFormExpanded || isClosingMobileSheet)) {
      document.body.style.overflow = 'hidden';
    } else {
      if (
        !document.getElementById('omninotch-overlay') &&
        !document.getElementById('security-captcha-overlay')
      ) {
        document.body.style.overflow = '';
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isFormExpanded, isClosingMobileSheet]);

  // Đóng cửa sổ khi click ra ngoài container (Bảo vệ không đóng khi click chọn ngày DatePicker, reCAPTCHA hoặc thẻ kết quả tra cứu)
  useEffect(() => {
    if (!isWindowOpen) return;

    const handleClickOutside = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // 0. Nếu đang có modal xác thực bảo mật reCAPTCHA, khung kết quả tra cứu hoặc Mobile Bottom Sheet:
      // TUYỆT ĐỐI KHÔNG đóng form SpotlightBar!
      if (
        document.getElementById('security-captcha-overlay') ||
        target.closest('#security-captcha-overlay') ||
        document.getElementById('omninotch-overlay') ||
        target.closest('#omninotch-overlay') ||
        document.getElementById('mobile-form-bottom-sheet') ||
        target.closest('#mobile-form-bottom-sheet')
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
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isWindowOpen]);

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

  // Lọc theo danh mục chip và từ khóa
  const matchesFilter = (deg: DegreeTypeConfig, cat: string) => {
    if (cat === 'all') return true;
    if (cat === 'dh') return deg.id === 'dh';
    if (cat === 'sdh') return deg.id === 'ths' || deg.id === 'ts';
    if (cat === 'cntt') return deg.category === 'cntt';
    if (cat === 'vstep') return deg.category === 'vstep';
    if (cat === 'cd') return deg.id === 'cd';
    return true;
  };

  const matchesQuery = (deg: DegreeTypeConfig, q: string) => {
    const qNorm = normalizeText(q);
    if (!qNorm) return true;
    const titleNorm = normalizeText(deg.title);
    const subNorm = normalizeText(deg.subTitle);
    const badgeNorm = normalizeText(deg.badge);
    const kindNorm = normalizeText(deg.kindLabel || '');
    return (
      titleNorm.includes(qNorm) ||
      subNorm.includes(qNorm) ||
      badgeNorm.includes(qNorm) ||
      kindNorm.includes(qNorm)
    );
  };

  const getChipCount = (catId: string) => {
    return DEGREE_TYPES.filter((deg) => matchesFilter(deg, catId) && matchesQuery(deg, query)).length;
  };

  const filteredDegrees = useMemo(() => {
    return DEGREE_TYPES.filter(
      (deg) => matchesFilter(deg, categoryFilter) && matchesQuery(deg, query)
    );
  }, [categoryFilter, query]);

  // Chiều cao chuẩn xác của Lưới Launchpad:
  // Desktop (lg): 7 icon xếp trên 1 hàng ngang duy nhất (85 + 168 = 253px)
  // Mobile / Tablet: xếp nhiều hàng (61 + 285 = 346px)
  const getAdaptiveHeight = useCallback(
    (mobile: boolean) => {
      if (isFormExpanded && !mobile) return formHeight;
      const headerH = platterHeaderRef.current?.offsetHeight || (mobile ? 61 : 85);
      const gridContentH = mobile ? 285 : 168;
      return headerH + gridContentH;
    },
    [isFormExpanded, formHeight]
  );

  useEffect(() => {
    setSelectedIndex(0);
    const nextH = getAdaptiveHeight(isMobile);
    setGridHeight(nextH);
  }, [categoryFilter, isMobile, getAdaptiveHeight]);

  const isDegreeMatch = (deg: DegreeTypeConfig) => {
    return matchesFilter(deg, categoryFilter) && matchesQuery(deg, query);
  };

  // Đồng bộ trạng thái mở/đóng lên component cha (page.tsx) làm fallback an toàn
  useEffect(() => {
    onOpenStateChange?.({
      isOpen: isWindowOpen,
      isFormExpanded,
      panelHeight: isWindowOpen ? (isFormExpanded ? formHeight : gridHeight) : 0,
    });
  }, [isWindowOpen, isFormExpanded, formHeight, gridHeight, onOpenStateChange]);

  // 1. Đo đạc chiều cao Lưới Launchpad (Grid view) bằng Callback Ref đảm bảo bắt trúng 100% khi AnimatePresence mount
  const setGridRef = useCallback((node: HTMLDivElement | null) => {
    gridRef.current = node;
    gridRoRef.current?.disconnect();
    gridRoRef.current = null;

    if (node) {
      const nextH = getAdaptiveHeight(isMobileRef.current);
      setGridHeight(nextH);

      const ro = new ResizeObserver(() => {
        if (!isMobileRef.current) {
          const targetH = getAdaptiveHeight(false);
          setGridHeight(targetH);
          return;
        }
        const measuredH = Math.round(node.offsetHeight || node.scrollHeight);
        if (measuredH >= 75) {
          setGridHeight((prev) => (Math.abs(prev - measuredH) > 6 ? measuredH : prev));
        }
      });
      ro.observe(node);
      gridRoRef.current = ro;
    }
  }, [getAdaptiveHeight]);

  // 2. Đo đạc chiều cao Form tra cứu (Form view) bằng Callback Ref - Cập nhật liên tục khi có dòng lỗi xuất hiện
  const setFormRef = useCallback((node: HTMLDivElement | null) => {
    formRef.current = node;
    formRoRef.current?.disconnect();
    formRoRef.current = null;

    if (node) {
      const measure = () => {
        const h = Math.round(node.offsetHeight || node.scrollHeight || node.getBoundingClientRect().height);
        if (h >= 75) setFormHeight(h);
      };
      measure();
      requestAnimationFrame(measure);

      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const measuredH = Math.round(
            entry.borderBoxSize?.[0]?.blockSize ??
            (entry.target as HTMLElement).offsetHeight ??
            entry.target.scrollHeight ??
            entry.target.getBoundingClientRect().height
          );
          if (measuredH >= 75) setFormHeight(measuredH);
        }
      });
      ro.observe(node);
      formRoRef.current = ro;
    }
  }, []);

  // 3. Giữ bộ lắng nghe transitionend khi dòng lỗi CSS hoàn tất chuyển động để đồng bộ mượt mà
  useEffect(() => {
    const handleTransitionEnd = (e: TransitionEvent) => {
      if (
        (e.target as HTMLElement)?.classList?.contains('lbi-error-wrapper') ||
        (e.target as HTMLElement)?.closest?.('.lbi-error-wrapper')
      ) {
        if (formRef.current) {
          const h = Math.round(formRef.current.offsetHeight || formRef.current.getBoundingClientRect().height);
          if (h >= 75) setFormHeight(h);
        }
      }
    };

    const node = bodyContentRef.current;
    if (node) {
      node.addEventListener('transitionend', handleTransitionEnd);
      return () => node.removeEventListener('transitionend', handleTransitionEnd);
    }
  }, [isWindowOpen, isFormExpanded]);

  // Dọn dẹp observers khi component unmount
  useEffect(() => {
    return () => {
      gridRoRef.current?.disconnect();
      formRoRef.current?.disconnect();
    };
  }, []);

  // Xử lý khi nhấn chọn 1 loại bằng từ Grid -> Chuyển cảnh sang Form (Desktop) hoặc mở Bottom Sheet (Mobile)
  const handleSelectDegreeType = (deg: DegreeTypeConfig, fromShortcut: boolean = false) => {
    setIsOpenedFromShortcut(fromShortcut);
    // Nhả focus ô tìm kiếm ngay lập tức để chống nhảy focus vào ô form gây chớp nháy placeholder ví dụ
    inputRef.current?.blur();
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (!isMobile) {
      setIsSwitchingView(true);
      setSlideDirection('forward');
    }
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
    if (isMobile) {
      // Trên Mobile: Nếu mở từ lối tắt ngoài, giữ isFocused = false để khi đóng quay về đúng trang chủ
      updateOpenState(fromShortcut ? false : isFocused, true);
    } else {
      updateOpenState(true, true);
    }
  };

  // Nút Tra cứu từ input
  const handleDirectSearch = () => {
    updateOpenState(true, false);
  };

  // 3 Nút Companion trên thanh Spotlight: LỌC DANH MỤC TRONG LƯỚI & ĐỒNG BỘ TAB - MỞ BOTTOM SHEET TRÊN MOBILE KHÔNG GIẬT KHUNG
  const handleCompanionFilterClick = (filterCategory: 'dh' | 'cntt' | 'vstep') => {
    setCategoryFilter(filterCategory);
    setSelectedIndex(0);
    if (listScrollRef.current) {
      listScrollRef.current.scrollTop = 0;
    }
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

  // Animation chuyển đổi siêu mượt chuẩn Apple giữa Chế độ Lưới và Chế độ Form ô nhập:
  // In-place crossfade mượt mà, đầm mướt chuẩn Apple [0.16, 1, 0.3, 1]
  const viewVariants = {
    enter: {
      opacity: 0,
      scale: 0.992,
      transition: {
        duration: 0.34,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.992,
      transition: {
        duration: 0.20,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  // Xử lý chuyển cảnh nhịp nhàng khi tra cứu trên Mobile:
  // Cho Form Bottom Sheet trượt xuống mượt mà trước (200ms), sau đó Thẻ kết quả trượt vút lên đón mắt người dùng
  // Giữ nguyên isFocused để khung bự ở nền web đứng yên tĩnh lặng, tuyệt đối không co rút làm đẩy rung trang
  const handleFormSuccess = (type: 'vanbang' | 'cntt' | 'vstep', data: any) => {
    if (isMobile) {
      handleCloseMobileSheet(isFocused);
      setTimeout(() => {
        onSelectResult?.(type, data);
      }, 200);
    } else {
      onSelectResult?.(type, data);
    }
  };

  const handleFormNotFound = (type: 'vanbang' | 'cntt' | 'vstep', notFoundData: any) => {
    if (isMobile) {
      handleCloseMobileSheet(isFocused);
      setTimeout(() => {
        onNotFound?.(type, notFoundData);
      }, 200);
    } else {
      onNotFound?.(type, notFoundData);
    }
  };

  // Khối nội dung Form: Dùng chung thống nhất giữa Desktop (Floodlight) và Mobile (Bottom Sheet)
  const renderFormContent = () => (
    <div key={activeTab} className="w-full">
      {activeTab === 'vanbang' && (
        <VanBangForm
          onSuccess={(data) => handleFormSuccess('vanbang', data)}
          onNotFound={(data) => handleFormNotFound('vanbang', data)}
          initialSoHieuPhoi={query}
          initialLoaiDaoTao={selectedLoaiDaoTao}
          sampleData={sampleData?.vanbang}
          sampleToApply={sampleToApply}
        />
      )}

      {activeTab === 'cntt' && (
        <CnttForm
          onSuccess={(data) => handleFormSuccess('cntt', data)}
          onNotFound={(data) => handleFormNotFound('cntt', data)}
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
          onSuccess={(data) => handleFormSuccess('vstep', data)}
          onNotFound={(data) => handleFormNotFound('vstep', data)}
          initialSoHieuPhoi={query}
          sampleData={sampleData?.vstep}
          sampleToApply={sampleToApply}
        />
      )}
    </div>
  );

  return (
    <div ref={containerRef} className="w-full max-w-[880px] lg:max-w-[920px] mx-auto px-0 sm:px-1.5 relative z-30">
      {/* ========================================================================= */}
      {/* KHUNG UNIFIED FLOODLIGHT MACOS: THANH TÌM KIẾM DÍNH LIỀN BẢNG KẾT QUẢ/FORM */}
      {/* MỞ RỘNG TRỰC TIẾP TRONG FLOW TỰ ĐỘNG ĐẨY 4 CAM KẾT PHÍA DƯỚI XUỐNG        */}
      {/* ========================================================================= */}
      <div
        id="floodlight-panel"
        className={`w-full border-0 outline-none overflow-hidden transition-[box-shadow,border-radius,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isWindowOpen
          ? 'rounded-[26px] sm:rounded-[32px] bg-white/80 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.04)]'
          : 'rounded-[30px] sm:rounded-[38px] bg-white shadow-[0_16px_48px_-6px_rgba(0,0,0,0.10),0_4px_16px_rgba(0,0,0,0.05)] active:scale-[0.985]'
          }`}
      >
        {/* HÀNG TRÊN CÙNG: THANH HEADER CỐ ĐỊNH CHUẨN APPLE SPOTLIGHT (CHUYỂN TIẾP MƯỢT GIỮA TÌM KIẾM VÀ TIÊU ĐỀ FORM) */}
        <div className="w-full h-[60px] sm:h-[76px] relative overflow-hidden bg-transparent">
          <AnimatePresence mode="wait" initial={false}>
            {(!isFormExpanded || isMobile) ? (
              <motion.div
                key="top-header-search"
                initial={{ opacity: 0, y: slideDirection === 'backward' ? -4 : 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: slideDirection === 'backward' ? 4 : -4 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  inputRef.current?.focus();
                  updateOpenState(true, isFormExpanded);
                }}
                className="w-full h-full flex items-center px-3.5 min-[380px]:px-4 sm:px-7 gap-2.5 sm:gap-4.5 cursor-text select-none sm:select-auto bg-transparent"
              >
                {/* Kính lúp icon: Luôn đồng bộ màu xám chuẩn token apple-muted cùng chữ placeholder */}
                <motion.div
                  animate={{
                    scale: isWindowOpen ? 1.05 : 1,
                  }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                  className="flex-shrink-0 text-apple-muted"
                >
                  <Search className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] stroke-[2.2]" />
                </motion.div>

                {/* Input text tìm kiếm: Cỡ chữ 19.5px to rõ, gõ siêu êm */}
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
                  onChange={(e) => {
                    const nextQ = e.target.value;
                    setQuery(nextQ);
                    if (!isWindowOpen) updateOpenState(true, false);
                    const nextH = getAdaptiveHeight(isMobile);
                    setGridHeight(nextH);
                  }}
                  onClick={() => {
                    updateOpenState(true, isFormExpanded);
                  }}
                  onFocus={() => {
                    updateOpenState(true, isFormExpanded);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      if (!isWindowOpen) {
                        updateOpenState(true, false);
                        return;
                      }
                      if (filteredDegrees.length > 0) {
                        setSelectedIndex((prev) => (prev + 1) % filteredDegrees.length);
                      }
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      if (filteredDegrees.length > 0) {
                        setSelectedIndex((prev) => (prev - 1 + filteredDegrees.length) % filteredDegrees.length);
                      }
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      if (isWindowOpen && !isFormExpanded && filteredDegrees[selectedIndex]) {
                        handleSelectDegreeType(filteredDegrees[selectedIndex]);
                      } else {
                        handleDirectSearch();
                      }
                    }
                  }}
                  placeholder="Tìm nhanh loại văn bằng, chứng chỉ (Đại học, Thạc sĩ, Tin học, VSTEP...)"
                  className="flex-1 h-full py-0 my-0 min-w-0 bg-transparent text-[16px] sm:text-[18px] font-medium tracking-tight outline-none focus:outline-none focus:ring-0 border-0 text-apple-text placeholder:text-apple-muted caret-apple-blue"
                  style={{
                    backgroundColor: 'transparent',
                    background: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                    outline: 'none',
                  }}
                />

                {/* Nút xóa nhanh nội dung tìm kiếm (Chuẩn pill icon xmark.circle.fill của Apple) */}
                <AnimatePresence>
                  {query && (
                    <motion.button
                      type="button"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuery('');
                        inputRef.current?.focus();
                        const nextH = getAdaptiveHeight(isMobile);
                        setGridHeight(nextH);
                      }}
                      className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#8E8E93]/20 hover:bg-[#8E8E93]/35 text-[#6E6E73] hover:text-[#1D1D1F] flex items-center justify-center transition-colors cursor-pointer outline-none focus:outline-none mr-1.5 shrink-0 select-none"
                      title="Xóa nội dung tìm kiếm"
                      aria-label="Xóa nội dung tìm kiếm"
                    >
                      <X className="w-3 h-3 stroke-[2.8]" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Nút hành động phải: Chuyển đổi siêu mượt giữa "Tra cứu" (khi đóng) và "Nút X" (khi mở) */}
                <div className="relative flex items-center justify-end shrink-0">
                  <AnimatePresence mode="wait" initial={false}>
                    {isWindowOpen && (
                      <motion.button
                        key="action-close-btn"
                        type="button"
                        initial={{ opacity: 0, scale: 0.88, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.88, rotate: 45 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOpenState(false, false);
                        }}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-transparent text-apple-text hover:bg-graySurface-subtle active:bg-apple-hover transition-colors duration-150 cursor-pointer shrink-0 select-none border-0 outline-none focus:outline-none"
                        title="Đóng (Esc)"
                        aria-label="Đóng bảng tra cứu"
                      >
                        <X className="w-5 h-5 sm:w-[22px] sm:h-[22px]" strokeWidth={2.3} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="top-header-form"
                initial={{ opacity: 0, y: slideDirection === 'forward' ? 4 : -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: slideDirection === 'forward' ? -4 : 4 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full flex items-center justify-between px-3.5 min-[380px]:px-4 sm:px-7 gap-3 select-none"
              >
                {/* Cụm biểu tượng Squircle loại bằng + Tiêu đề tra cứu */}
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <div
                    className={`w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-[13px] sm:rounded-[15px] bg-gradient-to-br ${selectedDegree.gradient} text-white flex items-center justify-center shrink-0 ${selectedDegree.shadow} ring-1 ring-inset ring-white/20`}
                  >
                    {(() => {
                      const DegreeHeaderIcon = selectedDegree.icon || GraduationCap;
                      return <DegreeHeaderIcon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />;
                    })()}
                  </div>

                  <div className="min-w-0 py-0.5">
                    <h2 className="text-[22px] sm:text-[28px] font-bold text-[#1D1D1F] tracking-tight leading-[1.25] whitespace-nowrap">
                      Tra cứu {selectedDegree.title}
                    </h2>
                  </div>
                </div>

                {/* Nút quay lại danh sách chọn loại bằng: Dạng pill rõ nghĩa chuẩn UX Apple, tự co lại icon trên màn hình hẹp */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  onClick={() => {
                    if (isOpenedFromShortcut) {
                      setIsOpenedFromShortcut(false);
                      updateOpenState(false, false);
                    } else {
                      setIsSwitchingView(true);
                      setSlideDirection('backward');
                      updateOpenState(true, false);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 h-10 sm:h-11 px-3 sm:px-4 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] active:bg-[#DFDFE4] text-[#1D1D1F] text-[13.5px] sm:text-[14px] font-semibold transition-colors duration-150 cursor-pointer select-none border-0 outline-none focus:outline-none shrink-0"
                  title={isOpenedFromShortcut ? "Đóng (Quay lại trang chủ)" : "Đổi loại bằng khác (Quay lại)"}
                  aria-label={isOpenedFromShortcut ? "Đóng (Quay lại trang chủ)" : "Đổi loại bằng khác (Quay lại)"}
                >
                  <ChevronLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[2.4] -ml-0.5" />
                  <span className="hidden min-[460px]:inline whitespace-nowrap">Đổi loại bằng</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PHẦN THÂN MỞ RỘNG (CHIPS + DANH SÁCH HOẶC FORM TRA CỨU) */}
        <AnimatePresence
          onExitComplete={() => {
            setCategoryFilter('all');
            setSelectedIndex(0);
          }}
        >
          {isWindowOpen && (
            <motion.div
              key="floodlight-body-flow"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: isFormExpanded && !isMobile ? formHeight : gridHeight,
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: {
                  height: {
                    duration: 0.46,
                    ease: [0.16, 1, 0.3, 1],
                  },
                  opacity: {
                    duration: 0.26,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
              }}
              transition={{
                height: {
                  duration: 0.52,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: {
                  duration: 0.32,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              className="w-full relative overflow-hidden border-t border-slate-100"
            >
              <div ref={bodyContentRef} className="w-full">
                <AnimatePresence mode="wait" custom={slideDirection} initial={false}>
                  {(!isFormExpanded || isMobile) ? (
                    /* ===================================================================== */
                    /* CHẾ ĐỘ 1: DANH SÁCH HÀNG & CHIPS CHUẨN FLOODLIGHT (IMAGE 2)           */
                    /* ===================================================================== */
                    <motion.div
                      key="spotlight-list-view"
                      ref={setGridRef}
                      custom={slideDirection}
                      variants={viewVariants}
                      initial={isSwitchingView && !isMobile ? "enter" : false}
                      animate="center"
                      exit="exit"
                      style={{ willChange: 'transform, opacity' }}
                      className="w-full"
                    >
                      {/* THANH CHIPS LỌC DANH MỤC: PLATTER NỀN #E8E8ED CHUẨN APPLE (MOBILE 44PX, DESKTOP 56PX) */}
                      <div
                        ref={platterHeaderRef}
                        className="flex items-center justify-between gap-2.5 sm:gap-4 px-3 sm:px-5 py-2 sm:py-3.5 border-b border-slate-100 bg-white"
                      >
                        {/* Apple TabNav Platter: Chuẩn Apple 44px trên Mobile (p-4px), 56px trên Desktop (p-6px) */}
                        <div
                          ref={platterRef}
                          className="relative h-[44px] sm:h-[56px] bg-[#E8E8ED] p-[4px] sm:p-[6px] rounded-full flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar flex-1 min-w-0 scroll-smooth"
                        >
                          {/* VIÊN PILL DUY NHẤT LƯỚT LIÊN TỤC CHUẨN APPLE MAC (TRƯỢT THUẦN TÚY LEFT & WIDTH 520MS) */}
                          <div
                            className="absolute top-[4px] sm:top-[6px] bottom-[4px] sm:bottom-[6px] bg-white rounded-full pointer-events-none shadow-[0_1.5px_4px_rgba(0,0,0,0.12),0_0.5px_1.5px_rgba(0,0,0,0.06)]"
                            style={{
                              left: `${tabIndicator.left}px`,
                              width: `${tabIndicator.width}px`,
                              opacity: tabIndicator.ready ? 1 : 0,
                              zIndex: 1,
                              transition: 'left 520ms cubic-bezier(0.16, 1, 0.3, 1), width 520ms cubic-bezier(0.16, 1, 0.3, 1)',
                              willChange: 'left, width',
                            }}
                          />

                          {FILTER_CHIPS.map((chip) => {
                            const isCurrent = categoryFilter === chip.id;
                            return (
                              <button
                                key={chip.id}
                                ref={(el) => {
                                  chipRefs.current[chip.id] = el;
                                }}
                                type="button"
                                onClick={(e) => {
                                  if (categoryFilter === chip.id) return;
                                  setCategoryFilter(chip.id);
                                  setSelectedIndex(0);
                                  const nextH = getAdaptiveHeight(isMobile);
                                  setGridHeight(nextH);
                                  // Chỉ cuộn trên màn hình nhỏ di động nếu tab bị khuất mép ngoài vùng nhìn thấy
                                  if (isMobile) {
                                    const platter = platterRef.current;
                                    if (platter) {
                                      if (chip.id === 'all') {
                                        platter.scrollTo({ left: 0, behavior: 'smooth' });
                                      } else {
                                        const btnLeft = e.currentTarget.offsetLeft;
                                        const btnWidth = e.currentTarget.offsetWidth;
                                        const platterWidth = platter.clientWidth;
                                        const targetScrollLeft = btnLeft - (platterWidth - btnWidth) / 2;
                                        platter.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: 'smooth' });
                                      }
                                    }
                                  }
                                }}
                                className={`relative z-10 h-full inline-flex items-center justify-center px-3 sm:px-2.5 md:px-3 rounded-full text-[14px] sm:text-[17px] whitespace-nowrap shrink-0 sm:flex-1 transition-colors duration-300 cursor-pointer select-none outline-none focus:outline-none [-webkit-tap-highlight-color:transparent] ${isCurrent
                                  ? 'text-[#000000] font-semibold'
                                  : 'text-[#1D1D1F] hover:text-black font-medium'
                                  }`}
                              >
                                <span className="relative z-10 whitespace-nowrap">{chip.label}</span>
                              </button>
                            );
                          })}
                        </div>

                      </div>

                      {/* LƯỚI ICON LAUNCHPAD (7 BIỂU TƯỢNG) */}
                      <motion.div
                        key="view-mode-grid"
                        ref={gridContentRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="p-2 sm:p-2.5 pb-2.5 sm:pb-2.5 max-h-[310px] min-[420px]:max-h-[330px] sm:max-h-[375px] overflow-y-auto overscroll-contain touch-pan-y no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      >
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 lg:gap-2.5 py-1.5">
                          {DEGREE_TYPES.map((deg, idx) => {
                            const IconComponent = deg.icon;
                            const isMatch = isDegreeMatch(deg);
                            return (
                              <motion.button
                                key={deg.id}
                                type="button"
                                animate={{
                                  opacity: isMatch ? 1 : 0.35,
                                }}
                                transition={{
                                  duration: 0.18,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSelectDegreeType(deg);
                                }}
                                className={`degree-launchpad-btn group relative flex flex-col items-center justify-start p-1.5 sm:p-2 rounded-2xl bg-transparent hover:bg-[#F5F5F7] transition-all duration-200 cursor-pointer text-center min-w-0 outline-none focus:outline-none focus:ring-0 ring-0 border-0 shadow-none select-none ${isMatch
                                  ? 'grayscale-0'
                                  : 'grayscale-[50%] hover:opacity-100 hover:grayscale-0'
                                  }`}
                              >
                                <div
                                  className={`relative overflow-hidden w-[54px] h-[54px] sm:w-[74px] sm:h-[74px] rounded-[18px] sm:rounded-[24px] bg-gradient-to-br ${deg.gradient} text-white flex items-center justify-center ${deg.shadow} ring-1 ring-inset ring-white/20 group-hover:scale-105 group-hover:shadow-[0_4px_14px_rgba(0,0,0,0.10)] transition-all duration-200 shrink-0`}
                                >
                                  <IconComponent className="w-7 h-7 sm:w-9 sm:h-9 stroke-[2] relative z-10" />
                                </div>
                                <div className="mt-2.5 sm:mt-3 flex flex-col items-center w-full px-0.5">
                                  <span className="text-[14.5px] sm:text-[17px] font-semibold text-[#1D1D1F] text-center leading-[1.22] whitespace-normal w-full line-clamp-2 tracking-[-0.015em]">
                                    {deg.title}
                                  </span>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    /* ===================================================================== */
                    /* CHẾ ĐỘ 2: Ô THÔNG TIN NHẬP CHỈNH CHU (TRÊN DESKTOP)                   */
                    /* ===================================================================== */
                    <motion.div
                      key="spotlight-form-view"
                      ref={setFormRef}
                      custom={slideDirection}
                      variants={viewVariants}
                      initial={isSwitchingView ? "enter" : false}
                      animate="center"
                      exit="exit"
                      onAnimationComplete={() => setIsSwitchingView(false)}
                      style={{ willChange: 'transform, opacity' }}
                      className={`hidden sm:block w-full px-3.5 min-[380px]:px-4 sm:px-7 pt-4 sm:pt-5 pb-6 sm:pb-7 `}
                    >
                      {/* Form Content: Tái sử dụng đồng nhất */}
                      <div className="w-full">
                        {renderFormContent()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* HÀNG GỢI Ý NHANH CÁC MỤC ĐƯỢC CHỌN NHIỀU NHẤT */}
      <AnimatePresence initial={false}>
        {!isWindowOpen && (
          <motion.div
            initial={false}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{
              opacity: 0,
              height: 0,
              transition: {
                height: { duration: 0.46, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.26, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            transition={{
              height: { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.38, delay: 0.06, ease: [0.16, 1, 0.3, 1] },
            }}
            className="w-full overflow-hidden"
          >
            <div className="pt-6 pb-2 sm:pt-9 md:pt-10 sm:pb-3 flex justify-center w-full px-3 sm:px-2">
              <div className="grid grid-cols-3 gap-2.5 sm:flex sm:items-center sm:justify-center sm:gap-5 md:gap-6 w-full max-w-[375px] sm:max-w-none mx-auto">
                {POPULAR_SEARCH_SHORTCUTS.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        const targetDeg = DEGREE_TYPES.find((d) => d.id === item.degreeId);
                        if (targetDeg) {
                          handleSelectDegreeType(targetDeg, true);
                        }
                      }}
                      className="group w-full sm:w-[156px] md:w-[170px] min-h-[114px] sm:min-h-[142px] py-4 sm:py-5.5 px-2 sm:px-4 rounded-[22px] sm:rounded-[28px] bg-white/80 hover:bg-white backdrop-blur-2xl border-0 outline-none ring-0 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.06),0_2px_6px_-1px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_32px_-6px_rgba(0,0,0,0.10),0_4px_10px_-2px_rgba(0,0,0,0.04)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer select-none isolate [-webkit-tap-highlight-color:transparent]"
                    >
                      {/* Squircle Icon Apple: Tỷ lệ hài hòa cho cả mobile và desktop */}
                      <div
                        className={`relative overflow-hidden w-[50px] h-[50px] sm:w-[68px] sm:h-[68px] rounded-[16px] sm:rounded-[22px] bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center ${item.shadow} ring-1 ring-inset ring-white/20 group-hover:scale-105 group-hover:shadow-[0_4px_14px_rgba(0,0,0,0.10)] transition-all duration-200 shrink-0`}
                      >
                        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2] relative z-10" />
                      </div>

                      {/* Tiêu đề: Mobile 14px, Web 16px chuẩn xác theo yêu cầu */}
                      <span className="w-full mt-2.5 sm:mt-3 text-[14px] sm:text-[16px] font-semibold text-[#1D1D1F] tracking-tight text-center leading-[1.25] sm:leading-snug break-words">
                        {item.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* KHUNG BOTTOM SHEET TRÊN MOBILE CHUẨN HIỆU ỨNG HIỆN CÓ CỦA WEBSITE         */}
      {/* (ĐỒNG BỘ 100% HIỆU ỨNG ĐẨY LÊN RA KẾT QUẢ / BÁO KHÔNG CÓ DỮ LIỆU)        */}
      {/* ========================================================================= */}
      {isMounted && typeof document !== 'undefined' && (isFormExpanded || isClosingMobileSheet) && isMobile && createPortal(
        <div
          id="mobile-form-bottom-sheet"
          className={`fixed inset-0 z-[999] sm:hidden flex flex-col justify-end overflow-hidden ${isClosingMobileSheet ? 'animate-omninotch-backdrop-exit' : 'animate-omninotch-backdrop-enter'
            }`}
        >
          {/* Lớp Backdrop làm mờ toàn màn hình chuẩn khung kết quả */}
          <div
            className="absolute inset-0 bg-slate-900/22 backdrop-blur-[4px] cursor-pointer select-none no-print"
            onClick={() => handleCloseMobileSheet(false)}
            aria-label="Bấm ra ngoài để đóng bảng tra cứu"
          />

          {/* Khung Drawer chuẩn hiệu ứng hiện có (đẩy lên ra kết quả / báo không có dữ liệu) */}
          <div
            className={`w-full flex justify-center mt-auto relative z-10 pointer-events-auto ${isClosingMobileSheet ? 'mobile-drawer-exit' : 'mobile-drawer-enter'
              }`}
          >
            <div className="relative w-full bg-white rounded-t-[36px] shadow-[0_24px_70px_-15px_rgba(15,23,42,0.28),0_10px_28px_-4px_rgba(15,23,42,0.12)] max-h-[80dvh] flex flex-col overflow-hidden outline-none">
              {/* Thanh gạt tay kéo vuốt (Drag Handle) */}
              <div
                onClick={() => handleCloseMobileSheet(false)}
                className="pt-3 pb-2 flex justify-center shrink-0 cursor-pointer group select-none"
                title="Chạm hoặc vuốt để thu lại"
              >
                <div className="w-10 h-1.2 rounded-full bg-slate-300 group-hover:bg-slate-400 group-active:bg-slate-500 transition-colors" />
              </div>

              <div className="flex items-center justify-between px-4 min-[380px]:px-5 py-2.5 border-b border-slate-100 shrink-0 gap-3">
                {/* Cụm Tiêu đề bên trái: squircle icon + Tên loại bằng to rõ */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-[50px] h-[50px] rounded-[16px] bg-gradient-to-br ${selectedDegree.gradient} text-white flex items-center justify-center shrink-0 shadow-md ${selectedDegree.shadow}`}
                  >
                    {(() => {
                      const DegreeHeaderIcon = selectedDegree.icon || GraduationCap;
                      return <DegreeHeaderIcon className="w-[28px] h-[28px] stroke-[2.2]" />;
                    })()}
                  </div>

                  <div className="min-w-0 text-left flex-1 py-0.5">
                    <h2 className="text-[17px] sm:text-[19px] font-bold text-[#1D1D1F] tracking-tight leading-[1.25] truncate">
                      Tra cứu {selectedDegree.title}
                    </h2>
                  </div>
                </div>

                {/* Nút dấu chevron < quay lại/đổi loại (Chuẩn Apple: Nền xám #F5F5F7, to rõ dễ chạm) */}
                <button
                  type="button"
                  onClick={() => handleCloseMobileSheet(!isOpenedFromShortcut)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F5F5F7] hover:bg-[#E8E8ED] active:bg-[#DFDFE4] text-[#1D1D1F] transition-colors shrink-0 select-none border-0 outline-none cursor-pointer"
                  title={isOpenedFromShortcut ? "Đóng (Quay lại trang chủ)" : "Đổi loại bằng (Quay lại)"}
                  aria-label={isOpenedFromShortcut ? "Đóng (Quay lại trang chủ)" : "Đổi loại bằng (Quay lại)"}
                >
                  <ChevronLeft className="w-5 h-5 stroke-[2.4]" />
                </button>
              </div>

              {/* Thân Form cuộn mượt mà, bàn phím ảo bật lên tự co giãn không che nút */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] touch-pan-y">
                {renderFormContent()}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
