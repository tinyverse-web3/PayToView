import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface GlobalState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useGlobalStore = create<GlobalState>()(
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
