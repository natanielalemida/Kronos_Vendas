import {create} from 'zustand';

type SettingsPageStore = {
  isOnlineOnlyEnabled: boolean;
  setOnlineOnlyEnabled: (value: boolean) => void;
};

export const useSettingsPageStore = create<SettingsPageStore>(set => ({
  isOnlineOnlyEnabled: false,
  setOnlineOnlyEnabled: value => set({isOnlineOnlyEnabled: value}),
}));
