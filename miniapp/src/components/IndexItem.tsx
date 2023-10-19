import { Image, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';

interface IndexItemProps {
  onClick?: () => void;
  item?: any;
}
export const IndexItem = ({ item }: IndexItemProps) => {
  const nav = useNavigate();
  const webApp = useWebApp();

  const toEdit = () => {
    nav(ROUTE_PATH.DETAIL_EDIT);
  };
  const shareHandler = () => {
    console.log('share');
    webApp?.sendData(
      JSON.stringify(
        item.type === 'image'
          ? {
              type: item.type,
              image: 'https://via.placeholder.com/300',
            }
          : {
              type: item.type,
              title: item.title,
              content: item.content,
            },
      ),
    );
  };
  return (
    <div className='rounded-lg bg-gray-50 overflow-hidden  h-48 relative'>
      <div
        className='w-full h-full flex justify-center items-center'
        onClick={toEdit}>
        {item.type === 'image' ? (
          <Image
            src='https://via.placeholder.com/300'
            height='100%'
            fit='cover'
          />
        ) : (
          <div className='p-4  h-full'>
            <div className='break-all overflow-hidden h-full '>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam
              reiciendis praesentium enim quod! Impedit sequi itaque qui, autem
              nam voluptatum quaerat placeat adipisci quia. Dolorem cumque a
              accusantium atque repellat.
            </div>
          </div>
        )}
      </div>
      <div className='absolute bottom-2 right-2 z-10 shadow-md rounded-full'>
        <IconButton
          isRound={true}
          variant='solid'
          size={'sm'}
          onClick={shareHandler}
          aria-label='Done'
          icon={
            <Icon icon='ph:share-fat-bold' className='text-xl text-blue-500' />
          }
        />
      </div>
    </div>
  );
};
