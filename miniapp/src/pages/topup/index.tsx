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
  const [tabIndex, setTabIndex] = useState(0);
  const nav = useNavigate();

  // bussiness
  const [fee, setFee] = useState(10000000000);

  const { accountInfo, balance } = useAccountStore((state) => state);
  const commentText = useMemo(
    () => 'tvswallet=' + accountInfo.address + '&app=payToView',
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
      usdRatio = await getTonValueForUSD();
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

    const tvsRatio = 10 ** 3
    const tonWeiValue = (fee * (1 / tvsRatio) * (1 / usdRatio) * (10 ** 9)); // 1vs=1/1000usd; 1usd=1/2.41ton 1ton=1000000000tonwei

    if (tonWeiValue < 10) {
      toast.error('ton amount cannot be less than 10');
      return;
    }
    setTonPayAmount(tonWeiValue.toFixed());
    const txDetail = {
      validUntil: Math.floor(Date.now() / 1000) + 600, // unix epoch seconds
      messages: [
        {
          address: officePayAddress,
          amount: tonWeiValue.toString(),
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
      })
      .catch((error) => {
        console.error('ton sendTransaction error: ', error);
        setTonTranslateStatus(false);
        tonConnectUi.disconnect();
      });
  };
  const topupTonHandler = () => {
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
              onFocus={focusHandler}
              onChange={(_, e: number) => setFee(isNaN(e) ? 0 : e)}>
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </div>
        <SimpleGrid columns={3} spacing='10px' className='mb-4'>
          <Button colorScheme='teal' onClick={() => setFee(10)}>
            10 TVS
          </Button>
          <Button colorScheme='teal' onClick={() => setFee(20)}>
            20 TVS
          </Button>
          <Button colorScheme='teal' onClick={() => setFee(30)}>
            50 TVS
          </Button>
        </SimpleGrid>
        <div>
          <Button
            className='w-full'
            isDisabled={fee <= 0}
            colorScheme='blue'
            onClick={topupTonHandler}>
            {t('pages.topup.btn_ton_topup')}
          </Button>
          <EthTopupButton fee={fee} />
          {tonAddress != '' && (
            <React.Fragment>
              <div> env: {import.meta.env.MODE} </div>
              <div> user rawTonAddress: {rawTonAddress} </div>
              <div>
                {' '}
                user friendAddress:{' '}
                {toUserFriendlyAddress(
                  rawTonAddress,
                  import.meta.env.MODE === 'development',
                )}{' '}
              </div>
              <div>
                {' '}
                topay rawTonAddress: {
                  import.meta.env.VITE_OFFICE_TON_WALLET_ID
                }{' '}
              </div>
              <div>
                {' '}
                topay friendAddress:{' '}
                {toUserFriendlyAddress(
                  import.meta.env.VITE_OFFICE_TON_WALLET_ID,
                  import.meta.env.MODE === 'development',
                )}{' '}
              </div>
            </React.Fragment>
          )}
          {tonTxReceipt != null && (
            <React.Fragment>
              <div>Transaction amount: {tonPayAmount} tonWei</div>
              <div>Transaction receipt:{stringify(tonTxReceipt, null, 2)}</div>
              <div>
                <a
                  href={`https://testnet.tonviewer.com/${toUserFriendlyAddress(
                    import.meta.env.VITE_OFFICE_TON_WALLET_ID,
                    import.meta.env.MODE === 'development',
                  )}`}>
                  Transaction View
                </a>
              </div>
            </React.Fragment>
          )}

          {tonAddress != '' && (
            <React.Fragment>
              <div>env: {import.meta.env.MODE} </div>
              <div>user address: {evmWalletAddress}</div>
              <div>
                topay address: {import.meta.env.VITE_OFFICE_EVM_WALLET_ID}{' '}
              </div>
            </React.Fragment>
          )}

          {evmWaitTxReceipt != null && (
            <React.Fragment>
              <div>Transaction amount: {evmPayAmount} tonWei</div>
              <div>Transaction Hash: {evmWaitTxReceipt?.hash}</div>
              <div>
                Transaction receipt: {stringify(evmWaitTxReceipt, null, 2)}
              </div>
              {String(selectedEvmNetworkId) === '11155111' && (
                <div>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${evmWaitTxReceipt?.hash}`}>
                    sepolia Etherscan
                  </a>
                </div>
              )}
              {String(selectedEvmNetworkId) === '1' && (
                <div>
                  <a href={`https://etherscan.io/tx/${evmWaitTxReceipt?.hash}`}>
                    main Etherscan
                  </a>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    </LayoutThird>
  );
}

export async function getTonValueForUSD(): Promise<any> {
  const response = await axios.get(
    'https://tonapi.io/v2/rates?tokens=ton&currencies=ton%2Cusd%2Crub',
  );
  const prices = response.data.rates.TON.prices;
  return prices.USD;
}
