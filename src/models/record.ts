import { Reducer } from 'redux';
import { Effect } from '@/models/connect';
import {
  getList,
  Delete,
  insert,
  update,
  getSystemCategory,
} from '@/service/bill_category';
import {
  add as addBill,
  getCurMonthTotal,
  getClassifyList,
} from '@/service//bill';

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

type ClassifyListType = {
  date: number;
  expend: number;
  income: number;
  item: any[];
};
export interface RecordState {
  noSystemList: noSystemItemType[];
  addSuccess: number; //控制刷新列表
  querySystemCategory: any;
  incomeTotal: number;
  payTotal: number;
  classifyList: ClassifyListType[];
}

export interface RecordModelType {
  namespace: 'record';
  state: RecordState;
  effects: {
    getNoSystem: Effect;
    delCategory: Effect;
    insertCategory: Effect;
    updateCategory: Effect;
    getSystemCategory: Effect;
    addBill: Effect;
    getCurMonthTotal: Effect;
    getClassifyList: Effect;
  };
  reducers: {
    save: Reducer<RecordState>;
  };
}

const record: RecordModelType = {
  namespace: 'record',
  state: {
    noSystemList: [],
    addSuccess: Math.random() * 100000,
    querySystemCategory: {},
    incomeTotal: 0,
    payTotal: 0,
    classifyList: [],
  },
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
    *getSystemCategory({ payload }, { call, put }) {
      const { success, fail, ...rest } = payload;
      const res = yield call(getSystemCategory(rest));
      console.log(res);
      if (res.data.code === 0) {
        yield put({
          type: 'save',
          payload: { querySystemCategory: res.data.docs },
        });
        success();
      } else {
        fail();
      }
    },
    *addBill({ payload }, { call }) {
      const { success, fail, ...rest } = payload;
      const res = yield call(addBill(rest));
      if (res.data.code === 0) {
        success();
      } else {
        fail();
      }
    },
    *getCurMonthTotal({ payload }, { call, put }) {
      const res = yield call(getCurMonthTotal(payload));
      console.log(res);
      if (res.data.code === 0 && res.data.docs) {
        let payTotal = 0;
        let incomeTotal = 0;
        res.data.docs.forEach((i: any) => {
          if (i._id.is_income[0] === 0) {
            payTotal = i.total;
          } else {
            incomeTotal = i.total;
          }
        });
        yield put({ type: 'save', payload: { incomeTotal, payTotal } });
      } else {
        yield put({ type: 'save', payload: { incomeTotal: 0, payTotal: 0 } });
      }
    },
    *getClassifyList({ payload }, { call }) {
      const res = yield call(getClassifyList(payload));
      console.log(res);
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default record;
