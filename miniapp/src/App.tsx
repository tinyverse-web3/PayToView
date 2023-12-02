import { ChakraProvider } from '@chakra-ui/react';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';
import { Toaster } from 'react-hot-toast';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { THEME, TonConnectUIProvider, TonConnect } from '@tonconnect/ui-react';
import { use } from 'i18next';
import { useEffect } from 'react';

function App() {
  const webApp = useWebApp();
  useEffect(() => {
    if (webApp) {
      webApp.expand();
    }
  }, []);
  return (
    <TonConnectUIProvider
      manifestUrl='https://tinyverse-web3.github.io/paytoview/tonconnect-manifest.json'
      uiPreferences={{ theme: THEME.LIGHT }}
      actionsConfiguration={{
        // twaReturnUrl: 'https://t.me/tvnb_bot', //'https://t.me/tc_twa_test_bot'
      }}>
      <main className='h-full'>
        <Toaster
          containerStyle={{ zIndex: 9999999, wordBreak: 'break-all' }}
          position='top-center'
          reverseOrder={false}
          toastOptions={{
            duration: 2000,
          }}
        />
        <WebAppProvider
          options={{
            smoothButtonsTransition: true,
          }}>
          <ChakraProvider>
            <RouterProvider router={router}></RouterProvider>
          </ChakraProvider>
        </WebAppProvider>
      </main>
    </TonConnectUIProvider>
  );
}

export default App;
