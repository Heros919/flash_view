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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('registrar')
  registrar(@Body() dto: RegistroDto) {
    return this.authService.registrar(dto);
  }

  @Post('bootstrap-admin')
  bootstrapAdmin(@Body() dto: BootstrapContaDto) {
    return this.authService.bootstrapAdministrador(dto, dto.chave);
  }

  @Post('bootstrap-financeiro')
  bootstrapFinanceiro(@Body() dto: BootstrapContaDto) {
    return this.authService.bootstrapFinanceiro(dto, dto.chave);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}