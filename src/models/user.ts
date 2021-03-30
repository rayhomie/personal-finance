import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import { updateInfo, updateUsername } from '@/service/user';

export interface UserState {}

export interface UserModelType {
  namespace: 'user';
  state: UserState;
  effects: {
    updateInfo: Effect;
    updateUsername: Effect;
  };
  reducers: {
    save: Reducer<UserState>;
  };
}

const user: UserModelType = {
  namespace: 'user',
  state: {},
  effects: {
    *updateInfo({ payload }, { call }) {
      const { success, fail, ...rest } = payload;
      const res = yield call(updateInfo(rest));
      if (res.data.code === 0) {
        success();
      } else {
        fail();
      }
    },
    *updateUsername({ payload }, { call, put }) {
      const { success, fail, ...rest } = payload;
      const res = yield call(updateUsername(rest));
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
