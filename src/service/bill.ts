import request from '@/utils/request';
import qs from 'qs';

export const getBillList = () => () =>
  request({
    url: '/bill/list',
    method: 'GET',
  });

export const add = (payload: {
  category_id: string;
  amount: number;
  remark: string;
}) => () =>
  request({
    url: '/bill/add',
    method: 'POST',
    data: payload,
  });

// 获取当月总收支
export const getCurMonthTotal = (payload: { startMonth: string }) => () =>
  request({ url: `/bill/billboard?${qs.stringify(payload)}`, method: 'GET' });

//获取当月分类账单列表
export const getClassifyList = (payload: { startMonth: string }) => () =>
  request({
    url: `/bill/classifyList?${qs.stringify(payload)}`,
    method: 'GET',
  });
