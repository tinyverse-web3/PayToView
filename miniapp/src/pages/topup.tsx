import {
  SimpleGrid,
  IconButton,
  Tabs,
  TabList,
  Tab,
  FormLabel,
  NumberInputField,
  NumberInput,
  FormControl,
  Button,
} from '@chakra-ui/react';
import { useEffect, useMemo, useCallback, useState } from 'react';
import { ListItem } from '@/components/ListItem';
import { Empty } from '@/components/Empty';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
import { useListStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { CHAIN, toUserFriendlyAddress } from '@tonconnect/ui';
import { BOC as BOC1, Builder } from 'ton3-core';
import { Address } from 'ton3-core';
import { beginCell } from '@ton/core';
import { useAccountStore } from '@/store';

export default function Index() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const nav = useNavigate();
  const [fee, setFee] = useState(0);
  const tonAddress = useTonAddress(true);
  const rawTonAddress = useTonAddress(false);
  const { accountInfo, balance } = useAccountStore((state) => state);
  const [tonConnectUi] = useTonConnectUI();
  const commitText = useMemo(
    () => 'tvswallet=' + accountInfo.address + '&app=payToView',
    [accountInfo.address],
  );
  const focusHandler = (e) => {
    console.log('focus');
    e.target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  };
  const topupHandler = () => {
    const officePayAddress =
      import.meta.env.VITE_PAYTOVIEW_OFFICE_TON_WALLET_ID || '';
    const payload = beginCell()
      .storeUint(0, 32)
      .storeStringTail(commitText)
      .endCell()
      .toBoc()
      .toString('base64');
    const txDetail = {
      validUntil: Math.floor(Date.now() / 1000) + 600, // unix epoch seconds
      messages: [
        {
          address: officePayAddress,
          amount: (fee / 10000).toString(),
          payload: payload,
        },
      ],
    };
    console.log('topup.tsx sendTransaction txDetail: ', txDetail);
    tonConnectUi
      .sendTransaction(txDetail)
      .then((result) => {
        console.log('topup.tsx sendTransaction result: ', result.boc);
      })
      .catch((error) => {
        console.error('topup.tsx sendTransaction error: ', error);
      });
  };
  const disconnect = () => {
    tonConnectUi.disconnect();
  };
  // console.log(tonAddress);
  // console.log(tonConnectUi);
  return (
    <LayoutThird title={t('pages.topup.title')} path={ROUTE_PATH.INDEX}>
      <div className='h-full overflow-hidden p-4'>
        <SimpleGrid columns={2} spacing='10px' className='mb-4'>
          {!tonConnectUi.connected ? (
            <Button
              colorScheme='blue'
              onClick={() => tonConnectUi.connectWallet()}>
              {t('pages.topup.btn_connect')}
            </Button>
          ) : (
            <Button
              colorScheme='blue'
              onClick={() => tonConnectUi.connectWallet()}>
              {tonAddress}
            </Button>
          )}

          <Button
            colorScheme={tonConnectUi.connected ? 'blue' : 'gray'}
            onClick={disconnect}
            isDisabled={!tonConnectUi.connected}>
            {t('pages.topup.btn_disconnect')}
          </Button>
        </SimpleGrid>
        <div className='mb-4'>
          <FormControl className='mb-4'>
            <FormLabel>{t('pages.topup.placeholder')}</FormLabel>
            <NumberInput
              width='100%'
              rounded={10}
              variant='filled'
              value={fee}
              min={0}
              onFocus={focusHandler}
              onChange={(_, e: number) => setFee(isNaN(e) ? 0 : e)}>
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </div>
        <SimpleGrid columns={3} spacing='10px' className='mb-4'>
          <Button onClick={() => setFee(10)}>10 TVS</Button>
          <Button onClick={() => setFee(20)}>20 TVS</Button>
          <Button onClick={() => setFee(30)}>50 TVS</Button>
        </SimpleGrid>
        <div>
          <Button
            className='w-full'
            isDisabled={fee <= 0}
            colorScheme='blue'
            onClick={topupHandler}>
            {t('pages.topup.btn_topup')}
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}
