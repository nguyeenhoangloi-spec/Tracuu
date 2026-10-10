'use client';

import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

/**
 * 1. Bằng Đại học: Mũ cử nhân tốt nghiệp đại học truyền thống
 */
export function IconDaiHoc({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Đỉnh mũ cử nhân hình thoi */}
      <polygon points="12 2.5 22 7.5 12 12.5 2 7.5" />
      {/* Vòng đội đầu */}
      <path d="M6 10.5v5c0 2.2 2.7 4 6 4s6-1.8 6-4v-5" />
      {/* Dây tua rua buông xuống */}
      <path d="M22 7.5v8" />
      <circle cx="22" cy="17" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * 2. Bằng Thạc sĩ: Cuộn văn bằng sau đại học buộc ruy băng & con dấu học vị danh giá
 */
export function IconThacSi({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Tấm bằng văn bằng thạc sĩ */}
      <rect x="4" y="3" width="16" height="18" rx="2" />
      {/* Con dấu nơ thạc sĩ danh dự */}
      <circle cx="12" cy="10.5" r="3" />
      <path d="M10.2 13.2L8.5 18l3.5-1.5 3.5 1.5-1.7-4.8" />
      {/* Hàng chữ danh vị học thuật */}
      <path d="M8 6.5h8" />
    </svg>
  );
}

/**
 * 3. Bằng Tiến sĩ: Mũ Tiến sĩ học thuật (Doctoral Tam) với Ngôi sao học vị tối cao
 * Thay thế hoàn toàn vương miện không phù hợp!
 */
export function IconTienSi({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Mũ Tiến sĩ học thuật hàn lâm */}
      <polygon points="12 2.5 22 7.5 12 12.5 2 7.5" />
      <path d="M6 10.5v5c0 2.2 2.7 4 6 4s6-1.8 6-4v-5" />
      <path d="M22 7.5v8" />
      <circle cx="22" cy="17" r="1.5" fill="currentColor" />
      {/* Ngôi sao danh vị Tiến sĩ (Đỉnh cao học thuật) */}
      <polygon
        points="12 6.2 12.6 7.5 14 7.7 13 8.7 13.2 10.1 12 9.4 10.8 10.1 11 8.7 10 7.7 11.4 7.5"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/**
 * 4. CNTT Cơ bản: Máy tính để bàn hiển thị tài liệu văn phòng cơ bản
 */
export function IconCnttCoBan({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Màn hình máy tính */}
      <rect x="2" y="3" width="20" height="13" rx="2" />
      <path d="M12 16v5" />
      <path d="M8 21h8" />
      {/* Dòng tài liệu tin học văn phòng */}
      <path d="M6 7.5h5" />
      <path d="M6 10.5h8" />
      <circle cx="16" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * 5. CNTT Nâng cao: Máy tính xử lý chuyên sâu với ký hiệu code & logic </>
 */
export function IconCnttNangCao({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Màn hình máy tính */}
      <rect x="2" y="3" width="20" height="13" rx="2" />
      <path d="M12 16v5" />
      <path d="M8 21h8" />
      {/* Ký hiệu code / logic nâng cao </> */}
      <path d="M8 7.5l-2.5 2 2.5 2" />
      <path d="M16 7.5l2.5 2-2.5 2" />
      <path d="M13 6.5l-2 6" />
    </svg>
  );
}

/**
 * 6. Chứng chỉ VSTEP: Quả cầu thế giới & dải ruy băng chứng nhận năng lực tiếng Anh
 */
export function IconVstep({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Quả cầu ngôn ngữ quốc tế */}
      <circle cx="12" cy="10" r="7.5" />
      <path d="M4.5 10h15" />
      <path d="M12 2.5a12 12 0 0 0 0 15" />
      <path d="M12 2.5a12 12 0 0 1 0 15" />
      {/* Dải nơ chứng chỉ VSTEP chuẩn mực */}
      <path d="M8.5 16.5l-1.5 5 5-2 5 2-1.5-5" />
    </svg>
  );
}

/**
 * 7. Bằng Cao đẳng: Cuộn văn bằng đào tạo thực hành chính quy
 */
export function IconCaoDang({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Cuốn văn bằng cao đẳng chính quy */}
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      {/* Mũ học thuật trên trang bằng */}
      <polygon points="12 6.5 16.5 9 12 11.5 7.5 9" />
      <path d="M9.5 10.2v2.3c0 .8 1.1 1.5 2.5 1.5s2.5-.7 2.5-1.5v-2.3" />
      <path d="M16.5 9v3.5" />
    </svg>
  );
}
