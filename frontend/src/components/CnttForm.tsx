'use client';

import React, { useState } from 'react';
import { Search, RotateCcw, Check, Sparkles, AlertCircle, Loader2, X } from 'lucide-react';
import LabelInput from '@/components/LabelInput';
import SecurityCaptcha from '@/components/SecurityCaptcha';

interface CnttFormProps {
  onSuccess: (data: any) => void;
  onNotFound?: (data: { query: any; message?: string }) => void;
  onLoading?: (isLoading: boolean) => void;
  sampleData?: any[];
  resetTrigger?: number;
  sampleToApply?: any;
}

export default function CnttForm({
  onSuccess,
  onNotFound,
  onLoading,
  sampleData,
  resetTrigger,
  sampleToApply,
}: CnttFormProps) {
  const [capDo, setCapDo] = useState<'coban' | 'nangcao'>('coban');
  const [soHieuPhoi, setSoHieuPhoi] = useState('');
  const [hoTen, setHoTen] = useState('');
  const [ngaySinh, setNgaySinh] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ soHieuPhoi?: string; hoTen?: string; ngaySinh?: string }>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setCaptchaError(null);

    let hasError = false;
    const newErrors: { soHieuPhoi?: string; hoTen?: string; ngaySinh?: string } = {};
    if (!soHieuPhoi.trim()) {
      newErrors.soHieuPhoi = 'Vui lòng điền số hiệu phôi';
      hasError = true;
    }
    if (!hoTen.trim()) {
      newErrors.hoTen = 'Vui lòng điền họ tên';
      hasError = true;
    }
    if (!ngaySinh) {
      newErrors.ngaySinh = 'Vui lòng điền ngày sinh';
      hasError = true;
    }
    setFieldErrors(newErrors);

    if (!captchaInput.trim()) {
      setCaptchaError('Vui lòng nhập mã bảo vệ');
      hasError = true;
    } else if (captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setCaptchaError('Mã bảo vệ không chính xác. Vui lòng nhập lại');
      setCaptchaInput('');
      hasError = true;
    }

    if (!confirmed) {
      setShowValidation(true);
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
          ho_ten: hoTen.trim(),
          ngay_sinh: ngaySinh,
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
    setHoTen('');
    setNgaySinh('');
    setConfirmed(false);
    setCaptchaInput('');
    setCaptchaError(null);
    setShowValidation(false);
    setFieldErrors({});
    setError(null);
  };

  // Lắng nghe tín hiệu làm mới biểu mẫu từ header, thu hồi lỗi mượt mà
  React.useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      handleReset();
    }
  }, [resetTrigger]);

  const DEFAULT_SAMPLES = [
    {
      label: 'Nguyễn Thị Ngọc Châu (Phôi: 001300)',
      so_hieu_phoi: '001300',
      ho_ten: 'Nguyễn Thị Ngọc Châu',
      ngay_sinh: '2001-12-03',
      cap_do: 'coban',
    },
    {
      label: 'Nguyễn Văn An (CB-982145)',
      so_hieu_phoi: 'CB-982145',
      ho_ten: 'Nguyễn Văn An',
      ngay_sinh: '2001-05-15',
      cap_do: 'coban',
    },
    {
      label: 'Trần Thị Ngọc Mai (NC-452109)',
      so_hieu_phoi: 'NC-452109',
      ho_ten: 'Trần Thị Ngọc Mai',
      ngay_sinh: '2002-11-20',
      cap_do: 'nangcao',
    },
  ];

  const samplesToUse = sampleData && sampleData.length > 0 ? sampleData : DEFAULT_SAMPLES;

  const handleApplySample = (sample: any) => {
    if (sample.cap_do) setCapDo(sample.cap_do);
    if (sample.so_hieu_phoi) setSoHieuPhoi(sample.so_hieu_phoi);
    if (sample.ho_ten) setHoTen(sample.ho_ten);
    if (sample.ngay_sinh) setNgaySinh(sample.ngay_sinh);
    setConfirmed(true);
    if (captchaCode) setCaptchaInput(captchaCode);
    setFieldErrors({});
    setCaptchaError(null);
    setError(null);
    setShowValidation(false);
  };

  // Áp dụng dữ liệu mẫu từ Floating Widget bên ngoài
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
      {/* Loại chứng chỉ & Số hiệu phôi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
        <div>
          <LabelInput
            label="Loại chứng chỉ"
            options={[
              {
                value: 'coban',
                label: 'Ứng dụng CNTT Cơ bản',
                desc: 'Chuẩn kỹ năng sử dụng CNTT theo Thông tư 03/2014/TT-BTTTT',
                badge: 'Cơ bản',
              },
              {
                value: 'nangcao',
                label: 'Ứng dụng CNTT Nâng cao',
                desc: 'Module kỹ năng xử lý dữ liệu và công nghệ chuyên sâu',
                badge: 'Nâng cao',
              },
            ]}
            value={capDo}
            onChange={(e) => setCapDo(e.target.value as any)}
          />
        </div>

        <div>
          <LabelInput
            label="Số hiệu phôi"
            placeholder="Ví dụ: 001300, NC-452109"
            value={soHieuPhoi}
            onChange={(e) => {
              setSoHieuPhoi(e.target.value);
              if (fieldErrors.soHieuPhoi) setFieldErrors((prev) => ({ ...prev, soHieuPhoi: undefined }));
            }}
            error={fieldErrors.soHieuPhoi}
            required
          />
        </div>
      </div>

      {/* Họ tên & Ngày sinh (Xác thực 2 lớp chống dò quét) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
        <div>
          <LabelInput
            label="Họ tên"
            placeholder="Ví dụ: Nguyễn Thị Ngọc Châu"
            value={hoTen}
            onChange={(e) => {
              setHoTen(e.target.value);
              if (fieldErrors.hoTen) setFieldErrors((prev) => ({ ...prev, hoTen: undefined }));
            }}
            error={fieldErrors.hoTen}
            required
          />
        </div>

        <div>
          <LabelInput
            label="Ngày sinh"
            type="date"
            placeholder="dd/mm/yyyy"
            value={ngaySinh}
            onChange={(e) => {
              setNgaySinh(e.target.value);
              if (fieldErrors.ngaySinh) setFieldErrors((prev) => ({ ...prev, ngaySinh: undefined }));
            }}
            error={fieldErrors.ngaySinh}
            required
          />
        </div>
      </div>

      {/* Xác thực bảo mật CAPTCHA */}
      <div>
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

      {/* Cụm Cam kết xác nhận & Nút hành động ôm thành 1 hàng */}
      <div className="pt-1.5 pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Checkbox cam kết bên trái */}
          <label
            onClick={() => {
              const nextVal = !confirmed;
              setConfirmed(nextVal);
              if (nextVal) {
                setShowValidation(false);
              }
            }}
            className="checkbox-label-target flex items-center gap-3 cursor-pointer select-none py-1 group transition-all duration-200"
          >
            <div
              data-ripple="rgba(215, 33, 52, 0.24)"
              className="checkbox-ripple-target relative w-9 h-9 -my-2 -mr-2 ml-0 flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 group-hover:bg-red-50/40 transition-colors"
            >
              <div
                className={`w-5 h-5 rounded-[6px] flex items-center justify-center border-2 transition-all duration-200 flex-shrink-0 ${
                  confirmed
                    ? 'bg-[#D72134] border-[#D72134] text-white shadow-2xs shadow-red-500/20 scale-105'
                    : showValidation && !confirmed
                    ? 'border-red-500 bg-red-50/50 animate-pulse ring-2 ring-red-200'
                    : 'border-slate-300 bg-white group-hover:border-slate-400'
                }`}
              >
                {confirmed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
            <span
              className={`text-[13.5px] sm:text-[14px] leading-tight transition-colors ${
                showValidation && !confirmed
                  ? 'text-red-600 font-semibold'
                  : 'text-slate-700 group-hover:text-slate-900 font-medium'
              }`}
            >
              Tôi xác nhận rằng tất cả thông tin trên là đúng sự thật
              <span
                style={{ verticalAlign: '-3px' }}
                className={`text-[13px] text-red-500 font-normal ml-1.5 transition-all duration-200 inline-flex items-center gap-1 ${
                  showValidation && !confirmed
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 -translate-x-1 pointer-events-none'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" strokeWidth={2.4} />
                <span>(Bắt buộc)</span>
              </span>
            </span>
          </label>

          {/* Nút tra cứu chính bên phải */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="btn-submit flex-1 md:flex-none flex items-center justify-center gap-2.5 text-[16px] sm:text-[17px] font-semibold select-none whitespace-nowrap group cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5.5 h-5.5 animate-spin shrink-0 text-white" strokeWidth={2.4} />
            ) : (
              <Search className="w-5.5 h-5.5 group-hover:scale-110 transition-transform duration-200 shrink-0" strokeWidth={2.4} />
            )}
            <span>Tra cứu</span>
          </button>
        </div>
      </div>
    </form>
  );
}
