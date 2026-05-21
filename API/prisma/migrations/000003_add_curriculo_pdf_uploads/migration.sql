CREATE TABLE IF NOT EXISTS curriculo_arquivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculo_id UUID NOT NULL REFERENCES curriculos(id) ON DELETE CASCADE,
    nome_original TEXT NOT NULL,
    nome_arquivo TEXT NOT NULL,
    caminho TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    tamanho INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_curriculo_arquivos_curriculo_id ON curriculo_arquivos(curriculo_id);
