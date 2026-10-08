'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import LabelInput from '@/components/LabelInput';
import SecurityCaptchaModal from '@/components/SecurityCaptchaModal';

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
  const [isCaptchaModalOpen, setIsCaptchaModalOpen] = useState(false);

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
    // Chuẩn đặc tả NCTU: Nhập Số hiệu phôi HOẶC Số vào sổ (ít nhất 1 trong 2)
    if (!soHieuPhoi.trim() && !soVaoSo.trim()) {
      newErrors.soHieuPhoi = 'Vui lòng nhập Số hiệu phôi hoặc Số vào sổ';
      newErrors.soVaoSo = 'Vui lòng nhập Số vào sổ hoặc Số hiệu phôi';
      hasError = true;
    }

    setFieldErrors(newErrors);

    if (hasError) {
      return;
    }

    // Nếu chưa xác thực captcha: mở modal xác thực reCAPTCHA ở ngoài
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
      const res = await fetch('/api/tracuu/vanbang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loai_dao_tao: loaiDaoTao,
          ho_ten: hoTen.trim(),
          ngay_sinh: ngaySinh,
          so_hieu_phoi: soHieuPhoi.trim() || undefined,
          so_vao_so: soVaoSo.trim() || undefined,
          recaptcha_token: token,
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
    setHoTen(sample.ho_ten || '');
    setNgaySinh(sample.ngay_sinh || '');
    setSoHieuPhoi(sample.so_hieu_phoi || '');
    setSoVaoSo(sample.so_vao_so || '');
    setFieldErrors({});
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
      className="space-y-2.5 sm:space-y-3"
    >
      {/* LƯỚI 2x2 CÂN ĐỐI HOÀN HẢO CHUẨN APPLE: GỌN GÀNG, Ô NHẬP 68PX THOÁNG ĐÃNG, BO GÓC 18PX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
        {/* Ô 1: Họ tên */}
        <div>
          <LabelInput
            label="Họ và tên"
            placeholder="Ví dụ: NGUYỄN VĂN AN"
            value={hoTen}
            height={68}
            corner={18}
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
            height={68}
            corner={18}
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
            height={68}
            corner={18}
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
            height={68}
            corner={18}
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

      {/* HÀNG NÚT TRA CỨU: RỘNG RÃI, SẠCH SẼ, KHÔNG BỊ RECAPTCHA CHIẾM CHỖ TRONG FORM */}
      <div className="pt-1.5 pb-0 sm:pt-2.5 sm:pb-0 flex justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto min-w-[210px] h-[48px] sm:h-[50px] px-7 rounded-2xl bg-gradient-to-r from-[#142B6F] via-[#1E3A8A] to-[#2563EB] hover:from-[#0F1E4A] hover:to-[#1E3A8A] text-white flex items-center justify-center gap-2.5 text-[15px] sm:text-[15.5px] font-bold shadow-[0_8px_20px_-4px_rgba(20,43,111,0.38)] outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 active:outline-none border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed select-none"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin shrink-0 text-white" strokeWidth={2.4} />
          ) : (
            <Search className="w-5 h-5 transition-transform duration-200 shrink-0" strokeWidth={2.4} />
          )}
          <span>Tra cứu văn bằng</span>
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
