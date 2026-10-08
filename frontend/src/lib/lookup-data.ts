export interface VanBangRecord {
  id: string;
  loai_dao_tao: 'dh' | 'cd' | 'ths' | 'ts';
  ten_van_bang: string;
  ho_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  nganh_dao_tao: string;
  chuyen_nganh?: string;
  xep_loai: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Trung bình khá' | 'Trung bình';
  hinh_thuc_dao_tao: string;
  so_vao_so: string;
  so_hieu_phoi: string;
  so_quyet_dinh: string;
  ngay_ban_hanh: string;
  nam_tot_nghiep: number;
  don_vi_cap: string;
  nguoi_ky: string;
  trang_thai: 'Hợp lệ' | 'Thu hồi' | 'Tạm khóa';
}

export interface CnttRecord {
  id: string;
  cap_do: 'coban' | 'nangcao';
  ten_chung_chi: string;
  ho_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  noi_sinh: string;
  so_cccd: string;
  khoa_thi: string;
  ngay_thi: string;
  diem_ly_thuyet: number;
  diem_trac_nghiem?: number;
  diem_thuc_hanh: number;
  diem_tong_ket: number;
  ket_qua?: string;
  xep_loai: string;
  so_hieu_phoi: string;
  so_vao_so: string;
  so_quyet_dinh: string;
  ngay_cap: string;
  trang_thai: 'Hợp lệ' | 'Thu hồi';
}

export interface VstepRecord {
  id: string;
  ten_chung_chi: string;
  ho_ten: string;
  ngay_sinh: string;
  gioi_tinh: string;
  so_cccd: string;
  hoi_dong_thi: string;
  ngay_thi: string;
  so_bao_danh: string;
  diem_nghe: number;
  diem_doc: number;
  diem_viet: number;
  diem_noi: number;
  diem_tong: number;
  bac_nang_luc: 'Bậc 2 (A2)' | 'Bậc 3 (B1)' | 'Bậc 4 (B2)' | 'Bậc 5 (C1)' | 'Bậc 6 (C2)';
  khung_tham_chieu: string;
  so_hieu_phoi: string;
  so_vao_so: string;
  ngay_cap: string;
  hieu_luc: string;
  trang_thai: 'Hợp lệ' | 'Thu hồi';
}

