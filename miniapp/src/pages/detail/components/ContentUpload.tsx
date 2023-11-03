import {
  FormControl,
  Input,
  Textarea,
  FormLabel,
  InputGroup,
  NumberInput,
  NumberInputField,
  InputRightAddon,
} from '@chakra-ui/react';
import { Upload } from '@/components/Upload';
import { useEffect } from 'react';
import { useMap, useDebounce } from 'react-use';
import { useTranslation } from 'react-i18next';
import { BlurImage } from '@/components/BlurImage';

interface ContentUploadProps {
  onChange?: (data: any) => void;
  type?: 'image' | 'text';
}
export const ContentUpload = ({ onChange, type }: ContentUploadProps) => {
  const { t } = useTranslation();
  const [data, { set }] = useMap({
    title: 'PayToView First Image',
    description: '',
    password: '',
    content: '',
    textLimit: 0,
    image: null,
    previewImage: null,
  });
  const titleChange = (e) => {
    set('title', e.target.value);
  };
  const imageChange = async (file: File) => {
    await set('image', file as any);
  };
  const blurChange = async (file: File) => {
    console.log(file);
    await set('previewImage', file as any);
  };
  const contentChange = (e) => {
    set('content', e.target.value);
  };
  const descriptionChange = (e) => {
    set('description', e.target.value);
  };
  const passwordChange = (e) => {
    set('password', e.target.value);
  };

  useDebounce(
    () => {
      onChange?.(data);
    },
    300,
    [data],
  );
  return (
    <div>
      <div>ContentUpload.tsx</div>
      <FormControl className='mb-4'>
        <Input
          type='text'
          placeholder='Title'
          variant='filled'
          value={data.title}
          onChange={titleChange}
        />
      </FormControl>
      <FormControl className='mb-4'>
        <Input
          type='text'
          placeholder='Description'
          variant='filled'
          value={data.description}
          onChange={descriptionChange}
        />
      </FormControl>
      {type === 'image' ? (
        <Upload onChange={imageChange} />
      ) : (
        <FormControl>
          <Textarea
            value={data.content}
            onChange={contentChange}
            placeholder='Content'
            size='sm'
            variant='filled'
          />
        </FormControl>
      )}
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
          <div>
            <div className='text-sm mb-2'>{t('pages.detail.blur_show')}</div>
            {data.image && (
              <BlurImage file={data.image} onChange={blurChange} />
            )}
          </div>
        )}
      </FormControl>
      {/* <FormControl className='mb-4'>
        <FormLabel>{t('pages.detail.password_mode')}</FormLabel>
        <Input
          type='text'
          rounded='md'
          variant='filled'
          placeholder='Password'
          value={data.password}
          onChange={passwordChange}
        />
      </FormControl> */}
    </div>
  );
};
