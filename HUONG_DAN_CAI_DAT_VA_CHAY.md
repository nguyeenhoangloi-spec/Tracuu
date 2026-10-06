# HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY DỰ ÁN TỪ A-Z
## HỆ THỐNG TRA CỨU VĂN BẰNG & CHỨNG CHỈ ĐIỆN TỬ - ĐH NAM CẦN THƠ (NCTU)

Tài liệu này hướng dẫn chi tiết dành cho bất kỳ ai (lập trình viên, người kiểm thử hoặc người mới) vừa clone hoặc tải mã nguồn dự án về máy tính để có thể cài đặt và khởi chạy hệ thống thành công 100%.

---

## 📋 1. YÊU CẦU MÔI TRƯỜNG (PREREQUISITES)

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:
- **Node.js**: Phiên bản **>= 18.x** (khuyến nghị Node 20 LTS).  
  *Kiểm tra:* Mở terminal gõ `node -v`
- **npm**: Đi kèm với Node.js (phiên bản >= 9.x).  
  *Kiểm tra:* `npm -v`
- **Git**: Dùng để clone mã nguồn và quản lý phiên bản.  
  *Kiểm tra:* `git --version`

---

## 🚀 2. CÁCH 1: KHỞI CHẠY SIÊU NHANH BẰNG 1-CLICK (KHUYẾN NGHỊ TRÊN WINDOWS)

Dự án đã tích hợp sẵn tệp khởi động tự động thông minh `start.bat` ở thư mục gốc:

1. Mở thư mục dự án trên Windows Explorer.
2. Nhấp đúp chuột (Double click) vào tệp **`start.bat`**.
3. Tệp sẽ:
   - Tự động kiểm tra và cài đặt `npm install` nếu máy bạn chưa có thư viện.
   - Tự động biên dịch mã nguồn Backend nếu chưa có bản build.
   - Bật đồng thời 2 cửa sổ chạy **NestJS Backend (Port 3001)** và **Next.js Frontend (Port 3000)**.
4. Mở trình duyệt truy cập: **`http://localhost:3000`**

---

## 🛠️ 3. CÁCH 2: CÀI ĐẶT VÀ CHẠY THỦ CÔNG QUA DÒNG LỆNH (TERMINAL)

Nếu bạn muốn chạy từng bước trên Terminal (VS Code / Antigravity IDE / PowerShell / Git Bash / macOS / Linux), hãy làm theo các bước sau:

### Bước 1: Clone mã nguồn về máy
```bash
git clone https://github.com/nguyeenhoangloi-spec/Tracuu.git
cd Tracuu
```

---

### Bước 2: Cài đặt & Khởi động Backend (NestJS)

Mở **Terminal thứ nhất** tại thư mục gốc của dự án:

```bash
# 1. Đi vào thư mục backend
cd backend

# 2. Cài đặt các gói thư viện
npm install

# 3. Biên dịch mã nguồn TypeScript
npm run build

# 4. Khởi chạy Backend
npm run start
# (Hoặc nếu đang phát triển tính năng, bạn có thể chạy: npm run start:dev)
```

> ✅ Khi Backend khởi động thành công, bạn sẽ thấy thông báo:  
> `Nest application successfully started` và lắng nghe tại cổng `http://localhost:3001`.

---

### Bước 3: Cài đặt & Khởi động Frontend (Next.js)

Mở **Terminal thứ hai** tại thư mục gốc của dự án:

```bash
# 1. Đi vào thư mục frontend
cd frontend

# 2. Cài đặt các gói thư viện
npm install

# 3. Khởi chạy máy chủ giao diện Next.js
npm run dev
```

> ✅ Khi Frontend khởi động thành công, bạn sẽ thấy:  
> `- Local: http://localhost:3000`

---

## 🌐 4. TRUY CẬP VÀ KIỂM TRA HỆ THỐNG

