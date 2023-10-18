import { createHashRouter, RouteObject } from 'react-router-dom';
import Root from '@/Root';
import Index from '@/pages';
import DetailAdd from '@/pages/detail/add';
import DetailEdit from '@/pages/detail/edit';

const resolveHashPath = (path: string) => {
  return `/#${path}`;
};

export const ROUTE_PATH = {
  INDEX: '/',
  DETAIL_ADD: '/add',
  DETAIL_EDIT: '/edit',
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
      {
        path: ROUTE_PATH.DETAIL_ADD,
        element: <DetailAdd />,
      },
      {
        path: ROUTE_PATH.DETAIL_EDIT,
        element: <DetailEdit />,
      },
    ],
  },
];
export const router = createHashRouter(routes);
