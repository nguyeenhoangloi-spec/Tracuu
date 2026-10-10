'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, X } from 'lucide-react';
import SecurityCaptcha from '@/components/SecurityCaptcha';

interface SecurityCaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (token: string) => void;
  title?: string;
  subtitle?: string;
  resetTrigger?: number;
}

export default function SecurityCaptchaModal({
  isOpen,
  onClose,
  onVerified,
  title = 'Xác thực bảo mật',
  subtitle = 'Vui lòng xác minh bạn không phải là robot để tiếp tục tra cứu.',
  resetTrigger,
}: SecurityCaptchaModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const [shouldRender, setShouldRender] = React.useState(isOpen);
  const [isClosing, setIsClosing] = React.useState(false);
  const [captchaInput, setCaptchaInput] = React.useState('');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      setCaptchaInput('');
    } else if (shouldRender && !isClosing) {
      // Khi component nhận lệnh đóng từ bên ngoài: kích hoạt exit animation hiện có của hệ thống
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = React.useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setShouldRender(false);
    }, 280);
  }, [isClosing, onClose]);

  // Đóng modal khi bấm phím Escape
  React.useEffect(() => {
    if (!shouldRender || isClosing) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender, isClosing, handleClose]);

  const handleCaptchaChange = (token: string) => {
    setCaptchaInput(token);
    if (token && token.trim()) {
      // Đã xác thực thành công: giữ 320ms để thấy tick xanh Google, sau đó đóng mượt mà bằng hiệu ứng có sẵn
      setTimeout(() => {
        onVerified(token);
        handleClose();
      }, 320);
    }
  };

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <div
      id="security-captcha-overlay"
      className="fixed inset-0 z-[99999] flex flex-col justify-end sm:justify-center items-center p-0 sm:p-5 md:p-6 overflow-hidden select-none pointer-events-auto"
    >
      {/* LỚP BACKDROP BẤM RA NGOÀI ĐỂ ĐÓNG - ĐỒNG BỘ CHUẨN APPLE DỊU NHẸ, KHÔNG TẠO KHUNG ĐEN TƯƠNG PHẢN */}
      <div
        className={`absolute inset-0 bg-slate-950/25 backdrop-blur-[3.5px] cursor-pointer select-none no-print outline-none border-0 ring-0 ${
          isClosing ? 'animate-omninotch-backdrop-exit' : 'animate-omninotch-backdrop-enter'
        }`}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        aria-label="Bấm ra ngoài để đóng"
      />

      {/* CỬA SỔ POPUP XÁC THỰC RECAPTCHA:
          ĐỒNG BỘ 100% HIỆU ỨNG HIỆN CÓ CỦA DỰ ÁN
          - Trên Mobile: mobile-drawer-enter / mobile-drawer-exit (Trượt đáy Apple Sheet)
          - Trên Web/Desktop: sm:animate-omninotch-enter / sm:animate-omninotch-exit (Bung mở OmniNotch) */}
      <div
        className={`w-full flex justify-center mt-auto sm:my-auto relative z-10 pointer-events-none ${isClosing
            ? 'mobile-drawer-exit sm:animate-omninotch-exit'
            : 'mobile-drawer-enter sm:animate-omninotch-enter'
          }`}
        style={{
          transformOrigin: 'top center',
        }}
      >
        <div
          className="relative w-full max-w-[400px] bg-white rounded-t-[36px] rounded-b-none sm:rounded-[38px] sm:rounded-b-[38px] p-6 sm:p-7 pt-7 sm:pt-8 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:pb-7 shadow-[0_24px_65px_-15px_rgba(15,23,42,0.22),0_10px_26px_-4px_rgba(15,23,42,0.08)] border-0 border-none outline-none focus:outline-none ring-0 flex flex-col items-center text-center z-10 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút đóng góc phải: Chuẩn nút tròn xám có gợn sóng loang màu Ripple đồng bộ hệ thống */}
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute right-4 top-4 sm:right-5 sm:top-5 overflow-hidden w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] active:bg-[#DFDFE4] text-[#1D1D1F] transition-all duration-150 cursor-pointer active:scale-90 no-print outline-none border-0 border-none select-none [-webkit-tap-highlight-color:transparent]"
            title="Đóng (Esc)"
            aria-label="Đóng xác thực"
          >
            <X className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#1D1D1F] pointer-events-none" strokeWidth={2.3} />
          </button>

          {/* Icon khiên bảo mật: Nền xanh Navy đậm chuyên nghiệp, đổ bóng chiều sâu chuẩn Apple / Doanh nghiệp */}
          <div className="relative mb-4 mt-1">
            {/* Quầng sáng nhẹ phía sau */}
            <div className="absolute -inset-1.5 bg-blue-600/20 rounded-[26px] blur-md pointer-events-none" />

            {/* Khối icon Squircle to rõ, bề thế chuyên nghiệp */}
            <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-[22px] sm:rounded-[24px] bg-gradient-to-br from-[#0A1E4A] via-[#142B6F] to-[#1E40AF] text-white flex items-center justify-center shadow-[0_12px_28px_-6px_rgba(20,43,111,0.48),0_4px_10px_-2px_rgba(20,43,111,0.2)] border border-white/15">
              {/* Lớp bóng gương phía trên */}
              <div className="absolute inset-0 rounded-[22px] sm:rounded-[24px] bg-gradient-to-b from-white/30 via-white/5 to-transparent pointer-events-none" />
              <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2] text-white drop-shadow-sm" />
            </div>
          </div>

          {/* Tiêu đề & phụ đề: To rõ, sắc nét chuẩn Lựa chọn 1 (Ngắn gọn, hiện đại) */}
          <h3 className="text-[20px] sm:text-[22px] font-bold text-[#1D1D1F] tracking-tight leading-snug">
            {title}
          </h3>
          <p className="text-[13.5px] sm:text-[14px] text-[#6E6E73] font-normal mt-1.5 mb-5 leading-relaxed max-w-[320px]">
            {subtitle}
          </p>

          {/* reCAPTCHA v2 Widget: Cân đối, sạch đẹp */}
          <div className="w-full flex justify-center py-0.5">
            <SecurityCaptcha
              id="modal-recaptcha"
              captchaInput={captchaInput}
              onCaptchaInputChange={handleCaptchaChange}
              resetTrigger={resetTrigger}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
