import { FormControl, Input, Textarea } from '@chakra-ui/react';
import { Upload } from '@/components/Upload';
import { useEffect } from 'react';
import { useMap } from 'react-use';

interface ContentUploadProps {
  onChange?: (data: any) => void;
  type?: 'image' | 'text';
}
export const ContentUpload = ({ onChange, type }: ContentUploadProps) => {
  const [data, { set }] = useMap({
    title: 'PayToView First Image',
    description: '',
    content: '',
    image: null,
  });
  const titleChange = (e) => {
    set('title', e.target.value);
    onChange?.(data);
  };
  const imageChange = async (file: File) => {
    set('image', file as any);
    onChange?.(data);
  };
  const contentChange = (e) => {
    set('content', e.target.value);
    onChange?.(data);
  };
  const descriptionChange = (e) => {
    set('description', e.target.value);
    onChange?.(data);
  };
  return (
    <div>
      <FormControl className='mb-4'>
        <Input
          type='text'
          placeholder='Title'
          value={data.title}
          onChange={titleChange}
        />
      </FormControl>
      <FormControl className='mb-4'>
        <Input
          type='text'
          placeholder='Description'
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
          />
        </FormControl>
      )}
    </div>
  );
};
