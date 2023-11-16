import { useCopyToClipboard } from 'react-use';
import { useMemo } from 'react';
import { toast } from 'react-hot-toast';
interface Props {
  address?: string;
}
export const Address = ({ address }: Props) => {
  const [_, copyToClipboard] = useCopyToClipboard();
  const shortAddress = useMemo(() => {
    return `${address?.substring(0, 5)}*****${address?.substring(
      address?.length - 5,
    )}`;
  }, [address]);
  const clickHandler = () => {
    if (address) {
      copyToClipboard(address);
      toast.success('复制成功');
    }
  };
  return (
    <div
      className=' h-6 flex items-center text-4'
      onClick={() => clickHandler()}>
      {shortAddress}
    </div>
  );
};
