import { Body, Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { LookupService } from './lookup.service';

@Controller('tracuu')
export class LookupController {
  constructor(private readonly lookupService: LookupService) {}

  @Post('vanbang')
  @HttpCode(HttpStatus.OK)
  traCuuVanBang(
    @Body()
    body: {
      loai_dao_tao?: string;
      ho_ten: string;
      ngay_sinh: string;
      so_hieu_phoi?: string;
      so_vao_so?: string;
    },
  ) {
    const data = this.lookupService.traCuuVanBang(body);
    return {
      success: true,
      message: 'Tra cứu thông tin văn bằng thành công!',
      timestamp: new Date().toISOString(),
      data,
    };
  }

  @Post('cntt')
  @HttpCode(HttpStatus.OK)
  traCuuCntt(
    @Body()
    body: {
      so_hieu_phoi: string;
      cap_do?: string;
      ho_ten?: string;
      ngay_sinh?: string;
    },
  ) {
    const data = this.lookupService.traCuuCntt(body);
    return {
      success: true,
      message: 'Tra cứu chứng chỉ CNTT thành công!',
      timestamp: new Date().toISOString(),
      data,
    };
  }

  @Post('vstep')
  @HttpCode(HttpStatus.OK)
  traCuuVstep(
    @Body()
    body: {
      so_hieu_phoi: string;
      ho_ten?: string;
      ngay_sinh?: string;
    },
  ) {
    const data = this.lookupService.traCuuVstep(body);
    return {
      success: true,
      message: 'Tra cứu chứng chỉ VSTEP thành công!',
      timestamp: new Date().toISOString(),
      data,
    };
  }

  @Get('sample-data')
  getSampleData() {
    return {
      success: true,
      data: this.lookupService.getSampleData(),
    };
  }

  @Get('stats')
  getStats() {
    return {
      success: true,
      data: this.lookupService.getStats(),
    };
  }
}
