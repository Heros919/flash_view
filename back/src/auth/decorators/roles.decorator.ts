import { SetMetadata } from '@nestjs/common';
import { Papel } from '../../usuario/usuario.service';

export const PAPEIS_KEY = 'papeis';
export const Papeis = (...papeis: Papel[]) => SetMetadata(PAPEIS_KEY, papeis);
