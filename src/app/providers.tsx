import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';

import { ParticipantApiRuntimeProvider } from '../api/participant';
import '../styles/global.css';
import { createAppQueryClient } from './queryClient';

export function AppProviders(props: PropsWithChildren) {
  const [queryClient] = useState(() => createAppQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ParticipantApiRuntimeProvider>{props.children}</ParticipantApiRuntimeProvider>
    </QueryClientProvider>
  );
}
