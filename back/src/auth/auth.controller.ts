import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";

import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { RolesGuard } from "./guard/roles.guard";
import { Papeis } from "./decorators/roles.decorator";
import { RegistroDto } from "./dto/registro.dto";
import { LoginDto } from "./dto/login.dto";
import { BootstrapContaDto } from "./dto/bootstrap-conta.dto";
import { Papel } from "../usuario/usuario.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("registrar")
  registrar(@Body() dto: RegistroDto) {
    return this.authService.registrar(dto);
  }

  @Get("funcionarios-responsaveis")
  @Papeis(Papel.Administrador, Papel.Financeiro)
  @UseGuards(JwtAuthGuard, RolesGuard)
  listarFuncionariosResponsaveis() {
    return this.authService.listarFuncionariosResponsaveis();
  }

  @Post("bootstrap-admin")
  bootstrapAdmin(@Body() dto: BootstrapContaDto) {
    return this.authService.bootstrapAdministrador(dto, dto.chave);
  }

  @Post("bootstrap-financeiro")
  bootstrapFinanceiro(@Body() dto: BootstrapContaDto) {
    return this.authService.bootstrapFinanceiro(dto, dto.chave);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
