import { SimpleGrid } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ListItem } from '@/components/ListItem';
import { Empty } from '@/components/Empty';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';
import { flattenListData } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useListStore, useAccountStore } from '@/store';
import paytoview from '@/lib/paytoview';

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
        Ipfs: `${import.meta.env.VITE_IPFS_GATEWAY_URL}/cat?pubkey=${accountInfo.publicKey}&cid=${v.CidForpreview}`,
      }));
      console.log('published.tsx->getList, list:', list);
      setPublishedList(list);
    }
  };
  const toDetail = (item) => {
    nav(ROUTE_PATH.DETAIL_READ + '/?contract=' + item.ContractName);
  }
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className='h-full overflow-hidden'>
      <div>published.tsx</div>
      <BackButton onClick={() => nav(-1)} />

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
    </div>
  );
}
