import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';

import {
  ParticipantApiControllerProvider,
} from '../controller/participantApiControllerProvider';
import { createParticipantApiRuntime } from './createParticipantApiRuntime';

export function ParticipantApiRuntimeProvider(props: PropsWithChildren) {
  const runtime = useMemo(() => createParticipantApiRuntime(), []);

  return (
    <ParticipantApiControllerProvider value={runtime.controller}>
      {props.children}
    </ParticipantApiControllerProvider>
  );
}

