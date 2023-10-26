import { useMemo, useState } from 'react';
import { Tabs, TabList, Tab, Button } from '@chakra-ui/react';
import { useTitle } from 'react-use';

import { ContentUpload } from './components/ContentUpload';
import { PayLimit } from './components/PayLimit';
import { BackButton, useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useListStore, useTvsStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import { useMap } from 'react-use';
import { useTranslation } from 'react-i18next';

export default function DetailAdd() {
  useTitle('PayToView');
  const nav = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, { set }] = useMap({
    title: 'PayToView First Image',
    content: '',
    description: '',
    image: '',
    fee: '',
    textLimit: 10,
    platform: 5,
    developer: 10,
    announcer: 70,
    forwarder: 15,
  });
  const { add } = useListStore((state) => state);
  const { tvs } = useTvsStore((state) => state);

  const [tabIndex, setTabIndex] = useState(0);
  const type = useMemo(() => (tabIndex === 0 ? 'image' : 'text'), [tabIndex]);
  const contentChange = (v) => {
    console.log(v);
    set('title', v.title);
    set('content', v.content);
    set('description', v.description);
  };
  const payChange = (v) => {
    set('textLimit', v.textLimit);
    set('fee', v.fee);
    set('platform', v.platform);
    set('developer', v.developer);
    set('announcer', v.announcer);
    set('forwarder', v.forwarder);
  };
  const getCommisionContrcat = async () => {
    const commissionResult = await tvs.getCommissionList();
    console.log(commissionResult);
    if (commissionResult.code === '000000' && commissionResult.data.length) {
      return commissionResult.data[0]?.ContractName;
    } else {
      const deplyCommissionResult = await tvs.deployCommission({
        name: 'test_commission',
        agentPercent: 10,
        networkPercent: 5,
      });
      if (deplyCommissionResult.code === '000000') {
        return deplyCommissionResult.data;
      }
    }
  };
  // const webApp = useWebApp();
  const addHandler = async () => {
    setLoading(true);
    const commissionContract = await getCommisionContrcat();
    if (!commissionContract) {
      setLoading(false);
      return;
    }
    let file;
    if (type === 'text') {
      file = new File([data.content], `${data.title}.txt`, {
        type: 'text/plain',
      });
    }
    const ipfsResult = await tvs.addFileToIPFS(
      {
        fileName: data.title,
        password: '123456',
      },
      new Uint8Array(file),
    );
    if (ipfsResult.code !== '000000' || !ipfsResult.data) {
      return;
    }
    const contentCid = ipfsResult.data;

    let previewFile;
    if (type === 'image') {
      previewFile = new File([data.image], `${data.title}.png`, {
        type: 'image/png',
      });
    } else {
      previewFile = new File([data.description], `${data.title}.txt`, {
        type: 'text/plain',
      });
    }
    const ipfsPreviewResult = await tvs.addFileToIPFS(
      {
        fileName: data.title,
      },
      new Uint8Array(previewFile),
    );
    if (ipfsPreviewResult.code !== '000000' || !ipfsPreviewResult.data) {
      return;
    }
    const previewCid = ipfsPreviewResult.data;

    console.log(contentCid, previewCid);
    const result = await tvs.deployPayToView({
      name: data.title,
      commissionName: commissionContract,
      content: {
        cid: contentCid,
        description: data.description,
        contentType: type,
        cidForpreview: previewCid,
      },
      ratio: data.announcer,
      fee: data.fee,
    });
    // if (type === 'image') {
    //   await add({
    //     type,
    //     title: data.title,
    //     image: 'https://via.placeholder.com/300',
    //     textLimit: 10,
    //     platform: 5,
    //     developer: 10,
    //     announcer: 70,
    //     forwarder: 15,
    //   });
    // } else {
    //   await add({
    //     type,
    //     title: data.title,
    //     content: data.content,
    //     description: data.content.substring(0, data.textLimit),
    //     textLimit: 10,
    //     platform: 5,
    //     developer: 10,
    //     announcer: 70,
    //     forwarder: 15,
    //   });
    // }
    setLoading(false);
    // nav(-1);
  };
  return (
    <div className='min-h-ful py-4'>
      <BackButton onClick={() => nav(-1)} />
      <Tabs
        variant='soft-rounded'
        align='center'
        className='mb-4'
        onChange={(index) => setTabIndex(index)}
        colorScheme='green'>
        <TabList className='px-2'>
          <Tab>{t('common.image')}</Tab>
          <Tab>{t('common.text')}</Tab>
        </TabList>
      </Tabs>
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
