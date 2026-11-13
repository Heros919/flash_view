import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";

import type { UsuarioAutenticado } from "../usuario/usuario.service";
import type { FuncionarioAutenticado } from "../auth/strategies/jwt.strategy";

export type ResponsavelAutenticado =
  FuncionarioAutenticado | UsuarioAutenticado;

type PrismaFuncionarioLookup = {
  funcionario: {
    findUnique(args: {
      where: { id: string };
    }): Promise<{ id: string; cliente_id: number } | null>;
  };
  cliente: {
    findUnique(args: {
      where: { id: number };
      select: { id: true };
    }): Promise<{ id: number } | null>;
  };
};

export async function obterFuncionarioResponsavel(
  prisma: PrismaFuncionarioLookup,
  usuario: ResponsavelAutenticado,
  funcionarioId?: string,
  clienteId?: number,
) {
  if ("cliente_id" in usuario) {
    if (usuario.papel !== "FUNCIONARIO") {
      throw new ForbiddenException(
        "Esta conta não pode cadastrar blocos ou chapas.",
      );
    }

    const idSolicitado = funcionarioId?.trim();
    if (idSolicitado && idSolicitado !== usuario.id) {
      throw new ForbiddenException(
        "Funcionários só podem cadastrar blocos e chapas em seu próprio nome.",
      );
    }

    const clienteCadastroId = clienteId ?? usuario.cliente_id;
    if (clienteCadastroId !== usuario.cliente_id) {
      const cliente = await prisma.cliente.findUnique({
        where: { id: clienteCadastroId },
        select: { id: true },
      });

      if (!cliente) {
        throw new NotFoundException("Cliente não encontrado.");
      }

      return {
        id: usuario.id,
        cliente_id: cliente.id,
        usuario_id: null,
      };
    }

    return {
      id: usuario.id,
      cliente_id: usuario.cliente_id,
      usuario_id: null,
    };
  }

  if (usuario.papel === "ADMINISTRADOR") {
    if (funcionarioId?.trim()) {
      throw new BadRequestException(
        "Administradores devem usar o ID da própria conta, não o de um funcionário.",
      );
    }

    if (!Number.isSafeInteger(clienteId) || !clienteId) {
      throw new BadRequestException(
        "Selecione o cliente responsável pelo cadastro.",
      );
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
      select: { id: true },
    });

    if (!cliente) {
      throw new NotFoundException("Cliente não encontrado.");
    }

    return {
      id: null,
      cliente_id: cliente.id,
      usuario_id: usuario.id,
    };
  }

  if (usuario.papel !== "FINANCEIRO") {
    throw new ForbiddenException(
      "Esta conta não pode cadastrar blocos ou chapas.",
    );
  }

  const id = funcionarioId?.trim();
  if (!id) {
    throw new BadRequestException(
      "Informe o ID do funcionário responsável pelo cadastro.",
    );
  }

  const funcionario = await prisma.funcionario.findUnique({
    where: { id },
  });

  if (!funcionario) {
    throw new NotFoundException("Funcionário responsável não encontrado.");
  }

  return {
    id: funcionario.id,
    cliente_id: funcionario.cliente_id,
    usuario_id: null,
  };
}
