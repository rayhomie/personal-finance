/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { Modal, InputItem, Toast } from '@ant-design/react-native';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import NavigationUtil from '@/navigator/NavigationUtil';
import { ImageManager } from '@/assets/json/ImageManager';

const IM: any = ImageManager;
interface RecordProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

interface IState {}

enum WeekMap {
  '日',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
}

const Record: React.FC<RecordProps> = props => {
  const { dispatch, record } = props;
  const { incomeTotal, payTotal, classifyList, addBillSuccess } = record as any;
  const dispatchRecord = dispatch as Dispatch;
  const [date, setDate] = useState(new Date());
  const [visible, setVisible] = useState<boolean>(false);
  const [inputModal, setInputModal] = useState<{
    input: string;
    title: '备注' | '金额';
    id: string;
  }>({ input: '', title: '备注', id: '' });
  const [visibleInput, setVisibleInput] = useState<boolean>(false);

  useEffect(() => {
    dispatchRecord({
      type: 'record/getCurMonthTotal',
      payload: { startMonth: moment(date).format('YYYY-MM') },
    });
    dispatchRecord({
      type: 'record/getClassifyList',
      payload: { startMonth: moment(date).format('YYYY-MM') },
    });
  }, [addBillSuccess]);

  const onCloseInput = () => {
    setInputModal(pre => ({ ...pre, input: '', id: '' }));
    setVisibleInput(false);
  };

  const hanleInputDone = async () => {
    const { id, input, title } = inputModal;
    if (title === '金额') {
      if (!/^(\-?)\d+(\.\d+)?$/.test(input)) {
        Toast.fail('请正确输入正数或负数', 1.5);
        return;
      }
    }
    await dispatchRecord({
      type: 'record/updateBill',
      payload: {
        success: () => {
          Toast.success(`${title}修改成功`, 1.5);
        },
        fail: () => {
          Toast.fail(`${title}修改失败,请重试`, 1.5);
        },
        id,
        ...(title === '金额' ? { amount: input } : { remark: input }),
      },
    });
    await onCloseInput();
  };

  const onCloseModal = () => {
    setVisible(false);
    setDate(new Date());
    dispatchRecord({
      type: 'record/getCurMonthTotal',
      payload: { startMonth: moment(new Date()).format('YYYY-MM') },
    });
    dispatchRecord({
      type: 'record/getClassifyList',
      payload: { startMonth: moment(new Date()).format('YYYY-MM') },
    });
  };

  const onModalConfirm = () => {
    setVisible(false);
    dispatchRecord({
      type: 'record/getCurMonthTotal',
      payload: { startMonth: moment(date).format('YYYY-MM') },
    });
    dispatchRecord({
      type: 'record/getClassifyList',
      payload: { startMonth: moment(date).format('YYYY-MM') },
    });
  };

  const renderList = useMemo(
    () => (list: any) => {
      return list.map((item: any) => (
        <View key={item.date}>
          <View style={styles.title}>
            <View style={styles.titleItem}>
              <Text style={styles.titleText}>
                {moment.unix(item.date).format('MM月DD日')}
              </Text>
              <Text style={styles.titleText}>
                {`星期${WeekMap[moment.unix(item.date).weekday()]}`}
              </Text>
            </View>
            <View style={styles.titleItem}>
              {item.income !== 0 && (
                <Text style={styles.titleText}>{`收入：${item.income}`}</Text>
              )}
              {item.expend !== 0 && (
                <Text style={styles.titleText}>{`支出：${item.expend}`}</Text>
              )}
            </View>
          </View>
          {item.item.map((i: any, index: number) => (
            <View style={styles.itemContainer} key={i._id}>
              <View style={styles.item}>
                <TouchableOpacity
                  style={styles.cateImgContainer}
                  onPress={() => handleCate(i._id)}
                >
                  <Image
                    style={styles.cateImg}
                    source={IM[i.category[0].icon_l]}
                  />
                </TouchableOpacity>
                <View
                  style={
                    index !== item.item.length - 1
                      ? styles.right
                      : styles.lastRiht
                  }
                >
                  <TouchableOpacity
                    onPress={() => {
                      setInputModal(pre => ({
                        ...pre,
                        title: '备注',
                        id: i._id,
                      }));
                      setVisibleInput(true);
                    }}
                  >
                    <Text style={styles.name}>
                      {i.remark !== '' ? i.remark : i.category[0].name}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setInputModal(pre => ({
                        ...pre,
                        title: '金额',
                        id: i._id,
                      }));
                      setVisibleInput(true);
                    }}
                  >
                    <Text style={styles.account}>
                      {i.category[0].is_income === 0 ? -i.amount : i.amount}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      ));
    },
    [classifyList]
  );

  const handleCate = (id: string) => {
    NavigationUtil.toPage('记账', { updateId: id });
  };

  return (
    <View style={{ backgroundColor: '#fff' }}>
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
      <ScrollView style={styles.listContainer}>
        {classifyList.length ? (
          renderList(classifyList)
        ) : (
          <View style={styles.noRes}>
            <Image source={require('@/assets/image/no_data.png')} />
            <Text style={styles.noResText}>暂无数据</Text>
          </View>
        )}
      </ScrollView>
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
      <Modal
        popup
        visible={visibleInput}
        animationType="slide"
        onClose={onCloseInput}
        style={styles.modalInput}
      >
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => onCloseInput()}>
            <Text style={styles.btnCancel}>取消</Text>
          </TouchableOpacity>
          <View style={styles.input}>
            <View style={styles.inputItem}>
              <InputItem
                placeholder={`请输入${inputModal.title}...`}
                maxLength={4}
                clear
                value={inputModal.input}
                onChange={input => setInputModal(pre => ({ ...pre, input }))}
              />
            </View>
          </View>
          <TouchableOpacity onPress={() => hanleInputDone()}>
            <Text style={styles.btnConfirm}>确认</Text>
          </TouchableOpacity>
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
    paddingTop: 10,
    paddingBottom: 10,
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
  modalInput: {
    paddingTop: 50,
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
  },
  btnConfirm: { color: '#006fff', fontSize: 18, marginRight: 10 },
  btnText: {
    fontSize: 20,
  },
  datePicker: {
    width: screenWidth,
    justifyContent: 'center',
  },
  listContainer: {
    width: screenWidth,
    marginBottom: 70,
  },
  title: {
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
    borderBottomWidth: 0.4,
    borderBottomColor: '#cdcdcd',
  },
  titleItem: { flexDirection: 'row' },
  titleText: { color: '#bfbfbf', marginLeft: 10, marginRight: 10 },
  itemContainer: {},
  item: { flexDirection: 'row', height: 50 },
  cateImgContainer: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    width: screenWidth - 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.4,
    borderBottomColor: '#cdcdcd',
  },
  lastRiht: {
    width: screenWidth - 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cateImg: { width: 30, height: 30, borderRadius: 15 },
  name: { marginLeft: 10, fontSize: 18 },
  account: { marginRight: 10, fontSize: 18 },
  noRes: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 550,
  },
  noResText: {
    color: '#cbcbcb',
  },
  input: {
    width: screenWidth / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputItem: { width: screenWidth / 3 },
  add: { fontSize: 16, color: '#006fff', marginRight: 10 },
});

export default connect(({ app, record }: RecordProps) => ({
  app,
  record,
}))(Record);
