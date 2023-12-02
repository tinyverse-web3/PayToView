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

// ton
import { TonConnectButton } from '@tonconnect/ui-react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { CHAIN, toUserFriendlyAddress } from '@tonconnect/ui';
import { BOC, Builder } from 'ton3-core';
import { Address } from 'ton3-core';
import { hideStr } from '@/lib/utils';
import { beginCell } from '@ton/core';
import { useAccountStore } from '@/store';

// evm
import { useDebounce } from 'use-debounce';
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
  useConnect as useEvmConnect,
  useDisconnect as useEvmDisconnect,
  useAccount as useEvmAccount,
} from 'wagmi';
import { useWeb3ModalState } from '@web3modal/wagmi/react';
import { parseEther, Hex, stringify } from 'viem';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { SendTransactionResult } from '@wagmi/core';

export default function Index() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const nav = useNavigate();

  // bussiness
  const [fee, setFee] = useState(1000);

  const { accountInfo, balance } = useAccountStore((state) => state);
  const commentText = useMemo(
    () => 'tvswallet=' + accountInfo.address + '&app=' + import.meta.env.VITE_PAY_APP_NAME,
    [accountInfo.address],
  );

  // ton
  const [tonTranslateStatus, setTonTranslateStatus] = useState(false);
  const tonAddress = useTonAddress(true);
  const rawTonAddress = useTonAddress(false);
  const [tonConnectUi] = useTonConnectUI();
  const shortAddress = useMemo(() => hideStr(tonAddress, 5), [tonAddress]);
  const [tonTxReceipt, setTonTxReceipt] = useState<any>(null);
  const [tonPayAmount, setTonPayAmount] = React.useState('0');

  // evm
  const [ethTranslateStatus, setEthTranslateStatus] = useState(false);
  const { disconnect: evmDisconnect } = useEvmDisconnect();
  const {
    address: evmWalletAddress,
    isConnecting: isEvmWalletConnecting,
    isDisconnected: isEvmWalletDisconnected,
  } = useEvmAccount();
  const { selectedNetworkId: selectedEvmNetworkId } = useWeb3ModalState();
  const { open: OpenEvmWallet } = useWeb3Modal();
  const [evmPayAmount, setEvmPayAmount] = React.useState('');
  // const [evmDebouncedPayAmount] = useDebounce(evmPayAmount, 500)
  // var  rcepipt: SendTransactionResult = {
  //   hash : `0x${BigInt("0x" + Buffer.from(commentText).toString("hex")).toString(16)}` as Hex
  // }
  const [evmWaitTxReceipt, setEvmWaitTxReceipt] = useState<any>(null);

  const focusHandler = (e) => {
    console.log('focus');
    e.target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  };
  const tonTranscationHandler = async () => {
    const officePayAddress = import.meta.env.VITE_OFFICE_TON_WALLET_ID || '';
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
      .storeStringTail(commentText)
      .endCell()
      .toBoc()
      .toString('base64');

    if (fee < 1) {
      toast.error('fee cannot be less than 1');
      return;
    }

    debugger
    const usdToTvsRatio = 1000
    const tonWeiValue = parseInt(calculateWeitonAmount(fee, usdRatio, usdToTvsRatio).toFixed(0), 10)
    console.log(tonWeiValue)
    const tvsValue = parseInt(calculateTvsAmount(tonWeiValue, usdRatio, usdToTvsRatio).toFixed(0), 10)
    console.log(tvsValue)

    if (tonWeiValue < 10) {
      toast.error('ton amount cannot be less than 10');
      return;
    }
    setTonPayAmount(tonWeiValue.toFixed(0));
    const txDetail = {
      validUntil: Math.floor(Date.now() / 1000) + 600, // unix epoch seconds
      messages: [
        {
          address: officePayAddress,
          amount: tonWeiValue.toFixed(0),
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
    isEvmWalletDisconnected,
    isEvmWalletConnecting,
    ethTranslateStatus,
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

export async function getTonToUsdRatio(): Promise<any> {
  const response = await axios.get(
    'https://tonapi.io/v2/rates?tokens=ton&currencies=ton%2Cusd%2Crub',
  );
  const prices = response.data.rates.TON.prices;
  return prices.USD;
}

function calculateWeitonAmount(tvsAmount: number, tonToUsdRatio: number, usdToTonRatio: number): number {
  const usdAmount = tvsAmount / usdToTonRatio;
  const tonAmount = usdAmount / tonToUsdRatio;
  const weitonLen = 1000000000
  const weitonAmount = tonAmount * weitonLen;
  return weitonAmount;
}

function calculateTvsAmount(weitonAmount: number, tonToUsdRatio: number, usdToTonRatio: number): number {
  const weitonLen = 1000000000
  const tonAmount = weitonAmount / weitonLen;
  const usdAmount = tonAmount * tonToUsdRatio;
  const tvsAmount = usdAmount * usdToTonRatio;
  return tvsAmount;
}