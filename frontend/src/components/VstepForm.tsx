'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import LabelInput from '@/components/LabelInput';
import SecurityCaptcha from '@/components/SecurityCaptcha';

interface VstepFormProps {
  onSuccess: (data: any) => void;
  onNotFound?: (data: { query: any; message?: string }) => void;
  onLoading?: (isLoading: boolean) => void;
  sampleData?: any[];
  resetTrigger?: number;
  sampleToApply?: any;
  initialSoHieuPhoi?: string;
}

export default function VstepForm({
  onSuccess,
  onNotFound,
  onLoading,
  sampleData,
  resetTrigger,
  sampleToApply,
  initialSoHieuPhoi,
}: VstepFormProps) {
  const [soHieuPhoi, setSoHieuPhoi] = useState(initialSoHieuPhoi || '');
  const [soBaoDanh, setSoBaoDanh] = useState('');
  const [hoTen, setHoTen] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaError, setCaptchaError] = useState<string | null>(null);

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
    if (!soHieuPhoi.trim() && !soBaoDanh.trim()) {
      newErrors.soHieuPhoi = 'Vui lòng điền số hiệu phôi hoặc số báo danh';
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
      const res = await fetch('/api/tracuu/vstep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          so_hieu_phoi: soHieuPhoi.trim() || soBaoDanh.trim(),
          ho_ten: hoTen.trim() || undefined,
          ngay_sinh: ngaySinh || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Không tìm thấy thông tin chứng chỉ VSTEP.');
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
      let errMsg = err.message || 'Không tìm thấy thông tin chứng chỉ VSTEP. Vui lòng kiểm tra lại Họ tên, Ngày sinh hoặc Số hiệu phôi.';
      if (errMsg.includes('Failed to fetch') || errMsg.includes('fetch')) {
        errMsg = 'Không tìm thấy thông tin chứng chỉ VSTEP. Vui lòng kiểm tra lại Họ tên, Ngày sinh hoặc Số hiệu phôi.';
      }
      if (onNotFound) {
        onNotFound({
          query: {
            soHieuPhoi: soHieuPhoi.trim() || soBaoDanh.trim(),
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
    setSoHieuPhoi('');
    setSoBaoDanh('');
    setHoTen('');
    setNgaySinh('');
    setCaptchaInput('');
    setFieldErrors({});
    setError(null);
    setCaptchaError(null);
  };

  React.useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      handleReset();
    }
  }, [resetTrigger]);

  const handleApplySample = (sample: any) => {
    if (sample.so_hieu_phoi) setSoHieuPhoi(sample.so_hieu_phoi);
    if (sample.so_bao_danh) setSoBaoDanh(sample.so_bao_danh);
    if (sample.ho_ten) setHoTen(sample.ho_ten);
    if (sample.ngay_sinh) setNgaySinh(sample.ngay_sinh);
    if (captchaCode) setCaptchaInput(captchaCode);
    setFieldErrors({});
    setCaptchaError(null);
    setError(null);
  };

  React.useEffect(() => {
    if (sampleToApply && (sampleToApply.tab === 'vstep' || !sampleToApply.tab) && sampleToApply.data) {
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
      {/* LƯỚI 2x2 CÂN ĐỐI CHUẨN APPLE: Ô NHẬP TO RỘNG 66PX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {/* Ô 1: Số hiệu phôi */}
        <div>
          <LabelInput
            label="Số hiệu phôi"
            placeholder="Ví dụ: VSTEP-881923"
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

        {/* Ô 2: Số báo danh */}
        <div>
          <LabelInput
            label="Số báo danh (Nếu có)"
            placeholder="Ví dụ: B2-0192"
            value={soBaoDanh}
            height={60}
            corner={16}
            onChange={(e) => {
              setSoBaoDanh(e.target.value.toUpperCase());
            }}
          />
        </div>

        {/* Ô 3: Họ tên */}
        <div>
          <LabelInput
            label="Họ và tên (Tùy chọn)"
            placeholder="Ví dụ: NGUYỄN VĂN AN"
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

        {/* Ô 4: Ngày sinh */}
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
            id="captcha-vstep"
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
            className="w-full sm:w-auto min-w-[200px] h-[54px] sm:h-[60px] px-6 sm:px-7 rounded-2xl bg-gradient-to-r from-[#9F1239] via-[#BE123C] to-[#E11D48] hover:from-[#881337] hover:to-[#BE123C] text-white flex items-center justify-center gap-2.5 text-[15px] sm:text-[15.5px] font-bold shadow-[0_8px_20px_-4px_rgba(225,29,72,0.38)] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 active:outline-none border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed select-none"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin shrink-0 text-white" strokeWidth={2.4} />
            ) : (
              <Search className="w-5 h-5 transition-transform duration-200 shrink-0" strokeWidth={2.4} />
            )}
            <span>Tra cứu chứng chỉ VSTEP</span>
          </button>
        </div>
      </div>
    </form>
  );
}
