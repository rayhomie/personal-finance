import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import { Button, Toast } from '@ant-design/react-native';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
import NavigationUtil from '@/navigator/NavigationUtil';
import { ImageManager } from '@/assets/json/ImageManager';

const category_list = require('@/assets/json/Category.json');

interface AccountProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

interface IState {}

const payList = category_list.pay;

const Account: React.FC<AccountProps> = props => {
  const categoryItem = () => {
    return payList.map((i: any) => (
      <View style={styles.category_item} key={i.id}>
        <Image style={styles.category_icon} source={ImageManager[i.icon_l]} />
        <Text style={styles.category_name}>{i.name}</Text>
      </View>
    ));
  };

  return (
    <ScrollView>
      <View style={styles.bill_category}>{categoryItem()}</View>
      <Button
        onPress={() => {
          NavigationUtil.toPage('分类设置');
        }}
      >
        添加分类
      </Button>
    </ScrollView>
  );
};

const category_item_width = 70;
const category_icon_width = 50;
const screenWidth = Dimensions.get('window').width;
const space = (screenWidth - category_item_width * 4) / 5;

const styles = StyleSheet.create({
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
