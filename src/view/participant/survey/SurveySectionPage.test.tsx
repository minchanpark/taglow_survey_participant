import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppRoutes } from '../../../app/router';
import { useParticipantDraftStore } from '../../../store/participantDraftStore';
import { useParticipantProgressStore } from '../../../store/participantProgressStore';
import { renderWithProviders } from '../../../test/renderWithProviders';

describe('SurveySectionPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useParticipantDraftStore.getState().clearDraftValues();
    useParticipantProgressStore.getState().resetProgress();
  });

  it('renders the section form and mirrors answer changes into the draft snapshot', async () => {
    renderWithProviders(<AppRoutes />, {
      route: '/survey/demo/sections/facility',
    });

    expect(await screen.findByText('세탁실 만족도는 어떤가요?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '5' }));

    await waitFor(() => {
      expect(useParticipantDraftStore.getState().values['question-scale']).toEqual({ scoreValue: 5 });
    });
    expect(screen.getByRole('button', { name: '5' })).toHaveClass('is-selected');
  });
});
