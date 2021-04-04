import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import { getList, Delete, insert, update } from '@/service/bill_category';

type noSystemItemType = {
  is_income: number;
  is_system: number;
  _id: string;
  icon_n: string;
  icon_l: string;
  icon_s: string;
  name: string;
  user_id: string;
  id: string;
};
export interface RecordState {
  noSystemList: noSystemItemType[];
  addSuccess: number; //控制刷新列表
}

export interface RecordModelType {
  namespace: 'record';
  state: RecordState;
  effects: {
    getNoSystem: Effect;
    delCategory: Effect;
    insertCategory: Effect;
    updateCategory: Effect;
  };
  reducers: {
    save: Reducer<RecordState>;
  };
}

const record: RecordModelType = {
  namespace: 'record',
  state: { noSystemList: [], addSuccess: Math.random() * 100000 },
  effects: {
    *getNoSystem({ payload }, { call, put }) {
      const res = yield call(getList({ ...payload, is_system: 0 }));
      if (res.data.code === 0) {
        yield put({
          type: 'save',
          payload: {
            noSystemList: res.data.docs,
          },
        });
      }
    },
    *delCategory({ payload }, { call }) {
      const { success, fail, ...rest } = payload;
      const res = yield call(Delete(rest));
      if (res.data.code === 0) {
        success();
      } else {
        fail();
      }
    },
    *insertCategory({ payload }, { call, put }) {
      const { success, fail, ...rest } = payload;
      const res = yield call(insert(rest));
      if (res.data.code === 0) {
        yield put({
          type: 'save',
          payload: { addSuccess: Math.random() * 100000 },
        });
        success();
      } else {
        fail();
      }
    },
    *updateCategory({ payload }, { call, put }) {
      const { success, fail, ...rest } = payload;
      const res = yield call(update(rest));
      if (res.data.code === 0) {
        yield put({
          type: 'save',
          payload: { addSuccess: Math.random() * 100000 },
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

export default record;
