import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface DetailState {
  readStatus: boolean;
  setReadStatus: (r: boolean) => void;
  reset: () => void;
}

export const useDetailStore = create<DetailState>()(
  devtools(
    persist(
      (set) => ({
        readStatus: false,
        setReadStatus: (readStatus) => {
          set({
            readStatus,
          });
        },
        reset: () => {
          set({
            readStatus: false,
          });
        },
      }),
      {
        name: 'detail-store',
      },
    ),
  ),
);
