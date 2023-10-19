import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';

export default function Root() {
  const [loading, setLoading] = useState(true);

  const check = () => {
    setLoading(true);
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
