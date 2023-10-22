import { Button, Image, Card, CardBody, HStack } from '@chakra-ui/react';
import { useTitle } from 'react-use';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useDetailStore, useListStore } from '@/store';
import { useTranslation } from 'react-i18next';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { PhotoProvider, PhotoView } from 'react-photo-view';

export default function DetailRead() {
  useTitle('PayToView');

  const nav = useNavigate();
  const { t } = useTranslation();
  const { readStatus, setReadStatus } = useDetailStore((state) => state);
  const { setPaiedList, setForwardList } = useListStore((state) => state);
  const type = 'image';
  const webApp = useWebApp();
  const toIndex = () => {
    nav(ROUTE_PATH.INDEX, { replace: true });
  };
  const toPay = () => {
    setReadStatus(true);
    setPaiedList([
      {
        type: 'image',
        title: 'PayToView First Image',
        image:
          'https://tinyverse.space/static/media/secure-storage.80ea715b795dd9da0758.png',
      },
    ]);
    webApp?.close();
  };
  const shareHandler = () => {
    console.log('share');
    setForwardList([
      {
        type: 'image',
        title: 'PayToView First Image',
        image:
          'https://tinyverse.space/static/media/secure-storage.80ea715b795dd9da0758.png',
      },
    ]);
    webApp?.sendData(
      JSON.stringify({
        type: 'image',
        title: 'PayToView First Image',
        image: 'https://test.tinyverse.space/paytoview_blur.png',
      }),
    );
  };
  const imageSrc = readStatus
    ? 'https://tinyverse.space/static/media/secure-storage.80ea715b795dd9da0758.png'
    : 'https://test.tinyverse.space/paytoview_blur.png';
  return (
    <div className='min-h-ful p-4'>
      <BackButton onClick={toIndex} />
      <div className='mb-4'>
        {type === 'image' ? (
          <PhotoProvider>
            <div className='flex justify-center items-center'>
              <div className='w-48 h-48'>
                <PhotoView src={imageSrc}>
                  <Image src={imageSrc} height='100%' fit='cover' />
                </PhotoView>
              </div>
            </div>
          </PhotoProvider>
        ) : (
          <div>
            <Card>
              <CardBody>
                <h1 className='text-md font-bold mb-2'>Title</h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Libero placeat, quos iusto accusamus ex et at doloribus ut
                  quisquam iste? Similique cum culpa quod aperiam delectus porro
                  enim rem accusamus.
                </p>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
      <div className='mb-4'>
        <div className='font-bold mb-2'>{t('pages.detail.contract_name')}</div>
        <div className='text-sm'>PayToView</div>
      </div>
      <HStack spacing='20px'>
        {!readStatus && (
          <Button
            colorScheme='messenger'
            size='lg'
            className='flex-1'
            onClick={toPay}>
            {readStatus ? t('pages.detail.paied') : t('common.pay')}
          </Button>
        )}

        <Button
          colorScheme='messenger'
          size='lg'
          className='flex-1'
          onClick={shareHandler}>
          {t('common.forward')}
        </Button>
      </HStack>
    </div>
  );
}
