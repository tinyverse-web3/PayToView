import { ChakraProvider } from '@chakra-ui/react';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <main className='h-full'>
      <Toaster />
      <WebAppProvider
        options={{
          smoothButtonsTransition: true,
        }}>
        <ChakraProvider>
          <RouterProvider router={router}></RouterProvider>
        </ChakraProvider>
      </WebAppProvider>
    </main>
  );
}

export default App;
