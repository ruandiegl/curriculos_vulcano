function getClientIp(req) {
  return req.ip ?? req.socket?.remoteAddress ?? null;
}

export function auditLog(req, action, details = {}) {
  const entry = {
    type: 'audit',
    timestamp: new Date().toISOString(),
    action,
    actorId: req.userId ?? null,
    actorTipo: req.userTipo ?? null,
    ip: getClientIp(req),
    userAgent: req.get?.('user-agent') ?? null,
    ...details,
  };

  console.info(JSON.stringify(entry));
}
