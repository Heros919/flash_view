import { Module } from '@nestjs/common';
import { ChapasController } from './chapas.controller';
import { ChapasService } from './chapas.service';

@Module({
  controllers: [ChapasController],
  providers: [ChapasService]
})
export class ChapasModule {}
