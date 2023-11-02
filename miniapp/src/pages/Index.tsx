import {
  SimpleGrid,
  IconButton,
  Tabs,
  TabList,
  Tab,
  Card,
  CardHeader,
  Image,
  ButtonGroup,
  Button,
} from '@chakra-ui/react';

import { useEffect, useMemo, useState } from 'react';
import { ListItem } from '@/components/ListItem';
import { Empty } from '@/components/Empty';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
import { AssetsTokenItem } from '@/components/AssetsTokenItem';
import { useAccountStore } from '@/store';
import paytoview from '@/lib/paytoview';

export default function Index() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const nav = useNavigate();
  const { accountInfo, balance } = useAccountStore((state) => state);
  const toAdd = () => {
    nav(ROUTE_PATH.DETAIL_ADD);
  };
  const toPublished = () => {
    nav(ROUTE_PATH.PUBLISHED);
  };
  const toPaid = () => {
    nav(ROUTE_PATH.PAID);
  };
  const toForwarded = () => {
    nav(ROUTE_PATH.FORWARDED);
  };
  const toEarn = () => {
    nav(ROUTE_PATH.EARN);
  };
  const clear = () => {
    localStorage.clear();
    location.reload();
  };

  useEffect(() => {}, []);
  return (
    <div className='h-full overflow-hidden flex flex-col'>
      <div className='overflow-y-auto flex-1'>
        <div className='p-4'>
          <div className='bg-gray-100 p-4 mb-4 rounded-2xl'>
            <div className='flex mb-6 items-center'>
              <Image
                src='/logo.png'
                className='w-6 h-6 bg-gray-200 rounded-full mr-6'></Image>
              <div className='break-all'>{accountInfo.publicKey}</div>
            </div>
            <div className='flex justify-between items-end '>
              <div className='flex items-end'>
                <span className='mr-2 text-4xl font-bold leading-none'>
                  1000
                </span>
                <span className='text-sm leading-none mb-1'>TVS</span>
              </div>
              <p className='text-xs text-gray-500 leading-none mb-1'>
                Tinyverse
              </p>
            </div>
          </div>
          <div className=' bg-gray-100 p-4 mb-4 rounded-2xl'>
            <div className='flex mb-4'>
              <div className='text-xs p-1 px-2 rounded-md bg-gray-200 mr-2'>
                24小时收益
              </div>
              <div className='text-xs p-1 px-2 rounded-md bg-gray-200'>
                48小时收益
              </div>
            </div>
            <SimpleGrid columns={2} columnGap='20px'>
              <div
                className='text-center bg-gray-200 p-2 rounded-xl'
                onClick={toEarn}>
                <div className='mb-2'>付费收益</div>
                <div className='flex items-end justify-center'>
                  <span className='mr-2 text-xl font-bold leading-none'>
                    50
                  </span>
                  <span className='text-xs leading-none '>TVS</span>
                </div>
              </div>
              <div
                className='text-center bg-gray-200 p-2 rounded-xl'
                onClick={toEarn}>
                <div className='mb-2'>分享收益</div>
                <div className='flex items-end justify-center'>
                  <span className='mr-2 text-xl font-bold leading-none'>
                    50
                  </span>
                  <span className='text-xs leading-none'>TVS</span>
                </div>
              </div>
            </SimpleGrid>
          </div>
          <div>
            <Tabs variant='soft-rounded' size='sm' colorScheme='gray'>
              <TabList>
                <Tab>All</Tab>
                <Tab>Transfer In</Tab>
                <Tab>Transfer Out</Tab>
              </TabList>
            </Tabs>
          </div>
        </div>
      </div>
      <div className='h-16 flex justify-center items-center'>
        <ButtonGroup size='sm' variant='outline' isAttached>
          <IconButton
            isRound={true}
            variant='solid'
            colorScheme='teal'
            aria-label='Done'
            onClick={toAdd}
            icon={<Icon icon='material-symbols:add' className='text-2xl' />}
          />
          <Button onClick={toPublished}>Published</Button>
          <Button onClick={toPaid}>Paid</Button>
          <Button onClick={toForwarded}>Forwarded</Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
