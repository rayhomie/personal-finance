import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import { login as fetchLogin, verifyToken, register } from '@/service/app';
import AsyncStorage from '@react-native-community/async-storage';

export interface AppState {
  isLogin: boolean;
  isRegister: boolean;
  openLogin: boolean;
}

export interface AppModelType {
  namespace: 'app';
  state: AppState;
  effects: {
    login: Effect;
    verifyToken: Effect;
    register: Effect;
    loginOut: Effect;
  };
  reducers: {
    save: Reducer<AppState>;
  };
}

const app: AppModelType = {
  namespace: 'app',
  state: {
    isLogin: false,
    isRegister: false,
    openLogin: false,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const { success, fail, ...rest } = payload;
      const res = yield call(fetchLogin(rest));
      if (res.data.code === 0) {
        yield console.log('000');
        yield put({
          type: 'save',
          payload: { isLogin: true },
        });
        yield console.log('111');
        yield AsyncStorage.setItem('token', res.data.data.token, () => {
          console.log('注入token成功');
          success();
        });
        yield console.log('222');
      } else {
        yield put({
          type: 'save',
          payload: { isLogin: false },
        });
        fail();
      }
      yield console.log('登录', res);
    },
    *register({ payload }, { call, put }) {
      const { success, fail, ...rest } = payload;
      const res = yield call(register(rest));
      console.log(res);
      if (res.data.code === 0) {
        yield put({ type: 'save', payload: { isRegister: true } });
        success();
      } else {
        yield put({ type: 'save', payload: { isRegister: false } });
        fail();
      }
    },
    *loginOut({ payload }, { put }) {
      const { callback } = payload;
      yield AsyncStorage.setItem('token', '', () => {
        console.log('删除token成功');
        callback();
      });
      yield put({
        type: 'save',
        payload: { isLogin: false },
      });
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
      return { ...state, ...payload };
    },
  },
};

export default app;
