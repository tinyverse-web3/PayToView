import { FormControl, Input, Textarea } from '@chakra-ui/react';
import { useMap } from 'react-use';

export const TextUpload = () => {
  const [data, { set }] = useMap({
    title: '',
    content: '',
  });

  return (
    <div>
      <FormControl className='mb-4'>
        <Input
          type='email'
          placeholder='Title'
          value={data.title}
          onChange={(e) => set('title', e.target.value)}
        />
      </FormControl>
      <FormControl>
        <Textarea
          value={data.content}
          onChange={(e) => set('content', e.target.value)}
          placeholder='Content'
          size='sm'
        />
      </FormControl>
    </div>
  );
};
