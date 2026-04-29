import {useQuery} from '@tanstack/react-query';

import {useAppStorage} from '@/modules/storage/hooks/useAppStorage';

import {authQueryKeys} from '../query-keys/auth.query-keys';
import {OrganizationService} from '../services/organization.service';

const organizationService = new OrganizationService();

export function useOrganizationSummariesQuery() {
  const {activeConnectionId} = useAppStorage();

  return useQuery({
    enabled: activeConnectionId !== undefined,
    queryFn: () => organizationService.getSummaries(),
    queryKey: authQueryKeys.organizationSummaries(activeConnectionId),
    staleTime: 1000 * 60 * 5,
  });
}
