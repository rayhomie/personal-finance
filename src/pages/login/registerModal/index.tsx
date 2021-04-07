/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import {
  Button,
  Modal,
  SegmentedControl,
  Toast,
} from '@ant-design/react-native';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
const { GiftedForm, GiftedFormManager } = require('react-native-gifted-form');

interface IProps extends ConnectState, ConnectProps {
  visible: boolean;
  onClose: () => void;
}

type RegisterFormType = {
  username: string;
  password: string;
  confirmPassword: string;
  mobile_number: string;
  email: string;
};

const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
const passwordNoSpaceRegex = /^[^\s]*$/;
// 最少6位，包括至少1个小写字母，1个数字
const passwordRegex = /^.*(?=.{6,})(?=.*\d)(?=.*[a-z]).*$/;
const phoneRegex = /^1[3|4|5|7|8][0-9]{9}$/;
const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

const getValue = (key: string[]) =>
  key.reduce((pre: any, cur) => {
    pre[cur] = GiftedFormManager.getValue('registerForm', cur);
    return pre;
  }, {});

const RegisterModal: React.FC<IProps> = props => {
  const { visible, onClose, dispatch } = props;
  const [gender, setGender] = useState<number>(1);
  const [registerForm, setRegisterForm] = useState<RegisterFormType>({
    username: '',
    confirmPassword: '',
    password: '',
    mobile_number: '',
    email: '',
  });

  const handleSex = (value: string) => {
    setGender(value === '男' ? 1 : 0);
  };

  const handleRegisterValueChange = (values: RegisterFormType) => {
    setRegisterForm(values);
  };

  useEffect(() => {
    (dispatch as Dispatch)({ type: 'save', payload: { isRegister: false } });
  }, []);

  return (
    <Modal animationType="slide" visible={visible}>
      <View style={styles.container}>
        <GiftedForm
          formName="registerForm"
          onValueChange={handleRegisterValueChange}
          clearOnClose
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
            confirmPassword: {
              title: '确认密码',
              validate: [
                {
                  validator: (value: string) => {
                    if (value === registerForm.password) {
                      return true;
                    }
                    return false;
                  },
                  message: '请保证两次密码一致',
                },
              ],
            },
            email: {
              title: '邮箱',
              validate: [
                {
                  validator: 'matches',
                  arguments: emailRegex,
                  message: '请按照正确{TITLE}格式输入',
                },
              ],
            },
            mobile_number: {
              title: '手机号',
              validate: [
                {
                  validator: 'matches',
                  arguments: phoneRegex,
                  message: '请正确{TITLE}格式输入',
                },
              ],
            },
          }}
        >
          <GiftedForm.TextInputWidget
            name="username"
            title="用户名"
            maxLength={16}
            placeholder="请填写用户名"
            clearButtonMode="while-editing"
            value={registerForm.username}
          />
          <GiftedForm.TextInputWidget
            name="password"
            title="密码"
            maxLength={16}
            placeholder="请填写密码"
            clearButtonMode="while-editing"
            value={registerForm.password}
            secureTextEntry={true}
          />
          <GiftedForm.TextInputWidget
            name="confirmPassword"
            title="确认密码"
            maxLength={16}
            placeholder="请再次确认密码"
            clearButtonMode="while-editing"
            value={registerForm.confirmPassword}
            secureTextEntry={true}
          />
          <View style={styles.sex}>
            <Text style={styles.sexText}>性别</Text>
            <SegmentedControl
              values={['男', '女']}
              style={styles.sexControl}
              onValueChange={handleSex}
            />
          </View>
          <GiftedForm.TextInputWidget
            name="email"
            title="邮箱"
            keyboardType="email-address"
            placeholder="example@nomads.ly"
            clearButtonMode="while-editing"
            value={registerForm.email}
          />
          <GiftedForm.TextInputWidget
            name="mobile_number"
            title="手机号"
            maxLength={11}
            keyboardType="phone-pad"
            placeholder="请输入11位手机号嘛"
            clearButtonMode="while-editing"
            value={registerForm.mobile_number}
          />
          <Button
            onPress={async () => {
              const data = getValue([
                'username',
                'password',
                'confirmPassword',
                'mobile_number',
                'email',
              ]);
              data.gender = gender;
              if (!usernameRegex.test(data.username)) {
                Toast.fail(
                  '用户名是由3至16位，a～z或A~Z的英文字母、0～9的数字或下划线组成',
                  1.5
                );
                return;
              }
              if (!passwordRegex.test(data.password)) {
                Toast.fail(
                  '密码由至少包括1个小写字母，1个数字组成，且设置至少6位密码',
                  1.5
                );
                return;
              }
              if (data.confirmPassword !== data.password) {
                Toast.fail('请保持两次密码一致', 1.5);
                return;
              }
              if (!emailRegex.test(data.email)) {
                Toast.fail('请按照正确邮箱格式输入', 1.5);
                return;
              }
              if (!phoneRegex.test(data.mobile_number)) {
                Toast.fail('请按照正确手机号格式输入', 1.5);
                return;
              }
              await (dispatch as Dispatch)({
                type: 'app/register',
                payload: {
                  ...data,
                  success: () =>
                    Toast.success('注册成功', 1.5, () => onClose()),
                  fail: () => Toast.fail('用户名已存在，注册失败', 1.5),
                },
              });
            }}
          >
            注册
          </Button>
          <Button onPress={onClose}>收起</Button>
        </GiftedForm>
      </View>
    </Modal>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: { width: screenWidth, height: screenHeight, marginTop: 100 },
  sex: {
    width: screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  sexText: { fontSize: 15, marginLeft: 10 },
  sexControl: { width: 200, height: 30, marginLeft: 55 },
});

export default connect(({ app, user, mine, record, loading }: IProps) => ({
  app,
  user,
  record,
  mine,
  dataLoading: loading?.effects['app/login'],
}))(RegisterModal);
