import { createClient } from '@supabase/supabase-js';
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

export function createSupabaseClient(): DatabaseClient {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  return {
    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { session: null, error: error.message };
      const session: AuthSession | null = data.session
        ? { userId: data.session.user.id, email: data.session.user.email ?? '' }
        : null;
      return { session, error: null };
    },
    async signOut() {
      await supabase.auth.signOut();
    },
    async getSession() {
      const { data } = await supabase.auth.getSession();
      return data.session
        ? { userId: data.session.user.id, email: data.session.user.email ?? '' }
        : null;
    },
    onAuthStateChange(callback) {
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(session ? { userId: session.user.id, email: session.user.email ?? '' } : null);
      });
      return { unsubscribe: () => listener.subscription.unsubscribe() };
    },

    async listLeads() {
      const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      return (data as Lead[]) ?? [];
    },
    async insertLead(lead: LeadInsert) {
      await supabase.from('leads').insert(lead);
    },
    async updateLeadStatus(id: string, status: Lead['status']) {
      await supabase.from('leads').update({ status }).eq('id', id);
    },

    async listMaterials() {
      const { data } = await supabase.from('materials').select('*').order('sort_order', { ascending: true });
      return (data as Material[]) ?? [];
    },
    async insertMaterial(mat: MaterialInsert) {
      await supabase.from('materials').insert(mat);
    },
    async updateMaterial(id: string, mat: MaterialInsert) {
      await supabase.from('materials').update(mat).eq('id', id);
    },
    async deleteMaterial(id: string) {
      await supabase.from('materials').delete().eq('id', id);
    },

    async listIdeas() {
      const { data } = await supabase.from('ideas').select('*').order('sort_order', { ascending: true });
      return (data as Idea[]) ?? [];
    },
    async insertIdea(idea: IdeaInsert) {
      await supabase.from('ideas').insert(idea);
    },
    async updateIdea(id: string, idea: IdeaInsert) {
      await supabase.from('ideas').update(idea).eq('id', id);
    },
    async deleteIdea(id: string) {
      await supabase.from('ideas').delete().eq('id', id);
    },

    async listPosts() {
      const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      return (data as BlogPost[]) ?? [];
    },
    async listPublishedPosts() {
      const { data } = await supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false, nullsFirst: false });
      return (data as BlogPost[]) ?? [];
    },
    async getPostBySlug(slug: string) {
      const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).maybeSingle();
      return (data as BlogPost) ?? null;
    },
    async insertPost(post: BlogPostInsert) {
      await supabase.from('blog_posts').insert(post);
    },
    async updatePost(id: string, post: BlogPostInsert) {
      await supabase.from('blog_posts').update({ ...post, updated_at: new Date().toISOString() }).eq('id', id);
    },
    async deletePost(id: string) {
      await supabase.from('blog_posts').delete().eq('id', id);
    },
    async togglePublish(id: string, published: boolean, publishedAt: string | null) {
      await supabase.from('blog_posts').update({ published, published_at: publishedAt, updated_at: new Date().toISOString() }).eq('id', id);
    },

    async listProducts() {
      const { data } = await supabase.from('products').select('*').order('sort_order', { ascending: true });
      return (data as Product[]) ?? [];
    },
    async insertProduct(prod: ProductInsert) {
      await supabase.from('products').insert(prod);
    },
    async updateProduct(id: string, prod: ProductInsert) {
      await supabase.from('products').update(prod).eq('id', id);
    },
    async deleteProduct(id: string) {
      await supabase.from('products').delete().eq('id', id);
    },

    async listCategories() {
      const { data } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
      return (data as Category[]) ?? [];
    },
    async insertCategory(cat: CategoryInsert) {
      await supabase.from('categories').insert(cat);
    },
    async updateCategory(id: string, cat: CategoryInsert) {
      await supabase.from('categories').update(cat).eq('id', id);
    },
    async deleteCategory(id: string) {
      await supabase.from('categories').delete().eq('id', id);
    },

    async listOrders() {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      return (data as Order[]) ?? [];
    },
    async insertOrder(order: OrderInsert, items: OrderItemInsert[]) {
      const { data } = await supabase.from('orders').insert(order).select().single();
      const orderId = (data as Order)?.id ?? '';
      if (orderId && items.length > 0) {
        await supabase.from('order_items').insert(items.map((i) => ({ ...i, order_id: orderId })));
      }
      return orderId;
    },
    async updateOrderStatus(id: string, status: Order['status'], refId?: string | null) {
      await supabase.from('orders').update({ status, ref_id: refId ?? null, updated_at: new Date().toISOString() }).eq('id', id);
    },
    async listOrderItems(orderId: string) {
      const { data } = await supabase.from('order_items').select('*').eq('order_id', orderId);
      return (data as OrderItem[]) ?? [];
    },

    async listNotifyRequests() {
      const { data } = await supabase.from('notify_requests').select('*').order('created_at', { ascending: false });
      return (data as NotifyRequest[]) ?? [];
    },
    async insertNotifyRequest(nr: NotifyRequestInsert) {
      await supabase.from('notify_requests').insert(nr);
    },
    async toggleNotifyHandled(id: string, handled: boolean) {
      await supabase.from('notify_requests').update({ handled }).eq('id', id);
    },
    async deleteNotifyRequest(id: string) {
      await supabase.from('notify_requests').delete().eq('id', id);
    },
  };
}
