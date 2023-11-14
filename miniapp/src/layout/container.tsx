// import { useTheme } from '@nextui-org/react';
import { useEffect } from 'react';
export default function Container({ children }: any) {
  // const { isDark } = useTheme();
  return (
    <div
      className={`sm:border sm:border-gray-300 sm:shadow-xl sm:border-solid sm:rounded-xl sm:w-400px mx-auto h-full sm:h-760px sm:overflow-y-auto`}>
      {children}
    </div>
  );
}
