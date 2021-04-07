/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Toast } from '@ant-design/react-native';
import moment from 'moment';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
import NavigationUtil from '@/navigator/NavigationUtil';

interface IProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

const Mine: React.FC<IProps> = props => {
  const { user, mine, app, dispatch } = props;
  const dispatchApp = dispatch as Dispatch;
  const { avatar_url, username } = user as any;
  const { clockTotal, clockContinueCount, billTotal, isClock } = mine as any;

  useEffect(() => {
    dispatchApp({ type: 'app/verifyToken' });
    getUserInfo();
    getClockInfo();
    getBillTotal();
    getIsClock();
  }, []);

  useEffect(() => {
    if (app?.isLogin) {
      dispatchApp({ type: 'app/save', payload: { openLogin: false } });
    } else {
      dispatchApp({ type: 'app/save', payload: { openLogin: true } });
    }
  }, [app?.isLogin]);

  const openUserInfo = () => {
    if (app?.isLogin) {
      NavigationUtil.toPage('用户信息');
    } else {
      dispatchApp({ type: 'app/save', payload: { openLogin: true } });
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
      type: 'mine/getClockList',
      payload: {
        success: () => {},
        fail: () => {
          // Toast.fail('获取打卡信息失败', 1.5);
        },
      },
    });
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

  return (
    <View>
      <StatusBar />
      <View style={styles.header}>
        <View style={styles.avatar}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.pic}
            onPress={openUserInfo}
          >
            <Image
              style={styles.picImage}
              source={{
                uri: avatar_url,
              }}
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
        <View style={styles.bottom}>
          <View style={styles.bill}>
            <View style={styles.billTitleContainer}>
              <Text style={styles.billTitle}>账单</Text>
            </View>
            <View style={styles.billContent}>
              <View style={styles.billDate}>
                <Text>03月</Text>
              </View>
              <View style={styles.billContentContainer}>
                <View style={styles.billItem}>
                  <Text>收入</Text>
                  <Text>0.00</Text>
                </View>
                <View style={styles.billItem}>
                  <Text>支出</Text>
                  <Text>0.00</Text>
                </View>
                <View style={styles.billItem}>
                  <Text>结余</Text>
                  <Text>0.00</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  header: {},
  avatar: {
    width: screenWidth,
    height: 100,
    backgroundColor: 'pink',
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
    backgroundColor: 'pink',
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
  },
  billTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
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
  billItem: {},
});

export default connect(({ app, user, mine, record, loading }: IProps) => ({
  app,
  user,
  record,
  mine,
  dataLoading: loading?.effects['app/login'],
}))(Mine);
