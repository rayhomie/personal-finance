import request from '@/utils/request';

export const login = (payload: { username: string; password: string }) => {
  return () =>
    request({
      url: '/login',
      method: 'POST',
      data: payload,
    });
};

export const verifyToken = () => {
  return () =>
    request({
      url: '',
      method: 'GET',
    });
};

export const hasUsername = (payload: { username: string }) => {
  return () =>
    request({
      url: '/hasUsername',
      method: 'POST',
      data: payload,
    });
};

export const register = (payload: {
  username: string;
  password: string;
  mobile_number: string;
  email: string;
  gender: string;
  avatar_url: string;
}) => {
  return () =>
    request({
      url: '/register',
      method: 'POST',
      data: payload,
    });
};
