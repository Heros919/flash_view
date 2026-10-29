ALTER TABLE "venda"
  DROP CONSTRAINT IF EXISTS "fk_venda_funcionario_cliente",
  ALTER COLUMN "funcionario_id" DROP NOT NULL,
  ADD COLUMN "usuario_id" INTEGER;

ALTER TABLE "venda"
  ADD CONSTRAINT "fk_venda_funcionario"
    FOREIGN KEY ("funcionario_id") REFERENCES "funcionario"("id"),
  ADD CONSTRAINT "fk_venda_usuario"
    FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id"),
  ADD CONSTRAINT "venda_responsavel_check"
    CHECK (("funcionario_id" IS NOT NULL) <> ("usuario_id" IS NOT NULL));

CREATE INDEX "idx_venda_usuario_id" ON "venda"("usuario_id");
