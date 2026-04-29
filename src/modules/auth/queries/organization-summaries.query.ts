import {useQuery} from '@tanstack/react-query';

import {useAppStorage} from '@/modules/storage/hooks/useAppStorage';

import {authQueryKeys} from '../query-keys/auth.query-keys';
import {OrganizationService} from '../services/organization.service';

const organizationService = new OrganizationService();

export function useOrganizationSummariesQuery() {
  const {activeConnectionId, connectionOptions, hasHydrated} = useAppStorage();
  const hasActiveConnection =
    activeConnectionId !== undefined &&
    connectionOptions.some(
      connectionOption => connectionOption.id === activeConnectionId,
    );

  return useQuery({
    enabled: hasHydrated && hasActiveConnection,
    queryFn: () => organizationService.getSummaries(),
    queryKey: authQueryKeys.organizationSummaries(activeConnectionId),
    staleTime: 1000 * 60 * 5,
  });
}
