import { useMemo } from 'react';
import { useAccountStore } from '@/store';

export const useIpfsSrc = (cid: string) => {
  const { accountInfo } = useAccountStore((state) => state);
  accountInfo.publicKey = '08011220d39326ee3e7c95397776e12015a0ffe52e7439726c6aef1b6c7caa85cec57488'
  const src = useMemo(
    () =>
      `${import.meta.env.VITE_IPFS_GATEWAY_URL}/cat?pubkey=${accountInfo.publicKey
      }&cid=${cid}`,
    [cid, accountInfo.publicKey],
  );
  return src;
};