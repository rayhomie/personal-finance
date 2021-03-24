import React, { Component } from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { Button, Modal, SegmentedControl } from '@ant-design/react-native';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from '@/utils/connect';

const { GiftedForm, GiftedFormManager } = require('react-native-gifted-form');

interface IProps extends ConnectState, ConnectProps {
  // dataLoading?: boolean;
  visible: boolean;
  onClose: () => void;
}

type LoginFormType = {
  username: string;
  password: string;
};

type RegisterFormType = {
  username: string;
  password: string;
  mobile_number: string;
  email: string;
};

interface IState {
  showLogin: boolean;
  gender: number;
  loginForm: LoginFormType;
  registerForm: RegisterFormType;
}

const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
const passwordNoSpaceRegex = /^[^\s]*$/;
// 最少6位，包括至少1个小写字母，1个数字
const passwordRegex = /^.*(?=.{6,})(?=.*\d)(?=.*[a-z]).*$/;
const phoneRegex = /^1[3|4|5|7|8][0-9]{9}$/;
const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

@connect(({ app, loading }: IProps) => ({
  app,
  dataLoading: loading.effects['app/login'],
}))
export default class Login extends Component<IProps, IState> {
  state: IState = {
    showLogin: true,
    gender: 1,
    loginForm: {
      username: '',
      password: '',
    },
    registerForm: {
      username: '',
      password: '',
      mobile_number: '',
      email: '',
    },
  };

  handleShowLogin = (value: string) => {
    this.setState({ showLogin: value === '登录' ? true : false });
  };

  handleSex = (value: string) => {
    this.setState({ gender: value === '男' ? 1 : 0 });
  };

  UNSAFE_componentWillReceiveProps(pre: any) {
    if (pre.visible === false) {
    }
  }

  handleLoginValueChange = (values: LoginFormType) => {
    console.log('handleValueChange', values);
    this.setState({ loginForm: values });
  };

  handleRegisterValueChange = (values: RegisterFormType) => {
    console.log('handleValueChange', values);
    this.setState({ registerForm: values });
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
            <GiftedForm
              formName="loginForm"
              onValueChange={this.handleLoginValueChange}
              validators={{
                username: {
                  title: '用户名',
                  validate: [
                    {
                      validator: 'isLength',
                      arguments: [3, 16],
                      message: '{TITLE}长度为{ARGS[0]}到{ARGS[1]}个字符',
                    },
                    {
                      validator: 'matches',
                      arguments: usernameRegex,
                      message:
                        '{TITLE}是由a～z或A~Z的英文字母、0～9的数字或下划线组成',
                    },
                  ],
                },
                password: {
                  title: '密码',
                  validate: [
                    {
                      validator: 'isLength',
                      arguments: [6, 16],
                      message: '{TITLE}长度为{ARGS[0]}到{ARGS[1]}个字符',
                    },
                    {
                      validator: 'matches',
                      arguments: passwordRegex,
                      message: '{TITLE}至少包括1个小写字母，1个数字',
                    },
                    {
                      validator: 'matches',
                      arguments: passwordNoSpaceRegex,
                      message: '{TITLE}中不能使用空格',
                    },
                  ],
                },
              }}
            >
              <GiftedForm.TextInputWidget
                name="username"
                title="username"
                placeholder="please input username"
                clearButtonMode="while-editing"
                maxLength={16}
                value={this.state.loginForm.username}
              />
              <GiftedForm.TextInputWidget
                name="password"
                title="password"
                placeholder="please input password"
                clearButtonMode="while-editing"
                maxLength={16}
                value={this.state.loginForm.password}
                secureTextEntry={true}
              />
              <Button>登录</Button>
            </GiftedForm>
          ) : (
            <GiftedForm
              formName="registerForm"
              onValueChange={this.handleRegisterValueChange}
            >
              <GiftedForm.TextInputWidget
                name="registerUsername"
                title="username"
                placeholder="please input username"
                clearButtonMode="while-editing"
                value={this.state.registerForm.username}
              />
              <GiftedForm.TextInputWidget
                name="registerPassword"
                title="password"
                placeholder="please input password"
                clearButtonMode="while-editing"
                value={this.state.registerForm.password}
                secureTextEntry={true}
              />
              <View style={styles.sex}>
                <Text style={styles.sexText}>gender</Text>
                <SegmentedControl
                  values={['男', '女']}
                  style={styles.sexControl}
                  onValueChange={this.handleSex}
                />
              </View>
              <GiftedForm.TextInputWidget
                name="email"
                title="email"
                keyboardType="email-address"
                placeholder="example@nomads.ly"
                clearButtonMode="while-editing"
                value={this.state.registerForm.email}
              />
              <GiftedForm.TextInputWidget
                name="mobile_number"
                title="mobile_number"
                keyboardType="phone-pad"
                placeholder="please input mobile_number"
                clearButtonMode="while-editing"
                value={this.state.registerForm.mobile_number}
              />
              <Button>注册</Button>
            </GiftedForm>
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
    backgroundColor: 'white',
  },
  sexText: { fontSize: 15, marginLeft: 10 },
  sexControl: { width: 200, height: 30, marginLeft: 50 },
});
