/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {
  Button,
  Toast,
  SegmentedControl,
  Modal,
} from '@ant-design/react-native';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
import NavigationUtil from '@/navigator/NavigationUtil';
import { ImageManager } from '@/assets/json/ImageManager';

const category_list = require('@/assets/json/Category.json');

const IM: any = ImageManager;

interface CategorySettingProps extends ConnectState, ConnectProps {}

type curDelType = {
  id: string;
  name: string;
};

const CategorySetting: React.FC<CategorySettingProps> = props => {
  const [payOrIncome, setPayOrIncome] = useState<'pay' | 'income'>(
    (NavigationUtil.getParams() as any).payOrIncome || 'pay'
  ); // 0为支出
  const [categoryList, setCategoryList] = useState<any[]>(
    category_list[payOrIncome]
  );
  const [visible, setVisible] = useState<boolean>(false);
  const [curDel, setCurDel] = useState<curDelType>({ id: '', name: '' });
  const { dispatch, record } = props;
  const { noSystemList } = record as any;

  useEffect(() => {
    (dispatch as Dispatch)({
      type: 'record/getNoSystem',
      payload: { is_income: payOrIncome === 'pay' ? 0 : 1 },
    });
  }, [payOrIncome]);

  useEffect(() => {
    setCategoryList([
      ...category_list[payOrIncome],
      ...(noSystemList ? noSystemList : []),
    ]);
  }, [noSystemList, payOrIncome]);

  const handleTab = (e: any) => {
    if (e.nativeEvent.selectedSegmentIndex === 0) {
      setPayOrIncome('pay');
    } else {
      setPayOrIncome('income');
    }
  };

  const openDelete = ({ id, name }: curDelType) => {
    setCurDel({ id, name });
    setVisible(true);
  };

  const onCloseModal = () => {
    setVisible(false);
    setCurDel({ id: '', name: '' });
  };

  const handleDelte = () => {
    const { id, name } = curDel;
    (dispatch as Dispatch)({
      type: 'record/delCategory',
      payload: {
        success: () => {
          (dispatch as Dispatch)({
            type: 'record/getNoSystem',
            payload: { is_income: payOrIncome === 'pay' ? 0 : 1 },
          });
          Toast.success(`”${name}“分类删除成功`, 0.5);
          setVisible(false);
        },
        fail: () => {
          Toast.fail(`”${name}“分类删除失败，请重试`, 0.5);
          setVisible(false);
        },
        id,
        name,
      },
    });
  };

  const updateCate = (item: any) => {
    NavigationUtil.toPage('添加分类', { isAdd: false, selectedItem: item });
  };

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.item}>
        {item.is_system === 1 ? (
          <View style={styles.delete} />
        ) : (
          <TouchableOpacity
            onPress={() => openDelete({ id: item._id, name: item.name })}
          >
            <Image style={styles.delete} source={IM.category_delete} />
          </TouchableOpacity>
        )}
        {item.is_system === 1 ? (
          <>
            <Image style={styles.icon} source={IM[item.icon_n]} />
            <Text style={styles.name}>
              {item.is_system === 1 ? item.name : `${item.name}（自定义）`}
            </Text>
          </>
        ) : (
          <TouchableOpacity
            style={styles.touch}
            onPress={() => updateCate({ item })}
          >
            <Image style={styles.icon} source={IM[item.icon_n]} />
            <Text style={styles.name}>
              {item.is_system === 1 ? item.name : `${item.name}（自定义）`}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SegmentedControl
        values={['支出', '收入']}
        selectedIndex={payOrIncome === 'pay' ? 0 : 1}
        onChange={handleTab}
      />
      <View style={styles.FlatList}>
        <FlatList
          key={payOrIncome}
          data={categoryList}
          renderItem={renderItem}
          keyExtractor={item => item.name}
        />
      </View>
      <Modal
        popup
        visible={visible}
        animationType="slide-up"
        onClose={onCloseModal}
        maskClosable
      >
        <View style={styles.modal}>
          <Text style={styles.tip}>确认删除“{curDel.name}”分类吗？</Text>
          <Text style={styles.tips}>删除分类也会删除对应的账单哦？</Text>
        </View>
        <View style={styles.button}>
          <Button style={styles.cancel} onPress={onCloseModal}>
            取消
          </Button>
          <Button style={styles.del} type="warning" onPress={handleDelte}>
            删除
          </Button>
        </View>
      </Modal>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    backgroundColor: '#fff',
  },
  FlatList: {
    height: screenHeight - 100,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
    height: 50,
    borderBottomColor: '#eee',
    borderBottomWidth: 0.5,
  },
  delete: { width: 25, height: 25 },
  icon: { width: 40, height: 40, marginLeft: 10 },
  name: { fontSize: 15, marginLeft: 10 },
  modal: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tip: { fontSize: 20 },
  tips: { marginTop: 15, fontSize: 15, color: '#e64646' },
  button: { flexDirection: 'row' },
  cancel: { width: screenWidth / 2, height: 60, borderRadius: 0 },
  del: { width: screenWidth / 2, height: 60, borderRadius: 0 },
  add: { fontSize: 16, color: '#006fff', marginRight: 10 },
});

export default connect(
  ({ app, user, mine, record, loading }: CategorySettingProps) => ({
    app,
    user,
    mine,
    record,
    loading,
  })
)(CategorySetting);

export const Add = () => {
  return (
    <TouchableOpacity
      onPress={() => {
        NavigationUtil.toPage('添加分类', { isAdd: true });
      }}
    >
      <Text style={styles.add}>添加分类</Text>
    </TouchableOpacity>
  );
};
