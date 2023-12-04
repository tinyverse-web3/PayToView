import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface ListItemProps {
  ContractID: string;
  ContractName: string;
  Name: string;
  CommissionContractName: string;
  Fee: number;
  Cid: string;
  ContentType: string;
  Description: string;
  CidForpreview: string;
  Ipfs?: string;
  Ritio: any;
}
interface ListState {
  income: number;
  txList: any[];
  incomeList: any[];
  publishedList: ListItemProps[];
  paidList: ListItemProps[];
  forwardList: ListItemProps[];
  setPublishedList: (l: ListItemProps[]) => void;
  setPaidList: (l: ListItemProps[]) => void;
  setTxList: (l: any[]) => void;
  setIncomeList: (l: any[]) => void;
  setIncome: (n: number) => void;
  setForwardList: (l: ListItemProps[]) => void;
  add: (d: any) => void;
  reset: () => void;
}

export const useListStore = create<ListState>()(
  devtools(
    persist(
      (set) => ({
        income: 0,
        txList: [],
        incomeList: [],
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
        setTxList: (list) => {
          set({
            txList: list,
          });
        },
        setIncome: (n) => {
          set({
            income: n,
          });
        },
        setIncomeList: (list) => {
          set({
            incomeList: list,
          });
        },
        add: (d: any) => {
          set((state) => ({
            publishedList: [...state.publishedList, d],
          }));
        },
        reset: () => {
          set({
            txList: [],
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
