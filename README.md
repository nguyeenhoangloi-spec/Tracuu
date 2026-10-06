# 🎓 HỆ THỐNG TRA CỨU VĂN BẰNG & CHỨNG CHỈ ĐIỆN TỬ - ĐH NAM CẦN THƠ (NCTU)

Hệ thống tra cứu và xác thực văn bằng, chứng chỉ được tái thiết kế toàn diện theo kiến trúc hiện đại **Fullstack NestJS (Backend) + Next.js 14 (Frontend)**, thay thế cho giao diện PHP/Bootstrap cũ của `tracuu.nctu.edu.vn`.

---

## 🌟 ĐẶC ĐIỂM NỔI BẬT

1. **All-In-One Unified Portal**: Tích hợp 3 phân hệ trong một giao diện duy nhất, chuyển đổi mượt mà không reload trang:
   - 🎓 **Văn bằng Tốt nghiệp** (Đại học, Cao đẳng, Thạc sĩ, Tiến sĩ)
   - 💻 **Chứng chỉ Tin học CNTT** (Chuẩn Cơ bản & Nâng cao theo Thông tư 03/2014/TT-BTTTT)
   - 🌐 **Chứng chỉ Tiếng Anh VSTEP** (Khung năng lực ngoại ngữ 6 bậc Việt Nam: Bậc 1 đến Bậc 6)
2. **Thẻ Chứng Nhận Điện Tử Chuẩn Quốc Gia (Digital Certificate Card)**:
   - Hoa văn bảo an guilloche viền kép sang trọng chống giả mạo.
   - Dấu mộc số đỏ *"ĐÃ XÁC THỰC BỞI ĐH NAM CẦN THƠ"*.
   - **Mã QR Code động** mã hóa liên kết xác minh nguồn gốc.
   - Nút **"In bản chứng nhận"** (tối ưu chuẩn giấy A4 sắc nét).
   - Nút **"Sao chép liên kết xác thực"** chia sẻ cho nhà tuyển dụng.
3. **Thử nhanh dữ liệu mẫu (Quick-fill)**: Tích hợp sẵn các nút bấm điền dữ liệu mẫu hợp lệ có trong hệ thống để người dùng thử nghiệm tức thì.
4. **Nhận diện chuẩn thương hiệu NCTU**:
   - Logo trường ĐH Nam Cần Thơ chính thức.
   - Bảng màu chuẩn: Đỏ NCTU (`#D72134`), Xanh Navy (`#25359D`), Vàng Gold (`#FFD24B`).
   - Đầy đủ thông tin liên hệ của 3 đơn vị chức năng ở chân trang:
     * *Trung tâm Chuẩn đầu ra và Phát triển nguồn nhân lực* (Khu C, C2-14 - 02923 798 798)
     * *Phòng Quản lý đào tạo* (Khu C, C2-11 - 02923 798 999)
     * *Trung tâm Phát triển & Ứng dụng phần mềm* (Khu I, I1-04 - 02923 851 136)

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG (TECH STACK)

- **Frontend:**
  - Next.js 14 (App Router, Server Components + Client Components)
  - React 18 & TypeScript
  - Tailwind CSS (Thiết kế Responsive, hiệu ứng chuyển động cao cấp)
  - Lucide React (Bộ icon chuẩn hiện đại)
  - QRCode.react (Tạo mã QR xác thực động)
- **Backend:**
  - NestJS 10 (TypeScript, Kiến trúc module Controller/Service tiêu chuẩn)
  - Express Platform
  - RxJS & Reflect-Metadata
  - CORS Middleware kích hoạt sẵn

---

## ⚙️ CẤU HÌNH BIẾN MÔI TRƯỜNG (.ENV)

Hệ thống đã có sẵn các giá trị mặc định tối ưu để chạy ngay lập tức mà không bắt buộc tạo file cấu hình. Tuy nhiên, nếu bạn muốn tùy biến cổng hoặc môi trường triển khai, hãy tạo các file `.env` theo hướng dẫn dưới đây:

### 1. Backend (`backend/.env`)
Tham khảo file mẫu `backend/.env.example`:
```env
# Cổng chạy của máy chủ NestJS (Mặc định: 3001)
PORT=3001

# Môi trường chạy (development | production)
NODE_ENV=development
```

