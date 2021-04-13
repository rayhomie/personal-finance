import request from '@/utils/request';
import qs from 'qs';

export const getRank = (payload: {
  date: string; //moment字符串
  type: 1 | 2 | 3;
  is_income: 0 | 1;
}) => request({ url: `/chart/rank?${qs.stringify(payload)}`, method: 'GET' });

export const getRankItem = (payload: {
  date: string; //moment字符串
  type: 1 | 2 | 3;
  category_id: string;
  sort: 'amount' | 'bill_time';
}) =>
  request({
    url: `/chart/rankItem?${qs.stringify(payload)}`,
    method: 'GET',
  });
