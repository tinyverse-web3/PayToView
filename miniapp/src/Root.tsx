import { Outlet, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';

export default function Root() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [searchParams] = useSearchParams();
  const user = searchParams.get('user');
  const webApp = useWebApp();

  const getUserId = async () => {
    if (!window.Telegram) {
      return undefined;
    } else {
      const webAppUserId =  webApp?.initDataUnsafe?.user?.id;
      return webAppUserId || user;
    }
  }
  const check = () => {
    setLoading(true);
    const userId = getUserId();
    if (!userId) {
      setError(true);
    } 

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };
  useEffect(() => {
    check();
  }, []);
  return (
    <main className='h-full'>
      {loading ? (
        <div className='w-screen h-screen flex justify-center items-center'>
          {' '}
          <Spinner color='blue.500' size='lg' />
        </div>
      ) : (
        <Outlet />
      )}
    </main>
  );
}
