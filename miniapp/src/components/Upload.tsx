import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UploadProps {
  onChange?: (file: File) => void;
}
export const Upload = ({ onChange }: UploadProps) => {
  const { t } = useTranslation();
  const [previewSrc, setPreviewSrc] = useState('https://tinyverse.space/static/media/secure-storage.80ea715b795dd9da0758.png');
  const imageChange = async (e: any) => {
    const image = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setPreviewSrc(reader.result);
      }
    };
    reader.readAsDataURL(image);
    e.target.value = '';
    onChange?.(image);
  };
  return (
    <div className='border border-solid border-gray-300 flex justify-center items-center p-4 rounded-xl w-48 h-48 mx-auto mb-2'>
      <label className='w-full h-full flex flex-col  items-center justify-center text-blue-500'>
        {previewSrc ? (
          <img src={previewSrc} className='w-full h-full' />
        ) : (
          <>
            <Icon icon='mdi:cloud-upload-outline' className='text-6xl' />
            <div className='text-18px'>{t('common.upload.title')}</div>
          </>
        )}

        <input
          type='file'
          onChange={imageChange}
          className='invisible w-0 h-0'
        />
      </label>
    </div>
  );
};
