import { Button, Image, Card, CardBody, HStack } from '@chakra-ui/react';
import { useEffect, useState, useMemo } from 'react';
import { useTitle } from 'react-use';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTE_PATH } from '@/router';
import { useDetailStore, useListStore } from '@/store';
import paytoview from '@/lib/paytoview';
import { useTranslation } from 'react-i18next';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { template } from 'lodash';
import LayoutThird from '@/layout/LayoutThird';

export default function DetailIndex() {
  useTitle('PayToView');
  const [searchParams] = useSearchParams();
  const ContractID = searchParams.get('contract');
  const nav = useNavigate();
  const { t } = useTranslation();
  const [paid, setPaid] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const toIndex = () => {
    nav(ROUTE_PATH.INDEX, { replace: true });
  };
  const toPay = async () => {
    if (!ContractID) return;
    const result = await paytoview.payToView({
      ContractID: ContractID,
    });
    if (result.code === '000000') {
      setPaid(true);
    }
  };
  const getData = async () => {
    if (!ContractID) return;
    const result = await paytoview.getViewPassword({ ContractID: ContractID });
    console.log(result);
  };
  const getContractDetail = async () => {
    if (!ContractID) return;
    const result = await paytoview.getViewContractContent({
      ContractID: ContractID,
    });
    if (result.code === '000000') {
      setDetail(result.data);
      setPaid(result.data.isPaid);
    }
  };
  const toView = () => {
    nav(ROUTE_PATH.DETAIL_VIEW + '/?contract=' + ContractID);
  };
  const readStatus = useMemo(() => detail.isPaid, [detail.isPaid]);

  // const src = useIpfsSrc(detail.contractInfo?.ContractInfo?.Content?.Cid);
  const previewSrc = useMemo(
    () =>
      template(import.meta.env.VITE_IPFS_GATEWAY_URL)({
        cid: detail.contractInfo?.ContractInfo?.Content?.CidForpreview,
      }),
    [detail.contractInfo?.ContractInfo?.Content?.CidForpreview],
  );
  console.log('previewSrc:', previewSrc);
  // var contentSrc = previewSrc;

  useEffect(() => {
    if (ContractID) {
      getContractDetail();
    }
  }, [ContractID]);
  useEffect(() => {
    if (ContractID && paid) {
      getData();
    }
  }, [ContractID, paid]);
  return (
    <LayoutThird title={t('pages.detail.title')}>
      <div className='min-h-ful p-4'>
        {/* <div>read.tsx</div> */}
        <BackButton onClick={toIndex} />
        <div className='mb-4'>
          <PhotoProvider>
            <div className='flex justify-center items-center'>
              <div className='w-48 h-48'>
                <PhotoView src={previewSrc}>
                  <Image src={previewSrc} height='100%' fit='cover' />
                </PhotoView>
              </div>
            </div>
          </PhotoProvider>
        </div>
        <div>
          <div className='mb-2 flex'>
            <div className='font-bold mb-2'>Title</div>
            <div className='text-sm'>
              {detail.contractInfo?.ContractInfo?.Name}
            </div>
          </div>
          <div className='mb-2 flex'>
            <div className='font-bold mb-2'>Fee</div>
            <div className='text-sm'>
              {detail.contractInfo?.ContractInfo?.Fee}
            </div>
          </div>
        </div>

        {!paid ? (
          <Button
            colorScheme='messenger'
            size='lg'
            className='w-full'
            onClick={toPay}>
            {readStatus ? t('pages.publish.paied') : t('common.pay')}
          </Button>
        ) : (
          <Button
            colorScheme='messenger'
            size='lg'
            className='w-full'
            onClick={toView}>
            View
          </Button>
        )}
      </div>
    </LayoutThird>
  );
}
