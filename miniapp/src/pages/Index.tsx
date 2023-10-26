import { SimpleGrid, IconButton, Tabs, TabList, Tab } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { IndexItem } from '@/components/IndexItem';
import { Empty } from '@/components/Empty';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
import { useListStore, useTvsStore } from '@/store';

export default function Index() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const nav = useNavigate();
  const { list, paiedList, forwardList } = useListStore((state) => state);
  const { tvs } = useTvsStore((state) => state);

  const toAdd = () => {
    nav(ROUTE_PATH.DETAIL_ADD);
  };
  const clear = () => {
    localStorage.clear();
    location.reload();
  };
  const getList = async () => {
    const result = await tvs.getPayToViewList();
    console.log(result);
  };
  const dataList = useMemo(() => {
    if (tabIndex === 0) {
      return list;
    }
    if (tabIndex === 1) {
      return paiedList;
    }
    if (tabIndex === 2) {
      return forwardList;
    }
    return [];
  }, [tabIndex, list, paiedList, forwardList]);

  useEffect(() => {
    getList();
  }, []);
  return (
    <div className='h-full overflow-hidden'>
      <div className='h-full overflow-y-auto'>
        <div className=' sticky top-0 z-20 bg-white py-2'>
          <Tabs
            variant='soft-rounded'
            align='center'
            onChange={(index) => setTabIndex(index)}
            colorScheme='green'>
            <TabList className='px-2'>
              <Tab>{t('pages.index.tab_1')}</Tab>
              <Tab>{t('pages.index.tab_2')}</Tab>
              <Tab>{t('pages.index.tab_3')}</Tab>
            </TabList>
          </Tabs>
        </div>
        <div className='p-4'>
          {dataList.length === 0 && <Empty />}
          <SimpleGrid columns={2} spacingX='10px' spacingY='10px'>
            {dataList.map((v, i) => (
              <IndexItem item={v} key={i} />
            ))}
          </SimpleGrid>
        </div>
      </div>
      <div
        className='absolute top-2 left-2 z-50 w-10 h-10'
        onClick={clear}></div>
      <div className='absolute top-2 right-2 z-50'>
        <IconButton
          isRound={true}
          variant='solid'
          colorScheme='teal'
          aria-label='Done'
          onClick={toAdd}
          icon={<Icon icon='material-symbols:add' className='text-3xl' />}
        />
      </div>
    </div>
  );
}
