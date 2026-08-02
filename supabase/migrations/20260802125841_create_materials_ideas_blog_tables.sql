/*
# Create materials, ideas, and blog_posts tables

## Overview
Adds three new content tables for the bilingual (English/Persian) site:
- materials: MDF color and material catalog with EN/FA fields
- ideas: kitchen inspiration gallery images with EN/FA fields
- blog_posts: blog articles with EN/FA fields and published flag
Also adds a liked_ideas column to the leads table to store which idea images a customer favorited.

## New Tables

### materials
- id (uuid, primary key)
- name_en (text, English name)
- name_fa (text, Persian name)
- code (text, unique product code e.g. MDF-001)
- description_en (text, English description)
- description_fa (text, Persian description)
- image_url (text, image URL)
- category (text, 'color' or 'material')
- sort_order (int, display order)
- created_at (timestamp)

### ideas
- id (uuid, primary key)
- title_en (text, English title)
- title_fa (text, Persian title)
- caption_en (text, English caption)
- caption_fa (text, Persian caption)
- image_url (text, image URL)
- sort_order (int, display order)
- created_at (timestamp)

### blog_posts
- id (uuid, primary key)
- title_en (text, English title)
- title_fa (text, Persian title)
- slug (text, unique URL slug)
- excerpt_en (text, English excerpt)
- excerpt_fa (text, Persian excerpt)
- content_en (text, English full content)
- content_fa (text, Persian full content)
- cover_image_url (text, cover image URL)
- published (boolean, default false)
- published_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)

## Modified Tables
### leads
- Added liked_ideas (text, nullable) — stores comma-separated idea titles the customer liked

## Security
- RLS enabled on all new tables
- Public (anon) can read all materials, all ideas, and published blog posts
- Authenticated (admin) can read all blog posts including unpublished, and has full CRUD on all tables
- Anon can insert leads with liked_ideas (contact form)
- Authenticated can update leads (admin status management)
*/

-- Add liked_ideas column to leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS liked_ideas text;

-- Create materials table
CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL DEFAULT '',
  name_fa text NOT NULL DEFAULT '',
  code text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_fa text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'material' CHECK (category IN ('color', 'material')),
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_materials" ON materials;
CREATE POLICY "read_materials" ON materials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_materials" ON materials;
CREATE POLICY "insert_materials" ON materials FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_materials" ON materials;
CREATE POLICY "update_materials" ON materials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_materials" ON materials;
CREATE POLICY "delete_materials" ON materials FOR DELETE
  TO authenticated USING (true);

-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL DEFAULT '',
  name_fa text NOT NULL DEFAULT '',
  title_fa text NOT NULL DEFAULT '',
  caption_en text NOT NULL DEFAULT '',
  caption_fa text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_ideas" ON ideas;
CREATE POLICY "read_ideas" ON ideas FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_ideas" ON ideas;
CREATE POLICY "insert_ideas" ON ideas FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_ideas" ON ideas;
CREATE POLICY "update_ideas" ON ideas FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_ideas" ON ideas;
CREATE POLICY "delete_ideas" ON ideas FOR DELETE
  TO authenticated USING (true);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL DEFAULT '',
  title_fa text NOT NULL DEFAULT '',
  slug text UNIQUE NOT NULL DEFAULT '',
  excerpt_en text NOT NULL DEFAULT '',
  excerpt_fa text NOT NULL DEFAULT '',
  content_en text NOT NULL DEFAULT '',
  content_fa text NOT NULL DEFAULT '',
  cover_image_url text NOT NULL DEFAULT '',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_blog_posts" ON blog_posts;
