import React from 'react';
import { Home, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      id="lien-he"
      className="bg-white text-footer-link pt-6 sm:pt-8 pb-3 sm:pb-4 no-print mt-auto relative overflow-hidden select-none border-t border-slate-100"
    >
      {/* NỘI DUNG CHÂN TRANG: BỐ CỤC 3 CỘT GỌN GÀNG, TINH TẾ, CHUẨN KÍCH THƯỚC */}
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Bố cục 3 Cột */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pb-4">
          {/* CỘT 1: Trung tâm chuẩn đầu ra */}
          <div className="space-y-2">
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-footer-title leading-snug">
              Trung tâm chuẩn đầu ra và Phát triển nguồn nhân lực
            </h3>

            <ul className="space-y-1.5 text-[13px]">
              <li className="flex items-center gap-2.5">
                <span className="w-4 flex items-center justify-center flex-shrink-0 text-footer-link">
                  <Home className="w-3.5 h-3.5" />
                </span>
                <span className="text-footer-link">Khu C, phòng C2-14</span>
              </li>

              <li className="flex items-center gap-2.5 group">
                <span className="w-4 flex items-center justify-center flex-shrink-0 text-footer-link group-hover:text-apple-blue transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <a
                  href="tel:02923798798"
                  className="text-footer-link hover:text-apple-blue hover-apple-blue hover:underline transition-colors"
                >
                  02923 798 798
                </a>
              </li>

              <li className="flex items-center gap-2.5 group">
                <span className="w-4 flex items-center justify-center flex-shrink-0 text-footer-link group-hover:text-apple-blue transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <a
                  href="mailto:ttchuandaura@nctu.edu.vn"
                  className="text-footer-link hover:text-apple-blue hover-apple-blue hover:underline transition-colors truncate"
                >
                  ttchuandaura@nctu.edu.vn
                </a>
              </li>

              <li className="flex items-center gap-2.5 group">
                <span className="w-4 flex items-center justify-center flex-shrink-0 text-footer-link group-hover:text-apple-blue transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                </span>
                <a
                  href="https://zalo.me/0848991914"
                  target="_blank"
                  rel="noreferrer"
                  className="text-footer-link hover:text-apple-blue hover-apple-blue hover:underline transition-colors"
                >
                  Zalo: Trung tâm Chuẩn đầu ra
                </a>
              </li>
            </ul>
          </div>

          {/* CỘT 2: Phòng Quản lý đào tạo */}
          <div className="space-y-2">
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-footer-title leading-snug">
              Phòng Quản lý đào tạo
            </h3>

            <ul className="space-y-1.5 text-[13px]">
              <li className="flex items-center gap-2.5">
                <span className="w-4 flex items-center justify-center flex-shrink-0 text-footer-link">
                  <Home className="w-3.5 h-3.5" />
                </span>
                <span className="text-footer-link">Khu C, phòng C2-11</span>
              </li>

              <li className="flex items-center gap-2.5 group">
                <span className="w-4 flex items-center justify-center flex-shrink-0 text-footer-link group-hover:text-apple-blue transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <a
                  href="tel:02923798999"
                  className="text-footer-link hover:text-apple-blue hover-apple-blue hover:underline transition-colors"
                >
                  02923 798 999
                </a>
              </li>

              <li className="flex items-center gap-2.5 group">
                <span className="w-4 flex items-center justify-center flex-shrink-0 text-footer-link group-hover:text-apple-blue transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <a
                  href="mailto:phongdaotao@nctu.edu.vn"
                  className="text-footer-link hover:text-apple-blue hover-apple-blue hover:underline transition-colors truncate"
                >
                  phongdaotao@nctu.edu.vn
                </a>
              </li>

              <li className="flex items-center gap-2.5 group">
                <span className="w-4 flex items-center justify-center flex-shrink-0 text-footer-link group-hover:text-apple-blue transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                </span>
                <a
                  href="https://zalo.me/2022657121671332850"
                  target="_blank"
                  rel="noreferrer"
                  className="text-footer-link hover:text-apple-blue hover-apple-blue hover:underline transition-colors"
                >
                  Zalo: Phòng Quản lý đào tạo
                </a>
              </li>
            </ul>
          </div>

          {/* CỘT 3: Trung tâm Phát triển & Ứng dụng phần mềm */}
          <div className="space-y-2">
            <h3 className="text-[14px] sm:text-[15px] font-semibold text-footer-title leading-snug">
              Trung tâm Phát triển &amp; Ứng dụng phần mềm
            </h3>

            <ul className="space-y-1.5 text-[13px]">
              <li className="flex items-center gap-2.5">
                <span className="w-4 flex items-center justify-center flex-shrink-0 text-footer-link">
                  <Home className="w-3.5 h-3.5" />
                </span>
                <span className="text-footer-link">Khu I, phòng I1-04</span>
              </li>

              <li className="flex items-center gap-2.5 group">
                <span className="w-4 flex items-center justify-center flex-shrink-0 text-footer-link group-hover:text-apple-blue transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <a
                  href="tel:02923851136"
                  className="text-footer-link hover:text-apple-blue hover-apple-blue hover:underline transition-colors"
                >
                  02923 851 136
                </a>
              </li>

              <li className="flex items-center gap-2.5 group">
                <span className="w-4 flex items-center justify-center flex-shrink-0 text-footer-link group-hover:text-apple-blue transition-colors">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <a
                  href="mailto:ttphanmem@nctu.edu.vn"
                  className="text-footer-link hover:text-apple-blue hover-apple-blue hover:underline transition-colors truncate"
                >
                  ttphanmem@nctu.edu.vn
                </a>
              </li>

              <li className="flex items-center gap-2.5 group">
                <span className="w-4 flex items-center justify-center flex-shrink-0 text-footer-link group-hover:text-apple-blue transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                </span>
                <a
                  href="https://zalo.me/0342912168"
                  target="_blank"
                  rel="noreferrer"
                  className="text-footer-link hover:text-apple-blue hover-apple-blue hover:underline transition-colors"
                >
                  Zalo: Trung tâm Phần mềm
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Địa chỉ — trên đường gạch */}
        <div className="pt-3 pb-2.5 text-center">
          <div className="inline-flex items-center justify-center gap-2 text-[12.5px] sm:text-[13px] text-footer-link font-normal">
            <MapPin className="w-3.5 h-3.5 text-footer-link flex-shrink-0" />
            <span>Số 168, Đường Nguyễn Văn Cừ (nối dài), P. An Bình, Q. Ninh Kiều, TP. Cần Thơ</span>
          </div>
        </div>

        {/* Bản quyền — dưới đường gạch */}
        <div className="pt-2.5 pb-1 text-center border-t border-slate-100">
          <p className="text-[12px] text-footer-copyright font-normal">
            Bản quyền © {new Date().getFullYear()} Trường Đại học Nam Cần Thơ. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
