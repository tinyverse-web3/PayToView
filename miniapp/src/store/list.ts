import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ListState {
  list: any[];
  payedList: any[];
  getList: (l: any[]) => void;
  getPayedList: (l: any[]) => void;
  add: (d: any) => void;
  reset: () => void;
}

export const useListStore = create<ListState>()(
  devtools(
    persist(
      (set) => ({
        list: [],
        payedList: [],
        getList: (list) => {
          set({
            list,
          });
        },
        getPayedList: (list) => {
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
