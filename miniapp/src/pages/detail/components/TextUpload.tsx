import { FormControl, Input, Textarea } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useMap } from 'react-use';

interface TextUploadProps {
  onChange?: (data: any) => void;
}
export const TextUpload = ({ onChange }: TextUploadProps) => {
  const [data, { set }] = useMap({
    title: '',
    content: '',
  });
  const titleChange = (e) => {
    set('title', e.target.value);
    onChange?.(data);
  }
  const contentChange = (e) => {
    set('content', e.target.value);
    onChange?.(data);
  }
  return (
    <div>
      <FormControl className='mb-4'>
        <Input
          type='email'
          placeholder='Title'
          value={data.title}
          onChange={titleChange}
        />
      </FormControl>
      <FormControl>
        <Textarea
          value={data.content}
          onChange={contentChange}
          placeholder='Content'
          size='sm'
        />
      </FormControl>
    </div>
  );
};
