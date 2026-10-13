import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ChapasController } from './chapas.controller';
import { ChapasService } from './chapas.service';

@Module({
  imports: [AuthModule],
  controllers: [ChapasController],
  providers: [ChapasService]
})
export class ChapasModule {}
