import react, { useState, useRef } from 'react';
import { Spinner } from '@nextui-org/react';

import ReactPullToRefresh, {
  ReactPullToRefreshProps,
} from 'react-pull-to-refresh';

interface Props {
  onLoad?: () => Promise<void>;
  onRefresh?: () => Promise<void>;
  className?: string;
  children?: react.ReactNode;
}
export const RefreshLoad = ({
  onLoad,
  onRefresh,
  className,
  children,
  ...refresh
}: Props) => {
  const containerRef = useRef<any>();
  const [loadLoading, setLoadLoading] = useState(false);
  const [distance, setDistance] = useState(0);
  const refreshHandler = async () => {
    console.log(onRefresh);
    await onRefresh?.();
  };
  const loadHandler = async () => {
    if (loadLoading) return;
    setLoadLoading(true);
    try {
      console.log('load');
      await onLoad?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadLoading(false);
    }
  };
  const onScroll = async () => {
    const { scrollTop, scrollHeight, offsetHeight } = containerRef.current;
    if (scrollTop >= scrollHeight - offsetHeight - 30) {
      await loadHandler();
    }
  };
  return (
    <div
      className='h-full overflow-y-auto'
      onScroll={onScroll}
      ref={containerRef}>
      <ReactPullToRefresh
        {...refresh}
        onRefresh={refreshHandler}
        className='h-full'>
        {children}
        {loadLoading && (
          <div className='flex h-12 justify-center items-center'>
            <Spinner />
          </div>
        )}
      </ReactPullToRefresh>
    </div>
  );
};
