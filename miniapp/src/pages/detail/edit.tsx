import { Button, Image, Card, CardBody } from '@chakra-ui/react';
import { useTitle } from 'react-use';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { PayLimit } from './components/PayLimit';
import { useNavigate } from 'react-router-dom';

export default function DetailEdit() {
  useTitle('PayToView');
  const nav = useNavigate();
  const type = 'image';
  return (
    <div className='min-h-ful p-4'>
      <BackButton onClick={() => nav(-1)} />
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
        <div className='font-bold mb-2'>合约名称</div>
        <div className='text-sm'>123</div>
      </div>
      <div className=''>
        <div className='mb-4'>
          <PayLimit type={type} />
        </div>
        <Button colorScheme='messenger' size='lg' className='w-full'>
          修改
        </Button>
      </div>
    </div>
  );
}
