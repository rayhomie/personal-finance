import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import {
  userinfo,
  updateInfo,
  updateUsername,
  updatePassword,
} from '@/service/user';

export interface UserState {
  avatar_url: string;
  username: string;
  gender: number;
  email: string;
  mobile_number: string;
  _id: string;
}

export interface UserModelType {
  namespace: 'user';
  state: UserState;
  effects: {
    getUserInfo: Effect;
    updateInfo: Effect;
    updateUsername: Effect;
    updatePassword: Effect;
  };
  reducers: {
    save: Reducer<UserState>;
  };
}

const user: UserModelType = {
  namespace: 'user',
  state: {
    avatar_url:
      'https://lh3.googleusercontent.com/a-/AOh14GjMcc-Wd3Sc1H7rd2VmWfhPHxucsvaxbuCb-2tb=s96-c-rg-br100',
    username: '已注销',
    gender: 1,
    email: '',
    mobile_number: '',
    _id: '',
  },
  effects: {
    *getUserInfo({ payload }, { call, put }) {
      const { success, fail } = payload;
      const res = yield call(userinfo());
      if (res.data.code === 0) {
        const { avatar_url, ...rest } = res.data.docs;
        yield put({
          type: 'save',
          payload: { ...(avatar_url ? { avatar_url } : {}), ...rest },
        });
        success();
      } else {
        fail();
      }
    },
    *updateInfo({ payload }, { call }) {
      const { success, fail, ...rest } = payload;
      const res = yield call(updateInfo(rest));
      if (res.data.code === 0) {
        success();
      } else {
        fail();
      }
    },
    *updateUsername({ payload }, { call }) {
      const { success, fail, ...rest } = payload;
      const res = yield call(updateUsername(rest));
      if (res.data.code === 401) {
        success();
      } else {
        fail();
      }
    },
    *updatePassword({ payload }, { call }) {
      const { success, fail, ...rest } = payload;
      const res = yield call(updatePassword(rest));
      if (res.data.code === 401) {
        success();
      } else {
        fail();
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default user;
