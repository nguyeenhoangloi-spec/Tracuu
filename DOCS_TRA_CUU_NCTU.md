# BÁO CÁO DỮ LIỆU CÀO & ĐẶC TẢ HỆ THỐNG TRA CỨU NCTU
**Đơn vị:** Trường Đại học Nam Cần Thơ (Nam Can Tho University - NCTU)  
**Nguồn crawl:** `https://tracuu.nctu.edu.vn/`  
**Ngày thực hiện:** 03/10/2026  

---

## 1. TỔNG QUAN HỆ THỐNG & NHẬN DIỆN THƯƠNG HIỆU

### 1.1. Thông tin đơn vị & Liên hệ
- **Tên trường:** TRƯỜNG ĐẠI HỌC NAM CẦN THƠ
- **Trang chủ chính:** `https://nctu.edu.vn/`
- **Hệ thống tra cứu hiện tại:** `https://tracuu.nctu.edu.vn/`
- **Các phòng ban phụ trách (từ Footer):**
  1. **Trung tâm Chuẩn đầu ra và Phát triển nguồn nhân lực**: Khu C, phòng C2-14 | SĐT: `02923 798 798` | Email: `ttchuandaura@nctu.edu.vn` (Phụ trách chứng chỉ VSTEP & CNTT)
  2. **Phòng Quản lý đào tạo**: Khu C, phòng C2-11 | SĐT: `02923 798 999` | Email: `phongdaotao@nctu.edu.vn` (Phụ trách Văn bằng chính quy, liên thông, sau đại học)
  3. **Trung tâm Phát triển & Ứng dụng phần mềm**: Khu I, phòng I1-04 | SĐT: `02923 851 136` | Email: `ttphanmem@nctu.edu.vn` (Kỹ thuật hệ thống)
- **Bản quyền:** `CopyRight © 2024 Trường Đại học Nam Cần Thơ`

### 1.2. Nhận diện hình ảnh & Brand Guidelines
- **Logo chính:** `https://nctu.edu.vn/images/png/logo_truong_3.png`
- **Favicon:** `https://nctu.edu.vn/images/webp/favicon.webp`
- **Cờ quốc kỳ:** VN (`https://nctu.edu.vn/uploads/page/2023_10/flagVN.png`), ENG (`https://nctu.edu.vn/webp/flagENG.webp`)
- **Bảng màu đặc trưng:**
  - **Đỏ NCTU:** `#D72134` / `#EC1E24` (Màu chủ đạo logo, nút chính, highlight)
  - **Xanh Navy NCTU:** `#25359D` / `#0056D6` (Màu tiêu đề phụ, nút bấm, table header)
  - **Vàng Gold:** `#FFD24B` (Thanh topbar điều hướng)
  - **Màu nền trung tính:** `#FAFAFA` / `#F8F9FA` / `#F9F4E7`
- **Phông chữ hệ thống cũ:** `Be Vietnam Pro`, `Lexend`, `SVN-Gilroy`, `Montserrat`.

---

## 2. CHI TIẾT 3 PHÂN HỆ TRA CỨU ĐÃ CÀO ĐƯỢC

### PHÂN HỆ 1: TRA CỨU VĂN BẰNG TỐT NGHIỆP
- **URL:** `https://tracuu.nctu.edu.vn/vanbang`
- **Mục đích:** Xác minh tính hợp pháp của bằng Đại học, Cao đẳng, Thạc sĩ, Tiến sĩ do Đại học Nam Cần Thơ cấp cho nhà tuyển dụng, cơ quan và người học.

#### Các trường biểu mẫu (Input Fields):
| Tên trường | Name / ID | Kiểu | Bắt buộc | Tùy chọn / Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **Loại đào tạo** | `loai_dao_tao` / `loaiDaoTao` | Select | Không | `cd` (Cao đẳng), `dh` (Đại học - Mặc định), `ths` (Thạc sĩ), `ts` (Tiến sĩ) |
| **Họ và tên** | `ho_ten` / `hoTen` | Text | **Có** | Nhập họ tên có dấu hoặc không dấu |
| **Ngày sinh** | `ngay_sinh` / `ngaySinh` | Date | **Có** | Định dạng chuẩn YYYY-MM-DD |
| **Số hiệu phôi** | `so_hieu_phoi` / `soHieuPhoi` | Text | Không | Dãy số/ký hiệu in trên phôi bằng |
| **Số vào sổ** | `so_vao_so` / `soVaoSo` | Text | Không | Số hiệu vào sổ cấp bằng |
| **Cam kết** | `job-confirm` | Checkbox | **Có** | "Tôi xác nhận rằng tất cả thông tin trên là đúng sự thật" |
| **Captcha** | `g-recaptcha` | Captcha | **Có** | Google reCAPTCHA v2 |

