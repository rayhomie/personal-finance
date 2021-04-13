/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Switch } from '@ant-design/react-native';
import Tooltip from 'rn-tooltip';
import moment from 'moment';
import NavigationUtil from '@/navigator/NavigationUtil';
import { getMonthRanked } from '@/service/bill';
import { ImageManager } from '@/assets/json/ImageManager';

const IM: any = ImageManager;

enum WeekMap {
  '日',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
}

interface MonthRankProps {}

type ParamsType = {
  is_income: 0 | 1;
  startMonth: string;
  total: number;
};

const MonthRank: React.FC<MonthRankProps> = () => {
  const [params, setParams] = useState<ParamsType | null>(null);
  const [sort, setSort] = useState<'amount' | 'bill_time'>('amount');
  const [res, setRes] = useState<any[]>([]);

  useEffect(() => {
    setParams(NavigationUtil.getParams() as any);
  }, []);

  useEffect(() => {
    if (!params) return;
    getMonthRankedInfo();
  }, [params, sort]);

  const getMonthRankedInfo = async () => {
    const result = await getMonthRanked({
      ...(params ? params : {}),
      sort,
    });
    if (result.data.code !== 0) {
      setRes([]);
      return;
    }
    setRes(result.data.docs);
  };

  const onSwitchChange = (value: any) => {
    setSort(value ? 'bill_time' : 'amount');
  };

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
          <Text style={styles.headerTitleText}>{params?.startMonth}</Text>
        </View>
        <View style={styles.headerRight}>
          <Tooltip
            withOverlay
            backgroundColor="#f9d96b"
            actionType="press"
            width={100}
            popover={
              <Text style={{ color: '#515151', fontWeight: 'bold' }}>
                {`按${sort === 'amount' ? '金额' : '时间'}排序`}
              </Text>
            }
          >
            <Image
              style={styles.infoIcon}
              source={require('@/assets/image/prompt.png')}
            />
          </Tooltip>
          <View style={{ width: 10 }} />
          <Switch
            checked={sort === 'amount' ? false : true}
            onChange={onSwitchChange}
            color="#f9d96b"
          />
        </View>
      </View>
      <View style={styles.middle}>
        <Text style={styles.middleText}>{`本月总${
          params?.is_income ? '收入' : '支出'
        }`}</Text>
        <Text style={styles.middleTotalText}>{params?.total}</Text>
      </View>
      <ScrollView style={styles.content}>
        {res.map((i: any) => (
          <View style={styles.rankItem} key={i._id}>
            <View style={styles.rankLeft}>
              <Image
                style={styles.iconCate}
                source={IM[i.category[0].icon_l]}
              />
            </View>
            <View style={styles.rankRight}>
              <View style={styles.rankTop}>
                <Text>{`${i.category[0].name}${
                  i.remark ? '(' + i.remark + ')' : ''
                }  ${
                  Math.floor(
                    (i.amount * 10000) / (params?.total ? params.total : 10000)
                  ) / 100
                }%`}</Text>
                <Text>{i.amount}</Text>
              </View>
              <View style={styles.rankBottom}>
                <View
                  style={{
                    ...styles.rankBottomlength,
                    width:
                      (i.amount / (params?.total ? params.total : 10000)) *
                      (screenWidth - 80),
                  }}
                />
                <Text style={styles.billtime}>
                  {`${moment
                    .unix(i.bill_time)
                    .format('YYYY-MM-DD HH:mm:ss')}   ${
                    WeekMap[moment.unix(i.bill_time).weekday()]
                  }`}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    height: 40,
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
    width: 120,
    marginLeft: screenWidth / 2 - 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: { fontSize: 20 },
  headerRight: {
    flexDirection: 'row',
    width: 90,
    marginLeft: screenWidth / 2 - 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 10,
    width: screenWidth,
    marginBottom: 80,
  },
  rankItem: {
    flexDirection: 'row',
    height: 70,
  },
  rankLeft: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 70,
    width: 60,
  },
  iconCate: { width: 40, height: 40 },
  rankRight: {
    width: screenWidth - 80,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  rankTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankBottom: { alignItems: 'flex-start' },
  rankBottomlength: {
    height: 10,
    backgroundColor: '#f9d96b',
    borderRadius: 20,
  },
  billtime: {
    fontSize: 12,
  },
  infoIcon: { width: 20, height: 20 },
  middle: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middleText: { fontSize: 14, color: '#515151' },
  middleTotalText: { fontSize: 25, marginTop: 15 },
});

export default MonthRank;
