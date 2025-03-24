export type UseSettingsRepositoryProps = {
  isActive: boolean;
};

export type useSaveSettingsProps = {
  host?: string;
  codStore?: string;
  terminal?: string;
  id?: number;
  closeModal: () => void;
};
