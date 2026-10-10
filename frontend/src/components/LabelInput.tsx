'use client';

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Eye, EyeOff, Check, ChevronDown, ChevronLeft, ChevronRight, Calendar, AlertCircle } from "lucide-react";

/* ══ Label input ══════════════════════════════════════════
   A field whose label is its placeholder until you are in it.
   On focus the label lifts into the top edge with a small hop
   running along its letters, the outline darkens in place, and
   the top line parts under the label from its middle outward.

   ── ONE THING MOVES ─────────────────────────────────────
   It used to DRAW its outline out of the notch, both ways
   round the field — and that was the field performing, which
   is too much for a thing you focus forty times a day. Now the
   outline is always whole; focus only changes its ink and
   opens the gap. The label is the event, and the line makes
   room for it.

   The gap is two short paths across the notch, each from the
   middle to one side, retracted from the middle outward by a
   negative dash offset. */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* the lifted label's size, against its resting one (calibrated for high legibility) */
const S = 0.85;
/* the stroke sits half a stroke inside the box so none of it
   is clipped by the svg's own edge */
const IN = 0.75;

export interface SelectOption {
  value: string;
  label: string;
  desc?: string;
  badge?: string;
}

export interface LabelInputProps {
  label?: string;
  field?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  type?: string;
  options?: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  name?: string;
  id?: string;
  subLabel?: React.ReactNode;
  corner?: number;
  height?: number;
  showcase?: boolean;
  className?: string;
  autoComplete?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

export function LabelInput({
  label: customLabel,
  field = "Email",
  value: controlledValue,
  onChange,
  placeholder,
  type,
  options,
  required = false,
  disabled = false,
  name,
  id: customId,
  subLabel,
  corner = 18,
  height: customH = 72,
  showcase = false,
  className = "",
  autoComplete = "off",
  onBlur,
  error,
}: LabelInputProps = {}) {
  const H = customH;
  const r = clamp(corner, 0, H / 2);
  const secret = type === "password" || field === "Password";
  const isSelect = Array.isArray(options) && options.length > 0;
  const isDate = type === "date";
  const label = customLabel || (secret ? "Password" : field || "Email");
  const autoId = `lbi-${useId().replace(/:/g, "")}`;
  const id = customId || autoId;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const lastToggleTimeRef = useRef(0);

  const [mounted, setMounted] = useState(false);
  const [popoverRendered, setPopoverRendered] = useState(false);
  const [popoverPlacement, setPopoverPlacement] = useState<"bottom" | "top">("bottom");
  const [popoverCoords, setPopoverCoords] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    transformOrigin?: string;
  }>({ left: 0, width: 0 });
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  const [focus, setFocus] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"days" | "months" | "years">("days");

  const datePickerContentRef = useRef<HTMLDivElement | null>(null);
  const selectedYearRef = useRef<HTMLButtonElement | null>(null);
  const yearListRef = useRef<HTMLDivElement | null>(null);
  const [quiet] = useState(() => showcase && typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches);
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState("");
  const value = isControlled ? controlledValue : uncontrolledValue;

  const [lastError, setLastError] = useState(error);
  useEffect(() => {
    if (error) {
      setLastError(error);
    } else {
      const timer = setTimeout(() => setLastError(undefined), 240);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // When value is reset/cleared, close any open date picker or dropdown
  useEffect(() => {
    if (value === "") {
      setDatePickerOpen(false);
      setDropdownOpen(false);
      setFocus(false);
    }
  }, [value]);

  // Parse YYYY-MM-DD for custom date picker
  const parsedDate = useMemo(() => {
    if (!value || typeof value !== "string") return null;
    const parts = value.split("-");
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return { year: y, month: m, day: d };
      }
    }
    return null;
  }, [value]);

  const displayDate = parsedDate
    ? `${String(parsedDate.day).padStart(2, "0")}/${String(parsedDate.month).padStart(2, "0")}/${parsedDate.year}`
    : value || "";

  const [viewYear, setViewYear] = useState(() => parsedDate ? parsedDate.year : 2001);
  const [viewMonth, setViewMonth] = useState(() => parsedDate ? parsedDate.month - 1 : 4);
  const [yearScrollTrigger, setYearScrollTrigger] = useState(0);

  useEffect(() => {
    if (parsedDate) {
      setViewYear(parsedDate.year);
      setViewMonth(parsedDate.month - 1);
    }
  }, [parsedDate]);

  // Cuộn năm đã chọn vào giữa danh sách một cách êm ái, mượt mà (khi mở năm, đổi năm, hoặc bấm Hôm nay)
  useEffect(() => {
    if (datePickerOpen && viewMode === "years" && yearListRef.current) {
      let animId: number;
      const timer = setTimeout(() => {
        const container = yearListRef.current;
        const target = selectedYearRef.current;
        if (!container || !target) return;

        const targetTop = target.offsetTop - container.offsetTop;
        const targetScrollPos = Math.max(0, targetTop - container.clientHeight / 2 + target.clientHeight / 2);
        const startScrollPos = container.scrollTop;
        const distance = targetScrollPos - startScrollPos;

        if (Math.abs(distance) < 2) return;

        const duration = 520; // 520ms lướt êm ái, nhẹ nhàng, không bị giật nhanh
        const startTime = performance.now();
        const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

        const step = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          container.scrollTop = startScrollPos + distance * easeOutQuart(progress);
          if (progress < 1) {
            animId = requestAnimationFrame(step);
          }
        };

        animId = requestAnimationFrame(step);
      }, 80);

      return () => {
        clearTimeout(timer);
        if (animId) cancelAnimationFrame(animId);
      };
    }
  }, [datePickerOpen, viewMode, viewYear, yearScrollTrigger]);

