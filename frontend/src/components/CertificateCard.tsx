'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, X, RotateCcw, Maximize2, Minimize2, CheckCircle2 } from 'lucide-react';

interface CertificateCardProps {
  type: 'vanbang' | 'cntt' | 'vstep';
  data: any;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onReset?: () => void;
  onClose?: () => void;
}

// Chuyển đổi định dạng ngày YYYY-MM-DD sang DD/MM/YYYY chuẩn văn bằng Việt Nam
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '--';
  const clean = String(dateStr).trim();
  const match = clean.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (match) {
    const [, y, m, d] = match;
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
  }
  return clean;
};

// Chuẩn hóa kết quả CNTT chuẩn cốt lõi: Chỉ hiển thị "Đạt" (hoặc "Không đạt")
const formatCnttResult = (xepLoai?: string, ketQua?: string) => {
  const val = String(ketQua || xepLoai || '').trim();
  if (/không đạt/i.test(val)) return 'Không đạt';
  return 'Đạt';
};

// Chuẩn hóa tên hội đồng thi: loại bỏ tiền tố 'Hội đồng thi' bị lặp nếu có ở đầu
const cleanHoiDongThi = (str?: string) => {
  if (!str) return '--';
  return str.replace(/^hội\s*đồng\s*thi\s*[-:]?\s*/i, '');
};

// Chuẩn hóa định dạng chữ (không để chữ IN HOA toàn bộ, chuyển về chữ thường chuẩn tiếng Việt với viết hoa chữ cái đầu)
const formatFieldCase = (str?: string) => {
  if (!str) return '--';
  const trimmed = String(str).trim();
  if (!trimmed) return '--';
  // Nếu chuỗi đang bị viết HOA toàn bộ (all-caps), chuyển về chữ thường chuẩn tiếng Việt (viết hoa chữ cái đầu)
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
    const lower = trimmed.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
  return trimmed;
};

// Chuẩn hóa tiêu đề cô đọng, súc tích: Chữ thường chuẩn tiếng Việt (viết hoa chữ cái đầu), không để chữ in hoa toàn bộ
const formatCertificateTitle = (type: 'vanbang' | 'cntt' | 'vstep', data: any) => {
  const raw = String(data.ten_van_bang || data.ten_chung_chi || '').trim();

  if (type === 'cntt') {
    if (/nâng\s*cao/i.test(raw)) return 'Chứng chỉ CNTT nâng cao';
    if (/cơ\s*bản/i.test(raw)) return 'Chứng chỉ CNTT cơ bản';
    return 'Chứng chỉ ứng dụng CNTT';
  }

  if (type === 'vstep') {
    return 'Chứng chỉ tiếng Anh VSTEP';
  }

  if (type === 'vanbang') {
    if (/thạc\s*sĩ/i.test(raw)) return 'Bằng thạc sĩ';
    if (/tiến\s*sĩ/i.test(raw)) return 'Bằng tiến sĩ';
    if (/cao\s*đẳng/i.test(raw)) return 'Bằng tốt nghiệp cao đẳng';
    if (/đại\s*học/i.test(raw)) return 'Bằng tốt nghiệp đại học';
    if (raw) return formatFieldCase(raw.replace(/\s*chính\s*quy/i, '').trim());
    return 'Bằng tốt nghiệp đại học';
  }

  return formatFieldCase(raw) || 'Thông tin tra cứu';
};

