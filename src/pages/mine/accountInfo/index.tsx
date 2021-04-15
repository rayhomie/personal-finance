/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import moment from 'moment';
import { Modal } from '@ant-design/react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import NavigationUtil from '@/navigator/NavigationUtil';
import { mineAccount } from '@/service/bill';

interface AccountInfoProps {}

type TotalType = {
  pay_total: number;
  income_total: number;
};

type ListItemType = {
  date: string;
  pay_total: number;
  income_total: number;
};

const AccountInfo: React.FC<AccountInfoProps> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [total, setTotal] = useState<TotalType>({
    pay_total: 0,
    income_total: 0,
  });
  const [list, setList] = useState<ListItemType[]>([]);
  const [nores, setNores] = useState<boolean>(true);

  useEffect(() => {
    getMineAccount(date);
    return () => {
      setList([]);
      setTotal({
        pay_total: 0,
        income_total: 0,
      });
    };
  }, []);

  useEffect(() => {
    if (!list.length) return;
    const [hasPay, hasIncome] = list.reduce(
      (pre, cur) => {
        if (cur.pay_total) {
          pre[0] = 1;
          return pre;
        }
        if (cur.income_total) {
          pre[1] = 1;
          return pre;
        }
        return pre;
      },
      [0, 0]
    );
    if (hasIncome === 0 && hasPay === 0) {
      setNores(false);
      return;
    }
    setNores(true);
  }, [list]);

  const getMineAccount = async (value: Date) => {
    const res = await mineAccount({
      date: moment(value).format('YYYY-MM-DD HH:mm:ss'),
    });
    const { year_income_total, year_pay_total } = res.data;
    setTotal({ income_total: year_income_total, pay_total: year_pay_total });
    setList(res.data.docs);
    console.log(res.data);
  };

  const onCloseModal = () => {
    setVisible(false);
    setDate(new Date());
  };

  const onModalConfirm = () => {
    setVisible(false);
    getMineAccount(date);
  };

  const DateModal = useMemo(
    () => (
      <Modal
        popup
        visible={visible}
        animationType="slide-up"
        onClose={onCloseModal}
        maskClosable
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.5, y: 0.65 }}
          locations={[0, 1]}
          colors={['#ffeaaa', '#fffcdc']}
          style={styles.modal}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => onCloseModal()}>
              <Text style={styles.btnCancel}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.btnText}>选择日期</Text>
            <TouchableOpacity onPress={() => onModalConfirm()}>
              <Text style={styles.btnConfirm}>确认</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.datePicker}>
            <DateTimePicker
              testID="datePicker"
              value={date}
              mode={'date'}
              dateFormat="dayofweek day month"
              is24Hour={true}
              locale="zh_CN"
              display="spinner"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || date;
                console.log(selectedDate);
                setDate(currentDate);
              }}
            />
          </View>
        </LinearGradient>
      </Modal>
    ),
    [date, visible]
  );

  const Rest = useMemo(
    () => (
      <View style={styles.rest}>
        <View style={styles.restTop}>
          <Text style={styles.restTopTitleText}>结余</Text>
          <Text style={styles.restTopValueText}>
            {total.income_total - total.pay_total}
          </Text>
        </View>
        <View style={styles.restBottom}>
          <View style={styles.restBottomLeft}>
            <Text style={styles.restBottomTitle}>收入</Text>
            <Text style={styles.restBottomValue}>{total.income_total}</Text>
          </View>
          <View style={styles.middle} />
          <View style={styles.restBottomRight}>
            <Text style={styles.restBottomTitle}>支出</Text>
            <Text style={styles.restBottomValue}>{total.pay_total}</Text>
          </View>
        </View>
      </View>
    ),
    [total]
  );

  const renderItem = ({ item }: any) => {
    return item.income_total === 0 && item.pay_total === 0 ? (
      <></>
    ) : (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          NavigationUtil.toPage('月度账单报表', { date: item.date })
        }
      >
        <View style={styles.date}>
          <Text style={styles.dateText}>
            {moment.unix(item.date).format('M月')}
          </Text>
        </View>
        <View style={styles.income}>
          <Text style={styles.text}>{item.income_total}</Text>
        </View>
        <View style={styles.pay}>
          <Text style={styles.text}>{item.pay_total}</Text>
        </View>
        <View style={styles.inrest}>
          <Text style={styles.text}>{item.income_total - item.pay_total}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Image
            style={styles.icon_left}
            source={require('@/assets/image/ad_arrow.png')}
          />
        </View>
      </TouchableOpacity>
    );
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
        <TouchableOpacity
          style={styles.headerTitle}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.headerTitleText}>
            {moment(date).format('YYYY')}
          </Text>
          <Image
            style={styles.icon}
            source={require('@/assets/image/time_down.png')}
          />
        </TouchableOpacity>
      </View>
      {Rest}
      <View style={styles.itemTitle}>
        <View style={styles.date}>
          <Text style={styles.titleText}>月份</Text>
        </View>
        <View style={styles.income}>
          <Text style={styles.titleText}>收入</Text>
        </View>
        <View style={styles.pay}>
          <Text style={styles.titleText}>支出</Text>
        </View>
        <View style={styles.inrest}>
          <Text style={styles.titleText}>结余</Text>
        </View>
      </View>
      {nores ? (
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item.date}
          style={{ marginBottom: 80 }}
        />
      ) : (
        <View style={styles.noRes}>
          <Image source={require('@/assets/image/no_data.png')} />
          <Text style={styles.noResText}>暂无数据</Text>
        </View>
      )}

      {DateModal}
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#fad749',
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
    width: 64,
    marginLeft: screenWidth / 2 - 112,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: { fontSize: 20 },
  icon: { width: 15, height: 15, marginLeft: 5 },
  rest: { height: 150, backgroundColor: '#fad749' },
  restTop: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restTopTitleText: {
    fontSize: 15,
    color: '#515151',
    marginBottom: 10,
  },
  restTopValueText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  restBottom: {
    height: 50,
    flexDirection: 'row',
  },
  restBottomLeft: {
    flexDirection: 'row',
    width: screenWidth / 2 - 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  middle: { width: 1, height: 20, marginTop: 12, backgroundColor: '#515151' },
  restBottomRight: {
    flexDirection: 'row',
    width: screenWidth / 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  restBottomTitle: {
    fontSize: 12,
    marginBottom: 18,
    marginRight: 5,
    color: '#515151',
  },
  restBottomValue: { fontSize: 20, marginBottom: 15 },
  modal: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -10,
  },
  btnCancel: {
    fontSize: 18,
    marginLeft: 10,
    color: '#FDB99B',
  },
  btnConfirm: { color: '#d9a7c7', fontSize: 18, marginRight: 10 },
  btnText: {
    fontSize: 20,
    color: '#FDB99B',
  },
  datePicker: {
    width: screenWidth,
    justifyContent: 'center',
  },
  itemTitle: {
    height: 30,
    flexDirection: 'row',
  },
  item: {
    height: 48,
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
  },
  date: {
    width: (screenWidth * 1) / 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pay: {
    width: (screenWidth * 2.7) / 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  income: {
    width: (screenWidth * 2.7) / 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inrest: {
    width: (screenWidth * 2.7) / 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon_left: {
    width: 15,
    height: 15,
  },
  dateText: { fontSize: 15, color: '#515151' },
  text: { fontSize: 15 },
  titleText: { fontSize: 12, color: '#515151' },
  noRes: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 550,
  },
  noResText: {
    color: '#cbcbcb',
  },
});

export default AccountInfo;
