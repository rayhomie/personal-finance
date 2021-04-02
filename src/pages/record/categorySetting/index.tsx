import React, { useState } from 'react';
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

  const handleTab = (e: any) => {
    if (e.nativeEvent.selectedSegmentIndex === 0) {
      setPayOrIncome('pay');
    } else {
      setPayOrIncome('income');
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity>
        <Image source={IM[item.icon_n]} />
        <Text>{item.name}</Text>
      </TouchableOpacity>
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
          data={category_list[payOrIncome]}
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
});

export default connect(
  ({ app, user, mine, loading }: CategorySettingProps) => ({
    app,
    user,
    mine,
    loading,
  })
)(CategorySetting);