  const [show, setShow] = useState(false);
  const [flip, setFlip] = useState(0);
  const input = useRef<HTMLInputElement | null>(null);

  /* the notch is the label's own width, so it is measured */
  const lab = useRef<HTMLLabelElement | null>(null);
  const [lw, setLw] = useState(60);
  useLayoutEffect(() => {
    if (lab.current) {
      setLw(lab.current.offsetWidth || 60);
    }
  }, [label]);

  /* a different kind of field starts empty — an email left in
     a password box would be shown in the clear */
  useEffect(() => {
    if (!isControlled) {
      setUncontrolledValue("");
    }
    setShow(false);
  }, [field, isControlled]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Delay unmounting popover to allow smooth Apple-grade exit animation
  useEffect(() => {
    if (datePickerOpen || dropdownOpen) {
      setPopoverRendered(true);
    } else {
      const timer = setTimeout(() => {
        setPopoverRendered(false);
        setViewMode("days");
      }, 270);
      return () => clearTimeout(timer);
    }
  }, [datePickerOpen, dropdownOpen]);

  // Viewport-aware positioning: prevents clipping and auto-flips upwards if near bottom of screen
  const updatePopoverPosition = useCallback(() => {
    const el = boxRef.current || containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth < 640;

    const popoverWidth = isDate ? Math.min(350, viewportWidth - 24) : rect.width;
    const popoverHeight = isDate ? 402 : Math.min(260, (options?.length || 4) * 46 + 18);

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < popoverHeight + 16 && spaceAbove > spaceBelow;

    let top = openUpward ? rect.top - popoverHeight - 8 : rect.bottom + 8;
    let left = rect.left;

    if (isDate) {
      if (isMobile) {
        left = Math.max(12, Math.min(viewportWidth - popoverWidth - 12, (viewportWidth - popoverWidth) / 2));
      } else {
        left = Math.max(12, Math.min(viewportWidth - popoverWidth - 12, rect.right - popoverWidth));
      }
    } else {
      left = Math.max(8, Math.min(viewportWidth - popoverWidth - 8, rect.left));
    }

    const placement = openUpward ? "top" : "bottom";
    setPopoverPlacement(placement);

    const origin = openUpward ? "bottom center" : "top center";

    // Đối với lịch (isDate): Cố định tọa độ top tuyệt đối (kể cả khi mở hướng lên)
    // để thanh tiêu đề và các nút điều hướng < Tháng X > luôn đứng yên 100% tại chỗ.
    // Khi tháng thay đổi giữa 5 hàng và 6 hàng, cạnh đáy tự động co giãn (đẩy ra / thu lại)
    // mượt mà mà nút bấm không bao giờ bị nhảy xê dịch khỏi ngón tay/chuột của người dùng!
    const maxDateHeight = 402;
    const dateTop = openUpward
      ? Math.max(8, Math.round(rect.top - maxDateHeight - 8))
      : Math.round(rect.bottom + 8);

    setPopoverCoords({
      top: isDate ? dateTop : (openUpward ? undefined : Math.round(rect.bottom + 8)),
      bottom: isDate ? undefined : (openUpward ? Math.round(viewportHeight - rect.top + 8) : undefined),
      left: Math.round(left),
      width: Math.round(popoverWidth),
      transformOrigin: origin,
    });
  }, [isDate, options]);

  // Tự động đo đạc và kích hoạt chuyển động co giãn (đẩy ra / thu lại) mượt mà khi tháng đổi số tuần (5 tuần ↔ 6 tuần)
  useEffect(() => {
    if (!popoverRendered || !isDate || !datePickerContentRef.current) return;
    const el = datePickerContentRef.current;
    const initialH = el.offsetHeight;
    if (initialH > 0) setContentHeight(initialH);

    const ro = new ResizeObserver(() => {
      if (datePickerContentRef.current) {
        const h = datePickerContentRef.current.offsetHeight;
        if (h > 0) {
          setContentHeight(h);
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [popoverRendered, isDate, viewMode, viewMonth, viewYear]);

  const handleToggleDropdown = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const now = Date.now();
    if (now - lastToggleTimeRef.current < 40) return;
    lastToggleTimeRef.current = now;

    setDropdownOpen((prev) => {
      const next = !prev;
      if (next) {
        updatePopoverPosition();
        setPopoverRendered(true);
        setFocus(true);
      } else {
        setFocus(false);
      }
      return next;
    });
  }, [updatePopoverPosition]);

  const handleToggleDatePicker = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const now = Date.now();
    if (now - lastToggleTimeRef.current < 40) return;
    lastToggleTimeRef.current = now;

    setDatePickerOpen((prev) => {
      const next = !prev;
      if (next) {
        updatePopoverPosition();
        setPopoverRendered(true);
        setFocus(true);
      } else {
        setFocus(false);
      }
      return next;
    });
  }, [updatePopoverPosition]);

  useEffect(() => {
    if (!popoverRendered) return;
    updatePopoverPosition();

    const onScroll = () => updatePopoverPosition();
    const onResize = () => updatePopoverPosition();

    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [popoverRendered, datePickerOpen, dropdownOpen, viewMode, updatePopoverPosition]);

  // Click outside to close custom select dropdown or date picker (checks both container & portaled popover)
  useEffect(() => {
    if (!dropdownOpen && !datePickerOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      const inContainer = containerRef.current && containerRef.current.contains(target);
      const inPopover = popoverRef.current && popoverRef.current.contains(target);
      if (!inContainer && !inPopover) {
        setDropdownOpen(false);
        setDatePickerOpen(false);
        setFocus(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [dropdownOpen, datePickerOpen]);

  // Escape to close custom select dropdown or date picker
  useEffect(() => {
    if (!dropdownOpen && !datePickerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setDatePickerOpen(false);
        setFocus(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dropdownOpen, datePickerOpen]);

  const hasValue = Boolean(value !== undefined && value !== null && String(value).trim().length > 0);
  /* Trạng thái floating: khi click/focus hoặc đã có chữ thì nhãn mới chạy lên */
  const up = Boolean(focus || dropdownOpen || datePickerOpen || hasValue);

  const selectedOption = isSelect
    ? options!.find((opt) => String(opt.value) === String(value)) || (hasValue ? options![0] : null)
    : null;

  /* ── where the label sits ────────────────────────────────
     Aligned naturally with rounded corner (22px) */
  const lx = Math.max(20, r + 4);

  const reveal = () => {
    setShow((s) => !s);
    setFlip((f) => f + 1);
  };

  const isFieldFocused = focus || dropdownOpen || datePickerOpen;

  return (
    <div
      ref={containerRef}
      className={`lbi ${className}`}
      data-up={up}
      data-focus={isFieldFocused}
      data-filled={value ? value.length > 0 : false}
      data-error={Boolean(error)}
      style={{
        zIndex: datePickerOpen || dropdownOpen ? 70 : undefined,
      }}
    >
      {subLabel && (
        <span className="lbi-sublabel text-[13px] text-[#6E6E73] font-medium absolute right-3.5 -top-2 z-10 bg-white px-1 select-none pointer-events-none">
          {subLabel}
        </span>
      )}
      <div
        ref={boxRef}
        className="lbi-box group"
        data-is-select={isSelect || isDate}
        style={{
          width: "100%",
          height: H,
          boxSizing: "border-box",
          borderRadius: r,
          "--lbi-x": `${lx}px`,
          "--lbi-half-h": `${(H / 2).toFixed(1)}px`,
          zIndex: datePickerOpen || dropdownOpen ? 70 : undefined,
        } as React.CSSProperties}
        onClick={
          isSelect
            ? (e) => handleToggleDropdown(e)
            : isDate
              ? (e) => handleToggleDatePicker(e)
              : () => {
                input.current?.focus({ preventScroll: true });
              }
        }
      >
        <label className="lbi-label" htmlFor={isDate || isSelect ? undefined : id} ref={lab}>
          {Array.from(label).map((ch, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties}>{ch === " " ? "\u00A0" : ch}</span>
          ))}
        </label>

        {isDate ? (
          <>
            {/* Custom Eye-Catching Date Picker Trigger Button */}
            <button
              type="button"
              id={id}
              className="lbi-field no-ripple appearance-none cursor-pointer flex items-center text-left select-none outline-none focus:outline-none transition-colors"
              style={{ paddingLeft: lx, paddingRight: 52 }}
              onClick={(e) => handleToggleDatePicker(e)}
              onFocus={() => setFocus(true)}
              onBlur={() => {
                if (!datePickerOpen) setFocus(false);
              }}
              aria-haspopup="dialog"
              aria-expanded={datePickerOpen}
            >
              <span className={`text-[16px] leading-[22px] tracking-[-0.015em] whitespace-nowrap ${displayDate ? "font-semibold text-apple-text" : "text-apple-muted font-normal"}`}>
                {displayDate || placeholder || "dd/mm/yyyy"}
              </span>
            </button>

            {/* Clean Calendar Icon Button with Circular Ripple */}
            <button
              type="button"
              tabIndex={-1}
              aria-label="Mở lịch chọn ngày"
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}
              className={`calendar-icon-btn absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer overflow-hidden z-10 hover:bg-[#F5F5F7] active:scale-95 transition-all duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${datePickerOpen
                ? "text-[#2563EB] scale-105 bg-blue-50/60"
                : "text-[#1D1D1F] scale-100"
                }`}
              onClick={(e) => handleToggleDatePicker(e)}
            >
              <Calendar size={20} strokeWidth={2.2} />
            </button>

            {/* Hidden Input for Form Submission / State compatibility */}
            <input type="hidden" name={name} value={value || ""} />

            {/* Custom Luxury Date Picker Popover với animation bung mở & thu gọn mượt mà chuẩn Apple - Portaled vào document.body */}
            {mounted && popoverRendered && createPortal(
              <div
                ref={popoverRef}
                data-placement={popoverPlacement}
                style={{
                  position: "fixed",
                  top: popoverCoords.top !== undefined ? `${popoverCoords.top}px` : undefined,
                  bottom: popoverCoords.bottom !== undefined ? `${popoverCoords.bottom}px` : undefined,
                  left: `${popoverCoords.left}px`,
                  width: `${popoverCoords.width}px`,
                  height: contentHeight ? `${contentHeight}px` : undefined,
                  transformOrigin: popoverCoords.transformOrigin,
                  zIndex: 99999,
                  backgroundColor: "#ffffff",
                  transition: contentHeight ? "height 320ms cubic-bezier(0.16, 1, 0.3, 1)" : undefined,
                  willChange: "height, transform, opacity",
                }}
                className={`bg-white rounded-[22px] border-0 border-none shadow-[0_24px_65px_-12px_rgba(15,23,42,0.25),0_10px_24px_-4px_rgba(15,23,42,0.10)] overflow-hidden select-none lbi-popover-shell ${datePickerOpen
                  ? "lbi-popover-open"
                  : "lbi-popover-closed"
                  }`}
                role="dialog"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <div ref={datePickerContentRef} className="p-4 bg-white">
                  {/* ══════════════════════════════════════════════════════════════════════════════════
                      DESIGN TOKENS CHO DATE PICKER (CHUẨN APPLE MINIMALIST SYSTEM)
                      - Khung ngoài: bg-white rounded-[22px] shadow-2xl (--color-datepicker-radius)
                      - Chữ chính (Header, Thứ, Ngày thường, Hủy): text-[#1D1D1F] (--color-datepicker-text)
                      - Rê chuột vào (Hover ngày/tháng/năm): hover:bg-blue-50/80 hover:text-[#2563EB]
                      - Mục được chọn (Selected): bg-[#2563EB] text-white shadow-blue-500/25
                      - Mục hôm nay (Today): bg-blue-50/70 text-[#2563EB] font-bold
                      - Nút Xác nhận (CTA): bg-[#2563EB] hover:bg-[#1D4ED8] text-white
                      - Nút Hủy: text-[#1D1D1F] hover:bg-[#F5F5F7] font-semibold
                      ══════════════════════════════════════════════════════════════════════════════════ */}
                  {/* Universal Header: Cố định vị trí, bấm Tháng/Năm để mở và bấm lại chính nó ("nhấn lại tại đây") để thu lại về ngày */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        if (viewMode === "years" || viewMode === "months") {
                          setViewYear((y) => y - 1);
                        } else {
                          if (viewMonth === 0) {
                            setViewMonth(11);
                            setViewYear((y) => y - 1);
                          } else {
                            setViewMonth((m) => m - 1);
                          }
                        }
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer active:scale-95 text-[#1D1D1F] hover:bg-[#F5F5F7] outline-none focus:outline-none ring-0 border-0 border-none select-none"
                      style={{ outline: "none", border: "none" }}
                      title={viewMode === "years" || viewMode === "months" ? "Năm trước" : "Tháng trước"}
                    >
                      <ChevronLeft size={18} strokeWidth={2.5} />
                    </button>

                    <div className="flex items-center justify-center gap-2 flex-1">
                      {/* Bấm Tháng X để mở chọn tháng, bấm lại chính nó để thu lại về ngày (Cố định w-[98px] chống giật vị trí khi đổi số 1-12) */}
                      <button
                        type="button"
                        onClick={() => setViewMode((m) => (m === "months" ? "days" : "months"))}
                        className={`h-8 w-[98px] rounded-lg text-sm font-bold transition-colors duration-150 flex items-center justify-center gap-1 cursor-pointer active:scale-95 tabular-nums shrink-0 outline-none focus:outline-none ring-0 border-0 border-none select-none text-[#1D1D1F] ${
                          viewMode === "months"
                            ? "bg-[#E8E8ED]"
                            : "hover:bg-[#F5F5F7]"
                        }`}
                        style={{ outline: "none", border: "none" }}
                        title={viewMode === "months" ? "Nhấn lại để thu lại về ngày" : "Chọn tháng"}
                      >
                        <span className="tabular-nums">Tháng {viewMonth + 1}</span>
                        <ChevronDown
                          size={14}
                          strokeWidth={2.5}
                          className={`shrink-0 transition-transform duration-200 text-[#1D1D1F] ${
                            viewMode === "months" ? "rotate-180" : "opacity-60"
                          }`}
                        />
                      </button>

                      {/* Bấm Năm để mở chọn năm, bấm lại chính nó để thu lại về ngày (Cố định w-[78px] chống giật vị trí) */}
                      <button
                        type="button"
                        onClick={() => setViewMode((m) => (m === "years" ? "days" : "years"))}
                        className={`h-8 w-[78px] rounded-lg text-sm font-bold transition-colors duration-150 flex items-center justify-center gap-1 cursor-pointer active:scale-95 tabular-nums shrink-0 outline-none focus:outline-none ring-0 border-0 border-none select-none text-[#1D1D1F] ${
                          viewMode === "years"
                            ? "bg-[#E8E8ED]"
                            : "hover:bg-[#F5F5F7]"
                        }`}
                        style={{ outline: "none", border: "none" }}
                        title={viewMode === "years" ? "Nhấn lại để thu lại về ngày" : "Chọn năm"}
                      >
                        <span className="tabular-nums">{viewYear}</span>
                        <ChevronDown
                          size={14}
                          strokeWidth={2.5}
                          className={`shrink-0 transition-transform duration-200 text-[#1D1D1F] ${
                            viewMode === "years" ? "rotate-180" : "opacity-60"
                          }`}
                        />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (viewMode === "years" || viewMode === "months") {
                          setViewYear((y) => y + 1);
                        } else {
                          if (viewMonth === 11) {
                            setViewMonth(0);
                            setViewYear((y) => y + 1);
                          } else {
                            setViewMonth((m) => m + 1);
                          }
                        }
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer active:scale-95 text-[#1D1D1F] hover:bg-[#F5F5F7] outline-none focus:outline-none ring-0 border-0 border-none select-none"
                      style={{ outline: "none", border: "none" }}
                      title={viewMode === "years" || viewMode === "months" ? "Năm sau" : "Tháng sau"}
                    >
                      <ChevronRight size={18} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Body depending on viewMode with synchronized transitions */}
                  {viewMode === "months" ? (
                    <div key="months" className="animate-view-enter h-[264px]">
                      {/* 12 Tháng phân bố đều 4 hàng x 3 cột lấp đầy hài hòa, không bị khoảng trống thừa */}
                      <div className="grid grid-cols-3 grid-rows-4 gap-2.5 h-full">
                        {Array.from({ length: 12 }, (_, i) => {
                          const isCurrentMonth = viewMonth === i;
                          const isRealCurrentMonth = viewYear === new Date().getFullYear() && new Date().getMonth() === i;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setViewMonth(i);
                                setViewMode("days");
                              }}
                              className={`h-full flex items-center justify-center rounded-xl text-[14px] font-bold transition-all duration-150 cursor-pointer outline-none focus:outline-none ring-0 border-0 border-none select-none ${isCurrentMonth
                                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/25 scale-102"
                                : isRealCurrentMonth
                                  ? "text-[#2563EB] font-bold bg-blue-50/70 hover:bg-blue-100/70 active:scale-95"
                                  : "text-[#1D1D1F] hover:bg-blue-50/80 hover:text-[#2563EB] active:scale-95"
                                }`}
                              style={{ outline: "none", border: "none" }}
                            >
                              Tháng {i + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : viewMode === "years" ? (
                    <div key="years" className="animate-view-enter h-[264px]">
                      {/* Scrollable list of years with centered auto-scroll and sleek scrollbar */}
                      <div ref={yearListRef} className="grid grid-cols-4 gap-1.5 h-full max-h-[264px] overflow-y-auto pr-1.5 custom-scrollbar">
                        {Array.from({ length: 77 }, (_, i) => 2026 - i).map((y) => {
                          const isCurrentYear = viewYear === y;
                          const isRealCurrentYear = new Date().getFullYear() === y;
                          return (
                            <button
                              key={y}
                              ref={isCurrentYear ? selectedYearRef : undefined}
                              type="button"
                              onClick={() => {
                                setViewYear(y);
                                setViewMode("days");
                              }}
                              className={`py-2.5 rounded-xl text-[13px] font-bold transition-all duration-150 cursor-pointer outline-none focus:outline-none ring-0 border-0 border-none select-none ${isCurrentYear
                                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/25 scale-102"
                                : isRealCurrentYear
                                  ? "text-[#2563EB] font-bold bg-blue-50/70 hover:bg-blue-100/70 active:scale-95"
                                  : "text-[#1D1D1F] hover:bg-blue-50/80 hover:text-[#2563EB] active:scale-95"
                                }`}
                              style={{ outline: "none", border: "none" }}
                            >
                              {y}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div key="days" className="animate-view-enter">

                      {/* Days of week header */}
                      <div className="grid grid-cols-7 gap-1 text-center mb-1.5 pb-1 border-b border-slate-100">
                        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((dayName) => (
                          <div
                            key={dayName}
                            className="text-[11.5px] font-bold py-0.5 text-[#1D1D1F]"
                          >
                            {dayName}
                          </div>
                        ))}
                      </div>

                      {/* Days grid with smooth month fade transition */}
                      <div key={`${viewYear}-${viewMonth}`} className="grid grid-cols-7 gap-1 animate-month-fade">
                        {(() => {
                          const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
                          const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
                          const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

                          const cells = [];
                          for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                            cells.push({ day: prevMonthDays - i, isCurrent: false, monthOffset: -1 });
                          }
                          for (let d = 1; d <= daysInMonth; d++) {
                            cells.push({ day: d, isCurrent: true, monthOffset: 0 });
                          }
                          // Chuẩn quốc tế cho lịch tháng: Luôn hiển thị cố định đúng 6 hàng (42 ô)
                          // Giúp chiều cao lịch luôn đứng yên 100%, nút bấm điều hướng không bao giờ bị nhảy vị trí
                          const totalSlots = 42;
                          const remaining = totalSlots - cells.length;
                          for (let d = 1; d <= remaining; d++) {
                            cells.push({ day: d, isCurrent: false, monthOffset: 1 });
                          }

                          return cells.map((cell, idx) => {
                            let cellYear = viewYear;
                            let cellMonth = viewMonth;
                            if (cell.monthOffset === -1) {
                              cellMonth = viewMonth === 0 ? 11 : viewMonth - 1;
                              cellYear = viewMonth === 0 ? viewYear - 1 : viewYear;
                            } else if (cell.monthOffset === 1) {
                              cellMonth = viewMonth === 11 ? 0 : viewMonth + 1;
                              cellYear = viewMonth === 11 ? viewYear + 1 : viewYear;
                            }

                            const isSelected =
                              parsedDate &&
                              parsedDate.year === cellYear &&
                              parsedDate.month === cellMonth + 1 &&
                              parsedDate.day === cell.day;

                            const today = new Date();
                            const isToday =
                              today.getFullYear() === cellYear &&
                              today.getMonth() === cellMonth &&
                              today.getDate() === cell.day;

                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  const valStr = `${cellYear}-${String(cellMonth + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;
                                  if (!isControlled) setUncontrolledValue(valStr);
                                  if (onChange) {
                                    onChange({
                                      target: { value: valStr, name: name || id },
                                    } as any);
                                  }
                                  setDatePickerOpen(false);
                                  setFocus(false);
                                }}
                                className={`w-9 h-9 rounded-xl text-[13px] flex items-center justify-center transition-all duration-150 cursor-pointer relative overflow-hidden select-none outline-none focus:outline-none ring-0 border-0 border-none ${isSelected
                                  ? "bg-[#2563EB] text-white font-bold shadow-md shadow-blue-500/25 scale-105"
                                  : isToday
                                    ? "text-[#2563EB] font-bold bg-blue-50/70 hover:bg-blue-100/70 hover:scale-105 active:scale-95"
                                    : cell.isCurrent
                                      ? "text-[#1D1D1F] hover:bg-blue-50/80 hover:text-[#2563EB] font-semibold active:scale-95 hover:scale-105"
                                      : "text-slate-400 font-medium hover:bg-blue-50/60 hover:text-[#2563EB] hover:font-bold hover:scale-105 active:scale-95"
                                  }`}
                              >
                                {cell.day}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Footer Actions: Nút Hủy (không xóa ngày), Hôm nay & Xác nhận */}
                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setDatePickerOpen(false);
                        setFocus(false);
                      }}
                      className="relative overflow-hidden px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all duration-150 cursor-pointer active:scale-95 border-0 border-none outline-none select-none"
                    >
                      Hủy
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date();
                          const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                          if (!isControlled) setUncontrolledValue(todayStr);
                          if (onChange) {
                            onChange({
                              target: { value: todayStr, name: name || id },
                            } as any);
                          }
                          setViewYear(today.getFullYear());
                          setViewMonth(today.getMonth());
                          setYearScrollTrigger((c) => c + 1);
                        }}
                        className="relative overflow-hidden px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:bg-blue-50/70 transition-all duration-150 cursor-pointer active:scale-95 border-0 border-none outline-none select-none"
                      >
                        Hôm nay
                      </button>

                      <button
                        type="button"
                        data-ripple="rgba(255, 255, 255, 0.35)"
                        onClick={() => {
                          const currentDay = parsedDate?.day || (viewMonth === new Date().getMonth() && viewYear === new Date().getFullYear() ? new Date().getDate() : 1);
                          const valStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(currentDay).padStart(2, "0")}`;
                          if (!isControlled) setUncontrolledValue(valStr);
                          if (onChange) {
                            onChange({
                              target: { value: valStr, name: name || id },
                            } as any);
                          }
                          setDatePickerOpen(false);
                          setFocus(false);
                        }}
                        className="relative overflow-hidden px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm shadow-blue-500/25 transition-all duration-150 cursor-pointer active:scale-95 border-0 border-none outline-none select-none"
                      >
                        Xác nhận
                      </button>
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}
          </>
        ) : isSelect ? (
          <>
            {/* Custom Eye-Catching Select Trigger Button */}
            <button
              type="button"
              id={id}
              className="lbi-field appearance-none cursor-pointer flex items-center text-left select-none outline-none focus:outline-none transition-colors"
              style={{ paddingLeft: lx, paddingRight: 52 }}
              onClick={(e) => handleToggleDropdown(e)}
              onFocus={() => setFocus(true)}
              onBlur={() => {
                if (!dropdownOpen) setFocus(false);
              }}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              <div className="flex items-center min-w-0 w-full pr-1">
                <span className={`truncate text-[16px] leading-[22px] tracking-[-0.015em] ${selectedOption ? "font-semibold text-apple-text" : "text-apple-muted font-normal"}`}>
                  {selectedOption?.label || placeholder || ""}
                </span>
              </div>
            </button>

            {/* Sleek Chevron Arrow (No background box) */}
            <div
              className={`absolute right-5 top-1/2 -translate-y-1/2 transition-[transform,color] duration-[380ms] ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none ${dropdownOpen
                ? "text-[#2563EB] rotate-180 scale-110"
                : "text-[#1D1D1F] rotate-0 scale-100"
                }`}
            >
              <ChevronDown size={20} strokeWidth={2.4} />
            </div>

            {/* Hidden Input for Form Submission / State compatibility */}
            <input type="hidden" name={name} value={value || ""} />

            {/* Eye-Catching Custom Dropdown Menu với animation bung mở & thu gọn mượt mà - Portaled vào document.body */}
            {mounted && popoverRendered && createPortal(
              <div
                ref={popoverRef}
                data-placement={popoverPlacement}
                style={{
                  position: "fixed",
                  top: popoverCoords.top !== undefined ? `${popoverCoords.top}px` : undefined,
                  bottom: popoverCoords.bottom !== undefined ? `${popoverCoords.bottom}px` : undefined,
                  left: `${popoverCoords.left}px`,
                  width: `${popoverCoords.width}px`,
                  transformOrigin: popoverCoords.transformOrigin,
                  zIndex: 99999,
                  backgroundColor: "#ffffff",
                }}
                className={`bg-white rounded-[22px] border-0 border-none shadow-[0_24px_65px_-12px_rgba(15,23,42,0.25),0_10px_24px_-4px_rgba(15,23,42,0.10)] overflow-hidden p-2 select-none lbi-popover-shell ${dropdownOpen
                  ? "lbi-popover-open"
                  : "lbi-popover-closed"
                  }`}
                role="listbox"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                {/* ══════════════════════════════════════════════════════════════════════════════════
                    DESIGN TOKENS CHO SELECT DROPDOWN (CHUẨN APPLE MINIMALIST SYSTEM)
                    - Khung ngoài: bg-white rounded-[22px] p-2
                    - Mục thường: text-[#1D1D1F] hover:bg-[#F5F5F7] font-medium
                    - Mục được chọn: bg-blue-50 text-[#2563EB] font-semibold + Check xanh #2563EB
                    - Mũi tên Chevron: hover #1D1D1F, khi mở text-[#2563EB] xoay 180deg
                    ══════════════════════════════════════════════════════════════════════════════════ */}
                <div className="space-y-1 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {options!.map((opt) => {
                    const isSelected = String(opt.value) === String(value);
                    return (
                      <div
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          if (!isControlled) setUncontrolledValue(opt.value);
                          if (onChange) {
                            onChange({
                              target: { value: opt.value, name: name || id },
                            } as any);
                          }
                          setDropdownOpen(false);
                          setFocus(false);
                        }}
                        className={`group/item relative overflow-hidden flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 select-none border-0 border-none outline-none ${isSelected
                          ? "bg-blue-50 text-[#2563EB] font-semibold"
                          : "text-[#1D1D1F] hover:bg-[#F5F5F7] font-medium active:scale-[0.99]"
                          }`}
                      >
                        <span
                          className={`text-[15px] truncate transition-colors ${isSelected ? "text-[#2563EB] font-semibold" : "text-[#1D1D1F]"
                            }`}
                        >
                          {opt.label}
                        </span>

                        {isSelected && (
                          <Check className="w-4 h-4 text-[#2563EB] stroke-[2.5] shrink-0 ml-2.5" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>,
              document.body
            )}
          </>
        ) : (
          <input
            ref={input}
            id={id}
            name={name}
            className="lbi-field"
            type={secret && !show ? "password" : secret ? "text" : type || "text"}
            value={value}
            required={required}
            disabled={disabled}
            placeholder={placeholder || ""}
            onChange={(e) => {
              if (!isControlled) setUncontrolledValue(e.target.value);
              if (onChange) onChange(e);
            }}
            onFocus={() => setFocus(true)}
            onBlur={(e) => {
              setFocus(false);
              if (onBlur) onBlur(e);
            }}
            autoComplete={autoComplete}
            spellCheck={false}
            /* ── no keyboard, when it is only being shown ─────
               In a feed you are scrolling on a phone, a tap that
               lands on the field threw the keyboard up over the
               page. inputMode "none" keeps everything the block is
               about — the focus, the label lifting, the gap
               opening — and only tells the device not to raise its
               keyboard. A mouse and a hardware keyboard are
               untouched, and so is any real use of this field. */
            inputMode={quiet ? "none" : undefined}
            style={{ paddingRight: secret ? 52 : lx }}
          />
        )}

        {secret && (
          <button
            className="lbi-eye"
            type="button"
            data-show={show}
            /* keep focus in the field: the eye is a toggle on
               what you are typing, not somewhere to go */
            onPointerDown={(e) => e.preventDefault()}
            onClick={reveal}
            aria-label={show ? "Hide password" : "Show password"}
          >
            <Eye size={16} strokeWidth={2} aria-hidden="true" />
            <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="lbi-error-wrapper" data-show={Boolean(error)} aria-live="polite">
        <div className="lbi-error-inner">
          <div className="lbi-error-msg" role="alert">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#D72134] lbi-error-icon" strokeWidth={2.4} aria-hidden="true" />
            <span>{error || lastError || ""}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabelInput;
