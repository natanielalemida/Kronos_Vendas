export type InitProps = {
  handleGetUsers: () => Promise<void>;
  setTextFilter: (value: string) => void;
};
