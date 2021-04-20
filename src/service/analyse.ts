import request from '@/utils/request';
import qs from 'qs';

export const pay_income = (payload: {
  date: string;
  type: 'all' | 'cur' | 'income' | 'pay';
}) =>
  request({
    url: `/analyse/pay&income?${qs.stringify(payload)}`,
    method: 'GET',
  });
