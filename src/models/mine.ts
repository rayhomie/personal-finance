import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import { getClockList, clock, getContinueCount } from '@/service/clock';
import { PushNotificationIOS } from 'react-native';

type ClockListType = {
  _id?: string;
  user_id?: string;
  date?: string;
  clock_date?: number;
};
export interface MineState {
  clockList: ClockListType[];
  clockTotal: number;
  clockContinueCount: number;
}

export interface MineModelType {
  namespace: 'mine';
  state: MineState;
  effects: {
    getClockList: Effect;
    clock: Effect;
    getContinueCount: Effect;
  };
  reducers: {
    save: Reducer<MineState>;
  };
}

const mine: MineModelType = {
  namespace: 'mine',
  state: {
    clockList: [],
    clockTotal: 0,
    clockContinueCount: 0,
  },
  effects: {
    *getClockList({ payload }, { call, put }) {
      const { success, fail } = payload;
      const res = yield call(getClockList());
      if (res.data.code === 0) {
        yield put({
          type: 'save',
          payload: { clockList: res.data.docs, clockTotal: res.data.total },
        });
        success();
      } else {
        fail();
      }
    },
    *clock({ payload }, { call, put }) {
      const { success, fail, ...rest } = payload;
      const res = yield call(clock(rest));
      if (res.data.code === 0) {
        yield put({
          type: 'getClockList',
          payload: { success: () => {}, fail: () => {} },
        });
        yield put({
          type: 'getContinueCount',
          payload: { success: () => {}, fail: () => {} },
        });
        success();
      } else {
        fail();
      }
    },
    *getContinueCount({ payload }, { call, put }) {
      const { success, fail } = payload;
      const res = yield call(getContinueCount());
      if (res.data.code === 0) {
        yield put({
          type: 'save',
          payload: { clockContinueCount: res.data.continue_count },
        });
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

export default mine;
