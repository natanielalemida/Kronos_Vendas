import ApiInstace from '@/api/ApiInstace';

import {CompanyResponseDto} from '../dto/company-response.dto';
import {LoginRequestDto} from '../dto/login-request.dto';
import {LoginResponseDto} from '../dto/login-response.dto';
import {
  companyResponseSchema,
  loginResponseSchema,
} from '../schemas/auth-response.schema';
import {loginRequestSchema} from '../schemas/login.schema';

export class AuthService {
  async login(payload: LoginRequestDto): Promise<LoginResponseDto | undefined> {
    const parsedPayload = loginRequestSchema.parse(payload);
    const response = await ApiInstace.openUrl<
      LoginResponseDto,
      LoginRequestDto
    >({
      data: parsedPayload,
      endPoint: 'arc/usuario/login',
      headers: undefined,
      method: 'post',
    });

    if (!response) {
      return undefined;
    }

    return loginResponseSchema.parse(response);
  }

  async getCompany(
    organizationCode: number,
  ): Promise<CompanyResponseDto | undefined> {
    const response = await ApiInstace.openUrl<CompanyResponseDto>({
      data: undefined,
      endPoint: `arc/empresa/${organizationCode}`,
      headers: undefined,
      method: 'get',
    });

    if (!response) {
      return undefined;
    }

    return companyResponseSchema.parse(response);
  }
}
