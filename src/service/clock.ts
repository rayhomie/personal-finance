import request from '@/utils/request';

export const clockList = () => {
  return () =>
    request({
      url: '/clock/clockList',
      method: 'GET',
    });
};

export const clock = () => {
  return () =>
    request({
      url: '/clock/clock',
      method: 'POST',
    });
};

export const clockList = () => {
  return () =>
    request({
      url: '/clock/clockList',
      method: 'GET',
    });
};
