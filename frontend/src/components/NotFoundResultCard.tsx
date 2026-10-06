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
    <div className="font-google-sans text-[#0F172A] w-full max-w-lg mx-auto flex flex-col justify-end sm:justify-center my-auto">
      {/* THẺ THÔNG BÁO KHÔNG TÌM THẤY KẾT QUẢ - BOTTOM SHEET TRÊN MOBILE, POPUP BO TRÒN 38PX ĐỒNG BỘ TRÊN DESKTOP */}
      <div className="bg-white rounded-t-[32px] rounded-b-none sm:rounded-[38px] sm:rounded-b-[38px] shadow-[0_24px_70px_-15px_rgba(15,23,42,0.28),0_10px_28px_-4px_rgba(15,23,42,0.12)] overflow-hidden border-0 relative px-4 min-[390px]:px-6 sm:px-10 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] sm:py-12 text-center w-full">
        {/* Thanh gạt Drawer trên mobile: Nhấn hoặc vuốt để đóng */}
        <div
          onClick={handleClose}
          className="w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full mx-auto mb-4 sm:hidden cursor-pointer active:scale-95 transition-all"
          title="Nhấn để đóng"
        />

        {/* Nút đóng góc phải */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-slate-200/60 hover:bg-slate-300/80 active:bg-slate-300 text-slate-700 hover:text-slate-900 transition-all duration-150 cursor-pointer active:scale-90 no-print outline-none border-0 border-none backdrop-blur-xs"
          title="Đóng (Esc)"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" strokeWidth={2.5} />
        </button>

        {/* HÌNH MINH HỌA: HAI VĂN BẰNG CÙNG KÍNH LÚP VÀ DẤU X ĐỎ */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <img
            src="/images/illustrations/search-not-found.png"
            alt="Không tìm thấy kết quả tra cứu"
            className="w-28 sm:w-40 h-auto object-contain select-none pointer-events-none"
          />
        </div>

        {/* TIÊU ĐỀ CHÍNH - ĐỒNG BỘ CHUẨN 28PX VỚI THẺ KẾT QUẢ VĂN BẰNG */}
        <h2 className="text-[18.5px] min-[360px]:text-[19.5px] min-[390px]:text-[21px] sm:text-[28px] font-bold text-[#0F172A] leading-snug tracking-tight mb-2 sm:mb-3">
          Không tìm thấy kết quả tra cứu
        </h2>

        {/* NỘI DUNG SÚC TÍCH - VỪA ĐỦ, GỌN GÀNG */}
        <p className="text-[14.5px] sm:text-[16px] text-slate-600 font-normal leading-relaxed max-w-md mx-auto mb-2 sm:mb-7">
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
