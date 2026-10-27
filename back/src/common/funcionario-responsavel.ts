import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import type { UsuarioAutenticado } from '../usuario/usuario.service';
import type { FuncionarioAutenticado } from '../auth/strategies/jwt.strategy';

type UsuarioQueCria = FuncionarioAutenticado | UsuarioAutenticado;
type PrismaFuncionarioLookup = {
  funcionario: {
    findUnique(args: {
      where: { id: string };
    }): Promise<{ id: string; cliente_id: number } | null>;
  };
};

export async function obterFuncionarioResponsavel(
  prisma: PrismaFuncionarioLookup,
  usuario: UsuarioQueCria,
  funcionarioId?: string,
) {
  if ('cliente_id' in usuario) {
    return {
      id: usuario.id,
      cliente_id: usuario.cliente_id,
    };
  }

  if (usuario.papel !== 'ADMINISTRADOR') {
    throw new ForbiddenException(
      'Somente funcionários ou administradores podem cadastrar produtos.',
    );
  }

  const id = funcionarioId?.trim();

  if (!id) {
    throw new BadRequestException(
      'Informe o ID do funcionário responsável pelo produto.',
    );
  }

  const funcionario = await prisma.funcionario.findUnique({
    where: { id },
  });

  if (!funcionario) {
    throw new NotFoundException('Funcionário responsável não encontrado.');
  }

  return {
    id: funcionario.id,
    cliente_id: funcionario.cliente_id,
  };
}