export const VAN_BANG_DB: VanBangRecord[] = [
  {
    id: 'VB-2023-08912',
    loai_dao_tao: 'dh',
    ten_van_bang: 'Bằng tốt nghiệp đại học chính quy',
    ho_ten: 'NGUYỄN VĂN AN',
    ngay_sinh: '2001-05-15',
    gioi_tinh: 'Nam',
    nganh_dao_tao: 'Công nghệ thông tin',
    chuyen_nganh: 'Kỹ thuật phần mềm & AI',
    xep_loai: 'Giỏi',
    hinh_thuc_dao_tao: 'Chính quy',
    so_vao_so: 'NCTU-CNTT-2023/142',
    so_hieu_phoi: 'B6829104',
    so_quyet_dinh: '782/QĐ-ĐHNCT',
    ngay_ban_hanh: '2023-07-28',
    nam_tot_nghiep: 2023,
    don_vi_cap: 'Trường Đại học Nam Cần Thơ',
    nguoi_ky: 'TS. Nguyễn Văn Quang - Hiệu trưởng',
    trang_thai: 'Hợp lệ',
  },
  {
    id: 'VB-2024-01294',
    loai_dao_tao: 'dh',
    ten_van_bang: 'Bằng tốt nghiệp đại học chính quy',
    ho_ten: 'TRẦN THỊ NGỌC MAI',
    ngay_sinh: '2002-11-20',
    gioi_tinh: 'Nữ',
    nganh_dao_tao: 'Dược học',
    chuyen_nganh: 'Dược lâm sàng',
    xep_loai: 'Xuất sắc',
    hinh_thuc_dao_tao: 'Chính quy',
    so_vao_so: 'NCTU-DH-2024/098',
    so_hieu_phoi: 'B7910245',
    so_quyet_dinh: '915/QĐ-ĐHNCT',
    ngay_ban_hanh: '2024-06-18',
    nam_tot_nghiep: 2024,
    don_vi_cap: 'Trường Đại học Nam Cần Thơ',
    nguoi_ky: 'TS. Nguyễn Văn Quang - Hiệu trưởng',
    trang_thai: 'Hợp lệ',
  },
  {
    id: 'VB-2026-DNC006026',
    loai_dao_tao: 'dh',
    ten_van_bang: 'Bằng tốt nghiệp đại học',
    ho_ten: 'DƯƠNG THỊ ANH THƯ',
    ngay_sinh: '2004-12-24',
    gioi_tinh: 'Nữ',
    nganh_dao_tao: 'Truyền thông đa phương tiện',
    xep_loai: 'Xuất sắc',
    hinh_thuc_dao_tao: 'Chính quy',
    so_vao_so: 'K10/1947',
    so_hieu_phoi: 'DNC/CN.006026',
    so_quyet_dinh: '776/QĐ-ĐHNCT',
    ngay_ban_hanh: '2026-06-23',
    nam_tot_nghiep: 2026,
    don_vi_cap: 'Trường Đại học Nam Cần Thơ',
    nguoi_ky: 'TS. Nguyễn Văn Quang - Hiệu trưởng',
    trang_thai: 'Hợp lệ',
  },
  {
    id: 'VB-2022-04511',
    loai_dao_tao: 'dh',
    ten_van_bang: 'Bằng tốt nghiệp đại học chính quy',
    ho_ten: 'LÊ HOÀNG NAM',
    ngay_sinh: '2000-08-10',
    gioi_tinh: 'Nam',
    nganh_dao_tao: 'Quản trị kinh doanh',
    chuyen_nganh: 'Marketing số',
    xep_loai: 'Khá',
    hinh_thuc_dao_tao: 'Chính quy',
    so_vao_so: 'NCTU-QTKD-2022/312',
    so_hieu_phoi: 'B5541890',
    so_quyet_dinh: '640/QĐ-ĐHNCT',
    ngay_ban_hanh: '2022-08-12',
    nam_tot_nghiep: 2022,
    don_vi_cap: 'Trường Đại học Nam Cần Thơ',
    nguoi_ky: 'TS. Nguyễn Văn Quang - Hiệu trưởng',
    trang_thai: 'Hợp lệ',
  },
  {
    id: 'VB-2023-THS-019',
    loai_dao_tao: 'ths',
    ten_van_bang: 'Bằng thạc sĩ',
    ho_ten: 'PHẠM MINH ĐỨC',
    ngay_sinh: '1995-03-25',
    gioi_tinh: 'Nam',
    nganh_dao_tao: 'Quản lý kinh tế',
    xep_loai: 'Giỏi',
    hinh_thuc_dao_tao: 'Chính quy',
    so_vao_so: 'NCTU-THS-2023/045',
    so_hieu_phoi: 'TS203918',
    so_quyet_dinh: '310/QĐ-ĐHNCT',
    ngay_ban_hanh: '2023-10-15',
    nam_tot_nghiep: 2023,
    don_vi_cap: 'Trường Đại học Nam Cần Thơ',
    nguoi_ky: 'TS. Nguyễn Văn Quang - Hiệu trưởng',
    trang_thai: 'Hợp lệ',
  },
];

