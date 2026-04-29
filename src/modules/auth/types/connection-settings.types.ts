export type ConnectionSettingsModalProps = {
  connectionId?: number;
  isVisible: boolean;
  onClose: () => void;
};

export type ConnectionSettingsFormState = {
  codStore: string;
  host: string;
  terminal: string;
};

export type ConnectionSettingsFormActions = {
  setCodStore: (value: string) => void;
  setHost: (value: string) => void;
  setTerminal: (value: string) => void;
};

export type ConnectionSettingsHookResult = {
  form: ConnectionSettingsFormState;
  actions: ConnectionSettingsFormActions;
  isSaveDisabled: boolean;
  save: () => Promise<void>;
  testConnection: () => Promise<void>;
  reset: () => void;
};
