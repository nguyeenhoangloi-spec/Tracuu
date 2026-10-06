import React from 'react';
import { Home, Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      id="lien-he"
      className="bg-[#F8FAFC] border-none text-slate-600 pt-6 pb-3.5 sm:pb-4 no-print mt-auto relative overflow-hidden select-none"
    >
      {/* 1. HOA VĂN BẢO MẬT VĂN BẰNG CHÌM (GUILLOCHE ROSETTE SECURITY WATERMARK THEO MẪU THỰC TẾ) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.055] overflow-hidden"
        aria-hidden="true"
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="footer-guilloche-rosette"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              {/* Vòng tròn chấm bi vàng kim bảo mật (theo ảnh mẫu) */}
              <circle
                cx="50"
                cy="50"
                r="18"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="0.8"
                strokeDasharray="2.5 2.5"
              />

              {/* Vòng tròn cánh hoa đan xen màu xanh Navy đại học */}
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="#25359D"
                strokeWidth="0.6"
              />

              {/* Cánh hoa dọc đối xứng */}
              <path
                d="M 50 10 C 34 30 34 70 50 90 C 66 70 66 30 50 10 Z"
                fill="none"
                stroke="#25359D"
                strokeWidth="0.7"
              />

              {/* Cánh hoa ngang đối xứng */}
              <path
                d="M 10 50 C 30 34 70 34 90 50 C 70 66 30 66 10 50 Z"
                fill="none"
                stroke="#25359D"
                strokeWidth="0.7"
              />

              {/* Đường uốn lượn liên hoàn kết nối các mắt lưới liền mạch như trên phôi văn bằng */}
              <path
                d="M 0 50 Q 25 10 50 10 Q 75 10 100 50 Q 75 90 50 90 Q 25 90 0 50"
                fill="none"
                stroke="#25359D"
                strokeWidth="0.65"
              />
              <path
                d="M 50 0 Q 10 25 10 50 Q 10 75 50 100 Q 90 75 90 50 Q 90 25 50 0"
                fill="none"
                stroke="#25359D"
                strokeWidth="0.65"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-guilloche-rosette)" />
        </svg>
      </div>

      {/* 2. DẤU ẤN VĂN BẰNG & NÓN CỬ NHÂN TỐT NGHIỆP CHÌM (DIPLOMA & GRADUATION CAP WATERMARK SEAL) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[420px] h-[340px] sm:h-[420px] pointer-events-none opacity-[0.038] text-[#25359D]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 300 300" className="w-full h-full fill-none stroke-current">
          {/* Các vòng tròn bảo mật đồng tâm */}
          <circle cx="150" cy="150" r="142" strokeWidth="1.2" />
          <circle cx="150" cy="150" r="134" strokeWidth="0.8" strokeDasharray="4 3" />
          <circle cx="150" cy="150" r="120" strokeWidth="0.6" />
          <circle cx="150" cy="150" r="95" strokeWidth="0.8" />

          {/* Vòng nhành nguyệt quế vinh danh tốt nghiệp */}
          <path
            d="M 75 150 C 75 198 108 232 150 232 C 192 232 225 198 225 150"
            strokeWidth="1.2"
          />

          {/* Biểu tượng Nón Cử nhân (Graduation Mortarboard Cap) */}
          <polygon
            points="150,88 210,114 150,140 90,114"
            strokeWidth="1.6"
          />
          <path
            d="M 118 128 L 118 150 C 118 164 182 164 182 150 L 182 128"
            strokeWidth="1.6"
          />
          {/* Dây tua nón tốt nghiệp */}
          <path
            d="M 150 114 Q 172 120 180 134 L 180 166"
            strokeWidth="1.3"
          />
          <circle cx="180" cy="170" r="3" fill="currentColor" stroke="none" />

          {/* Cuộn Văn bằng Tốt nghiệp (Diploma Scroll) */}
          <rect x="114" y="178" width="72" height="15" rx="3" strokeWidth="1.2" />
          <path d="M 150 174 L 150 196" strokeWidth="1.2" />
          <path d="M 146 196 L 154 196" strokeWidth="1.2" />

          {/* Ngôi sao chứng thực đỉnh và đáy */}
          <polygon
            points="150,44 153,52 161,52 155,57 157,65 150,60 143,65 145,57 139,52 147,52"
            fill="currentColor"
            stroke="none"
          />
          <polygon
            points="150,238 153,246 161,246 155,251 157,259 150,254 143,259 145,251 139,246 147,246"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      </div>

      {/* 3. NỘI DUNG CHÂN TRANG NỔI BẬT RÕ NÉT TRÊN MẶT NỀN HOA VĂN CHÌM */}
      <div className="max-w-[1430px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Dòng thông tin cơ quan chính thức */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 sm:pb-6 border-b border-slate-200/90 gap-4">
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://nctu.edu.vn/images/png/logo_truong_3.png"
              alt="Trường Đại học Nam Cần Thơ"
              className="h-16 sm:h-[76px] lg:h-[84px] w-auto object-contain flex-shrink-0"
            />
          </div>

          <div className="text-[16px] sm:text-[17.5px] lg:text-[18px] text-slate-800 md:text-right flex items-center md:justify-end gap-2.5 font-semibold">
            <MapPin className="w-5 h-5 text-[#D72134] flex-shrink-0" />
            <span>
              Số 168, Đường Nguyễn Văn Cừ (nối dài), P. An Bình, Q. Ninh Kiều, TP. Cần Thơ
            </span>
          </div>
        </div>

        {/* Bố cục 3 Cột phẳng, căn chuẩn độ cao tiêu đề & hàng thông tin cố định */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 py-5 sm:py-6 border-b border-slate-200/90">
          {/* CỘT 1: Trung tâm chuẩn đầu ra */}
          <div className="space-y-3.5">
            <div className="min-h-0 md:min-h-[56px] lg:min-h-[62px] flex flex-col justify-start">
              <h3 className="text-[20px] sm:text-[22px] font-bold text-slate-900 leading-snug">
                Trung tâm chuẩn đầu ra và Phát triển nguồn nhân lực
              </h3>
            </div>

            <ul className="space-y-2.5 text-[16px] sm:text-[17px]">
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
                  className="font-semibold text-slate-800 hover:text-[#25359D] transition-colors"
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
                  className="text-slate-600 hover:text-[#25359D] hover:underline transition-colors truncate"
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
                  className="text-slate-600 hover:text-[#25359D] hover:underline transition-colors"
                >
                  Zalo: Trung tâm Chuẩn đầu ra
                </a>
              </li>
            </ul>
          </div>

          {/* CỘT 2: Phòng Quản lý đào tạo */}
          <div className="space-y-3.5">
            <div className="min-h-0 md:min-h-[56px] lg:min-h-[62px] flex flex-col justify-start">
              <h3 className="text-[20px] sm:text-[22px] font-bold text-slate-900 leading-snug">
                Phòng Quản lý đào tạo
              </h3>
            </div>

            <ul className="space-y-2.5 text-[16px] sm:text-[17px]">
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
                  className="font-semibold text-slate-800 hover:text-[#25359D] transition-colors"
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
                  className="text-slate-600 hover:text-[#25359D] hover:underline transition-colors truncate"
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
                  className="text-slate-600 hover:text-[#25359D] hover:underline transition-colors"
                >
                  Zalo: Phòng Quản lý đào tạo
                </a>
              </li>
            </ul>
          </div>

          {/* CỘT 3: Trung tâm Phát triển & Ứng dụng phần mềm */}
          <div className="space-y-3.5">
            <div className="min-h-0 md:min-h-[56px] lg:min-h-[62px] flex flex-col justify-start">
              <h3 className="text-[20px] sm:text-[22px] font-bold text-slate-900 leading-snug">
                Trung tâm Phát triển &amp; Ứng dụng phần mềm
              </h3>
            </div>

            <ul className="space-y-2.5 text-[16px] sm:text-[17px]">
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
                  className="font-semibold text-slate-800 hover:text-[#25359D] transition-colors"
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
                  className="text-slate-600 hover:text-[#25359D] hover:underline transition-colors truncate"
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
                  className="text-slate-600 hover:text-[#25359D] hover:underline transition-colors"
                >
                  Zalo: Trung tâm Phần mềm
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Dòng Bản quyền chính thức căn giữa trang trọng, gọn gàng */}
        <div className="pt-3.5 sm:pt-4 text-center text-[13px] sm:text-[14px] text-slate-500 font-normal">
          <p>
            Bản quyền © {new Date().getFullYear()} Trường Đại học Nam Cần Thơ. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
