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
  ScrollView,
} from 'react-native';
import { Button, Toast, SegmentedControl } from '@ant-design/react-native';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
import NavigationUtil from '@/navigator/NavigationUtil';
import { ImageManager } from '@/assets/json/ImageManager';

const category_list = require('@/assets/json/Category.json');

const IM: any = ImageManager;

interface CategorySettingProps extends ConnectState, ConnectProps {}

interface CategorySettingState {}

const CategorySetting: React.FC<CategorySettingProps> = props => {
  const [payOrIncome, setPayOrIncome] = useState<'pay' | 'income'>('pay'); // 0为支出
  const [categoryList, setCategoryList] = useState<any[]>(
    category_list[payOrIncome]
  );
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

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.item}>
        {item.is_system === 1 ? (
          <View style={styles.delete} />
        ) : (
          <TouchableOpacity>
            <Image style={styles.delete} source={IM.category_delete} />
          </TouchableOpacity>
        )}
        <Image style={styles.icon} source={IM[item.icon_n]} />
        <Text style={styles.name}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <SegmentedControl
          values={['支出', '收入']}
          selectedIndex={0}
          onChange={handleTab}
        />
        <FlatList
          key={payOrIncome}
          style={styles.FlatList}
          data={categoryList}
          renderItem={renderItem}
          keyExtractor={item => item.name}
        />
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: { width: screenWidth, paddingBottom: 100 },
  FlatList: {},
  item: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
    height: 50,
    borderBottomColor: '#eee',
    borderBottomWidth: 2,
  },
  delete: { width: 25, height: 25 },
  icon: { width: 40, height: 40, marginLeft: 10 },
  name: { fontSize: 15, marginLeft: 10 },
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
