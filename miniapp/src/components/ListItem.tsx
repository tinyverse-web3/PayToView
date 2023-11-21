import {
  Image,
  IconButton,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { ListItemProps } from '@/store';
import { IpfsImage } from './IpfsImage';
import { QRCodeCanvas } from 'qrcode.react';
import bot from '@/lib/bot';
interface Props {
  onClick?: () => void;
  item?: ListItemProps;
  isForward?: boolean;
}
export const ListItem = ({ item, onClick, isForward = true }: Props) => {
  console.log(item);
  const nav = useNavigate();
  const webApp = useWebApp();
  const [isOpen, setIsOpen] = useState(false);
  const toEdit = () => {
    nav(ROUTE_PATH.DETAIL_EDIT);
  };
  const shareHandler = () => {
    console.log('share');
    if (window.JsBridge) {
      setIsOpen(true);
    } else {
      if (item?.ContractId) {
        bot.forward(item?.ContractId);
      }
      // webApp?.sendData(
      //   JSON.stringify(
      //     item?.ContentType === 'image'
      //       ? {
      //           type: item.ContentType,
      //           title: item.Name,
      //           image: item.Ipfs,
      //         }
      //       : {
      //           type: item?.ContentType,
      //           title: item?.Name,
      //         },
      //   ),
      // );
    }
  };
  const qrCodeurl = useMemo(() => {
    return `type=url&value=${location.origin}/#/detail/read?contract=${item?.ContractName}`;
  }, [item?.ContractName]);
  return (
    <div className='rounded-lg bg-gray-50 overflow-hidden  h-48 relative'>
      <div
        className='w-full h-full flex justify-center items-center'
        onClick={onClick}>
        {item?.ContentType === 'image' ? (
          <IpfsImage cid={item.Cid} />
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
      {isForward && (
        <div className='absolute bottom-2 right-2 z-10 shadow-md rounded-full'>
          <IconButton
            isRound={true}
            variant='solid'
            size={'sm'}
            onClick={shareHandler}
            aria-label='Done'
            icon={
              <Icon
                icon='ph:share-fat-bold'
                className='text-xl text-blue-500'
              />
            }
          />
        </div>
      )}
      <Modal isOpen={isOpen} size='full' onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader className='text-center'>分享二维码</ModalHeader>
          <ModalCloseButton />
          <ModalBody className='flex justify-center items-center'>
            <div>
              <QRCodeCanvas value={qrCodeurl} size={200} />
              <div className='mt-2 text-center'>下载二维码分享</div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};
