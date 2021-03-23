import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Modal,
  InputItem,
  SegmentedControl,
} from '@ant-design/react-native';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from '@/utils/connect';

interface IProps extends ConnectState, ConnectProps {
  // dataLoading?: boolean;
  visible: boolean;
  onClose: () => void;
}

interface IState {
  showLogin: boolean;
  gender: number;
}
@connect(({ app, loading }: IProps) => ({
  app,
  dataLoading: loading.effects['app/login'],
}))
export default class Login extends Component<IProps, IState> {
  state: IState = {
    showLogin: true,
    gender: 1,
  };

  handleShowLogin = (value: string) => {
    this.setState({ showLogin: value === '登录' ? true : false });
  };

  handleSex = (value: string) => {
    this.setState({ gender: value === '男' ? 1 : 0 });
  };

  render() {
    const { visible, onClose } = this.props;
    return (
      <Modal popup visible={visible}>
        <View style={styles.container}>
          <SegmentedControl
            tintColor="#ffb8c4"
            values={['登录', '注册']}
            style={styles.tabs}
            onValueChange={this.handleShowLogin}
          />
          {this.state.showLogin ? (
            <View style={styles.login}>
              <InputItem
                clear
                placeholder="请输入用户名"
                name="username"
                maxLength={15}
              >
                用户名：
              </InputItem>
              <InputItem
                type="password"
                clear
                placeholder="请输入密码"
                name="password"
              >
                密码：
              </InputItem>
              <Button>登录</Button>
            </View>
          ) : (
            <View style={styles.register}>
              <InputItem
                clear
                placeholder="请输入用户名"
                name="username"
                maxLength={15}
              >
                用户名：
              </InputItem>
              <InputItem
                type="password"
                clear
                placeholder="请输入密码"
                name="password"
              >
                密码：
              </InputItem>
              <View style={styles.sex}>
                <Text style={styles.sexText}>性别：</Text>
                <SegmentedControl
                  values={['男', '女']}
                  style={styles.sexControl}
                  onValueChange={this.handleSex}
                />
              </View>
              <InputItem
                type="phone"
                clear
                placeholder="请输入手机号"
                name="password"
              >
                手机号
              </InputItem>
              <Button>注册</Button>
            </View>
          )}
          <Button onPress={onClose}>收起</Button>
        </View>
      </Modal>
    );
  }
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: { width: screenWidth, height: screenHeight, marginTop: 100 },
  tabs: { width: screenWidth },
  login: {},
  register: {},
  sex: {
    width: screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sexText: { fontSize: 17, marginLeft: 15 },
  sexControl: { width: 200, height: 30, marginLeft: 30 },
});
