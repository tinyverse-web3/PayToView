import { Outlet, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { useWebApp, useCloudStorage } from '@vkruglikov/react-telegram-web-app';
import TvsWasm from '@/lib/tvs';
export default function Root() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [searchParams] = useSearchParams();
  const user = searchParams.get('user');
  const webApp = useWebApp();
  const cloudstorage = useCloudStorage();
  const getUserId = async () => {
    if (!window.Telegram) {
      return undefined;
    } else {
      const webAppUserId = webApp?.initDataUnsafe?.user?.id;
      return webAppUserId || user;
    }
  };
  const check = async () => {
    if (!window.Telegram) {
      setError(true);
      return;
    }
    const userId = getUserId();
    setLoading(true);
    const tvs = new TvsWasm();
    console.log(tvs);
    await tvs.initWasm();

    if (!userId) {
      setError(true);
    } else {
      // const tSssData = (await cloudstorage.getItem(`user_${userId}_sss`)) || '';
      const result = await globalThis.createAccount(
        JSON.stringify({ telegramID: '123456', sssData: '' }),
      );
      if (result.code === '000000') {
        setError(false);
      }
      console.log(result);
    }
    console.log(123);
    setLoading(false);
  };
  useEffect(() => {
    // check();
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
