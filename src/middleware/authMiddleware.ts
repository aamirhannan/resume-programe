
import { Request, Response, NextFunction } from 'express';
import { supabase } from '#src/config/supabase';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Forbidden: Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Forbidden: Token missing' });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Auth Middleware Error:', error);
      return res.status(401).json({ error: 'Forbidden: Invalid token' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Middleware Unexpected Error:', err);
    return res.status(401).json({ error: 'Forbidden: Internal auth error' });
  }
};
