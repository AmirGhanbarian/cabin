import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'won';
  created_at: string;
  liked_ideas: string | null;
};

export type LeadInsert = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  liked_ideas?: string;
};

export type Material = {
  id: string;
  name_en: string;
  name_fa: string;
  code: string;
  description_en: string;
  description_fa: string;
  image_url: string;
  category: 'color' | 'material';
  sort_order: number;
  created_at: string;
};

export type MaterialInsert = Omit<Material, 'id' | 'created_at'>;

export type Idea = {
  id: string;
  title_en: string;
  title_fa: string;
  caption_en: string;
  caption_fa: string;
  image_url: string;
  sort_order: number;
  created_at: string;
};

export type IdeaInsert = Omit<Idea, 'id' | 'created_at'>;

export type BlogPost = {
  id: string;
  title_en: string;
  title_fa: string;
  slug: string;
  excerpt_en: string;
  excerpt_fa: string;
  content_en: string;
  content_fa: string;
  cover_image_url: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPostInsert = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>;
