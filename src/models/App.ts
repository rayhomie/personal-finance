import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import { login as fetchLogin } from '@/service/app';

export interface AppState {
  isLogin: boolean;
}

export interface AppModelType {
  namespace: 'app';
  state: AppState;
  effects: {
    login: Effect;
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
      yield put({
        type: 'save',
        payload: res.data,
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default app;
