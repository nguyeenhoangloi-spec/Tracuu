import type { Metadata } from 'next';
import './globals.css';
import GlobalRipple from '@/components/GlobalRipple';

export const metadata: Metadata = {
  title: 'HỆ THỐNG TRA CỨU VĂN BẰNG & CHỨNG CHỈ | ĐẠI HỌC NAM CẦN THƠ',
  description:
    'Cổng thông tin xác thực điện tử văn bằng tốt nghiệp, chứng chỉ ứng dụng CNTT và chứng chỉ tiếng Anh VSTEP chính thức của Trường Đại học Nam Cần Thơ (NCTU).',
  icons: {
    icon: 'https://nctu.edu.vn/images/webp/favicon.webp',
  },
  openGraph: {
    title: 'Hệ Thống Tra Cứu Văn Bằng & Chứng Chỉ | Trường Đại học Nam Cần Thơ',
    description: 'Xác thực điện tử văn bằng tốt nghiệp, chứng chỉ CNTT và VSTEP của Đại học Nam Cần Thơ',
    images: ['https://nctu.edu.vn/videos/thumbnail_khuth_4.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/MomoTrustSans-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/MomoTrustSans-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/MomoTrustSans-Semibold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/MomoTrustSans-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-column flex-col justify-between antialiased font-sans">
        <GlobalRipple />
        {children}
      </body>
    </html>
  );
}
