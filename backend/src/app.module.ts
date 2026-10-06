import { Module } from '@nestjs/common';
import { LookupModule } from './lookup/lookup.module';

@Module({
  imports: [LookupModule],
})
export class AppModule {}
