import { BadRequestException } from '@nestjs/common';


export interface ArquivoImagem {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export const CAMPO_IMAGEM = 'imagem';
export const CAMPO_IMAGENS = 'imagens';
export const MAX_IMAGENS = 5;

export const opcoesUploadImagem = {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (
    _req: unknown,
    file: { mimetype: string },
    callback: (erro: Error | null, aceitar: boolean) => void,
  ) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(
        new BadRequestException('O arquivo precisa ser uma imagem.'),
        false,
      );
    }

    callback(null, true);
  },
};