'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  subtitle = 'Vui lòng xác nhận Tôi không phải là người máy để tiếp tục tra cứu.',
  resetTrigger,
}: SecurityCaptchaModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const [captchaInput, setCaptchaInput] = React.useState('');

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      setCaptchaInput('');
    }
  }, [isOpen]);

  const handleCaptchaChange = (token: string) => {
    setCaptchaInput(token);
    if (token && token.trim()) {
      // Đã xác thực thành công: đóng modal sau một nhịp ngắn và trigger submit
      setTimeout(() => {
        onVerified(token);
        onClose();
      }, 350);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
          {/* Lớp nền mờ Apple Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
          />

          {/* Cửa sổ Popup xác thực reCAPTCHA: Bottom Sheet trên Mobile, Popup bo tròn 38px trên Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 36, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[420px] bg-white rounded-t-[32px] rounded-b-none sm:rounded-[38px] sm:rounded-b-[38px] p-5 sm:p-7 pt-3 sm:pt-7 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:pb-7 shadow-[0_28px_70px_-15px_rgba(15,23,42,0.3),0_10px_28px_-4px_rgba(15,23,42,0.1)] border-0 sm:border sm:border-slate-100 flex flex-col items-center text-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Thanh gạt Drawer trên mobile: Nhấn hoặc vuốt để đóng */}
            <div
              onClick={onClose}
              className="sm:hidden w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full mx-auto mb-3 cursor-pointer active:scale-95 transition-all"
              title="Nhấn để đóng"
            />

            {/* Nút đóng góc phải: Chuẩn nút tròn xám có gợn sóng loang màu Ripple đồng bộ hệ thống */}
            <button
              type="button"
              onClick={onClose}
              data-ripple="rgba(215, 33, 52, 0.28)"
              className="absolute right-4 top-3.5 sm:right-5 sm:top-5 overflow-hidden w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-slate-200/60 hover:bg-slate-300/80 active:bg-slate-300 text-slate-700 hover:text-slate-900 transition-all duration-150 cursor-pointer active:scale-90 no-print outline-none border-0 border-none backdrop-blur-xs select-none [-webkit-tap-highlight-color:transparent]"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 pointer-events-none" strokeWidth={2.5} />
            </button>

            {/* Icon khiên bảo mật: Nền xanh Navy đậm chuyên nghiệp, đổ bóng chiều sâu chuẩn Apple / Doanh nghiệp */}
            <div className="relative mb-4 mt-1">
              {/* Quầng sáng nhẹ phía sau */}
              <div className="absolute -inset-1.5 bg-blue-600/20 rounded-[26px] blur-md pointer-events-none" />

              {/* Khối icon Squircle màu đậm chuyên nghiệp */}
              <div className="relative w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-[22px] sm:rounded-[24px] bg-gradient-to-br from-[#0A1E4A] via-[#142B6F] to-[#1E40AF] text-white flex items-center justify-center shadow-[0_12px_28px_-6px_rgba(20,43,111,0.48),0_4px_10px_-2px_rgba(20,43,111,0.2)] border border-white/15">
                {/* Lớp bóng gương phía trên */}
                <div className="absolute inset-0 rounded-[22px] sm:rounded-[24px] bg-gradient-to-b from-white/30 via-white/5 to-transparent pointer-events-none" />
                <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.2] text-white drop-shadow-sm" />
              </div>
            </div>

            {/* Tiêu đề & phụ đề: To rõ, sắc nét chuẩn 20-22px */}
            <h3 className="text-[20px] sm:text-[22px] font-bold text-[#0F172A] tracking-tight leading-snug">
              {title}
            </h3>
            <p className="text-[13.5px] sm:text-[14.5px] text-slate-600 font-normal mt-1.5 mb-5 sm:mb-6 leading-relaxed max-w-[320px]">
              {subtitle}
            </p>

            {/* reCAPTCHA v2 Widget */}
            <div className="w-full flex justify-center py-1">
              <SecurityCaptcha
                id="modal-recaptcha"
                captchaInput={captchaInput}
                onCaptchaInputChange={handleCaptchaChange}
                resetTrigger={resetTrigger}
              />
            </div>

            {/* Chú thích bảo vệ dữ liệu */}
            <span className="text-[12px] sm:text-[12.5px] text-slate-400 mt-4 font-normal">
              Hệ thống bảo vệ chống tự động hóa và spam
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
