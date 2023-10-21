import { Button, Image, Card, CardBody, HStack } from '@chakra-ui/react';
import { useTitle } from 'react-use';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';

export default function DetailRead() {
  useTitle('PayToView');
  const nav = useNavigate();
  const { t } = useTranslation();
  const type = 'image';
  const toIndex = () => {
    nav(ROUTE_PATH.INDEX, { replace: true });
  };
  return (
    <div className='min-h-ful p-4'>
      <BackButton onClick={toIndex} />
      <div className='mb-4'>
        {type === 'image' ? (
          <div className='flex justify-center items-center'>
            <div className='w-48 h-48'>
              <Image
                src='https://tinyverse.space/static/media/secure-storage.80ea715b795dd9da0758.png'
                height='100%'
                fit='cover'
              />
            </div>
          </div>
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
        <Button colorScheme='messenger' size='lg' className='flex-1'>
          {t('common.pay')}
        </Button>
        <Button colorScheme='messenger' size='lg' className='flex-1'>
          {t('common.forward')}
        </Button>
      </HStack>
    </div>
  );
}