export const CNTT_DB: CnttRecord[] = [
  {
    id: 'CNTT-CB-001300',
    cap_do: 'coban',
    ten_chung_chi: 'Chứng chỉ ứng dụng công nghệ thông tin cơ bản',
    ho_ten: 'Nguyễn Thị Ngọc Châu',
    ngay_sinh: '03/12/2001',
    gioi_tinh: 'Nữ',
    noi_sinh: 'Trà Vinh',
    so_cccd: '084301007892',
    khoa_thi: 'Khoá 2022',
    ngay_thi: '10/10/2022',
    diem_ly_thuyet: 5.3,
    diem_trac_nghiem: 5.3,
    diem_thuc_hanh: 6.5,
    diem_tong_ket: 5.9,
    ket_qua: 'Đạt',
    xep_loai: 'Đạt',
    so_hieu_phoi: '001300',
    so_vao_so: 'NCTU-CNTT-CB/2022/1300',
    so_quyet_dinh: '358/QĐ-TTTH',
    ngay_cap: '10/10/2022',
    trang_thai: 'Hợp lệ',
  },
  {
    id: 'CNTT-CB-001300-ALT',
    cap_do: 'coban',
    ten_chung_chi: 'Chứng chỉ ứng dụng công nghệ thông tin cơ bản',
    ho_ten: 'Nguyễn Thị Ngọc Châu',
    ngay_sinh: '1997-07-20',
    gioi_tinh: 'Nữ',
    noi_sinh: 'Trà Vinh',
    so_cccd: '',
    khoa_thi: 'Khoá 2022',
    ngay_thi: '10/10/2022',
    diem_ly_thuyet: 5.3,
    diem_trac_nghiem: 5.3,
    diem_thuc_hanh: 6.5,
    diem_tong_ket: 5.9,
    ket_qua: 'Đạt',
    xep_loai: 'Đạt',
    so_hieu_phoi: '001300',
    so_vao_so: 'NCTU-CNTT-CB/2022/1300',
    so_quyet_dinh: '',
    ngay_cap: '10/10/2022',
    trang_thai: 'Hợp lệ',
  },
  {
    id: 'CNTT-CB-2024-001',
    cap_do: 'coban',
    ten_chung_chi: 'Chứng chỉ ứng dụng công nghệ thông tin cơ bản',
    ho_ten: 'NGUYỄN VĂN AN',
    ngay_sinh: '2001-05-15',
    gioi_tinh: 'Nam',
    noi_sinh: 'Cần Thơ',
    so_cccd: '092201004581',
    khoa_thi: 'Khoá 42/2024',
    ngay_thi: '2024-03-24',
    diem_ly_thuyet: 8.5,
    diem_thuc_hanh: 9.0,
    diem_tong_ket: 8.75,
    xep_loai: 'ĐẠT (Loại Giỏi)',
    so_hieu_phoi: 'CB-982145',
    so_vao_so: 'NCTU-CNTT-CB/2024/412',
    so_quyet_dinh: '142/QĐ-TTCDR',
    ngay_cap: '2024-04-10',
    trang_thai: 'Hợp lệ',
  },
  {
    id: 'CNTT-NC-2024-088',
    cap_do: 'nangcao',
    ten_chung_chi: 'Chứng chỉ ứng dụng công nghệ thông tin nâng cao',
    ho_ten: 'TRẦN THỊ NGỌC MAI',
    ngay_sinh: '2002-11-20',
    gioi_tinh: 'Nữ',
    noi_sinh: 'Hậu Giang',
    so_cccd: '093302008742',
    khoa_thi: 'Khoá 18/2024',
    ngay_thi: '2024-05-19',
    diem_ly_thuyet: 9.0,
    diem_thuc_hanh: 9.5,
    diem_tong_ket: 9.25,
    xep_loai: 'ĐẠT (Loại Xuất sắc)',
    so_hieu_phoi: 'NC-452109',
    so_vao_so: 'NCTU-CNTT-NC/2024/091',
    so_quyet_dinh: '208/QĐ-TTCDR',
    ngay_cap: '2024-06-05',
    trang_thai: 'Hợp lệ',
  },
];

export const VSTEP_DB: VstepRecord[] = [
  {
    id: 'VSTEP-2024-0489',
    ten_chung_chi: 'Chứng chỉ năng lực tiếng Anh (VSTEP)',
    ho_ten: 'NGUYỄN VĂN AN',
    ngay_sinh: '2001-05-15',
    gioi_tinh: 'Nam',
    so_cccd: '092201004581',
    hoi_dong_thi: 'Hội đồng thi ĐH Nam Cần Thơ - Đợt 4/2024',
    ngay_thi: '2024-04-14',
    so_bao_danh: 'NCTU-VSTEP-2024-0489',
    diem_nghe: 6.5,
    diem_doc: 7.0,
    diem_viet: 6.0,
    diem_noi: 6.5,
    diem_tong: 6.5,
    bac_nang_luc: 'Bậc 4 (B2)',
    khung_tham_chieu: 'Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam',
    so_hieu_phoi: 'VSTEP-881923',
    so_vao_so: 'NCTU-VSTEP/2024/318',
    ngay_cap: '2024-05-02',
    hieu_luc: '02 năm kể từ ngày cấp (đến 02/05/2026)',
    trang_thai: 'Hợp lệ',
  },
  {
    id: 'VSTEP-2024-0912',
    ten_chung_chi: 'Chứng chỉ năng lực tiếng Anh (VSTEP)',
    ho_ten: 'LÊ HOÀNG NAM',
    ngay_sinh: '2000-08-10',
    gioi_tinh: 'Nam',
    so_cccd: '092200001429',
    hoi_dong_thi: 'Hội đồng thi ĐH Nam Cần Thơ - Đợt 2/2024',
    ngay_thi: '2024-02-25',
    so_bao_danh: 'NCTU-VSTEP-2024-0912',
    diem_nghe: 5.0,
    diem_doc: 5.5,
    diem_viet: 5.0,
    diem_noi: 5.5,
    diem_tong: 5.5,
    bac_nang_luc: 'Bậc 3 (B1)',
    khung_tham_chieu: 'Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam',
    so_hieu_phoi: 'VSTEP-772019',
    so_vao_so: 'NCTU-VSTEP/2024/115',
    ngay_cap: '2024-03-12',
    hieu_luc: '02 năm kể từ ngày cấp (đến 12/03/2026)',
    trang_thai: 'Hợp lệ',
  },
];

