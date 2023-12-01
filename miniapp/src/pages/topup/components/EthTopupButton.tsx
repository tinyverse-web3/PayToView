import { Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
  useConnect as useEvmConnect,
  useDisconnect as useEvmDisconnect,
  useAccount as useEvmAccount,
} from 'wagmi';
import axios from 'axios';
import { useWeb3ModalState } from '@web3modal/wagmi/react';
import { parseEther, Hex, stringify } from 'viem';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { toast } from 'react-hot-toast';
import { useAccountStore } from '@/store';
interface Props {
  fee: number;
}
export async function getEthValueForUSD(): Promise<any> {
  const response = await axios.get(
    'https://api.coinbase.com/v2/prices/ETH-USD/spot',
  );
  const data = response.data.data;
  return data.amount;
}

export const EthTopupButton = ({ fee }: Props) => {
  const { t } = useTranslation();

  const { accountInfo } = useAccountStore((state) => state);
  const { open: OpenEvmWallet } = useWeb3Modal();
  const [usdRatio, setUsdRatio] = useState(100);
  const { disconnect: evmDisconnect } = useEvmDisconnect();
  const {
    address: evmWalletAddress,
    isConnecting: isEvmWalletConnecting,
    isDisconnected: isEvmWalletDisconnected,
  } = useEvmAccount();

  const commentText = useMemo(
    () => 'tvswallet=' + accountInfo.address + '&app=payToView',
    [accountInfo.address],
  );
  const topupHandler = () => {
    console.log(isEvmWalletDisconnected);
    if (!isEvmWalletDisconnected) {
      ethTranscationHandler();
    } else {
      OpenEvmWallet();
    }
  };
  console.log(fee);
  console.log(usdRatio);
  const amount = useMemo(() => (fee * (1 / 1000) * (1 / usdRatio)).toFixed(8), [fee, usdRatio]);
  console.log(amount);
  const evmTxData = useMemo(
    () =>
      `0x${BigInt('0x' + Buffer.from(commentText).toString('hex')).toString(
        16,
      )}` as Hex,
    [commentText],
  );
  const { config } = usePrepareSendTransaction({
    to: import.meta.env.VITE_OFFICE_EVM_WALLET_ID,
    value: parseEther(amount),
    data: evmTxData,
    enabled: Boolean(
      import.meta.env.VITE_OFFICE_EVM_WALLET_ID && amount != '',
    ),
  });
  const getUsdRatio = async () => {
    const usd = await getEthValueForUSD();
    console.log(usd);
    setUsdRatio(usd);
  };
  useEffect(() => {
    getUsdRatio();
  }, []);
  const {
    data: evmSendTxData,
    error,
    isLoading: isEvmSendTxLoading,
    isError: isEvmSendTxError,
    sendTransaction,
  } = useSendTransaction(config);
  const {
    data: evmWaitTxData,
    isLoading: isEvmWaitTxPending,
    isSuccess: isEvmWaitTxSuccess,
  } = useWaitForTransaction({
    hash: evmSendTxData?.hash,
    // onError: () => void evmDisconnect(),
    // onSuccess: () => void evmDisconnect(),
  });
  const ethTranscationHandler = async () => {
    console.log(config)
    await sendTransaction?.();
    await evmDisconnect();
  };

  return (
    <Button
      className='w-full'
      isDisabled={fee <= 0}
      colorScheme='blue'
      onClick={topupHandler}>
      {t('pages.topup.btn_eth_topup')}
    </Button>
  );
};
