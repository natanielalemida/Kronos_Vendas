import {create} from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  organizationCode?: number;
  username?: string;
  setSession: (payload: {
    isAuthenticated: boolean;
    organizationCode?: number;
    username?: string;
  }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  organizationCode: undefined,
  username: undefined,
  setSession: payload => set(payload),
  clearSession: () =>
    set({
      isAuthenticated: false,
      organizationCode: undefined,
      username: undefined,
    }),
}));
