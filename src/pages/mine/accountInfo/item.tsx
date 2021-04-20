/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
} from 'react-native';
import { VictoryPie } from 'victory-native';
import { Svg } from 'react-native-svg';
import moment from 'moment';
import Tooltip from 'rn-tooltip';
import { mineAccountItem, getMonthRanked } from '@/service/bill';
import { pay_income } from '@/service/analyse';
import avatarArr from '@/assets/json/avatarMap';
import NavigationUtil from '@/navigator/NavigationUtil';
import { ImageManager } from '@/assets/json/ImageManager';
import suitHeight from '@/utils/suitableHeight';

const IM: any = ImageManager;

interface AccountInfoItemProps {}

type UserinfoType = {
  username: string;
  avatar_url: string;
  joinDays: number;
};
type TotalType = {
  pay_total: number;
  income_total: number;
  pre_month_rest: number;
};
type PieDataType = {
  name: string;
  total: number;
  proportion: number;
};

enum colors {
  '#a29bfe',
  '#74b9ff',
  '#55efc4',
  '#fab1a0',
  '#ff7675',
  '#fdcb6e',
}

const AccountInfoItem: React.FC<AccountInfoItemProps> = () => {
  const date = (NavigationUtil.getParams() as any).date;
  const [randomAvatar, setRandomAvatar] = useState<number>(0);
  const [userinfo, setUserinfo] = useState<UserinfoType>({
    username: '',
    avatar_url: '',
    joinDays: 0,
  });
  const [total, setTotal] = useState<TotalType>({
    pay_total: 0,
    income_total: 0,
    pre_month_rest: 0,
  });
  const [pieData, setPieData] = useState<PieDataType[]>([]);
  const [rank, setRank] = useState<any[]>([]);
  const [msg, setMsg] = useState<any>({});

  useEffect(() => {
    getMineAccountItem(date);
    getMonthRank(date);
    getAnalyse(date);
    setRandomAvatar(((Math.random() * 10000) | 0) % 27);
  }, [date]);

  const getMineAccountItem = async (date: number) => {
    const res = await mineAccountItem({
      date: moment.unix(date).format('YYYY-MM-DD HH:mm:ss'),
    });
    if (res.data.code !== 0) {
      setUserinfo({
        username: '',
        avatar_url: '',
        joinDays: 0,
      });
      return;
    }
    const {
      userinfo,
      pieData,
      pre_month_rest,
      income_total,
      pay_total,
    } = res.data;
    setUserinfo(userinfo);
    setTotal({ pre_month_rest, income_total, pay_total });
    setPieData(pieData);
  };

  const getMonthRank = async (date: number) => {
    const res = await getMonthRanked({
      startMonth: moment.unix(date).format('YYYY-MM'),
      is_income: 0,
      sort: 'amount',
    });
    if (res.data.code !== 0) {
      setRank([]);
      return;
    }
    setRank(res.data.docs);
  };

  const getAnalyse = async (date: number) => {
    const res = await pay_income({
      date: moment.unix(date).format('YYYY-MM-DD HH:mm:ss'),
      type: 'all',
    });
    if (res.data.code !== 0) {
      setMsg({});
    }
    setMsg(res.data.all_msg);
  };

  const List = useMemo(
    () =>
      pieData.map((i, index) => (
        <View style={styles.pieRightListItem} key={i.name}>
          <View style={{ ...styles.color, backgroundColor: colors[index] }} />
          <Text style={styles.classValue}>{i.name}</Text>
          <Text style={styles.proportionValue}>{`${i.proportion}%`}</Text>
          <Text style={styles.totalValue}>{i.total}</Text>
        </View>
      )),
    [pieData]
  );

  const RankList = useMemo(
    () =>
      rank.slice(0, 3).map((i, index) => (
        <View style={styles.rankItem} key={index}>
          <View style={styles.rankItemLeft}>
            <Text style={styles.rankNum}>{index + 1}</Text>
            <View style={styles.RankIcon}>
              <Image style={styles.rankImg} source={IM[i.category[0].icon_l]} />
            </View>
            <View style={styles.rankType}>
              <Text style={styles.rankTypeValue}>{i.category[0].name}</Text>
              <Text style={styles.rankDate}>
                {moment.unix(i.bill_time).format('M月D日')}
              </Text>
            </View>
          </View>
          <Text style={styles.rankItemRight}>{'-' + i.amount}</Text>
        </View>
      )),
    [rank]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBack}
          onPress={() => NavigationUtil.goBack()}
        >
          <Image
            source={require('@/assets/image/nav_back_n.png')}
            style={styles.headerBackIcon}
          />
          <Text style={styles.headerBackText}>返回</Text>
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>
            {moment.unix(date).format('YYYY年M月账单')}
          </Text>
        </View>
      </View>
      <ScrollView style={styles.ScrollView}>
        <View style={styles.head}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={
                userinfo.avatar_url === ''
                  ? avatarArr[randomAvatar]
                  : {
                      uri: userinfo.avatar_url,
                    }
              }
            />
          </View>
          <Text style={styles.username}>{userinfo.username}</Text>
          <Text
            style={styles.joinday}
          >{`这是我与爱记账相识的第${userinfo.joinDays}天`}</Text>
          <Text style={styles.msg}>{msg?.cur_msg?.curmsg}</Text>
        </View>
        <View style={styles.incomepay}>
          <View style={styles.topIC}>
            <View style={styles.topLeftIC}>
              <Text style={styles.topTitleIC}>本月结余：</Text>
              <Text style={styles.topTextIC}>
                {total.income_total - total.pay_total}
              </Text>
            </View>
            <View style={styles.topRightIC}>
              <Text style={styles.topTitleIC}>上月结余：</Text>
              <Text style={styles.topTextRestIC}>{total.pre_month_rest}</Text>
            </View>
          </View>
          <View style={styles.bottomIC}>
            <View style={styles.bottomLeftIC}>
              <View style={styles.bottomLeft}>
                <Text style={styles.bottomLeftTextIC}>支出</Text>
                <Tooltip
                  withOverlay
                  backgroundColor="#f9d96b"
                  actionType="press"
                  height={100}
                  popover={
                    <Text style={{ color: '#515151', fontWeight: 'bold' }}>
                      {msg?.pay_msg?.msgpay}
                    </Text>
                  }
                >
                  <Image
                    style={styles.infoIcon}
                    source={require('@/assets/image/prompt.png')}
                  />
                </Tooltip>
              </View>
              <View style={styles.bottomLeft}>
                <Text style={styles.bottomLeftTextIC}>收入</Text>
                <Tooltip
                  withOverlay
                  backgroundColor="#f9d96b"
                  actionType="press"
                  height={100}
                  popover={
                    <Text
                      style={{
                        color: '#515151',
                        fontWeight: 'bold',
                      }}
                    >
                      {msg?.income_msg?.msgincome}
                    </Text>
                  }
                >
                  <Image
                    style={styles.infoIcon}
                    source={require('@/assets/image/prompt.png')}
                  />
                </Tooltip>
              </View>
            </View>
            <View style={styles.line} />
            <View style={styles.bottomRightIC}>
              <View style={styles.viewContainer}>
                <View
                  style={{
                    ...styles.payView,
                    width:
                      total.pay_total + total.income_total === 0
                        ? 0
                        : (total.pay_total /
                            (total.pay_total + total.income_total)) *
                          (screenWidth - 100),
                  }}
                />
                <Text style={styles.bottomRightTextIC}>{total.pay_total}</Text>
              </View>
              <View style={styles.viewContainer}>
                <View
                  style={{
                    ...styles.incomeView,
                    width:
                      total.pay_total + total.income_total === 0
                        ? 0
                        : (total.income_total /
                            (total.pay_total + total.income_total)) *
                          (screenWidth - 100),
                  }}
                />
                <Text style={styles.bottomRightTextIC}>
                  {total.income_total}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.marginLine} />
        <View style={styles.pieContainer}>
          <View style={styles.pieTitleContainer}>
            <Text style={styles.pieTitle}>支出类别</Text>
          </View>
          <View style={styles.pieContent}>
            <View style={styles.pieLeft}>
              <Svg viewBox="0 0 400 400">
                <VictoryPie
                  standalone={false}
                  width={400}
                  height={400}
                  data={pieData.map(i => ({ x: '', y: i.total }))}
                  innerRadius={80}
                  labelRadius={10}
                  animate={{
                    duration: 1000,
                  }}
                  colorScale={[
                    '#a29bfe',
                    '#74b9ff',
                    '#55efc4',
                    '#fab1a0',
                    '#ff7675',
                    '#fdcb6e',
                  ]}
                  style={{ labels: { fontSize: 20, fill: 'white' } }}
                />
              </Svg>
            </View>
            <View style={styles.pieRight}>
              <View style={styles.pieRightTitle}>
                <Text style={styles.classTitle}>类别</Text>
                <Text style={styles.proportionTitle}>占比</Text>
                <Text style={styles.totalTitle}>金额</Text>
              </View>
              {List}
            </View>
          </View>
        </View>
        <View style={styles.rank}>
          <View style={styles.rankTitleContainer}>
            <Text style={styles.rankTitle}>支出排行</Text>
            <TouchableOpacity
              style={styles.rankMore}
              onPress={() =>
                NavigationUtil.toPage('账单排行更多', {
                  rankList: rank,
                  date,
                })
              }
            >
              <Text style={styles.rankMoreText}>查看更多</Text>
              <Image
                style={styles.billIcon}
                source={require('@/assets/image/ad_arrow.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.rankListContainer}>{RankList}</View>
        </View>
      </ScrollView>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const bottom =
  suitHeight.find(i => i.height === screenHeight)?.monthAccount || 80;
const styles = StyleSheet.create({
  ScrollView: { marginBottom: bottom },
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#fef5dd',
  },
  header: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#fef6dd',
  },
  headerBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  headerBackText: { fontWeight: 'bold', fontSize: 18 },
  headerBackIcon: {},
  headerTitle: {
    width: 150,
    marginLeft: screenWidth / 2 - 155,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: { fontSize: 20 },
  head: {
    backgroundColor: '#fef6dd',
    height: 250,
    alignItems: 'center',
  },
  avatarContainer: {
    marginTop: 30,
    width: 85,
    height: 85,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: 80, height: 80, borderRadius: 50 },
  username: { fontSize: 30, marginTop: 15 },
  joinday: { fontSize: 15, marginTop: 5 },
  msg: {
    fontSize: 15,
    marginTop: 5,
    paddingHorizontal: 50,
    textAlign: 'center',
  },
  incomepay: { height: 200, backgroundColor: '#fff', paddingHorizontal: 10 },
  topIC: {
    marginTop: 20,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topLeftIC: { width: screenWidth / 3 },
  topRightIC: { width: screenWidth / 3 },
  topTitleIC: { fontSize: 12, color: '#bbb', marginBottom: 5 },
  topTextIC: { fontSize: 24 },
  topTextRestIC: { fontSize: 24, color: '#515151' },
  bottomIC: { height: 100, flexDirection: 'row' },
  bottomLeftIC: { width: 50 },
  bottomLeftTextIC: { color: '#515151', marginTop: 18, fontSize: 13 },
  line: { width: 1, backgroundColor: '#eee', height: 70, marginTop: 10 },
  bottomRightIC: { width: screenWidth - 70 },
  viewContainer: {
    flexDirection: 'row',
    marginTop: 22,
    height: 10,
    justifyContent: 'flex-start',
  },
  payView: {
    backgroundColor: '#fad749',
    borderBottomEndRadius: 6,
    borderTopEndRadius: 6,
  },
  bottomRightTextIC: { marginLeft: 10, fontSize: 10 },
  incomeView: {
    backgroundColor: 'orange',
    borderBottomEndRadius: 6,
    borderTopEndRadius: 6,
  },
  marginLine: { height: 10, backgroundColor: '#f3f3f3' },
  pieContainer: {
    height: 230,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  pieTitleContainer: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pieTitle: { fontSize: 18, marginTop: 12 },
  pieContent: { height: 190, flexDirection: 'row' },
  pieLeft: { width: 150 },
  pieRight: {
    width: screenWidth - 170,
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  pieRightTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  classTitle: {
    width: 30,
  },
  proportionTitle: {
    width: 110,
    textAlign: 'right',
  },
  totalTitle: {
    textAlign: 'right',
    width: 60,
  },
  pieRightListItem: {
    flexDirection: 'row',
    height: 20,
    marginTop: 5,
    alignItems: 'center',
  },
  color: { width: 15, height: 15, borderRadius: 2 },
  classValue: {
    width: 70,
    marginLeft: 10,
  },
  proportionValue: {
    width: 50,
    textAlign: 'right',
  },
  totalValue: {
    marginLeft: 0,
    width: 55,
    textAlign: 'right',
  },
  billIcon: {
    width: 12,
    height: 12,
  },
  rank: { backgroundColor: '#fff' },
  rankTitleContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  rankTitle: { color: '#515151', fontSize: 17 },
  rankMore: { flexDirection: 'row', alignItems: 'center' },
  rankMoreText: { color: '#9d9d9d' },
  rankListContainer: {
    paddingVertical: 20,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 50,
  },
  rankItemLeft: { flexDirection: 'row', alignItems: 'center' },
  RankIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankImg: { width: 35, height: 35 },
  rankNum: { fontSize: 16, width: 20 },
  rankType: {
    justifyContent: 'space-evenly',
  },
  rankTypeValue: { fontSize: 15 },
  rankDate: { fontSize: 12, color: '#515151' },
  rankItemRight: {},
  bottomLeft: { flexDirection: 'row' },
  infoIcon: { width: 15, height: 15, marginTop: 18 },
});

export default AccountInfoItem;
