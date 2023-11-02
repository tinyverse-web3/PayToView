import { Image } from '@chakra-ui/react';

interface AssetsTokenItemProps {
  icon?: string;
  symbol: string;
  chain: string;
  balance?: number | string;
  dollar?: number | string;
  onClick?: () => void;
}
export const AssetsTokenItem = ({
  icon,
  symbol,
  balance,
  chain,
  dollar,
  onClick,
}: AssetsTokenItemProps) => {
  return (
    <div
      className='flex items-center justify-between h-16 bg-gray-100 px-4 rounded-2xl'
      onClick={() => onClick?.()}>
      <div className='flex items-center'>
        {icon && (
          <Image
            src={icon}
            className='w-6 h-6 bg-gray-200 rounded-full mr-6'></Image>
        )}
        <div>
          <p className='text-md mb-2'>{symbol}</p>
          <p className='text-xs text-gray-500'>{chain}</p>
        </div>
      </div>
      <div>
        <div className='text-3.5 font-600 text-right'>{balance}</div>
        <div className='text-right'>{!!dollar && dollar}</div>
      </div>
    </div>
  );
};
