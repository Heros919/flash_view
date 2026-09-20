import {
  Controller,
  Post,
  UseGuards,
  Req,
  Get,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { UsuarioAutenticado } from 'src/usuario/usuario.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
type RequisicaoAutenticada = {
  user: UsuarioAutenticado;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Req() request: RequisicaoAutenticada) {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  perfil(@Req() request: RequisicaoAutenticada) {
    return request.user;
  }
}
