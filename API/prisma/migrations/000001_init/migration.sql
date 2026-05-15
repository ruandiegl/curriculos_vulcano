CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    pass_hash TEXT,
    cpf TEXT UNIQUE,
    tipo TEXT DEFAULT 'usuario',
    possui_curriculo BOOLEAN DEFAULT false,
    data_check DATE,
    hora_check TIME,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE curriculos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    cpf TEXT UNIQUE,
    rg TEXT,
    nascimento DATE,
    estado_civil TEXT,
    email TEXT,
    celular TEXT,
    telefone TEXT,
    possui_cnh BOOLEAN DEFAULT false,
    categoria_cnh TEXT,
    numero_cnh TEXT,
    vencimento_cnh DATE,
    curso_ativo BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'visualizado',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE enderecos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculo_id UUID NOT NULL REFERENCES curriculos(id) ON DELETE CASCADE,
    rua TEXT,
    numero TEXT,
    complemento TEXT,
    bairro TEXT,
    cidade TEXT,
    estado TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE atuacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculo_id UUID NOT NULL REFERENCES curriculos(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    prioridade INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculo_id UUID NOT NULL REFERENCES curriculos(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    instituicao TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE experiencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculo_id UUID NOT NULL REFERENCES curriculos(id) ON DELETE CASCADE,
    empresa TEXT NOT NULL,
    cargo TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE escolaridades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curriculo_id UUID NOT NULL REFERENCES curriculos(id) ON DELETE CASCADE,
    escola TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE vagas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    cidade TEXT,
    estado TEXT,
    ativa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE candidaturas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    vaga_id UUID NOT NULL REFERENCES vagas(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(usuario_id, vaga_id)
);

CREATE TABLE novidades_usuario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    vaga_id UUID NOT NULL REFERENCES vagas(id) ON DELETE CASCADE,
    visualizado BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_curriculos_usuario_id ON curriculos(usuario_id);
CREATE INDEX idx_curriculos_status ON curriculos(status);
CREATE INDEX idx_enderecos_curriculo_id ON enderecos(curriculo_id);
CREATE INDEX idx_atuacoes_curriculo_id ON atuacoes(curriculo_id);
CREATE INDEX idx_cursos_curriculo_id ON cursos(curriculo_id);
CREATE INDEX idx_experiencias_curriculo_id ON experiencias(curriculo_id);
CREATE INDEX idx_escolaridades_curriculo_id ON escolaridades(curriculo_id);
CREATE INDEX idx_candidaturas_usuario_id ON candidaturas(usuario_id);
CREATE INDEX idx_candidaturas_vaga_id ON candidaturas(vaga_id);

CREATE INDEX idx_usuarios_nome_trgm ON usuarios USING GIN (nome gin_trgm_ops);
CREATE INDEX idx_usuarios_email_trgm ON usuarios USING GIN (email gin_trgm_ops);
CREATE INDEX idx_curriculos_nome_trgm ON curriculos USING GIN (nome gin_trgm_ops);
CREATE INDEX idx_curriculos_email_trgm ON curriculos USING GIN (email gin_trgm_ops);
CREATE INDEX idx_curriculos_cpf_trgm ON curriculos USING GIN (cpf gin_trgm_ops);
CREATE INDEX idx_enderecos_cidade_trgm ON enderecos USING GIN (cidade gin_trgm_ops);
CREATE INDEX idx_atuacoes_nome_trgm ON atuacoes USING GIN (nome gin_trgm_ops);
CREATE INDEX idx_cursos_nome_trgm ON cursos USING GIN (nome gin_trgm_ops);
CREATE INDEX idx_experiencias_empresa_trgm ON experiencias USING GIN (empresa gin_trgm_ops);
CREATE INDEX idx_experiencias_cargo_trgm ON experiencias USING GIN (cargo gin_trgm_ops);
CREATE INDEX idx_escolaridades_escola_trgm ON escolaridades USING GIN (escola gin_trgm_ops);
CREATE INDEX idx_vagas_titulo_trgm ON vagas USING GIN (titulo gin_trgm_ops);
