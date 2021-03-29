import request from '@/utils/request';

export const userinfo = () => {
  return () =>
    request({
      url: '/user/info',
      method: 'GET',
    });
};
