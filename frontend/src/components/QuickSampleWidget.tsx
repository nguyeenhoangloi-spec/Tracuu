'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, ChevronUp, ChevronDown, Check, ArrowRight, UserCheck } from 'lucide-react';

interface QuickSampleWidgetProps {
  activeTab: 'vanbang' | 'cntt' | 'vstep';
  sampleData?: {
    vanbang?: any[];
    cntt?: any[];
    vstep?: any[];
  };
  onApplySample: (sample: any) => void;
  isSpotlightOpen?: boolean;
  isResultOpen?: boolean;
}

const FALLBACK_SAMPLES = {
  vanbang: [
    {
      id: 'VB-2026-DNC006026',
      label: 'Dương Thị Anh Thư - TT Đa phương tiện (DNC/CN.006026)',
      ten_van_bang: 'Bằng tốt nghiệp đại học',
      ho_ten: 'DƯƠNG THỊ ANH THƯ',
      ngay_sinh: '2004-12-24',
      gioi_tinh: 'Nữ',
      loai_dao_tao: 'dh',
      nganh_dao_tao: 'Truyền thông đa phương tiện',
      xep_loai: 'Xuất sắc',
      hinh_thuc_dao_tao: 'Chính quy',
      so_hieu_phoi: 'DNC/CN.006026',
      so_vao_so: 'K10/1947',
      so_quyet_dinh: '776/QĐ-ĐHNCT',
      ngay_ban_hanh: '2026-06-23',
      nam_tot_nghiep: 2026,
      don_vi_cap: 'Trường Đại học Nam Cần Thơ',
      nguoi_ky: 'TS. Nguyễn Văn Quang - Hiệu trưởng',
      trang_thai: 'Hợp lệ',
      badge: 'Đại học',
    },
    {
      id: 'VB-2023-08912',
      label: 'Nguyễn Văn An - CNTT (Bằng Đại học)',
      ten_van_bang: 'Bằng tốt nghiệp đại học chính quy',
      ho_ten: 'NGUYỄN VĂN AN',
      ngay_sinh: '2001-05-15',
      gioi_tinh: 'Nam',
      loai_dao_tao: 'dh',
      nganh_dao_tao: 'Công nghệ thông tin',
      chuyen_nganh: 'Kỹ thuật phần mềm & AI',
      xep_loai: 'Giỏi',
      hinh_thuc_dao_tao: 'Chính quy',
      so_vao_so: 'NCTU-CNTT-2023/142',
      so_hieu_phoi: 'B6829104',
      so_quyet_dinh: '782/QĐ-ĐHNCT',
      ngay_ban_hanh: '2023-07-28',
      nam_tot_nghiep: 2023,
      don_vi_cap: 'Trường Đại học Nam Cần Thơ',
      nguoi_ky: 'TS. Nguyễn Văn Quang - Hiệu trưởng',
      trang_thai: 'Hợp lệ',
      badge: 'Đại học',
    },
    {
      id: 'VB-2024-01294',
      label: 'Trần Thị Ngọc Mai - Dược học (Bằng Đại học)',
      ten_van_bang: 'Bằng tốt nghiệp đại học chính quy',
      ho_ten: 'TRẦN THỊ NGỌC MAI',
      ngay_sinh: '2002-11-20',
      gioi_tinh: 'Nữ',
      loai_dao_tao: 'dh',
      nganh_dao_tao: 'Dược học',
      chuyen_nganh: 'Dược lâm sàng',
      xep_loai: 'Xuất sắc',
      hinh_thuc_dao_tao: 'Chính quy',
      so_vao_so: 'NCTU-DH-2024/098',
      so_hieu_phoi: 'B7910245',
      so_quyet_dinh: '915/QĐ-ĐHNCT',
      ngay_ban_hanh: '2024-06-18',
      nam_tot_nghiep: 2024,
      don_vi_cap: 'Trường Đại học Nam Cần Thơ',
      nguoi_ky: 'TS. Nguyễn Văn Quang - Hiệu trưởng',
      trang_thai: 'Hợp lệ',
      badge: 'Đại học',
    },
    {
      id: 'VB-2023-THS-019',
      label: 'Phạm Minh Đức - Quản lý kinh tế (Thạc sĩ)',
      ten_van_bang: 'Bằng thạc sĩ',
      ho_ten: 'PHẠM MINH ĐỨC',
      ngay_sinh: '1995-03-25',
      gioi_tinh: 'Nam',
      loai_dao_tao: 'ths',
      nganh_dao_tao: 'Quản lý kinh tế',
      xep_loai: 'Giỏi',
      hinh_thuc_dao_tao: 'Chính quy',
      so_vao_so: 'NCTU-THS-2023/045',
      so_hieu_phoi: 'TS203918',
      so_quyet_dinh: '310/QĐ-ĐHNCT',
      ngay_ban_hanh: '2023-10-15',
      nam_tot_nghiep: 2023,
      don_vi_cap: 'Trường Đại học Nam Cần Thơ',
      nguoi_ky: 'TS. Nguyễn Văn Quang - Hiệu trưởng',
      trang_thai: 'Hợp lệ',
      badge: 'Thạc sĩ',
    },
  ],
  cntt: [
    {
      id: 'CNTT-CB-001300',
      label: 'Nguyễn Thị Ngọc Châu - CNTT Cơ bản',
      cap_do: 'coban',
      ten_chung_chi: 'Chứng chỉ ứng dụng công nghệ thông tin cơ bản',
      ho_ten: 'Nguyễn Thị Ngọc Châu',
      ngay_sinh: '2001-12-03',
      gioi_tinh: 'Nữ',
      noi_sinh: 'Trà Vinh',
      so_cccd: '',
      khoa_thi: 'Khoá 2022',
      ngay_thi: '10/10/2022',
      diem_ly_thuyet: 5.3,
      diem_trac_nghiem: 5.3,
      diem_thuc_hanh: 6.5,
      diem_tong_ket: 5.9,
      ket_qua: 'Đạt',
      xep_loai: 'Đạt',
      so_hieu_phoi: '001300',
      so_vao_so: 'NCTU-CNTT-CB/2022/1300',
      so_quyet_dinh: '',
      ngay_cap: '10/10/2022',
      trang_thai: 'Hợp lệ',
      badge: 'Cơ bản',
    },
    {
      id: 'CNTT-CB-2024-001',
      label: 'Nguyễn Văn An - CNTT Cơ bản',
      cap_do: 'coban',
      ten_chung_chi: 'Chứng chỉ ứng dụng công nghệ thông tin cơ bản',
      ho_ten: 'NGUYỄN VĂN AN',
      ngay_sinh: '2001-05-15',
      gioi_tinh: 'Nam',
      noi_sinh: 'Cần Thơ',
      so_cccd: '092201004581',
      khoa_thi: 'Khoá 42/2024',
      ngay_thi: '2024-03-24',
      diem_ly_thuyet: 8.5,
      diem_thuc_hanh: 9.0,
      diem_tong_ket: 8.75,
      xep_loai: 'ĐẠT (Loại Giỏi)',
      so_hieu_phoi: 'CB-982145',
      so_vao_so: 'NCTU-CNTT-CB/2024/412',
      so_quyet_dinh: '142/QĐ-TTCDR',
      ngay_cap: '2024-04-10',
      trang_thai: 'Hợp lệ',
      badge: 'Cơ bản',
    },
    {
      id: 'CNTT-NC-2024-088',
      label: 'Trần Thị Ngọc Mai - CNTT Nâng cao',
      cap_do: 'nangcao',
      ten_chung_chi: 'Chứng chỉ ứng dụng công nghệ thông tin nâng cao',
      ho_ten: 'TRẦN THỊ NGỌC MAI',
      ngay_sinh: '2002-11-20',
      gioi_tinh: 'Nữ',
      noi_sinh: 'Hậu Giang',
      so_cccd: '093302008742',
      khoa_thi: 'Khoá 18/2024',
      ngay_thi: '2024-05-19',
      diem_ly_thuyet: 9.0,
      diem_thuc_hanh: 9.5,
      diem_tong_ket: 9.25,
      xep_loai: 'ĐẠT (Loại Xuất sắc)',
      so_hieu_phoi: 'NC-452109',
      so_vao_so: 'NCTU-CNTT-NC/2024/091',
      so_quyet_dinh: '208/QĐ-TTCDR',
      ngay_cap: '2024-06-05',
      trang_thai: 'Hợp lệ',
      badge: 'Nâng cao',
    },
  ],
  vstep: [
    {
      id: 'VSTEP-2024-0489',
      label: 'Nguyễn Văn An - VSTEP B2 (Bậc 4)',
      ten_chung_chi: 'Chứng chỉ năng lực tiếng Anh (VSTEP)',
      ho_ten: 'NGUYỄN VĂN AN',
      ngay_sinh: '2001-05-15',
      gioi_tinh: 'Nam',
      so_cccd: '092201004581',
      hoi_dong_thi: 'Hội đồng thi ĐH Nam Cần Thơ - Đợt 4/2024',
      ngay_thi: '2024-04-14',
      so_bao_danh: 'NCTU-VSTEP-2024-0489',
      diem_nghe: 6.5,
      diem_doc: 7.0,
      diem_viet: 6.0,
      diem_noi: 6.5,
      diem_tong: 6.5,
      bac_nang_luc: 'Bậc 4 (B2)',
      khung_tham_chieu: 'Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam',
      so_hieu_phoi: 'VSTEP-881923',
      so_vao_so: 'NCTU-VSTEP/2024/318',
      ngay_cap: '2024-05-02',
      hieu_luc: '02 năm kể từ ngày cấp (đến 02/05/2026)',
      trang_thai: 'Hợp lệ',
      badge: 'Bậc 4 (B2)',
    },
    {
      id: 'VSTEP-2024-0912',
      label: 'Lê Hoàng Nam - VSTEP B1 (Bậc 3)',
      ten_chung_chi: 'Chứng chỉ năng lực tiếng Anh (VSTEP)',
      ho_ten: 'LÊ HOÀNG NAM',
      ngay_sinh: '2000-08-10',
      gioi_tinh: 'Nam',
      so_cccd: '092200001429',
      hoi_dong_thi: 'Hội đồng thi ĐH Nam Cần Thơ - Đợt 2/2024',
      ngay_thi: '2024-02-25',
      so_bao_danh: 'NCTU-VSTEP-2024-0912',
      diem_nghe: 5.0,
      diem_doc: 5.5,
      diem_viet: 5.0,
      diem_noi: 5.5,
      diem_tong: 5.5,
      bac_nang_luc: 'Bậc 3 (B1)',
      khung_tham_chieu: 'Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam',
      so_hieu_phoi: 'VSTEP-772019',
      so_vao_so: 'NCTU-VSTEP/2024/115',
      ngay_cap: '2024-03-12',
      hieu_luc: '02 năm kể từ ngày cấp (đến 12/03/2026)',
      trang_thai: 'Hợp lệ',
      badge: 'Bậc 3 (B1)',
    },
  ],
};

