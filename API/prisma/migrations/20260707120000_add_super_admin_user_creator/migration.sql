ALTER TABLE usuarios
ADD COLUMN created_by_id UUID;

ALTER TABLE usuarios
ADD CONSTRAINT usuarios_created_by_id_fkey
FOREIGN KEY (created_by_id) REFERENCES usuarios(id)
ON DELETE SET NULL
ON UPDATE CASCADE;

CREATE INDEX usuarios_created_by_id_idx ON usuarios(created_by_id);
