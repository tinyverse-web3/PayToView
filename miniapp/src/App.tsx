import { ChakraProvider } from '@chakra-ui/react';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';
import { Toaster } from 'react-hot-toast';
import { THEME, TonConnectUIProvider, TonConnect } from "@tonconnect/ui-react";

function App() {
  return (
    <TonConnectUIProvider
      manifestUrl="https://tinyverse-web3.github.io/paytoview/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.LIGHT }}
      actionsConfiguration={{
        // twaReturnUrl: 'https://t.me/tc_twa_test_bot'
      }}
    >
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
    </TonConnectUIProvider>
  );
}

export default App;
