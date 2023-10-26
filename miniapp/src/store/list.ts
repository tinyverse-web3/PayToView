import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ListState {
  list: any[];
  paiedList: any[];
  forwardList: any[];
  setList: (l: any[]) => void;
  setPaiedList: (l: any[]) => void;
  setForwardList: (l: any[]) => void;
  add: (d: any) => void;
  reset: () => void;
}

export const useListStore = create<ListState>()(
  devtools(
    persist(
      (set) => ({
        list: [],
        paiedList: [],
        forwardList: [],
        setList: (list) => {
          set({
            list,
          });
        },
        setPaiedList: (list) => {
          set({
            paiedList: list,
          });
        },
        setForwardList: (list) => {
          set({
            forwardList: list,
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
