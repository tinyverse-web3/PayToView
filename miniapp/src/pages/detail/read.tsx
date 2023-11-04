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
import { IpfsImage } from '@/components/IpfsImage';
import { useIpfsSrc } from '@/lib/hooks';
import LayoutThird from '@/layout/LayoutThird';

export default function DetailRead() {
  useTitle('PayToView');
  const [searchParams] = useSearchParams();
  const contractName = searchParams.get('contract');
  const nav = useNavigate();
  const { t } = useTranslation();
  const [detail, setDetail] = useState<any>({});
  const [contentSrc, setContentSrc] = useState<any>({});
  const type = 'image';
  const webApp = useWebApp();
  const toIndex = () => {
    nav(ROUTE_PATH.INDEX, { replace: true });
  };
  const toPay = async () => {
    if (!contractName) return;
    const result = await paytoview.payToView({
      ContractName: contractName,
    });
    console.log(result);
    // setPaidList([
    //   {
    //     type: 'image',
    //     title: 'PayToView First Image',
    //     image:
    //       'https://tinyverse.space/static/media/secure-storage.80ea715b795dd9da0758.png',
    //   },
    // ]);
    webApp?.close();
    if (result.code === '000000') {
      nav(ROUTE_PATH.PAID);
    }
  };
  const getContractDetail = async () => {
    if (!contractName) return;
    const result = await paytoview.getViewContractContent({
      ContractName: contractName,
    });
    if (result.code === '000000') {
      setDetail(result.data);
    }
    if (result.data.isPaid) {
      setContentSrc('https://156.251.179.141/ipfs/QmZpv4DQxQQjUruTTqX7rx9qKiQbztcn31qtmoQYeH6yYQ')
    } else {
      setContentSrc('https://156.251.179.141/ipfs/QmcvhAUPrxMVywhgTS1cumfqLgeaMt34fJzgmPCKHMjYDA')
    }
  };
  const toForward = () => {
    nav(ROUTE_PATH.DETAIL_FORWARD + '/?contract=' + contractName);
  }
  const readStatus = useMemo(() => detail.isPaid, [detail.isPaid]);

  // const src = useIpfsSrc(detail.contractInfo?.ContractInfo?.Content?.Cid);
  var previewSrc = 'https://156.251.179.141/ipfs/QmcvhAUPrxMVywhgTS1cumfqLgeaMt34fJzgmPCKHMjYDA';
  // var contentSrc = previewSrc;
  useEffect(() => {
    if (contractName) {
      getContractDetail();
    }

  }, [contractName]);
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
        <div className='mb-4'>
          <div className='font-bold mb-2'>{t('pages.publish.contract_name')}</div>
          <div className='text-sm'>{detail.contractInfo?.ContractInfo?.Name}</div>
        </div>
        <HStack spacing='20px'>
          {!readStatus && (
            <Button
              colorScheme='messenger'
              size='lg'
              className='flex-1'
              onClick={toPay}>
              {readStatus ? t('pages.publish.paied') : t('common.pay')}
            </Button>
          )}

          <Button
            colorScheme='messenger'
            size='lg'
            className='flex-1'
            onClick={toForward}>
            {t('common.forward')}
          </Button>
        </HStack>
      </div>
    </LayoutThird>
  );
}
