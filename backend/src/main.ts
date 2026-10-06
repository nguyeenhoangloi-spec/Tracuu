import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Kích hoạt CORS cho phép frontend Next.js gọi API mượt mà
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Thiết lập tiền tố toàn cục /api
  app.setGlobalPrefix('api');

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);
  console.log(`🚀 Hệ thống Tra cứu NCTU - Backend API đang chạy tại: http://localhost:${PORT}/api`);
}

bootstrap();
