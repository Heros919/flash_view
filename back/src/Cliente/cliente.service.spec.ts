jest.mock('../generated/prisma/client', () => ({
  PrismaClient: class PrismaClient {},
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {},
  },
}));

import { ClienteService } from './cliente.service';
import type { PrismaService } from '../prisma/prisma.service';

describe('ClienteService', () => {
  const findMany = jest.fn();
  const prisma = {
    cliente: { findMany },
  } as unknown as PrismaService;
  const service = new ClienteService(prisma);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('keeps the existing full list endpoint unchanged', async () => {
    findMany.mockResolvedValue([]);

    await expect(service.listar()).resolves.toEqual([]);
    expect(findMany).toHaveBeenCalledWith();
  });

  it('limits search results and supports names, CPF, and numeric IDs', async () => {
    findMany.mockResolvedValue([]);

    await service.buscar('123');

    expect(findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { nome: { contains: '123', mode: 'insensitive' } },
          { cpf: { contains: '123' } },
          { id: 123 },
        ],
      },
      orderBy: { nome: 'asc' },
      take: 20,
      select: { id: true, nome: true },
    });
  });

  it('avoids searching one-character text terms', async () => {
    await expect(service.buscar(' a ')).resolves.toEqual([]);
    expect(findMany).not.toHaveBeenCalled();
  });
});
