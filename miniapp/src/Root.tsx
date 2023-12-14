import { Outlet, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { useWebApp, useCloudStorage } from '@vkruglikov/react-telegram-web-app';
import TvsWasm from '@/lib/tvsWasm';
import paytoview from '@/lib/paytoview';
import dauth from '@/lib/dauth';
import { generatePassword } from '@/lib/utils';
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
    if (import.meta.env.MODE === 'development') {
      const localId = localStorage.getItem('localId');
      if (localId) {
        return localId;
      } else {
        const newId = generatePassword();
        localStorage.setItem('localId', newId);
        return newId;
      }
    } else {
      const webAppUserId = webApp?.initDataUnsafe?.user?.id;
      return (webAppUserId || user).toString() + '12';
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
  const getSssDataByUserId = async (userId: string) => {
    let tSssData = '';
    const key = `user_${userId}_sss`;
    if (import.meta.env.MODE === 'development') {
      tSssData = localStorage.getItem(key) as any;
    } else {
      tSssData = (await cloudstorage.getItem(key)) || '';
    }
    return tSssData;
  };
  const setSssDataByUserId = async (userId: string, sssData: string) => {
    const key = `user_${userId}_sss`;
    if (import.meta.env.MODE === 'development') {
      await localStorage.setItem(key, sssData);
    } else {
      await cloudstorage.setItem(key, sssData);
    }
  };
  const loadTg = async () => {
    const userId = await getUserId();
    const tSssData = await getSssDataByUserId(userId);
    // const tSssData = localStorage.getItem('tvs') as any;
    if (!tSssData) {
      setCreateStatus(true);
    }
    const tvsWasm = new TvsWasm();
    await tvsWasm.initWasm();
    console.log('initWasm');
    const result = await paytoview.createAccount({
      userID: userId.toString(),
      sssData: tSssData,
    });

    if (result.code === '000000') {
      await setSssDataByUserId(userId, result.data.sssData);
      const profile = await paytoview.getProfile();
      console.log(profile);
      setAccount({
        publicKey: profile.data.publickey,
        messageKey: profile.data.messagekey,
        address: profile.data.walletkey,
      });
      setBalance(profile.data.balance);
      setError(false);
    } else {
      throw new Error('createAccount error');
    }
  };
  const check = async () => {
    // if (!window.Telegram) {
    //   setError(true);
    //   return;
    // }
    setLoading(true);
    await loadTg();
    setLoading(false);
  };
  useEffect(() => {
    check();
  }, []);
  return (
    <div className='h-full'>
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
