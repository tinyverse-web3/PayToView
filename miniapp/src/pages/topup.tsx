import {
  SimpleGrid,
  IconButton,
  Tabs,
  TabList,
  Tab,
  ButtonGroup,
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
import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import ReactJson from 'react-json-view';
import { useTonAddress } from '@tonconnect/ui-react';
import { CHAIN, toUserFriendlyAddress } from '@tonconnect/ui';
import { BOC as BOC1, Builder } from 'ton3-core'
import { Address } from "ton3-core";
import { beginCell } from '@ton/core'


export default function Index() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const nav = useNavigate();

  const tonAddress = useTonAddress();
  const rawTonAddress = useTonAddress(false);

  const myAddress = 'UQB-Hz6V1mK_fN_8O5MDedrmqvhP-vLsIRFUi77HnI85O8ei'
  const commitText = 'tvswallet=080112209e622d535ff6364ec8a7bf2b94624c377560f0d5fb7ebb4bfcb3eb023555a1b4&app=payToView'
  const payload = beginCell().storeUint(0, 32).storeStringTail(commitText).endCell().toBoc().toString('base64');
  const defaultTx = {
    validUntil: Math.floor(Date.now() / 1000) + 600, // unix epoch seconds
    messages: [
      {
        address: myAddress,
        amount: '20000000',
        payload: payload
      }
    ],
  };
  const [tx, setTx] = useState(defaultTx);
  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();

  const onChange = useCallback((value: object) => setTx((value as { updated_src: typeof defaultTx }).updated_src), []);

  return (
    <LayoutThird title='充值'>
      <div className='h-full overflow-hidden'>

        <div className="send-tx-form">
          <div className='p-4'>
            <div className='bg-gray-100 p-2 rounded-xl'>
              <TonConnectButton />
              <h3>Configure and send transaction</h3>
              <ReactJson src={defaultTx} theme="ocean" onEdit={onChange} onAdd={onChange} onDelete={onChange} />
              {wallet ? (
                <button onClick={() => {
                  tonConnectUi.sendTransaction(tx).then((result) => {
                    console.log('topup.tsx sendTransaction result: ', result.boc);
                  }).catch((error) => {
                    console.error('topup.tsx sendTransaction error: ', error);
                  })

                }
                }>
                  Send transaction
                </button>
              ) : (
                <button onClick={() => tonConnectUi.connectWallet()}>Connect wallet to send the transaction</button>
              )}
            </div>
          </div>
        </div>

      </div>
    </LayoutThird >
  );
}
