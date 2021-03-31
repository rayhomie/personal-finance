import request from '@/utils/request';

export const getBillList = () => {
  return () =>
    request({
      url: '/bill/list',
      method: 'GET',
    });
};
