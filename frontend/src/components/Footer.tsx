import React from 'react';
import { Home, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      id="lien-he"
      className="bg-white text-slate-600 pt-8 sm:pt-10 pb-4 sm:pb-5 no-print mt-auto relative overflow-hidden select-none"
      style={{ backgroundColor: '#ffffff' }}
    >
      {/* NỘI DUNG CHÂN TRANG: BỐ CỤC 3 CỘT TRUYỀN THỐNG CHÍNH THỨC TRÊN NỀN TRẮNG TINH KHIẾT */}
      <div className="max-w-[1430px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Bố cục 3 Cột phẳng */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pb-5 sm:pb-6">
          {/* CỘT 1: Trung tâm chuẩn đầu ra */}
          <div className="space-y-3.5">
            <div className="min-h-0 md:min-h-[56px] lg:min-h-[62px] flex flex-col justify-start">
              <h3 className="text-[22px] font-medium text-slate-900 leading-snug">
                Trung tâm chuẩn đầu ra và Phát triển nguồn nhân lực
              </h3>
            </div>

            <ul className="space-y-2.5 text-[18px]">
              <li className="min-h-[28px] flex items-center gap-3">
                <span className="w-5 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <Home className="w-[18px] h-[18px]" />
                </span>
                <span className="text-slate-600">Khu C, phòng C2-14</span>
              </li>

              <li className="min-h-[28px] flex items-center gap-3">
                <span className="w-5 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <Phone className="w-[18px] h-[18px]" />
                </span>
                <a
                  href="tel:02923798798"
                  className="text-slate-600 hover:text-[#D72134] hover:underline transition-colors"
                >
                  02923 798 798
                </a>
              </li>

              <li className="min-h-[28px] flex items-center gap-3">
                <span className="w-5 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <Mail className="w-[18px] h-[18px]" />
                </span>
                <a
                  href="mailto:ttchuandaura@nctu.edu.vn"
                  className="text-slate-600 hover:text-[#D72134] hover:underline transition-colors truncate"
                >
                  ttchuandaura@nctu.edu.vn
                </a>
              </li>

              <li className="min-h-[28px] flex items-center gap-3">
                <span className="w-5 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <MessageCircle className="w-[18px] h-[18px]" />
                </span>
                <a
                  href="https://zalo.me/0848991914"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 hover:text-[#D72134] hover:underline transition-colors"
                >
                  Zalo: Trung tâm Chuẩn đầu ra
                </a>
              </li>
            </ul>
          </div>

          {/* CỘT 2: Phòng Quản lý đào tạo */}
          <div className="space-y-3.5">
            <div className="min-h-0 md:min-h-[56px] lg:min-h-[62px] flex flex-col justify-start">
              <h3 className="text-[22px] font-medium text-slate-900 leading-snug">
                Phòng Quản lý đào tạo
              </h3>
            </div>

            <ul className="space-y-2.5 text-[18px]">
              <li className="min-h-[28px] flex items-center gap-3">
                <span className="w-5 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <Home className="w-[18px] h-[18px]" />
                </span>
                <span className="text-slate-600">Khu C, phòng C2-11</span>
              </li>

              <li className="min-h-[28px] flex items-center gap-3">
                <span className="w-5 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <Phone className="w-[18px] h-[18px]" />
                </span>
                <a
                  href="tel:02923798999"
                  className="text-slate-600 hover:text-[#D72134] hover:underline transition-colors"
                >
                  02923 798 999
                </a>
              </li>

              <li className="min-h-[28px] flex items-center gap-3">
                <span className="w-5 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <Mail className="w-[18px] h-[18px]" />
                </span>
                <a
                  href="mailto:phongdaotao@nctu.edu.vn"
                  className="text-slate-600 hover:text-[#D72134] hover:underline transition-colors truncate"
                >
                  phongdaotao@nctu.edu.vn
                </a>
              </li>

              <li className="min-h-[28px] flex items-center gap-3">
                <span className="w-5 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <MessageCircle className="w-[18px] h-[18px]" />
                </span>
                <a
                  href="https://zalo.me/2022657121671332850"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 hover:text-[#D72134] hover:underline transition-colors"
                >
                  Zalo: Phòng Quản lý đào tạo
                </a>
              </li>
            </ul>
          </div>

          {/* CỘT 3: Trung tâm Phát triển & Ứng dụng phần mềm */}
          <div className="space-y-3.5">
            <div className="min-h-0 md:min-h-[56px] lg:min-h-[62px] flex flex-col justify-start">
              <h3 className="text-[22px] font-medium text-slate-900 leading-snug">
                Trung tâm Phát triển &amp; Ứng dụng phần mềm
              </h3>
            </div>

            <ul className="space-y-2.5 text-[18px]">
              <li className="min-h-[28px] flex items-center gap-3">
                <span className="w-5 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <Home className="w-[18px] h-[18px]" />
                </span>
                <span className="text-slate-600">Khu I, phòng I1-04</span>
              </li>

              <li className="min-h-[28px] flex items-center gap-3">
                <span className="w-5 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <Phone className="w-[18px] h-[18px]" />
                </span>
                <a
                  href="tel:02923851136"
                  className="text-slate-600 hover:text-[#D72134] hover:underline transition-colors"
                >
                  02923 851 136
                </a>
              </li>

              <li className="min-h-[28px] flex items-center gap-3">
                <span className="w-5 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <Mail className="w-[18px] h-[18px]" />
                </span>
                <a
                  href="mailto:ttphanmem@nctu.edu.vn"
                  className="text-slate-600 hover:text-[#D72134] hover:underline transition-colors truncate"
                >
                  ttphanmem@nctu.edu.vn
                </a>
              </li>

              <li className="min-h-[28px] flex items-center gap-3">
                <span className="w-5 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <MessageCircle className="w-[18px] h-[18px]" />
                </span>
                <a
                  href="https://zalo.me/0342912168"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-600 hover:text-[#D72134] hover:underline transition-colors"
                >
                  Zalo: Trung tâm Phần mềm
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Địa chỉ — trên đường gạch */}
        <div className="pt-4 pb-4 text-center">
          <div className="inline-flex items-center justify-center gap-2 text-[16px] text-slate-600 font-normal">
            <MapPin className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-slate-400 flex-shrink-0" />
            <span>Số 168, Đường Nguyễn Văn Cừ (nối dài), P. An Bình, Q. Ninh Kiều, TP. Cần Thơ</span>
          </div>
        </div>

        {/* Bản quyền — dưới đường gạch */}
        <div className="pt-3 pb-1 text-center border-t border-slate-200/80">
          <p className="text-[13px] sm:text-[14px] text-slate-600 font-normal">
            Bản quyền © {new Date().getFullYear()} Trường Đại học Nam Cần Thơ. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
