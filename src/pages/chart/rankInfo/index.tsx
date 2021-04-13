/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import NavigationUtil from '@/navigator/NavigationUtil';
import { getRankItem } from '@/service/chart';
import { ImageManager } from '@/assets/json/ImageManager';

const IM: any = ImageManager;

enum WeekMap {
  '周日',
  '周一',
  '周二',
  '周三',
  '周四',
  '周五',
  '周六',
}

interface RankInfoProps {}

type ParamsType = {
  type: 1 | 2 | 3;
  category_id: string;
  date: string;
  total?: number;
  title?: string;
  sort?: 'amount' | 'bill_time';
};

const RankInfo: React.FC<RankInfoProps> = () => {
  const [params, setParams] = useState<ParamsType | null>(null);
  const [sort, setSort] = useState<'amount' | 'bill_time'>('amount');
  const [res, setRes] = useState<any[]>([]);

  useEffect(() => {
    setParams(NavigationUtil.getParams() as ParamsType);
  }, []);

  useEffect(() => {
    if (!params) return;
    getRankInfo(params);
  }, [params]);

  const getRankInfo = async (payload: ParamsType) => {
    const { type, date, category_id } = payload;
    const result = await getRankItem({ type, date, category_id, sort });
    console.log(result);
    if (result.data.code !== 0) {
      setRes([]);
      return;
    }
    setRes(result.data.docs);
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
          <Text style={styles.headerTitleText}>{params?.title}</Text>
        </View>
      </View>
      <View style={styles.content}>
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
                <Text>{`${i.remark || i.category[0].name}  ${
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
      </View>
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
  content: { margin: 10 },
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
});

export default RankInfo;
