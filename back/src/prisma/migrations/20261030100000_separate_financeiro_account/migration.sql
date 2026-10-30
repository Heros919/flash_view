CREATE TABLE "financeiro" (
    "id" SERIAL NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "datacadastro" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financeiro_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "financeiro_cpf_key" ON "financeiro"("cpf");
CREATE UNIQUE INDEX "financeiro_email_key" ON "financeiro"("email");

INSERT INTO "financeiro" ("id", "cpf", "nome", "email", "senha_hash", "ativo", "datacadastro")
SELECT "id", "cpf", "nome", "email", "senha_hash", "ativo", "datacadastro"
FROM "usuario"
WHERE "papel" = 'FINANCEIRO';

SELECT setval(
    pg_get_serial_sequence('"financeiro"', 'id'),
    COALESCE(MAX("id"), 1),
    MAX("id") IS NOT NULL
)
FROM "financeiro";

ALTER TABLE "venda"
    ADD COLUMN "financeiro_id" INTEGER;

ALTER TABLE "venda"
    DROP CONSTRAINT IF EXISTS "venda_responsavel_check";

UPDATE "venda" AS v
SET "financeiro_id" = u."id",
    "usuario_id" = NULL
FROM "usuario" AS u
WHERE v."usuario_id" = u."id"
  AND u."papel" = 'FINANCEIRO';

ALTER TABLE "venda"
    ADD CONSTRAINT "fk_venda_financeiro"
        FOREIGN KEY ("financeiro_id") REFERENCES "financeiro"("id"),
    ADD CONSTRAINT "venda_responsavel_check"
        CHECK (num_nonnulls("funcionario_id", "usuario_id", "financeiro_id") = 1);

CREATE INDEX "idx_venda_financeiro_id" ON "venda"("financeiro_id");

DELETE FROM "usuario"
WHERE "papel" = 'FINANCEIRO';
