import { Outlet, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { useWebApp, useCloudStorage } from '@vkruglikov/react-telegram-web-app';

import TvsWasm from '@/lib/tvsWasm';
import paytoview from '@/lib/paytoview';
import dauth from '@/lib/dauth';
import { useAccountStore } from './store';
export default function Root() {
  const [loading, setLoading] = useState(false);
  const [createStatus, setCreateStatus] = useState(false);
  const [error, setError] = useState(false);
  const { getLocalAccountInfo } = useAccountStore((state) => state);
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

    if (!userId) {
      setError(true);
    } else {
      setLoading(true);

      const localAccountResult = await dauth.account.hasLocalAccount();
      const hasPasswordResult = await dauth.account.hasPassword();
      // if (localAccountResult.data && hasPasswordResult.data) {
      //   const ulockResult = await dauth.account.unlock('123456');
      //   console.log(ulockResult);
      if (localAccountResult.data && !hasPasswordResult.data) {
        const _href = location.href;
        console.log('location.href', _href);
        location.replace(
          `${import.meta.env.VITE_TINY_APP_URL}?redirect=${encodeURIComponent(
            _href,
          )}`,
        );
      } else {
        await getLocalAccountInfo();
      }
      // }
      // console.log(hasPasswordResult);
      // if (localAccountResult.code === '000000') {

      // }
      // console.log(localAccountResult);
      // const result = await dauth.account.createMasterAccount();
      // console.log(result);
      // if (result.code === '000000') {
      //   getLocalAccountInfo();
      // }
      // const tSssData = localStorage.getItem('tvs');
      // if (!tSssData) {
      //   setCreateStatus(true);
      // }
      // const tvsWasm = new TvsWasm();
      // await tvsWasm.initWasm();
      // const result = await paytoview.createAccount({
      //   userID: 'sdfafsafdsaf',
      //   sssData: tSssData,
      // });
      // const tSssData = (await cloudstorage.getItem(`user_${userId}_sss`)) || '';

      // if (result.code === '000000') {
      //   localStorage.setItem('tvs', result.data.sssData);
      //   setAccount({
      //     publicKey: result.data.publicKey,
      //   });
      //   setError(false);
      // }
      // console.log(result);
    }
    setLoading(false);
  };
  useEffect(() => {
    check();
  }, []);
  return (
    <div className='h-full'>
      {/* <Toaster
        containerStyle={{ zIndex: 9999999, wordBreak: 'break-all' }}
        position='top-center'
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
        }}
      /> */}
      {loading ? (
        <div className='w-screen h-screen flex justify-center items-center'>
          {' '}
          <div className='text-center'>
            <Spinner color='blue.500' size='lg' />
            {createStatus && (
              <div className='text-sm text-blue-700 mt-2'>账号创建中</div>
            )}
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
