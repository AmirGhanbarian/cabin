import { useEffect } from 'react';
import { useLang } from '@/lib/lang-context';
import { useRouter } from '@/lib/router';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Hero, MaterialsTeaser } from '@/components/Hero';
import { MaterialsPage } from '@/components/MaterialsPage';
import { IdeasPage } from '@/components/IdeasPage';
import { BlogListPage, BlogPostPage } from '@/components/BlogPages';
import { ShopPage } from '@/components/ShopPage';
import { CartPage } from '@/components/CartPage';
import { CheckoutPage } from '@/components/CheckoutPage';
import { ContactPage } from '@/components/ContactPage';
import { Admin } from '@/components/Admin';
import { PaymentResultPage } from '@/components/PaymentResultPage';

export default function App() {
  const { route } = useRouter();
  const { dir } = useLang();

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = dir === 'rtl' ? 'fa' : 'en';
  }, [dir]);

  const isAdmin = route.name === 'admin';
  const isPaymentResult = route.name === 'payment-result';

  let content;
  switch (route.name) {
    case 'home':
      content = (
        <>
          <Hero />
          <MaterialsTeaser />
          <ContactPage />
        </>
      );
      break;
    case 'materials': content = <MaterialsPage />; break;
    case 'ideas': content = <IdeasPage />; break;
    case 'blog': content = <BlogListPage />; break;
    case 'blog-post': content = <BlogPostPage slug={route.params?.slug ?? ''} />; break;
    case 'shop': content = <ShopPage />; break;
    case 'cart': content = <CartPage />; break;
    case 'checkout': content = <CheckoutPage />; break;
    case 'contact': content = <ContactPage />; break;
    case 'admin': content = <Admin />; break;
    case 'payment-result': content = <PaymentResultPage />; break;
    default: content = <Hero />; break;
  }

  if (isAdmin || isPaymentResult) {
    return <>{content}</>;
  }

  return (
    <div dir={dir}>
      <Nav />
      <main>{content}</main>
      <Footer />
    </div>
  );
}
