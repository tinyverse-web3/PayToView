import {
  SimpleGrid,
  IconButton,
  Tabs,
  TabList,
  Tab,
  ButtonGroup,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ListItem } from '@/components/ListItem';
import { Empty } from '@/components/Empty';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
import { useListStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';

export default function Index() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const nav = useNavigate();

  return (
    <LayoutThird title={t('pages.earning.title')} path={ROUTE_PATH.INDEX}>
      <div className='h-full overflow-hidden'>
        {/* <div>earn.tsx</div> */}
        <div className='p-4'>
          <div className='bg-gray-100 p-2 rounded-xl'>
            <div>分享收益</div>
            <div className='flex justify-end items-end'>
              <span className='mr-2 text-xl font-bold leading-none'>50</span>
              <span className='text-xs leading-none '>TVS</span>
            </div>
          </div>
        </div>
      </div>
    </LayoutThird >
  );
}
