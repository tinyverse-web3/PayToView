import { useNavigate } from 'react-router-dom';
import { SpinLoading } from '@/components/SpinLoading';
import { Icon } from '@iconify/react';
import { RefreshLoad } from '@/components/RefreshLoad';

export default function Page({
  children,
  path,
  title,
  onRefresh,
  onLoad,
  refreshable = false,
  showBack = true,
  className = '',
  showLogo = true,
  loading = false,
  rightContent,
}: any) {
  const nav = useNavigate();
  const goBack = () => {
    nav(path || -1);
  };
  return (
    <main className='h-full relative'>
      <header className='h-12 absolute top-0 left-0 w-full border-b border-b-solid border-b-gray-200 px-2 flex justify-between items-center z-[99999] bg-white'>
        <div className='w-10 min-w-[2.5rem]'>
          <div className='px-3 text-5' onClick={goBack}>
            <Icon icon='mdi:arrow-left' className=' w-6 h-6 z-2' />
          </div>
        </div>
        <div className='overflow-hidden flex-1 flex justify-center items-center font-600 '>
          <div className='truncate w-2/3 text-center'>{title}</div>
        </div>
        <div className='w-10 text-base min-w-[2.5rem]'>
          {rightContent && rightContent}
        </div>
      </header>
      <section className='pt-12 h-full overflow-y-auto relative'>
        {refreshable ? (
          <RefreshLoad onLoad={onLoad} onRefresh={onRefresh}>
            {children}
          </RefreshLoad>
        ) : (
          children
        )}
        {/* {loading && (
          <SpinLoading className='absolute top-1/2 left-1/2 -translate-1/2  z-99999' />
        )} */}
      </section>
    </main>
  );
}
