import pkg from 'jsonwebtoken';
const { verify } = pkg
export const requireAuth = (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ msg: 'Unauthorized' });
    const token = auth.split(' ')[1];
    const decoded = verify(token, process.env.JWT_SECRET || 'secret');
    req.userId = decoded.id;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return res.status(401).json({ msg: 'JWT expired' });
    return res.status(401).json({ msg: 'Invalid Token' });
  }
};
