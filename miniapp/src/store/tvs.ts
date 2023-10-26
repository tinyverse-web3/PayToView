import { create } from 'zustand';
import { devtools,  } from 'zustand/middleware';
import { Tvs } from '@/lib/tvs';
interface TvsState {
  tvs: Tvs;
}

export const useTvsStore = create<TvsState>()(
  devtools(() => ({
    tvs: new Tvs(),
  })),
);
