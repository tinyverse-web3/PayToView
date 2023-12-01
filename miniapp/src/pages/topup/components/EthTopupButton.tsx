import { Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
interface Props {
  fee: number;
}
export const EthTopupButton = ({ fee }: Props) => {
  const { t } = useTranslation();
  const topupHandler = () => {};

  return (
    <Button
      className='w-full'
      isDisabled={fee >= 0}
      colorScheme='blue'
      onClick={topupHandler}>
      {t('pages.topup.btn_eth_topup')}
    </Button>
  );
};
