import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import {
  getClockList,
  clock,
  getContinueCount,
  getIsClock,
} from '@/service/clock';
import { getBillList } from '@/service/bill';

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
  billList: any[];
  billTotal: number;
  isClock: number;
}

export interface MineModelType {
  namespace: 'mine';
  state: MineState;
  effects: {
    getClockList: Effect;
    clock: Effect;
    getContinueCount: Effect;
    getBillList: Effect;
    getIsClock: Effect;
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
    billList: [],
    billTotal: 0,
    isClock: 0,
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
        yield put({
          type: 'save',
          payload: { clockList: [], clockTotal: 0 },
        });
        fail();
      }
    },
    *clock({ payload }, { call, put }) {
      const { success, fail, fail401, ...rest } = payload;
      const res = yield call(clock(rest));
      console.log(res);
      if (res.data.code === 0) {
        yield put({
          type: 'getContinueCount',
          payload: { success: () => {}, fail: () => {} },
        });
        yield put({ type: 'save', payload: { isClock: res.data.isClock } });
        success();
      } else if (res.data.code === 401) {
        fail401();
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
          payload: {
            clockContinueCount: res.data.continue_count,
            clockTotal: res.data.total,
          },
        });
        success();
      } else {
        yield put({
          type: 'save',
          payload: { clockContinueCount: 0, clockTotal: 0 },
        });
        fail();
      }
    },
    *getBillList({ payload }, { call, put }) {
      const { success, fail } = payload;
      const res = yield call(getBillList());
      if (res.data.code === 0) {
        yield put({
          type: 'save',
          payload: { billList: res.data.docs, billTotal: res.data.total },
        });
        success();
      } else {
        yield put({
          type: 'save',
          payload: { billList: [], billTotal: 0 },
        });
        fail();
      }
    },
    *getIsClock({ payload }, { call, put }) {
      const { success, fail } = payload;
      const res = yield call(getIsClock());
      if (res.data.code === 0) {
        yield put({
          type: 'save',
          payload: { isClock: res.data.isClock },
        });
        success();
      } else {
        yield put({
          type: 'save',
          payload: { isClock: 0 },
        });
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
