/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  SegmentedControl,
  Modal,
  InputItem,
  Toast,
} from '@ant-design/react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
import moment from 'moment';
import NavigationUtil from '@/navigator/NavigationUtil';
import { ImageManager } from '@/assets/json/ImageManager';

const category_list = require('@/assets/json/Category.json');

const IM: any = ImageManager;
interface AccountProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

const Account: React.FC<AccountProps> = props => {
  const [payOrIncome, setPayOrIncome] = useState<'pay' | 'income'>('pay'); // 0为支出
  const [categoryList, setCategoryList] = useState<any[]>(
    category_list[payOrIncome]
  );
  const updateId = (NavigationUtil.getParams() as any)?.updateId || '';
  const [visible, setVisible] = useState<boolean>(false);
  const [compute, setCompute] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [clickItem, setClickItem] = useState<any>({});
  const { dispatch, record } = props;
  const { noSystemList, addSuccess, querySystemCategory } = record as any;
  const dispatchRecord = dispatch as Dispatch;

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    (dispatch as Dispatch)({
      type: 'record/getNoSystem',
      payload: { is_income: payOrIncome === 'pay' ? 0 : 1 },
    });
  }, [addSuccess, payOrIncome]);

  useEffect(() => {
    setCategoryList([
      ...category_list[payOrIncome],
      ...(noSystemList ? noSystemList : []),
      {
        id: 'setting',
        name: '设置',
        icon_n: 'tabbar_settings_s',
        icon_s: 'tabbar_settings_s',
        icon_l: 'tabbar_settings_s',
      },
    ]);
  }, [noSystemList, payOrIncome]);

  const onCloseModal = () => {
    setVisible(false);
    setCompute('');
    setInput('');
    setClickItem({});
  };

  const categoryItem = useMemo(
    () => (list: any[]) => {
      return list?.map((i: any) => (
        <TouchableOpacity
          style={styles.category_item}
          key={i.id}
          onPress={() => {
            updateId === '' ? handleClick(i) : handleUpdate(i);
          }}
        >
          <Image
            style={styles.category_icon}
            source={clickItem.icon_n === i.icon_n ? IM[i.icon_s] : IM[i.icon_n]}
          />
          <Text style={styles.category_name}>{i.name}</Text>
        </TouchableOpacity>
      ));
    },
    [categoryList, clickItem]
  );

  const handleTab = (e: any) => {
    if (e.nativeEvent.selectedSegmentIndex === 0) {
      setPayOrIncome('pay');
    } else {
      setPayOrIncome('income');
    }
  };

  const handleClick = (item: any) => {
    setClickItem(item);
    if (item.id === 'setting') {
      NavigationUtil.toPage('分类设置', { payOrIncome });
      return;
    }
    setDate(new Date());
    setVisible(true);
    if (!item._id) {
      dispatchRecord({
        type: 'record/getSystemCategory',
        payload: {
          id: item.id,
          success: () => {},
          fail: () => {
            Toast.fail('服务器错误请客服', 1.5);
          },
        },
      });
    } else {
      console.log('不是');
    }
  };

  const handleUpdate = (item: any) => {
    if (item.id === 'setting') {
      NavigationUtil.toPage('分类设置', { payOrIncome });
      return;
    }
    setClickItem(item);
    if (!item._id) {
      dispatchRecord({
        type: 'record/updateSystemCategory',
        payload: {
          success: () => {
            Toast.success('修改账单分类成功', 1.5);
            NavigationUtil.goBack();
          },
          fail: () => {
            Toast.fail('修改账单分类失败，请重试', 1.5);
          },
          systemId: item.id,
          id: updateId,
        },
      });
    } else {
      dispatchRecord({
        type: 'record/updateBill',
        payload: {
          success: () => {
            Toast.success('修改账单分类成功', 1.5);
            NavigationUtil.goBack();
          },
          fail: () => {
            Toast.fail('修改账单分类失败，请重试', 1.5);
          },
          category_id: item._id,
          id: updateId,
        },
      });
    }
  };

  const handleDone = () => {
    if (compute === '') {
      Toast.fail('请输入金额', 1.5);
      return;
    }
    const category_id = !clickItem._id
      ? querySystemCategory._id
      : clickItem._id;

    dispatchRecord({
      type: 'record/addBill',
      payload: {
        success: () => {
          Toast.success('添加账单成功', 1.5);
          onCloseModal();
          NavigationUtil.goBack();
        },
        fail: () => {
          Toast.fail('添加账单失败，联系客服', 1.5);
        },
        category_id: category_id,
        amount: Number(compute),
        bill_time: moment(date).unix(),
        remark: input,
      },
    });
  };

  const handleCompute = (sign: string) => {
    if (compute) {
      const plus = compute.split('+');
      const sub = compute.split('-');
      if (plus.length === 2) {
        if (plus[0] !== '') {
          if (plus[1] !== '') {
            setCompute((Number(plus[0]) + Number(plus[1])).toString() + sign);
            return;
          } else {
            setCompute(plus[0] + sign);
            return;
          }
        } else {
          return;
        }
      }
      if (sub.length === 2) {
        if (sub[0] !== '') {
          if (sub[1] !== '') {
            setCompute((Number(sub[0]) - Number(sub[1])).toString() + sign);
            return;
          } else {
            setCompute(sub[0] + sign);
            return;
          }
        } else {
          return;
        }
      }

      if (sub.length === 3) {
        if (sub[2] !== '') {
          setCompute((-Number(sub[1]) - Number(sub[2])).toString() + sign);
          return;
        } else {
          setCompute('-' + sub[1] + sign);
          return;
        }
      }
      setCompute(compute + sign);
    }
  };

  const renderDone = () => {
    const hasSign = compute.split('');
    if (
      hasSign.includes('+') ||
      (hasSign.includes('-') && hasSign[0] !== '-')
    ) {
      return (
        <TouchableOpacity onPress={() => handleCompute('')}>
          <View style={styles.itemDone}>
            <Text>=</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => handleDone()}>
          <View style={styles.itemDone}>
            <Text>完成</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <SegmentedControl
        values={['支出', '收入']}
        selectedIndex={0}
        onChange={handleTab}
      />
      <ScrollView>
        <View style={styles.bill_category} key={payOrIncome}>
          {categoryItem(categoryList)}
        </View>
      </ScrollView>
      <Modal
        popup
        visible={visible}
        animationType="slide-up"
        maskClosable
        onClose={onCloseModal}
      >
        <View style={styles.board}>
          <View style={styles.remark}>
            <View style={styles.key}>
              <InputItem
                placeholder="点击写备注..."
                onChange={value => setInput(value)}
                clear
                value={input}
              >
                备注:
              </InputItem>
            </View>
            <View style={styles.showRes}>
              <Text style={{ fontSize: 20 }}>{compute}</Text>
            </View>
          </View>
          <View style={styles.keyboard}>
            <TouchableOpacity
              onPress={() => {
                setCompute(compute + 7);
              }}
            >
              <View style={styles.item}>
                <Text>7</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCompute(compute + 8);
              }}
            >
              <View style={styles.item}>
                <Text>8</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCompute(compute + 9);
              }}
            >
              <View style={styles.item}>
                <Text>9</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.itemDate}>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={'date'}
                locale="zh_CN"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || date;
                  setDate(currentDate);
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setCompute(compute + 4);
              }}
            >
              <View style={styles.item}>
                <Text>4</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCompute(compute + 5);
              }}
            >
              <View style={styles.item}>
                <Text>5</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCompute(compute + 6);
              }}
            >
              <View style={styles.item}>
                <Text>6</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleCompute('+');
              }}
            >
              <View style={styles.item}>
                <Text>+</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCompute(compute + 1);
              }}
            >
              <View style={styles.item}>
                <Text>1</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCompute(compute + 2);
              }}
            >
              <View style={styles.item}>
                <Text>2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCompute(compute + 3);
              }}
            >
              <View style={styles.item}>
                <Text>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleCompute('-');
              }}
            >
              <View style={styles.item}>
                <Text>-</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onCloseModal();
              }}
            >
              <View style={styles.itemCancal}>
                <Text>取消</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCompute(compute + 0);
              }}
            >
              <View style={styles.item}>
                <Text>0</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCompute(res =>
                  res
                    .split('')
                    .slice(0, res.length - 1)
                    .join('')
                );
              }}
            >
              <View style={styles.item}>
                <Text>{'<='}</Text>
              </View>
            </TouchableOpacity>
            {renderDone()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const category_item_width = 70;
const category_icon_width = 50;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const space = (screenWidth - category_item_width * 4) / 5;
const commonStyle: any = {
  width: screenWidth / 4,
  height: 260 / 4,
  alignItems: 'center',
  justifyContent: 'center',
  borderLeftWidth: 1,
  borderBottomWidth: 1,
  borderColor: '#eee',
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    paddingBottom: 50,
    height: screenHeight - 70,
    backgroundColor: '#fff',
  },
  bill_category: {
    width: screenWidth,
    color: 'pink',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: space,
  },
  category_item: {
    width: category_item_width,
    height: category_item_width,
    marginLeft: space,
    marginTop: space,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  category_icon: {
    width: category_icon_width,
    height: category_icon_width,
    borderRadius: category_icon_width / 2,
  },
  category_name: { fontSize: 14 },
  board: { width: screenWidth, height: 300 },
  remark: {
    width: screenWidth,
    flexDirection: 'row',
  },
  key: { width: (screenWidth * 3) / 4 },
  showRes: {
    width: screenWidth / 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  keyboard: {
    width: screenWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    ...commonStyle,
  },
  itemDone: { ...commonStyle, backgroundColor: '#ffde3c' },
  itemCancal: { ...commonStyle, backgroundColor: '#eee' },
  itemDate: {
    width: screenWidth / 4,
    height: 260 / 4,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingLeft: 8,
    paddingTop: 15,
  },
});

export default connect(
  ({ app, user, mine, record, loading }: AccountProps) => ({
    app,
    user,
    record,
    mine,
    dataLoading: loading?.effects['app/login'],
  })
)(Account);
