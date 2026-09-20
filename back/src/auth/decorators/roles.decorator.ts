import { SetMetadata } from '@nestjs/common';
import { Papel } from '../../usuario/usuario.service';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Papel[]) =>
  SetMetadata(ROLES_KEY, roles);