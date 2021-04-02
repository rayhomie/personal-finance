import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import { getList } from '@/service/bill_category';

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
}

export interface RecordModelType {
  namespace: 'record';
  state: RecordState;
  effects: {
    getNoSystem: Effect;
  };
  reducers: {
    save: Reducer<RecordState>;
  };
}

const record: RecordModelType = {
  namespace: 'record',
  state: { noSystemList: [] },
  effects: {
    *getNoSystem({ payload }, { call, put }) {
      const res = yield call(getList({ ...payload, is_system: 0 }));
      console.log(res);
      if (res.data.code === 0) {
        yield put({
          type: 'save',
          payload: {
            noSystemList: res.data.docs,
          },
        });
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
