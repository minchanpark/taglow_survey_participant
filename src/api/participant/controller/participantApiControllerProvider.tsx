import { createContext, useContext } from 'react';

import type { ParticipantApiController } from './participantApiController';

const ParticipantApiControllerContext = createContext<ParticipantApiController | null>(null);

export const ParticipantApiControllerProvider = ParticipantApiControllerContext.Provider;

export function useParticipantApiController(): ParticipantApiController {
  const controller = useContext(ParticipantApiControllerContext);

  if (!controller) {
    throw new Error('ParticipantApiControllerProvider is missing.');
  }

  return controller;
}

