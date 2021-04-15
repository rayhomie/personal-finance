/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SegmentedControl, Modal, Tabs } from '@ant-design/react-native';
import {
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryLine,
  VictoryVoronoiContainer,
} from 'victory-native';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import getTitle from './tabTitles';
import { getRank } from '@/service/chart';
import NavigationUtil from '@/navigator/NavigationUtil';
import { ImageManager } from '@/assets/json/ImageManager';

const IM: any = ImageManager;

interface ChartProps {}
const Chart: React.FC<ChartProps> = () => {
  const [type, setType] = useState<1 | 2 | 3>(1);
  const [showIsIncome, setShowIsIncome] = useState<{
    show: boolean;
    is_income: 0 | 1;
  }>({ show: false, is_income: 0 });
  const nowUnix = useMemo(() => moment().unix(), []);
  const [tabTitle, setTabTitle] = useState<{ title: string; date?: number }[]>(
    getTitle[type](nowUnix)
  );
  // 解决bug的随机key
  const [key, setKey] = useState<string>(Math.random().toString().slice(2));
  // 排行榜分类数据
  const [rank, setRank] = useState<{ category: any; total: number }[]>([]);
  // 排行榜的总值
  const [total, setTotal] = useState<number>(0);
  // 图标数据
  const [chart, setChart] = useState<
    { date: number; cur_total: number; item: any[] }[]
  >([]);
  // 平均值
  const [average, setAverage] = useState<number>(0);
  // 选择的tab
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    setTabTitle(getTitle[type](nowUnix));
    // console.log(getTitle[type](nowUnix));
  }, [type]);

  useEffect(() => {
    getRankData(
      moment.unix(nowUnix).format('YYYY-MM-DD HH:mm:ss'),
      showIsIncome.is_income,
      type
    );
  }, [type, showIsIncome.is_income]);

  useEffect(() => {
    setKey(Math.random().toString().slice(2));
  }, [tabTitle]);

  const getRankData = async (
    date: string,
    is_income: 0 | 1,
    type: 1 | 2 | 3
  ) => {
    const res = await getRank({
      date,
      is_income,
      type,
    });
    if (res.data.code !== 0) {
      setRank([]);
      setTotal(0);
      setChart([]);
      setAverage(0);
      return;
    }
    // console.log(res);
    setChart(res.data.classifyList);
    setRank(
      res.data.docs.map((i: any) => ({
        ...i._id.category[0],
        total: i.total,
      }))
    );
    setTotal(res.data.total);
    setAverage(res.data.average);
  };

  const handleType = (e: any) => {
    setType(e.nativeEvent.selectedSegmentIndex + 1);
  };

  const Line = () => (
    <View style={styles.line}>
      <View style={styles.lineLeft} />
      <View style={styles.lineRight} />
    </View>
  );

  const IsIncomeModal = useMemo(
    () => () => (
      <Modal
        popup
        animationType="slide"
        maskClosable
        visible={showIsIncome.show}
        onClose={() => {
          setShowIsIncome(pre => ({ ...pre, show: false }));
        }}
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.5, y: 0.65 }}
          locations={[0, 1]}
          colors={['#ffeaaa', '#fffcdc']}
          style={styles.iscomeModal}
        >
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => selectIncome(0)}
          >
            <View style={styles.iconIncomeContainer}>
              <Image
                style={styles.iconIncome}
                source={require('@/assets/image/tally_select_expenditure.png')}
              />
            </View>
            <View style={styles.listText}>
              <Text style={styles.listTextWord}>支出</Text>
              {showIsIncome.is_income ? (
                <View />
              ) : (
                <Image
                  style={styles.iconIncome}
                  source={require('@/assets/image/tally_select_right.png')}
                />
              )}
            </View>
          </TouchableOpacity>
          {Line()}
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => selectIncome(1)}
          >
            <View style={styles.iconIncomeContainer}>
              <Image
                style={styles.iconIncome}
                source={require('@/assets/image/tally_select_income.png')}
              />
            </View>
            <View style={styles.listText}>
              <Text style={styles.listTextWord}>收入</Text>
              {showIsIncome.is_income ? (
                <Image
                  style={styles.iconIncome}
                  source={require('@/assets/image/tally_select_right.png')}
                />
              ) : (
                <View />
              )}
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </Modal>
    ),
    [showIsIncome]
  );

  const selectIncome = (Type: 0 | 1) => {
    setShowIsIncome(pre => ({ ...pre, show: false, is_income: Type }));
  };

  const renderContent = (tab: any, index: any) => {
    return (
      <ScrollView
        key={`${tab.date}_${index}`}
        style={{ backgroundColor: '#fff' }}
      >
        <View style={styles.chart}>
          <View style={styles.chartTop}>
            <Text style={styles.chartTopText}>{`总支出：${total}`}</Text>
            <Text style={styles.chartBottomText}>{`平均值：${average}`}</Text>
          </View>
          <VictoryChart
            domainPadding={{ x: 20, y: 45 }}
            height={300}
            width={450}
            containerComponent={<VictoryVoronoiContainer />}
            animate={{
              duration: 500,
              onLoad: { duration: 500 },
            }}
          >
            <VictoryLine
              labelComponent={<VictoryTooltip renderInPortal={false} />}
              style={{
                data: { stroke: '#f9d96b' },
              }}
              data={chart.map((i: any) => ({
                x:
                  type === 1
                    ? moment.unix(i.date).format('M-DD')
                    : type === 3
                    ? moment.unix(i.date).format('M月')
                    : moment.unix(i.date).format('D'),
                y: Math.floor((i.cur_total * 100) / (total ? total : 10000)),
                label: i.cur_total,
              }))}
            />
            <VictoryAxis
              tickFormat={t =>
                type === 2 &&
                ![
                  '1',
                  '5',
                  '10',
                  '15',
                  '20',
                  '25',
                  chart.length > 30 ? '31' : '30',
                ].includes(t)
                  ? ''
                  : t
              }
            />
          </VictoryChart>
        </View>
        <View style={styles.rank}>
          <View style={styles.rankHeader}>
            <Text style={styles.rankHeaderText}>{`${
              showIsIncome.is_income ? '收入' : '支出'
            }排行榜`}</Text>
          </View>
          <View style={styles.rankContainer}>
            {rank.length ? (
              rank.map((i: any) => (
                <TouchableOpacity
                  style={styles.rankItem}
                  key={i._id}
                  onPress={() =>
                    NavigationUtil.toPage('收支排行详情', {
                      type,
                      category_id: i._id,
                      title: i.name,
                      date: moment.unix(nowUnix).format('YYYY-MM-DD HH:mm:ss'),
                      total: i.total,
                    })
                  }
                >
                  <View style={styles.rankLeft}>
                    <Image style={styles.iconCate} source={IM[i.icon_l]} />
                  </View>
                  <View style={styles.rankRight}>
                    <View style={styles.rankTop}>
                      <Text>{`${i.name}  ${
                        Math.floor(
                          (i.total * 10000) / (total ? total : 10000)
                        ) / 100
                      }%`}</Text>
                      <Text>{i.total}</Text>
                    </View>
                    <View style={styles.rankBottom}>
                      <View
                        style={{
                          ...styles.rankBottomlength,
                          width:
                            (i.total / (total ? total : 10000)) *
                            (screenWidth - 80),
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noRes}>
                <Image source={require('@/assets/image/no_data.png')} />
                <Text style={styles.noResText}>暂无数据</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    );
  };

  const handleTabClick = (tab: any) => {
    if (tab.title === selected) {
      return;
    }
    getRankData(
      moment.unix(tab.date).format('YYYY-MM-DD HH:mm:ss'),
      showIsIncome.is_income,
      type
    );
    setSelected(tab.title);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => setShowIsIncome(pre => ({ ...pre, show: true }))}
        >
          <Text style={styles.headerText}>
            {showIsIncome.is_income ? '收入' : '支出'}
          </Text>
          <Image
            style={styles.icon}
            source={require('@/assets/image/time_down.png')}
          />
        </TouchableOpacity>
      </View>
      <SegmentedControl
        values={['周', '月', '年']}
        selectedIndex={type - 1}
        style={styles.typeControl}
        onChange={handleType}
        tintColor="#f9d96b"
      />
      <View style={styles.Tab}>
        <Tabs
          key={key}
          tabs={tabTitle}
          tabBarPosition="top"
          page={tabTitle.length - 1}
          tabBarTextStyle={{ fontSize: 14 }}
          tabBarUnderlineStyle={{ backgroundColor: '#2c2c2c' }}
          tabBarActiveTextColor="#2c2c2c"
          tabBarInactiveTextColor="#8a8a8a"
          onChange={handleTabClick}
        >
          {renderContent}
        </Tabs>
      </View>
      {IsIncomeModal()}
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: { width: screenWidth },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  headerText: {
    fontSize: 20,
  },
  icon: { width: 15, height: 15, marginLeft: 2 },
  typeControl: { backgroundColor: '#2c2c2c' },
  iscomeModal: { paddingTop: 50 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: screenWidth,
  },
  iconIncomeContainer: {
    width: 50,
    height: 50,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  iconIncome: {
    width: 20,
    height: 20,
  },
  listText: {
    paddingRight: 20,
    width: screenWidth - 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listTextWord: { fontSize: 18 },
  line: { width: screenWidth, height: 1, flexDirection: 'row' },
  lineLeft: { width: 50, height: 1 },
  lineRight: { width: screenWidth - 50, height: 1, backgroundColor: '#bfbfbf' },
  Tab: {
    width: screenWidth,
    height: screenHeight - 130,
  },
  chart: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  chartTop: {
    width: screenWidth - 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'relative',
    top: 20,
  },
  chartTopText: { fontSize: 18, color: '#2c2c2c' },
  chartBottomText: {
    position: 'relative',
    top: 15,
    fontSize: 12,
    color: '#bfbfbf',
  },
  rank: { margin: 10 },
  rankHeader: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankHeaderText: { fontSize: 20, fontWeight: 'bold' },
  rankContainer: {},
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
  noRes: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  noResText: {
    color: '#cbcbcb',
  },
});

export default Chart;
