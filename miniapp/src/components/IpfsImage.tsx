import { Image } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useAccountStore } from '@/store';
interface Props {
  cid: string;
}
export const IpfsImage = ({ cid, ...rest }: Props) => {
  const { accountInfo } = useAccountStore((state) => state);
  accountInfo.publicKey = '08011220d39326ee3e7c95397776e12015a0ffe52e7439726c6aef1b6c7caa85cec57488'
  console.log('IpfsImage->accountInfo:', accountInfo);
  console.log('IpfsImage->cid:', cid);
  const src = useMemo(
    () =>
      `${import.meta.env.VITE_IPFS_GATEWAY_URL}/cat?pubkey=${accountInfo.publicKey}&cid=${cid}`,
    [cid, accountInfo.publicKey],
  );
  return <Image src={src} {...rest} />;
};
