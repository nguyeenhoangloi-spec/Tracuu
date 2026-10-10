'use client';

import React from 'react';
import { X } from 'lucide-react';

interface NotFoundResultCardProps {
  type: 'vanbang' | 'cntt' | 'vstep';
  data: {
    message?: string;
  };
  onClose: () => void;
  onReset?: () => void;
}

export default function NotFoundResultCard({
  type,
  data,
  onClose,
  onReset,
}: NotFoundResultCardProps) {
  const displayMsg = 'Không tìm thấy hồ sơ phù hợp. Vui lòng kiểm tra lại thông tin đã nhập.';

  const handleClose = () => {
    if (onReset) onReset();
    else onClose();
  };

  return (
    <div className="font-google-sans text-[#1D1D1F] w-full max-w-[540px] mx-auto flex flex-col justify-end sm:justify-center my-auto">
      {/* THẺ THÔNG BÁO KHÔNG TÌM THẤY KẾT QUẢ - BOTTOM SHEET TRÊN MOBILE, POPUP BO TRÒN 38PX ĐỒNG BỘ TRÊN DESKTOP */}
      <div className="bg-white rounded-t-[36px] rounded-b-none sm:rounded-[38px] sm:rounded-b-[38px] shadow-[0_24px_70px_-15px_rgba(15,23,42,0.28),0_10px_28px_-4px_rgba(15,23,42,0.12)] overflow-hidden border-0 relative px-4 min-[390px]:px-6 sm:px-8 pt-3 sm:pt-7 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] sm:py-12 text-center w-full">
        {/* Thanh gạt tay kéo vuốt trên Mobile (Đồng bộ 100% nhận diện với Form Sheet và Result Card) */}
        <div
          onClick={handleClose}
          className="pt-1 pb-3 flex justify-center shrink-0 cursor-pointer sm:hidden group select-none"
          title="Chạm hoặc vuốt để đóng"
        >
          <div className="w-10 h-1.2 rounded-full bg-slate-300 group-hover:bg-slate-400 active:bg-slate-500 transition-colors" />
        </div>
        {/* Nút đóng góc phải: Nền tròn xám #F5F5F7 chuẩn Apple UI, thanh lịch và êm mắt trên nền trắng */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 overflow-hidden w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] active:bg-[#DFDFE4] text-[#1D1D1F] transition-all duration-150 cursor-pointer active:scale-90 no-print outline-none border-0 border-none select-none [-webkit-tap-highlight-color:transparent]"
          title="Đóng (Esc)"
          aria-label="Đóng thông báo"
        >
          <X className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#1D1D1F] pointer-events-none" strokeWidth={2.3} />
        </button>

        {/* HÌNH MINH HỌA: HAI VĂN BẰNG CÙNG KÍNH LÚP VÀ DẤU X ĐỎ */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <img
            src="/images/illustrations/search-not-found.png"
            alt="Không tìm thấy kết quả tra cứu"
            className="w-28 sm:w-40 h-auto object-contain select-none pointer-events-none"
          />
        </div>

        {/* TIÊU ĐỀ CHÍNH - CHUẨN 28PX THEO YÊU CẦU NGƯỜI DÙNG, ĐẸP MẮT TRÊN 1 DÒNG */}
        <h2 className="text-[20px] min-[380px]:text-[22px] sm:text-[28px] font-semibold text-[#1D1D1F] leading-snug sm:leading-tight tracking-tight mb-2 sm:mb-3 sm:whitespace-nowrap text-balance">
          Không tìm thấy kết quả tra cứu
        </h2>

        {/* NỘI DUNG SÚC TÍCH - VỪA ĐỦ, GỌN GÀNG, MÀU CHỮ #1D1D1F RÕ NÉT */}
        <p className="text-[14.5px] sm:text-[16px] text-[#1D1D1F] font-normal leading-relaxed max-w-md mx-auto mb-2 sm:mb-7">
          {displayMsg}
        </p>

        {/* NÚT HÀNH ĐỘNG CHÍNH: "ĐÃ HIỂU" - HIỆN ĐẠI, GỌN GÀNG CHUẨN APPLE / GOOGLE */}
        <div className="flex justify-center no-print mt-3 sm:mt-0">
          <button
            type="button"
            data-ripple="rgba(255, 255, 255, 0.3)"
            onClick={handleClose}
            className="w-full sm:w-auto min-w-[160px] px-8 py-3 rounded-full bg-[#D72134] hover:bg-[#b71526] text-white text-[16px] font-semibold transition-all duration-200 shadow-[0_4px_14px_-2px_rgba(215,33,52,0.35)] hover:shadow-[0_6px_20px_-3px_rgba(215,33,52,0.45)] active:scale-95 cursor-pointer select-none outline-none border-0"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
