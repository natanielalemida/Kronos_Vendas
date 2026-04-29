import {UserDto} from '@/shared/types';

export type LoginResponseDto = {
  Resultado?: {
    Usuario?: UserDto;
  };
  Status: number;
  Mensagens: string[];
};
