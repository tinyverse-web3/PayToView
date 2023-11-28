import { useEffect, useState } from 'react';
import * as StackBlur from 'stackblur-canvas';
interface BlurImageProps {
  file: File;
  onChange?: (file: File) => void;
}
export const BlurImage = ({ file, onChange }: BlurImageProps) => {
  const [preview, setPreview] = useState<string>('');
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
    });
    return canvas.toDataURL();
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
    <div className='flex justify-center items-center'>
      <img src={preview} alt='' className='w-48 h-48' />
    </div>
  );
};