CREATE POLICY "read_blog_posts" ON blog_posts FOR SELECT
  TO anon, authenticated USING (published = true OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "insert_blog_posts" ON blog_posts;
CREATE POLICY "insert_blog_posts" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_blog_posts" ON blog_posts;
CREATE POLICY "update_blog_posts" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_blog_posts" ON blog_posts;
CREATE POLICY "delete_blog_posts" ON blog_posts FOR DELETE
  TO authenticated USING (true);

-- Seed sample materials
INSERT INTO materials (name_en, name_fa, code, description_en, description_fa, image_url, category, sort_order) VALUES
('Natural Oak', 'بلوط طبیعی', 'MDF-001', 'Warm honey-toned oak veneer with a hand-applied oil finish that brings out the natural grain.', 'روکش بلوط با رنگ عسلی گرم و پوشش روغنی دست‌ساز که رگه‌های طبیعی را برجسته می‌کند.', 'https://images.pexels.com/photos/36081877/pexels-photo-36081877.jpeg?auto=compress&cs=tinysrgb&w=800', 'material', 1),
('Walnut Grain', 'گردوی فندقی', 'MDF-002', 'Rich chocolate-brown walnut with a satin lacquer finish for a sophisticated look.', 'گردوی قهوه‌ای تیره با پوشش لاکی ساتن برای ظاهری شیک و مدرن.', 'https://images.pexels.com/photos/4705928/pexels-photo-4705928.jpeg?auto=compress&cs=tinysrgb&w=800', 'material', 2),
('Matte Anthracite', 'آنتراسیت مات', 'MDF-003', 'Deep charcoal grey with a soft-touch matte finish — bold and architectural.', 'خاکستری زغالی عمیق با پوشش مات نرم — جسور و معماری‌گرا.', 'https://images.pexels.com/photos/7061400/pexels-photo-7061400.jpeg?auto=compress&cs=tinysrgb&w=800', 'color', 3),
('Brushed Brass', 'برس برنجی', 'MDF-004', 'Patinated brass metal accent panels with a brushed finish for warm metallic highlights.', 'پنل‌های برنجی پتینه شده با پرداشت برس‌خورده برای درخشش فلزی گرم.', 'https://images.pexels.com/photos/5674621/pexels-photo-5674621.jpeg?auto=compress&cs=tinysrgb&w=800', 'color', 4),
('Reclaimed Pine', 'کاج بازیافتی', 'MDF-005', 'Reclaimed pine with visible knots and character marks — raw and naturally beautiful.', 'کاج بازیافتی با گره‌های قابل مشاهده و نشانه‌های طبیعی — خام و زیبا.', 'https://images.pexels.com/photos/911820/pexels-photo-911820.jpeg?auto=compress&cs=tinysrgb&w=800', 'material', 5),
('Smoked Oak', 'بلوط دودی', 'MDF-006', 'Fumed and oiled oak with a smoky dark finish that adds depth and drama.', 'بلوط دودی‌شده و روغنی با پوشش تیره که عمق و درام را افزایش می‌دهد.', 'https://images.pexels.com/photos/33653800/pexels-photo-33653800.jpeg?auto=compress&cs=tinysrgb&w=800', 'material', 6),
('Pure White Matte', 'سفید مات', 'MDF-007', 'Crisp clean white with a velvety matte finish — timeless and bright.', 'سفید تمیز با پوشش مات مخملی — زمان‌ناپذیر و روشن.', 'https://images.pexels.com/photos/6969865/pexels-photo-6969865.jpeg?auto=compress&cs=tinysrgb&w=800', 'color', 7),
('Sage Green', 'سبز مریم‌گلی', 'MDF-008', 'Soft muted green that brings a calm, natural feel to any kitchen.', 'سبز ملایم که حس آرامش و طبیعت را به هر آشپزخانه‌ای می‌آورد.', 'https://images.pexels.com/photos/7045356/pexels-photo-7045356.jpeg?auto=compress&cs=tinysrgb&w=800', 'color', 8)
ON CONFLICT DO NOTHING;

-- Seed sample ideas
INSERT INTO ideas (title_en, title_fa, caption_en, caption_fa, image_url, sort_order) VALUES
('Modern Minimalist Kitchen', 'آشپزخانه مینیمال مدرن', 'Clean lines, handleless cabinets, and a neutral palette.', 'خطوط تمیز، کابینت‌های بدون دستگیره و پالت رنگی خنثی.', 'https://images.pexels.com/photos/6969865/pexels-photo-6969865.jpeg?auto=compress&cs=tinysrgb&w=1200', 1),
('Classic Shaker Style', 'سبک شیکر کلاسیک', 'Timeless shaker doors in a warm white finish with brass hardware.', 'درهای شیکر زمان‌ناپذیر با پوشش سفید گرم و اکسسوری برنجی.', 'https://images.pexels.com/photos/7045356/pexels-photo-7045356.jpeg?auto=compress&cs=tinysrgb&w=1200', 2),
('Dark Industrial Kitchen', 'آشپزخانه صنعتی تیره', 'Matte black cabinets with metal accents for a bold statement.', 'کابینت‌های مات مشکی با جزئیات فلزی برای یک بیان جسور.', 'https://images.pexels.com/photos/7061400/pexels-photo-7061400.jpeg?auto=compress&cs=tinysrgb&w=1200', 3),
('Warm Wood Kitchen', 'آشپزخانه چوبی گرم', 'Natural wood grain throughout with a cozy, inviting feel.', 'رگه‌های چوب طبیعی در سراسر فضا با حس دعوت‌کننده و گرم.', 'https://images.pexels.com/photos/16501286/pexels-photo-16501286.jpeg?auto=compress&cs=tinysrgb&w=1200', 4),
('Scandinavian Light', 'اسکاندیناوی روشن', 'Light oak cabinets with white countertops and airy openness.', 'کابینت‌های بلوط روشن با پیشخوان‌های سفید و فضای باز.', 'https://images.pexels.com/photos/7167061/pexels-photo-7167061.jpeg?auto=compress&cs=tinysrgb&w=1200', 5),
('Luxury Two-Tone', 'دو‌رنگ لوکس', 'Upper cabinets in white, lower cabinets in deep navy blue.', 'کابینت‌های بالا سفید، کابینت‌های پایین سرمه‌ای عمیق.', 'https://images.pexels.com/photos/675877/pexels-photo-675877.jpeg?auto=compress&cs=tinysrgb&w=1200', 6)
ON CONFLICT DO NOTHING;

-- Seed a sample blog post
INSERT INTO blog_posts (title_en, title_fa, slug, excerpt_en, excerpt_fa, content_en, content_fa, cover_image_url, published, published_at) VALUES
('How to Choose the Perfect Kitchen Cabinet Finish',
 'نحوه انتخاب بهترین پوشش کابینت آشپزخانه',
 'choosing-perfect-cabinet-finish',
 'From matte to high-gloss, natural wood to painted — discover which cabinet finish is right for your kitchen.',
 'از مات تا براق، چوب طبیعی تا رنگ‌شده — کشف کنید کدام پوشش کابینت برای آشپزخانه شما مناسب است.',
 'Choosing the right finish for your kitchen cabinets is one of the most important decisions you will make during your renovation. The finish not only affects how your kitchen looks but also how it performs over time.\n\n## Matte Finishes\n\nMatte finishes have become increasingly popular in recent years. They offer a sophisticated, understated look that hides fingerprints and smudges well. Matte works beautifully in both modern and traditional kitchens.\n\n## High-Gloss Finishes\n\nHigh-gloss finishes reflect light, making smaller kitchens feel larger and brighter. They are easy to clean but show fingerprints more readily. Gloss is perfect for contemporary, minimalist spaces.\n\n## Natural Wood\n\nNatural wood finishes bring warmth and character to your kitchen. Oak, walnut, and ash are popular choices. Wood requires more maintenance but ages beautifully.\n\n## Painted Finishes\n\nPainted cabinets offer unlimited color options. They can be repainted if you want to refresh your look. Painted finishes work well in traditional, farmhouse, and transitional kitchens.\n\n## Conclusion\n\nThe best finish depends on your lifestyle, kitchen style, and personal preference. Visit our showroom to see and feel the difference for yourself.',
 'انتخاب پوشش مناسب برای کابینت‌های آشپزخانه یکی از مهم‌ترین تصمیمات در بازسازی است. پوشش نه تنها ظاهر آشپزخانه را تعیین می‌کند، بلکه عملکرد آن را در طول زمان تحت تاثیر قرار می‌دهد.\n\n## پوشش‌های مات\n\nپوشش‌های مات در سال‌های اخیر به‌شدت محبوب شده‌اند. آن‌ها ظاهری شیک و محتاطانه دارند که اثر انگشت را به‌خوبی پنهان می‌کند.\n\n## پوشش‌های براق\n\nپوشش‌های براق نور را منعکس می‌کنند و آشپزخانه‌های کوچک‌تر را بزرگ‌تر و روشن‌تر نشان می‌دهند.\n\n## چوب طبیعی\n\nپوشش‌های چوب طبیعی گرمای شخصیت را به آشپزخانه می‌آورند. بلوط، گردو و زبان‌گنجشک انتخاب‌های محبوب هستند.\n\n## پوشش‌های رنگ‌شده\n\nکابینت‌های رنگ‌شده گزینه‌های رنگ نامحدود ارائه می‌دهند و در سبک‌های سنتی و مزرعه‌ای به‌خوبی کار می‌کنند.',
 'https://images.pexels.com/photos/6969865/pexels-photo-6969865.jpeg?auto=compress&cs=tinysrgb&w=1200',
 true,
 now())
ON CONFLICT DO NOTHING;
