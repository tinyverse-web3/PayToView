import { useEffect, useState } from 'react';
import * as StackBlur from 'stackblur-canvas';
import { useTranslation } from 'react-i18next';
interface BlurImageProps {
  file: File | null;
  onChange?: (file: File) => void;
}
export const BlurImage = ({ file, onChange }: BlurImageProps) => {
  const [preview, setPreview] = useState<string>('');
  const { t } = useTranslation();
  const blurImage = (image, radius) => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    console.log(image.width, image.height);
    const context = canvas.getContext('2d') as any;
    context.drawImage(image, 0, 0, image.width, image.height);

    StackBlur.image(image, canvas, radius, false);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const newFile = new File([blob], 'blurred_image.jpg', {
        type: 'image/jpeg',
      });
      onChange?.(newFile);
    }, 'image/jpeg', 0.1);
    return canvas.toDataURL('image/jpeg', 0.1);
  };
  const blurHandler = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.onload = () => {
          const blurredImage = blurImage(image, 120);
          // 使用模糊后的图像
          setPreview(blurredImage);
        };
        image.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    blurHandler();
  }, [file]);
  return (
    <div className='flex justify-center items-center w-40 h-40 mx-auto max-w-full'>
      <div className='w-full h-full flex flex-col  items-center justify-center text-[#1296db]'>
        {preview ? (
          <img src={preview} className='w-full h-full' />
        ) : (
          <div className='p-4 border border-solid border-gray-300 rounded-xl w-full h-full flex justify-center items-center'>
            <div>
              <img src='/images/preview.png' className='w-12 h-12 mb-2' />
              <div className='text-18px text-center'>
                {t('common.upload.blur')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
