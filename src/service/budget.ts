import request from '@/utils/request';

export const getCurBudget = () =>
  request({
    url: '/budget/current',
    method: 'GET',
  });

export const addCurBudget = (payload: { budget_value: string }) =>
  request({
    url: '/budget/add',
    method: 'POST',
    data: payload,
  });

export const deleteCurBudget = () =>
  request({
    url: '/budget/delete',
    method: 'POST',
  });
