import { useEffect, useState } from 'react';
import {
  Lock, Loader2, AlertCircle, LogOut, Phone, Mail, Calendar, Heart,
  Plus, Trash2, Edit3, X, Check, Eye, EyeOff, Save,
} from 'lucide-react';
import { supabase, type Lead, type Material, type Idea, type BlogPost, type MaterialInsert, type IdeaInsert, type BlogPostInsert } from '@/lib/supabase';
import { useLang } from '@/lib/lang-context';

type AuthState = 'loading' | 'unauthenticated' | 'authenticated';
type AdminTab = 'leads' | 'materials' | 'ideas' | 'blog';

export function Admin() {
  const { t, lang, toggleLang } = useLang();
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('leads');

  // Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'won'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Materials
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [showMaterialForm, setShowMaterialForm] = useState(false);

  // Ideas
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [showIdeaForm, setShowIdeaForm] = useState(false);

  // Blog
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthState(data.session ? 'authenticated' : 'unauthenticated');
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(session ? 'authenticated' : 'unauthenticated');
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authState !== 'authenticated') return;
    fetchLeads();
    fetchMaterials();
    fetchIdeas();
    fetchPosts();
  }, [authState]);

  const fetchLeads = async () => {
    setLeadsLoading(true);
    const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (data) setLeads(data as Lead[]);
    setLeadsLoading(false);
  };

  const fetchMaterials = async () => {
    setMaterialsLoading(true);
    const { data } = await supabase.from('materials').select('*').order('sort_order', { ascending: true });
    if (data) setMaterials(data as Material[]);
    setMaterialsLoading(false);
  };

  const fetchIdeas = async () => {
    setIdeasLoading(true);
    const { data } = await supabase.from('ideas').select('*').order('sort_order', { ascending: true });
    if (data) setIdeas(data as Idea[]);
    setIdeasLoading(false);
  };

  const fetchPosts = async () => {
    setPostsLoading(true);
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data as BlogPost[]);
    setPostsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
    setLoginLoading(false);
  };

  const handleLogout = () => supabase.auth.signOut();

  const updateStatus = async (id: string, status: Lead['status']) => {
    setUpdatingId(id);
    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    if (!error) setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
    setUpdatingId(null);
  };

  const filteredLeads = filter === 'all' ? leads : leads.filter((l) => l.status === filter);

  const statusColors: Record<Lead['status'], string> = {
    new: 'bg-sage-100 text-sage-600 border-sage-200',
    contacted: 'bg-brass-100 text-brass-700 border-brass-200',
    won: 'bg-ink-900 text-cream-100 border-ink-700',
  };

  const formatDate = (iso: string) => {
    const locale = lang === 'fa' ? 'fa-IR' : 'en-US';
    return new Date(iso).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Material handlers
  const saveMaterial = async (mat: MaterialInsert, id?: string) => {
    if (id) {
      await supabase.from('materials').update(mat).eq('id', id);
    } else {
      await supabase.from('materials').insert(mat);
    }
    setShowMaterialForm(false);
    setEditingMaterial(null);
    fetchMaterials();
  };

  const deleteMaterial = async (id: string) => {
    if (!confirm('Delete this material?')) return;
    await supabase.from('materials').delete().eq('id', id);
    fetchMaterials();
  };

  // Idea handlers
  const saveIdea = async (idea: IdeaInsert, id?: string) => {
    if (id) {
      await supabase.from('ideas').update(idea).eq('id', id);
    } else {
      await supabase.from('ideas').insert(idea);
    }
    setShowIdeaForm(false);
    setEditingIdea(null);
    fetchIdeas();
  };

  const deleteIdea = async (id: string) => {
    if (!confirm('Delete this idea?')) return;
    await supabase.from('ideas').delete().eq('id', id);
    fetchIdeas();
  };

  // Blog handlers
  const savePost = async (post: BlogPostInsert, id?: string) => {
    if (id) {
      await supabase.from('blog_posts').update({ ...post, updated_at: new Date().toISOString() }).eq('id', id);
    } else {
      await supabase.from('blog_posts').insert(post);
    }
    setShowPostForm(false);
    setEditingPost(null);
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    fetchPosts();
  };

  const togglePublish = async (post: BlogPost) => {
    const published = !post.published;
    await supabase.from('blog_posts').update({
      published,
      published_at: published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }).eq('id', post.id);
    fetchPosts();
  };

  if (authState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <Loader2 className="h-8 w-8 animate-spin text-brass-400" />
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 px-5">
        <div className="w-full max-w-md rounded-3xl bg-cream-50 p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brass-500/10 text-brass-500">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="mt-6 font-serif text-2xl font-bold text-ink-900">RUF Admin</h1>
            <p className="mt-2 text-sm text-ink-400">Sign in to manage your site</p>
          </div>
          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-ink-700">Email</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rufcabinetry.com"
                required
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-ink-700">Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 placeholder:text-ink-300 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200"
              />
            </div>
            {loginError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {loginError}
              </div>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-8 py-4 text-base font-medium text-cream-100 transition-all hover:bg-ink-800 disabled:opacity-60"
            >
              {loginLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>
          <button
            onClick={() => window.history.back()}
            className="mt-4 w-full text-center text-sm text-ink-400 transition-colors hover:text-ink-600"
          >
            Back to site
          </button>
        </div>
      </div>
    );
  }

  const tabs: { key: AdminTab; label: string; count?: number }[] = [
    { key: 'leads', label: lang === 'fa' ? 'سرنخ‌ها' : 'Leads', count: leads.length },
    { key: 'materials', label: t.materialsPage.title, count: materials.length },
    { key: 'ideas', label: t.nav.ideas, count: ideas.length },
    { key: 'blog', label: t.blogPage.title, count: posts.length },
  ];

  return (
    <div className="min-h-screen bg-cream-100">
      <header className="sticky top-0 z-10 border-b border-ink-100 bg-cream-50/90 backdrop-blur-md">
        <div className="container-px flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-bold text-ink-900">RUF</span>
            <span className="rounded-full bg-brass-100 px-3 py-1 text-xs font-medium text-brass-700">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="rounded-full border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:bg-ink-100"
            >
              {lang === 'en' ? 'FA' : 'EN'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-px py-8">
        {/* Tab bar */}
        <div className="mb-8 flex gap-1 overflow-x-auto rounded-full bg-cream-200 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-ink-900 text-cream-100'
                  : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.key ? 'bg-cream-100/20' : 'bg-ink-100'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Leads tab */}
        {activeTab === 'leads' && (
          <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-serif text-2xl font-bold text-ink-900">
                {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
              </h2>
              <div className="flex gap-1 rounded-full bg-cream-200 p-1">
                {(['all', 'new', 'contacted', 'won'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                      filter === f ? 'bg-ink-900 text-cream-100' : 'text-ink-500 hover:text-ink-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {leadsLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brass-400" /></div>
            ) : filteredLeads.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink-200 py-20 text-center">
                <p className="text-ink-400">No leads yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="rounded-2xl border border-ink-100 bg-cream-50 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-ink-900">{lead.name}</h3>
                        <p className="mt-0.5 text-xs text-ink-400">{formatDate(lead.created_at)}</p>
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusColors[lead.status]}`}>
                        {lead.status}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-ink-700">
                        <Phone className="h-4 w-4 text-brass-500" />{lead.phone}
                      </a>
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-ink-700">
                          <Mail className="h-4 w-4 text-brass-500" />{lead.email}
                        </a>
                      )}
                    </div>
                    {lead.message && (
                      <p className="mt-3 rounded-xl bg-cream-200/50 p-3 text-sm text-ink-500">{lead.message}</p>
                    )}
                    {lead.liked_ideas && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl bg-brass-50 p-3 text-sm text-brass-700">
                        <Heart className="h-4 w-4 mt-0.5 fill-brass-500 text-brass-500 shrink-0" />
                        <span>Liked ideas: {lead.liked_ideas}</span>
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      {(['new', 'contacted', 'won'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(lead.id, s)}
                          disabled={updatingId === lead.id}
                          className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                            lead.status === s ? statusColors[s] : 'bg-cream-200 text-ink-400 hover:bg-cream-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Materials tab */}
        {activeTab === 'materials' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-ink-900">
                {materials.length} materials
              </h2>
              <button
                onClick={() => { setEditingMaterial(null); setShowMaterialForm(true); }}
                className="flex items-center gap-2 rounded-full bg-brass-500 px-5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:bg-brass-400"
              >
                <Plus className="h-4 w-4" /> Add Material
              </button>
            </div>

            {materialsLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brass-400" /></div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {materials.map((mat) => (
                  <div key={mat.id} className="overflow-hidden rounded-2xl border border-ink-100 bg-cream-50">
                    <div className="aspect-square overflow-hidden">
                      <img src={mat.image_url} alt={mat.name_en} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-ink-400">{mat.code}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${mat.category === 'color' ? 'bg-brass-100 text-brass-700' : 'bg-sage-100 text-sage-600'}`}>
                          {mat.category}
                        </span>
                      </div>
                      <h3 className="mt-2 font-serif font-bold text-ink-900">{mat.name_en}</h3>
                      <p className="mt-1 text-xs text-ink-500 line-clamp-2">{mat.description_en}</p>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => { setEditingMaterial(mat); setShowMaterialForm(true); }}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink-100 px-3 py-2 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-200"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => deleteMaterial(mat.id)}
                          className="flex items-center justify-center rounded-full bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showMaterialForm && (
              <MaterialForm
                material={editingMaterial}
                onSave={saveMaterial}
                onCancel={() => { setShowMaterialForm(false); setEditingMaterial(null); }}
              />
            )}
          </div>
        )}

        {/* Ideas tab */}
        {activeTab === 'ideas' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-ink-900">
                {ideas.length} ideas
              </h2>
              <button
                onClick={() => { setEditingIdea(null); setShowIdeaForm(true); }}
                className="flex items-center gap-2 rounded-full bg-brass-500 px-5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:bg-brass-400"
              >
                <Plus className="h-4 w-4" /> Add Idea
              </button>
            </div>

            {ideasLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brass-400" /></div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ideas.map((idea) => (
                  <div key={idea.id} className="overflow-hidden rounded-2xl border border-ink-100 bg-cream-50">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={idea.image_url} alt={idea.title_en} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif font-bold text-ink-900">{idea.title_en}</h3>
                      <p className="mt-1 text-xs text-ink-500 line-clamp-2">{idea.caption_en}</p>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => { setEditingIdea(idea); setShowIdeaForm(true); }}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink-100 px-3 py-2 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-200"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => deleteIdea(idea.id)}
                          className="flex items-center justify-center rounded-full bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showIdeaForm && (
              <IdeaForm
                idea={editingIdea}
                onSave={saveIdea}
                onCancel={() => { setShowIdeaForm(false); setEditingIdea(null); }}
              />
            )}
          </div>
        )}

        {/* Blog tab */}
        {activeTab === 'blog' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-ink-900">
                {posts.length} posts
              </h2>
              <button
                onClick={() => { setEditingPost(null); setShowPostForm(true); }}
                className="flex items-center gap-2 rounded-full bg-brass-500 px-5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:bg-brass-400"
              >
                <Plus className="h-4 w-4" /> New Post
              </button>
            </div>

            {postsLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-brass-400" /></div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex gap-4 rounded-2xl border border-ink-100 bg-cream-50 p-4">
                    <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                      <img src={post.cover_image_url} alt={post.title_en} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-ink-900">{post.title_en}</h3>
                          {post.published ? (
                            <span className="flex items-center gap-1 rounded-full bg-sage-100 px-2 py-0.5 text-xs text-sage-600">
                              <Eye className="h-3 w-3" /> Published
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-500">
                              <EyeOff className="h-3 w-3" /> Draft
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-ink-500 line-clamp-1">{post.excerpt_en}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setEditingPost(post); setShowPostForm(true); }}
                          className="flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-200"
                        >
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => togglePublish(post)}
                          className="flex items-center gap-1.5 rounded-full bg-brass-100 px-3 py-1.5 text-xs font-medium text-brass-700 transition-colors hover:bg-brass-200"
                        >
                          {post.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="flex items-center justify-center rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showPostForm && (
              <PostForm
                post={editingPost}
                onSave={savePost}
                onCancel={() => { setShowPostForm(false); setEditingPost(null); }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Material Form ---
function MaterialForm({ material, onSave, onCancel }: {
  material: Material | null;
  onSave: (mat: MaterialInsert, id?: string) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<MaterialInsert>({
    name_en: material?.name_en ?? '',
    name_fa: material?.name_fa ?? '',
    code: material?.code ?? '',
    description_en: material?.description_en ?? '',
    description_fa: material?.description_fa ?? '',
    image_url: material?.image_url ?? '',
    category: material?.category ?? 'material',
    sort_order: material?.sort_order ?? 0,
  });

  return (
    <ModalForm title={material ? 'Edit Material' : 'Add Material'} onCancel={onCancel}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name (EN)" value={form.name_en} onChange={(v) => setForm({ ...form, name_en: v })} />
        <Field label="Name (FA)" value={form.name_fa} onChange={(v) => setForm({ ...form, name_fa: v })} />
        <Field label="Code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as 'color' | 'material' })}
            className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200"
          >
            <option value="material">MDF Material</option>
            <option value="color">MDF Color</option>
          </select>
        </div>
        <Field label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} full />
        <Field label="Description (EN)" value={form.description_en} onChange={(v) => setForm({ ...form, description_en: v })} full textarea />
        <Field label="Description (FA)" value={form.description_fa} onChange={(v) => setForm({ ...form, description_fa: v })} full textarea />
        <Field label="Sort Order" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: parseInt(v) || 0 })} />
      </div>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onSave(form, material?.id)}
          className="flex items-center gap-2 rounded-full bg-brass-500 px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-brass-400"
        >
          <Save className="h-4 w-4" /> Save
        </button>
        <button
          onClick={onCancel}
          className="rounded-full border border-ink-200 px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
        >
          Cancel
        </button>
      </div>
    </ModalForm>
  );
}

// --- Idea Form ---
function IdeaForm({ idea, onSave, onCancel }: {
  idea: Idea | null;
  onSave: (idea: IdeaInsert, id?: string) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<IdeaInsert>({
    title_en: idea?.title_en ?? '',
    title_fa: idea?.title_fa ?? '',
    caption_en: idea?.caption_en ?? '',
    caption_fa: idea?.caption_fa ?? '',
    image_url: idea?.image_url ?? '',
    sort_order: idea?.sort_order ?? 0,
  });

  return (
    <ModalForm title={idea ? 'Edit Idea' : 'Add Idea'} onCancel={onCancel}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title (EN)" value={form.title_en} onChange={(v) => setForm({ ...form, title_en: v })} />
        <Field label="Title (FA)" value={form.title_fa} onChange={(v) => setForm({ ...form, title_fa: v })} />
        <Field label="Caption (EN)" value={form.caption_en} onChange={(v) => setForm({ ...form, caption_en: v })} full />
        <Field label="Caption (FA)" value={form.caption_fa} onChange={(v) => setForm({ ...form, caption_fa: v })} full />
        <Field label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} full />
        <Field label="Sort Order" value={String(form.sort_order)} onChange={(v) => setForm({ ...form, sort_order: parseInt(v) || 0 })} />
      </div>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onSave(form, idea?.id)}
          className="flex items-center gap-2 rounded-full bg-brass-500 px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-brass-400"
        >
          <Save className="h-4 w-4" /> Save
        </button>
        <button
          onClick={onCancel}
          className="rounded-full border border-ink-200 px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
        >
          Cancel
        </button>
      </div>
    </ModalForm>
  );
}

