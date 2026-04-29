export type UseSetupSettingsPageResult = {
  data: {
    isOnlineOnlyEnabled: boolean;
    isPending: boolean;
  };
  handlers: {
    handleToggleOnlineOnly: () => void;
  };
};
