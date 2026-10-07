'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import LabelInput from '@/components/LabelInput';
import SecurityCaptchaModal from '@/components/SecurityCaptchaModal';

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
  const [isCaptchaModalOpen, setIsCaptchaModalOpen] = useState(false);

  React.useEffect(() => {
    if (initialSoHieuPhoi) {
      setSoHieuPhoi(initialSoHieuPhoi);
    }
  }, [initialSoHieuPhoi]);

  const [fieldErrors, setFieldErrors] = useState<{
    soHieuPhoi?: string;
    soBaoDanh?: string;
    hoTen?: string;
    ngaySinh?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setError(null);

    let hasError = false;
    const newErrors: {
      soHieuPhoi?: string;
      soBaoDanh?: string;
      hoTen?: string;
      ngaySinh?: string;
    } = {};
    if (!hoTen.trim()) {
      newErrors.hoTen = 'Vui lòng điền họ tên';
      hasError = true;
    }
    if (!ngaySinh) {
      newErrors.ngaySinh = 'Vui lòng điền ngày sinh';
      hasError = true;
    }
    if (!soHieuPhoi.trim() && !soBaoDanh.trim()) {
      newErrors.soHieuPhoi = 'Vui lòng điền số hiệu phôi hoặc số báo danh';
      newErrors.soBaoDanh = 'Vui lòng điền số báo danh hoặc số hiệu phôi';
      hasError = true;
    }
    setFieldErrors(newErrors);

    if (hasError) {
      return;
    }

    // Nếu chưa có captcha: mở modal xác thực reCAPTCHA
    if (!captchaInput.trim()) {
      setIsCaptchaModalOpen(true);
      return;
    }

    doSearch(captchaInput);
  };

  const doSearch = async (token: string) => {
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
          recaptcha_token: token,
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
    setFieldErrors({});
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
      className="space-y-2.5 sm:space-y-3"
    >
      {/* LƯỚI 2x2 CÂN ĐỐI CHUẨN APPLE: Ô NHẬP 68PX THOÁNG ĐÃNG, BO GÓC 18PX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
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
              if (fieldErrors.ngaySinh) setFieldErrors((prev) => ({ ...prev, ngaySinh: undefined }));
            }}
            error={fieldErrors.ngaySinh}
          />
        </div>

        {/* Ô 3: Số hiệu phôi */}
        <div>
          <LabelInput
            label="Số hiệu phôi"
            placeholder="Ví dụ: B1-092348"
            value={soHieuPhoi}
            height={68}
            corner={18}
            onChange={(e) => {
              setSoHieuPhoi(e.target.value.toUpperCase());
              if (fieldErrors.soHieuPhoi || fieldErrors.soBaoDanh) {
                setFieldErrors((prev) => ({ ...prev, soHieuPhoi: undefined, soBaoDanh: undefined }));
              }
            }}
            error={fieldErrors.soHieuPhoi}
            required
          />
        </div>

        {/* Ô 4: Số báo danh */}
        <div>
          <LabelInput
            label="Số báo danh"
            placeholder="Ví dụ: B2-0192"
            value={soBaoDanh}
            height={68}
            corner={18}
            onChange={(e) => {
              setSoBaoDanh(e.target.value.toUpperCase());
              if (fieldErrors.soBaoDanh || fieldErrors.soHieuPhoi) {
                setFieldErrors((prev) => ({ ...prev, soBaoDanh: undefined, soHieuPhoi: undefined }));
              }
            }}
            error={fieldErrors.soBaoDanh}
            required
          />
        </div>
      </div>

      {/* HÀNG NÚT TRA CỨU: RỘNG RÃI, SẠCH SẼ, KHÔNG BỊ RECAPTCHA CHIẾM CHỖ TRONG FORM */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto min-w-[210px] h-[50px] sm:h-[52px] px-7 rounded-2xl bg-gradient-to-r from-[#9F1239] via-[#BE123C] to-[#E11D48] hover:from-[#881337] hover:to-[#BE123C] text-white flex items-center justify-center gap-2.5 text-[15px] sm:text-[15.5px] font-bold shadow-[0_8px_20px_-4px_rgba(225,29,72,0.38)] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 active:outline-none border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed select-none"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin shrink-0 text-white" strokeWidth={2.4} />
          ) : (
            <Search className="w-5 h-5 transition-transform duration-200 shrink-0" strokeWidth={2.4} />
          )}
          <span>Tra cứu chứng chỉ VSTEP</span>
        </button>
      </div>

      {/* reCAPTCHA Modal: Chỉ xuất hiện khi người dùng bấm Tra cứu, không chiếm chỗ trong form */}
      <SecurityCaptchaModal
        isOpen={isCaptchaModalOpen}
        onClose={() => setIsCaptchaModalOpen(false)}
        onVerified={(token) => {
          setCaptchaInput(token);
          doSearch(token);
        }}
        resetTrigger={resetTrigger}
      />
    </form>
  );
}
