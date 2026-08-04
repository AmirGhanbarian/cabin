import { PGlite } from '@electric-sql/pglite';
import type { DatabaseClient, AuthSession } from './db-interface';
import type {
  Lead, LeadInsert,
  Material, MaterialInsert,
  Idea, IdeaInsert,
  BlogPost, BlogPostInsert,
  Category, CategoryInsert,
  Product, ProductInsert,
  Order, OrderInsert,
  OrderItem, OrderItemInsert,
  NotifyRequest, NotifyRequestInsert,
} from './types';
import { ADMIN_PASSWORD } from './db-config';

let dbPromise: Promise<PGlite> | null = null;

async function getDb(): Promise<PGlite> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = new PGlite('idb://ruf-cabinetry');
      await db.exec(SCHEMA_SQL);
      await seedIfEmpty(db);
      return db;
    })();
  }
  return dbPromise;
}

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  liked_ideas TEXT
);

CREATE TABLE IF NOT EXISTS materials (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name_en TEXT NOT NULL,
  name_fa TEXT NOT NULL,
  code TEXT NOT NULL,
  description_en TEXT NOT NULL DEFAULT '',
  description_fa TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'material',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ideas (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  caption_en TEXT NOT NULL DEFAULT '',
  caption_fa TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title_en TEXT NOT NULL,
  title_fa TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt_en TEXT NOT NULL DEFAULT '',
  excerpt_fa TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  content_fa TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT NOT NULL DEFAULT '',
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name_en TEXT NOT NULL,
  name_fa TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name_en TEXT NOT NULL,
  name_fa TEXT NOT NULL,
  code TEXT NOT NULL,
  description_en TEXT NOT NULL DEFAULT '',
  description_fa TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  total_amount INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  authority TEXT,
  ref_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS notify_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL,
  email TEXT NOT NULL,
  handled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

async function seedIfEmpty(db: PGlite): Promise<void> {
  const { rows } = await db.query('SELECT count(*) as cnt FROM materials');
  if (Number((rows[0] as { cnt: string }).cnt) > 0) return;

  await db.query(`
    INSERT INTO materials (name_en, name_fa, code, description_en, description_fa, image_url, category, sort_order) VALUES
    ('Walnut Oak', 'گردو بلوط', 'MDF-WO-01', 'Rich walnut-toned MDF with natural oak grain texture', 'ام دی اف رنگ گردو با بافت طبیعی بلوط', 'https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg?auto=compress&cs=tinysrgb&w=800', 'material', 1),
    ('Charcoal Matte', 'زغالی مات', 'MDF-CM-02', 'Deep charcoal matte finish for modern interiors', 'پوشش مات زغالی برای فضاهای مدرن', 'https://images.pexels.com/photos/276224/pexels-photo-276224.jpeg?auto=compress&cs=tinysrgb&w=800', 'color', 2),
    ('Sage Green', 'سبز مریمانی', 'MDF-SG-03', 'Soft sage green with subtle texture', 'سبز مریمانی نرم با بافت ظریف', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 'color', 3),
    ('Natural Oak', 'بلوط طبیعی', 'MDF-NO-04', 'Warm natural oak MDF panel', 'پنل ام دی اف بلوط طبیعی گرم', 'https://images.pexels.com/photos/5824/people-office-architect.jpg?auto=compress&cs=tinysrgb&w=800', 'material', 4)
  `);

  await db.query(`
    INSERT INTO ideas (title_en, title_fa, caption_en, caption_fa, image_url, sort_order) VALUES
    ('Modern Kitchen Island', 'جزیره آشپزخانه مدرن', 'A sleek kitchen island with brass accents and matte cabinets', 'جزیره آشپزخانه شیک با جزئیات برنجی و کابینت مات', 'https://images.pexels.com/photos/263046/pexels-photo-263046.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
    ('Walk-in Closet', 'کلوزت باز', 'Custom walk-in closet with integrated lighting', 'کلوزت سفارشی با نورپردازی یکپارچه', 'https://images.pexels.com/photos/2050925/pexels-photo-2050925.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
    ('Floating TV Unit', 'واحت تلویزیون شناور', 'Minimalist floating entertainment unit in walnut', 'واحت تلویزیون مینیمال شناور در رنگ گردو', 'https://images.pexels.com/photos/6585662/pexels-photo-6585662.jpeg?auto=compress&cs=tinysrgb&w=800', 3)
  `);

  await db.query(`
    INSERT INTO blog_posts (title_en, title_fa, slug, excerpt_en, excerpt_fa, content_en, content_fa, cover_image_url, published, published_at) VALUES
    ('Choosing the Right MDF for Your Kitchen', 'انتخاب ام دی اف مناسب برای آشپزخانه', 'choosing-right-mdf', 'A guide to selecting MDF materials and colors for durability and style', 'راهنمای انتخاب متریال و رنگ ام دی اف برای دوام و زیبایی', '## Why MDF?

MDF (Medium Density Fiberboard) is the backbone of modern cabinetry. It is smooth, stable, and takes paint beautifully.

## Choosing a Color

Pick warm tones for traditional kitchens and cool tones for contemporary ones. Matte finishes hide fingerprints; gloss finishes bounce light.', '## چرا ام دی اف؟

ام دی اف ستون فقرات کابینت مدرن است. سطحی صاف و پایدار دارد و رنگ را زیبا می‌پذیرد.

## انتخاب رنگ

برای آشپزخانه‌های سنتی رنگ‌های گرم و برای فضاهای مدرن رنگ‌های خنک انتخاب کنید.', 'https://images.pexels.com/photos/263046/pexels-photo-263046.jpeg?auto=compress&cs=tinysrgb&w=1200', true, now())
  `);

  await db.query(`
    INSERT INTO categories (name_en, name_fa, sort_order) VALUES
    ('Cabinetry', 'کابینت', 1),
    ('Hardware', 'اکسسوری', 2),
    ('Panels', 'پنل', 3)
  `);

  await db.query(`
    INSERT INTO products (name_en, name_fa, code, description_en, description_fa, image_url, price, stock, category_id, sort_order)
    SELECT 'Walnut Cabinet Door', 'در کابینت گردو', 'P-WCD-01', 'Pre-finished walnut MDF cabinet door', 'در کابینت ام دی اف گردو پیش‌finished', 'https://images.pexels.com/photos/263046/pexels-photo-263046.jpeg?auto=compress&cs=tinysrgb&w=800', 450000, 12, id, 1 FROM categories WHERE name_en = 'Cabinetry'
  `);
  await db.query(`
    INSERT INTO products (name_en, name_fa, code, description_en, description_fa, image_url, price, stock, category_id, sort_order)
    SELECT 'Brass Handle Set', 'ست دستگیر برنجی', 'P-BHS-02', 'Solid brass cabinet handle set of 10', 'ست دستگیر برنجی کابینت - ۱۰ عدد', 'https://images.pexels.com/photos/276224/pexels-photo-276224.jpeg?auto=compress&cs=tinysrgb&w=800', 120000, 30, id, 2 FROM categories WHERE name_en = 'Hardware'
  `);
  await db.query(`
    INSERT INTO products (name_en, name_fa, code, description_en, description_fa, image_url, price, stock, category_id, sort_order)
    SELECT 'Sage Green Panel', 'پنل سبز مریمانی', 'P-SGP-03', 'Pre-painted sage green MDF panel 2400x1200', 'پنل ام دی اف سبز مریمانی ۲۴۰۰x۱۲۰۰', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 380000, 8, id, 3 FROM categories WHERE name_en = 'Panels'
  `);
}

function genId(): string {
  return crypto.randomUUID();
}

// --- Auth (simple password gate for pglite mode) ---

let currentSession: AuthSession | null = null;
const authListeners: ((s: AuthSession | null) => void)[] = [];

export function createPgliteClient(): DatabaseClient {
  return {
    async signIn(email: string, password: string) {
      if (password === ADMIN_PASSWORD && email.trim().length > 0) {
        currentSession = { userId: 'admin', email };
        authListeners.forEach((l) => l(currentSession));
        return { session: currentSession, error: null };
      }
      return { session: null, error: 'Invalid email or password' };
    },
    async signOut() {
      currentSession = null;
      authListeners.forEach((l) => l(null));
    },
    async getSession() {
      return currentSession;
    },
    onAuthStateChange(callback) {
      authListeners.push(callback);
      return { unsubscribe: () => {
        const idx = authListeners.indexOf(callback);
        if (idx >= 0) authListeners.splice(idx, 1);
      }};
    },

    // --- Leads ---
    async listLeads() {
      const db = await getDb();
      const { rows } = await db.query('SELECT * FROM leads ORDER BY created_at DESC');
      return rows as Lead[];
    },
    async insertLead(lead: LeadInsert) {
      const db = await getDb();
      await db.query(
        'INSERT INTO leads (id, name, phone, email, message, liked_ideas) VALUES ($1, $2, $3, $4, $5, $6)',
        [genId(), lead.name, lead.phone, lead.email ?? null, lead.message ?? null, lead.liked_ideas ?? null]
      );
    },
    async updateLeadStatus(id: string, status: Lead['status']) {
      const db = await getDb();
      await db.query('UPDATE leads SET status = $1 WHERE id = $2', [status, id]);
    },

    // --- Materials ---
    async listMaterials() {
      const db = await getDb();
      const { rows } = await db.query('SELECT * FROM materials ORDER BY sort_order ASC');
      return rows as Material[];
    },
    async insertMaterial(mat: MaterialInsert) {
      const db = await getDb();
      await db.query(
        'INSERT INTO materials (id, name_en, name_fa, code, description_en, description_fa, image_url, category, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [genId(), mat.name_en, mat.name_fa, mat.code, mat.description_en, mat.description_fa, mat.image_url, mat.category, mat.sort_order]
      );
    },
    async updateMaterial(id: string, mat: MaterialInsert) {
      const db = await getDb();
      await db.query(
        'UPDATE materials SET name_en=$1, name_fa=$2, code=$3, description_en=$4, description_fa=$5, image_url=$6, category=$7, sort_order=$8 WHERE id=$9',
        [mat.name_en, mat.name_fa, mat.code, mat.description_en, mat.description_fa, mat.image_url, mat.category, mat.sort_order, id]
      );
    },
    async deleteMaterial(id: string) {
      const db = await getDb();
      await db.query('DELETE FROM materials WHERE id = $1', [id]);
    },

    // --- Ideas ---
    async listIdeas() {
      const db = await getDb();
      const { rows } = await db.query('SELECT * FROM ideas ORDER BY sort_order ASC');
      return rows as Idea[];
    },
    async insertIdea(idea: IdeaInsert) {
      const db = await getDb();
      await db.query(
        'INSERT INTO ideas (id, title_en, title_fa, caption_en, caption_fa, image_url, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [genId(), idea.title_en, idea.title_fa, idea.caption_en, idea.caption_fa, idea.image_url, idea.sort_order]
      );
    },
    async updateIdea(id: string, idea: IdeaInsert) {
      const db = await getDb();
      await db.query(
        'UPDATE ideas SET title_en=$1, title_fa=$2, caption_en=$3, caption_fa=$4, image_url=$5, sort_order=$6 WHERE id=$7',
        [idea.title_en, idea.title_fa, idea.caption_en, idea.caption_fa, idea.image_url, idea.sort_order, id]
      );
    },
    async deleteIdea(id: string) {
      const db = await getDb();
      await db.query('DELETE FROM ideas WHERE id = $1', [id]);
    },

    // --- Blog posts ---
    async listPosts() {
      const db = await getDb();
      const { rows } = await db.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
      return rows as BlogPost[];
    },
    async listPublishedPosts() {
      const db = await getDb();
      const { rows } = await db.query('SELECT * FROM blog_posts WHERE published = true ORDER BY published_at DESC NULLS LAST');
      return rows as BlogPost[];
    },
    async getPostBySlug(slug: string) {
      const db = await getDb();
      const { rows } = await db.query('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
      return (rows[0] as BlogPost) ?? null;
    },
    async insertPost(post: BlogPostInsert) {
      const db = await getDb();
      await db.query(
        'INSERT INTO blog_posts (id, title_en, title_fa, slug, excerpt_en, excerpt_fa, content_en, content_fa, cover_image_url, published, published_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
        [genId(), post.title_en, post.title_fa, post.slug, post.excerpt_en, post.excerpt_fa, post.content_en, post.content_fa, post.cover_image_url, post.published, post.published_at]
      );
    },
    async updatePost(id: string, post: BlogPostInsert) {
      const db = await getDb();
      await db.query(
        'UPDATE blog_posts SET title_en=$1, title_fa=$2, slug=$3, excerpt_en=$4, excerpt_fa=$5, content_en=$6, content_fa=$7, cover_image_url=$8, published=$9, published_at=$10, updated_at=now() WHERE id=$11',
        [post.title_en, post.title_fa, post.slug, post.excerpt_en, post.excerpt_fa, post.content_en, post.content_fa, post.cover_image_url, post.published, post.published_at, id]
      );
    },
    async deletePost(id: string) {
      const db = await getDb();
      await db.query('DELETE FROM blog_posts WHERE id = $1', [id]);
    },
    async togglePublish(id: string, published: boolean, publishedAt: string | null) {
      const db = await getDb();
      await db.query('UPDATE blog_posts SET published=$1, published_at=$2, updated_at=now() WHERE id=$3', [published, publishedAt, id]);
    },

    // --- Products ---
    async listProducts() {
      const db = await getDb();
      const { rows } = await db.query('SELECT * FROM products ORDER BY sort_order ASC');
      return rows as Product[];
    },
    async insertProduct(prod: ProductInsert) {
      const db = await getDb();
      await db.query(
        'INSERT INTO products (id, name_en, name_fa, code, description_en, description_fa, image_url, price, stock, category_id, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
        [genId(), prod.name_en, prod.name_fa, prod.code, prod.description_en, prod.description_fa, prod.image_url, prod.price, prod.stock, prod.category_id, prod.sort_order]
      );
    },
    async updateProduct(id: string, prod: ProductInsert) {
      const db = await getDb();
      await db.query(
        'UPDATE products SET name_en=$1, name_fa=$2, code=$3, description_en=$4, description_fa=$5, image_url=$6, price=$7, stock=$8, category_id=$9, sort_order=$10 WHERE id=$11',
        [prod.name_en, prod.name_fa, prod.code, prod.description_en, prod.description_fa, prod.image_url, prod.price, prod.stock, prod.category_id, prod.sort_order, id]
      );
    },
    async deleteProduct(id: string) {
      const db = await getDb();
      await db.query('DELETE FROM products WHERE id = $1', [id]);
    },

    // --- Categories ---
    async listCategories() {
      const db = await getDb();
      const { rows } = await db.query('SELECT * FROM categories ORDER BY sort_order ASC');
      return rows as Category[];
    },
    async insertCategory(cat: CategoryInsert) {
      const db = await getDb();
      await db.query('INSERT INTO categories (id, name_en, name_fa, sort_order) VALUES ($1,$2,$3,$4)', [genId(), cat.name_en, cat.name_fa, cat.sort_order]);
    },
    async updateCategory(id: string, cat: CategoryInsert) {
      const db = await getDb();
      await db.query('UPDATE categories SET name_en=$1, name_fa=$2, sort_order=$3 WHERE id=$4', [cat.name_en, cat.name_fa, cat.sort_order, id]);
    },
    async deleteCategory(id: string) {
      const db = await getDb();
      await db.query('DELETE FROM categories WHERE id = $1', [id]);
    },

    // --- Orders ---
    async listOrders() {
      const db = await getDb();
      const { rows } = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
      return rows as Order[];
    },
    async insertOrder(order: OrderInsert, items: OrderItemInsert[]) {
      const db = await getDb();
      const orderId = genId();
      await db.query(
        'INSERT INTO orders (id, customer_name, customer_phone, customer_email, customer_address, total_amount, status, authority, ref_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [orderId, order.customer_name, order.customer_phone, order.customer_email, order.customer_address, order.total_amount, order.status, order.authority, order.ref_id]
      );
      for (const item of items) {
        await db.query(
          'INSERT INTO order_items (id, order_id, product_id, product_name, quantity, unit_price) VALUES ($1,$2,$3,$4,$5,$6)',
          [genId(), orderId, item.product_id, item.product_name, item.quantity, item.unit_price]
        );
      }
      return orderId;
    },
    async updateOrderStatus(id: string, status: Order['status'], refId?: string | null) {
      const db = await getDb();
      await db.query('UPDATE orders SET status=$1, ref_id=$2, updated_at=now() WHERE id=$3', [status, refId ?? null, id]);
    },
    async listOrderItems(orderId: string) {
      const db = await getDb();
      const { rows } = await db.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
      return rows as OrderItem[];
    },

    // --- Notify requests ---
    async listNotifyRequests() {
      const db = await getDb();
      const { rows } = await db.query('SELECT * FROM notify_requests ORDER BY created_at DESC');
      return rows as NotifyRequest[];
    },
    async insertNotifyRequest(nr: NotifyRequestInsert) {
      const db = await getDb();
      await db.query('INSERT INTO notify_requests (id, product_id, email) VALUES ($1,$2,$3)', [genId(), nr.product_id, nr.email]);
    },
    async toggleNotifyHandled(id: string, handled: boolean) {
      const db = await getDb();
      await db.query('UPDATE notify_requests SET handled = $1 WHERE id = $2', [handled, id]);
    },
    async deleteNotifyRequest(id: string) {
      const db = await getDb();
      await db.query('DELETE FROM notify_requests WHERE id = $1', [id]);
    },
  };
}
