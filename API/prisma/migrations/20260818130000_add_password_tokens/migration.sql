CREATE TABLE "password_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usuario_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "password_tokens_token_hash_key" ON "password_tokens"("token_hash");
CREATE INDEX "password_tokens_usuario_id_purpose_idx" ON "password_tokens"("usuario_id", "purpose");
CREATE INDEX "password_tokens_expires_at_idx" ON "password_tokens"("expires_at");

ALTER TABLE "password_tokens"
ADD CONSTRAINT "password_tokens_usuario_id_fkey"
FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
