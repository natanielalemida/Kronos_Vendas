import {OrganizationOption, UserDto} from '@/shared/types';

export type ConnectionOption = {
  id: number;
  host: string;
  codStore: string;
  terminal: string;
};

export type StoredCredentials = {
  login: string;
  password: string;
};

export type AppStorageSnapshot = {
  authenticatedUser?: UserDto;
  storedCredentials?: StoredCredentials;
  offlineOrganization?: OrganizationOption;
  activeConnectionId?: number;
  companyCode?: number;
  terminal?: number;
  biometricsEnabled: boolean;
  syncProductImagesEnabled: boolean;
  connectionOptions: ConnectionOption[];
};
