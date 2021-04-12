import request from '@/utils/request';
import qs from 'qs';

export const getRank = (payload: {
  date: string; //moment字符串
  type: 1 | 2 | 3;
  is_income: 0 | 1;
}) => request({ url: `/chart/rank?${qs.stringify(payload)}`, method: 'GET' });