### 2. Frontend (`frontend/.env.local`)
Tham khảo file mẫu `frontend/.env.example`:
```env
# Cổng chạy của máy chủ giao diện Next.js (Mặc định: 3000)
PORT=3000

# Địa chỉ Backend API (Mặc định khi chạy local: http://localhost:3001)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> 💡 **Cơ chế Proxy tự động:**  
> File `frontend/next.config.mjs` đã cấu hình cơ chế `rewrites()` tự động chuyển tiếp tất cả request có tiền tố `/api/tracuu/*` trực tiếp về máy chủ Backend tại `http://127.0.0.1:3001/api/tracuu/*`, giúp tránh lỗi Cross-Origin (CORS) khi chạy local.

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY (QUICK START)

### Cách 1: Khởi chạy 1-Click tự động (Khuyến nghị trên Windows)

1. Mở thư mục dự án và nhấp đúp chuột vào file **`start.bat`**.
2. Kịch bản sẽ tự động:
   - Tự kiểm tra và chạy `npm install` nếu máy bạn chưa cài `node_modules`.
   - Tự chạy `npm run build` cho Backend nếu chưa có bản biên dịch.
   - Bật đồng thời 2 cửa sổ chạy **Backend (3001)** và **Frontend (3000)**.
3. Mở trình duyệt và truy cập: **`http://localhost:3000`**

---

### Cách 2: Khởi chạy thủ công từ Terminal / Dòng lệnh

#### Bước 1: Khởi động Backend (NestJS)
Mở một cửa sổ Terminal mới:
```bash
cd backend
npm install       # Cài đặt thư viện (chỉ cần chạy lần đầu)
npm run build     # Biên dịch TypeScript sang thư mục dist
npm run start     # Khởi chạy server tại cổng 3001
# (Hoặc nếu đang code phát triển: npm run start:dev)
```
> ✅ Backend sẽ hoạt động tại: `http://localhost:3001/api`

#### Bước 2: Khởi động Frontend (Next.js)
Mở một cửa sổ Terminal thứ hai:
```bash
cd frontend
npm install       # Cài đặt thư viện (chỉ cần chạy lần đầu)
npm run dev       # Khởi chạy Next.js tại cổng 3000
```
> ✅ Frontend sẽ hoạt động tại: `http://localhost:3000`

---

## 📡 DANH SÁCH REST API (BACKEND ENDPOINTS)

| Phương thức | Đường dẫn API | Mô tả | Dữ liệu mẫu (Request Body) |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/tracuu/vanbang` | Tra cứu văn bằng tốt nghiệp | `{"ho_ten": "Nguyễn Văn An", "ngay_sinh": "2001-05-15", "loai_dao_tao": "dh", "so_hieu_phoi": "B6829104"}` |
| `POST` | `/api/tracuu/cntt` | Tra cứu chứng chỉ tin học | `{"so_hieu_phoi": "CB-982145", "cap_do": "coban"}` |
| `POST` | `/api/tracuu/vstep` | Tra cứu chứng chỉ VSTEP | `{"so_hieu_phoi": "VSTEP-881923"}` |
| `GET` | `/api/tracuu/sample-data` | Lấy danh sách mẫu test nhanh | Không yêu cầu body |
| `GET` | `/api/tracuu/stats` | Thống kê số lượng văn bằng/chứng chỉ | Không yêu cầu body |

---

## 🎯 DỮ LIỆU MẪU KIỂM THỬ SẴN TRÊN HỆ THỐNG

Bạn có thể mở trình duyệt vào **`http://localhost:3000`** và bấm vào các nút gợi ý trên giao diện hoặc nhập tay:

### 1. Văn bằng Tốt nghiệp:
- **Mẫu 1:**
  - Họ tên: `Nguyễn Văn An` | Ngày sinh: `15/05/2001` | Loại: `Bằng Đại học`
  - *Kết quả:* Bằng Đại học Chính quy ngành Công nghệ thông tin, Xếp loại: Giỏi.
- **Mẫu 2:**
  - Họ tên: `Trần Thị Ngọc Mai` | Ngày sinh: `20/11/2002` | Loại: `Bằng Đại học`
  - *Kết quả:* Bằng Đại học Chính quy ngành Dược học, Xếp loại: Xuất sắc.
- **Mẫu 3:**
  - Họ tên: `Phạm Minh Đức` | Ngày sinh: `25/03/1995` | Loại: `Thạc sĩ`
  - *Kết quả:* Bằng Thạc sĩ Quản lý kinh tế, Xếp loại: Giỏi.

### 2. Chứng chỉ Tin học CNTT:
- **Số hiệu phôi:** `CB-982145` (Chuẩn Cơ bản) -> Học viên: Nguyễn Văn An, Điểm: 8.75.
- **Số hiệu phôi:** `NC-452109` (Chuẩn Nâng cao) -> Học viên: Trần Thị Ngọc Mai, Điểm: 9.25.

### 3. Chứng chỉ Tiếng Anh VSTEP:
- **Số hiệu phôi:** `VSTEP-881923` -> Thí sinh: Nguyễn Văn An, **Bậc 4 (B2)** (Nghe: 6.5, Đọc: 7.0, Viết: 6.0, Nói: 6.5).
- **Số hiệu phôi:** `VSTEP-772019` -> Thí sinh: Lê Hoàng Nam, **Bậc 3 (B1)** (Điểm quy đổi: 5.5).

---

## 📂 CẤU TRÚC THƯ MỤC DỰ ÁN

```text
TraCuu/
├── backend/                       # Nguồn mã Backend (NestJS 10)
│   ├── src/
│   │   ├── lookup/               # Module xử lý nghiệp vụ tra cứu
│   │   │   ├── lookup.controller.ts
│   │   │   ├── lookup.service.ts
│   │   │   └── lookup.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts               # Điểm khởi chạy NestJS (Port 3001)
│   ├── .env.example              # Mẫu cấu hình môi trường backend
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                      # Nguồn mã Frontend (Next.js 14)
│   ├── public/                   # Ảnh trường NCTU, logo, font MomoTrustSans
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css       # CSS toàn cục & hoa văn Guilloche
│   │   │   ├── layout.tsx        # Cấu hình SEO, Head, Fonts
│   │   │   └── page.tsx          # Trang chủ tra cứu 3 phân hệ
│   │   └── components/
│   │       ├── CertificateCard.tsx    # Thẻ chứng chỉ điện tử + QR + In A4
│   │       ├── VanBangForm.tsx        # Form tra cứu văn bằng tốt nghiệp
│   │       ├── CnttForm.tsx           # Form tra cứu chứng chỉ CNTT
│   │       ├── VstepForm.tsx          # Form tra cứu chứng chỉ VSTEP
│   │       ├── QuickSampleWidget.tsx  # Widget nạp dữ liệu mẫu nhanh
│   │       ├── SecurityCaptcha.tsx    # Mã kiểm tra bảo mật
│   │       └── Footer.tsx             # Chân trang thông tin 3 đơn vị NCTU
│   ├── .env.example              # Mẫu cấu hình môi trường frontend
│   ├── next.config.mjs           # Cấu hình proxy rewrite API sang 3001
│   ├── tailwind.config.ts
│   └── package.json
│
├── .gitignore                     # Cấu hình loại trừ git (node_modules, .next, dist)
├── start.bat                      # Script 1-click khởi động tự động thông minh
├── HUONG_DAN_CAI_DAT_VA_CHAY.md  # Hướng dẫn chi tiết dành riêng cho người mới
└── README.md                      # Tài liệu tổng quan dự án (File này)
```

---

## ❓ XỬ LÝ SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

1. **Lỗi `Cannot find module 'dist/main.js'`:**
   - Hãy vào thư mục `backend` và chạy lệnh `npm run build` trước khi chạy `npm run start`.
2. **Lỗi trùng cổng `Port 3000 / 3001 already in use`:**
   - Tắt các terminal cũ hoặc giải phóng cổng trên PowerShell:
     ```powershell
     Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
     Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force
     ```
3. **Frontend không gọi được API Backend:**
   - Kiểm tra xem cửa sổ `backend` đã hiển thị thông báo lắng nghe cổng 3001 chưa.
   - Thử mở `http://localhost:3001/api/tracuu/stats` trên trình duyệt xem có trả về dữ liệu JSON không.

---

## 🏛️ ĐƠN VỊ VẬN HÀNH & BẢN QUYỀN

**TRƯỜNG ĐẠI HỌC NAM CẦN THƠ (NCTU)**  
Địa chỉ: Số 168, Đường song hành Quốc lộ 1A, Khu dân cư Hồng Loan, P. Hưng Thạnh, Q. Cái Răng, TP. Cần Thơ  
Điện thoại: 02923.798.222 - 02923.798.333  
Website: [nctu.edu.vn](https://nctu.edu.vn) | Cổng tra cứu: [tracuu.nctu.edu.vn](https://tracuu.nctu.edu.vn)
