import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Collections } from '@/components/Collections';
import { WhyRUF } from '@/components/WhyRUF';
import { Process } from '@/components/Process';
import { MaterialsTeaser } from '@/components/MaterialsTeaser';
import { IdeasSection } from '@/components/IdeasSection';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { FloatingCTA } from '@/components/FloatingCTA';
import { Admin } from '@/components/Admin';
import { MaterialsPage } from '@/components/MaterialsPage';
import { IdeasPage } from '@/components/IdeasPage';
import { BlogListPage } from '@/components/BlogListPage';
import { BlogPostPage } from '@/components/BlogPostPage';
import { parseHash, type Route } from '@/lib/router';

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return hash;
}

function App() {
  const hash = useHashRoute();
  const route: Route = parseHash(hash);

  if (route.name === 'admin') {
    return <Admin />;
  }

  if (route.name === 'materials') {
    return (
      <div className="min-h-screen bg-cream-100">
        <Navbar />
        <MaterialsPage />
        <Footer />
        <FloatingCTA />
      </div>
    );
  }

  if (route.name === 'ideas') {
    return (
      <div className="min-h-screen bg-cream-100">
        <Navbar />
        <IdeasPage />
        <Footer />
        <FloatingCTA />
      </div>
    );
  }

  if (route.name === 'blog') {
    return (
      <div className="min-h-screen bg-cream-100">
        <Navbar />
        <BlogListPage />
        <Footer />
        <FloatingCTA />
      </div>
    );
  }

  if (route.name === 'blog-post') {
    return (
      <div className="min-h-screen bg-cream-100">
        <Navbar />
        <BlogPostPage slug={route.slug} />
        <Footer />
        <FloatingCTA />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <Navbar />
      <main>
        <Hero />
        <Collections />
        <WhyRUF />
        <Process />
        <MaterialsTeaser />
        <IdeasSection />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}

export default App;
