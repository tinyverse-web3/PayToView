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
import { toast } from 'react-hot-toast';
import { image } from 'stackblur-canvas';
export default function DetailIndex() {
  useTitle('PayToView');
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const profile = await paytoview.getProfile();
    const { balance } = profile?.data || {};
    if (balance < detail?.contractInfo?.ContractInfo?.Fee + 10) {
      toast.success('The balance is insufficient, please top up!', {
        duration: 2000,
      });
      setLoading(false);
      nav(ROUTE_PATH.TOPUP);
      return;
    }
    const result = await paytoview.payToView({
      ContractID: ContractID,
    });
    if (result.code === '000000') {
      setPaid(true);
    } else {
      toast.error(result.msg);
    }
    setLoading(false);
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
  const type = useMemo(
    () => detail?.contractInfo?.ContractInfo?.Content.ContentType || '',
    [detail?.contractInfo?.ContractInfo?.Content.ContentType],
  );
  useEffect(() => {
    if (ContractID) {
      getContractDetail();
    }
  }, [ContractID]);
  return (
    <LayoutThird title={t('pages.detail.title')}>
      <div className='min-h-ful p-4'>
        <div className='mb-4'>
          {type.indexOf('image') > -1 && (
            <PhotoProvider>
              <div className='flex justify-center items-center'>
                <div className='w-48 h-48'>
                  <PhotoView src={previewSrc}>
                    <Image
                      src={previewSrc}
                      height='100%'
                      fit='cover'
                      fallbackSrc='/image-loading.png'
                    />
                  </PhotoView>
                </div>
              </div>
            </PhotoProvider>
          )}
          {type.indexOf('text') > -1 && (
            <div className='flex justify-center items-center'>
              <div className='w-48 h-48'>
                <Image src='/icon-txt.png' height='100%' fit='cover' />
              </div>
            </div>
          )}
        </div>
        <div>
          <div className='mb-2 flex items-center'>
            <div className='font-bold w-28 leading-none'>Title</div>
            <div className='text-sm flex-1'>
              {detail.contractInfo?.ContractInfo?.Name}
            </div>
          </div>
          {detail.contractInfo?.ContractInfo?.Content.Description && (
            <div className='mb-2 flex items-center'>
              <div className='font-bold w-28'>Description</div>
              <div className='text-sm flex-1'>
                {detail.contractInfo?.ContractInfo?.Content.Description}
              </div>
            </div>
          )}

          <div className='flex items-center  mb-2'>
            <div className='font-bold w-28 leading-none'>File Type</div>
            <div className='text-sm flex-1'>
              {detail.contractInfo?.ContractInfo?.Content.ContentType}
            </div>
          </div>
          <div className='mb-2 flex items-center'>
            <div className='font-bold w-28'>Creater</div>
            <div className='text-sm flex-1 break-all'>{detail.walletKey}</div>
          </div>
          <div className='mb-2 flex items-center'>
            <div className='font-bold w-28'>Fee</div>
            <div className='text-sm flex-1'>
              {detail.contractInfo?.ContractInfo?.Fee}
            </div>
          </div>
        </div>

        {!paid ? (
          <Button
            colorScheme='messenger'
            size='lg'
            className='w-full'
            isLoading={loading}
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
