/* eslint-disable react-native/no-inline-styles */
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
import { Switch } from '@ant-design/react-native';
import Tooltip from 'rn-tooltip';
import moment from 'moment';
import NavigationUtil from '@/navigator/NavigationUtil';
import { getRankItem } from '@/service/chart';
import { ImageManager } from '@/assets/json/ImageManager';
import suitHeight from '@/utils/suitableHeight';

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
  }, [params, sort]);

  const getRankInfo = async (payload: ParamsType) => {
    const { type, date, category_id } = payload;
    const result = await getRankItem({ type, date, category_id, sort });
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
          <Text style={styles.headerTitleText}>{params?.title}</Text>
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
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const bottom = suitHeight.find(i => i.height === screenHeight)?.monthRank || 80;

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
  content: { padding: 10, width: screenWidth, marginBottom: bottom },
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
});

export default RankInfo;
