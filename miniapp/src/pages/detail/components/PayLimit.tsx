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
import { use } from 'i18next';

interface PayLimitProps {
  type: string;
  onChange?: (data: any) => void;
}

export const PayLimit = ({ onChange }: PayLimitProps) => {
  const { t } = useTranslation();
  const [data, { set }] = useMap({
    amount: 0,
    textLimit: 10,
    fee: 10,
    platform: 5,
    developer: 10,
    announcer: 70,
    forwarder: 15,
  });
  const focusHandler = (e) => {
    e.target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  };
  useEffect(() => {
    onChange?.(data);
  }, [data]);
  useEffect(() => {
    onChange?.(data);
  }, []);
  return (
    <div>
      {/* <div>PayLimit.tsx</div> */}
      <FormControl className='mb-4'>
        <FormLabel>Amount</FormLabel>
        <NumberInput
          width='100%'
          size='sm'
          variant='filled'
          value={data.fee}
          onFocus={focusHandler}
          onChange={(_, e: number) => set('fee', isNaN(e) ? 0 : e)}>
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
              onFocus={focusHandler}
              onChange={(_, e: number) => set('platform', isNaN(e) ? 0 : e)}>
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
              onFocus={focusHandler}
              onChange={(_, e: number) => set('developer', isNaN(e) ? 0 : e)}>
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
              onFocus={focusHandler}
              onChange={(_, e: number) => set('forwarder', isNaN(e) ? 0 : e)}>
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
              onFocus={focusHandler}
              onChange={(_, e: number) => set('announcer', isNaN(e) ? 0 : e)}>
              <NumberInputField />
            </NumberInput>
          </div>
        </SimpleGrid>
      </FormControl>
    </div>
  );
};
