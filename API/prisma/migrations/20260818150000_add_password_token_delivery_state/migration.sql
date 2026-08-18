ALTER TABLE "password_tokens"
ADD COLUMN "revoked_at" TIMESTAMP(3),
ADD COLUMN "delivery_status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN "provider_message_id" TEXT,
ADD COLUMN "idempotency_key" TEXT;

CREATE UNIQUE INDEX "password_tokens_idempotency_key_key"
ON "password_tokens"("idempotency_key");

CREATE INDEX "password_tokens_delivery_status_idx"
ON "password_tokens"("delivery_status");
