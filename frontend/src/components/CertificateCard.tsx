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

  const labelClass = 'text-[14px] min-[390px]:text-[15.5px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-medium text-apple-muted shrink-0 font-sans leading-normal whitespace-nowrap text-left sm:w-[155px] md:w-[175px] lg:w-[195px]';
  const valueClass = 'text-[14px] min-[390px]:text-[15.5px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold text-apple-text font-sans leading-normal break-words min-w-0 flex-1 text-right sm:text-left';
  const boldValueClass = 'text-[14px] min-[390px]:text-[15.5px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-semibold text-apple-text font-sans leading-normal break-words min-w-0 flex-1 text-right sm:text-left';
  const itemRowClass = 'flex items-start justify-between sm:justify-start gap-3 sm:gap-3.5 py-2 sm:py-0 w-full';
  const gridRowClass = 'grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-12 sm:py-3 lg:py-3.5';

  return (
    <div className="font-sans text-apple-text w-full flex flex-col justify-end sm:justify-center my-auto print:my-0 print:w-full">
      {/* THẺ KẾT QUẢ TRA CỨU: DRAWER THOÁNG ĐÃNG TRÊN MOBILE (TỐI ĐA 88DVH), TRONG ĐÓ CUỘN NỘI DUNG, POPUP OMNINOTCH TRÊN DESKTOP */}
      <div
        className={`bg-white rounded-t-[36px] rounded-b-none sm:rounded-[38px] sm:rounded-b-[38px] border-0 transition-shadow duration-300 ${isExpanded
          ? 'shadow-[0_32px_90px_-15px_rgba(15,23,42,0.32),0_12px_36px_-6px_rgba(15,23,42,0.12)]'
          : 'shadow-[0_24px_65px_-15px_rgba(15,23,42,0.22),0_10px_26px_-4px_rgba(15,23,42,0.08)]'
          } overflow-hidden certificate-card w-full max-h-[75dvh] sm:h-auto sm:max-h-[88vh] flex flex-col no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden print:rounded-none print:shadow-none print:border-none print:overflow-visible print:h-auto print:max-h-none`}
      >
        {/* Thanh gạt tay kéo vuốt trên Mobile (Đồng bộ 100% nhận diện với Form Sheet) */}
        <div
          onClick={onClose}
          className="pt-3 pb-1 flex justify-center shrink-0 cursor-pointer sm:hidden group select-none bg-slate-50/95"
          title="Chạm hoặc vuốt để đóng"
        >
          <div className="w-10 h-1.2 rounded-full bg-slate-300 group-hover:bg-slate-400 active:bg-slate-500 transition-colors" />
        </div>

        {/* TIÊU ĐỀ KẾT QUẢ VĂN BẰNG / CHỨNG CHỈ (NỀN XÁM NHẸ TRÊN MÀN HÌNH, NỀN TRẮNG KHI IN) */}
        <div className="bg-slate-50/95 print:bg-white backdrop-blur-xs relative px-5 min-[390px]:px-6 sm:px-10 lg:px-12 pt-3 sm:pt-6 pb-3.5 sm:pb-6 print:pb-2 print:pt-0 print:px-0 shrink-0 border-0 border-none z-10">
          {/* Header Quốc hiệu / Tên trường chuẩn hóa (Chỉ xuất hiện khi In) */}
          <div className="hidden print:flex items-center justify-between pb-3 mb-3 border-b-2 border-brand-navy">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://nctu.edu.vn/images/png/logo_truong_3.png"
                alt="Logo DNC"
                className="h-11 w-auto object-contain"
              />
              <div>
                <h1 className="text-[13.5px] font-bold text-brand-navy uppercase tracking-wider leading-tight">
                  TRƯỜNG ĐẠI HỌC NAM CẦN THƠ
                </h1>
                <p className="text-[11px] font-semibold text-apple-muted uppercase tracking-wide leading-tight">
                  CỔNG TRA CỨU & XÁC THỰC VĂN BẰNG - CHỨNG CHỈ ĐIỆN TỬ
                </p>
              </div>
            </div>
            <div className="text-right text-[11px] text-apple-muted leading-tight">
              <div>Hệ thống xác thực:</div>
              <div className="font-semibold text-apple-text">tracuu.nctu.edu.vn</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2.5 sm:gap-3">
            <div className="min-w-0 flex-1">
              <h2
                className="text-[23px] min-[360px]:text-[25px] min-[390px]:text-[27px] sm:text-[32px] font-semibold text-apple-text leading-tight tracking-tight print:text-[22px] print:text-brand-navy"
                title={fullLegalTitle}
              >
                {certificateTitle}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 mr-0 sm:mr-0 no-print shrink-0">
              {onToggleExpand && (
                <button
                  type="button"
                  onClick={onToggleExpand}
                  className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] active:bg-[#DFDFE4] text-[#1D1D1F] transition-all duration-150 cursor-pointer flex-shrink-0 active:scale-90 outline-none border-0 border-none backdrop-blur-xs hidden sm:flex"
                  title={isExpanded ? 'Thu nhỏ lại kích thước chuẩn' : 'Phóng to toàn màn hình'}
                >
                  {isExpanded ? (
                    <Minimize2 className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#1D1D1F] transition-transform duration-200" strokeWidth={2.3} />
                  ) : (
                    <Maximize2 className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#1D1D1F] transition-transform duration-200" strokeWidth={2.3} />
                  )}
                </button>
              )}

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="relative overflow-hidden w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] active:bg-[#DFDFE4] text-[#1D1D1F] transition-all duration-150 cursor-pointer flex-shrink-0 active:scale-90 outline-none border-0 border-none select-none [-webkit-tap-highlight-color:transparent]"
                  title="Đóng (Esc)"
                  aria-label="Đóng kết quả"
                >
                  <X className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#1D1D1F] pointer-events-none" strokeWidth={2.3} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BẢNG THÔNG TIN TOÀN DIỆN - NỀN TRẮNG TINH KHÔI, CUỘN TRONG PHẠM VI DRAWER TRÊN MOBILE, CHUẨN 20PX TRÊN DESKTOP */}
        <div className="bg-white px-4 min-[390px]:px-5 sm:px-10 lg:px-12 pt-3 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] sm:py-8 overflow-y-auto overscroll-contain flex-1 touch-pan-y no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden print:px-0 print:py-2 print:overflow-visible">
          <div>
            {/* 1. HỌ TÊN: XANH NAVY THƯƠNG HIỆU CHUẨN NCTU (#25359D) */}
            <div className="flex items-start justify-between sm:justify-start gap-3 sm:gap-3.5 py-2 sm:py-3.5 w-full">
              <span className={labelClass}>Họ tên:</span>
              <span className="text-[18px] min-[390px]:text-[20px] sm:text-[24px] md:text-[26px] lg:text-[28px] font-semibold text-brand-navy uppercase tracking-wide break-words min-w-0 flex-1 text-right sm:text-left leading-tight sm:leading-snug">
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
                    <span className="ml-2 font-normal text-apple-muted text-[14.5px] sm:text-[20px] font-sans">
                      (Nơi sinh: <strong className="font-semibold text-apple-text">{data.noi_sinh}</strong>)
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
                        <span className="inline-flex items-center justify-end sm:justify-start gap-1.5 font-bold text-emerald-600 font-google-sans text-[14px] min-[390px]:text-[15.5px] sm:text-[17px] md:text-[18px] lg:text-[20px] leading-normal break-words min-w-0 flex-1 text-right sm:text-left">
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
                      <span className="font-normal text-apple-muted ml-1.5 text-[14.5px] sm:text-[20px] font-sans">/ 10</span>
                    </span>
                  </div>
                  <div className={itemRowClass}>
                    <span className={labelClass}>Điểm thực hành:</span>
                    <span className={boldValueClass}>
                      {data.diem_thuc_hanh ?? '--'}
                      <span className="font-normal text-apple-muted ml-1.5 text-[14.5px] sm:text-[20px] font-sans">/ 10</span>
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
                      <span className="font-normal text-apple-muted ml-1.5 text-[14.5px] sm:text-[20px] font-sans">/ 10</span>
                    </span>
                  </div>
                </div>

                {/* 4. HÀNG ĐIỂM 4 KỸ NĂNG: TRÊN MOBILE XUỐNG DÒNG (ĐẢM BẢO KHÔNG BỊ TRÀN), TRÊN DESKTOP CÙNG DÒNG 20PX CHUẨN MÀU */}
                <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between sm:justify-start gap-2 sm:gap-3.5 py-2 sm:py-3.5 w-full">
                  <span className={labelClass}>
                    Điểm 4 kỹ năng:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 min-[390px]:gap-2 w-full sm:w-auto sm:flex sm:items-center sm:gap-4 lg:gap-5 text-[13px] min-[360px]:text-[14px] min-[390px]:text-[15px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-sans leading-normal">
                    <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 min-[360px]:px-2 sm:px-3.5 lg:px-4 py-1.5 sm:py-1 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs w-full sm:w-auto shrink-0">
                      <span className="font-normal text-apple-muted">Nghe</span>
                      <strong className="font-bold text-apple-text">{data.diem_nghe ?? '--'}</strong>
                    </div>
                    <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 min-[360px]:px-2 sm:px-3.5 lg:px-4 py-1.5 sm:py-1 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs w-full sm:w-auto shrink-0">
                      <span className="font-normal text-apple-muted">Đọc</span>
                      <strong className="font-bold text-apple-text">{data.diem_doc ?? '--'}</strong>
                    </div>
                    <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 min-[360px]:px-2 sm:px-3.5 lg:px-4 py-1.5 sm:py-1 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs w-full sm:w-auto shrink-0">
                      <span className="font-normal text-apple-muted">Viết</span>
                      <strong className="font-bold text-apple-text">{data.diem_viet ?? '--'}</strong>
                    </div>
                    <div className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-1.5 min-[360px]:px-2 sm:px-3.5 lg:px-4 py-1.5 sm:py-1 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs w-full sm:w-auto shrink-0">
                      <span className="font-normal text-apple-muted">Nói</span>
                      <strong className="font-bold text-apple-text">{data.diem_noi ?? '--'}</strong>
                    </div>
                  </div>
                </div>

                {/* 5. HÀNG HỘI ĐỒNG THI (Dàn ngang rộng rãi, không bao giờ bị rớt dòng Đợt 4/2024) */}
                <div className="flex items-start sm:items-center justify-between sm:justify-start gap-2 sm:gap-3.5 py-2 sm:py-3.5 w-full">
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
                      <span className="font-normal text-apple-muted ml-2 text-[13.5px] sm:text-[16px] lg:text-[18px]">
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
                {/* VĂN BẰNG & CNTT: Số hiệu phôi & Số vào sổ */}
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
            <div className="sm:hidden print:hidden pt-4 pb-2 flex items-center gap-3.5 mt-3 border-t border-slate-100">
              <div className="p-1.5 bg-slate-50 border border-slate-200/90 rounded-xl shadow-2xs shrink-0">
                <QRCodeSVG value={verificationUrl || 'https://tracuu.nctu.edu.vn'} size={44} />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-apple-text leading-tight">
                  Mã QR đối chiếu dữ liệu gốc
                </span>
                <span className="text-[12px] text-apple-muted font-normal mt-0.5 leading-tight">
                  Quét để tra cứu & xác thực hồ sơ gốc trực tuyến
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CHÂN THẺ GỌN GÀNG: TRÊN PC VÀ KHI IN HIỂN THỊ ĐẦY ĐỦ QR */}
        <div className="hidden sm:flex print:flex bg-slate-50/95 print:bg-white backdrop-blur-xs flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 px-5 sm:px-10 lg:px-12 py-3.5 sm:py-5 print:py-3 print:px-0 border-0 border-none print:border-t print:border-slate-200 shrink-0 z-10 print:mt-4">
          <div className="flex items-center gap-3 justify-start">
            <div className="p-1.5 bg-white border border-slate-200/80 print:border-slate-300 rounded-xl shadow-2xs shrink-0">
              <QRCodeSVG value={verificationUrl || 'https://tracuu.nctu.edu.vn'} size={46} />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] lg:text-[16px] text-apple-text font-semibold leading-tight">
                Mã QR đối chiếu dữ liệu gốc
              </span>
              <span className="text-[12px] text-apple-muted font-normal leading-tight mt-0.5">
                Quét để thẩm tra tính xác thực trực tuyến tại tracuu.nctu.edu.vn
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto no-print">
            <button
              type="button"
              onClick={handlePrint}
              className="btn-primary-apple group flex-1 sm:flex-initial h-[48px] sm:h-[52px] px-6 sm:px-7 text-[15px] sm:text-[16px] rounded-full font-semibold flex items-center justify-center gap-2.5 select-none"
            >
              <Printer className="w-4.5 h-4.5 stroke-[2.2] shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="whitespace-nowrap">In bản kết quả</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="flex-1 sm:flex-initial h-[48px] sm:h-[52px] px-5 sm:px-6 text-[15px] sm:text-[16px] rounded-full border border-[#D2D2D7] hover:border-[#86868B] bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center gap-2.5 active:scale-95 shadow-sm select-none"
            >
              <RotateCcw className="w-4.5 h-4.5 text-[#1D1D1F] stroke-[2.2] shrink-0" />
              <span className="whitespace-nowrap">Tra cứu hồ sơ khác</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
