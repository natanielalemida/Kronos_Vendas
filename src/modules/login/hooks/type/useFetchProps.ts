export type LoadingProps = {
  isLoading: boolean;
  message?: string;
};

export type UseFetchProps = {
  setProgress: (progress: LoadingProps | undefined) => void;
};
