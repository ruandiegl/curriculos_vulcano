import crypto from 'node:crypto';

function getBucketKey(name, key) {
  const digest = crypto
    .createHash('sha256')
    .update(`${name}:${String(key)}`)
    .digest('hex');

  return `${name}:${digest}`;
}

export function getClientIp(req) {
  return req.ip ?? req.socket?.remoteAddress ?? 'unknown';
}

export function createRateLimiterStore({ nowProvider = Date.now } = {}) {
  const buckets = new Map();

  function cleanup(now) {
    for (const [key, bucket] of buckets.entries()) {
      if (bucket.resetAt <= now) {
        buckets.delete(key);
      }
    }
  }

  function check({ name, keys, windowMs, max, now = nowProvider() }) {
    cleanup(now);

    const normalizedKeys = (Array.isArray(keys) ? keys : [keys])
      .filter((key) => key !== undefined && key !== null && String(key).length > 0)
      .map((key) => getBucketKey(name, key));

    const currentBuckets = normalizedKeys.map((key) => buckets.get(key));
    const blockedBucket = currentBuckets
      .find((bucket) => bucket && bucket.resetAt > now && bucket.count >= max);

    if (blockedBucket) {
      return {
        blocked: true,
        remaining: 0,
        resetAt: blockedBucket.resetAt,
      };
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

    const activeBuckets = normalizedKeys
      .map((key) => buckets.get(key))
      .filter(Boolean);
    const resetAt = Math.min(...activeBuckets.map((bucket) => bucket.resetAt));
    const remaining = Math.max(
      0,
      Math.min(...activeBuckets.map((bucket) => max - bucket.count)),
    );

    return { blocked: false, remaining, resetAt };
  }

  return {
    check,
    clear() {
      buckets.clear();
    },
    size() {
      return buckets.size;
    },
  };
}

function setRateLimitHeaders(res, { max, remaining, resetAt, blocked, now = Date.now() }) {
  res.set('RateLimit-Limit', String(max));
  res.set('RateLimit-Remaining', String(Math.max(0, remaining)));
  res.set('RateLimit-Reset', String(Math.ceil(resetAt / 1000)));

  if (blocked && resetAt > now) {
    res.set('Retry-After', String(Math.ceil((resetAt - now) / 1000)));
  }
}

export function rateLimiter({
  windowMs,
  max,
  message = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  keyGenerator,
  name = 'default',
  store = createRateLimiterStore(),
  nowProvider = Date.now,
}) {
  return (req, res, next) => {
    const now = nowProvider();
    const keys = keyGenerator?.(req) ?? [getClientIp(req)];
    const result = store.check({ name, keys, windowMs, max, now });

    setRateLimitHeaders(res, { ...result, max, now });

    if (result.blocked) {
      return res.status(429).json({ message });
    }

    return next();
  };
}

export function authRateLimitKey(req) {
  const ip = getClientIp(req);
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';

  return email ? [`ip:${ip}`, `email:${email}`, `ip-email:${ip}:${email}`] : [`ip:${ip}`];
}
