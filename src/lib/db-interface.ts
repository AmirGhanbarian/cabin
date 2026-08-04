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

export type AuthSession = {
  userId: string;
  email: string;
};

export interface DatabaseClient {
  // Auth
  signIn(email: string, password: string): Promise<{ session: AuthSession | null; error: string | null }>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  onAuthStateChange(callback: (session: AuthSession | null) => void): { unsubscribe: () => void };

  // Leads
  listLeads(): Promise<Lead[]>;
  insertLead(lead: LeadInsert): Promise<void>;
  updateLeadStatus(id: string, status: Lead['status']): Promise<void>;

  // Materials
  listMaterials(): Promise<Material[]>;
  insertMaterial(mat: MaterialInsert): Promise<void>;
  updateMaterial(id: string, mat: MaterialInsert): Promise<void>;
  deleteMaterial(id: string): Promise<void>;

  // Ideas
  listIdeas(): Promise<Idea[]>;
  insertIdea(idea: IdeaInsert): Promise<void>;
  updateIdea(id: string, idea: IdeaInsert): Promise<void>;
  deleteIdea(id: string): Promise<void>;

  // Blog posts
  listPosts(): Promise<BlogPost[]>;
  listPublishedPosts(): Promise<BlogPost[]>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  insertPost(post: BlogPostInsert): Promise<void>;
  updatePost(id: string, post: BlogPostInsert): Promise<void>;
  deletePost(id: string): Promise<void>;
  togglePublish(id: string, published: boolean, publishedAt: string | null): Promise<void>;

  // Products
  listProducts(): Promise<Product[]>;
  insertProduct(prod: ProductInsert): Promise<void>;
  updateProduct(id: string, prod: ProductInsert): Promise<void>;
  deleteProduct(id: string): Promise<void>;

  // Categories
  listCategories(): Promise<Category[]>;
  insertCategory(cat: CategoryInsert): Promise<void>;
  updateCategory(id: string, cat: CategoryInsert): Promise<void>;
  deleteCategory(id: string): Promise<void>;

  // Orders
  listOrders(): Promise<Order[]>;
  insertOrder(order: OrderInsert, items: OrderItemInsert[]): Promise<string>;
  updateOrderStatus(id: string, status: Order['status'], refId?: string | null): Promise<void>;
  listOrderItems(orderId: string): Promise<OrderItem[]>;

  // Notify requests
  listNotifyRequests(): Promise<NotifyRequest[]>;
  insertNotifyRequest(nr: NotifyRequestInsert): Promise<void>;
  toggleNotifyHandled(id: string, handled: boolean): Promise<void>;
  deleteNotifyRequest(id: string): Promise<void>;
}
