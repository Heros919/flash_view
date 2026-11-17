import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';
import { BootstrapContaDto } from './dto/bootstrap-conta.dto';
import { Public } from './decorators/public.decorator';
import { Papeis } from './decorators/roles.decorator';
import { Papel } from '../usuario/usuario.service';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('registrar')
  registrar(@Body() dto: RegistroDto) {
    return this.authService.registrar(dto);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })  // 5 tentativas por minuto
  @Post('bootstrap-admin')
  bootstrapAdmin(@Body() dto: BootstrapContaDto) {
    return this.authService.bootstrapAdministrador(dto, dto.chave);
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })  // 5 tentativas por minuto
  @Post('bootstrap-financeiro')
  bootstrapFinanceiro(@Body() dto: BootstrapContaDto) {
    return this.authService.bootstrapFinanceiro(dto, dto.chave);
  }

  @Public()

  @Throttle({ default: { limit: 5, ttl: 60000 } })  // 5 tentativas por minuto
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}