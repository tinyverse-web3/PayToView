import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ListState {
  list: any[];
  getList: (l: any[]) => void;
  reset: () => void;
}

export const useListStore = create<ListState>()(
  devtools(
    persist(
      (set) => ({
        list: [],
        getList: (list) => {
          set({
            list,
          });
        },
        reset: () => {
          set({
            list: [],
          });
        },
      }),
      {
        name: 'list-store',
      },
    ),
  ),
);
