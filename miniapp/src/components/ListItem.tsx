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
    console.log(item);
    if (window.JsBridge) {
      setIsOpen(true);
    } else {
      if (item?.ContractID) {
        bot.forward(item?.ContractID);
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
  const type = useMemo(() => {
    if (!item?.ContentType) {
      return '';
    }
    return item?.ContentType?.indexOf('image') > -1 ? 'image' : 'text';
  }, [item?.ContentType]);
  const qrCodeurl = useMemo(() => {
    return `type=url&value=${location.origin}/#/detail/read?contract=${item?.ContractName}`;
  }, [item?.ContractName]);
  return (
    <div className='rounded-lg bg-gray-50 overflow-hidden  h-48 relative'>
      <div
        className='w-full h-full flex justify-center items-center'
        onClick={onClick}>
        {type === 'image' && item ? (
          <IpfsImage cid={item.CidForpreview} />
        ) : (
          <div className='p-4  h-full'>
            <div className='break-all flex justify-center items-center overflow-y-auto h-full '>
              {item?.Description}...
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
                className='text-xl text-[#1296db]'
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
