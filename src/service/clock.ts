import request from '@/utils/request';

export const getClockList = () => {
  return () =>
    request({
      url: '/clock/clockList',
      method: 'GET',
    });
};

export const clock = (payload: { clock_data: string }) => {
  return () =>
    request({
      url: '/clock/clock',
      method: 'POST',
      data: payload,
    });
};

export const getContinueCount = () => {
  return () =>
    request({
      url: '/clock/continueCount',
      method: 'GET',
    });
};
