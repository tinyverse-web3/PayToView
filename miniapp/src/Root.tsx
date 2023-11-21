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
  const { getLocalAccountInfo, setAccount, setBalance } = useAccountStore(
    (state) => state,
  );
  const [searchParams] = useSearchParams();
  const user = searchParams.get('user');
  const webApp = useWebApp();
  const cloudstorage = useCloudStorage();
  const getUserId = async () => {
    console.log(import.meta.env.MODE);
    if (import.meta.env.MODE === 'development') {
      return 'sksskskss';
    } else {
      const webAppUserId = webApp?.initDataUnsafe?.user?.id;
      return webAppUserId || user;
    }
  };
  const loadApp = async () => {
    const localAccountResult = await dauth.account.hasLocalAccount();
    const hasPasswordResult = await dauth.account.hasPassword();
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
  };
  const loadTg = async () => {
    const userId = await getUserId();
    const tSssData = localStorage.getItem('tvs') as any;
    if (!tSssData) {
      setCreateStatus(true);
    }
    const tvsWasm = new TvsWasm();
    await tvsWasm.initWasm();
    const result = await paytoview.createAccount({
      userID: userId.toString() + '2',
      sssData: tSssData,
    });
    // const tSssData = (await cloudstorage.getItem(`user_${userId}_sss`)) || '';
    if (result.code === '000000') {
      localStorage.setItem('tvs', result.data.sssData);

      const profile = await paytoview.getProfile();
      console.log(profile);
      setAccount({
        publicKey: profile.data.publickey,
        messageKey: profile.data.messagekey,
        address: profile.data.walletkey,
      });
      setBalance(profile.data.balance);
      setError(false);
    }
  };
  const check = async () => {
    if (!window.Telegram) {
      setError(true);
      return;
    }
    setLoading(true);
    await loadTg();
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
