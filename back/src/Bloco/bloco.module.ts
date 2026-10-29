import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BlocosController } from './blocos.controller';
import { BlocosService } from './blocos.service';
@Module({
  imports: [AuthModule],
  controllers: [BlocosController],
  providers: [BlocosService]
})
export class BlocosModule {}
