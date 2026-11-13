ALTER TABLE "bloco"
    ALTER COLUMN "funcionario_id" DROP NOT NULL,
    ADD COLUMN "usuario_id" INTEGER;

ALTER TABLE "bloco"
    ADD CONSTRAINT "fk_bloco_usuario"
        FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT "bloco_responsavel_check"
        CHECK (num_nonnulls("funcionario_id", "usuario_id") = 1);

CREATE INDEX "idx_bloco_usuario_id" ON "bloco"("usuario_id");

ALTER TABLE "chapa"
    ALTER COLUMN "funcionario_id" DROP NOT NULL,
    ADD COLUMN "usuario_id" INTEGER;

ALTER TABLE "chapa"
    ADD CONSTRAINT "fk_chapa_usuario"
        FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT "chapa_responsavel_check"
        CHECK (num_nonnulls("funcionario_id", "usuario_id") = 1);

CREATE INDEX "idx_chapa_usuario_id" ON "chapa"("usuario_id");
