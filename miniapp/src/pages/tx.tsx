import {
  SimpleGrid,
  IconButton,
  Tabs,
  TabList,
  Tab,
  ButtonGroup,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { TxItem } from '@/components/TxItem';
import { Empty } from '@/components/Empty';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
import { useListStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import paytoview from '@/lib/paytoview';
import { VStack } from '@chakra-ui/react';

export default function Tx() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const { txList, setTxList } = useListStore((state) => state);
  const getTXDetails = async () => {
    const result = await paytoview.getTXDetails();
    if (result.code === '000000' && result.data?.length) {
      setTxList(result.data);
    } else {
      setTxList([]);
    }
  };
  console.log(txList);
  useEffect(() => {
    getTXDetails();
  }, []);
  return (
    <LayoutThird title={t('pages.tx_list.title')} path={ROUTE_PATH.INDEX}>
      <div className='p-4'>
        {txList.length === 0 && <Empty />}
        <VStack spacing='10px'>
          {txList.map((item, i) => (
            <TxItem item={item} key={i} />
          ))}
        </VStack>
      </div>
    </LayoutThird>
  );
}