| Dịch vụ | Địa chỉ URL | Chức năng chính |
| :--- | :--- | :--- |
| **Giao diện người dùng (Frontend)** | [http://localhost:3000](http://localhost:3000) | Cổng tra cứu tra thông tin, hiển thị phôi chứng nhận điện tử, QR Code, in ấn A4 |
| **Máy chủ API (Backend)** | [http://localhost:3001/api](http://localhost:3001/api) | Xử lý nghiệp vụ tra cứu, xác thực phôi văn bằng, cấp dữ liệu mẫu |

---

## 🎯 5. DỮ LIỆU MẪU ĐỂ TEST HỆ THỐNG (TEST DATA)

Trên giao diện web đã có sẵn widget **"Thử nhanh với dữ liệu mẫu"**. Bạn có thể bấm chọn để hệ thống tự điền, hoặc nhập thủ công các thông tin sau:

### 1. Phân hệ Văn bằng Tốt nghiệp (Đại học / Sau đại học)
- **Mẫu 1:**
  - Họ tên: `Nguyễn Văn An`
  - Ngày sinh: `15/05/2001`
  - Bậc đào tạo: `Bằng Đại học`
  - *Kết quả:* Bằng ĐH Chính quy ngành Công nghệ thông tin, Loại Giỏi.
- **Mẫu 2:**
  - Họ tên: `Trần Thị Ngọc Mai`
  - Ngày sinh: `20/11/2002`
  - Bậc đào tạo: `Bằng Đại học`
  - *Kết quả:* Bằng ĐH Chính quy ngành Dược học, Loại Xuất sắc.
- **Mẫu 3:**
  - Họ tên: `Phạm Minh Đức`
  - Ngày sinh: `25/03/1995`
  - Bậc đào tạo: `Bằng Thạc sĩ`
  - *Kết quả:* Thạc sĩ Quản lý kinh tế.

### 2. Phân hệ Chứng chỉ Tin học CNTT
- **Cơ bản:** Số hiệu phôi: `CB-982145` (Nguyễn Văn An - 8.75 điểm).
- **Nâng cao:** Số hiệu phôi: `NC-452109` (Trần Thị Ngọc Mai - 9.25 điểm).

### 3. Phân hệ Chứng chỉ Tiếng Anh VSTEP
- **Bậc 4 (B2):** Số hiệu phôi: `VSTEP-881923` (Nguyễn Văn An - Điểm quy đổi: 6.5).
- **Bậc 3 (B1):** Số hiệu phôi: `VSTEP-772019` (Lê Hoàng Nam - Điểm quy đổi: 5.5).

---

## 📁 6. CẤU TRÚC THƯ MỤC CHÍNH CỦA DỰ ÁN

```text
TraCuu/
├── backend/                       # Source code Backend (NestJS 10)
│   ├── src/
│   │   ├── lookup/               # Module xử lý logic tra cứu & DB giả lập
│   │   │   ├── lookup.controller.ts
│   │   │   ├── lookup.service.ts
│   │   │   └── lookup.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts               # Điểm khởi chạy NestJS (Port 3001)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      # Source code Frontend (Next.js 14 App Router)
│   ├── public/                   # Tài nguyên ảnh trường NCTU, logo, font MomoTrustSans
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css       # CSS toàn cục & hiệu ứng Guilloche bảo an
│   │   │   ├── layout.tsx        # Cấu hình SEO, Head, Fonts
│   │   │   └── page.tsx          # Trang chủ tra cứu tích hợp 3 phân hệ
│   │   └── components/
│   │       ├── CertificateCard.tsx    # Thẻ phôi chứng chỉ điện tử chuẩn in A4 + QR
│   │       ├── VanBangForm.tsx        # Form tra cứu văn bằng tốt nghiệp
│   │       ├── CnttForm.tsx           # Form tra cứu CNTT
│   │       ├── VstepForm.tsx          # Form tra cứu tiếng Anh VSTEP
│   │       ├── QuickSampleWidget.tsx  # Widget nạp dữ liệu mẫu nhanh
│   │       ├── SecurityCaptcha.tsx    # Mã kiểm tra bảo mật
│   │       └── Footer.tsx             # Chân trang thông tin 3 đơn vị NCTU
│   ├── tailwind.config.ts
│   └── package.json
│
├── .gitignore                     # Cấu hình loại trừ thư viện, tệp cache build
├── start.bat                      # Script 1-click tự động chạy cả 2 dịch vụ
├── HUONG_DAN_CAI_DAT_VA_CHAY.md  # Tệp hướng dẫn này
└── README.md                      # Giới thiệu tổng quan dự án
```

---

## ❓ 7. XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

1. **Lỗi: `Cannot find module 'dist/main.js'` khi chạy Backend:**
   - **Nguyên nhân:** Thư mục `dist` chưa được biên dịch từ TypeScript.
   - **Cách khắc phục:** Chạy lệnh `npm run build` trong thư mục `backend`.

2. **Lỗi: `Port 3000 hoặc 3001 already in use`:**
   - **Nguyên nhân:** Đang có một tiến trình khác chiếm cổng 3000 hoặc 3001.
   - **Cách khắc phục:** Tắt tiến trình cũ hoặc dùng lệnh sau trên PowerShell:
     ```powershell
     Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
     Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force
     ```

3. **Giao diện không gọi được API Backend (báo lỗi kết nối mạng):**
   - Đảm bảo cửa sổ terminal của `backend` vẫn đang chạy và hiển thị port `3001`.
   - Mở thử đường dẫn [http://localhost:3001/api/tracuu/stats](http://localhost:3001/api/tracuu/stats) trên trình duyệt, nếu trả về JSON là Backend hoạt động bình thường.

---
*Chúc bạn cài đặt và trải nghiệm hệ thống thành công!*
