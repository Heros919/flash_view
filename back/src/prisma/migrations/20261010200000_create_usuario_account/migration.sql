CREATE TYPE "PapelConta" AS ENUM ('FUNCIONARIO');

CREATE TABLE "usuario" (
    "cpf" VARCHAR(11) NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "papel" "PapelConta" NOT NULL DEFAULT 'FUNCIONARIO',
    "datacadastro" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("cpf")
);

CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
