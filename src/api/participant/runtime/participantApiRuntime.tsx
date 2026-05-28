import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';

import {
  ParticipantApiControllerProvider,
} from '../controller/participantApiControllerProvider';
import { getParticipantApiRuntime } from './createParticipantApiRuntime';

export function ParticipantApiRuntimeProvider(props: PropsWithChildren) {
  const runtime = useMemo(() => getParticipantApiRuntime(), []);

  return (
    <ParticipantApiControllerProvider value={runtime.controller}>
      {props.children}
    </ParticipantApiControllerProvider>
  );
}
