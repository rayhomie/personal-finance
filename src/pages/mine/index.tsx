import React, { Component } from 'react';
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
import { connect } from '@/utils/connect';
import NavigationUtil from '@/navigator/NavigationUtil';
import Login from '@/pages/login/index';

interface IProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

interface IState {
  openLogin: boolean;
}
@connect(({ app, user, mine, loading }: IProps) => ({
  app,
  user,
  mine,
  dataLoading: loading?.effects['app/login'],
}))
class Mine extends Component<IProps, IState> {
  state: IState = {
    openLogin: false,
  };

  openUserInfo = () => {
    const { app } = this.props;
    if (app?.isLogin) {
      NavigationUtil.toPage('用户信息');
    } else {
      this.setState({ openLogin: true });
    }
  };

  loginClose = () => {
    this.setState({ openLogin: false });
  };

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps?.app.isLogin) {
      this.setState({ openLogin: false });
    }
  }

  UNSAFE_componentWillMount() {
    const { dispatch } = this.props;
    (dispatch as Dispatch)({ type: 'app/verifyToken' });
    this.getUserInfo();
    this.getClockInfo();
  }

  getUserInfo = () => {
    (this.props.dispatch as Dispatch)({
      type: 'user/getUserInfo',
      payload: {
        success: () => {},
        fail: () => {
          Toast.fail('获取用户信息失败', 1.5);
        },
      },
    });
  };

  getClockInfo = () => {
    (this.props.dispatch as Dispatch)({
      type: 'mine/getClockList',
      payload: {
        success: () => {},
        fail: () => {
          Toast.fail('获取打卡信息失败', 1.5);
        },
      },
    });
    (this.props.dispatch as Dispatch)({
      type: 'mine/getContinueCount',
      payload: {
        success: () => {},
        fail: () => {
          Toast.fail('获取连续打卡次数失败', 1.5);
        },
      },
    });
  };

  clock = () => {
    const clock_date = moment().format('YYYY-MM-DD HH:mm:ss');
    (this.props.dispatch as Dispatch)({
      type: 'mine/clock',
      payload: {
        clock_date,
        success: () => {
          Toast.success('打卡成功', 1.5);
        },
        fail: () => {
          Toast.fail('今日已打卡', 1.5);
        },
      },
    });
  };

  render() {
    const { user, mine } = this.props;
    const { avatar_url, username } = user as any;
    const { clockTotal, clockContinueCount } = mine as any;
    return (
      <View>
        <StatusBar />
        <View style={styles.header}>
          <View style={styles.avatar}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.pic}
              onPress={this.openUserInfo}
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
              onPress={this.clock}
            >
              <Text>打卡</Text>
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
              <Text style={styles.num}>0</Text>
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
        <Login visible={this.state.openLogin} onClose={this.loginClose} />
      </View>
    );
  }
}

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

export default Mine;
