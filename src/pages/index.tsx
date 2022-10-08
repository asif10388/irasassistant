import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useStore } from '../store';

const Redirect: NextPage = () => {
  const { getToken } = useStore((state: any) => state.auth());

  useEffect(() => {
    if (getToken()) {
      window.location.href = '/dashboard';
    }
    window.location.href = '/auth';
  }, [getToken]);

  return null;
};

export default Redirect;
