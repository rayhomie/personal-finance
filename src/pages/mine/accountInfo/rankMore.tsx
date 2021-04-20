import React, { useMemo } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import NavigationUtil from '@/navigator/NavigationUtil';
import { ImageManager } from '@/assets/json/ImageManager';
import suitHeight from '@/utils/suitableHeight';

const IM: any = ImageManager;

interface RankMoreProps {}

const RankMore: React.FC<RankMoreProps> = () => {
  const rank = (NavigationUtil.getParams() as any).rankList;

  const RankList = useMemo(
    () =>
      rank.map((i: any, index: number) => (
        <View style={styles.rankItem} key={index}>
          <View style={styles.rankItemLeft}>
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
            {moment
              .unix((NavigationUtil.getParams() as any).date)
              .format('YYYY年M月支出排行')}
          </Text>
        </View>
      </View>
      <ScrollView>{RankList}</ScrollView>
    </View>
  );
};
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const bottom =
  suitHeight.find(i => i.height === screenHeight)?.monthAccount || 80;
const styles = StyleSheet.create({
  container: {
    height: screenHeight - bottom,
    width: screenWidth,
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
    width: 200,
    marginLeft: screenWidth / 2 - 180,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: { fontSize: 20 },
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
  rankType: {
    justifyContent: 'space-evenly',
  },
  rankTypeValue: { fontSize: 15 },
  rankDate: { fontSize: 12, color: '#515151' },
  rankItemRight: {},
});
export default RankMore;
