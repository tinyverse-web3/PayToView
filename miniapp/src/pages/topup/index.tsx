import * as React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
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
  useRadio,
} from '@chakra-ui/react';
import { hideStr } from '@/lib/utils';
import { EthTopupButton } from './components/EthTopupButton';
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
import { tvs2tonwei, tonwei2tvs, getTonToUsdRatio, getPayComment, officeTonPayAddress } from '@/lib/utils/coin';

// ton
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { CHAIN, toUserFriendlyAddress } from '@tonconnect/ui';
import { BOC, Builder } from 'ton3-core';
import { Address } from 'ton3-core';

import { beginCell } from '@ton/core';
import { useAccountStore } from '@/store';


export default function Index() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const nav = useNavigate();

  // bussiness
  const [fee, setFee] = useState(1000);

  const { accountInfo, balance } = useAccountStore((state) => state);
  const payComment = useMemo(() => getPayComment(accountInfo.address), [accountInfo.address]);

  // ton
  const [tonTranslateStatus, setTonTranslateStatus] = useState(false);
  const tonAddress = useTonAddress(true);
  const rawTonAddress = useTonAddress(false);
  const [tonConnectUi] = useTonConnectUI();
  const shortAddress = useMemo(() => hideStr(tonAddress, 5), [tonAddress]);
  const [tonTxReceipt, setTonTxReceipt] = useState<any>(null);
  const [tonPayValue, setTonPayValue] = React.useState('0');


  const focusHandler = (e) => {
    console.log('focus');
    e.target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  };
  const tonTranscationHandler = async () => {
    let usdRatio = 0;
    try {
      usdRatio = await getTonToUsdRatio();
      console.log('1ton to usd:', usdRatio);
    } catch (error) {
      console.error('getTonValueForUSD error: ', error);
      toast.error('getTonValueForUSD error');
      return;
    }
    toast.success('ton to usd radio: 1ton:' + usdRatio + 'usd');

    const payload = beginCell()
      .storeUint(0, 32)
      .storeStringTail(payComment)
      .endCell()
      .toBoc()
      .toString('base64');

    if (fee < 1) {
      toast.error('fee cannot be less than 1');
      return;
    }

    const amount = tvs2tonwei(fee, usdRatio)
    console.log('amount(tonwei):', amount)
    const tvs = tonwei2tvs(amount, usdRatio)
    console.log('tvs:', tvs)

    const txDetail = {
      validUntil: Math.floor(Date.now() / 1000) + 600, // unix epoch seconds
      messages: [
        {
          address: officeTonPayAddress,
          amount: amount,
          payload: payload,
        },
      ],
    };

    console.log('ton sendTransaction txDetail: ', txDetail);
    tonConnectUi
      .sendTransaction(txDetail)
      .then((result) => {
        console.log('ton sendTransaction result: ', result.boc);
        setTonTxReceipt(result);
        setTonTranslateStatus(false);
        tonConnectUi.disconnect();
        setLoading(false);
        setTonPayValue(amount);
      })
      .catch((error) => {
        console.error('ton sendTransaction error: ', error);
        setTonTranslateStatus(false);
        tonConnectUi.disconnect();
        setLoading(false);
      });
  };
  const topupTonHandler = () => {
    setLoading(true);
    if (tonConnectUi.connected) {
      tonTranscationHandler();
    } else {
      setTonTranslateStatus(true);
      tonConnectUi.connectWallet();
    }
  };

  useEffect(() => {
    if (tonTranslateStatus && tonConnectUi.connected) {
      tonTranscationHandler();
    }
  }, [
    tonConnectUi.connected,
    tonTranslateStatus,
  ]);
  const walletDisconnect = () => {
    tonConnectUi.disconnect();
  };

  return (
    <LayoutThird title={t('pages.topup.title')} path={ROUTE_PATH.INDEX}>
      <div className='h-full overflow-hidden p-4'>
        {/* <SimpleGrid columns={2} spacing='10px' className='mb-4'>
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
              {shortAddress}
            </Button>
          )}

          <Button
            colorScheme={tonConnectUi.connected ? 'blue' : 'gray'}
            onClick={walletDisconnect}
            isDisabled={!tonConnectUi.connected}>
            {t('pages.topup.btn_disconnect')}
          </Button>
        </SimpleGrid> */}
        <div className='mb-4'>
          <FormControl className='mb-4'>
            <FormLabel>{t('pages.topup.placeholder')}</FormLabel>
            <NumberInput
              width='100%'
              rounded={10}
              variant='filled'
              value={fee}
              min={0}
              max={10000}
              onFocus={focusHandler}
              onChange={(_, e: number) => setFee(isNaN(e) ? 0 : e)}>
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </div>
        <SimpleGrid columns={3} spacing='10px' className='mb-4'>
          <Button colorScheme='teal' onClick={() => setFee(100)}>
            100 TVS
          </Button>
          <Button colorScheme='teal' onClick={() => setFee(200)}>
            200 TVS
          </Button>
          <Button colorScheme='teal' onClick={() => setFee(30)}>
            500 TVS
          </Button>
        </SimpleGrid>
        <div>
          <Button
            className='w-full mb-4'
            isDisabled={fee <= 0}
            isLoading={loading}
            colorScheme='blue'
            onClick={topupTonHandler}>
            {t('pages.topup.btn_ton_topup')}
          </Button>
          <EthTopupButton fee={fee} />
        </div>
      </div>
    </LayoutThird>
  );
}



