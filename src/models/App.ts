import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import { login as fetchLogin, verifyToken } from '@/service/app';
import AsyncStorage from '@react-native-community/async-storage';

export interface AppState {
  isLogin: boolean;
}

export interface AppModelType {
  namespace: 'app';
  state: AppState;
  effects: {
    login: Effect;
    verifyToken: Effect;
  };
  reducers: {
    save: Reducer<AppState>;
  };
}

const app: AppModelType = {
  namespace: 'app',
  state: {
    isLogin: false,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const res = yield call(fetchLogin(payload));
      if (res.data.code === 0) {
        yield put({
          type: 'save',
          payload: { isLogin: true },
        });
        yield AsyncStorage.setItem('token', res.data.data.token, () => {
          console.log('注入token成功');
        });
      } else {
        yield put({
          type: 'save',
          payload: { isLogin: false },
        });
      }
      yield console.log('登录', res);
    },
    *verifyToken(_, { call, put }) {
      const res = yield call(verifyToken());
      if (res.data.code === 0) {
        yield put({
          type: 'save',
          payload: { isLogin: true },
        });
      } else {
        yield put({
          type: 'save',
          payload: { isLogin: false },
        });
      }
      yield console.log('didmount', res);
    },
  },
  reducers: {
    save(state, { payload }) {
      console.log(payload);
      return { ...state, ...payload };
    },
  },
};

export default app;
