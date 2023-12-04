import {
  FormControl,
  Input,
  Textarea,
  FormLabel,
  InputGroup,
  NumberInput,
  NumberInputField,
  InputRightAddon,
  SimpleGrid,
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
    type: '',
    textLimit: 0,
    image: null,
    previewImage: null,
  });
  const titleChange = (e) => {
    set('title', e.target.value);
  };
  const imageChange = async (file: File) => {
    console.log(file);
    await set('image', file as any);
    await set('type', file.type);
  };
  const blurChange = async (file: File) => {
    console.log(file);
    await set('previewImage', file as any);
  };
  const contentChange = (e) => {
    set('content', e.target.value);
  };
  const focusHandler = (e) => {
    e.target.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
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
      <div className='flex justify-center items-center mb-4'>
        <Upload onChange={imageChange} />
        {data.type.indexOf('image') > -1 && (
          <div className='ml-4'>
            <BlurImage file={data.image} onChange={blurChange} />
          </div>
        )}
      </div>

      <FormControl className='mb-4'>
        <Input
          type='text'
          placeholder='Title'
          variant='filled'
          value={data.title}
          onFocus={focusHandler}
          onChange={titleChange}
        />
      </FormControl>
      <FormControl className='mb-4'>
        <Input
          type='text'
          placeholder='Description'
          variant='filled'
          value={data.description}
          onFocus={focusHandler}
          onChange={descriptionChange}
        />
      </FormControl>
      {/* <FormControl className='mb-4'>
        <FormLabel>{t('pages.publish.password_mode')}</FormLabel>
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
