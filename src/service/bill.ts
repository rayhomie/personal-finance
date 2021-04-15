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

export const update = (payload: {
  amount: number;
  remark: string;
  id: string;
  category_id: string;
}) => () =>
  request({
    url: '/bill/update',
    method: 'POST',
    data: payload,
  });

export const Delete = (payload: { id: string }) => () =>
  request({
    url: '/bill/delete',
    method: 'POST',
    data: payload,
  });

// 获取月排行
export const getMonthRanked = (payload: {
  startMonth?: string;
  is_income?: 0 | 1;
  sort: 'amount' | 'bill_time';
}) =>
  request({
    url: `/bill/monthRank?${qs.stringify(payload)}`,
    method: 'GET',
  });

export const mineAccount = (payload: { date: string }) =>
  request({
    url: `/bill/mineAccount?${qs.stringify(payload)}`,
    method: 'GET',
  });

export const mineAccountItem = (payload: { date: string }) =>
  request({
    url: `/bill/mineAccountItem?${qs.stringify(payload)}`,
    method: 'GET',
  });
