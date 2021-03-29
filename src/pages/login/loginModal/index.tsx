import React, { Component } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { Button, Modal, Toast } from '@ant-design/react-native';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from '@/utils/connect';
const { GiftedForm, GiftedFormManager } = require('react-native-gifted-form');

interface IProps extends ConnectState, ConnectProps {
  visible: boolean;
  onClose: () => void;
}

type LoginFormType = {
  username: string;
  password: string;
};

interface IState {
  loginForm: LoginFormType;
}

const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
const passwordNoSpaceRegex = /^[^\s]*$/;
// 最少6位，包括至少1个小写字母，1个数字
const passwordRegex = /^.*(?=.{6,})(?=.*\d)(?=.*[a-z]).*$/;

const getValue = (key: string[]) =>
  key.reduce((pre: any, cur) => {
    pre[cur] = GiftedFormManager.getValue('loginForm', cur);
    return pre;
  }, {});

@connect(({ app, loading }: any) => ({
  app,
  dataLoading: loading.effects['app/login'],
}))
export default class LoginModal extends Component<IProps, IState> {
  state: IState = {
    loginForm: {
      username: '',
      password: '',
    },
  };

  handleLoginValueChange = (values: LoginFormType) => {
    this.setState({ loginForm: values });
  };

  render() {
    const { visible, onClose, dispatch, app } = this.props;
    return (
      <Modal animationType="slide" visible={visible}>
        <View style={styles.container}>
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
              title="用户名"
              placeholder="请输入用户名"
              clearButtonMode="while-editing"
              maxLength={16}
              value={this.state.loginForm.username}
            />
            <GiftedForm.TextInputWidget
              name="password"
              title="密码"
              placeholder="请输入密码"
              clearButtonMode="while-editing"
              maxLength={16}
              value={this.state.loginForm.password}
              secureTextEntry={true}
            />
            <Button
              onPress={async () => {
                const { username, password } = getValue([
                  'username',
                  'password',
                ]);
                await (dispatch as Dispatch)({
                  type: 'app/login',
                  payload: { username, password },
                });
                const isLogin = app?.isLogin;
                if (isLogin) {
                  Toast.success('登录成功', 1.5, () => onClose());
                } else {
                  Toast.fail('登录失败，请检查账号或密码是否正确', 1.5);
                }
              }}
            >
              登录
            </Button>
            <Button onPress={onClose}>收起</Button>
          </GiftedForm>
        </View>
      </Modal>
    );
  }
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: { width: screenWidth, height: screenHeight, marginTop: 100 },
});
