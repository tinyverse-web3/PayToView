import { useMemo } from 'react';
import { useAccountStore } from '@/store';

export const useIpfsSrc = (cid: string) => {
  const { accountInfo } = useAccountStore((state) => state);
  const src = useMemo(
    () =>
      `${import.meta.env.VITE_IPFS_GATEWAY_URL}/cat?pubkey=${accountInfo.publicKey}&cid=${cid}`,
    [cid, accountInfo.publicKey],
  );
  return src;
};