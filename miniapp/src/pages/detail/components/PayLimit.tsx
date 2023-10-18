import {
  FormControl,
  NumberInput,
  FormLabel,
  SimpleGrid,
  InputGroup,
  InputRightAddon,
  NumberInputField,
} from '@chakra-ui/react';
import { useMap } from 'react-use';
interface PayLimitProps {
  type: 'image' | 'text';
}

export const PayLimit = ({ type }: PayLimitProps) => {
  const [data, { set }] = useMap({
    textLimit: 10,
    platform: 0.5,
    developer: 1,
    announcer: 7,
    forwarder: 1.5,
    content: '',
  });

  return (
    <div>
      <FormControl className='mb-4'>
        <FormLabel>预览方式</FormLabel>
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
          <div className='text-sm'>模糊显示</div>
        )}
      </FormControl>
      <FormControl>
        <FormLabel>分成比例</FormLabel>
        <SimpleGrid columns={4} spacing='10px'>
          <div>
            <div className='text-sm mb-1 text-center'>平台</div>
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
            <div className='text-sm mb-1 text-center'>应用开发商</div>
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
            <div className='text-sm mb-1 text-center'>发布人</div>
            <NumberInput
              min={0}
              max={6}
              width='100%'
              size='sm'
              variant='filled'
              value={data.announcer}
              onChange={(_, e: number) => set('announcer', e)}>
              <NumberInputField />
            </NumberInput>
          </div>
          <div>
            <div className='text-sm mb-1 text-center'>转发人</div>
            <NumberInput
              min={1.5}
              max={8.5}
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
