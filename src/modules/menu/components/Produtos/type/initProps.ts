export type InitProps = {
  handleGetProdutos: () => Promise<void>;
  setOptions?: (value: {syncds: true; notSyncd: true}) => void;
};
