import React, { useState } from 'react';
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
  const [selected, setSelected] = useState<any>(1);
  const [input, setInput] = useState<string>('');

  const handleTab = (e: any) => {
    if (e.nativeEvent.selectedSegmentIndex === 0) {
      setPayOrIncome('pay');
    } else {
      setPayOrIncome('income');
    }
  };

  const handleAdd = () => {
    const { icon_n, icon_s, icon_l } = selected;
    if (!input) {
      Toast.fail('请输入类别名称', 1.5);
      return;
    }
    (dispatch as Dispatch)({
      type: 'record/insertCategory',
      payload: {
        success: () => {
          Toast.success('添加自定义分类成功', 1.5);
          NavigationUtil.goBack();
        },
        fail: () => {
          Toast.success('分类名称已存在', 1.5);
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
            maxLength={4}
            clear
            onChange={value => {
              setInput(value);
            }}
          >
            <Image style={styles.InputImg} source={IM[selected.icon_s]} />
          </InputItem>
        </View>
        <Button
          style={styles.add}
          type="primary"
          onPress={() => {
            handleAdd();
          }}
        >
          添加
        </Button>
      </View>
      <List
        sections={datasource}
        handleSelect={item => {
          setSelected(item);
        }}
      />
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {},
  inputContainer: { flexDirection: 'row' },
  InputImg: { height: 30, width: 30, marginLeft: 15 },
  input: { width: (screenWidth * 3) / 4, height: 40 },
  add: {
    width: screenWidth / 4,
    borderRadius: 0,
    borderBottomWidth: 0,
    height: 45,
  },
});

export default connect(({ record }: AddProps) => ({
  record,
}))(Add);
