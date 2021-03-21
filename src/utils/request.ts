import axios from 'axios';
import { AsyncStorage } from 'react-native';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: '*/*',
    Connection: 'keep-alive',
  },
  transformRequest: [
    data => {
      data = JSON.stringify(data);
      return data;
    },
  ],
});

instance.defaults.timeout = 2500;

// http request 拦截器
instance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `Bearer ${token}`; //请求头加上token
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// // http response 拦截器
// instance.interceptors.response.use(
//   response => {
//     //拦截响应，做统一处理
//     if (response.data.code) {
//       // switch (response.data.code) {
//       //   case 401:
//       //     store.state.isLogin = false;
//       //     router.replace({
//       //       path: 'login',
//       //       query: {
//       //         redirect: router.currentRoute.fullPath,
//       //       },
//       //     });
//       // }
//     }
//     return response;
//   },
//   //接口错误状态处理，也就是说无响应时的处理
//   error => {
//     return Promise.reject(error.response.status); // 返回接口返回的错误信息
//   }
// );

export default instance;
