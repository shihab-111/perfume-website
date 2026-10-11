import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUserByUid } from './src/db/users.ts';
import { createOrder, getOrdersByUserId, getRecentOrders } from './src/db/orders.ts';
import { createBespokeBlend, getBespokeBlendsByUserId, getAllReviews, addReview, toggleFavorite, getFavoritesByUserId } from './src/db/bespoke.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Sync authenticated Firebase user into Cloud SQL
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { email, uid, name, picture } = req.user;
      const user = await getOrCreateUser(uid, email || '', name, picture);
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Failed to sync user:', error);
      res.status(500).json({ error: 'Failed to sync user profile' });
    }
  });

  // Get current user profile + data
  app.get('/api/user/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const user = await getUserByUid(req.user.uid);
      if (!user) return res.status(404).json({ error: 'User not found in database' });

      const [userOrders, blends, favorites] = await Promise.all([
        getOrdersByUserId(user.id),
        getBespokeBlendsByUserId(user.id),
        getFavoritesByUserId(user.id),
      ]);

      res.json({ user, orders: userOrders, bespokeBlends: blends, favorites });
    } catch (error: any) {
      console.error('Failed to fetch user data:', error);
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  });

  // Orders
  app.get('/api/orders', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const user = await getUserByUid(req.user.uid);
      if (!user) return res.json([]);
      const orders = await getOrdersByUserId(user.id);
      res.json(orders);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const { customerName, customerEmail, items, totalAmount, currency, shippingAddress, engravingText, token } = req.body;
      
      let userId: number | undefined;
      if (token) {
        try {
          const { adminAuth } = await import('./src/lib/firebase-admin.ts');
          const decoded = await adminAuth.verifyIdToken(token);
          const dbUser = await getUserByUid(decoded.uid);
          if (dbUser) userId = dbUser.id;
        } catch {
          // Proceed as guest order if token verification fails
        }
      }

      const order = await createOrder({
        userId,
        customerName: customerName || 'Valued Guest',
        customerEmail: customerEmail || 'client@maison-toonhub.com',
        items: typeof items === 'string' ? items : JSON.stringify(items || []),
        totalAmount: Number(totalAmount) || 0,
        currency: currency || 'USD',
        shippingAddress: shippingAddress || '',
        engravingText: engravingText || '',
      });

      res.json({ success: true, order });
    } catch (error: any) {
      console.error('Failed to create order:', error);
      res.status(500).json({ error: 'Failed to complete order checkout' });
    }
  });

  // Bespoke Blends
  app.get('/api/bespoke', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const user = await getUserByUid(req.user.uid);
      if (!user) return res.json([]);
      const blends = await getBespokeBlendsByUserId(user.id);
      res.json(blends);
    } catch (error: any) {
      console.error('Failed to fetch bespoke blends:', error);
      res.status(500).json({ error: 'Failed to fetch bespoke formulations' });
    }
  });

  app.post('/api/bespoke', async (req, res) => {
    try {
      const { blendName, topNotes, heartNotes, baseNotes, flaconColor, concentration, macerationDays, token } = req.body;

      let userId: number | undefined;
      if (token) {
        try {
          const { adminAuth } = await import('./src/lib/firebase-admin.ts');
          const decoded = await adminAuth.verifyIdToken(token);
          const dbUser = await getUserByUid(decoded.uid);
          if (dbUser) userId = dbUser.id;
        } catch {
          // Guest formulation
        }
      }

      const blend = await createBespokeBlend({
        userId,
        blendName: blendName || 'Haute Blend No. 1',
        topNotes: topNotes || 'Bergamot, Blood Orange',
        heartNotes: heartNotes || 'Damascena Rose, Iris',
        baseNotes: baseNotes || 'Ambergris, Smoked Oud',
        flaconColor: flaconColor || '#F4845F',
        concentration: concentration || 'Extrait de Parfum',
        macerationDays: Number(macerationDays) || 90,
      });

      res.json({ success: true, blend });
    } catch (error: any) {
      console.error('Failed to save bespoke blend:', error);
      res.status(500).json({ error: 'Failed to save bespoke blend' });
    }
  });

  // Reviews
  app.get('/api/reviews', async (req, res) => {
    try {
      const fragranceId = req.query.fragranceId as string | undefined;
      const reviews = await getAllReviews(fragranceId);
      res.json(reviews);
    } catch (error: any) {
      console.error('Failed to fetch reviews:', error);
      res.status(500).json({ error: 'Failed to load reviews' });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    try {
      const { fragranceId, authorName, rating, comment } = req.body;
      if (!fragranceId || !authorName || !comment) {
        return res.status(400).json({ error: 'Missing review parameters' });
      }
      const review = await addReview(
        fragranceId,
        authorName,
        Number(rating) || 5,
        comment
      );
      res.json({ success: true, review });
    } catch (error: any) {
      console.error('Failed to add review:', error);
      res.status(500).json({ error: 'Failed to save review' });
    }
  });

  // Favorites
  app.get('/api/favorites', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const user = await getUserByUid(req.user.uid);
      if (!user) return res.json([]);
      const favs = await getFavoritesByUserId(user.id);
      res.json(favs);
    } catch (error: any) {
      console.error('Failed to get favorites:', error);
      res.status(500).json({ error: 'Failed to load favorites' });
    }
  });

  app.post('/api/favorites/toggle', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const user = await getUserByUid(req.user.uid);
      if (!user) return res.status(404).json({ error: 'User not found' });
      const { fragranceId, fragranceName } = req.body;
      const result = await toggleFavorite(user.id, fragranceId, fragranceName || fragranceId);
      res.json(result);
    } catch (error: any) {
      console.error('Failed to toggle favorite:', error);
      res.status(500).json({ error: 'Failed to toggle favorite' });
    }
  });

  // Setup Vite in development or static in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: 3000, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
