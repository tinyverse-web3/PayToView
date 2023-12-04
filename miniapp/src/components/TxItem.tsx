import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { hideStr } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
interface TxItemProps {
  item: any;
  onClick?: () => void;
}
export const TxItem = ({ item, onClick }: TxItemProps) => {
  const { t } = useTranslation()
  return (
    <div
      className='w-full h-20 px-2 py-1 mb-1 tx-item-box bg-gray-200 rounded-lg'
      onClick={() => onClick?.()}>
      <div className='flex h-full items-center'>
        {item.type === 0 ? (
          <Icon
            icon='mdi:arrow-down-bold-circle-outline'
            className='text-3xl mr-4 text-green-500'
          />
        ) : (
          <Icon
            icon='mdi:arrow-up-bold-circle-outline'
            className='text-3xl mr-4 text-[#1296db]'
          />
        )}
        <div className='flex-1'>
          <div className='mb-1 text-sm flex justify-between items-center'>
            <span>{item.type === 0 ? t('pages.index.tx_receiver') : t('pages.index.tx_sender')}</span>
            <div className='text-base text-right'>
              {item.type === 0 ? '+' : '-'}
              {item.amount}
            </div>
          </div>
          {!!item.gas && (
            <div className='flex justify-between mb-1 text-xs text-gray-500'>
              <span>{t('common.gas')}</span>
              <span>{item.gas}</span>
            </div>
          )}

          <div className='flex justify-between'>
            <div className='text-xs text-gray-500'>
              {format(item.txTime, 'MM-dd HH:mm:ss')}
            </div>
          </div>
        </div>
        {/* <div>
          <div className='text-sm text-gray-400'>
            {item.type === 0 ? hideStr(item.sender, 4) : ''}
          </div>
        </div> */}
      </div>
    </div>
  );
};
