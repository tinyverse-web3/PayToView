import { SimpleGrid, IconButton, Tabs, TabList, Tab } from '@chakra-ui/react';
import { useState } from 'react';
import { IndexItem } from '@/components/IndexItem';
import { Empty } from '@/components/Empty';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';

import { useListStore } from '@/store/list';

export default function Index() {
  useTitle('PayToView');
  const [tabIndex, setTabIndex] = useState(0);
  const nav = useNavigate();
  const { list } = useListStore((state) => state);

  const toAdd = () => {
    nav(ROUTE_PATH.DETAIL_ADD);
  };

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
              <Tab>上传的</Tab>
              <Tab>付费的</Tab>
            </TabList>
          </Tabs>
        </div>
        <div className='p-4'>
          {list.length === 0 && <Empty />}
          <SimpleGrid columns={2} spacingX='10px' spacingY='10px'>
            {list.map((v, i) => (
              <IndexItem item={v} key={i} />
            ))}
          </SimpleGrid>
        </div>
      </div>
      <div className='absolute bottom-4 right-4'>
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
