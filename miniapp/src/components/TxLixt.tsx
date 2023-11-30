import paytoview from '@/lib/paytoview';
import { useEffect } from 'react';
import { VStack } from '@chakra-ui/react';
import { TxItem } from '@/components/TxItem';
import { useListStore } from '@/store';
export const TxLixt = () => {
  const { txList, setTxList } = useListStore((state) => state);
  const getTXDetails = async () => {
    const result = await paytoview.getTXDetails();
    if (result.code === '000000' && result.data?.length) {
      setTxList(result.data);
    } else {
      setTxList([]);
    }
  };
  console.log(txList);
  useEffect(() => {
    getTXDetails();
  }, []);
  return (
    <VStack spacing='10px' className='w-full'>
      {txList.slice(0, 5).map((item, i) => (
        <TxItem item={item} key={i}/>
      ))}
    </VStack>
  );
};
