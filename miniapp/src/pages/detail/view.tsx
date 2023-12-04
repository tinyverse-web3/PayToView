import { Button, Image, Card, CardBody, HStack } from '@chakra-ui/react';
import { useEffect, useState, useMemo } from 'react';
import { useTitle } from 'react-use';
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

  const getData = async () => {
    if (!ContractID) return;
    const result = await paytoview.getViewPassword({ ContractID: ContractID });
    if (result.code === '000000') {
      console.log(detail.contractInfo?.ContractInfo?.Content?.Cid);
      const res = await paytoview.getFileFromIPFS({
        Cid: detail.contractInfo?.ContractInfo?.Content?.Cid,
        Password: result.data,
      });
      if (
        res &&
        detail?.contractInfo?.ContractInfo?.Content?.ContentType.indexOf(
          'image',
        ) > -1
      ) {
        const localFile = new Blob([new Uint8Array(res)], {
          type: 'application/octet-stream',
        });
        const url = URL.createObjectURL(localFile);
        setContentSrc(url);
      } else {
        const localFile = new Blob([new Uint8Array(res)], {
          type: detail?.contractInfo?.ContractInfo?.Content?.ContentType,
          endings: 'native',
        });
        const url = URL.createObjectURL(localFile);
        setContentSrc(url);
      }
    }
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
  const type = useMemo(
    () => detail?.contractInfo?.ContractInfo?.Content.ContentType || '',
    [detail?.contractInfo?.ContractInfo?.Content.ContentType],
  );
  const openFile = () => {
    window.open(contentSrc, '_blank');
  };
  useEffect(() => {
    if (ContractID) {
      getContractDetail();
    }
  }, [ContractID]);
  useEffect(() => {
    console.log('paid:', paid);
    console.log('ContractID:', ContractID);
    if (ContractID && paid) {
      getData();
    }
  }, [ContractID, paid]);
  return (
    <LayoutThird title={t('pages.detail.title')} path={ROUTE_PATH.INDEX}>
      <div className='min-h-ful p-4'>
        <div className='mb-4'>
          {type.indexOf('image') > -1 ? (
            <PhotoProvider>
              <div className='flex justify-center items-center'>
                <div className='w-48 h-48'>
                  <PhotoView src={contentSrc}>
                    <Image src={contentSrc} height='100%' fit='cover' />
                  </PhotoView>
                </div>
              </div>
            </PhotoProvider>
          ) : (
            <div className='flex justify-center items-center'>
              <div className='w-48 h-48'>
                <Image src='/icon-txt.png' height='100%' fit='cover' />
              </div>
            </div>
          )}
        </div>
        <div>
          <div className='mb-2 flex items-center'>
            <div className='font-bold mb-2 w-28'>Title</div>
            <div className='text-sm flex-1'>
              {detail.contractInfo?.ContractInfo?.Name}
            </div>
          </div>
          <div className='mb-2 flex items-center'>
            <div className='font-bold mb-2 w-28'>Description</div>
            <div className='text-sm flex-1'>
              {detail.contractInfo?.ContractInfo?.Content.Description}
            </div>
          </div>
          <div className='mb-2 flex items-center'>
            <div className='font-bold mb-2 w-28'>File Type</div>
            <div className='text-sm flex-1'>
              {detail.contractInfo?.ContractInfo?.Content.ContentType}
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
        </div>
        {type.indexOf('image') < 0 && (
          <Button
            colorScheme='messenger'
            size='lg'
            className='w-full mb-2'
            onClick={openFile}>
            Open
          </Button>
        )}

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
