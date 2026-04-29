import ApiInstace from '@/api/ApiInstace';
import {OrganizationOption} from '@/shared/types';

import {OrganizationSummaryResponseDto} from '../dto/organization-summary-response.dto';
import {organizationSummaryResponseSchema} from '../schemas/auth-response.schema';

export class OrganizationService {
  async getSummaries(): Promise<OrganizationOption[]> {
    const response =
      await ApiInstace.openUrlTimer<OrganizationSummaryResponseDto>({
        data: undefined,
        endPoint: 'arc/empresa/resumo',
        headers: undefined,
        method: 'get',
      });

    if (!response) {
      return [];
    }

    return organizationSummaryResponseSchema.parse(response).Resultado;
  }
}
