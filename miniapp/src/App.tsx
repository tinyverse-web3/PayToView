import { ChakraProvider } from '@chakra-ui/react';
import { router } from '@/router';
import { RouterProvider } from 'react-router-dom';
import {
  WebAppProvider,
  BackButton,
  MainButton,
  useShowPopup,
} from '@vkruglikov/react-telegram-web-app';
function App() {
  const showPopup = useShowPopup();

  return (
    <WebAppProvider
      options={{
        smoothButtonsTransition: true,
      }}>
      <BackButton
        onClick={() => {
          showPopup({
            message: 'back button click',
          });
        }}
      />
      <div>123</div>
      {/* <ChakraProvider>
        <RouterProvider router={router}></RouterProvider>
      </ChakraProvider>
      // <MainButton text="test"/> */}
    </WebAppProvider>
  );
}

export default App;
