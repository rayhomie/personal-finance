/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Toast } from '@ant-design/react-native';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import moment from 'moment';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
import Budget from './budget/index';
import NavigationUtil from '@/navigator/NavigationUtil';
import avatarArr from '@/assets/json/avatarMap';
import { getCurBudget } from '@/service/budget';
import { getCurMonthTotal } from '@/service/bill';

interface IProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 },
];

const Mine: React.FC<IProps> = props => {
  const { user, mine, app, dispatch } = props;
  const dispatchApp = dispatch as Dispatch;
  const { avatar_url, username } = user as any;
  const { clockTotal, clockContinueCount, billTotal, isClock } = mine as any;
  const [randomAvatar, setRandomAvatar] = useState<number>(0);
  const [budgetVis, setBudgetVis] = useState<{
    type: 'add' | 'update' | '';
    visible: boolean;
  }>({ type: '', visible: false });
  const [curAccount, setCurAccount] = useState<{
    pay: number;
    income: number;
  }>({ pay: 0, income: 0 });
  const [budget, setBudget] = useState<number>(0);
  const [payValue, setPayValue] = useState<number>(0);
  const restBudget = +Number(budget).toFixed(2) - +Number(payValue).toFixed(2);

  useEffect(() => {
    if (app?.isLogin) {
      dispatchApp({ type: 'app/save', payload: { openLogin: false } });
    } else {
      setRandomAvatar(((Math.random() * 10000) | 0) % 27);
      dispatchApp({ type: 'app/save', payload: { openLogin: true } });
    }
    setTimeout(() => {
      dispatchApp({ type: 'app/verifyToken' });
      getUserInfo();
      getClockInfo();
      getBillTotal();
      getIsClock();
      getCurBudgetInfo();
      getCurSumAccount();
    }, 0);
  }, [app?.isLogin]);

  useEffect(() => {
    if (budgetVis.visible === false && budgetVis.type !== '') {
      getCurBudgetInfo();
    }
  }, [budgetVis.visible]);

  const openUserInfo = () => {
    if (app?.isLogin) {
      NavigationUtil.toPage('用户信息', { randomAvatar });
    } else {
      dispatchApp({ type: 'app/save', payload: { openLogin: true } });
    }
  };

  const getCurBudgetInfo = async () => {
    const res = await getCurBudget();
    if (res.data.code === 0 && res.data.docs !== null) {
      setBudget(res.data.docs.budget_value);
      setPayValue(res.data.pay);
    } else {
      setPayValue(0);
      setBudget(0);
    }
  };

  const getCurSumAccount = async () => {
    const res = await getCurMonthTotal({
      startMonth: moment().format('YYYY-MM'),
    })();
    if (res.data.code === 0) {
      let [pay, income] = [0, 0];
      res.data.docs.forEach((i: any) => {
        if (i._id.is_income[0] === 0) {
          pay = i.total;
        } else {
          income = i.total;
        }
      });
      setCurAccount({ pay, income });
    } else {
      setCurAccount({ pay: 0, income: 0 });
    }
  };

  const getUserInfo = () => {
    dispatchApp({
      type: 'user/getUserInfo',
      payload: {
        success: () => {},
        fail: () => {
          // Toast.fail('获取用户信息失败', 1.5);
        },
      },
    });
  };

  const getClockInfo = () => {
    dispatchApp({
      type: 'mine/getContinueCount',
      payload: {
        success: () => {},
        fail: () => {
          // Toast.fail('获取连续打卡次数失败', 1.5);
        },
      },
    });
  };

  const clock = () => {
    const clock_date = moment().format('YYYY-MM-DD HH:mm:ss');
    dispatchApp({
      type: 'mine/clock',
      payload: {
        clock_date,
        success: () => {
          Toast.success('打卡成功', 1.5);
        },
        fail: () => {
          Toast.fail('今日已打卡', 1.5);
        },
        fail401: () => {
          dispatchApp({ type: 'app/save', payload: { openLogin: true } });
        },
      },
    });
  };

  const getBillTotal = () => {
    dispatchApp({
      type: 'mine/getBillList',
      payload: {
        success: () => {},
        fail: () => {
          // Toast.fail('获取账单信息失败', 1.5);
        },
      },
    });
  };

  const getIsClock = () => {
    dispatchApp({
      type: 'mine/getIsClock',
      payload: {
        success: () => {},
        fail: () => {
          // Toast.fail('获取今日是否打卡失败', 1.5);
        },
      },
    });
  };

  const handleAccount = () => {};

  return (
    <View>
      <View style={styles.header}>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.5, y: 1.0 }}
          colors={['#fff', '#ffeaaa']}
        >
          <View style={styles.avatar}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.pic}
              onPress={openUserInfo}
            >
              <Image
                style={styles.picImage}
                source={
                  avatar_url === ''
                    ? avatarArr[randomAvatar]
                    : {
                        uri: avatar_url,
                      }
                }
              />
              <Text style={styles.nickname}>{username}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.clock}
              onPress={clock}
            >
              <Text>{isClock === 0 ? '打卡' : '已打卡'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tab}>
            <View style={styles.item}>
              <Text style={styles.num}>{clockContinueCount}</Text>
              <Text>已连续打卡</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.num}>{clockTotal}</Text>
              <Text>记录总天数</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.num}>{billTotal}</Text>
              <Text>记录总笔数</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.bottom}>
          <TouchableOpacity onPress={() => handleAccount()}>
            <View style={styles.bill}>
              <View style={styles.billTitleContainer}>
                <Text style={styles.billTitle}>账单</Text>
                <Image
                  style={styles.billIcon}
                  source={require('@/assets/image/ad_arrow.png')}
                />
              </View>
              <View style={styles.billContent}>
                <View style={styles.billDate}>
                  <Text>{moment().month() + 1}月</Text>
                </View>
                <View style={styles.billContentContainer}>
                  <View style={styles.billItem}>
                    <Text>收入</Text>
                    <Text>{Number(curAccount.income).toFixed(2)}</Text>
                  </View>
                  <View style={styles.billItem}>
                    <Text>支出</Text>
                    <Text>{Number(curAccount.pay).toFixed(2)}</Text>
                  </View>
                  <View style={styles.billItem}>
                    <Text>结余</Text>
                    <Text>
                      {(
                        +Number(curAccount.income).toFixed(2) -
                        +Number(curAccount.pay).toFixed(2)
                      ).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.5, y: 0.65 }}
          locations={[0, 0.2, 0.5, 0.7, 0.9, 1]}
          colors={[
            '#fff1c7',
            '#ffeaaa',
            '#ffeebc',
            '#fff2ce',
            '#fffdf7',
            '#fff',
          ]}
          style={styles.other}
        >
          <View style={styles.budgetContainer}>
            <TouchableOpacity
              onPress={() => setBudgetVis({ type: 'update', visible: true })}
              disabled={budget === 0}
            >
              <View style={styles.budgetTop}>
                <Text style={styles.billTitle}>{`${
                  moment().month() + 1
                }月总预算`}</Text>
                {budget !== 0 ? (
                  <Image
                    style={styles.billIcon}
                    source={require('@/assets/image/ad_arrow.png')}
                  />
                ) : (
                  <LinearGradient
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    colors={['#ffd729', '#ffd729']}
                    style={styles.budgetButtonContainer}
                  >
                    <TouchableOpacity
                      style={styles.budgetButton}
                      onPress={() => {
                        setBudgetVis({ type: 'add', visible: true });
                      }}
                    >
                      <Image
                        style={styles.icon}
                        source={require('@/assets/image/add.png')}
                      />
                      <Text>设置预算</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                )}
              </View>
              <View style={styles.budgetBottom}>
                <View style={styles.budgetLeft}>
                  <VictoryChart
                    width={150}
                    height={150}
                    domainPadding={{ x: 10, y: 10 }}
                    theme={VictoryTheme.material}
                  >
                    <VictoryBar data={data} x="quarter" y="earnings" />
                  </VictoryChart>
                </View>
                <View style={styles.budgetRight}>
                  <View style={styles.itemTop}>
                    <Text style={styles.itemTopText}>剩余预算：</Text>
                    <Text style={styles.itemTopValueText}>
                      {(restBudget >= 0 ? restBudget : 0).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.budgetItem}>
                    <Text style={styles.budgetItemText}>本月预算：</Text>
                    <Text style={styles.budgetItemText}>
                      {Number(budget).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.budgetItem}>
                    <Text style={styles.budgetItemText}>本月支出：</Text>
                    <Text style={styles.budgetItemText}>
                      {Number(payValue).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
      <Budget
        visible={budgetVis.visible}
        type={budgetVis.type}
        budget={
          (budget + '').includes('.')
            ? Number(budget).toFixed(2)
            : budget.toString()
        }
        onClose={() => setBudgetVis({ type: 'add', visible: false })}
      />
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  header: {},
  avatar: {
    width: screenWidth,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nickname: { fontWeight: 'bold', fontSize: 18, marginLeft: 10 },
  pic: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picImage: { width: 70, height: 70, borderRadius: 35, marginLeft: 30 },
  clock: {
    width: 60,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 30,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tab: {
    width: screenWidth,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  item: {
    width: 100,
    height: 75,
    // backgroundColor: 'powderblue',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  num: { fontWeight: 'bold', fontSize: 18 },
  bottom: { position: 'relative', top: -40 }, // 下部区域整体向上平移
  other: {
    position: 'relative',
    top: -100,
    zIndex: -1,
    width: screenWidth,
    height: 1000,
  },
  bill: {
    width: screenWidth - 50,
    height: 100,
    marginLeft: 25,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  billTitleContainer: {
    height: 40,
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  billIcon: {
    width: 15,
    height: 15,
    marginRight: (screenWidth - 300) / 6, // 自适应定位
  },
  billTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: (screenWidth - 300) / 6, // 自适应定位
  },
  billContent: {
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  billDate: {
    borderRightWidth: 1,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billContentContainer: {
    width: screenWidth - 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  billItem: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  budgetContainer: {
    width: screenWidth - 50,
    marginLeft: 25,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: 'white',
    height: 120,
    borderRadius: 10,
    position: 'relative',
    top: 80,
  },
  budgetTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  budgetBottom: {
    flexDirection: 'row',
  },
  budgetLeft: {
    backgroundColor: 'pink',
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // // backgroundColor: '#f5fcff',
    height: 75,
    width: ((screenWidth - 50) * 2) / 5,
  },
  budgetRight: {
    // backgroundColor: 'blue',
    height: 75,
    width: ((screenWidth - 50) * 3) / 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  itemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 20,
    marginBottom: 5,
    borderBottomWidth: 0.7,
    borderBottomColor: '#eee',
  },
  budgetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 20,
  },
  itemTopText: {
    fontSize: 17,
    marginTop: -5,
  },
  itemTopValueText: { fontWeight: 'bold', fontSize: 18, marginTop: -5 },
  budgetItemText: {
    color: '#8b8b8b',
  },
  budgetButtonContainer: {
    marginRight: 10,
    borderRadius: 10,
  },
  budgetButton: {
    height: 25,
    width: 90,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  icon: { width: 15, height: 15 },
});

export default connect(({ app, user, mine, record, loading }: IProps) => ({
  app,
  user,
  record,
  mine,
  dataLoading: loading?.effects['app/login'],
}))(Mine);
