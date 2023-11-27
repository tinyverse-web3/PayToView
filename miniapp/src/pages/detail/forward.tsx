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

import { ROUTE_PATH } from '@/router';
import { useTitle } from 'react-use';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-use';
import { QRCodeCanvas } from 'qrcode.react';
import paytoview from '@/lib/paytoview';
import { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import LayoutThird from '@/layout/LayoutThird';
import bot from '@/lib/bot';
import { template } from 'lodash';

export default function DetailEdit() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const ContractID = searchParams.get('contract');
  const nav = useNavigate();
  const [paid, setPaid] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [data, { set }] = useMap({
    title: '',
  });
  const getContractDetail = async () => {
    if (ContractID) {
      const result = await paytoview.getViewContractContent({
        ContractID: ContractID,
      });
      if (result.code === '000000') {
        setDetail(result.data);
        setPaid(result.data.isPaid);
      }
      console.log('getContractDetail: result:', result);
    }
  };
  const forwardHandler = async () => {
    if (ContractID) {
      setLoading(true);
      const result = await paytoview.forwardAPayView({
        Name: data.title,
        ContractID: ContractID,
      });
      if (result.code === '000000') {
        bot.forward(ContractID);
      } else {
        toast.error(result.msg);
      }
      setLoading(false);
    }
  };
  const qrCodeurl = useMemo(() => {
    return `type=url&value=${location.origin}/#/detail/read?contract=${ContractID}`;
  }, [ContractID]);
  const previewSrc = useMemo(
    () =>
      template(import.meta.env.VITE_IPFS_GATEWAY_URL)({
        cid: detail.contractInfo?.ContractInfo?.Content?.CidForpreview,
      }),
    [detail.contractInfo?.ContractInfo?.Content?.CidForpreview],
  );
  useEffect(() => {
    if (ContractID) {
      getContractDetail();
    }
  }, [ContractID]);
  return (
    <LayoutThird title={t('pages.forward.title')}>
      <div className='min-h-ful p-4'>
        {/* <div>forward.tsx</div> */}
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
              <Image src={previewSrc} height='100%' fit='cover' />
            </div>
          </div>
        </div>
        <div>
          <div className='mb-2 flex items-center'>
            <div className='font-bold mb-2 w-28'>Title</div>
            <div className='text-sm flex-1'>
              {detail.contractInfo?.ContractInfo?.Name}
            </div>
          </div>
          <div className='mb-2 flex items-center'>
            <div className='font-bold mb-2 w-28'>Creater</div>
            <div className='text-sm flex-1 break-all'>{detail.walletKey}</div>
          </div>
          <div className='mb-2 flex items-center'>
            <div className='font-bold mb-2 w-28'>Fee</div>
            <div className='text-sm flex-1'>
              {detail.contractInfo?.ContractInfo?.Fee}
            </div>
          </div>
          <div className='mb-2 flex items-center'>
            <div className='font-bold mb-2 w-28'>分成比例</div>
            <div className='text-sm flex-1'>
              {detail.contractInfo?.ContractInfo?.Ratio?.PublisherPercent}
            </div>
          </div>
        </div>
        <div className=''>
          <div className='mb-4'></div>
          <Button
            colorScheme='messenger'
            size='lg'
            isLoading={loading}
            className='w-full'
            onClick={forwardHandler}>
            {t('common.forward')}
          </Button>
        </div>
        <Modal
          isOpen={isOpen}
          size='full'
          onClose={() => {
            setIsOpen(false);
            nav(ROUTE_PATH.FORWARDED);
          }}>
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
    </LayoutThird>
  );
}
