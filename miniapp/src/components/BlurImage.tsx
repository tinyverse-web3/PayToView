import { useEffect, useState } from 'react';
interface BlurImageProps {
  file: File;
  onChange?: (file: File) => void;
}
export const BlurImage = ({ file, onChange }: BlurImageProps) => {
  const [preview, setPreview] = useState<string>('');
  const blurHandler = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d') as any;
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          // 对图像进行模糊处理
          ctx.filter = 'blur(48px)'; // 5px 模糊半径，可以根据需要调整
          ctx.drawImage(canvas, 0, 0, img.width, img.height);
          ctx.filter = 'none';
          const src = canvas.toDataURL('image/jpeg');
          setPreview(src);
          canvas.toBlob((blob) => {
            if (!blob) return;
            const newFile = new File([blob], 'blurred_image.jpg', {
              type: 'image/jpeg',
            });
            onChange?.(newFile);
          });
        };

        img.src = e.target.result;
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