export function normalizeString(str?: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

export function matchDate(dbDate?: string, queryDate?: string): boolean {
  if (!dbDate || !queryDate) return false;
  const cleanDb = dbDate.trim();
  const cleanQ = queryDate.trim();
  if (cleanDb === cleanQ) return true;

  const toYMD = (s: string) => {
    const parts = s.split(/[-/.]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      } else if (parts[2].length === 4) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    return s;
  };

  const normDb = toYMD(cleanDb);
  const normQ = toYMD(cleanQ);
  if (normDb === normQ) return true;

  const digitsDb = cleanDb.replace(/\D/g, '');
  const digitsQ = cleanQ.replace(/\D/g, '');
  if (digitsDb && digitsQ && digitsDb === digitsQ) return true;

  return false;
}

export function traCuuVanBang(query: {
  loai_dao_tao?: string;
  ho_ten: string;
  ngay_sinh: string;
  so_hieu_phoi?: string;
  so_vao_so?: string;
}) {
  const qHoten = normalizeString(query.ho_ten || '');
  const qNgaysinh = query.ngay_sinh?.trim() || '';
  const qPhoi = query.so_hieu_phoi?.trim().toLowerCase();
  const qSo = query.so_vao_so?.trim().toLowerCase();
  const qLoai = query.loai_dao_tao?.trim();

  if (!qHoten) {
    throw new Error('Vui lòng nhập Họ và tên để tra cứu.');
  }
  if (!qNgaysinh) {
    throw new Error('Vui lòng chọn Ngày sinh để tra cứu.');
  }
  if (!qPhoi && !qSo) {
    throw new Error('Vui lòng nhập Số hiệu phôi hoặc Số vào sổ cấp bằng.');
  }

  const record = VAN_BANG_DB.find((item) => {
    const normDbName = normalizeString(item.ho_ten);
    const matchName = normDbName === qHoten;
    const matchBirth = matchDate(item.ngay_sinh, qNgaysinh);
    const matchLoai = !qLoai || item.loai_dao_tao === qLoai;

    const matchPhoi = qPhoi ? item.so_hieu_phoi.toLowerCase() === qPhoi : true;
    const normDbSo = item.so_vao_so.toLowerCase().replace(/^(nctu|dnc)-/, '');
    const normQSo = qSo ? qSo.replace(/^(nctu|dnc)-/, '') : '';
    const matchSo = qSo ? (item.so_vao_so.toLowerCase() === qSo || normDbSo === normQSo) : true;

    return matchName && matchBirth && matchLoai && matchPhoi && matchSo;
  });

  if (!record) {
    throw new Error('Không tìm thấy thông tin văn bằng phù hợp. Vui lòng kiểm tra lại Họ tên, Ngày sinh hoặc Số hiệu phôi.');
  }

  return record;
}

export function traCuuCntt(query: {
  so_hieu_phoi: string;
  cap_do?: string;
  ho_ten?: string;
  ngay_sinh?: string;
  so_vao_so?: string;
}) {
  const qKey = query.so_hieu_phoi?.trim().toLowerCase();
  const qCapDo = query.cap_do?.trim().toLowerCase();
  const qHoten = normalizeString(query.ho_ten || '');
  const qNgaysinh = query.ngay_sinh?.trim() || '';
  const qSoVaoSo = query.so_vao_so?.trim().toLowerCase();

  if (!qHoten) {
    throw new Error('Vui lòng nhập Họ và tên để tra cứu.');
  }
  if (!qNgaysinh) {
    throw new Error('Vui lòng chọn Ngày sinh để tra cứu.');
  }
  if (!qKey && !qSoVaoSo) {
    throw new Error('Vui lòng nhập Số hiệu phôi hoặc Số vào sổ cấp chứng chỉ.');
  }

  const record = CNTT_DB.find((item) => {
    // 1. Họ tên: Bắt buộc khớp chính xác
    const normDbName = normalizeString(item.ho_ten);
    const matchName = normDbName === qHoten;

    // 2. Ngày sinh: Bắt buộc khớp đúng ngày sinh
    const matchBirth = matchDate(item.ngay_sinh, qNgaysinh);

    // 3. Cấp độ (nếu có chọn)
    const matchCapDo = !qCapDo || item.cap_do === qCapDo;

    // 4. Số hiệu phôi
    const matchPhoi = qKey ? (item.so_hieu_phoi.toLowerCase() === qKey || item.so_cccd.toLowerCase() === qKey) : true;

    // 5. Số vào sổ
    const matchVaoSo = qSoVaoSo ? item.so_vao_so.toLowerCase() === qSoVaoSo : true;

    return matchName && matchBirth && matchCapDo && matchPhoi && matchVaoSo;
  });

  if (!record) {
    throw new Error('Không tìm thấy chứng chỉ CNTT phù hợp. Vui lòng kiểm tra lại Họ tên, Ngày sinh, Số hiệu phôi hoặc Số vào sổ.');
  }

  return record;
}

export function traCuuVstep(query: {
  so_hieu_phoi: string;
  ho_ten?: string;
  ngay_sinh?: string;
  so_bao_danh?: string;
  so_vao_so?: string;
}) {
  const qKey = query.so_hieu_phoi?.trim().toLowerCase();
  const qHoten = normalizeString(query.ho_ten || '');
  const qNgaysinh = query.ngay_sinh?.trim() || '';
  const qSbd = query.so_bao_danh?.trim().toLowerCase();
  const qSoVaoSo = query.so_vao_so?.trim().toLowerCase();

  if (!qHoten) {
    throw new Error('Vui lòng nhập Họ và tên để tra cứu.');
  }
  if (!qNgaysinh) {
    throw new Error('Vui lòng chọn Ngày sinh để tra cứu.');
  }
  if (!qKey && !qSbd && !qSoVaoSo) {
    throw new Error('Vui lòng nhập Số hiệu phôi hoặc Số vào sổ để tra cứu.');
  }

  const record = VSTEP_DB.find((item) => {
    // 1. Họ tên: Bắt buộc khớp chính xác
    const normDbName = normalizeString(item.ho_ten);
    const matchName = normDbName === qHoten;

    // 2. Ngày sinh: Bắt buộc khớp đúng ngày sinh
    const matchBirth = matchDate(item.ngay_sinh, qNgaysinh);

    // 3. Số hiệu phôi / CCCD
    const matchPhoi = qKey ? (item.so_hieu_phoi.toLowerCase() === qKey || item.so_cccd.toLowerCase() === qKey || item.so_bao_danh.toLowerCase() === qKey) : true;

    // 4. Số báo danh
    const matchSbd = qSbd ? (item.so_bao_danh.toLowerCase() === qSbd || item.so_vao_so.toLowerCase() === qSbd) : true;

    // 5. Số vào sổ
    const matchVaoSo = qSoVaoSo ? (item.so_vao_so.toLowerCase() === qSoVaoSo || item.so_bao_danh.toLowerCase() === qSoVaoSo) : true;

    return matchName && matchBirth && matchPhoi && (qSoVaoSo ? matchVaoSo : matchSbd);
  });

  if (!record) {
    throw new Error('Không tìm thấy chứng chỉ VSTEP phù hợp. Vui lòng kiểm tra lại Họ tên, Ngày sinh hoặc Số hiệu phôi / Số vào sổ.');
  }

  return record;
}

export function getSampleData() {
  return {
    vanbang: VAN_BANG_DB.map((item) => ({
      label: `${item.ho_ten} - ${item.nganh_dao_tao} (${item.ten_van_bang})`,
      ...item,
    })),
    cntt: CNTT_DB.map((item) => ({
      label: `${item.ho_ten} - ${item.ten_chung_chi}`,
      ...item,
    })),
    vstep: VSTEP_DB.map((item) => ({
      label: `${item.ho_ten} - ${item.ten_chung_chi} (${item.bac_nang_luc})`,
      ...item,
    })),
  };
}

export function getStats() {
  return {
    tong_van_bang: VAN_BANG_DB.length,
    tong_cntt: CNTT_DB.length,
    tong_vstep: VSTEP_DB.length,
    tong_ho_so: VAN_BANG_DB.length + CNTT_DB.length + VSTEP_DB.length,
  };
}
