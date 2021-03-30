import request from '@/utils/request';

// 获取用户信息
export const userinfo = () => {
  return () =>
    request({
      url: '/user/info',
      method: 'GET',
    });
};

// 修改username、password之外的信息
export const updateInfo = (payload: {
  avatar_url?: string;
  gender?: number;
  mobile_number?: string;
}) => {
  return () =>
    request({
      url: '/user/updateInfo',
      method: 'POST',
      data: payload,
    });
};

// 修改username
export const updateUsername = (payload: { username: string }) => {
  return () =>
    request({
      url: '/user/username',
      method: 'POST',
      data: payload,
    });
};

// 修改password
export const updatePassword = (payload: { password: string }) => {
  return () =>
    request({
      url: '/user/pwd',
      method: 'POST',
      data: payload,
    });
};
