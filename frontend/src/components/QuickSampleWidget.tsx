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
}

const FALLBACK_SAMPLES = {
  vanbang: [
    {
      label: 'Dương Thị Anh Thư - TT Đa phương tiện (DNC/CN.006026)',
      ho_ten: 'Dương Thị Anh Thư',
      ngay_sinh: '2004-12-24',
      loai_dao_tao: 'dh',
      so_hieu_phoi: 'DNC/CN.006026',
      so_vao_so: 'K10/1947',
      badge: 'Đại học',
    },
    {
      label: 'Nguyễn Văn An - CNTT (Bằng Đại học)',
      ho_ten: 'Nguyễn Văn An',
      ngay_sinh: '2001-05-15',
      loai_dao_tao: 'dh',
      so_hieu_phoi: 'B6829104',
      so_vao_so: 'DNC-CNTT-2023/142',
      badge: 'Đại học',
    },
    {
      label: 'Trần Thị Ngọc Mai - Dược học (Bằng Đại học)',
      ho_ten: 'Trần Thị Ngọc Mai',
      ngay_sinh: '2002-11-20',
      loai_dao_tao: 'dh',
      so_hieu_phoi: 'B7910245',
      so_vao_so: 'DNC-DH-2024/098',
      badge: 'Đại học',
    },
    {
      label: 'Phạm Minh Đức - Quản lý kinh tế (Thạc sĩ)',
      ho_ten: 'Phạm Minh Đức',
      ngay_sinh: '1995-03-25',
      loai_dao_tao: 'ths',
      so_hieu_phoi: 'TS203918',
      so_vao_so: 'DNC-THS-2023/045',
      badge: 'Thạc sĩ',
    },
  ],
  cntt: [
    {
      label: 'Nguyễn Thị Ngọc Châu - CNTT Cơ bản',
      cap_do: 'coban',
      so_hieu_phoi: '001300',
      ho_ten: 'Nguyễn Thị Ngọc Châu',
      ngay_sinh: '2001-12-03',
      badge: 'Cơ bản',
    },
    {
      label: 'Nguyễn Văn An - CNTT Cơ bản',
      cap_do: 'coban',
      so_hieu_phoi: 'CB-982145',
      ho_ten: 'Nguyễn Văn An',
      ngay_sinh: '2001-05-15',
      badge: 'Cơ bản',
    },
    {
      label: 'Trần Thị Ngọc Mai - CNTT Nâng cao',
      cap_do: 'nangcao',
      so_hieu_phoi: 'NC-452109',
      ho_ten: 'Trần Thị Ngọc Mai',
      ngay_sinh: '2002-11-20',
      badge: 'Nâng cao',
    },
  ],
  vstep: [
    {
      label: 'Nguyễn Văn An - VSTEP B2 (Bậc 4)',
      so_hieu_phoi: 'VSTEP-881923',
      ho_ten: 'Nguyễn Văn An',
      ngay_sinh: '2001-05-15',
      badge: 'Bậc 4 (B2)',
    },
    {
      label: 'Lê Hoàng Nam - VSTEP B1 (Bậc 3)',
      so_hieu_phoi: 'VSTEP-772019',
      ho_ten: 'Lê Hoàng Nam',
      ngay_sinh: '2000-08-10',
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
}: QuickSampleWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [appliedLabel, setAppliedLabel] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);

  // Lấy dữ liệu mẫu tương ứng với tab hiện tại
  const currentSamples =
    sampleData?.[activeTab] && sampleData[activeTab]!.length > 0
      ? sampleData[activeTab]!
      : FALLBACK_SAMPLES[activeTab];

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
    onApplySample(item);
    setAppliedLabel(item.label || item.ho_ten);
    setTimeout(() => {
      setAppliedLabel(null);
      setIsOpen(false);
    }, 450);
  };

  return (
    <aside aria-label="Khối dữ liệu mẫu thử nghiệm" ref={widgetRef} className="fixed bottom-20 right-3.5 sm:bottom-6 sm:right-6 z-40 select-none">
      {/* PANEL DANH SÁCH MẪU (BUNG LÊN TỪ NÚT GÓC DƯỚI) */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-[calc(100vw-32px)] max-w-[340px] sm:max-w-[380px] sm:w-[380px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25),0_0_0_1px_rgba(0,0,0,0.04)] p-4 sm:p-5 space-y-3.5 transition-all duration-200 origin-bottom-right">
          {/* Header Panel */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 fill-amber-500/30 text-amber-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 leading-snug">
                  Hồ sơ mẫu test nhanh
                </h4>
                <p className="text-[12px] text-slate-500 font-medium">
                  {TAB_TITLES[activeTab]}
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

          {/* Subtitle / Tip */}
          <p className="text-[12.5px] text-slate-500 leading-relaxed">
            Chọn một hồ sơ mẫu bên dưới để tự động điền nhanh vào form tra cứu:
          </p>

          {/* Danh sách các item mẫu */}
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 -mr-1">
            {currentSamples.map((sample: any, idx: number) => {
              const isJustApplied = appliedLabel === (sample.label || sample.ho_ten);
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
                      {sample.badge && (
                        <span className="px-1.5 py-0.5 text-[10.5px] font-semibold rounded-md bg-slate-100 text-slate-600 border border-slate-200/60 shrink-0">
                          {sample.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[11.5px] text-slate-500 flex items-center gap-2">
                      {sample.so_hieu_phoi && (
                        <span>
                          Số phôi: <strong className="text-slate-700 font-medium">{sample.so_hieu_phoi}</strong>
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
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-4 py-2.5 rounded-full bg-white/95 hover:bg-white text-slate-800 font-semibold text-xs sm:text-[13px] border border-slate-200/90 hover:border-amber-300 shadow-[0_8px_25px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.16)] transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95 group"
        title="Nhấn để mở danh sách hồ sơ mẫu thử nghiệm"
      >
        <span className="w-5 h-5 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-200">
          <Sparkles className="w-3.5 h-3.5 fill-amber-500/30 text-amber-500" />
        </span>
        <span className="font-semibold text-slate-700 group-hover:text-slate-900">
          Hồ sơ mẫu test
        </span>
        <span className="px-1.5 py-0.5 text-[10.5px] font-bold rounded-full bg-amber-500 text-white shadow-2xs">
          {currentSamples.length}
        </span>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 ml-0.5" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 ml-0.5" />
        )}
      </button>
    </aside>
  );
}
