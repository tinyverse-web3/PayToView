import { useCopyToClipboard } from 'react-use';
import { useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
interface Props {
  address?: string;
}
export const Address = ({ address }: Props) => {
  const {t} = useTranslation();
  const [_, copyToClipboard] = useCopyToClipboard();
  const shortAddress = useMemo(() => {
    return `${address?.substring(0, 5)}*****${address?.substring(
      address?.length - 5,
    )}`;
  }, [address]);
  const clickHandler = () => {
    if (address) {
      copyToClipboard(address);
      toast.success(t('common.copy.success'));
    }
  };
  return (
    <div
      className='flex items-center text-4'
      onClick={() => clickHandler()}>
      {shortAddress}
    </div>
  );
};
