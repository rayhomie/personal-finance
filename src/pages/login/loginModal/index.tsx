import React, { Component } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { Button, Modal } from '@ant-design/react-native';
const { GiftedForm, GiftedFormManager } = require('react-native-gifted-form');

interface IProps {
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

export default class LoginModal extends Component<IProps, IState> {
  state: IState = {
    loginForm: {
      username: '',
      password: '',
    },
  };

  handleLoginValueChange = (values: LoginFormType) => {
    console.log('handleValueChange', values);
    this.setState({ loginForm: values });
  };

  render() {
    const { visible, onClose } = this.props;
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
            <Button>登录</Button>
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