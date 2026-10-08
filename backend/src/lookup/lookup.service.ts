import { Injectable, NotFoundException } from '@nestjs/common';

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
  diem_nghe: number; // Listening
  diem_doc: number;  // Reading
  diem_viet: number; // Writing
  diem_noi: number;  // Speaking
  diem_tong: number; // Overall rounded to 0.5
  bac_nang_luc: 'Bậc 2 (A2)' | 'Bậc 3 (B1)' | 'Bậc 4 (B2)' | 'Bậc 5 (C1)' | 'Bậc 6 (C2)';
  khung_tham_chieu: string;
  so_hieu_phoi: string;
  so_vao_so: string;
  ngay_cap: string;
  hieu_luc: string;
  trang_thai: 'Hợp lệ' | 'Thu hồi';
}

@Injectable()
export class LookupService {
  // 1. Dữ liệu mẫu Văn bằng tốt nghiệp NCTU
  private vanBangDb: VanBangRecord[] = [
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

  // 2. Dữ liệu mẫu Chứng chỉ Ứng dụng CNTT NCTU
  private cnttDb: CnttRecord[] = [
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

  // 3. Dữ liệu mẫu Chứng chỉ Ngoại ngữ VSTEP NCTU
  private vstepDb: VstepRecord[] = [
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

  // Helper chuẩn hoá chuỗi tiếng Việt: Bỏ dấu, giải mã Telex (dd, aa, aw, ee, oo, ow, uw, w, sfrxjz),
  // khử lỗi lặp phím (ttra -> tra, ddi -> di), hỗ trợ tìm kiếm không dấu và xử lý lỗi gõ phím
  public normalizeVietnamese(input: string): string {
    if (!input) return '';
    let str = input.toLowerCase().trim();

    // 1. Chuyển đổi tổ hợp phím Telex
    str = str.replace(/dd/g, 'd');
    str = str.replace(/\btt(?=[raieouy])/g, 't');
    str = str.replace(/\bcc(?=[raieouy])/g, 'c');
    str = str.replace(/\bnn(?=[raieouy])/g, 'n');
    str = str.replace(/\bmm(?=[raieouy])/g, 'm');
    str = str.replace(/uow/g, 'uo');
    str = str.replace(/uoo/g, 'uo');
    str = str.replace(/uw/g, 'u');
    str = str.replace(/ow/g, 'o');
    str = str.replace(/aa/g, 'a');
    str = str.replace(/aw/g, 'a');
    str = str.replace(/ee/g, 'e');
    str = str.replace(/oo/g, 'o');
    str = str.replace(/w/g, 'u');

    // 2. Unicode NFD & bóc tách toàn bộ dấu thanh/mũ
    str = str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd');

    // 3. Xử lý dấu thanh Telex ở cuối âm tiết (s, f, r, x, j, z)
    str = str
      .split(/\s+/)
      .map((word) => {
        let w = word.replace(/([aeiouy]+)[sfrxjz](\b|$)/g, '$1');
        w = w.replace(/([aeiouy]+[b-df-hj-np-tv-z]+)[sfrxjz](\b|$)/g, '$1');
        return w;
      })
      .join(' ');

    return str.replace(/\s+/g, ' ').trim();
  }

  private normalizeString(str: string): string {
    return this.normalizeVietnamese(str);
  }

  // Helper chuẩn hoá chuỗi ngày sinh (hỗ trợ cả YYYY-MM-DD và DD/MM/YYYY)
  private matchDate(dbDate: string, queryDate: string): boolean {
    if (!queryDate) return true;
    if (!dbDate) return false;
    const cleanDb = dbDate.replace(/[-/]/g, '').trim();
    const cleanQ = queryDate.replace(/[-/]/g, '').trim();
    if (cleanDb === cleanQ) return true;
    if (dbDate.includes('-')) {
      const parts = dbDate.split('-');
      if (parts.length === 3) {
        const [y, m, d] = parts;
        if (`${d}${m}${y}` === cleanQ || `${y}${m}${d}` === cleanQ) return true;
      }
    }
    if (dbDate.includes('/')) {
      const parts = dbDate.split('/');
      if (parts.length === 3) {
        const [d, m, y] = parts;
        if (`${y}${m}${d}` === cleanQ || `${d}${m}${y}` === cleanQ) return true;
      }
    }
    return false;
  }

  // Tra cứu Văn Bằng (Khớp chính xác Họ tên, Ngày sinh, Số hiệu phôi, Số vào sổ)
  traCuuVanBang(query: {
    loai_dao_tao?: string;
    ho_ten: string;
    ngay_sinh: string;
    so_hieu_phoi?: string;
    so_vao_so?: string;
  }): VanBangRecord {
    const qHoten = this.normalizeString(query.ho_ten || '');
    const qNgaysinh = query.ngay_sinh?.trim() || '';
    const qPhoi = query.so_hieu_phoi?.trim().toLowerCase();
    const qSo = query.so_vao_so?.trim().toLowerCase();
    const qLoai = query.loai_dao_tao?.trim();

    if (!qHoten) {
      throw new NotFoundException('Vui lòng nhập Họ và tên để tra cứu.');
    }
    if (!qNgaysinh) {
      throw new NotFoundException('Vui lòng chọn Ngày sinh để tra cứu.');
    }
    if (!qPhoi && !qSo) {
      throw new NotFoundException('Vui lòng nhập Số hiệu phôi hoặc Số vào sổ cấp bằng.');
    }

    const record = this.vanBangDb.find((item) => {
      // 1. Họ tên: Phải khớp chính xác tên (chuẩn hóa không dấu)
      const normDbName = this.normalizeString(item.ho_ten);
      const matchName = normDbName === qHoten;

      // 2. Ngày sinh: Phải khớp đúng ngày sinh
      const matchBirth = this.matchDate(item.ngay_sinh, qNgaysinh);

      // 3. Loại đào tạo (nếu có chọn)
      const matchLoai = !qLoai || item.loai_dao_tao === qLoai;

      // 4. Số hiệu phôi: Nếu có nhập thì bắt buộc PHẢI KHỚP CHÍNH XÁC
      const matchPhoi = qPhoi ? item.so_hieu_phoi.toLowerCase() === qPhoi : true;

      // 5. Số vào sổ: Nếu có nhập thì bắt buộc PHẢI KHỚP CHÍNH XÁC (linh hoạt cả NCTU- và DNC-)
      const normDbSo = item.so_vao_so.toLowerCase().replace(/^(nctu|dnc)-/, '');
      const normQSo = qSo ? qSo.replace(/^(nctu|dnc)-/, '') : '';
      const matchSo = qSo ? (item.so_vao_so.toLowerCase() === qSo || normDbSo === normQSo) : true;

      return matchName && matchBirth && matchLoai && matchPhoi && matchSo;
    });

    if (!record) {
      throw new NotFoundException('Không tìm thấy thông tin văn bằng phù hợp. Vui lòng kiểm tra lại Họ tên, Ngày sinh hoặc Số hiệu phôi.');
    }

    return record;
  }

  // Tra cứu CNTT (Bắt buộc Họ tên, Ngày sinh, Số hiệu phôi hoặc Số vào sổ)
  traCuuCntt(query: {
    so_hieu_phoi: string;
    cap_do?: string;
    ho_ten?: string;
    ngay_sinh?: string;
    so_vao_so?: string;
  }): CnttRecord {
    const qKey = query.so_hieu_phoi?.trim().toLowerCase();
    const qCapDo = query.cap_do?.trim().toLowerCase();
    const qHoten = this.normalizeString(query.ho_ten || '');
    const qNgaysinh = query.ngay_sinh?.trim() || '';
    const qSoVaoSo = query.so_vao_so?.trim().toLowerCase();

    if (!qHoten) {
      throw new NotFoundException('Vui lòng nhập Họ và tên để tra cứu.');
    }
    if (!qNgaysinh) {
      throw new NotFoundException('Vui lòng chọn Ngày sinh để tra cứu.');
    }
    if (!qKey && !qSoVaoSo) {
      throw new NotFoundException('Vui lòng nhập Số hiệu phôi hoặc Số vào sổ cấp chứng chỉ.');
    }

    const record = this.cnttDb.find((item) => {
      // 1. Họ tên: Bắt buộc khớp chính xác
      const normDbName = this.normalizeString(item.ho_ten);
      const matchName = normDbName === qHoten;

      // 2. Ngày sinh: Bắt buộc khớp đúng ngày sinh
      const matchBirth = this.matchDate(item.ngay_sinh, qNgaysinh);

      // 3. Cấp độ (nếu có chọn)
      const matchCapDo = !qCapDo || item.cap_do === qCapDo;

      // 4. Số hiệu phôi
      const matchPhoi = qKey ? (item.so_hieu_phoi.toLowerCase() === qKey || item.so_cccd.toLowerCase() === qKey) : true;

      // 5. Số vào sổ
      const matchVaoSo = qSoVaoSo ? item.so_vao_so.toLowerCase() === qSoVaoSo : true;

      return matchName && matchBirth && matchCapDo && matchPhoi && matchVaoSo;
    });

    if (!record) {
      throw new NotFoundException(
        'Không tìm thấy chứng chỉ CNTT phù hợp. Vui lòng kiểm tra lại Họ tên, Ngày sinh, Số hiệu phôi hoặc Số vào sổ.',
      );
    }

    return record;
  }

  // Tra cứu VSTEP (Bắt buộc Họ tên, Ngày sinh, Số hiệu phôi hoặc Số vào sổ / Số báo danh)
  traCuuVstep(query: {
    so_hieu_phoi: string;
    ho_ten?: string;
    ngay_sinh?: string;
    so_bao_danh?: string;
    so_vao_so?: string;
  }): VstepRecord {
    const qKey = query.so_hieu_phoi?.trim().toLowerCase();
    const qHoten = this.normalizeString(query.ho_ten || '');
    const qNgaysinh = query.ngay_sinh?.trim() || '';
    const qSbd = query.so_bao_danh?.trim().toLowerCase();
    const qSoVaoSo = query.so_vao_so?.trim().toLowerCase();

    if (!qHoten) {
      throw new NotFoundException('Vui lòng nhập Họ và tên để tra cứu.');
    }
    if (!qNgaysinh) {
      throw new NotFoundException('Vui lòng chọn Ngày sinh để tra cứu.');
    }
    if (!qKey && !qSbd && !qSoVaoSo) {
      throw new NotFoundException('Vui lòng nhập Số hiệu phôi hoặc Số vào sổ để tra cứu.');
    }

    const record = this.vstepDb.find((item) => {
      // 1. Họ tên: Bắt buộc khớp chính xác
      const normDbName = this.normalizeString(item.ho_ten);
      const matchName = normDbName === qHoten;

      // 2. Ngày sinh: Bắt buộc khớp đúng ngày sinh
      const matchBirth = this.matchDate(item.ngay_sinh, qNgaysinh);

      // 3. Số hiệu phôi / CCCD
      const matchPhoi = qKey ? (item.so_hieu_phoi.toLowerCase() === qKey || item.so_cccd.toLowerCase() === qKey || item.so_bao_danh.toLowerCase() === qKey) : true;

      // 4. Số báo danh
      const matchSbd = qSbd ? (item.so_bao_danh.toLowerCase() === qSbd || item.so_vao_so.toLowerCase() === qSbd) : true;

      // 5. Số vào sổ
      const matchVaoSo = qSoVaoSo ? (item.so_vao_so.toLowerCase() === qSoVaoSo || item.so_bao_danh.toLowerCase() === qSoVaoSo) : true;

      return matchName && matchBirth && matchPhoi && (qSoVaoSo ? matchVaoSo : matchSbd);
    });

    if (!record) {
      throw new NotFoundException(
        'Không tìm thấy chứng chỉ VSTEP phù hợp. Vui lòng kiểm tra lại Họ tên, Ngày sinh hoặc Số hiệu phôi / Số vào sổ.',
      );
    }

    return record;
  }

  // Dữ liệu gợi ý để test nhanh (Quick fill samples) với đầy đủ trường thông tin
  getSampleData() {
    return {
      vanbang: this.vanBangDb.map((item) => ({
        label: `${item.ho_ten} - ${item.nganh_dao_tao} (${item.ten_van_bang})`,
        badge: item.loai_dao_tao === 'ths' ? 'Thạc sĩ' : item.loai_dao_tao === 'ts' ? 'Tiến sĩ' : item.loai_dao_tao === 'cd' ? 'Cao đẳng' : 'Đại học',
        ...item,
      })),
      cntt: this.cnttDb.map((item) => ({
        label: `${item.ho_ten} - ${item.ten_chung_chi}`,
        badge: item.cap_do === 'nangcao' ? 'Nâng cao' : 'Cơ bản',
        ...item,
      })),
      vstep: this.vstepDb.map((item) => ({
        label: `${item.ho_ten} - ${item.ten_chung_chi} (${item.bac_nang_luc})`,
        badge: item.bac_nang_luc,
        ...item,
      })),
    };
  }

  // Thống kê hệ thống
  getStats() {
    return {
      tong_van_bang_da_cap: 35820,
      tong_chung_chi_cntt: 28410,
      luot_tra_cuu_hom_nay: 1248,
      ti_le_xac_thuc_chinh_xac: '100%',
      thoi_gian_cap_nhat: new Date().toISOString(),
    };
  }

  // Tìm kiếm tức thì chuẩn Apple Spotlight Search: Bỏ dấu, giải mã Telex, đi thành công
  spotlightSearch(query: string, tab?: 'vanbang' | 'cntt' | 'vstep' | 'all') {
    if (!query || query.trim().length < 2) return [];
    const qNorm = this.normalizeVietnamese(query);
    const qRaw = query.trim().toLowerCase();

    const results: Array<{
      type: 'vanbang' | 'cntt' | 'vstep';
      id: string;
      title: string;
      subTitle: string;
      ho_ten: string;
      so_hieu_phoi: string;
      so_vao_so: string;
      data: any;
    }> = [];

    // Nhận diện từ khóa điều hướng Cổng Tra Cứu (ví dụ: "ttra cuus văn bàng chúng chỉ", "tra cuu van bang", "chung chi", "tot nghiep")
    const isPortalKeywords =
      qNorm.includes('tra cuu') ||
      qNorm.includes('van bang') ||
      qNorm.includes('chung chi') ||
      qNorm.includes('tot nghiep') ||
      qNorm.includes('dai hoc') ||
      qNorm.includes('di thanh cong') ||
      qNorm.includes('bang cap');

    // Nếu người dùng nhập ý định tra cứu chung của cổng -> Ưu tiên đưa 3 thẻ phân hệ điều hướng nhanh (đi thành công)
    if (isPortalKeywords) {
      // 1. Phân hệ Văn bằng
      if (!tab || tab === 'all' || tab === 'vanbang' || qNorm.includes('van bang') || qNorm.includes('tot nghiep') || qNorm.includes('dai hoc')) {
        results.push({
          type: 'vanbang',
          id: 'portal-vanbang',
          title: 'Cổng Tra Cứu Văn Bằng Tốt Nghiệp',
          subTitle: 'Đại học chính quy, Thạc sĩ, Tiến sĩ • ĐH Nam Cần Thơ (Sẵn sàng)',
          ho_ten: 'CỔNG TRA CỨU VĂN BẰNG',
          so_hieu_phoi: 'HỆ THỐNG CHÍNH THỨC',
          so_vao_so: 'NCTU-DNC',
          data: this.vanBangDb[2], // Mẫu Dương Thị Anh Thư
        });
      }

      // 2. Phân hệ CNTT
      if (!tab || tab === 'all' || tab === 'cntt' || qNorm.includes('cntt') || qNorm.includes('tin hoc') || qNorm.includes('chung chi')) {
        results.push({
          type: 'cntt',
          id: 'portal-cntt',
          title: 'Cổng Tra Cứu Chứng Chỉ Ứng Dụng CNTT',
          subTitle: 'Chứng chỉ Tin học Cơ bản & Nâng cao • Chuẩn Bộ TT&TT',
          ho_ten: 'CỔNG TRA CỨU CHỨNG CHỈ CNTT',
          so_hieu_phoi: 'CHỨNG CHỈ QUỐC GIA',
          so_vao_so: 'BỘ TT&TT',
          data: this.cnttDb[0], // Mẫu Nguyễn Thị Ngọc Châu
        });
      }

      // 3. Phân hệ VSTEP
      if (!tab || tab === 'all' || tab === 'vstep' || qNorm.includes('vstep') || qNorm.includes('tieng anh') || qNorm.includes('chung chi')) {
        results.push({
          type: 'vstep',
          id: 'portal-vstep',
          title: 'Cổng Tra Cứu Chứng Chỉ Tiếng Anh VSTEP',
          subTitle: 'Khung năng lực ngoại ngữ 6 bậc (Bậc 2 - Bậc 6) • Chuẩn Bộ GD&ĐT',
          ho_ten: 'CỔNG TRA CỨU VSTEP',
          so_hieu_phoi: 'VSTEP BẬC 2 - 6',
          so_vao_so: 'BỘ GD&ĐT',
          data: this.vstepDb[0], // Mẫu Nguyễn Văn An
        });
      }
    }

    // 1. Quét kho Văn bằng tốt nghiệp (khớp tên, phôi, số sổ, ngành, chuyên ngành, tên văn bằng)
    if (!tab || tab === 'all' || tab === 'vanbang' || (isPortalKeywords && (qNorm.includes('van bang') || qNorm.includes('dai hoc') || qNorm.includes('tot nghiep')))) {
      for (const item of this.vanBangDb) {
        const matchPhoi = item.so_hieu_phoi.toLowerCase().includes(qRaw);
        const matchSo = item.so_vao_so.toLowerCase().includes(qRaw);
        const matchName = this.normalizeVietnamese(item.ho_ten).includes(qNorm);
        const matchId = item.id.toLowerCase().includes(qRaw);
        const matchNganh = this.normalizeVietnamese(item.nganh_dao_tao).includes(qNorm);
        const matchVanBang = this.normalizeVietnamese(item.ten_van_bang).includes(qNorm);
        if (matchPhoi || matchSo || matchName || matchId || matchNganh || matchVanBang) {
          results.push({
            type: 'vanbang',
            id: item.id,
            title: item.ten_van_bang,
            subTitle: `Ngành: ${item.nganh_dao_tao} • Xếp loại: ${item.xep_loai} • Năm: ${item.nam_tot_nghiep}`,
            ho_ten: item.ho_ten,
            so_hieu_phoi: item.so_hieu_phoi,
            so_vao_so: item.so_vao_so,
            data: item,
          });
        }
      }
    }

    // 2. Quét kho Chứng chỉ CNTT
    if (!tab || tab === 'all' || tab === 'cntt' || (isPortalKeywords && (qNorm.includes('cntt') || qNorm.includes('tin hoc') || qNorm.includes('chung chi')))) {
      for (const item of this.cnttDb) {
        const matchPhoi = item.so_hieu_phoi.toLowerCase().includes(qRaw);
        const matchSo = item.so_vao_so.toLowerCase().includes(qRaw);
        const matchName = this.normalizeVietnamese(item.ho_ten).includes(qNorm);
        const matchCccd = item.so_cccd.toLowerCase().includes(qRaw);
        const matchCert = this.normalizeVietnamese(item.ten_chung_chi).includes(qNorm);
        if (matchPhoi || matchSo || matchName || matchCccd || matchCert) {
          results.push({
            type: 'cntt',
            id: item.id,
            title: item.ten_chung_chi,
            subTitle: `Cấp độ: ${item.cap_do === 'coban' ? 'Cơ bản' : 'Nâng cao'} • Điểm TK: ${item.diem_tong_ket}`,
            ho_ten: item.ho_ten,
            so_hieu_phoi: item.so_hieu_phoi,
            so_vao_so: item.so_vao_so,
            data: item,
          });
        }
      }
    }

    // 3. Quét kho Chứng chỉ VSTEP
    if (!tab || tab === 'all' || tab === 'vstep' || (isPortalKeywords && (qNorm.includes('vstep') || qNorm.includes('tieng anh') || qNorm.includes('chung chi')))) {
      for (const item of this.vstepDb) {
        const matchPhoi = item.so_hieu_phoi.toLowerCase().includes(qRaw);
        const matchSo = item.so_vao_so.toLowerCase().includes(qRaw);
        const matchName = this.normalizeVietnamese(item.ho_ten).includes(qNorm);
        const matchSbd = item.so_bao_danh.toLowerCase().includes(qRaw);
        const matchCert = this.normalizeVietnamese(item.ten_chung_chi).includes(qNorm);
        if (matchPhoi || matchSo || matchName || matchSbd || matchCert) {
          results.push({
            type: 'vstep',
            id: item.id,
            title: `${item.ten_chung_chi} (${item.bac_nang_luc})`,
            subTitle: `Điểm tổng: ${item.diem_tong} • Hội đồng thi: ${item.hoi_dong_thi}`,
            ho_ten: item.ho_ten,
            so_hieu_phoi: item.so_hieu_phoi,
            so_vao_so: item.so_vao_so,
            data: item,
          });
        }
      }
    }

    // Loại bỏ trùng lặp id nếu có
    const uniqueMap = new Map<string, (typeof results)[0]>();
    for (const r of results) {
      if (!uniqueMap.has(r.id)) {
        uniqueMap.set(r.id, r);
      }
    }

    // Giới hạn hiển thị: Tối đa 8 kết quả
    return Array.from(uniqueMap.values()).slice(0, 8);
  }
}

