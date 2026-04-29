export type ProductsNavigation = {
  goBack: () => void;
  navigate: (routeName: string, params?: Record<string, unknown>) => void;
};

export type ProductDetailsRouteParams = {
  id?: number;
};
