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
  SectionList,
} from 'react-native';
import {
  Button,
  Toast,
  SegmentedControl,
  Modal,
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
  const [selected, setSelected] = useState<any>(1);
  return (
    <View style={styles.container}>
      <InputItem>
        <Image style={styles.Input} source={IM[selected.icon_s]} />
      </InputItem>
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
  Input: { height: 30, width: 30 },
});

export default connect(({ app, user, mine, record, loading }: AddProps) => ({
  app,
  user,
  mine,
  record,
  loading,
}))(Add);