const TAB_TITLES: Record<'vanbang' | 'cntt' | 'vstep', string> = {
  vanbang: 'Văn bằng tốt nghiệp',
  cntt: 'Chứng chỉ CNTT',
  vstep: 'Chứng chỉ VSTEP',
};

export default function QuickSampleWidget({
  activeTab,
  sampleData,
  onApplySample,
  isSpotlightOpen = false,
  isResultOpen = false,
}: QuickSampleWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'vanbang' | 'cntt' | 'vstep'>(activeTab);
  const [appliedLabel, setAppliedLabel] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);

  // Đồng bộ selectedTab khi activeTab từ trang chính thay đổi
  useEffect(() => {
    setSelectedTab(activeTab);
  }, [activeTab]);

  // Lấy dữ liệu mẫu tương ứng với tab đang chọn trong widget
  const currentSamples =
    sampleData?.[selectedTab] && sampleData[selectedTab]!.length > 0
      ? sampleData[selectedTab]!
      : FALLBACK_SAMPLES[selectedTab];

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Đóng khi bấm Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (item: any) => {
    onApplySample({ ...item, _targetTab: selectedTab });
    setAppliedLabel(item.label || item.ho_ten);
    setTimeout(() => {
      setAppliedLabel(null);
      setIsOpen(false);
    }, 400);
  };

  // Nút Hồ sơ mẫu test luôn luôn hiển thị thường trực ở góc màn hình để tiện thử nghiệm mọi lúc
  const shouldHide = false;

  return (
    <aside
      id="quick-sample-widget"
      data-quick-sample="true"
      aria-label="Khối dữ liệu mẫu thử nghiệm"
      ref={widgetRef}
      className={`fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-[105] select-none no-print transition-all duration-300 ${
        shouldHide ? 'opacity-0 pointer-events-none scale-90 translate-y-3' : 'opacity-100 pointer-events-auto scale-100 translate-y-0'
      }`}
    >
      {/* PANEL DANH SÁCH MẪU (BUNG LÊN TỪ NÚT GÓC DƯỚI) */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-[calc(100vw-32px)] max-w-[340px] sm:max-w-[380px] sm:w-[380px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25),0_0_0_1px_rgba(0,0,0,0.04)] p-4 sm:p-5 space-y-3 transition-all duration-200 origin-bottom-right">
          {/* Header Panel */}
          <div className="border-b border-slate-100 pb-2.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 fill-amber-500/30 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 leading-snug">
                    Hồ sơ mẫu test nhanh
                  </h4>
                  <p className="text-[12px] text-slate-500 font-medium">
                    {TAB_TITLES[selectedTab]}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thanh chuyển đổi tab danh mục trong widget */}
            <div className="flex items-center p-1 bg-slate-100/90 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setSelectedTab('vanbang')}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedTab === 'vanbang'
                    ? 'bg-white text-blue-700 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Văn bằng
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('cntt')}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedTab === 'cntt'
                    ? 'bg-white text-cyan-700 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                CNTT
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab('vstep')}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedTab === 'vstep'
                    ? 'bg-white text-rose-700 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                VSTEP
              </button>
            </div>
          </div>

          {/* Subtitle / Tip */}
          <p className="text-[12px] text-slate-500 leading-relaxed">
            Chọn một hồ sơ mẫu bên dưới để tự động điền nhanh vào form tra cứu:
          </p>

          {/* Danh sách các item mẫu */}
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 -mr-1">
            {currentSamples.map((sample: any, idx: number) => {
              const isJustApplied = appliedLabel === (sample.label || sample.ho_ten);
              const badgeText =
                sample.badge ||
                (sample.loai_dao_tao === 'ths'
                  ? 'Thạc sĩ'
                  : sample.loai_dao_tao === 'ts'
                  ? 'Tiến sĩ'
                  : sample.loai_dao_tao === 'cd'
                  ? 'Cao đẳng'
                  : sample.loai_dao_tao === 'dh'
                  ? 'Đại học'
                  : sample.cap_do === 'nangcao'
                  ? 'Nâng cao'
                  : sample.cap_do === 'coban'
                  ? 'Cơ bản'
                  : selectedTab === 'vstep'
                  ? 'VSTEP'
                  : undefined);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(sample)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 group cursor-pointer ${
                    isJustApplied
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50/90 border-slate-200/80 hover:border-blue-300 hover:shadow-xs'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-[13.5px] font-bold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                        {sample.ho_ten || sample.label}
                      </span>
                      {badgeText && (
                        <span className="px-1.5 py-0.5 text-[10.5px] font-semibold rounded-md bg-slate-100 text-slate-600 border border-slate-200/60 shrink-0">
                          {badgeText}
                        </span>
                      )}
                    </div>
                    <div className="text-[11.5px] text-slate-500 flex items-center gap-2">
                      {sample.so_hieu_phoi && (
                        <span>
                          Số hiệu phôi: <strong className="text-slate-700 font-medium">{sample.so_hieu_phoi}</strong>
                        </span>
                      )}
                      {sample.ngay_sinh && (
                        <>
                          <span>•</span>
                          <span>{sample.ngay_sinh}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isJustApplied ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Đã điền</span>
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-colors">
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer hướng dẫn */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Dữ liệu thử nghiệm DNC</span>
            </span>
            <span>ESC để đóng</span>
          </div>
        </div>
      )}

      {/* NÚT FAB GÓC MÀN HÌNH (FLOATING ACTION BUTTON) */}
      <button
        type="button"
        id="btn-quick-sample-fab"
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-700 font-medium text-xs border border-slate-200/90 hover:border-amber-300 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95 group"
        title="Nhấn để mở danh sách hồ sơ mẫu thử nghiệm"
      >
        <span className="w-4 h-4 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-200">
          <Sparkles className="w-3 h-3 fill-amber-500/30 text-amber-500" />
        </span>
        <span className="font-medium text-slate-700 group-hover:text-slate-900 text-[12px]">
          Hồ sơ mẫu test
        </span>
        <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-white">
          {currentSamples.length}
        </span>
        {isOpen ? (
          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 ml-0.5" />
        ) : (
          <ChevronUp className="w-3 h-3 text-slate-400 group-hover:text-slate-600 ml-0.5" />
        )}
      </button>
    </aside>
  );
}
