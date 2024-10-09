import { vi } from 'vitest';
import { TanstackQueryClient } from './queryClientProviderMock';

// https://github.com/vercel/next.js/discussions/48937#discussioncomment-7275050
// import { AppRouterContextProviderMock } from '@/lib/router-mock'
import { AppRouterContextProviderMock } from '@/lib/router-mock';

const push = vi.fn();
export function GlobalContextProvider({children}: {children: React.ReactNode}) {
    return (
      <TanstackQueryClient>
          <AppRouterContextProviderMock router={{ push }}>
            {children}
         </AppRouterContextProviderMock>
      </TanstackQueryClient>    
    );
  }
  