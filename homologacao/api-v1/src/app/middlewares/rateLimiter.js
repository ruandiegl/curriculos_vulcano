const buckets = new Map();

function getClientIp(req) {
  return req.ip ?? req.socket?.remoteAddress ?? 'unknown';
}

function cleanup(now) {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function rateLimiter({
  windowMs,
  max,
  message = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  keyGenerator,
}) {
  return (req, res, next) => {
    const now = Date.now();
    cleanup(now);

    const keys = keyGenerator?.(req) ?? [getClientIp(req)];
    const normalizedKeys = Array.isArray(keys) ? keys : [keys];
    const blockedBucket = normalizedKeys
      .map((key) => buckets.get(key))
      .find((bucket) => bucket && bucket.resetAt > now && bucket.count >= max);

    if (blockedBucket) {
      const retryAfter = Math.ceil((blockedBucket.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({ message });
    }

    for (const key of normalizedKeys) {
      const bucket = buckets.get(key);

      if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, {
          count: 1,
          resetAt: now + windowMs,
        });
      } else {
        bucket.count += 1;
      }
    }

    return next();
  };
}

export function authRateLimitKey(req) {
  const ip = getClientIp(req);
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';

  return email ? [`ip:${ip}`, `email:${email}`, `ip-email:${ip}:${email}`] : [`ip:${ip}`];
}
