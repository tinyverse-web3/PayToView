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
  const src = useMemo(
    () =>
      `http://39.108.147.241:8080/ipfs/${cid}`,
    [cid, accountInfo.publicKey],
  );
  return <Image src={src} {...rest} />;
};
