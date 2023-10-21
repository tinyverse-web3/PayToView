import { useMemo, useState } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
} from '@chakra-ui/react';
import { useTitle } from 'react-use';

import { ContentUpload } from './components/ContentUpload';
import { PayLimit } from './components/PayLimit';
import { BackButton, useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useListStore } from '@/store/list';
import { useNavigate } from 'react-router-dom';
import { useMap } from 'react-use';

export default function DetailAdd() {
  useTitle('PayToView');
  const nav = useNavigate();
  const [data, { set }] = useMap({
    title: '',
    content: '',
    image: '',
    textLimit: 10,
    platform: 5,
    developer: 10,
    announcer: 70,
    forwarder: 15,
  });
  const { add } = useListStore((state) => state);

  const [tabIndex, setTabIndex] = useState(0);
  const type = useMemo(() => (tabIndex === 0 ? 'image' : 'text'), [tabIndex]);
  const contentChange = (v) => {
    set('title', v.title);
    set('content', v.content);
  };
  const payChange = (v) => {
    set('textLimit', v.textLimit);
    set('platform', v.platform);
    set('developer', v.developer);
    set('announcer', v.announcer);
    set('forwarder', v.forwarder);
  };
  // const webApp = useWebApp();
  const addHandler = async () => {
    // const commissionResult = await globalThis.getCommissionList();
    // if (commissionResult.code !== '000000') {
    //   return;
    // }
    if (type === 'image') {
      await add({
        type,
        title: data.title,
        image: 'https://via.placeholder.com/300',
        textLimit: 10,
        platform: 5,
        developer: 10,
        announcer: 70,
        forwarder: 15,
      });
    } else {
      await add({
        type,
        title: data.title,
        content: data.content,
        description: data.content.substring(0, data.textLimit),
        textLimit: 10,
        platform: 5,
        developer: 10,
        announcer: 70,
        forwarder: 15,
      });
    }
    nav(-1);
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
          <Tab>图片</Tab>
          <Tab>文本</Tab>
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
          className='w-full'
          onClick={addHandler}>
          发布
        </Button>
      </div>
    </div>
  );
}
