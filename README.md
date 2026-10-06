# HỆ THỐNG TRA CỨU VĂN BẰNG & CHỨNG CHỈ ĐIỆN TỬ - ĐH NAM CẦN THƠ (NCTU)

Hệ thống tra cứu và xác thực văn bằng chứng chỉ được tái thiết kế toàn diện theo kiến trúc hiện đại **Fullstack NestJS (Backend) + Next.js (Frontend)**, thay thế cho giao diện PHP/Bootstrap cũ của `tracuu.nctu.edu.vn`.

---

## 🌟 ĐẶC ĐIỂM NỔI BẬT

1. **All-In-One Unified Portal**: Tích hợp 3 phân hệ trong một giao diện duy nhất, chuyển đổi mượt mà không reload trang:
   - 🎓 **Văn bằng Tốt nghiệp** (Đại học, Cao đẳng, Thạc sĩ, Tiến sĩ)
   - 💻 **Chứng chỉ Tin học CNTT** (Chuẩn Cơ bản & Nâng cao)
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

## 🚀 TRẠNG THÁI ĐANG CHẠY TRỰC TIẾP (LIVE STATUS)

Cả 2 dịch vụ hiện **đang chạy nền trực tiếp** trên máy tính của bạn:

| Dịch vụ | Công nghệ | Địa chỉ truy cập | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | **Next.js 14** (React 18 + Tailwind CSS + Lucide + QR) | **`http://localhost:3000`** | Giao diện tra cứu người dùng |
| **Backend API** | **NestJS 10** (Express + TypeScript + RESTful) | **`http://localhost:3001/api`** | Cung cấp dữ liệu & API xác thực |

---

## 📡 DANH SÁCH REST API (BACKEND NESTJS)

- `POST http://localhost:3001/api/tracuu/vanbang`: Tra cứu văn bằng tốt nghiệp
  - Body: `{ "ho_ten": "Nguyễn Văn An", "ngay_sinh": "2001-05-15", "loai_dao_tao": "dh", "so_hieu_phoi": "B6829104" }`
- `POST http://localhost:3001/api/tracuu/cntt`: Tra cứu chứng chỉ CNTT
  - Body: `{ "so_hieu_phoi": "CB-982145", "cap_do": "coban" }`
- `POST http://localhost:3001/api/tracuu/vstep`: Tra cứu chứng chỉ tiếng Anh VSTEP
  - Body: `{ "so_hieu_phoi": "VSTEP-881923" }`
- `GET http://localhost:3001/api/tracuu/sample-data`: Lấy danh sách mẫu test nhanh
- `GET http://localhost:3001/api/tracuu/stats`: Lấy số liệu thống kê hệ thống

---

## 🎯 DỮ LIỆU MẪU KIỂM THỬ SẴN TRÊN WEB

Bạn có thể mở trình duyệt vào **`http://localhost:3000`** và bấm vào các nút gợi ý trên giao diện hoặc nhập tay:

### 1. Văn bằng Tốt nghiệp:
- **Họ tên:** `Nguyễn Văn An` | **Ngày sinh:** `15/05/2001` | **Loại đào tạo:** Bằng Đại học
  - *Kết quả:* Bằng Đại học Chính quy ngành Công nghệ thông tin, Xếp loại: Giỏi.
- **Họ tên:** `Trần Thị Ngọc Mai` | **Ngày sinh:** `20/11/2002` | **Loại đào tạo:** Bằng Đại học
  - *Kết quả:* Bằng Đại học Chính quy ngành Dược học, Xếp loại: Xuất sắc.
- **Họ tên:** `Phạm Minh Đức` | **Ngày sinh:** `25/03/1995` | **Loại đào tạo:** Thạc sĩ
  - *Kết quả:* Bằng Thạc sĩ Quản lý kinh tế, Xếp loại: Giỏi.

### 2. Chứng chỉ CNTT:
- **Số hiệu phôi:** `CB-982145` (Cơ bản) -> Học viên: Nguyễn Văn An, Điểm: 8.75 (Lý thuyết: 8.5, Thực hành: 9.0)
- **Số hiệu phôi:** `NC-452109` (Nâng cao) -> Học viên: Trần Thị Ngọc Mai, Điểm: 9.25 (Xuất sắc)

### 3. Chứng chỉ Ngoại ngữ VSTEP:
- **Số hiệu phôi:** `VSTEP-881923` -> Thí sinh: Nguyễn Văn An, **Bậc 4 (B2)** (Nghe: 6.5, Đọc: 7.0, Viết: 6.0, Nói: 6.5)
- **Số hiệu phôi:** `VSTEP-772019` -> Thí sinh: Lê Hoàng Nam, **Bậc 3 (B1)** (Điểm quy đổi: 5.5)

---

## 🛠️ HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY DỰ ÁN (SETUP & RUN)

> 📖 Xem tài liệu đầy đủ chi tiết từng bước tại: [HUONG_DAN_CAI_DAT_VA_CHAY.md](file:///d:/Antigravity%20IDE/TraCuu/HUONG_DAN_CAI_DAT_VA_CHAY.md)

### Cách 1: Khởi chạy 1-Click tự động (Windows)
1. Double-click tệp [start.bat](file:///d:/Antigravity%20IDE/TraCuu/start.bat) ở thư mục gốc.
2. Tệp sẽ tự động nhận diện nếu thiếu `node_modules` để chạy `npm install` và biên dịch tự động, sau đó mở đồng thời 2 dịch vụ.
3. Mở trình duyệt tại: **`http://localhost:3000`**

### Cách 2: Khởi chạy thủ công từ dòng lệnh (Terminal)

#### 1. Cài đặt và khởi chạy Backend (NestJS):
```bash
cd backend
npm install
npm run build
npm run start
# Backend chạy tại: http://localhost:3001
```

#### 2. Cài đặt và khởi chạy Frontend (Next.js):
```bash
cd frontend
npm install
npm run dev
# Frontend chạy tại: http://localhost:3000
```

