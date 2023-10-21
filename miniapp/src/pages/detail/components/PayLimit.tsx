import {
  FormControl,
  NumberInput,
  FormLabel,
  SimpleGrid,
  InputGroup,
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

export const PayLimit = ({ onChange, type }: PayLimitProps) => {
  const { t } = useTranslation();
  const [data, { set }] = useMap({
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
      <FormControl className='mb-4'>
        <FormLabel>{t('pages.detail.preview_mode')}</FormLabel>
        {type === 'text' ? (
          <InputGroup size='md'>
            <NumberInput
              min={10}
              max={90}
              width='100%'
              value={data.textLimit}
              onChange={(_, e: number) => set('textLimit', e)}>
              <NumberInputField />
            </NumberInput>
            <InputRightAddon children='%' />
          </InputGroup>
        ) : (
          <div className='text-sm'>{t('pages.detail.blur_show')}</div>
        )}
      </FormControl>
      <FormControl>
        <FormLabel>{t('pages.detail.divide_ratio')}</FormLabel>
        <SimpleGrid columns={4} spacing='10px'>
          <div>
            <div className='text-sm mb-1 text-center'>{t('pages.detail.network')}</div>
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
            <div className='text-sm mb-1 text-center'>{t('pages.detail.app')}</div>
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
            <div className='text-sm mb-1 text-center'>{t('pages.detail.sender')}</div>
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
          <div>
            <div className='text-sm mb-1 text-center'>{t('pages.detail.forwarder')}</div>
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
        </SimpleGrid>
      </FormControl>
    </div>
  );
};
