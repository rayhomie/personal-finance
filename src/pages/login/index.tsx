import React, { Component } from 'react';
import { Dimensions, View, Text, StyleSheet, TextInput } from 'react-native';
import { Button, Modal, SegmentedControl } from '@ant-design/react-native';
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
  loginUsername: string;
  loginPassword: string;
  registerUsername: string;
  registerPassword: string;
  registerMobile_number: string;
  registerEmail: string;
}

const usernameRegex = /^[a-zA-Z0-9_]{4,12}$/g;
const passwordNoSpaceRegex = /^[^\s]*$/g;
// 最少6位，包括至少1个小写字母，1个数字
const passwordRegex = /^.*(?=.{6,})(?=.*\d)(?=.*[a-z]).*$/g;
const phoneRegex = /^1[3|4|5|7|8][0-9]{9}$/;
const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g;

const phoneDelSpace = (value: string) => {
  return value.split(' ').join('');
};

@connect(({ app, loading }: IProps) => ({
  app,
  dataLoading: loading.effects['app/login'],
}))
export default class Login extends Component<IProps, IState> {
  state: IState = {
    showLogin: true,
    gender: 1,
    loginUsername: '',
    loginPassword: '',
    registerUsername: '',
    registerPassword: '',
    registerMobile_number: '',
    registerEmail: '',
  };

  loginUsernameChange = (value: string) => {
    console.log(value);
    this.setState({ loginUsername: value });
  };

  loginPasswordChange = (value: string) => {
    this.setState({ loginPassword: value });
  };

  registerUsernameChange = (value: string) => {
    this.setState({
      registerUsername: value,
    });
  };

  registerPasswordChange = (value: string) => {
    this.setState({
      registerPassword: value,
    });
  };

  registerMobile_numberChange = (value: string) => {
    this.setState({
      registerMobile_number: phoneDelSpace(value),
    });
  };

  registerEmailChange = (value: string) => {
    this.setState({
      registerEmail: value,
    });
  };

  handleShowLogin = (value: string) => {
    this.setState({ showLogin: value === '登录' ? true : false });
  };

  handleSex = (value: string) => {
    this.setState({ gender: value === '男' ? 1 : 0 });
  };

  loginUsernameOnblur = (value?: string) => {
    if (usernameRegex.test(value || '')) {
      return;
    } else {
      this.setState({
        loginUsername: '',
      });
    }
  };

  registerUsernameOnblur = () => {
    if (!usernameRegex.test(this.state.registerUsername || '')) {
      console.log(111);
      this.setState({
        registerUsername: '',
      });
    } else {
      console.log(222);
    }

    console.log(33);
  };

  registerPasswordOnblur = (value?: string) => {
    if (
      passwordRegex.test(value || '') &&
      passwordNoSpaceRegex.test(value || '')
    ) {
    } else {
      this.setState({
        registerPassword: '',
      });
    }
  };

  registerMobile_numberOnblur = (value?: string) => {
    if (phoneRegex.test(phoneDelSpace(value || ''))) {
      return;
    } else {
      this.setState({
        registerMobile_number: '',
      });
    }
  };

  registerEmailOnblur = (value?: string) => {
    if (emailRegex.test(value || '')) {
      return;
    } else {
      this.setState({
        registerEmail: '',
      });
    }
  };

  UNSAFE_componentWillReceiveProps(pre: any) {
    if (pre.visible === false) {
      this.setState({
        showLogin: true,
        gender: 1,
        loginUsername: '',
        loginPassword: '',
        registerUsername: '',
        registerPassword: '',
        registerMobile_number: '',
        registerEmail: '',
      });
    }
  }

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
              <Text>用户名：</Text>
              <TextInput
                placeholder="请输入用户名"
                maxLength={12}
                value={this.state.loginUsername}
                onChangeText={this.loginUsernameChange}
                // onBlur={this.loginUsernameOnblur}
              />
              <Text>密码：</Text>
              <TextInput
                placeholder="请输入密码"
                maxLength={12}
                value={this.state.loginPassword}
                onChangeText={this.loginPasswordChange}
              />
              <Button>登录</Button>
            </View>
          ) : (
            <View style={styles.register}>
              <Text>用户名：</Text>
              <TextInput
                placeholder="请输入用户名"
                maxLength={12}
                value={this.state.registerUsername}
                onChangeText={this.registerUsernameChange}
                onBlur={this.registerUsernameOnblur}
              />
              <Text>密码：</Text>
              <TextInput
                placeholder="请输入密码"
                maxLength={12}
                value={this.state.registerPassword}
                onChangeText={this.registerPasswordChange}
                // onBlur={this.registerPasswordOnblur}
              />
              <View style={styles.sex}>
                <Text style={styles.sexText}>性别：</Text>
                <SegmentedControl
                  values={['男', '女']}
                  style={styles.sexControl}
                  onValueChange={this.handleSex}
                />
              </View>
              <Text>手机号：</Text>
              <TextInput
                keyboardType="phone-pad"
                placeholder="请输入手机号"
                value={this.state.registerMobile_number}
                onChangeText={this.registerMobile_numberChange}
                // onBlur={this.registerMobile_numberOnblur}
              />
              <Text>Email：</Text>
              <TextInput
                keyboardType="email-address"
                placeholder="请输入email"
                value={this.state.registerEmail}
                onChangeText={this.registerEmailChange}
                // onBlur={this.registerEmailOnblur}
              />
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
