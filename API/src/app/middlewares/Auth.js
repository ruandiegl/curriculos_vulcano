import jwt from 'jsonwebtoken';

export function privateRoutes(req, res, next) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: 'Token não enviado.' });
  }

  const [scheme, token] = authToken.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Formato de token inválido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userTipo = decoded.tipo;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
}
