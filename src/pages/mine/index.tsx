/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Toast } from '@ant-design/react-native';
import { VictoryPie, VictoryLabel } from 'victory-native';
import { Svg } from 'react-native-svg';
import moment from 'moment';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
import Budget from './budget/index';
import NavigationUtil from '@/navigator/NavigationUtil';
import avatarArr from '@/assets/json/avatarMap';
import { getCurBudget } from '@/service/budget';
import { getCurMonthTotal } from '@/service/bill';
import suitHeight from '@/utils/suitableHeight';

interface IProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

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
  const [refreshing, setRefreshing] = React.useState(false);
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
      NavigationUtil.toPage('????????????', { randomAvatar });
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
          // Toast.fail('????????????????????????', 0.5);
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
          // Toast.fail('??????????????????????????????', 0.5);
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
          Toast.success('????????????', 0.5);
        },
        fail: () => {
          Toast.fail('???????????????', 0.5);
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
          // Toast.fail('????????????????????????', 0.5);
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
          // Toast.fail('??????????????????????????????', 0.5);
        },
      },
    });
  };

  const handleAccount = () => {
    NavigationUtil.toPage('????????????', {
      now_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait().then(() => setRefreshing(false));
  }, []);

  const wait = () => {
    return new Promise(resolve => {
      setRandomAvatar(((Math.random() * 10000) | 0) % 27);
      dispatchApp({ type: 'app/verifyToken' });
      getUserInfo();
      getClockInfo();
      getBillTotal();
      getIsClock();
      getCurBudgetInfo();
      getCurSumAccount();
      resolve(false);
    });
  };
  return (
    <View style={styles.ScrollView}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
                <Text>{isClock === 0 ? '??????' : '?????????'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tab}>
              <View style={styles.item}>
                <Text style={styles.num}>{clockContinueCount}</Text>
                <Text>???????????????</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.num}>{clockTotal}</Text>
                <Text>???????????????</Text>
              </View>
              <View style={styles.item}>
                <Text style={styles.num}>{billTotal}</Text>
                <Text>???????????????</Text>
              </View>
            </View>
          </LinearGradient>
          <View style={styles.bottom}>
            <TouchableOpacity onPress={() => handleAccount()}>
              <View style={styles.bill}>
                <View style={styles.billTitleContainer}>
                  <Text style={styles.billTitle}>??????</Text>
                  <Image
                    style={styles.billIcon}
                    source={require('@/assets/image/ad_arrow.png')}
                  />
                </View>
                <View style={styles.billContent}>
                  <View style={styles.billDate}>
                    <Text>{moment().month() + 1}???</Text>
                  </View>
                  <View style={styles.billContentContainer}>
                    <View style={styles.billItem}>
                      <Text>??????</Text>
                      <Text>{Number(curAccount.income).toFixed(2)}</Text>
                    </View>
                    <View style={styles.billItem}>
                      <Text>??????</Text>
                      <Text>{Number(curAccount.pay).toFixed(2)}</Text>
                    </View>
                    <View style={styles.billItem}>
                      <Text>??????</Text>
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
                  }????????????`}</Text>
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
                        <Text>????????????</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  )}
                </View>
              </TouchableOpacity>
              <View style={styles.budgetBottom}>
                <View style={styles.budgetLeft}>
                  <Svg viewBox="0 0 400 400">
                    <VictoryPie
                      standalone={false}
                      width={400}
                      height={400}
                      data={[
                        {
                          x: '',
                          y:
                            restBudget <= 0
                              ? 0
                              : +((restBudget * 100) / budget).toFixed(2),
                        },
                        {
                          x: '',
                          y:
                            restBudget <= 0
                              ? 100
                              : 100 - +((restBudget * 100) / budget).toFixed(2),
                        },
                      ]}
                      innerRadius={120}
                      labelRadius={100}
                      animate={{
                        duration: 1000,
                      }}
                      colorScale={['#fad749', '#eee']}
                      style={{ labels: { fontSize: 20, fill: 'white' } }}
                    />
                    <VictoryLabel
                      textAnchor="middle"
                      verticalAnchor="middle"
                      x={200}
                      y={200}
                      style={{ fontSize: 60 }}
                      text={[
                        '??????',
                        `${
                          restBudget <= 0
                            ? 0
                            : +((restBudget * 100) / budget).toFixed(2)
                        }%`,
                      ]}
                    />
                  </Svg>
                </View>
                <View style={styles.budgetRight}>
                  <View style={styles.itemTop}>
                    <Text style={styles.itemTopText}>???????????????</Text>
                    <Text style={styles.itemTopValueText}>
                      {(restBudget >= 0 ? restBudget : 0).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.budgetItem}>
                    <Text style={styles.budgetItemText}>???????????????</Text>
                    <Text style={styles.budgetItemText}>
                      {Number(budget).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.budgetItem}>
                    <Text style={styles.budgetItemText}>???????????????</Text>
                    <Text style={styles.budgetItemText}>
                      {Number(payValue).toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
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
      </ScrollView>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const bottom = suitHeight.find(i => i.height === screenHeight)?.mine || 430;

const styles = StyleSheet.create({
  ScrollView: { backgroundColor: '#fef6dd', height: screenHeight + bottom },
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
  bottom: { position: 'relative', top: -40 }, // ??????????????????????????????
  other: {
    position: 'relative',
    top: -100,
    zIndex: -1,
    width: screenWidth,
    height: screenHeight - bottom + 100,
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
    marginRight: (screenWidth - 300) / 6, // ???????????????
  },
  billTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: (screenWidth - 300) / 6, // ???????????????
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
    height: 100,
    position: 'relative',
    top: -15,
    width: ((screenWidth - 50) * 2) / 5,
  },
  budgetRight: {
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
