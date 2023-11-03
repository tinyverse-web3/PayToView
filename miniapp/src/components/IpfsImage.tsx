import { Image } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useAccountStore } from '@/store';
interface Props {
  cid: string;
}
export const IpfsImage = ({ cid, ...rest }: Props) => {
  const { accountInfo } = useAccountStore((state) => state);
  console.log('IpfsImage->accountInfo:', accountInfo);
  console.log('IpfsImage->cid:', cid);
  accountInfo.publicKey = '04028def32b006d87426b221ca253748ac3545d729a0aa444676cc5ff0e3733c8bacdd25a5d3350a27bb89019b2662a1e219a19f9e3fbf93abfc751936b34a4137'
  const src = useMemo(
    () =>
      `${import.meta.env.VITE_IPFS_GATEWAY_URL}/cat?pubkey=${accountInfo.publicKey
      }&cid=${cid}`,
    [cid, accountInfo.publicKey],
  );
  return <Image src={src} {...rest} />;
};
