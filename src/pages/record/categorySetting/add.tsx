/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import {
  Button,
  Toast,
  SegmentedControl,
  InputItem,
} from '@ant-design/react-native';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
import NavigationUtil from '@/navigator/NavigationUtil';
import List from './list';
import { ImageManager } from '@/assets/json/ImageManager';

const IM: any = ImageManager;

const datasource = require('@/assets/json/ACA.json');

interface AddProps extends ConnectState, ConnectProps {}

const Add: React.FC<AddProps> = props => {
  const { dispatch } = props;
  const [payOrIncome, setPayOrIncome] = useState<'pay' | 'income'>('pay'); // 0为支出
  const [selected, setSelected] = useState<any>({
    ...(NavigationUtil.getParams() as any).selectedItem?.item,
  });
  const [input, setInput] = useState<string>('');
  const [updateItem, setUpdateItem] = useState<any>('');

  const handleTab = (e: any) => {
    if (e.nativeEvent.selectedSegmentIndex === 0) {
      setPayOrIncome('pay');
    } else {
      setPayOrIncome('income');
    }
  };

  useEffect(() => {
    if (!(NavigationUtil.getParams() as any).isAdd) {
      setPayOrIncome(selected.is_income === 0 ? 'pay' : 'income');
      setInput(selected.name);
      setUpdateItem(selected);
    }
  }, []);

  const handleAdd = () => {
    const { icon_n, icon_s, icon_l } = selected;
    if (!input) {
      Toast.fail('请输入类别名称', 0.5);
      return;
    }
    (dispatch as Dispatch)({
      type: 'record/insertCategory',
      payload: {
        success: () => {
          Toast.success('添加自定义分类成功', 0.5);
          NavigationUtil.goBack();
        },
        fail: () => {
          Toast.success('分类名称已存在', 0.5);
        },
        is_system: 0,
        name: input,
        is_income: payOrIncome === 'pay' ? 0 : 1,
        icon_n,
        icon_s,
        icon_l,
      },
    });
  };

  const handleUpdate = () => {
    const { icon_n, icon_s, icon_l } = selected;
    if (!input) {
      Toast.fail('请输入类别名称', 0.5);
      return;
    }
    (dispatch as Dispatch)({
      type: 'record/updateCategory',
      payload: {
        success: () => {
          Toast.success('修改自定义分类成功', 0.5);
          NavigationUtil.goBack();
        },
        fail: () => {
          Toast.success('分类名称已存在', 0.5);
        },
        query_id: updateItem._id,
        query_name: updateItem.name,
        name: input,
        is_income: payOrIncome === 'pay' ? 0 : 1,
        icon_n,
        icon_s,
        icon_l,
      },
    });
  };

  return (
    <View style={styles.container}>
      <SegmentedControl
        values={['支出', '收入']}
        selectedIndex={payOrIncome === 'pay' ? 0 : 1}
        onChange={handleTab}
      />
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <InputItem
            placeholder="请输入类别名称"
            placeholderTextColor="#515151"
            style={{ color: '#515151' }}
            maxLength={4}
            clear
            onChange={value => {
              setInput(value);
            }}
            value={input}
          >
            <Image style={styles.InputImg} source={IM[selected.icon_s]} />
          </InputItem>
        </View>
        <Button
          style={styles.add}
          type="primary"
          onPress={() => {
            (NavigationUtil.getParams() as any).isAdd
              ? handleAdd()
              : handleUpdate();
          }}
        >
          {(NavigationUtil.getParams() as any).isAdd ? '添加' : '修改'}
        </Button>
      </View>
      <View style={styles.List}>
        <List
          sections={datasource}
          handleSelect={item => {
            setSelected(item);
          }}
          select={(NavigationUtil.getParams() as any).selectedItem}
          isAdd={(NavigationUtil.getParams() as any).isAdd}
        />
      </View>
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
  inputContainer: { flexDirection: 'row' },
  InputImg: { height: 30, width: 30, marginLeft: 15 },
  input: { width: (screenWidth * 3) / 4, height: 40 },
  add: {
    width: screenWidth / 4,
    borderRadius: 0,
    borderBottomWidth: 0,
    height: 45,
  },
  List: {
    height: screenHeight - 142,
  },
});

export default connect(({ record }: AddProps) => ({
  record,
}))(Add);
