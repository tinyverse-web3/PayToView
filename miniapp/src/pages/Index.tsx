import { SimpleGrid, Image, IconButton } from '@chakra-ui/react';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';

export default function Index() {
  useTitle('PayToView');

  const nav = useNavigate();

  const toAdd = () => {
    nav(ROUTE_PATH.INDEX);
  };
  return (
    <div className='h-full p-4'>
      <div className='h-full overflow-y-auto'>
        <SimpleGrid columns={2} spacingX='10px' spacingY='10px'>
          <div className='rounded-lg bg-gray-50 overflow-hidden flex justify-center items-center h-48'>
            <Image
              src='https://via.placeholder.com/300'
              height='100%'
              fit='cover'
            />
          </div>
          <div className='rounded-lg bg-gray-50 overflow-hidden flex justify-center items-center  h-48'>
            <div className='break-all p-4 h-full overflow-hidden'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam
              reiciendis praesentium enim quod! Impedit sequi itaque qui, autem
              nam voluptatum quaerat placeat adipisci quia. Dolorem cumque a
              accusantium atque repellat.
            </div>
          </div>
        </SimpleGrid>
      </div>
      <div className='absolute bottom-4 right-4'>
        <IconButton
          isRound={true}
          variant='solid'
          colorScheme='teal'
          aria-label='Done'
          fontSize='20px'
          onClick={toAdd}
          icon={<Icon icon='material-symbols:add' className='text-3xl' />}
        />
      </div>
    </div>
  );
}
