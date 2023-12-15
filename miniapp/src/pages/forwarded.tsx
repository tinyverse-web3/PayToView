import { SimpleGrid, IconButton, Tabs, TabList, Tab, ButtonGroup } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ListItem } from '@/components/ListItem';
import { Empty } from '@/components/Empty';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
import { useListStore } from '@/store';
import paytoview from '@/lib/paytoview';
import { flattenListData } from '@/lib/utils';
import { useAccountStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';

export default function Index() {
  useTitle('Forwarded');
  const { t } = useTranslation();
  const nav = useNavigate();
  
  const { forwardList, setForwardList } = useListStore((state) => state);
  const { accountInfo } = useAccountStore((state) => state);
  const getList = async () => {
    const result = await paytoview.getMyForwardPayToViewContractList();
    console.log(result);
    if (result.code === '000000') {
      const list = flattenListData(result.data).map((v) => ({
        ...v,
        Ipfs: `${import.meta.env.VITE_IPFS_GATEWAY_URL}/cat?pubkey=${accountInfo.publicKey}&cid=${v.Cid}`,
      }));
      console.log(list);
      setForwardList(list);
    } else {
      setForwardList([]);
    }
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <LayoutThird title={t('pages.forwarded.title')} path={ROUTE_PATH.INDEX}>
      <div className='h-full'>
        <div className='h-full overflow-y-auto'>
          <div className='p-4'>
            {forwardList.length === 0 && <Empty />}
            <SimpleGrid columns={2} spacingX='10px' spacingY='10px'>
              {forwardList.map((v, i) => (
                <ListItem item={v} key={i} />
              ))}
            </SimpleGrid>
          </div>
        </div>
      </div>
    </LayoutThird>
  );
}
