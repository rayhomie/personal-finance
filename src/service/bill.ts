import request from '@/utils/request';

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