export default function CertificateCard({
  type,
  data,
  isExpanded = false,
  onToggleExpand,
  onReset,
  onClose,
}: CertificateCardProps) {
  const verificationUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}?verify=${data.so_hieu_phoi || data.id}`
      : '';

  const handlePrint = () => {
    window.print();
  };

  // Tiêu đề chuẩn hóa cô đọng, hiển thị sắc nét không bị cắt cụt
  const certificateTitle = formatCertificateTitle(type, data);
  const fullLegalTitle = data.ten_van_bang || data.ten_chung_chi || certificateTitle;

  const labelClass = 'text-[14px] min-[390px]:text-[15.5px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold text-[#475569] shrink-0 font-google-sans leading-normal whitespace-nowrap sm:w-[160px] sm:min-w-[160px] md:w-[150px] md:min-w-[150px] lg:w-[185px] lg:min-w-[185px]';
  const valueClass = 'text-[14px] min-[390px]:text-[15.5px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold text-[#0F172A] font-google-sans leading-normal break-words min-w-0 flex-1';
  const boldValueClass = 'text-[14px] min-[390px]:text-[15.5px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-bold text-[#0F172A] font-google-sans leading-normal break-words min-w-0 flex-1';
  const itemRowClass = 'flex items-start gap-2 sm:gap-2.5 lg:gap-3 py-2 sm:py-0';
  const gridRowClass = 'grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-12 sm:py-3 lg:py-3.5';

  return (
    <div className="font-google-sans text-[#0F172A] w-full flex flex-col justify-end sm:justify-center my-auto">
      {/* THẺ KẾT QUẢ TRA CỨU: DRAWER THOÁNG ĐÃNG TRÊN MOBILE (~76VH), TRONG ĐÓ CUỘN NỘI DUNG, POPUP OMNINOTCH TRÊN DESKTOP */}
      <div
        className={`bg-white rounded-[32px] sm:rounded-[36px] border-0 transition-shadow duration-300 ${isExpanded
            ? 'shadow-[0_32px_90px_-15px_rgba(15,23,42,0.32),0_12px_36px_-6px_rgba(15,23,42,0.12)]'
            : 'shadow-[0_24px_65px_-15px_rgba(15,23,42,0.22),0_10px_26px_-4px_rgba(15,23,42,0.08)]'
          } overflow-hidden certificate-card w-full h-[76vh] max-h-[82dvh] sm:h-auto sm:max-h-[88vh] flex flex-col no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        {/* TIÊU ĐỀ KẾT QUẢ VĂN BẰNG / CHỨNG CHỈ (NỀN XÁM NHẸ, CỐ ĐỊNH TRÊN CÙNG DRAWER, LIỀN MẠCH KHÔNG VIỀN) */}
        <div className="bg-slate-50/95 backdrop-blur-xs relative px-4 min-[390px]:px-5 sm:px-10 lg:px-12 pt-3 sm:pt-6 pb-3.5 sm:pb-6 shrink-0 border-0 border-none z-10">
          {/* Thanh gạt Drawer trên mobile: Chỉ hiển thị trên mobile, ẩn hoàn toàn trên desktop */}
          <div
            onClick={onClose}
            className="sm:hidden w-12 h-1.5 bg-slate-300 hover:bg-slate-400 rounded-full mx-auto mb-2 transition-colors no-print cursor-pointer active:scale-95"
            title="Nhấn để thu gọn drawer"
          />

          <div className="flex items-center justify-between gap-2.5 sm:gap-3">
            <div className="min-w-0 flex-1">
              <h2
                className="text-[18.5px] min-[360px]:text-[19.5px] min-[390px]:text-[21px] sm:text-[28px] font-bold text-[#0F172A] leading-tight tracking-tight"
                title={fullLegalTitle}
              >
                {certificateTitle}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 -mr-1 sm:-mr-2 no-print shrink-0">
              {onToggleExpand && (
                <button
                  type="button"
                  onClick={onToggleExpand}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-slate-200/60 hover:bg-slate-300/80 active:bg-slate-300 text-slate-700 hover:text-slate-900 transition-all duration-150 cursor-pointer flex-shrink-0 active:scale-90 outline-none border-0 border-none backdrop-blur-xs hidden sm:flex"
                  title={isExpanded ? 'Thu nhỏ lại kích thước chuẩn' : 'Phóng to toàn màn hình'}
                >
                  {isExpanded ? (
                    <Minimize2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 transition-transform duration-200" strokeWidth={2.4} />
                  ) : (
                    <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 transition-transform duration-200" strokeWidth={2.4} />
                  )}
                </button>
              )}

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-slate-200/60 hover:bg-slate-300/80 active:bg-slate-300 text-slate-700 hover:text-slate-900 transition-all duration-150 cursor-pointer flex-shrink-0 active:scale-90 outline-none border-0 border-none backdrop-blur-xs"
                  title="Thu gọn (Esc)"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BẢNG THÔNG TIN TOÀN DIỆN - NỀN TRẮNG TINH KHÔI, CUỘN TRONG PHẠM VI DRAWER TRÊN MOBILE, CHUẨN 20PX TRÊN DESKTOP */}
        <div className="bg-white px-4 min-[390px]:px-5 sm:px-10 lg:px-12 pt-3 pb-8 sm:py-8 overflow-y-auto overscroll-contain flex-1 touch-pan-y no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div>
            {/* 1. HỌ VÀ TÊN */}
            <div className="flex items-start gap-2.5 sm:gap-3 py-2 sm:py-3.5">
              <span className={labelClass}>Họ và tên:</span>
              <span className="text-[18px] min-[390px]:text-[20px] sm:text-[24px] md:text-[26px] lg:text-[28px] font-bold text-[#142B6F] uppercase tracking-wide break-words min-w-0 flex-1 leading-tight sm:leading-snug">
                {data.ho_ten}
              </span>
            </div>

            {/* 2. CẶP: Ngày sinh & Giới tính */}
            <div className={gridRowClass}>
              <div className={itemRowClass}>
                <span className={labelClass}>Ngày sinh:</span>
                <span className={valueClass}>{formatDate(data.ngay_sinh)}</span>
              </div>
              <div className={itemRowClass}>
                <span className={labelClass}>Giới tính:</span>
                <span className={valueClass}>
                  {data.gioi_tinh || '--'}
                  {data.noi_sinh && (
                    <span className="ml-2 font-normal text-[#475569] text-[14.5px] sm:text-[20px] font-google-sans">
                      (Nơi sinh: <strong className="font-semibold text-[#0F172A]">{data.noi_sinh}</strong>)
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* THÔNG TIN CHUYÊN MÔN / ĐÀO TẠO THEO TỪNG LOẠI */}
            {/* A. Đối với Văn bằng đại học */}
            {type === 'vanbang' && (
              <>
                {data.chuyen_nganh ? (
                  <>
                    {/* 3. CẶP: Ngành đào tạo & Chuyên ngành (Độc lập, cân xứng 2 cột, không bị ngắt cụt dòng chữ) */}
                    <div className={gridRowClass}>
                      <div className={itemRowClass}>
                        <span className={labelClass}>Ngành đào tạo:</span>
                        <span className={boldValueClass}>{formatFieldCase(data.nganh_dao_tao)}</span>
                      </div>
                      <div className={itemRowClass}>
                        <span className={labelClass}>Chuyên ngành:</span>
                        <span className={boldValueClass}>{formatFieldCase(data.chuyen_nganh)}</span>
                      </div>
                    </div>

                    {/* 4. CẶP: Hình thức đào tạo & Xếp loại tốt nghiệp */}
                    <div className={gridRowClass}>
                      <div className={itemRowClass}>
                        <span className={labelClass}>Hình thức đào tạo:</span>
                        <span className={valueClass}>
                          {formatFieldCase(data.hinh_thuc_dao_tao || 'Chính quy')}
                        </span>
                      </div>
                      <div className={itemRowClass}>
                        <span className={labelClass}>Xếp loại tốt nghiệp:</span>
                        <span className={boldValueClass}>{formatFieldCase(data.xep_loai)}</span>
                      </div>
                    </div>

                    {/* 5. CẶP: Năm tốt nghiệp & Trạng thái hồ sơ */}
                    <div className={gridRowClass}>
                      <div className={itemRowClass}>
                        <span className={labelClass}>Năm tốt nghiệp:</span>
                        <span className={valueClass}>{data.nam_tot_nghiep || '--'}</span>
                      </div>
                      <div className={itemRowClass}>
                        <span className={labelClass}>Trạng thái:</span>
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 font-google-sans text-[14px] min-[390px]:text-[15.5px] sm:text-[17px] md:text-[18px] lg:text-[20px] leading-normal break-words min-w-0 flex-1">
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" strokeWidth={2.5} />
                          <span>{data.trang_thai || 'Hợp lệ'}</span>
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* 3. CẶP: Ngành đào tạo & Hình thức đào tạo (khi không có chuyên ngành riêng) */}
                    <div className={gridRowClass}>
                      <div className={itemRowClass}>
                        <span className={labelClass}>Ngành đào tạo:</span>
                        <span className={boldValueClass}>{formatFieldCase(data.nganh_dao_tao)}</span>
                      </div>
                      <div className={itemRowClass}>
                        <span className={labelClass}>Hình thức đào tạo:</span>
                        <span className={valueClass}>
                          {formatFieldCase(data.hinh_thuc_dao_tao || 'Chính quy')}
                        </span>
                      </div>
                    </div>

                    {/* 4. CẶP: Xếp loại tốt nghiệp & Năm tốt nghiệp */}
                    <div className={gridRowClass}>
                      <div className={itemRowClass}>
                        <span className={labelClass}>Xếp loại tốt nghiệp:</span>
                        <span className={boldValueClass}>{formatFieldCase(data.xep_loai)}</span>
                      </div>
                      <div className={itemRowClass}>
                        <span className={labelClass}>Năm tốt nghiệp:</span>
                        <span className={valueClass}>{data.nam_tot_nghiep || '--'}</span>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* B. Đối với Ứng dụng CNTT */}
            {type === 'cntt' && (
              <>
                {/* 3. CẶP: Kết quả & Khóa thi */}
                <div className={gridRowClass}>
                  <div className={itemRowClass}>
                    <span className={labelClass}>Kết quả:</span>
                    <span className={`${boldValueClass} whitespace-nowrap`}>
                      {formatCnttResult(data.xep_loai, data.ket_qua)}
                    </span>
                  </div>
                  <div className={itemRowClass}>
                    <span className={labelClass}>Khóa thi:</span>
                    <span className={valueClass}>{data.khoa_thi || '--'}</span>
                  </div>
                </div>

                {/* 4. CẶP: Điểm lý thuyết & Điểm thực hành */}
                <div className={gridRowClass}>
                  <div className={itemRowClass}>
                    <span className={labelClass}>Điểm lý thuyết:</span>
                    <span className={boldValueClass}>
                      {data.diem_trac_nghiem ?? data.diem_ly_thuyet ?? '--'}
                      <span className="font-normal text-[#64748B] ml-1.5 text-[14.5px] sm:text-[20px] font-google-sans">/ 10</span>
                    </span>
                  </div>
                  <div className={itemRowClass}>
                    <span className={labelClass}>Điểm thực hành:</span>
                    <span className={boldValueClass}>
                      {data.diem_thuc_hanh ?? '--'}
                      <span className="font-normal text-[#64748B] ml-1.5 text-[14.5px] sm:text-[20px] font-google-sans">/ 10</span>
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* C. Đối với VSTEP Tiếng Anh */}
            {type === 'vstep' && (
              <>
                {/* 3. CẶP CHÍNH: Bậc năng lực & Điểm quy đổi (2 cột cân đối hoàn hảo) */}
                <div className={gridRowClass}>
                  <div className={itemRowClass}>
                    <span className={labelClass}>Bậc năng lực:</span>
                    <span className={boldValueClass}>
                      {data.bac_nang_luc || 'Bậc 4 (B2)'}
                    </span>
                  </div>
                  <div className={itemRowClass}>
                    <span className={labelClass}>Điểm quy đổi:</span>
                    <span className={boldValueClass}>
                      {data.diem_tong ?? data.diem_tong_ket ?? '--'}
                      <span className="font-normal text-[#64748B] ml-1.5 text-[14.5px] sm:text-[20px] font-google-sans">/ 10</span>
                    </span>
                  </div>
                </div>

                {/* 4. HÀNG ĐIỂM 4 KỸ NĂNG: TRÊN MOBILE XUỐNG DÒNG (ĐẢM BẢO KHÔNG BỊ TRÀN), TRÊN DESKTOP CÙNG DÒNG 20PX CHUẨN MÀU */}
                <div className="flex flex-col sm:flex-row sm:items-center items-start gap-2 sm:gap-2.5 lg:gap-3 py-2 sm:py-3.5">
                  <span className={labelClass}>
                    Điểm 4 kỹ năng:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 min-[390px]:gap-2 w-full sm:w-auto sm:flex sm:items-center sm:gap-3 lg:gap-3.5 flex-nowrap shrink-0 text-[13px] min-[360px]:text-[14px] min-[390px]:text-[15px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-google-sans leading-normal">
                    <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 min-[360px]:px-2 sm:px-3 lg:px-3.5 py-1.5 sm:py-1 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs">
                      <span className="font-normal text-[#475569]">Nghe</span>
                      <strong className="font-bold text-[#0F172A]">{data.diem_nghe ?? '--'}</strong>
                    </div>
                    <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 min-[360px]:px-2 sm:px-3 lg:px-3.5 py-1.5 sm:py-1 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs">
                      <span className="font-normal text-[#475569]">Đọc</span>
                      <strong className="font-bold text-[#0F172A]">{data.diem_doc ?? '--'}</strong>
                    </div>
                    <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 min-[360px]:px-2 sm:px-3 lg:px-3.5 py-1.5 sm:py-1 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs">
                      <span className="font-normal text-[#475569]">Viết</span>
                      <strong className="font-bold text-[#0F172A]">{data.diem_viet ?? '--'}</strong>
                    </div>
                    <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 min-[360px]:px-2 sm:px-3 lg:px-3.5 py-1.5 sm:py-1 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs">
                      <span className="font-normal text-[#475569]">Nói</span>
                      <strong className="font-bold text-[#0F172A]">{data.diem_noi ?? '--'}</strong>
                    </div>
                  </div>
                </div>

                {/* 5. HÀNG HỘI ĐỒNG THI (Dàn ngang rộng rãi, không bao giờ bị rớt dòng Đợt 4/2024) */}
                <div className="flex items-start sm:items-center gap-2 sm:gap-2.5 lg:gap-3 py-2 sm:py-3.5">
                  <span className={labelClass}>Hội đồng thi:</span>
                  <span className={`${valueClass} leading-normal`}>
                    {cleanHoiDongThi(data.hoi_dong_thi)}
                  </span>
                </div>
              </>
            )}

            {/* 6 & 7. CẶP THÔNG TIN CẤP BẰNG & PHÁP LÝ */}
            {type === 'vstep' ? (
              <>
                {/* VSTEP: Ngày thi & Ngày cấp chứng chỉ */}
                <div className={gridRowClass}>
                  <div className={itemRowClass}>
                    <span className={labelClass}>Ngày thi:</span>
                    <span className={valueClass}>
                      {formatDate(data.ngay_thi)}
                    </span>
                  </div>
                  <div className={itemRowClass}>
                    <span className={labelClass}>Ngày cấp:</span>
                    <span className={valueClass}>
                      <span>{formatDate(data.ngay_cap)}</span>
                      <span className="font-normal text-[#64748B] ml-2 text-[13.5px] sm:text-[16px] lg:text-[18px]">
                        (Hiệu lực: 02 năm)
                      </span>
                    </span>
                  </div>
                </div>

                {/* VSTEP: Số hiệu phôi & Số vào sổ */}
                <div className={gridRowClass}>
                  <div className={itemRowClass}>
                    <span className={labelClass}>Số hiệu phôi:</span>
                    <span className={`${boldValueClass} tracking-wider`}>
                      {data.so_hieu_phoi}
                    </span>
                  </div>
                  <div className={itemRowClass}>
                    <span className={labelClass}>Số vào sổ:</span>
                    <span className={`${valueClass} tracking-wide`}>
                      {data.so_vao_so}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* VĂN BẰNG & CNTT: Số hiệu văn bằng/phôi & Số vào sổ cấp bằng */}
                <div className={gridRowClass}>
                  <div className={itemRowClass}>
                    <span className={labelClass}>{type === 'vanbang' ? 'Số hiệu văn bằng:' : 'Số hiệu phôi:'}</span>
                    <span className={`${boldValueClass} tracking-wider`}>
                      {data.so_hieu_phoi}
                    </span>
                  </div>
                  <div className={itemRowClass}>
                    <span className={labelClass}>Số vào sổ:</span>
                    <span className={`${valueClass} tracking-wide`}>
                      {data.so_vao_so}
                    </span>
                  </div>
                </div>

                {/* VĂN BẰNG & CNTT: Ngày ban hành/ký cấp & Số quyết định */}
                <div className={gridRowClass}>
                  <div className={itemRowClass}>
                    <span className={labelClass}>
                      {type === 'vanbang' ? 'Ngày ban hành:' : 'Ngày ký cấp bằng:'}
                    </span>
                    <span className={valueClass}>
                      {formatDate(data.ngay_cap || data.ngay_ban_hanh)}
                    </span>
                  </div>
                  <div className={itemRowClass}>
                    <span className={labelClass}>Số quyết định:</span>
                    <span className={`${valueClass} tracking-wide`}>
                      {data.so_quyet_dinh || '--'}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* MÃ QR ĐỐI CHIẾU DỮ LIỆU GỐC TRÊN MOBILE (NẰM Ở CUỐI NỘI DUNG CUỘN) */}
            <div className="sm:hidden pt-4 pb-2 flex items-center gap-3.5 mt-3 border-t border-slate-100">
              <div className="p-1.5 bg-slate-50 border border-slate-200/90 rounded-xl shadow-2xs shrink-0">
                <QRCodeSVG value={verificationUrl || 'https://tracuu.nctu.edu.vn'} size={44} />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-[#0F172A] leading-tight">
                  Mã QR đối chiếu dữ liệu gốc
                </span>
                <span className="text-[12px] text-slate-500 font-normal mt-0.5 leading-tight">
                  Quét để tra cứu & xác thực hồ sơ gốc trực tuyến
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CHÂN THẺ GỌN GÀNG: TRÊN PC HIỂN THỊ ĐẦY ĐỦ QR VÀ CÁC NÚT THAO TÁC */}
        <div className="hidden sm:flex bg-slate-50/95 backdrop-blur-xs flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 no-print px-5 sm:px-10 lg:px-12 py-3.5 sm:py-5 border-0 border-none shrink-0 z-10">
          <div className="flex items-center gap-3 justify-start">
            <div className="p-1.5 bg-white border border-slate-200/80 rounded-xl shadow-2xs shrink-0">
              <QRCodeSVG value={verificationUrl || 'https://tracuu.nctu.edu.vn'} size={46} />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] lg:text-[16px] text-[#0F172A] font-semibold leading-tight">
                Mã QR đối chiếu dữ liệu gốc
              </span>
              <span className="text-[12px] text-[#64748B] font-normal leading-tight mt-0.5">
                Quét để thẩm tra trực tuyến
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-[16px] rounded-xl bg-[#142B6F] hover:bg-[#0E2055] text-white font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-95 select-none"
            >
              <Printer className="w-4 h-4 stroke-[2.2] shrink-0" />
              <span className="whitespace-nowrap">In bản kết quả</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-3 text-[14px] sm:text-[16px] rounded-xl border border-slate-300/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-2xs hover:border-slate-400 select-none"
            >
              <RotateCcw className="w-4 h-4 text-slate-500 stroke-[2.2] shrink-0" />
              <span className="whitespace-nowrap">Tra cứu hồ sơ khác</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
