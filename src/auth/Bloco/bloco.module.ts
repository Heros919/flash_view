// blocos.module.ts
import { Module } from '@nestjs/common';
import { BlocosController } from './blocos.controller';
import { BlocosService } from './blocos.service';

@Module({
  controllers: [BlocosController],
  providers: [BlocosService]
})
export class BlocosModule {}
