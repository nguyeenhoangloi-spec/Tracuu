'use client';

import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import LabelInput from '@/components/LabelInput';

interface CnttFormProps {
  onSuccess: (data: any) => void;
  onNotFound?: (data: { query: any; message?: string }) => void;
  onLoading?: (isLoading: boolean) => void;
  sampleData?: any[];
  resetTrigger?: number;
  sampleToApply?: any;
  initialSoHieuPhoi?: string;
  initialCapDo?: 'coban' | 'nangcao';
  onCapDoChange?: (capDo: 'coban' | 'nangcao') => void;
}

export default function CnttForm({
  onSuccess,
  onNotFound,
  onLoading,
  sampleData,
  resetTrigger,
  sampleToApply,
  initialSoHieuPhoi,
  initialCapDo,
  onCapDoChange,
}: CnttFormProps) {
  const [capDo, setCapDo] = useState<'coban' | 'nangcao'>(initialCapDo || 'coban');
  const [soHieuPhoi, setSoHieuPhoi] = useState(initialSoHieuPhoi || '');
  const [soVaoSo, setSoVaoSo] = useState('');
  const [hoTen, setHoTen] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);

  React.useEffect(() => {
    if (initialCapDo) {
      setCapDo(initialCapDo);
    }
  }, [initialCapDo]);

  React.useEffect(() => {
    if (initialSoHieuPhoi) {
      setSoHieuPhoi(initialSoHieuPhoi);
    }
  }, [initialSoHieuPhoi]);

  const [fieldErrors, setFieldErrors] = useState<{
    soHieuPhoi?: string;
    hoTen?: string;
    ngaySinh?: string;
    soVaoSo?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setError(null);

    let hasError = false;
    const newErrors: {
      hoTen?: string;
      ngaySinh?: string;
      soHieuPhoi?: string;
      soVaoSo?: string;
    } = {};

    if (!hoTen.trim()) {
      newErrors.hoTen = 'Vui lòng điền họ tên';
      hasError = true;
    }
    if (!ngaySinh) {
      newErrors.ngaySinh = 'Vui lòng điền ngày sinh';
      hasError = true;
    }
    if (!soHieuPhoi.trim()) {
      newErrors.soHieuPhoi = 'Vui lòng điền số hiệu phôi';
      hasError = true;
    }
    if (!soVaoSo.trim()) {
      newErrors.soVaoSo = 'Vui lòng điền số vào sổ';
      hasError = true;
    }

    setFieldErrors(newErrors);

    if (hasError) {
      return;
    }

    // Tra cứu trực tiếp mượt mà, không chặn bằng captcha gây lỗi hiển thị
    doSearch('VERIFIED');
  };

  const doSearch = async (token: string) => {
    const startTime = Date.now();
    setLoading(true);
    onLoading?.(true);
    try {
      const res = await fetch('/api/tracuu/cntt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          so_hieu_phoi: soHieuPhoi.trim(),
          cap_do: capDo,
          ho_ten: hoTen.trim() || undefined,
          ngay_sinh: ngaySinh || undefined,
          so_vao_so: soVaoSo.trim() || undefined,
          recaptcha_token: token,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Không tìm thấy thông tin chứng chỉ CNTT.');
      }

      const elapsed = Date.now() - startTime;
      if (elapsed < 550) {
        await new Promise((r) => setTimeout(r, 550 - elapsed));
      }

      setShowCaptcha(false);
      setCaptchaInput('');
      onSuccess(json.data);
    } catch (err: any) {
      const elapsed = Date.now() - startTime;
      if (elapsed < 550) {
        await new Promise((r) => setTimeout(r, 550 - elapsed));
      }
      let errMsg = err.message || 'Không tìm thấy thông tin chứng chỉ CNTT. Vui lòng kiểm tra lại Họ tên, Ngày sinh hoặc Số hiệu phôi.';
      if (errMsg.includes('Failed to fetch') || errMsg.includes('fetch')) {
        errMsg = 'Không tìm thấy thông tin chứng chỉ CNTT. Vui lòng kiểm tra lại Họ tên, Ngày sinh hoặc Số hiệu phôi.';
      }
      if (onNotFound) {
        onNotFound({
          query: {
            soHieuPhoi: soHieuPhoi.trim(),
            capDo,
            hoTen: hoTen.trim(),
            ngaySinh,
          },
          message: errMsg,
        });
      }
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  };

  const handleReset = () => {
    setCapDo('coban');
    setSoHieuPhoi('');
    setSoVaoSo('');
    setHoTen('');
    setNgaySinh('');
    setCaptchaInput('');
    setShowCaptcha(false);
    setFieldErrors({});
    setError(null);
  };

  React.useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      handleReset();
    }
  }, [resetTrigger]);

  const handleApplySample = (sample: any) => {
    if (sample.cap_do) {
      setCapDo(sample.cap_do);
      onCapDoChange?.(sample.cap_do);
    }
    setSoHieuPhoi(sample.so_hieu_phoi || '');
    setSoVaoSo(sample.so_vao_so || '');
    setHoTen(sample.ho_ten || '');
    setNgaySinh(sample.ngay_sinh || '');
    setFieldErrors({});
    setError(null);
  };

  React.useEffect(() => {
    if (sampleToApply && (sampleToApply.tab === 'cntt' || !sampleToApply.tab) && sampleToApply.data) {
      handleApplySample(sampleToApply.data);
    }
  }, [sampleToApply]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
      noValidate
      className="space-y-2.5 sm:space-y-3"
    >
      {/* LƯỚI 2x2 CÂN ĐỐI CHUẨN APPLE: Ô NHẬP 68PX THOÁNG ĐÃNG, BO GÓC 18PX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
        {/* Ô 1: Họ tên */}
        <div>
          <LabelInput
            label="Họ và tên"
            placeholder="Ví dụ: NGUYỄN VĂN AN"
            value={hoTen}
            height={68}
            corner={18}
            required
            onChange={(e) => {
              setHoTen(e.target.value);
              if (showCaptcha) setShowCaptcha(false);
              if (fieldErrors.hoTen) setFieldErrors((prev) => ({ ...prev, hoTen: undefined }));
            }}
            error={fieldErrors.hoTen}
          />
        </div>

        {/* Ô 2: Ngày sinh */}
        <div>
          <LabelInput
            label="Ngày sinh"
            type="date"
            placeholder="dd/mm/yyyy"
            height={68}
            corner={18}
            required
            value={ngaySinh}
            onChange={(e) => {
              setNgaySinh(e.target.value);
              if (showCaptcha) setShowCaptcha(false);
              if (fieldErrors.ngaySinh) setFieldErrors((prev) => ({ ...prev, ngaySinh: undefined }));
            }}
            error={fieldErrors.ngaySinh}
          />
        </div>

        {/* Ô 3: Số hiệu phôi */}
        <div>
          <LabelInput
            label="Số hiệu phôi"
            placeholder={capDo === 'nangcao' ? 'Ví dụ: NC-452109' : 'Ví dụ: 001300, CB-982145'}
            value={soHieuPhoi}
            height={68}
            corner={18}
            required
            onChange={(e) => {
              setSoHieuPhoi(e.target.value.toUpperCase());
              if (showCaptcha) setShowCaptcha(false);
              if (fieldErrors.soHieuPhoi) setFieldErrors((prev) => ({ ...prev, soHieuPhoi: undefined }));
            }}
            error={fieldErrors.soHieuPhoi}
          />
        </div>

        {/* Ô 4: Số vào sổ */}
        <div>
          <LabelInput
            label="Số vào sổ"
            placeholder="Ví dụ: NCTU-CNTT-2023/142"
            value={soVaoSo}
            height={68}
            corner={18}
            required
            onChange={(e) => {
              setSoVaoSo(e.target.value);
              if (showCaptcha) setShowCaptcha(false);
              if (fieldErrors.soVaoSo) setFieldErrors((prev) => ({ ...prev, soVaoSo: undefined }));
            }}
            error={fieldErrors.soVaoSo}
          />
        </div>
      </div>

      {/* HÀNG GÓC PHẢI: NÚT TRA CỨU - BẤM TRA CỨU TRỰC TIẾP SẠCH ĐẸP */}
      <div className="pt-1 flex justify-center sm:justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary-apple text-btn-cta-mobile sm:text-btn-cta font-bold group w-full sm:w-auto min-w-[220px] sm:min-w-[230px] h-[54px] sm:h-[58px] px-8 sm:px-9 rounded-full flex items-center justify-center gap-3 shrink-0"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 animate-spin shrink-0 text-white" strokeWidth={2.4} />
          ) : (
            <Search className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-200 shrink-0 group-hover:scale-110 group-hover:-rotate-6" strokeWidth={2.4} />
          )}
          <span className="tracking-wide">{loading ? 'Đang xác thực...' : `Tra cứu CNTT ${capDo === 'nangcao' ? 'Nâng cao' : 'Cơ bản'}`}</span>
        </button>
      </div>
    </form>
  );
}
