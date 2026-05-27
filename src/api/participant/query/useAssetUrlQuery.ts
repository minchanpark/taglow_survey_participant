import { useQuery } from '@tanstack/react-query';

import { useParticipantApiController } from '../controller/participantApiControllerProvider';
import type { SurveyAsset } from '../model/asset';
import { participantQueryKeys } from './queryKeys';

export function useAssetUrlQuery(asset: SurveyAsset | undefined) {
  const controller = useParticipantApiController();

  return useQuery({
    queryKey: participantQueryKeys.assetUrl(asset?.id ?? ''),
    queryFn: () => controller.getAssetUrl(asset as SurveyAsset),
    enabled: Boolean(asset),
  });
}

