import { Button, Image, Card, CardBody } from '@chakra-ui/react';
import { useTitle } from 'react-use';
import { PayLimit } from './components/PayLimit';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function DetailEdit() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const nav = useNavigate();
  const type = 'image';
  return (
    <div className='min-h-ful p-4'>
      {/* <div>edit.tsx</div> */}
      <div className='mb-4'>
        {type !== 'image' ? (
          <div className='flex justify-center items-center'>
            <div className='w-48 h-48'>
              <Image
                src='https://via.placeholder.com/300'
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
        <div className='font-bold mb-2'>{t('pages.publish.contract_name')}</div>
        <div className='text-sm'>PayToView</div>
      </div>
      <div className=''>
        <div className='mb-4'>
          <PayLimit type={type} />
        </div>
        <Button colorScheme='messenger' size='lg' className='w-full'>
          {t('common.change')}
        </Button>
      </div>
    </div>
  );
}
