/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Button, Toast, Modal } from '@ant-design/react-native';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import NavigationUtil from '@/navigator/NavigationUtil';
interface RecordProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

interface IState {}

const Record: React.FC<RecordProps> = props => {
  const { dispatch, record } = props;
  const { incomeTotal, payTotal } = record as any;
  const dispatchRecord = dispatch as Dispatch;
  const [date, setDate] = useState(new Date());
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    dispatchRecord({
      type: 'record/getCurMonthTotal',
      payload: { startMonth: moment(date).format('YYYY-MM') },
    });
    dispatchRecord({
      type: 'record/getClassifyList',
      payload: { startMonth: moment(date).format('YYYY-MM') },
    });
  }, []);

  const onCloseModal = () => {
    setVisible(false);
    setDate(new Date());
    dispatchRecord({
      type: 'record/getCurMonthTotal',
      payload: { startMonth: moment(new Date()).format('YYYY-MM') },
    });
  };

  const onModalConfirm = () => {
    setVisible(false);
    dispatchRecord({
      type: 'record/getCurMonthTotal',
      payload: { startMonth: moment(date).format('YYYY-MM') },
    });
  };

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
            setDate(new Date());
          }}
          style={styles.headerItemMonth}
        >
          <Text style={styles.topText}>{moment(date).year()}年</Text>
          <View style={styles.bottomMonthView}>
            <Text style={styles.bottomMonth}>{moment(date).month() + 1}</Text>
            <Text style={styles.month}>月</Text>
            <Image
              style={styles.icon}
              source={require('@/assets/image/time_down.png')}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerItem}>
          <Text style={styles.topText}>收入</Text>
          <Text style={styles.bottomText}>
            {Number(incomeTotal).toFixed(2)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerItem}>
          <Text style={styles.topText}>支出</Text>
          <Text style={styles.bottomText}>{Number(payTotal).toFixed(2)}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        popup
        visible={visible}
        animationType="slide-up"
        onClose={onCloseModal}
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
      </Modal>
    </View>
  );
};

export const Add = () => {
  return (
    <TouchableOpacity
      onPress={() => {
        NavigationUtil.toPage('记账');
      }}
    >
      <Text style={styles.add}>记账</Text>
    </TouchableOpacity>
  );
};

const screenWidth = Dimensions.get('window').width;
const headerItemStyle: any = {
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  height: 45,
};

const styles = StyleSheet.create({
  header: {
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: 'pink',
  },
  headerItem: { ...headerItemStyle, width: screenWidth / 4, marginLeft: 20 },
  headerItemMonth: {
    ...headerItemStyle,
    width: screenWidth / 5,
    marginLeft: 15,
  },
  topText: { fontSize: 12 },
  bottomMonth: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  month: { fontSize: 16 },
  icon: { width: 15, height: 15, marginLeft: 5 },
  bottomMonthView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomText: { fontSize: 18 },
  modal: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -10,
  },
  btnCancel: {
    fontSize: 18,
    marginLeft: 10,
  },
  btnConfirm: { color: '#006fff', fontSize: 18, marginRight: 10 },
  btnText: {
    fontSize: 20,
  },
  datePicker: {
    width: screenWidth,
    justifyContent: 'center',
  },
  add: { fontSize: 16, color: '#006fff', marginRight: 10 },
});

export default connect(({ app, record }: RecordProps) => ({
  app,
  record,
}))(Record);
