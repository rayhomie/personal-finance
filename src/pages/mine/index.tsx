import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from '@/utils/connect';
interface IProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

interface IState {}
@connect(({ app, loading }: IProps) => ({
  app,
  dataLoading: loading.effects['app/login'],
}))
class Mine extends Component<IProps, IState> {
  state: IState = {};
  render() {
    const { dispatch } = this.props;
    return (
      <View>
        <StatusBar />
        <View style={styles.header}>
          <View style={styles.avatar}>
            <View style={styles.pic}>
              <Image
                style={styles.picImage}
                source={{
                  uri:
                    'https://lh3.googleusercontent.com/a-/AOh14GjMcc-Wd3Sc1H7rd2VmWfhPHxucsvaxbuCb-2tb=s96-c-rg-br100',
                }}
              />
              <Text style={styles.nickname}>高桥靓仔</Text>
            </View>
            <View style={styles.clock}>
              <Text>打卡</Text>
            </View>
          </View>
          <View style={styles.tab}>
            <View style={styles.item}>
              <Text style={styles.num}>0</Text>
              <Text>已连续打卡</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.num}>0</Text>
              <Text>记录总天数</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.num}>0</Text>
              <Text>记录总笔数</Text>
            </View>
          </View>
          <View style={styles.bottom}>
            <View style={styles.bill}>
              <Text style={styles.billTitle}>账单</Text>
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
            <Button
              title="登录"
              onPress={() => {
                dispatch({
                  type: 'app/login',
                  payload: { username: 'wangzhiqiang', password: '123456' },
                });
              }}
            />
          </View>
        </View>
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
    backgroundColor: 'yellow',
  },
  billTitle: {
    height: 40,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'white',
    paddingTop: 10,
    paddingLeft: (screenWidth - 300) / 6, // 自适应定位
  },
  billContent: {
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
