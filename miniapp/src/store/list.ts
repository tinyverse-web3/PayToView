import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ListState {
  list: any[];
  getList: (l: any[]) => void;
  add: (d: any) => void;
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
        add: (d: any) => {
          set((state) => ({
            list: [...state.list, d],
          }));
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
