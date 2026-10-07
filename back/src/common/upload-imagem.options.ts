import { BadRequestException } from '@nestjs/common';

// Tipo mínimo do arquivo enviado pelo multer (não depende de @types/multer).
export interface ArquivoImagem {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export const CAMPO_IMAGEM = 'imagem';

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