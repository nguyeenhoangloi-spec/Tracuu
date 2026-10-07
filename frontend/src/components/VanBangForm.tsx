'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import LabelInput from '@/components/LabelInput';
import SecurityCaptcha from '@/components/SecurityCaptcha';

interface VanBangFormProps {
  onSuccess: (data: any) => void;
  onNotFound?: (data: { query: any; message?: string }) => void;
  onLoading?: (isLoading: boolean) => void;
  sampleData?: any[];
  resetTrigger?: number;
  sampleToApply?: any;
  initialSoHieuPhoi?: string;
  initialLoaiDaoTao?: string;
}

export default function VanBangForm({
  onSuccess,
  onNotFound,
  onLoading,
  sampleData,
  resetTrigger,
  sampleToApply,
  initialSoHieuPhoi,
  initialLoaiDaoTao,
}: VanBangFormProps) {
  const [loaiDaoTao, setLoaiDaoTao] = useState(initialLoaiDaoTao || 'dh');
  const [hoTen, setHoTen] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [soHieuPhoi, setSoHieuPhoi] = useState(initialSoHieuPhoi || '');
  const [soVaoSo, setSoVaoSo] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialLoaiDaoTao) {
      setLoaiDaoTao(initialLoaiDaoTao);
    }
  }, [initialLoaiDaoTao]);

  React.useEffect(() => {
    if (initialSoHieuPhoi) {
      setSoHieuPhoi(initialSoHieuPhoi);
    }
  }, [initialSoHieuPhoi]);

  const [fieldErrors, setFieldErrors] = useState<{
    hoTen?: string;
    ngaySinh?: string;
    soHieuPhoi?: string;
    soVaoSo?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setCaptchaError(null);

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
      const res = await fetch('/api/tracuu/vanbang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loai_dao_tao: loaiDaoTao,
          ho_ten: hoTen.trim(),
          ngay_sinh: ngaySinh,
          so_hieu_phoi: soHieuPhoi.trim() || undefined,
          so_vao_so: soVaoSo.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Không tìm thấy hồ sơ văn bằng phù hợp.');
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
      let errMsg = err.message || 'Không tìm thấy thông tin văn bằng phù hợp. Vui lòng kiểm tra lại Họ tên, Ngày sinh hoặc Số hiệu phôi.';
      if (errMsg.includes('Failed to fetch') || errMsg.includes('fetch')) {
        errMsg = 'Không tìm thấy thông tin văn bằng phù hợp. Vui lòng kiểm tra lại Họ tên, Ngày sinh hoặc Số hiệu phôi.';
      }
      if (onNotFound) {
        onNotFound({
          query: {
            hoTen: hoTen.trim(),
            ngaySinh,
            soHieuPhoi: soHieuPhoi.trim() || undefined,
            soVaoSo: soVaoSo.trim() || undefined,
            loaiDaoTao,
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
    setLoaiDaoTao('dh');
    setHoTen('');
    setNgaySinh('');
    setSoHieuPhoi('');
    setSoVaoSo('');
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
    if (sample.loai_dao_tao) setLoaiDaoTao(sample.loai_dao_tao);
    if (sample.ho_ten) setHoTen(sample.ho_ten);
    if (sample.ngay_sinh) setNgaySinh(sample.ngay_sinh);
    if (sample.so_hieu_phoi) setSoHieuPhoi(sample.so_hieu_phoi);
    if (sample.so_vao_so) setSoVaoSo(sample.so_vao_so);
    if (captchaCode) setCaptchaInput(captchaCode);
    setFieldErrors({});
    setCaptchaError(null);
    setError(null);
  };

  React.useEffect(() => {
    if (sampleToApply && (sampleToApply.tab === 'vanbang' || !sampleToApply.tab) && sampleToApply.data) {
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
      {/* LƯỚI 2x2 CÂN ĐỐI HOÀN HẢO CHUẨN APPLE: GỌN GÀNG, Ô NHẬP TO RỘNG 66PX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {/* Ô 1: Họ tên */}
        <div>
          <LabelInput
            label="Họ và tên"
            placeholder="Ví dụ: NGUYỄN VĂN AN"
            value={hoTen}
            height={60}
            corner={16}
            onChange={(e) => {
              setHoTen(e.target.value);
              if (fieldErrors.hoTen) {
                setFieldErrors((prev) => ({ ...prev, hoTen: undefined }));
              }
            }}
            error={fieldErrors.hoTen}
            required
          />
        </div>

        {/* Ô 2: Ngày sinh */}
        <div>
          <LabelInput
            label="Ngày sinh"
            type="date"
            placeholder="dd/mm/yyyy"
            height={60}
            corner={16}
            required
            value={ngaySinh}
            onChange={(e) => {
              setNgaySinh(e.target.value);
              if (fieldErrors.ngaySinh) {
                setFieldErrors((prev) => ({ ...prev, ngaySinh: undefined }));
              }
            }}
            error={fieldErrors.ngaySinh}
          />
        </div>

        {/* Ô 3: Số hiệu phôi */}
        <div>
          <LabelInput
            label="Số hiệu phôi"
            placeholder="Ví dụ: B6829104"
            value={soHieuPhoi}
            height={60}
            corner={16}
            onChange={(e) => {
              setSoHieuPhoi(e.target.value.toUpperCase());
              if (fieldErrors.soHieuPhoi) {
                setFieldErrors((prev) => ({ ...prev, soHieuPhoi: undefined }));
              }
            }}
            error={fieldErrors.soHieuPhoi}
            required
          />
        </div>

        {/* Ô 4: Số vào sổ cấp bằng */}
        <div>
          <LabelInput
            label="Số vào sổ"
            placeholder="Ví dụ: NCTU-CNTT-2023/142"
            value={soVaoSo}
            height={60}
            corner={16}
            onChange={(e) => {
              setSoVaoSo(e.target.value);
              if (fieldErrors.soVaoSo) {
                setFieldErrors((prev) => ({ ...prev, soVaoSo: undefined }));
              }
            }}
            error={fieldErrors.soVaoSo}
            required
          />
        </div>
      </div>

      {/* HÀNG XÁC THỰC RECAPTCHA VÀ NÚT TRA CỨU: LUÔN CỐ ĐỊNH, KHÔNG BAO GIỜ NHẢY KHUNG HAY ĐẨY NỀN XANH */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        {/* reCAPTCHA chuẩn Google */}
        <div className="shrink-0">
          <SecurityCaptcha
            id="captcha-vanbang"
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

        {/* Nút hành động chính chuẩn Apple Royal Navy, không viền cộm, không ring dính */}
        <div className="flex-1 flex justify-end">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto min-w-[200px] h-[54px] sm:h-[60px] px-6 sm:px-7 rounded-2xl bg-gradient-to-r from-[#142B6F] via-[#1E3A8A] to-[#2563EB] hover:from-[#0F1E4A] hover:to-[#1E3A8A] text-white flex items-center justify-center gap-2.5 text-[15px] sm:text-[15.5px] font-bold shadow-[0_8px_20px_-4px_rgba(20,43,111,0.38)] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 active:outline-none border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed select-none"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin shrink-0 text-white" strokeWidth={2.4} />
            ) : (
              <Search className="w-5 h-5 transition-transform duration-200 shrink-0" strokeWidth={2.4} />
            )}
            <span>Tra cứu văn bằng</span>
          </button>
        </div>
      </div>
    </form>
  );
}
