import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type RouteName = 'home' | 'materials' | 'ideas' | 'blog' | 'blog-post' | 'shop' | 'cart' | 'checkout' | 'contact' | 'admin' | 'payment-result';

export type Route = {
  name: RouteName;
  params?: Record<string, string>;
};

type RouterContextType = {
  route: Route;
  navigate: (route: Route) => void;
};

const RouterContext = createContext<RouterContextType | null>(null);

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [path, queryString] = hash.split('?');
  const segments = path.split('/').filter(Boolean);
  const params: Record<string, string> = {};
  if (queryString) {
    new URLSearchParams(queryString).forEach((v, k) => { params[k] = v; });
  }
  if (segments.length === 0) return { name: 'home' };
  if (segments[0] === 'materials') return { name: 'materials' };
  if (segments[0] === 'ideas') return { name: 'ideas' };
  if (segments[0] === 'blog' && segments[1]) return { name: 'blog-post', params: { slug: segments[1] } };
  if (segments[0] === 'blog') return { name: 'blog' };
  if (segments[0] === 'shop') return { name: 'shop' };
  if (segments[0] === 'cart') return { name: 'cart' };
  if (segments[0] === 'checkout') return { name: 'checkout' };
  if (segments[0] === 'contact') return { name: 'contact' };
  if (segments[0] === 'admin') return { name: 'admin' };
  if (segments[0] === 'payment-result') return { name: 'payment-result', params };
  return { name: 'home' };
}

function routeToHash(route: Route): string {
  switch (route.name) {
    case 'home': return '#/';
    case 'materials': return '#/materials';
    case 'ideas': return '#/ideas';
    case 'blog': return '#/blog';
    case 'blog-post': return `#/blog/${route.params?.slug ?? ''}`;
    case 'shop': return '#/shop';
    case 'cart': return '#/cart';
    case 'checkout': return '#/checkout';
    case 'contact': return '#/contact';
    case 'admin': return '#/admin';
    case 'payment-result': return '#/payment-result';
    default: return '#/';
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(parseHash());

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (newRoute: Route) => {
    window.location.hash = routeToHash(newRoute);
    setRoute(newRoute);
    window.scrollTo(0, 0);
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}

export function navigate(route: Route) {
  window.location.hash = routeToHash(route);
  window.scrollTo(0, 0);
}
