import request from '@/utils/request';

export const login = (payload: { username: string; password: string }) => {
  return request({
    url: '/login',
    method: 'POST',
    data: payload,
  });
};
