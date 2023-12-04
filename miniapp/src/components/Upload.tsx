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
  const fileChange = async (e: any) => {
    const file = e.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        if (file.type.indexOf('image') > -1) {
          setPreviewSrc(reader.result);
        } else {
          setPreviewSrc('/icon-txt.png');
        }
      }
    };
    reader.readAsDataURL(file);
    const res = file2array(file);
    e.target.value = '';
    onChange?.(file);
  };
  return (
    <div className='flex justify-center items-center  w-40 h-40 mx-auto max-w-full'>
      <label className='w-full h-full flex flex-col  items-center justify-center text-[#1296db]'>
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
          onChange={fileChange}
          className='invisible w-0 h-0'
        />
      </label>
    </div>
  );
};
