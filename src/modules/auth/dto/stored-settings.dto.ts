import {SaveSettingsDto} from './save-settings.dto';

export type StoredSettingsDto = SaveSettingsDto & {
  idConecction: number;
};
