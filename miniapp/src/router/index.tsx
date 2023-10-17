import { createHashRouter, RouteObject } from 'react-router-dom';
import Root from '@/Root.tsx';
import Index from '@/pages/Index.tsx';

const resolveHashPath = (path: string) => {
  return `/#${path}`;
};

export const ROUTE_PATH = {
  INDEX: '/',
};
const hashPath: any = {};
Object.keys(ROUTE_PATH).forEach((k: any) => {
  hashPath[k] = resolveHashPath((ROUTE_PATH as any)[k]);
});

export const ROUTE_HASH_PATH: typeof ROUTE_PATH = hashPath;

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    // errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTE_PATH.INDEX,
        element: <Index />,
      },
    ],
  },
];
export const router = createHashRouter(routes);
