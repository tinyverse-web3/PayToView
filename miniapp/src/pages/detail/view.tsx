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

export default function DetailView() {
  useTitle('PayToView');
  const [searchParams] = useSearchParams();
  const ContractID = searchParams.get('contract');
  const nav = useNavigate();
  const { t } = useTranslation();
  const [paid, setPaid] = useState(false);
  const [detail, setDetail] = useState<any>({});
  const [contentSrc, setContentSrc] = useState<any>({});
  const webApp = useWebApp();
  const toIndex = () => {
    nav(ROUTE_PATH.INDEX, { replace: true });
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
    // if (result.data.isPaid) {
    //   setContentSrc(
    //     'https://156.251.179.141/ipfs/QmZpv4DQxQQjUruTTqX7rx9qKiQbztcn31qtmoQYeH6yYQ',
    //   );
    // } else {
    //   setContentSrc(
    //     'https://156.251.179.141/ipfs/QmcvhAUPrxMVywhgTS1cumfqLgeaMt34fJzgmPCKHMjYDA',
    //   );
    // }
  };
  const toForward = () => {
    nav(ROUTE_PATH.DETAIL_FORWARD + '/?contract=' + ContractID);
  };

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
                <PhotoView src={contentSrc}>
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
        <Button
          colorScheme='messenger'
          size='lg'
          className='w-full'
          onClick={toForward}>
          Forward
        </Button>
      </div>
    </LayoutThird>
  );
}