import { ChakraProvider } from '@chakra-ui/react';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';
import {
  WebAppProvider,
  BackButton,
  MainButton,
} from '@vkruglikov/react-telegram-web-app';
function App() {
  return (
    <WebAppProvider
      options={{
        smoothButtonsTransition: true,
      }}>
      <BackButton />
      <ChakraProvider>
        <RouterProvider router={router}></RouterProvider>
      </ChakraProvider>
      <MainButton text="test"/>
    </WebAppProvider>
  );
}

export default App;