#### Cấu trúc kết quả hiển thị (Modal / Bảng chi tiết):
- **Tên văn bằng:** `val_loai_dao_tao` (VD: Bằng đại học hệ chính quy)
- **Họ tên người được cấp:** `val_hoten`
- **Ngày sinh:** `val_ngaysinh`
- **Giới tính:** `val_gioitinh`
- **Ngành đào tạo:** `val_nghanhdaotao` (VD: Công nghệ thông tin, Quản trị kinh doanh, Dược học, Y khoa...)
- **Xếp loại tốt nghiệp:** `val_xep_loai` (Xuất sắc, Giỏi, Khá, Trung bình khá, Trung bình)
- **Hình thức đào tạo:** `val_hinh_thuc` (Chính quy, Vừa làm vừa học, Liên thông...)
- **Số vào sổ cấp bằng:** `val_so_vao_so`
- **Số hiệu văn bằng:** `val_so_hieu`
- **Số quyết định tốt nghiệp:** `val_quyetdinh`
- **Ngày ban hành:** `val_banhanh`

---

### PHÂN HỆ 2: TRA CỨU CHỨNG CHỈ ỨNG DỤNG CNTT
- **URL Cơ bản:** `https://tracuu.nctu.edu.vn/cntt/coban`
- **URL Nâng cao:** `https://tracuu.nctu.edu.vn/cntt/nangcao`
- **Mục đích:** Tra cứu chứng chỉ Ứng dụng Công nghệ thông tin cơ bản & nâng cao theo quy định của Bộ TT&TT và Bộ GD&ĐT.

#### Các trường biểu mẫu (Input Fields):
| Tên trường | Name / ID | Kiểu | Bắt buộc | Tùy chọn / Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **Cấp độ** | URL switch | Select | - | Tùy chọn chuyển đổi: "Cơ bản" (`/cntt/coban`) hoặc "Nâng cao" (`/cntt/nangcao`) |
| **Số hiệu phôi** | `so_hieu_phoi` / `mssv` | Text | **Có** | Nhập số hiệu phôi in trên chứng chỉ |
| **Captcha** | `g-recaptcha` | Captcha | **Có** | Google reCAPTCHA |
| **Nút tìm kiếm** | `#submit-button` | Button | - | Kính lúp / Tra cứu |

#### Cấu trúc kết quả hiển thị chuẩn chứng chỉ CNTT:
- Họ và tên học viên
- Ngày sinh, Giới tính, Nơi sinh
- Số CMND/CCCD
- Khóa thi / Ngày tổ chức thi
- Kết quả thi:
  - Điểm Lý thuyết (Thang điểm 10)
  - Điểm Thực hành (Thang điểm 10)
  - Điểm Trung bình / Kết luận: ĐẠT
- Số hiệu phôi chứng chỉ
- Số vào sổ cấp chứng chỉ
- Quyết định công nhận & Ngày cấp

---

### PHÂN HỆ 3: TRA CỨU CHỨNG CHỈ TIẾNG ANH VSTEP
- **URL:** `https://tracuu.nctu.edu.vn/vstep/tracuu`
- **Mục đích:** Tra cứu điểm thi và chứng chỉ tiếng Anh theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam (VSTEP: Bậc 1 - A1, Bậc 2 - A2, Bậc 3 - B1, Bậc 4 - B2, Bậc 5 - C1, Bậc 6 - C2).

#### Các trường biểu mẫu (Input Fields):
| Tên trường | Name / ID | Kiểu | Bắt buộc | Tùy chọn / Ghi chú |
| :--- | :--- | :--- | :---: | :--- |
| **Số hiệu phôi** | `so_hieu_phoi` / `mssv` | Text | **Có** | Số hiệu phôi chứng chỉ hoặc Mã tra cứu thí sinh |
| **Captcha** | `g-recaptcha` | Captcha | **Có** | Google reCAPTCHA |
| **Nút tìm kiếm** | `#submit-button` | Button | - | Icon kính lúp Tra cứu |

