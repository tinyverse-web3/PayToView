import { useMemo, useState } from 'react';
import { Tabs, TabList, Tab, Button } from '@chakra-ui/react';
import { useTitle } from 'react-use';
import { v4 as uuidv4 } from 'uuid';
import { ContentUpload } from './components/ContentUpload';
import { PayLimit } from './components/PayLimit';
import { BackButton, useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useListStore } from '@/store';
import paytoview from '@/lib/paytoview';
import { useNavigate } from 'react-router-dom';
import { useMap } from 'react-use';
import { generatePassword } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { ROUTE_PATH } from '@/router';

export default function DetailAdd() {
  useTitle('PayToView');
  const nav = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, { set }] = useMap({
    title: 'PayToView First Image',
    content: '',
    description: '',
    password: '',
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
  const type = useMemo(() => (tabIndex === 0 ? 'image' : 'text'), [tabIndex]);
  const contentChange = (v) => {
    set('title', v.title);
    set('content', v.content);
    // set('password', v.password);
    set('description', v.description);
    set('image', v.image);
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
      return;
    }
    // if (type === 'text') {
    //   file = new File([data.content], `${data.title}.txt`, {
    //     type: 'text/plain',
    //   });
    // } else {
    //   file = data.image;
    // }
    let contentCid;
    if (data.image) {
      const ipfsResult = await paytoview.addFileToIPFS(
        {
          fileName: data.title,
          file: data.image,
          password: password,
        },
      );
      const contentCid = ipfsResult.data;
    }
    let previewCid;
    if (data.previewImage) {
      const ipfsResult = await paytoview.addFileToIPFS(
        {
          fileName: data.title,
          file: data.previewImage,
        },
      );
      const previewCid = ipfsResult.data;
    }

    // let previewFile;
    // if (type === 'image') {
    //   console.log(data.image)
    //   previewFile = new File([data.image], `${data.title}.png`, {
    //     type: 'image/png',
    //   });
    // } else {
    //   previewFile = new File([data.description], `${data.title}.txt`, {
    //     type: 'text/plain',
    //   });
    // }
    // const ipfsPreviewResult = await tvs.addFileToIPFS(
    //   {
    //     fileName: data.title,
    //   },
    //   new Uint8Array(previewFile),
    // );
    // if (ipfsPreviewResult.code !== '000000' || !ipfsPreviewResult.data) {
    //   return;
    // }
    // const previewCid = ipfsPreviewResult.data;
    // // const contentCid = '123'
    // // const previewCid = '123'
    // console.log(contentCid, previewCid);
    const result = await paytoview.deployPayToView({
      Name: data.title + '_' + uuidv4(),
      CommissionName: commissionContract,
      Content: {
        Cid: contentCid,
        Description: data.description,
        ContentType: type,
        CidForpreview: previewCid,
      },
      Ratio: {
        AgentPercent: data.agentPercent,
        ForwarderPercent: data.forwarderPercent,
        NetworkPercent: data.networkPercent,
        PublisherPercent: data.publisherPercent,
      },
      Fee: data.fee,
      Password: data.password,
    });
    setLoading(false);
    nav(ROUTE_PATH.PUBLISHED);
    // nav(-1);
  };
  return (
    <div className='min-h-ful py-4'>
      <div>add.tsx</div>
      <BackButton onClick={() => nav(-1)} />
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
        <ContentUpload type={type} onChange={contentChange} />
      </div>
      <div className='px-4'>
        <div className='mb-4'>
          <PayLimit type={type} onChange={payChange} />
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
  );
}
