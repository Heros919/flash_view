import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { VendasController } from './vendas.controller';
import { VendasService } from './vendas.service';

@Module({
  imports: [AuthModule],
  controllers: [VendasController],
  providers: [VendasService],
})
export class VendasModule {}
