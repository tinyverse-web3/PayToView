import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface ListItemProps {
  ContractID: string;
  ContractName: string;
  Name: string;
  CommissionContractName: string;
  Fee: number;
  Cid: string;
  ContentType: 'text' | 'image' | 'video' | 'audio' | 'file';
  CidForpreview: string;
  Ipfs?: string;
  Ritio: any;
}
interface ListState {
  publishedList: ListItemProps[];
  paidList: ListItemProps[];
  forwardList: ListItemProps[];
  setPublishedList: (l: ListItemProps[]) => void;
  setPaidList: (l: ListItemProps[]) => void;
  setForwardList: (l: ListItemProps[]) => void;
  add: (d: any) => void;
  reset: () => void;
}

export const useListStore = create<ListState>()(
  devtools(
    persist(
      (set) => ({
        publishedList: [],
        paidList: [],
        forwardList: [],
        setPublishedList: (list) => {
          set({
            publishedList: list,
          });
        },
        setPaidList: (list) => {
          set({
            paidList: list,
          });
        },
        setForwardList: (list) => {
          set({
            forwardList: list,
          });
        },
        add: (d: any) => {
          set((state) => ({
            publishedList: [...state.publishedList, d],
          }));
        },
        reset: () => {
          set({
            publishedList: [],
            paidList: [],
            forwardList: [],
          });
        },
      }),
      {
        name: 'list-store',
      },
    ),
  ),
);
