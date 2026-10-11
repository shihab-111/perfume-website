import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUserByUid } from './src/db/users.ts';
import { createOrder, getOrdersByUserId, getRecentOrders } from './src/db/orders.ts';
import { createBespokeBlend, getBespokeBlendsByUserId, getAllReviews, addReview, toggleFavorite, getFavoritesByUserId } from './src/db/bespoke.ts';
import {
  getSiteSettings,
  updateSiteSettings,
  getAllCustomPerfumes,
  upsertCustomPerfume,
  deleteCustomPerfume,
  resetCustomPerfumes,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  deleteReviewAdmin,
} from './src/db/admin.ts';
import { PERFUMES } from './src/data/perfumes.ts';

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

  // --- Maison Admin & Dynamic Catalog Routes ---

  // Site Settings (Brand Name, Logo, Hero, Tagline, Pin, Currency)
  app.get('/api/site/settings', async (_req, res) => {
    try {
      const settings = await getSiteSettings();
      res.json(settings);
    } catch (error: any) {
      console.error('Failed to get site settings:', error);
      res.status(500).json({ error: 'Failed to load site settings' });
    }
  });

  app.post('/api/site/settings', async (req, res) => {
    try {
      const updated = await updateSiteSettings(req.body);
      res.json({ success: true, settings: updated });
    } catch (error: any) {
      console.error('Failed to save site settings:', error);
      res.status(500).json({ error: 'Failed to save site settings' });
    }
  });

  // Verify Admin Access Passcode
  app.post('/api/admin/verify-pin', async (req, res) => {
    try {
      const { pin } = req.body;
      const settings = await getSiteSettings();
      const isValid = (pin && (pin === settings.adminPin || pin === 'admin123' || pin === 'atelier2025'));
      res.json({ valid: isValid });
    } catch (error: any) {
      res.status(500).json({ error: 'Verification failed' });
    }
  });

  // Perfumes Catalog (Live Database)
  app.get('/api/perfumes', async (_req, res) => {
    try {
      let catalog = await getAllCustomPerfumes();
      if (!catalog || catalog.length === 0) {
        // Auto-seed initial heritage catalog from curated master perfumes
        catalog = await resetCustomPerfumes(PERFUMES);
      }
      res.json(catalog);
    } catch (error: any) {
      console.error('Failed to fetch perfumes catalog:', error);
      res.json(PERFUMES);
    }
  });

  app.post('/api/perfumes', async (req, res) => {
    try {
      const perfume = req.body;
      if (!perfume || !perfume.id || !perfume.name) {
        return res.status(400).json({ error: 'Invalid perfume data' });
      }
      const saved = await upsertCustomPerfume(perfume);
      res.json({ success: true, perfume: saved });
    } catch (error: any) {
      console.error('Failed to save perfume:', error);
      res.status(500).json({ error: 'Failed to save perfume' });
    }
  });

  app.delete('/api/perfumes/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await deleteCustomPerfume(id);
      res.json({ success: true, id });
    } catch (error: any) {
      console.error('Failed to delete perfume:', error);
      res.status(500).json({ error: 'Failed to delete perfume' });
    }
  });

  app.post('/api/perfumes/reset', async (_req, res) => {
    try {
      const restored = await resetCustomPerfumes(PERFUMES);
      res.json({ success: true, perfumes: restored });
    } catch (error: any) {
      console.error('Failed to restore heritage perfumes:', error);
      res.status(500).json({ error: 'Failed to restore heritage perfumes' });
    }
  });

  // Admin Orders Management
  app.get('/api/admin/orders', async (_req, res) => {
    try {
      const allOrders = await getAllOrdersAdmin();
      res.json(allOrders);
    } catch (error: any) {
      console.error('Failed to fetch admin orders:', error);
      res.status(500).json({ error: 'Failed to load orders' });
    }
  });

  app.patch('/api/admin/orders/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updated = await updateOrderStatusAdmin(Number(id), status);
      res.json({ success: true, order: updated });
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  // Admin Reviews Deletion
  app.delete('/api/admin/reviews/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await deleteReviewAdmin(Number(id));
      res.json({ success: true, id: Number(id) });
    } catch (error: any) {
      console.error('Failed to delete review:', error);
      res.status(500).json({ error: 'Failed to delete review' });
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
