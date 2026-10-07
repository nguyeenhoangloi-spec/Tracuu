'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import LabelInput from '@/components/LabelInput';
import SecurityCaptcha from '@/components/SecurityCaptcha';

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
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaError, setCaptchaError] = useState<string | null>(null);

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

  const [fieldErrors, setFieldErrors] = useState<{ soHieuPhoi?: string; hoTen?: string; ngaySinh?: string }>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setCaptchaError(null);

    let hasError = false;
    const newErrors: { soHieuPhoi?: string } = {};
    if (!soHieuPhoi.trim()) {
      newErrors.soHieuPhoi = 'Vui lòng điền số hiệu phôi';
      hasError = true;
    }
    setFieldErrors(newErrors);

    if (!captchaInput.trim()) {
      setCaptchaError('Vui lòng xác nhận Tôi không phải là người máy');
      hasError = true;
    }

    if (hasError) {
      return;
    }

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
    setCaptchaError(null);
    setFieldErrors({});
    setError(null);
  };

  React.useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      handleReset();
    }
  }, [resetTrigger]);

  const handleApplySample = (sample: any) => {
    if (sample.cap_do) setCapDo(sample.cap_do);
    if (sample.so_hieu_phoi) setSoHieuPhoi(sample.so_hieu_phoi);
    if (sample.so_vao_so) setSoVaoSo(sample.so_vao_so);
    if (sample.ho_ten) setHoTen(sample.ho_ten);
    if (sample.ngay_sinh) setNgaySinh(sample.ngay_sinh);
    if (captchaCode) setCaptchaInput(captchaCode);
    setFieldErrors({});
    setCaptchaError(null);
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
      className="space-y-3 sm:space-y-3.5"
    >
      {/* Bộ chuyển đổi Cấp độ: CNTT Cơ bản vs CNTT Nâng cao chuẩn Apple Segmented Control */}
      <div className="w-full max-w-sm mx-auto p-1 bg-slate-100/90 rounded-2xl flex items-center gap-1 mb-2">
        <button
          type="button"
          onClick={() => {
            setCapDo('coban');
            onCapDoChange?.('coban');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-200 outline-none focus:outline-none border-0 cursor-pointer ${
            capDo === 'coban'
              ? 'bg-white text-[#0369A1] shadow-xs scale-[1.01]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          CNTT Cơ bản
        </button>
        <button
          type="button"
          onClick={() => {
            setCapDo('nangcao');
            onCapDoChange?.('nangcao');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-200 outline-none focus:outline-none border-0 cursor-pointer ${
            capDo === 'nangcao'
              ? 'bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white shadow-xs scale-[1.01]'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          CNTT Nâng cao
        </button>
      </div>

      {/* LƯỚI 2x2 CÂN ĐỐI CHUẨN APPLE: Ô NHẬP TO RỘNG 60PX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {/* Ô 1: Số hiệu phôi (Bắt buộc) */}
        <div>
          <LabelInput
            label="Số hiệu phôi"
            placeholder={capDo === 'nangcao' ? 'Ví dụ: NC-452109' : 'Ví dụ: 001300, CB-982145'}
            value={soHieuPhoi}
            height={60}
            corner={16}
            onChange={(e) => {
              setSoHieuPhoi(e.target.value.toUpperCase());
              if (fieldErrors.soHieuPhoi) setFieldErrors((prev) => ({ ...prev, soHieuPhoi: undefined }));
            }}
            error={fieldErrors.soHieuPhoi}
            required
          />
        </div>

        {/* Ô 2: Số vào sổ hoặc Số CCCD (Tùy chọn) */}
        <div>
          <LabelInput
            label="Số vào sổ / CCCD (Tùy chọn)"
            placeholder="Ví dụ: NCTU-CNTT-2023/142 hoặc 092..."
            value={soVaoSo}
            height={60}
            corner={16}
            onChange={(e) => setSoVaoSo(e.target.value)}
          />
        </div>

        {/* Ô 3: Họ tên (Tùy chọn) */}
        <div>
          <LabelInput
            label="Họ và tên (Tùy chọn)"
            placeholder="Ví dụ: NGUYỄN THỊ NGỌC CHÂU"
            value={hoTen}
            height={60}
            corner={16}
            onChange={(e) => {
              setHoTen(e.target.value);
              if (fieldErrors.hoTen) setFieldErrors((prev) => ({ ...prev, hoTen: undefined }));
            }}
            error={fieldErrors.hoTen}
          />
        </div>

        {/* Ô 4: Ngày sinh (Tùy chọn) */}
        <div>
          <LabelInput
            label="Ngày sinh (Tùy chọn)"
            type="date"
            placeholder="dd/mm/yyyy"
            height={60}
            corner={16}
            value={ngaySinh}
            onChange={(e) => {
              setNgaySinh(e.target.value);
              if (fieldErrors.ngaySinh) setFieldErrors((prev) => ({ ...prev, ngaySinh: undefined }));
            }}
            error={fieldErrors.ngaySinh}
          />
        </div>
      </div>

      {/* HÀNG XÁC THỰC VÀ NÚT BẤM: LUÔN CỐ ĐỊNH, KHÔNG BAO GIỜ NHẢY KHUNG HAY ĐẨY NỀN XANH */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="shrink-0">
          <SecurityCaptcha
            id="captcha-cntt"
            captchaInput={captchaInput}
            onCaptchaInputChange={(val) => {
              setCaptchaInput(val);
              if (captchaError) setCaptchaError(null);
            }}
            onCaptchaCodeGenerated={setCaptchaCode}
            captchaError={captchaError || undefined}
            resetTrigger={resetTrigger}
          />
        </div>

        <div className="flex-1 flex justify-end">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full sm:w-auto min-w-[200px] h-[54px] sm:h-[60px] px-6 sm:px-7 rounded-2xl text-white flex items-center justify-center gap-2.5 text-[15px] sm:text-[15.5px] font-bold outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 active:outline-none border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed select-none ${
              capDo === 'nangcao'
                ? 'bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#14B8A6] hover:from-[#042F2E] hover:to-[#0F766E] shadow-[0_8px_20px_-4px_rgba(13,148,136,0.38)]'
                : 'bg-gradient-to-r from-[#0369A1] via-[#0284C7] to-[#0EA5E9] hover:from-[#075985] hover:to-[#0284C7] shadow-[0_8px_20px_-4px_rgba(2,132,199,0.38)]'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin shrink-0 text-white" strokeWidth={2.4} />
            ) : (
              <Search className="w-5 h-5 transition-transform duration-200 shrink-0" strokeWidth={2.4} />
            )}
            <span>Tra cứu CNTT {capDo === 'nangcao' ? 'Nâng cao' : 'Cơ bản'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
