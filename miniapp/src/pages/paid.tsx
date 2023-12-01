import {
  SimpleGrid,
  IconButton,
  Tabs,
  TabList,
  Tab,
  ButtonGroup,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ListItem } from '@/components/ListItem';
import { Empty } from '@/components/Empty';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { flattenListData } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useListStore } from '@/store';
import paytoview from '@/lib/paytoview';
import { ROUTE_PATH } from '@/router';
import LayoutThird from '@/layout/LayoutThird';

export default function Index() {
  useTitle('Forwarded');
  const { t } = useTranslation();
  const nav = useNavigate();
  const { paidList, setPaidList } = useListStore((state) => state);

  const getList = async () => {
    const result = await paytoview.getPaidList();
    if (result.code === '000000') {
      const list = flattenListData(result.data).map((v) => ({
        ...v,
      }));
      console.log(list);
      setPaidList(list);
    } else {
      setPaidList([]);
    }
  };
  const toDetail = (item) => {
    nav(ROUTE_PATH.DETAIL_VIEW + '/?contract=' + item.ContractID);
  };
  useEffect(() => {
    getList();
  }, []);
  return (
    <LayoutThird title={t('pages.paid.title')} path={ROUTE_PATH.INDEX}>
      <div className='h-full'>
        {/* <div>paid.tsx</div> */}
        <BackButton onClick={() => nav(-1)} />
        <div className='h-full overflow-y-auto'>
          <div className='p-4'>
            {paidList.length === 0 && <Empty />}
            <SimpleGrid columns={2} spacingX='10px' spacingY='10px'>
              {paidList.map((v, i) => (
                <ListItem item={v} key={i} onClick={() => toDetail(v)} />
              ))}
            </SimpleGrid>
          </div>
        </div>
      </div>
    </LayoutThird>
  );
}
