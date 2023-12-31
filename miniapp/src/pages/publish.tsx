import { useMemo, useState } from 'react';
import { Tabs, TabList, Tab, Button } from '@chakra-ui/react';
import { useTitle } from 'react-use';
import { v4 as uuidv4 } from 'uuid';
import { ContentUpload } from './detail/components/ContentUpload';
import { PayLimit } from './detail/components/PayLimit';
import { BackButton, useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useListStore } from '@/store';
import paytoview from '@/lib/paytoview';
import { useNavigate } from 'react-router-dom';
import { useMap } from 'react-use';
import { generatePassword } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { ROUTE_PATH } from '@/router';
import LayoutThird from '@/layout/LayoutThird';
import { toast } from 'react-hot-toast';

export default function DetailAdd() {
  useTitle('PayToView');
  const nav = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, { set }] = useMap({
    title: 'PayToView First Image',
    content: '',
    description: '',
    type: '',
    image: undefined,
    previewImage: undefined,
    fee: 300,
    textLimit: 10,
    networkPercent: 5,
    agentPercent: 10,
    publisherPercent: 70,
    forwarderPercent: 15,
  });
  const { add } = useListStore((state) => state);

  const [tabIndex, setTabIndex] = useState(0);
  const contentChange = (v) => {
    set('title', v.title);
    set('content', v.content);
    // set('password', v.password);
    set('description', v.description);
    set('image', v.image);
    set('type', v.type);
    set('previewImage', v.previewImage);
  };
  const payChange = (v) => {
    set('textLimit', v.textLimit);
    set('fee', v.fee);
    set('networkPercent', v.platform);
    set('agentPercent', v.developer);
    set('publisherPercent', v.announcer);
    set('forwarderPercent', v.forwarder);
  };
  const getCommisionContrcat = async () => {
    const commissionResult = await paytoview.getCommissionList();
    if (commissionResult.code !== '000000' && commissionResult.data?.length) {
      return commissionResult.data[0];
    } else {
      const deplyCommissionResult = await paytoview.deployCommission({
        Name: 'commission_' + uuidv4(),
        AgentPercent: 10,
        NetworkPercent: 5,
      });
      if (deplyCommissionResult.code === '000000') {
        return deplyCommissionResult.data;
      }
    }
  };
  // const webApp = useWebApp();
  const addHandler = async () => {
    setLoading(true);
    const password = generatePassword();
    const commissionContract = await getCommisionContrcat();
    if (!commissionContract) {
      setLoading(false);
      console.log('no tvs, need buy tvs');

      return;
    }
    let contentCid;
    if (data.image) {
      const ipfsResult = await paytoview.addFileToIPFS({
        fileName: data.title,
        file: data.image,
        password: password,
      });
      contentCid = ipfsResult.data;
    }
    let previewCid;
    if (data.previewImage && data.type.indexOf('image') > -1) {
      const ipfsResult = await paytoview.addFileToIPFS({
        fileName: data.title,
        file: data.previewImage,
      });
      previewCid = ipfsResult.data;
    }
    if (!contentCid || (data.type.indexOf('image') > -1 && !previewCid)) {
      setLoading(false);
      toast('cid is error');
      console.error('cid is error');
      return;
    }
    const result = await paytoview.deployPayToView({
      Name: data.title,
      CommissionName: commissionContract,
      Content: {
        Cid: contentCid,
        Description: data.description,
        ContentType: data.type,
        CidForpreview: previewCid,
      },
      Ratio: {
        AgentPercent: data.agentPercent,
        ForwarderPercent: data.forwarderPercent,
        NetworkPercent: data.networkPercent,
        PublisherPercent: data.publisherPercent,
      },
      Fee: data.fee,
      Password: password,
    });
    console.log('add.tsx->addHandler: result:', result);
    if (result.code !== '000000') {
      setLoading(false);
      console.error('deployPayToView is error');
      return;
    }
    setLoading(false);
    nav(ROUTE_PATH.PUBLISHED);
    // nav(-1);
  };
  return (
    <LayoutThird title={t('pages.publish.title')} path={ROUTE_PATH.INDEX}>
      <div className='min-h-ful py-4'>
        {/* <div>add.tsx</div> */}

        {/* <Tabs
        variant='soft-rounded'
        align='center'
        className='mb-4'
        onChange={(index) => setTabIndex(index)}
        colorScheme='green'>
        <TabList className='px-2'>
          <Tab>{t('common.image')}</Tab>
          <Tab>{t('common.text')}</Tab>
        </TabList>
      </Tabs> */}
        <div className='mb-4 px-4'>
          <ContentUpload onChange={contentChange} />
        </div>
        <div className='px-4'>
          <div className='mb-4'>
            <PayLimit type={data.type} onChange={payChange} />
          </div>
          <Button
            colorScheme='messenger'
            size='lg'
            isLoading={loading}
            className='w-full'
            onClick={addHandler}>
            {t('common.release')}
          </Button>
        </div>
      </div>
    </LayoutThird>
  );
}
