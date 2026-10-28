import { Module } from '@nestjs/common';

import { UsuarioService } from './usuario.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsuarioController } from './usuario.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsuarioController],
  providers: [UsuarioService, PrismaService],
  exports: [UsuarioService],
})
export class UsuarioModule {}