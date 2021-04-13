import request from '@/utils/request';
import qs from 'qs';

// 只能插入自定义分类
export const insert = (payload: {
  id?: string;
  icon_l: string;
  icon_n: string;
  icon_s: string;
  is_income: number;
  is_system: number;
  name: string;
}) => () =>
  request({
    url: '/bill_category/insert',
    method: 'POST',
    data: payload,
  });

// 获取所有分类列表
export const getList = (payload: {
  is_system?: number;
  limit?: number;
  skip?: number;
}) => () =>
  request({
    url: `/bill_category/list?${qs.stringify(payload)}`,
    method: 'GET',
  });

// 可以通过id查询系统内置分类的_id
export const getSystemCategory = (payload: { id: string }) => () =>
  request({
    url: `/bill_category/getSystemCategory?${qs.stringify(payload)}`,
    method: 'GET',
  });

// 只能更新自定义分类
export const update = (payload: {
  query_id?: string;
  query_name?: string;
  name?: string;
  is_income?: number;
  icon_n?: string;
  icon_l?: string;
  icon_s?: string;
}) => () =>
  request({
    url: '/bill_category/update',
    method: 'POST',
    data: payload,
  });

// 只能删除自定义分类
export const Delete = (payload: { id?: string; name?: string }) => () =>
  request({
    url: '/bill_category/delete',
    method: 'POST',
    data: payload,
  });
