ALTER TABLE "cursos"
ADD COLUMN "carga_horaria" TEXT;

ALTER TABLE "experiencias"
ADD COLUMN "data_inicio" DATE,
ADD COLUMN "data_termino" DATE,
ADD COLUMN "funcoes" TEXT;

ALTER TABLE "escolaridades"
ADD COLUMN "curso" TEXT,
ADD COLUMN "data_inicio" DATE,
ADD COLUMN "data_termino" DATE;
