export type Route =
  | { name: 'home' }
  | { name: 'materials' }
  | { name: 'ideas' }
  | { name: 'blog' }
  | { name: 'blog-post'; slug: string }
  | { name: 'admin' };

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#/, '');

  if (clean === 'admin') return { name: 'admin' };
  if (clean === 'materials') return { name: 'materials' };
  if (clean === 'ideas') return { name: 'ideas' };
  if (clean === 'blog') return { name: 'blog' };
  if (clean.startsWith('blog/')) return { name: 'blog-post', slug: clean.slice(5) };

  return { name: 'home' };
}

export function navigate(route: Route) {
  let hash = '#';
  switch (route.name) {
    case 'home': hash = '#'; break;
    case 'materials': hash = '#materials'; break;
    case 'ideas': hash = '#ideas'; break;
    case 'blog': hash = '#blog'; break;
    case 'blog-post': hash = `#blog/${route.slug}`; break;
    case 'admin': hash = '#admin'; break;
  }
  window.location.hash = hash;
  if (route.name === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
}
