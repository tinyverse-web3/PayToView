import {
  FormControl,
  NumberInput,
  FormLabel,
  SimpleGrid,
  InputGroup,
  Input,
  InputRightAddon,
  NumberInputField,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useMap } from 'react-use';
import { useTranslation } from 'react-i18next';

interface PayLimitProps {
  type: 'image' | 'text';
  onChange?: (data: any) => void;
}

export const PayLimit = ({ onChange }: PayLimitProps) => {
  const { t } = useTranslation();
  const [data, { set }] = useMap({
    amount: 0,
    textLimit: 10,
    platform: 5,
    developer: 10,
    announcer: 70,
    forwarder: 15,
  });

  useEffect(() => {
    onChange?.(data);
  }, [data]);
  return (
    <div>
      <div>PayLimit.tsx</div>
      <FormControl className='mb-4'>
        <FormLabel>{t('pages.publish.divide_ratio')}</FormLabel>
        <NumberInput
          isReadOnly
          width='100%'
          size='sm'
          variant='filled'
          value={data.amount}
          onChange={(_, e: number) => set('amount', e)}>
          <NumberInputField />
        </NumberInput>
      </FormControl>
      <FormControl>
        <FormLabel>{t('pages.publish.divide_ratio')}</FormLabel>
        <SimpleGrid columns={4} spacing='10px'>
          <div>
            <div className='text-sm mb-1 text-center'>
              {t('pages.publish.network')}
            </div>
            <NumberInput
              isReadOnly
              width='100%'
              size='sm'
              variant='filled'
              value={data.platform}
              onChange={(_, e: number) => set('platform', e)}>
              <NumberInputField />
            </NumberInput>
          </div>
          <div>
            <div className='text-sm mb-1 text-center'>
              {t('pages.publish.app')}
            </div>
            <NumberInput
              isReadOnly
              width='100%'
              size='sm'
              variant='filled'
              value={data.developer}
              onChange={(_, e: number) => set('developer', e)}>
              <NumberInputField />
            </NumberInput>
          </div>
          <div>
            <div className='text-sm mb-1 text-center'>
              {t('pages.publish.forwarder')}
            </div>
            <NumberInput
              min={15}
              max={85}
              size='sm'
              width='100%'
              variant='filled'
              value={data.forwarder}
              onChange={(_, e: number) => set('forwarder', e)}>
              <NumberInputField />
            </NumberInput>
          </div>
          <div>
            <div className='text-sm mb-1 text-center'>
              {t('pages.publish.sender')}
            </div>
            <NumberInput
              min={0}
              max={70}
              width='100%'
              size='sm'
              variant='filled'
              value={data.announcer}
              onChange={(_, e: number) => set('announcer', e)}>
              <NumberInputField />
            </NumberInput>
          </div>
        </SimpleGrid>
      </FormControl>
    </div>
  );
};