#### Cấu trúc kết quả hiển thị chuẩn VSTEP:
- Họ và tên thí sinh
- Ngày sinh, Giới tính, CMND/CCCD/Hộ chiếu
- Hội đồng thi / Khóa thi / Ngày thi
- Điểm chi tiết 4 kỹ năng:
  1. **Nghe (Listening):** Thang điểm 10
  2. **Đọc (Reading):** Thang điểm 10
  3. **Viết (Writing):** Thang điểm 10
  4. **Nói (Speaking):** Thang điểm 10
- **Điểm quy đổi / Điểm trung bình:** Làm tròn đến 0.5
- **Bậc năng lực đạt:** Bậc 2 (A2), Bậc 3 (B1), Bậc 4 (B2), Bậc 5 (C1)...
- **Số hiệu phôi / Số chứng chỉ**
- **Số vào sổ cấp chứng chỉ**
- **Ngày cấp & Đơn vị cấp**

---

## 3. PHÂN TÍCH NHƯỢC ĐIỂM CỦA BẢN HIỆN TẠI (PAIN POINTS)

1. **Giao diện phân mảnh & cũ kỹ:**
   - Sử dụng bố cục Bootstrap 5 thô sơ, form input viền mỏng kiểu Google form đời đầu, không có sự liên kết liền mạch giữa các phân hệ.
   - Khi chuyển đổi giữa "Văn bằng", "CNTT", "VSTEP" phải tải lại trang hoàn toàn thay vì chuyển tab động mượt mà.
2. **Trải nghiệm tìm kiếm & hiển thị nghèo nàn:**
   - Chỉ có 1 ô nhập đơn độc cho CNTT và VSTEP, không gợi ý mã mẫu hoặc hỗ trợ tra cứu kép (tra bằng CCCD/Mã học viên song song số phôi).
   - Khi tìm kiếm xong, popup modal hiển thị kiểu bảng xám đơn điệu, không tạo được cảm giác trang trọng của một chứng chỉ/văn bằng đại học danh giá.
3. **Thiếu tính năng số hóa văn bằng hiện đại:**
   - Không có mã QR code xác thực trực tiếp (Digital Verification QR).
   - Chưa có tính năng "Tải bản sao điện tử (PDF)" hoặc "In chứng nhận tra cứu" phục vụ nộp hồ sơ xin việc, du học.
   - Không có chế độ lưu lịch sử tra cứu gần đây trên thiết bị người dùng.
4. **Trải nghiệm trên điện thoại (Mobile UX):**
   - Bảng kết quả tràn ngang trên màn hình nhỏ, người dùng phải vuốt ngang bất tiện.
   - Thanh Menu và logo chưa tối ưu không gian hiển thị trên mobile.

---

## 4. ĐỀ XUẤT ĐỊNH HƯỚNG THIẾT KẾ MỚI (REDESIGN CONCEPT)

### 4.1. Kiến trúc giao diện Portal All-In-One cao cấp
- **Hero Section trang trọng:** Banner trường ĐH Nam Cần Thơ với tiêu đề nổi bật "CỔNG THÔNG TIN TRA CỨU VĂN BẰNG & CHỨNG CHỈ ĐIỆN TỬ".
- **Tab chuyển đổi 3 phân hệ mượt mà (Animated Segmented Switch):**
  - Tab 1: 🎓 **Văn bằng Tốt nghiệp** (Đại học / Sau đại học / Cao đẳng)
  - Tab 2: 💻 **Chứng chỉ CNTT** (Chuẩn cơ bản & nâng cao)
  - Tab 3: 🌐 **Chứng chỉ Ngoại ngữ VSTEP** (Bậc 1 đến Bậc 6)
- **Hỗ trợ đa phương thức tra cứu:**
  - Nhập theo Số hiệu phôi / Số vào sổ
  - Nhập theo Họ tên + Ngày sinh + Số CCCD
  - Quét mã QR trên bằng/chứng chỉ giấy bằng camera để tra tự động
- **Hiển thị thẻ kết quả điện tử chuẩn quốc tế (Digital Certificate Card):**
  - Mô phỏng thẻ chứng nhận điện tử sắc nét với hoa văn chống giả mạo, quốc huy, logo NCTU dập nổi chìm.
  - Hiển thị dấu mộc xác thực số "HỢP LỆ - ĐÃ XÁC THỰC BỞI NCTU".
  - Mã QR động dẫn thẳng đến đường link xác minh chính chủ.
  - Các nút hành động: **In chứng chỉ**, **Xuất file PDF**, **Sao chép liên kết xác thực**.
- **Dark/Light Mode & Đa ngôn ngữ (Tiếng Việt / English):** Tiện lợi cho nhà tuyển dụng nước ngoài thẩm tra bằng cấp.
