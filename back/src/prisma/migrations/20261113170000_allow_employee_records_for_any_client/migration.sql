ALTER TABLE "bloco"
    DROP CONSTRAINT "fk_bloco_funcionario",
    ADD CONSTRAINT "fk_bloco_funcionario"
        FOREIGN KEY ("funcionario_id") REFERENCES "funcionario"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "chapa"
    DROP CONSTRAINT "fk_chapa_funcionario",
    ADD CONSTRAINT "fk_chapa_funcionario"
        FOREIGN KEY ("funcionario_id") REFERENCES "funcionario"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
