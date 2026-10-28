import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PapelConta } from '../generated/prisma/enums';
import { obterFuncionarioResponsavel } from './funcionario-responsavel';

describe('obterFuncionarioResponsavel', () => {
  const funcionarioFindUnique = jest.fn();
  const prisma = {
    funcionario: {
      findUnique: funcionarioFindUnique,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses the authenticated employee for employee registrations', async () => {
    const responsavel = await obterFuncionarioResponsavel(prisma, {
      id: 'funcionario-1',
      cpf: '12345678901',
      nome: 'Pessoa Teste',
      email: 'pessoa@exemplo.com',
      cliente_id: 7,
      admin_id: 1,
      papel: PapelConta.FUNCIONARIO,
    });

    expect(responsavel).toEqual({
      id: 'funcionario-1',
      cliente_id: 7,
    });
    expect(funcionarioFindUnique).not.toHaveBeenCalled();
  });

  it('resolves the selected employee for administrator registrations', async () => {
    funcionarioFindUnique.mockResolvedValue({
      id: 'funcionario-2',
      cliente_id: 8,
    });

    const responsavel = await obterFuncionarioResponsavel(
      prisma,
      {
        id: 2,
        cpf: '12345678901',
        nome: 'Admin',
        email: 'admin@exemplo.com',
        ativo: true,
        papel: PapelConta.ADMINISTRADOR,
      },
      ' funcionario-2 ',
    );

    expect(responsavel).toEqual({
      id: 'funcionario-2',
      cliente_id: 8,
    });
    expect(funcionarioFindUnique).toHaveBeenCalledWith({
      where: { id: 'funcionario-2' },
    });
  });

  it('requires an employee ID for administrator registrations', async () => {
    await expect(
      obterFuncionarioResponsavel(prisma, {
        id: 2,
        cpf: '12345678901',
        nome: 'Admin',
        email: 'admin@exemplo.com',
        ativo: true,
        papel: PapelConta.ADMINISTRADOR,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects unknown employee IDs', async () => {
    funcionarioFindUnique.mockResolvedValue(null);

    await expect(
      obterFuncionarioResponsavel(
        prisma,
        {
          id: 2,
          cpf: '12345678901',
          nome: 'Admin',
          email: 'admin@exemplo.com',
          ativo: true,
          papel: PapelConta.ADMINISTRADOR,
        },
        'nao-existe',
      ),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('resolves the selected employee for financial registrations', async () => {
    funcionarioFindUnique.mockResolvedValue({
      id: 'funcionario-3',
      cliente_id: 9,
    });

    await expect(
      obterFuncionarioResponsavel(
        prisma,
        {
          id: 3,
          cpf: '12345678901',
          nome: 'Financeiro',
          email: 'financeiro@exemplo.com',
          ativo: true,
          papel: PapelConta.FINANCEIRO,
        },
        'funcionario-3',
      ),
    ).resolves.toEqual({
      id: 'funcionario-3',
      cliente_id: 9,
    });
    expect(funcionarioFindUnique).toHaveBeenCalledWith({
      where: { id: 'funcionario-3' },
    });
  });
});
