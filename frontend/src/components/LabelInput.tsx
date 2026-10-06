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
  corner = 22,
  height: customH = 70,
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

  const [mounted, setMounted] = useState(false);
  const [popoverRendered, setPopoverRendered] = useState(false);
  const [popoverPlacement, setPopoverPlacement] = useState<"bottom" | "top">("bottom");
  const [popoverCoords, setPopoverCoords] = useState<{
    top: number;
    left: number;
    width: number;
    transformOrigin?: string;
  }>({ top: 0, left: 0, width: 0 });

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
      const timer = setTimeout(() => setLastError(undefined), 320);
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

  useEffect(() => {
    if (parsedDate) {
      setViewYear(parsedDate.year);
      setViewMonth(parsedDate.month - 1);
    }
  }, [parsedDate]);

  // Cuộn năm đã chọn vào giữa danh sách mà CHỈ CUỘN BÊN TRONG HỘP NĂM, KHÔNG ĐẨY MÀN HÌNH NGOÀI!
  useEffect(() => {
    if (datePickerOpen && viewMode === "years" && selectedYearRef.current && yearListRef.current) {
      const timer = setTimeout(() => {
        const container = yearListRef.current;
        const target = selectedYearRef.current;
        if (container && target) {
          const targetTop = target.offsetTop - container.offsetTop;
          const scrollPos = targetTop - container.clientHeight / 2 + target.clientHeight / 2;
          container.scrollTo({ top: Math.max(0, scrollPos), behavior: "smooth" });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [datePickerOpen, viewMode]);

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
      }, 380);
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
    const popoverHeight = isDate ? 395 : Math.min(260, (options?.length || 4) * 46 + 18);

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

    const origin = openUpward
      ? (isDate && !isMobile ? "bottom right" : "bottom center")
      : (isDate && !isMobile ? "top right" : "top center");

    setPopoverCoords({
      top: Math.round(top),
      left: Math.round(left),
      width: Math.round(popoverWidth),
      transformOrigin: origin,
    });
  }, [isDate, options]);

  const handleToggleDropdown = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!dropdownOpen) {
      updatePopoverPosition();
      setPopoverRendered(true);
      setDropdownOpen(true);
      setFocus(true);
    } else {
      setDropdownOpen(false);
      setFocus(false);
    }
  }, [dropdownOpen, updatePopoverPosition]);

  const handleToggleDatePicker = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!datePickerOpen) {
      updatePopoverPosition();
      setPopoverRendered(true);
      setDatePickerOpen(true);
      setFocus(true);
    } else {
      setDatePickerOpen(false);
      setFocus(false);
    }
  }, [datePickerOpen, updatePopoverPosition]);

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

  /* A select or date input always has lifted label state so value is legible, or when there is an error */
  const up = isSelect || isDate || focus || dropdownOpen || datePickerOpen || (value ? value.length > 0 : false) || Boolean(error);

  const selectedOption = isSelect
    ? options!.find((opt) => String(opt.value) === String(value)) || options![0]
    : null;

  /* ── where the label sits ────────────────────────────────
     Aligned naturally with rounded corner (20px) */
  const lx = Math.max(18, r + 2);

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
        <span className="lbi-sublabel text-xs text-gray-400 font-medium absolute right-3.5 -top-2 z-10 bg-white px-1 select-none pointer-events-none">
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
          borderRadius: r,
          "--lbi-x": `${lx}px`,
          "--lbi-half-h": `${(H / 2).toFixed(1)}px`,
          zIndex: datePickerOpen || dropdownOpen ? 70 : undefined,
          backgroundColor: isFieldFocused ? "#ffffff" : undefined,
          borderColor: isFieldFocused ? "#D72134" : undefined,
          boxShadow: isFieldFocused ? "0 0 0 3.5px rgba(215, 33, 52, 0.18)" : undefined,
        } as React.CSSProperties}
        onClick={
          isSelect
            ? (e) => handleToggleDropdown(e)
            : isDate
              ? (e) => handleToggleDatePicker(e)
              : () => {
                input.current?.focus();
              }
        }
      >
        <label className="lbi-label" htmlFor={id} ref={lab}>
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
              className="lbi-field no-ripple appearance-none cursor-pointer flex items-center justify-between text-left select-none outline-none focus:outline-none transition-colors"
              style={{ paddingLeft: lx, paddingRight: 52 }}
              onClick={(e) => handleToggleDatePicker(e)}
              onFocus={() => setFocus(true)}
              onBlur={() => {
                if (!datePickerOpen) setFocus(false);
              }}
              aria-haspopup="dialog"
              aria-expanded={datePickerOpen}
            >
              <span className={`truncate text-[17px] ${displayDate ? "font-medium text-slate-800" : "text-[#64748b] font-normal"}`}>
                {displayDate || (up ? placeholder || "Chọn ngày sinh (Ngày/Tháng/Năm)" : "")}
              </span>
            </button>

            {/* Clean Calendar Icon Button with Circular Ripple */}
            <button
              type="button"
              tabIndex={-1}
              aria-label="Mở lịch chọn ngày"
              data-ripple="rgba(215, 33, 52, 0.22)"
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}
              className={`calendar-icon-btn absolute right-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer overflow-hidden z-10 hover:bg-red-50/60 active:scale-95 ${datePickerOpen
                  ? "text-[#D72134] scale-105 bg-red-50/40"
                  : "text-slate-400 group-hover:text-[#D72134] scale-100"
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
                  top: `${popoverCoords.top}px`,
                  left: `${popoverCoords.left}px`,
                  width: `${popoverCoords.width}px`,
                  transformOrigin: popoverCoords.transformOrigin,
                  zIndex: 99999,
                }}
                className={`bg-white/98 backdrop-blur-2xl rounded-2xl border-0 border-none shadow-[0_24px_50px_-12px_rgba(15,23,42,0.18),0_10px_24px_-4px_rgba(15,23,42,0.08)] overflow-hidden select-none lbi-popover-shell ${datePickerOpen
                    ? "lbi-popover-open"
                    : "lbi-popover-closed"
                  }`}
                role="dialog"
                onClick={(e) => e.stopPropagation()}
              >
                <div ref={datePickerContentRef} className="p-4">
                  {/* Body depending on viewMode with synchronized transitions */}
                  {viewMode === "months" ? (
                    <div key="months" className="animate-view-enter space-y-2">
                      <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-200/50">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chọn tháng</span>
                        <button
                          type="button"
                          onClick={() => setViewMode("days")}
                          className="text-xs font-semibold text-[#D72134] hover:underline cursor-pointer flex items-center gap-1 py-0.5 px-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Quay lại
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5 py-1.5 h-[240px] content-center">
                        {Array.from({ length: 12 }, (_, i) => {
                          const isCurrentMonth = viewMonth === i;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setViewMonth(i);
                                setViewMode("days");
                              }}
                              className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${isCurrentMonth
                                  ? "bg-[#D72134] text-white font-bold shadow-md shadow-red-600/30 scale-105"
                                  : "text-slate-700 hover:text-[#D72134] hover:bg-red-50 active:scale-95"
                                }`}
                            >
                              Tháng {i + 1}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : viewMode === "years" ? (
                    <div key="years" className="animate-view-enter space-y-2">
                      <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-200/50">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chọn năm</span>
                        <button
                          type="button"
                          onClick={() => setViewMode("days")}
                          className="text-xs font-semibold text-[#D72134] hover:underline cursor-pointer flex items-center gap-1 py-0.5 px-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Quay lại
                        </button>
                      </div>

                      {/* Scrollable list of years with centered auto-scroll and sleek scrollbar */}
                      <div ref={yearListRef} className="grid grid-cols-4 gap-1.5 h-[240px] max-h-[245px] overflow-y-auto pr-1.5 custom-scrollbar">
                        {Array.from({ length: 77 }, (_, i) => 2026 - i).map((y) => {
                          const isCurrentYear = viewYear === y;
                          return (
                            <button
                              key={y}
                              ref={isCurrentYear ? selectedYearRef : undefined}
                              type="button"
                              onClick={() => {
                                setViewYear(y);
                                setViewMode("days");
                              }}
                              className={`py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${isCurrentYear
                                  ? "bg-[#D72134] text-white font-bold shadow-md shadow-red-600/30 scale-105"
                                  : "text-slate-700 hover:text-[#D72134] hover:bg-red-50 active:scale-95"
                                }`}
                            >
                              {y}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div key="days" className="animate-view-enter">
                      {/* Header */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/50">
                        <button
                          type="button"
                          onClick={() => {
                            if (viewMonth === 0) {
                              setViewMonth(11);
                              setViewYear((y) => y - 1);
                            } else {
                              setViewMonth((m) => m - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-[#D72134] hover:bg-red-50 transition-colors cursor-pointer active:scale-95"
                          title="Tháng trước"
                        >
                          <ChevronLeft size={18} strokeWidth={2.5} />
                        </button>

                        <div className="flex items-center justify-center gap-1.5 flex-1">
                          <button
                            type="button"
                            onClick={() => setViewMode("months")}
                            className="w-[96px] h-8 rounded-lg text-sm font-bold transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer active:scale-95 text-slate-800 hover:text-[#D72134] hover:bg-red-50 tabular-nums shrink-0"
                          >
                            <span>Tháng {viewMonth + 1}</span>
                            <ChevronDown size={14} strokeWidth={2.5} className="shrink-0 text-slate-400" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setViewMode("years")}
                            className="w-[74px] h-8 rounded-lg text-sm font-bold transition-all duration-150 flex items-center justify-center gap-1 cursor-pointer active:scale-95 text-slate-800 hover:text-[#D72134] hover:bg-red-50 tabular-nums shrink-0"
                          >
                            <span>{viewYear}</span>
                            <ChevronDown size={14} strokeWidth={2.5} className="shrink-0 text-slate-400" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (viewMonth === 11) {
                              setViewMonth(0);
                              setViewYear((y) => y + 1);
                            } else {
                              setViewMonth((m) => m + 1);
                            }
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-[#D72134] hover:bg-red-50 transition-colors cursor-pointer active:scale-95"
                          title="Tháng sau"
                        >
                          <ChevronRight size={18} strokeWidth={2.5} />
                        </button>
                      </div>

                      {/* Days of week header */}
                      <div className="grid grid-cols-7 gap-1 text-center mb-1">
                        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((dayName, idx) => (
                          <div
                            key={dayName}
                            className={`text-[11px] font-semibold py-1 ${idx >= 5 ? "text-red-400 font-bold" : "text-slate-400"}`}
                          >
                            {dayName}
                          </div>
                        ))}
                      </div>

                      {/* Days grid */}
                      <div className="grid grid-cols-7 gap-1">
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
                          const remaining = 42 - cells.length;
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
                                  setTimeout(() => {
                                    setDatePickerOpen(false);
                                    setFocus(false);
                                  }, 130);
                                }}
                                data-ripple="rgba(215, 33, 52, 0.22)"
                                className={`w-9 h-9 rounded-xl text-[13px] flex items-center justify-center transition-all duration-150 cursor-pointer relative overflow-hidden ${isSelected
                                    ? "bg-[#D72134] text-white font-bold shadow-md shadow-red-600/30 scale-105"
                                    : isToday
                                      ? "border border-[#D72134] text-[#D72134] font-semibold hover:bg-red-100/70"
                                      : cell.isCurrent
                                        ? "text-slate-800 hover:bg-red-50 hover:text-[#D72134] font-medium active:scale-95"
                                        : "text-slate-300 hover:bg-slate-100 hover:text-slate-500"
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
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors duration-150 cursor-pointer active:scale-95"
                    >
                      Hủy
                    </button>

                    <div className="flex items-center gap-2">
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
                        }}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-[#D72134] transition-colors cursor-pointer"
                      >
                        Hôm nay
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDatePickerOpen(false);
                          setFocus(false);
                        }}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#D72134] hover:bg-[#b81728] shadow-sm shadow-red-600/25 transition-all duration-150 cursor-pointer active:scale-95"
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
              className="lbi-field appearance-none cursor-pointer flex items-center justify-between text-left select-none outline-none focus:outline-none transition-colors"
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
                <span className="truncate text-[17px] font-medium text-slate-800">
                  {selectedOption?.label || ""}
                </span>
              </div>
            </button>

            {/* Sleek Chevron Arrow (No background box) */}
            <div
              className={`absolute right-5 top-1/2 -translate-y-1/2 transition-[transform,color] duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${dropdownOpen
                  ? "text-[#D72134] rotate-180 scale-110"
                  : "text-slate-400 group-hover:text-slate-600 rotate-0 scale-100"
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
                  top: `${popoverCoords.top}px`,
                  left: `${popoverCoords.left}px`,
                  width: `${popoverCoords.width}px`,
                  transformOrigin: popoverCoords.transformOrigin,
                  zIndex: 99999,
                }}
                className={`bg-white/98 backdrop-blur-2xl rounded-2xl border-0 border-none shadow-[0_24px_50px_-12px_rgba(15,23,42,0.18),0_10px_24px_-4px_rgba(15,23,42,0.08)] p-2 select-none lbi-popover-shell ${dropdownOpen
                    ? "lbi-popover-open"
                    : "lbi-popover-closed"
                  }`}
                role="listbox"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1.5 custom-scrollbar">
                  {options!.map((opt) => {
                    const isSelected = String(opt.value) === String(value);
                    return (
                      <div
                        key={opt.value}
                        role="option"
                        data-ripple="rgba(215, 33, 52, 0.16)"
                        aria-selected={isSelected}
                        onClick={() => {
                          if (!isControlled) setUncontrolledValue(opt.value);
                          if (onChange) {
                            onChange({
                              target: { value: opt.value, name: name || id },
                            } as any);
                          }
                          setTimeout(() => {
                            setDropdownOpen(false);
                            setFocus(false);
                          }, 130);
                        }}
                        className={`group/item relative overflow-hidden flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ease-out select-none border-0 border-none ${isSelected
                            ? "bg-gradient-to-r from-red-50 to-rose-50/80 text-[#D72134] shadow-2xs font-semibold"
                            : "bg-transparent hover:bg-red-50/75 hover:translate-x-1 active:scale-[0.98]"
                          }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          {/* Checkmark or soft bullet indicator */}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ${isSelected
                                ? "bg-[#D72134] text-white shadow-xs"
                                : "bg-slate-100 text-slate-400 group-hover/item:bg-red-100 group-hover/item:text-[#D72134]"
                              }`}
                          >
                            {isSelected ? (
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/item:bg-[#D72134] transition-colors" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div
                              className={`text-[16px] font-semibold leading-normal truncate transition-colors ${isSelected ? "text-[#D72134]" : "text-slate-800 group-hover/item:text-[#D72134]"
                                }`}
                            >
                              {opt.label}
                            </div>
                          </div>
                        </div>
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
            data-flip={flip % 2}
            type={secret && !show ? "password" : secret ? "text" : type || "text"}
            value={value}
            required={required}
            disabled={disabled}
            placeholder={up ? placeholder : ""}
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
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#D72134]" strokeWidth={2.4} aria-hidden="true" />
            <span>{error || lastError || ""}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabelInput;
