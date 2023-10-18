import { ChakraProvider } from '@chakra-ui/react';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';
import { WebAppProvider, } from '@vkruglikov/react-telegram-web-app';
function App() {
  return (
    <WebAppProvider
      options={{
        smoothButtonsTransition: true,
      }}>
      <ChakraProvider>
        <RouterProvider router={router}></RouterProvider>
      </ChakraProvider>
    </WebAppProvider>
  );
}

export default App;
