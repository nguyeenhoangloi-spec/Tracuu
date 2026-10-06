'use client';

import React, { useState, useEffect, useCallback, useRef, useId } from 'react';
import { RotateCw, AlertCircle } from 'lucide-react';

interface SecurityCaptchaProps {
  id?: string;
  captchaInput: string;
  onCaptchaInputChange: (val: string) => void;
  onCaptchaCodeGenerated?: (code: string) => void;
  captchaError?: string;
  confirmed?: boolean;
  onConfirmedChange?: (checked: boolean) => void;
  showError?: boolean;
  resetTrigger?: number;
}

// Bộ ký tự an toàn, rõ ràng, không gây nhầm lẫn (loại bỏ 0, O, 1, I, l)
const CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

// Bảng màu trang trọng chuẩn học thuật (Đỏ đô thương hiệu NCTU & Xanh Navy)
const ACADEMIC_COLORS = ['#D72134', '#0F172A', '#B91C1C', '#1E3A8A', '#334155'];

export default function SecurityCaptcha({
  id: customId,
  captchaInput,
  onCaptchaInputChange,
  onCaptchaCodeGenerated,
  captchaError,
  resetTrigger,
}: SecurityCaptchaProps) {
  const reactId = useId();
  const inputId = customId || `captcha-input-${reactId.replace(/:/g, '')}`;
  const inputRef = useRef<HTMLInputElement>(null);

  // Khởi tạo mã mặc định để SSR không bao giờ bị trắng trơn
  const [captchaCode, setCaptchaCode] = useState('2KBH');
  const [focus, setFocus] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const [lastCaptchaError, setLastCaptchaError] = useState(captchaError);
  useEffect(() => {
    if (captchaError) {
      setLastCaptchaError(captchaError);
    } else {
      const timer = setTimeout(() => setLastCaptchaError(undefined), 320);
      return () => clearTimeout(timer);
    }
  }, [captchaError]);

  // Sinh mã CAPTCHA ngẫu nhiên 4 ký tự sắc nét, chuẩn học thuật
  const generateCaptcha = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 450);

    let code = '';
    for (let i = 0; i < 4; i++) {
      code += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    setCaptchaCode(code);

    if (onCaptchaCodeGenerated) {
      onCaptchaCodeGenerated(code);
    }
  }, [onCaptchaCodeGenerated]);

  // Sinh mã ngẫu nhiên khi component mount trên client
  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  // Sinh mã mới và xoay nút reload khi có tín hiệu làm mới biểu mẫu
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      generateCaptcha();
    }
  }, [resetTrigger, generateCaptcha]);

  const up = focus || captchaInput.length > 0 || Boolean(captchaError);
  const letters = (captchaCode || '2KBH').split('');

  return (
    <div>
      {/* KHUNG NHẬP MÃ BẢO VỆ DUY NHẤT TRỌN VẸN (1 KHUNG LIỀN MẠCH, TRÊN MOBILE ẨN NÚT RELOAD VÀ ĐẨY MÃ QUA PHẢI ĐỂ MỞ RỘNG KHÔNG GIAN) */}
      <div
        className="lbi"
        data-up={up}
        data-focus={focus}
        data-filled={captchaInput.length > 0}
        data-error={Boolean(captchaError)}
      >
        <div
          className="lbi-box relative flex items-center group cursor-text"
          style={{
            height: 70,
            borderRadius: 22,
            '--lbi-x': '24px',
            '--lbi-half-h': '35px',
            backgroundColor: focus ? '#ffffff' : undefined,
            borderColor: focus ? '#D72134' : undefined,
            boxShadow: focus ? '0 0 0 3.5px rgba(215, 33, 52, 0.18)' : undefined,
          } as React.CSSProperties}
          onClick={() => {
            inputRef.current?.focus();
          }}
        >
          {/* Nhãn nổi Floating Label nhấc lên viền notch mượt mà */}
          <label className="lbi-label" htmlFor={inputId}>
            {Array.from('Mã bảo vệ').map((ch, i) => (
              <span key={i} style={{ '--i': i } as React.CSSProperties}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </label>

          {/* Ô nhập text 4 ký tự: padding-right trên mobile chỉ 100px (vì đã ẩn nút reload), desktop 185px */}
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            maxLength={6}
            value={captchaInput}
            onChange={(e) => onCaptchaInputChange(e.target.value.toUpperCase())}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            placeholder={up ? 'Nhập mã bên phải' : ''}
            className="lbi-field uppercase tracking-widest font-bold text-[17px] text-slate-800 placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400 pl-5 pr-[100px] sm:pr-[185px]"
            autoComplete="off"
            spellCheck={false}
          />

          {/* CỤM HIỂN THỊ MÃ CAPTCHA BÊN PHẢI (ĐẨY QUA PHẢI, TRÊN MOBILE BỎ NÚT XOAY ĐỂ Ô NHẬP RỘNG RÃI) */}
          <div
            className="absolute right-0 top-0 bottom-0 flex items-center pr-2 sm:pr-3 z-20 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Vạch ngăn cách dọc: Hiện trên desktop, ẩn trên mobile để đẩy mã qua mép */}
            <div className="hidden sm:block h-7 w-[1.5px] bg-slate-200 mr-2.5 flex-shrink-0" />

            {/* Vùng chữ số CAPTCHA: Chạm vào chữ số để đổi mã ngay */}
            <div
              onClick={(e) => generateCaptcha(e)}
              title="Chạm để đổi mã bảo vệ khác"
              className="h-10 px-1 sm:px-2 flex items-center justify-center cursor-pointer group/code hover:opacity-85 active:scale-95 transition-all"
            >
              <svg viewBox="0 0 110 38" className="h-[34px] w-[88px] sm:w-[108px]">
                {/* 2 đường chỉ bảo mật thanh lịch chống bot */}
                <line x1="4" y1="16" x2="106" y2="24" stroke="#D72134" strokeWidth="1.2" opacity="0.35" />
                <line x1="6" y1="24" x2="104" y2="16" stroke="#0F172A" strokeWidth="1" opacity="0.25" />

                {/* Ký tự CAPTCHA chữ số học thuật to rõ */}
                {letters.map((char, i) => {
                  const rot = (i % 2 === 0 ? 1 : -1) * (3 + (i * 2));
                  const color = ACADEMIC_COLORS[i % ACADEMIC_COLORS.length];
                  return (
                    <text
                      key={i}
                      x={12 + i * 26}
                      y={26}
                      transform={`rotate(${rot} ${12 + i * 26} 26)`}
                      fill={color}
                      fontSize="24"
                      fontWeight="800"
                      fontFamily="monospace, 'Courier New', sans-serif"
                      style={{ textShadow: '0 1px 1px rgba(0,0,0,0.06)' }}
                    >
                      {char}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Nút xoay reload: ẨN HOÀN TOÀN TRÊN MOBILE, CHỈ HIỂN THỊ TRÊN DESKTOP */}
            <button
              type="button"
              onClick={(e) => generateCaptcha(e)}
              title="Đổi mã bảo vệ khác"
              className="hidden sm:flex w-9 h-9 ml-1 rounded-xl text-slate-400 hover:text-[#D72134] hover:bg-slate-100 active:scale-90 items-center justify-center transition-all cursor-pointer flex-shrink-0 group/reload"
            >
              <RotateCw
                className={`w-4 h-4 transition-transform duration-500 ${isRotating ? 'rotate-180 text-[#D72134]' : 'group-hover/reload:rotate-90'
                  }`}
                strokeWidth={2.3}
              />
            </button>
          </div>
        </div>

        {/* Thông báo lỗi khi nhập sai hoặc để trống với hiệu ứng mở êm mượt */}
        <div className="lbi-error-wrapper" data-show={Boolean(captchaError)} aria-live="polite">
          <div className="lbi-error-inner">
            <div className="lbi-error-msg" role="alert">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#D72134]" strokeWidth={2.4} aria-hidden="true" />
              <span>{captchaError || lastCaptchaError || ''}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
