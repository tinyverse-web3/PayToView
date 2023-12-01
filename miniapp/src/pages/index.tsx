import {
  SimpleGrid,
  Card,
  CardHeader,
  Image,
  Box,
  CardBody,
  Heading,
  Stack,
  ListItem as Litem,
  StackDivider,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';

import { Address } from '@/components/Address';
import { Search2Icon } from '@chakra-ui/icons';
import { useEffect, useMemo, useState } from 'react';
import { ListItem } from '@/components/ListItem';
import { Empty } from '@/components/Empty';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
import { AssetsTokenItem } from '@/components/AssetsTokenItem';
import { useAccountStore, useListStore } from '@/store';
import paytoview from '@/lib/paytoview';
import LayoutThird from '@/layout/LayoutThird';
import { TxLixt } from '@/components/TxLixt';
const MenuButton = ({ name, icon, onClick }: any) => {
  return (
    <div className='flex flex-col items-center' onClick={onClick}>
      <img className='h-10 w-10 mb-2' src={icon}></img>
      <span className='text-sm'>{name}</span>
    </div>
  );
};

export default function Index() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const nav = useNavigate();
  const { income, setIncome } = useListStore((state) => state);
  const { accountInfo, balance } = useAccountStore((state) => state);
  const toEarn = () => {
    nav(ROUTE_PATH.EARN);
  };
  const menuList = [
    {
      name: t('pages.publish.icon_title'),
      icon: '/images/publish.png',
      onClick: () => {
        nav(ROUTE_PATH.PUBLISH);
      },
    },
    {
      name: t('pages.earning.icon_title'),
      icon: '/images/earning.png',
      onClick: () => {
        toEarn();
      },
    },
    {
      name: t('pages.published.icon_title'),
      icon: '/images/published.png',
      onClick: () => {
        nav(ROUTE_PATH.PUBLISHED);
      },
    },
    {
      name: t('pages.paid.icon_title'),
      icon: '/images/paid.png',
      onClick: () => {
        nav(ROUTE_PATH.PAID);
      },
    },
    {
      name: t('pages.forwarded.icon_title'),
      icon: '/images/forwarded.png',
      onClick: () => {
        nav(ROUTE_PATH.FORWARDED);
      },
    },
    {
      name: t('pages.topup.title'),
      icon: '/images/topup.png',
      onClick: () => {
        nav(ROUTE_PATH.TOPUP);
      },
    },
  ];
  const toTg = () => {
    window.open('https://t.me/tvnb_bot?start=xyzw');
  };
  const toTx = () => {
    nav(ROUTE_PATH.TX);
  };
  const getIncomeWithin24h = async () => {
    const result = await paytoview.getIncomeWithin24h();
    console.log('getIncomeWithin24h: result:', result);
    if (result.code === '000000') {
      setIncome(result.data || 0);
    } else {
      setIncome(0);
    }
  };
  const [searchTerm, setSearchTerm] = useState('');

  const handleKeyPress = (event) => {
    // 在按下 Enter 键时，执行搜索
    if (event.key === 'Enter') {
      nav(ROUTE_PATH.DETAIL + '/?contract=' + searchTerm);
    }
  };

  useEffect(() => {
    getIncomeWithin24h();
  }, []);
  return (
    <LayoutThird title={t('pages.index.title')} showBack={false}>
      <div className='h-full overflow-hidden flex flex-col'>
        <div className='overflow-y-auto flex-1'>
          <div className='p-4'>
            {/* <div className='bg-gray-100 p-4 mb-4 rounded-2xl'>
              <div className='flex mb-6 items-center'>
                <Image
                  src='/logo.png'
                  className='w-6 h-6 bg-gray-200 rounded-full mr-6'></Image>
                <div className='break-all'><Address address={accountInfo.publicKey} /></div>
              </div>
              <div className='flex justify-between items-end '>
                <div className='flex items-end'>
                  <span className='mr-2 text-4xl font-bold leading-none'>
                    {balance}
                  </span>
                  <span className='text-sm leading-none mb-1'>TVS</span>
                </div>
                <p className='text-xs text-gray-500 leading-none mb-1'>
                  Tinyverse
                </p>
              </div>
            </div> */}
            <div className='text-center mb-4'>
              <div className='mb-2 text-base'>TVS</div>
              <div className='font-bold text-xl'>{balance} TVS</div>
            </div>
            <div className=' bg-gray-100 p-4 mb-4 rounded-2xl'>
              <SimpleGrid columns={2} columnGap='20px'>
                <div className='text-center bg-gray-200 p-2 rounded-xl'>
                  <div className='mb-2 text-xs'>{t('pages.index.address')}</div>
                  <div className='flex items-end justify-center'>
                    <span className='mr-2 text-sm font-bold leading-none'>
                      <Address address={accountInfo.address} />
                    </span>
                  </div>
                </div>
                <div
                  className='text-center bg-gray-200 p-2 rounded-xl'
                  onClick={toEarn}>
                  <div className='mb-2 text-xs'>{t('pages.index.profit')}</div>
                  <div className='flex items-end justify-center'>
                    <span className='mr-2 text-sm font-bold leading-none'>
                      {income}
                    </span>
                    <span className='text-xs leading-none'>TVS</span>
                  </div>
                </div>
              </SimpleGrid>
            </div>
            <div className='mt-4 mb-4 m-2'>
              <SimpleGrid columns={3} rowGap='25px'>
                {menuList.map((item, i) => (
                  <MenuButton
                    key={i}
                    name={item.name}
                    icon={item.icon}
                    onClick={item.onClick}
                  />
                ))}
              </SimpleGrid>
            </div>
            {/* <div className='mt-m-2'>
              <InputGroup>
                <Input
                  type='text'
                  placeholder='Search...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  // 根据需要添加其他属性
                />
                <InputRightElement>
                  <Search2Icon color='gray.400' />
                </InputRightElement>
              </InputGroup>
            </div> */}
            <div className='bg-gray-50 p-4 rounded-lg'>
              <div
                className='mb-2 font-bold text-lg'
                style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className='text-xm ml-2'>
                  {t('pages.index.transaction_record')}
                </span>
                <span className='text-xm mr-2' onClick={toTx}>
                  {t('pages.index.more')} &gt;
                </span>
              </div>
              <div>
                <TxLixt></TxLixt>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutThird>
  );
}
