import {
  SimpleGrid,
  IconButton,
  Tabs,
  TabList,
  Tab,
  ButtonGroup,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { TxItem } from '@/components/TxItem';
import { Empty } from '@/components/Empty';
import { useTitle } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { ROUTE_PATH } from '@/router';
import { useTranslation } from 'react-i18next';
import { useListStore } from '@/store';
import LayoutThird from '@/layout/LayoutThird';
import paytoview from '@/lib/paytoview';
import { VStack } from '@chakra-ui/react';

export default function Earn() {
  useTitle('PayToView');
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);
  const nav = useNavigate();
  const { incomeList, setIncomeList } = useListStore((state) => state);
  const getIncomeList = async () => {
    const result = await paytoview.getIncomeList();
    if (result.code === '000000' && result.data?.length) {
      setIncomeList(result.data);
    } else {
      setIncomeList([]);
    }
  };
  console.log(incomeList);
  useEffect(() => {
    getIncomeList();
  }, []);
  return (
    <LayoutThird title={t('pages.earning.title')} path={ROUTE_PATH.INDEX}>
      <div className='h-full overflow-hidden p-4'>
        {incomeList.length === 0 && <Empty />}
        <VStack spacing='10px'>
          {incomeList.map((item, i) => (
            <TxItem item={item} key={i} />
          ))}
        </VStack>
      </div>
    </LayoutThird>
  );
}
