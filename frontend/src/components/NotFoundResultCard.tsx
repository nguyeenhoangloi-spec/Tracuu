'use client';

import React from 'react';
import { X, RotateCcw } from 'lucide-react';

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
      {/* THẺ THÔNG BÁO KHÔNG TÌM THẤY KẾT QUẢ - DRAWER TRÊN MOBILE, POPUP TRÊN DESKTOP */}
      <div className="bg-white rounded-t-[36px] rounded-b-none sm:rounded-[36px] shadow-[0_24px_70px_-15px_rgba(15,23,42,0.22),0_10px_28px_-4px_rgba(15,23,42,0.08)] overflow-hidden border-0 relative px-4 min-[390px]:px-6 sm:px-10 pt-4 pb-6 sm:py-12 text-center w-full">
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
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-12 h-12 flex items-center justify-center rounded-full bg-slate-200/60 hover:bg-slate-300/80 active:bg-slate-300 text-slate-700 hover:text-slate-900 transition-all duration-150 cursor-pointer active:scale-90 no-print outline-none border-0 border-none backdrop-blur-xs"
          title="Đóng (Esc)"
        >
          <X className="w-6 h-6 text-slate-700" strokeWidth={2.5} />
        </button>

        {/* HÌNH MINH HỌA: HAI VĂN BẰNG CÙNG KÍNH LÚP VÀ DẤU X ĐỎ */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <img
            src="/not-found-illustration.png"
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

        {/* NÚT QUAY LẠI TRA CỨU: DẠNG VIỀN NÉT THANH THOÁT, ĐỒNG BỘ NÚT PHỤ THẺ KẾT QUẢ */}
        <div className="hidden sm:flex justify-center no-print">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 sm:px-7 py-3 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/90 text-slate-700 hover:text-slate-900 text-[16px] font-semibold transition-all duration-150 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] hover:shadow-[0_4px_12px_-2px_rgba(15,23,42,0.08)] active:scale-95 cursor-pointer select-none"
          >
            <RotateCcw className="w-4.5 h-4.5 stroke-[2.2] text-slate-500" />
            <span>Quay lại tra cứu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
