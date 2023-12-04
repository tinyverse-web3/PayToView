import { Image } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useAccountStore } from '@/store';
import { template } from 'lodash';

interface Props {
  cid: string;
}
export const IpfsImage = ({ cid, ...rest }: Props) => {
  const { accountInfo } = useAccountStore((state) => state);
  const src = useMemo(() => {
    return template(import.meta.env.VITE_IPFS_GATEWAY_URL)({
      cid,
    });
  }, [cid, accountInfo.publicKey]);
  return <Image src={src} {...rest} />;
};
