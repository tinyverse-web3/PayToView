import { SimpleGrid, IconButton } from '@chakra-ui/react';
import { IndexItem } from '@/components/IndexItem';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';

import { useListStore } from '@/store/list';

export default function Index() {
  useTitle('PayToView');
  const nav = useNavigate();
  const { list } = useListStore((state) => state);
  
  const toAdd = () => {
    nav(ROUTE_PATH.DETAIL_ADD);
  };

  return (
    <div className='h-full p-4'>
      <div className='h-full overflow-y-auto'>
        <SimpleGrid columns={2} spacingX='10px' spacingY='10px'>
          {list.map((v, i) => (
            <IndexItem item={v} key={i}/>
          ))}
        </SimpleGrid>
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
