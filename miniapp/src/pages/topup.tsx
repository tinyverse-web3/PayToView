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
import { BOC, Builder } from 'ton3-core'
import { Address } from "ton3-core";


export default function Index() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const nav = useNavigate();

  const tonAddress = useTonAddress();
  const rawTonAddress = useTonAddress(false);

  const defaultTx = {
    validUntil: Math.floor(Date.now() / 1000) + 600, // unix epoch seconds
    messages: [
      {
        address: '0QDHpqs5ayRdE3v0HMh0Ymi5VXIguacE7DRF_EHjxZOTHWl6',
        amount: '20000000',
      }
    ],
  };
  const [tx, setTx] = useState(defaultTx);
  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();

  const onChange = useCallback((value: object) => setTx((value as { updated_src: typeof defaultTx }).updated_src), []);

  console.log(tonAddress)
  console.log(rawTonAddress)

  const address = new Address('0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F')
  console.log(address.bounceable)
  console.log(address.testOnly)
  console.log(address.toString())
  console.log(address.workchain)


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
                  console.log('tonAddress', tonAddress);
                  console.log('rawTonAddress:', rawTonAddress)
                  tonConnectUi.sendTransaction(tx)
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
