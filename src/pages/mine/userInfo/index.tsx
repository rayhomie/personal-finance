import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from '@/utils/connect';
import NavigationUtil from '@/navigator/NavigationUtil';

interface IProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

interface IState {}
@connect(({ app, loading }: IProps) => ({
  app,
  dataLoading: loading.effects['app/login'],
}))
export default class UserInfo extends Component<IProps, IState> {
  render() {
    return (
      <View>
        <TouchableOpacity activeOpacity={0.5} style={styles.container}>
          <Text style={styles.avatar}>头像</Text>
          <Image
            style={styles.picImage}
            source={{
              uri:
                'https://lh3.googleusercontent.com/a-/AOh14GjMcc-Wd3Sc1H7rd2VmWfhPHxucsvaxbuCb-2tb=s96-c-rg-br100',
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} style={styles.container}>
          <Text style={styles.left}>ID</Text>
          <Text style={styles.right}>60420b550b23786d4094dc58</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} style={styles.container}>
          <Text style={styles.left}>用户名</Text>
          <Text style={styles.right}>rayhomie</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} style={styles.container}>
          <Text style={styles.left}>性别</Text>
          <Text style={styles.right}>男</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} style={styles.container}>
          <Text style={styles.left}>手机号</Text>
          <Text style={styles.right}>18280410797</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: 50,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    // marginBottom: 5,
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: { fontSize: 16 },
  picImage: { width: 30, height: 30 },
  left: {},
  right: {},
});
