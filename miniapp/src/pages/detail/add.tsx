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
import { Upload } from '@/components/Upload';
import { TextUpload } from './components/TextUpload';
import { PayLimit } from './components/PayLimit';
import { BackButton, useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useNavigate } from 'react-router-dom';

export default function AddIndex() {
  useTitle('PayToView');
  const nav = useNavigate();
  const imageChange = async (file: File) => {
    console.log(file);
  };
  const [tabIndex, setTabIndex] = useState(0);
  const type = useMemo(() => (tabIndex === 0 ? 'image' : 'text'), [tabIndex]);

  const webApp = useWebApp();
  const add = async () => {
    webApp.sendData({
      type: 'add',
      data: {
        type,
        title: 'title',
        description: 'description',
        image: 'https://via.placeholder.com/300',
      },
    });
  };
  return (
    <div className='min-h-ful py-4'>
      <BackButton onClick={() => nav(-1)} />
      <Tabs
        variant='soft-rounded'
        onChange={(index) => setTabIndex(index)}
        colorScheme='green'>
        <TabList className='px-2'>
          <Tab>图片</Tab>
          <Tab>文本</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Upload onChange={imageChange} />
          </TabPanel>
          <TabPanel className='p-0'>
            <TextUpload />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <div className='px-4'>
        <div className='mb-4'>
          <PayLimit type={type} />
        </div>
        <Button
          colorScheme='messenger'
          size='lg'
          className='w-full'
          onClick={add}>
          发布
        </Button>
      </div>
    </div>
  );
}
