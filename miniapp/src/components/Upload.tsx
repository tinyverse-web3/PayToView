import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { file2array } from '@/lib/utils';
interface UploadProps {
  onChange?: (file: File) => void;
}
export const Upload = ({ onChange }: UploadProps) => {
  const { t } = useTranslation();
  const [previewSrc, setPreviewSrc] = useState('');
  const imageChange = async (e: any) => {
    const image = e.target.files[0];
    console.log(image);
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setPreviewSrc(reader.result);
      }
    };
    reader.readAsDataURL(image);
    const res = file2array(image);
    e.target.value = '';
    onChange?.(image);
  };
  return (
    <div className='flex justify-center items-center  w-40 h-40 mx-auto max-w-full'>
      <label className='w-full h-full flex flex-col  items-center justify-center text-blue-500'>
        {previewSrc ? (
          <img src={previewSrc} className='w-full h-full' />
        ) : (
          <div className='p-4 border border-solid border-gray-300 rounded-xl w-full h-full flex justify-center items-center'>
            <div>
              <img src='/images/upload.png' className='w-16 h-12 mb-2' />
              <div className='text-18px text-center'>
                {t('common.upload.title')}
              </div>
            </div>
          </div>
        )}

        <input
          type='file'
          accept='image/*'
          onChange={imageChange}
          className='invisible w-0 h-0'
        />
      </label>
    </div>
  );
};
