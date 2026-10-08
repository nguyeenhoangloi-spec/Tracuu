import { NextRequest, NextResponse } from 'next/server';
import {
  traCuuVanBang,
  traCuuCntt,
  traCuuVstep,
  getSampleData,
  getStats,
  VAN_BANG_DB,
  CNTT_DB,
  VSTEP_DB,
  normalizeString,
} from '@/lib/lookup-data';

const BACKEND_BASE = 'http://127.0.0.1:3001';

async function tryProxy(req: NextRequest, subPath: string) {
  try {
    const url = `${BACKEND_BASE}/api/tracuu/${subPath}${req.nextUrl.search}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 400);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    let body: any = undefined;
    if (req.method === 'POST') {
      try {
        body = await req.clone().text();
      } catch {
        // ignore
      }
    }

    const res = await fetch(url, {
      method: req.method,
      headers,
      body: body || undefined,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.status < 500) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
  } catch {
    // Backend offline or timeout -> gracefully fallback to local service
  }
  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const pathArr = params.path || [];
  const action = pathArr[0];

  // 1. Thử gọi backend NestJS nếu đang chạy
  const proxyRes = await tryProxy(req, pathArr.join('/'));
  if (proxyRes) return proxyRes;

  // 2. Fallback nội bộ trực tiếp
  if (action === 'sample-data') {
    return NextResponse.json({
      success: true,
      data: getSampleData(),
    });
  }

  if (action === 'stats') {
    return NextResponse.json({
      success: true,
      data: getStats(),
    });
  }

  if (action === 'spotlight') {
    const q = req.nextUrl.searchParams.get('q') || '';
    const cleanQ = normalizeString(q);
    const results: any[] = [];

    if (cleanQ) {
      for (const vb of VAN_BANG_DB) {
        if (
          normalizeString(vb.ho_ten).includes(cleanQ) ||
          vb.so_hieu_phoi.toLowerCase().includes(cleanQ) ||
          vb.so_vao_so.toLowerCase().includes(cleanQ)
        ) {
          results.push({ type: 'vanbang', ...vb });
        }
      }
      for (const c of CNTT_DB) {
        if (
          normalizeString(c.ho_ten).includes(cleanQ) ||
          c.so_hieu_phoi.toLowerCase().includes(cleanQ) ||
          c.so_vao_so.toLowerCase().includes(cleanQ)
        ) {
          results.push({ type: 'cntt', ...c });
        }
      }
      for (const v of VSTEP_DB) {
        if (
          normalizeString(v.ho_ten).includes(cleanQ) ||
          v.so_hieu_phoi.toLowerCase().includes(cleanQ) ||
          v.so_vao_so.toLowerCase().includes(cleanQ)
        ) {
          results.push({ type: 'vstep', ...v });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  }

  return NextResponse.json({ success: true, message: 'NCTU Tra Cuu API' });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const pathArr = params.path || [];
  const action = pathArr[0];

  // 1. Thử gọi backend NestJS nếu đang chạy
  const proxyRes = await tryProxy(req, pathArr.join('/'));
  if (proxyRes) return proxyRes;

  // 2. Fallback nội bộ trực tiếp
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  try {
    if (action === 'vanbang') {
      const data = traCuuVanBang(body);
      return NextResponse.json({
        success: true,
        message: 'Tra cứu thông tin văn bằng thành công!',
        timestamp: new Date().toISOString(),
        data,
      });
    }

    if (action === 'cntt') {
      const data = traCuuCntt(body);
      return NextResponse.json({
        success: true,
        message: 'Tra cứu chứng chỉ CNTT thành công!',
        timestamp: new Date().toISOString(),
        data,
      });
    }

    if (action === 'vstep') {
      const data = traCuuVstep(body);
      return NextResponse.json({
        success: true,
        message: 'Tra cứu chứng chỉ VSTEP thành công!',
        timestamp: new Date().toISOString(),
        data,
      });
    }

    return NextResponse.json(
      { message: 'Chức năng tra cứu không tồn tại.' },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        message: err.message || 'Không tìm thấy hồ sơ phù hợp.',
        statusCode: 404,
      },
      { status: 404 }
    );
  }
}
