import {
  Button,
  Image,
  FormControl,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

import { useTitle } from 'react-use';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-use';
import { QRCodeCanvas } from 'qrcode.react';
import paytoview from '@/lib/paytoview';
import { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';

export default function DetailEdit() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const contractName = searchParams.get('contract');
  const nav = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [data, { set }] = useMap({
    title: '',
  });
  const getContractDetail = async () => {
    if (contractName) {
      const result = await paytoview.getViewContractContent({
        ContractName: contractName,
      });

      console.log(result);
    }
  };
  const forwardHandler = async () => {
    if (contractName) {
      const result = await paytoview.forwardAPayView({
        Name: data.title,
        ContractName: contractName,
      });
      if (result.code === '000000') {
        setIsOpen(true);
      } else {
        toast.error(result.msg);
      }
    }
  };
  const qrCodeurl = useMemo(() => {
    return `type=url&value=${location.origin}/#/detail/read?contract=${contractName}`;
  }, [contractName]);
  useEffect(() => {
    if (contractName) {
      getContractDetail();
    }
  }, [contractName]);
  return (
    <div className='min-h-ful p-4'>
      <BackButton onClick={() => nav(-1)} />
      <FormControl className='mb-4'>
        <Input
          type='text'
          placeholder='Forward Title'
          variant='filled'
          value={data.title}
          onChange={(e) => set('title', e.target.value)}
        />
      </FormControl>
      <div className='mb-4'>
        <div className='flex justify-center items-center'>
          <div className='w-48 h-48'>
            <Image
              src='https://via.placeholder.com/300'
              height='100%'
              fit='cover'
            />
          </div>
        </div>
      </div>
      <div className='mb-4'>
        <div className='font-bold mb-2'>{t('pages.detail.contract_name')}</div>
        <div className='text-sm'>PayToView</div>
      </div>
      <div className=''>
        <div className='mb-4'></div>
        <Button
          colorScheme='messenger'
          size='lg'
          className='w-full'
          onClick={forwardHandler}>
          {t('common.forward')}
        </Button>
      </div>
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
}
