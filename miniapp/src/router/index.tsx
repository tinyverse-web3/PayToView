import { createHashRouter, RouteObject } from 'react-router-dom';
import Root from '@/Root';
import Index from '@/pages';
import Publish from '@/pages/publish';
import DetailEdit from '@/pages/detail/edit';
import DetailIndex from '@/pages/detail';
import DetailView from '@/pages/detail/view';
import DetailForward from '@/pages/detail/forward';
import Published from '@/pages/published';
import Paid from '@/pages/paid';
import Forwarded from '@/pages/forwarded';
import Earn from '@/pages/earn';
import Topup from '@/pages/topup';

const resolveHashPath = (path: string) => {
  return `/#${path}`;
};

export const ROUTE_PATH = {
  INDEX: '/',
  PUBLISH: '/publish',
  DETAIL_EDIT: '/detail/edit',
  DETAIL: '/detail',
  DETAIL_FORWARD: '/detail/forward',
  DETAIL_VIEW: '/detail/view',
  PUBLISHED: '/published',
  PAID: '/paid',
  FORWARDED: '/forwarded',
  EARN: '/earn',
  TOPUP: '/topup',
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
        path: ROUTE_PATH.PUBLISH,
        element: <Publish />,
      },
      {
        path: ROUTE_PATH.DETAIL_EDIT,
        element: <DetailEdit />,
      },
      {
        path: ROUTE_PATH.DETAIL,
        element: <DetailIndex />,
      },
      {
        path: ROUTE_PATH.DETAIL_VIEW,
        element: <DetailView />,
      },
      {
        path: ROUTE_PATH.DETAIL_FORWARD,
        element: <DetailForward />,
      },
      {
        path: ROUTE_PATH.PUBLISHED,
        element: <Published />,
      },
      {
        path: ROUTE_PATH.PAID,
        element: <Paid />,
      },
      {
        path: ROUTE_PATH.FORWARDED,
        element: <Forwarded />,
      },
      {
        path: ROUTE_PATH.EARN,
        element: <Earn />,
      },
      {
        path: ROUTE_PATH.TOPUP,
        element: <Topup />,
      },
    ],
  },
];
export const router = createHashRouter(routes);