// --- Blog Post Form ---
function PostForm({ post, onSave, onCancel }: {
  post: BlogPost | null;
  onSave: (post: BlogPostInsert, id?: string) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<BlogPostInsert>({
    title_en: post?.title_en ?? '',
    title_fa: post?.title_fa ?? '',
    slug: post?.slug ?? '',
    excerpt_en: post?.excerpt_en ?? '',
    excerpt_fa: post?.excerpt_fa ?? '',
    content_en: post?.content_en ?? '',
    content_fa: post?.content_fa ?? '',
    cover_image_url: post?.cover_image_url ?? '',
    published: post?.published ?? false,
    published_at: post?.published_at ?? (post?.published ? new Date().toISOString() : null),
  });

  return (
    <ModalForm title={post ? 'Edit Post' : 'New Post'} onCancel={onCancel} wide>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title (EN)" value={form.title_en} onChange={(v) => setForm({ ...form, title_en: v })} />
        <Field label="Title (FA)" value={form.title_fa} onChange={(v) => setForm({ ...form, title_fa: v })} />
        <Field label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
        <Field label="Cover Image URL" value={form.cover_image_url} onChange={(v) => setForm({ ...form, cover_image_url: v })} />
        <Field label="Excerpt (EN)" value={form.excerpt_en} onChange={(v) => setForm({ ...form, excerpt_en: v })} full textarea />
        <Field label="Excerpt (FA)" value={form.excerpt_fa} onChange={(v) => setForm({ ...form, excerpt_fa: v })} full textarea />
        <Field label="Content (EN) — use ## for headings, blank line for paragraphs" value={form.content_en} onChange={(v) => setForm({ ...form, content_en: v })} full textarea large />
        <Field label="Content (FA) — use ## for headings, blank line for paragraphs" value={form.content_fa} onChange={(v) => setForm({ ...form, content_fa: v })} full textarea large />
      </div>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onSave(form, post?.id)}
          className="flex items-center gap-2 rounded-full bg-brass-500 px-6 py-3 text-sm font-medium text-ink-900 transition-colors hover:bg-brass-400"
        >
          <Save className="h-4 w-4" /> Save
        </button>
        <button
          onClick={onCancel}
          className="rounded-full border border-ink-200 px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
        >
          Cancel
        </button>
      </div>
    </ModalForm>
  );
}

// --- Shared form helpers ---
function ModalForm({ title, children, onCancel, wide }: {
  title: string;
  children: React.ReactNode;
  onCancel: () => void;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink-950/50 p-4 pt-16 backdrop-blur-sm">
      <div className={`w-full ${wide ? 'max-w-3xl' : 'max-w-2xl'} rounded-3xl bg-cream-50 p-6 lg:p-8`}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-ink-900">{title}</h3>
          <button onClick={onCancel} className="rounded-full p-2 text-ink-400 transition-colors hover:bg-ink-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, full, textarea, large }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  full?: boolean;
  textarea?: boolean;
  large?: boolean;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="mb-1.5 block text-sm font-medium text-ink-700">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={large ? 10 : 4}
          className="w-full resize-none rounded-xl border border-ink-200 px-4 py-3 text-sm text-ink-900 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-200"
        />
      )}
    </div>
  );
}
