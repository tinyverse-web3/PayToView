import {
  SimpleGrid,
} from '@chakra-ui/react';
import { useTitle } from 'react-use';
import { ROUTE_PATH } from '@/router';
import LayoutThird from '@/layout/LayoutThird';

import * as React from 'react'
import { useDebounce } from 'use-debounce'

import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from 'wagmi'
import { useWeb3ModalState } from '@web3modal/wagmi/react'
import { parseEther, Hex, stringify } from 'viem'


export default function Index() {
  useTitle('PayToView');

  const [toWalletAddress, setTo] = React.useState('')
  const [debouncedToWalletAddress] = useDebounce(toWalletAddress, 500)

  const [payAmount, setAmount] = React.useState('')
  const [debouncedPayAmount] = useDebounce(payAmount, 500)

  const { selectedNetworkId } = useWeb3ModalState()

  var comment = "tvswallet=080112209e622d535ff6364ec8a7bf2b94624c377560f0d5fb7ebb4bfcb3eb023555a1b4&app=payToView";
  const txDataHex = `0x${BigInt("0x" + Buffer.from(comment).toString("hex")).toString(16)}` as Hex

  const { config } = usePrepareSendTransaction({
    to: debouncedToWalletAddress,
    value: debouncedPayAmount ? parseEther(debouncedPayAmount) : undefined,
    data: txDataHex,
    enabled: Boolean(debouncedToWalletAddress && debouncedPayAmount),
  })
  const { data, error, isLoading, isError, sendTransaction } =
    useSendTransaction(config)
  const { data: receipt, isLoading: isPending, isSuccess } =
    useWaitForTransaction({ hash: data?.hash })

  return (
    <LayoutThird title='充值' path={ROUTE_PATH.INDEX}>
      <div className='h-full overflow-hidden p-4'>
        <SimpleGrid columns={2} spacing='10px' className='mb-4'>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendTransaction?.()
            }}
          >
            <input
              aria-label="Recipient"
              onChange={(e) => setTo(e.target.value)}
              placeholder="0xA0Cf…251e"
              value={toWalletAddress}
            />
            <input
              aria-label="Amount (ether)"
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.05"
              value={payAmount}
            />

            <button disabled={!sendTransaction} type="submit">
              Send
            </button>
            {isLoading && <div>Check wallet...</div>}
            {isPending && <div>Transaction pending...</div>}
            {isSuccess && (
              <div>
                Successfully sent {payAmount} ether to {toWalletAddress}
                <div>Transaction Hash: {data?.hash}</div>
                <div>
                  Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
                  {String(selectedNetworkId) === "11155111" && (
                    <div>
                      <a href={`https://sepolia.etherscan.io/tx/${data?.hash}`}>sepolia Etherscan</a>
                    </div>
                  )}
                  {String(selectedNetworkId) === "1" && (
                    <div>
                      <a href={`https://etherscan.io/tx/${data?.hash}`}>main Etherscan</a>
                    </div>
                  )}
                </div>
              </div>
            )}
            {isError && <div>Error: {error?.message}</div>}
          </form>
        </SimpleGrid>
      </div>
    </LayoutThird>
  );
}
