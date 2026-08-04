import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { LangProvider } from '@/lib/lang-context';
import { RouterProvider } from '@/lib/router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <RouterProvider>
        <App />
      </RouterProvider>
    </LangProvider>
  </StrictMode>
);
