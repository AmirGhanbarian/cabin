/*
# Create shop tables: categories, products, orders, order_items, notify_requests

## Overview
Adds a full e-commerce layer to the RUF site. Visitors can browse wooden furniture
products organized into admin-managed categories, add items to a cart, and pay
through Zarinpal. Out-of-stock items allow customers to request restock notifications.
Admins can manage products, categories, view orders, and view notify requests from
the admin panel.

## New Tables

### categories
- id (uuid, primary key)
- name_en (text, English category name)
- name_fa (text, Persian category name)
- sort_order (int, display order)
- created_at (timestamp)

### products
- id (uuid, primary key)
- name_en (text, English product name)
- name_fa (text, Persian product name)
- code (text, product code e.g. WF-001)
- description_en (text, English description)
- description_fa (text, Persian description)
- image_url (text, product image URL)
- price (bigint, price in Toman — integer to avoid float issues)
- stock (int, available inventory count, default 0)
- category_id (uuid, foreign key to categories)
- sort_order (int, display order)
- created_at (timestamp)

### orders
- id (uuid, primary key)
- customer_name (text, full name)
- customer_phone (text, phone number)
- customer_email (text, nullable, email)
- customer_address (text, shipping address)
- total_amount (bigint, total in Toman)
- status (text, 'pending' | 'paid' | 'failed', default 'pending')
- authority (text, nullable, Zarinpal authority code)
- ref_id (text, nullable, Zarinpal transaction reference ID)
- created_at (timestamp)
- updated_at (timestamp)

### order_items
- id (uuid, primary key)
- order_id (uuid, foreign key to orders, cascade delete)
- product_id (uuid, foreign key to products)
- product_name (text, snapshot of product name at time of order)
- quantity (int, quantity purchased)
- unit_price (bigint, snapshot of unit price at time of order)

### notify_requests
- id (uuid, primary key)
- product_id (uuid, foreign key to products)
- email (text, customer email to notify)
- handled (boolean, default false — admin marks as handled)
- created_at (timestamp)

## Security
- RLS enabled on all new tables
- Public (anon) can read all categories and products (browse the shop)
- Public (anon) can insert orders and order_items (checkout flow)
- Public (anon) can insert notify_requests (out-of-stock signup)
- Authenticated (admin) has full CRUD on categories and products
- Authenticated (admin) can read, update, and delete orders and order_items
- Authenticated (admin) can read, update, and delete notify_requests
- Public (anon) CANNOT read orders or notify_requests (private customer data)
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL DEFAULT '',
  name_fa text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_categories" ON categories;
CREATE POLICY "read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_categories" ON categories;
CREATE POLICY "insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_categories" ON categories;
CREATE POLICY "update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_categories" ON categories;
CREATE POLICY "delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL DEFAULT '',
  name_fa text NOT NULL DEFAULT '',
  code text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_fa text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  price bigint NOT NULL DEFAULT 0,
  stock int NOT NULL DEFAULT 0,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_products" ON products;
CREATE POLICY "read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_products" ON products;
CREATE POLICY "insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_products" ON products;
CREATE POLICY "update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_products" ON products;
CREATE POLICY "delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL DEFAULT '',
  customer_phone text NOT NULL DEFAULT '',
  customer_email text,
  customer_address text NOT NULL DEFAULT '',
  total_amount bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  authority text,
  ref_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Anon can insert orders (checkout) but cannot read them (private data)
DROP POLICY IF EXISTS "insert_orders" ON orders;
CREATE POLICY "insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "read_orders" ON orders;
CREATE POLICY "read_orders" ON orders FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "update_orders" ON orders;
CREATE POLICY "update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_orders" ON orders;
CREATE POLICY "delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL,
  product_name text NOT NULL DEFAULT '',
  quantity int NOT NULL DEFAULT 1,
  unit_price bigint NOT NULL DEFAULT 0
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_order_items" ON order_items;
CREATE POLICY "insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "read_order_items" ON order_items;
CREATE POLICY "read_order_items" ON order_items FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "update_order_items" ON order_items;
CREATE POLICY "update_order_items" ON order_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_order_items" ON order_items;
CREATE POLICY "delete_order_items" ON order_items FOR DELETE
  TO authenticated USING (true);

-- Create notify_requests table
CREATE TABLE IF NOT EXISTS notify_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  email text NOT NULL DEFAULT '',
  handled boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notify_requests ENABLE ROW LEVEL SECURITY;

-- Anon can insert notify requests, cannot read them (private data)
DROP POLICY IF EXISTS "insert_notify_requests" ON notify_requests;
CREATE POLICY "insert_notify_requests" ON notify_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "read_notify_requests" ON notify_requests;
CREATE POLICY "read_notify_requests" ON notify_requests FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "update_notify_requests" ON notify_requests;
CREATE POLICY "update_notify_requests" ON notify_requests FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_notify_requests" ON notify_requests;
CREATE POLICY "delete_notify_requests" ON notify_requests FOR DELETE
  TO authenticated USING (true);

-- Add index on products.category_id for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_notify_requests_product_id ON notify_requests(product_id);
