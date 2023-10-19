import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AccountState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAccountStore = create<AccountState>()(
  devtools(
    persist(
      (set) => ({
        loading: false,
        setLoading: (loading) => {
          set({
            loading,
          });
        },
        reset: () => {
          set({
            loading: false,
          });
        },
      }),
      {
        name: 'global-store',
      },
    ),
  ),
);
