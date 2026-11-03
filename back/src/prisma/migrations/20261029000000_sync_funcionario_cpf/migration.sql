ALTER TABLE "funcionario" ADD COLUMN IF NOT EXISTS "cpf" VARCHAR(11);
CREATE UNIQUE INDEX IF NOT EXISTS "funcionario_cpf_key" ON "funcionario"("cpf");

ALTER TABLE "venda" DROP CONSTRAINT IF EXISTS "fk_venda_funcionario";
ALTER TABLE "venda" DROP CONSTRAINT IF EXISTS "fk_venda_usuario";
ALTER TABLE "venda"
  ADD CONSTRAINT "fk_venda_funcionario" FOREIGN KEY ("funcionario_id") REFERENCES "funcionario"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "fk_venda_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
