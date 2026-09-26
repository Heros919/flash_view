import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Papel, UsuarioAutenticado } from '../../usuario/usuario.service';
import { PAPEIS_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const papeisPermitidos = this.reflector.getAllAndOverride<Papel[]>(
      PAPEIS_KEY,
      [context.getHandler(), context.getClass()]
    );
    // Sem @Papeis(): basta estar autenticado
    if (!papeisPermitidos || papeisPermitidos.length === 0) return true;

    const { user } = context
      .switchToHttp()
      .getRequest<{ user?: UsuarioAutenticado }>();
    if (!user) return false;

    // Administrador tem acesso total
    if (user.papel === Papel.Administrador) return true;
    return papeisPermitidos.includes(user.papel);
  }
}
