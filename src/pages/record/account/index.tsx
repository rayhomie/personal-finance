import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Button, Toast, SegmentedControl } from '@ant-design/react-native';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
import NavigationUtil from '@/navigator/NavigationUtil';
import { ImageManager } from '@/assets/json/ImageManager';

const category_list = require('@/assets/json/Category.json');

interface AccountProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

const Account: React.FC<AccountProps> = props => {
  const [payOrIncome, setPayOrIncome] = useState<'pay' | 'income'>('pay'); // 0为支出

  const categoryItem = (list: any) => {
    const IM: any = ImageManager;
    return list.map((i: any) => (
      <TouchableOpacity
        style={styles.category_item}
        key={i.id}
        onPress={() => handleClick(i.id)}
      >
        <Image style={styles.category_icon} source={IM[i.icon_n]} />
        <Text style={styles.category_name}>{i.name}</Text>
      </TouchableOpacity>
    ));
  };

  const handleTab = (e: any) => {
    if (e.nativeEvent.selectedSegmentIndex === 0) {
      setPayOrIncome('pay');
    } else {
      setPayOrIncome('income');
    }
  };

  const handleClick = (value: any) => {
    if (value === 'setting') {
      NavigationUtil.toPage('分类设置');
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
          {categoryItem([
            ...category_list[payOrIncome],
            { id: 'setting', name: '设置', icon_n: 'tabbar_settings_n' },
          ])}
        </View>
      </ScrollView>
    </View>
  );
};

const category_item_width = 70;
const category_icon_width = 50;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const space = (screenWidth - category_item_width * 4) / 5;

const styles = StyleSheet.create({
  container: { width: screenWidth, height: screenHeight - 180 },
  bill_category: {
    width: screenWidth,
    // backgroundColor: 'pink',
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
});

export default connect(({ app, user, mine, loading }: AccountProps) => ({
  app,
  user,
  mine,
  dataLoading: loading?.effects['app/login'],
}))(Account);
