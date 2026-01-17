import { Request, Response, NextFunction } from 'express';
import { createAuthenticatedClient } from '#src/config/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

// Extend Express Request to include user and scoped supabase client
declare global {
  namespace Express {
    interface Request {
      user?: any;
      supabase?: SupabaseClient;
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

    // Create a client scoped to this user
    const scopedSupabase = createAuthenticatedClient(token);

    // Verify token with Supabase (using the scoped client checks the token validity too)
    const { data: { user }, error } = await scopedSupabase.auth.getUser();

    if (error || !user) {
      console.error('Auth Middleware Error:', error);
      return res.status(401).json({ error: 'Forbidden: Invalid token' });
    }

    // Attach user and scoped client to request object
    req.user = user;
    req.supabase = scopedSupabase;
    
    next();
  } catch (err) {
    console.error('Auth Middleware Unexpected Error:', err);
    return res.status(401).json({ error: 'Forbidden: Internal auth error' });
  }
};
