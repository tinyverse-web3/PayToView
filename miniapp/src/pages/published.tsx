import { SimpleGrid } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ListItem } from '@/components/ListItem';
import { Empty } from '@/components/Empty';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';
import { flattenListData } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useListStore, useAccountStore } from '@/store';
import paytoview from '@/lib/paytoview';
import LayoutThird from '@/layout/LayoutThird';

export default function Index() {
  useTitle('Forwarded');
  const { t } = useTranslation();
  const nav = useNavigate();
  const { publishedList, setPublishedList } = useListStore((state) => state);

  const { accountInfo } = useAccountStore((state) => state);

  const getList = async () => {
    const result = await paytoview.getPayToViewList();
    if (result.code === '000000') {
      const list = flattenListData(result.data).map((v) => ({
        ...v,
        // Ipfs: `https://156.251.179.141/ipfs/QmcvhAUPrxMVywhgTS1cumfqLgeaMt34fJzgmPCKHMjYDA`,
        Ipfs: `${import.meta.env.VITE_IPFS_GATEWAY_URL}/cat?cid=${
          v.CidForpreview
        }`,
      }));
      console.log('published.tsx->getList, list:', list);
      setPublishedList(list);
    } else {
      setPublishedList([]);
    }
  };
  const toDetail = (item) => {
    console.log(item);
    nav(ROUTE_PATH.DETAIL + '/?contract=' + item.ContractID);
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <LayoutThird title={t('pages.published.title')} path={ROUTE_PATH.INDEX}>
      <div className='h-full overflow-y-auto'>
        <div className='p-4'>
          {publishedList.length === 0 && <Empty />}
          <SimpleGrid columns={2} spacingX='10px' spacingY='10px'>
            {publishedList.map((v, i) => (
              <ListItem item={v} key={i} onClick={() => toDetail(v)} />
            ))}
          </SimpleGrid>
        </div>
      </div>
    </LayoutThird>
  );
}
