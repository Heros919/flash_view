import { Module } from '@nestjs/common';
import { ChapasController } from './chapa.controller';
import { ChapasService } from './chapa.service';

@Module({
  controllers: [ChapasController],
  providers: [ChapasService],
})
export class ChapaModule {}