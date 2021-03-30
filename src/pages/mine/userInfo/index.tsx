import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Toast,
  Modal,
  SegmentedControl,
} from '@ant-design/react-native';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from '@/utils/connect';
import { userinfo } from '@/service/user';
import NavigationUtil from '@/navigator/NavigationUtil';
const { GiftedForm, GiftedFormManager } = require('react-native-gifted-form');

interface IProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

interface IState {
  userInfo: {
    avatar_url: string;
    username: string;
    gender: number;
    email: string;
    mobile_number: string;
    _id: string;
  };
  gender: number;
  passwordForm: PasswordFormType;
}

type PasswordFormType = {
  password: string;
  confirmPassword: string;
};

const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
const phoneRegex = /^1[3|4|5|7|8][0-9]{9}$/;
const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
const passwordRegex = /^.*(?=.{6,})(?=.*\d)(?=.*[a-z]).*$/;
const passwordNoSpaceRegex = /^[^\s]*$/;

@connect(({ app, user, loading }: IProps) => ({
  app,
  user,
  dataLoading: loading?.effects['app/login'],
}))
export default class UserInfo extends Component<IProps, IState> {
  state: IState = {
    userInfo: {
      avatar_url:
        'https://lh3.googleusercontent.com/a-/AOh14GjMcc-Wd3Sc1H7rd2VmWfhPHxucsvaxbuCb-2tb=s96-c-rg-br100',
      username: '已注销',
      gender: 1,
      email: '',
      mobile_number: '',
      _id: '',
    },
    gender: 1,
    passwordForm: {
      password: '',
      confirmPassword: '',
    },
  };

  handlePasswordValueChange = (values: PasswordFormType) => {
    this.setState({ passwordForm: values });
  };

  getUserInfo = () => {
    userinfo()().then(d => {
      if (d.data.code === 0) {
        const data = d.data.docs;
        this.setState({ userInfo: data, gender: data.gender });
      } else {
        Toast.fail('获取用户信息失败');
      }
    });
  };

  UNSAFE_componentWillMount() {
    this.getUserInfo();
  }

  loginOut = async () => {
    const { dispatch } = this.props;
    (dispatch as Dispatch)({
      type: 'app/loginOut',
      payload: {
        callback: () => {
          NavigationUtil.goBack();
        },
      },
    });
  };

  passwordChange = () => {
    Modal.alert(
      '修改密码',
      <GiftedForm
        style={styles.GiftedForm}
        formName="passwordForm"
        scrollEnabled={false}
        onValueChange={this.handlePasswordValueChange}
        validators={{
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
                  if (value === this.state.passwordForm.password) {
                    return true;
                  }
                  return false;
                },
                message: '请保证两次密码一致',
              },
            ],
          },
        }}
      >
        <GiftedForm.TextInputWidget
          name="password"
          title=""
          placeholder="请输入密码"
          clearButtonMode="while-editing"
          maxLength={16}
          value={this.state.passwordForm.password}
          secureTextEntry={true}
        />
        <GiftedForm.TextInputWidget
          name="confirmPassword"
          title=""
          placeholder="请输入二次确认密码"
          clearButtonMode="while-editing"
          maxLength={16}
          value={this.state.passwordForm.confirmPassword}
          secureTextEntry={true}
        />
      </GiftedForm>,
      [
        { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
        { text: '确认', onPress: () => console.log('ok') },
      ]
    );
  };

  usernameChange = () => {
    Modal.prompt(
      '修改用户名',
      '',
      (value: string) => {
        if (!usernameRegex.test(value)) {
          Toast.fail(
            '用户名是由3至16位，a～z或A~Z的英文字母、0～9的数字或下划线组成',
            1.5
          );
          return;
        } else {
          (this.props.dispatch as Dispatch)({
            type: 'user/updateUsername',
            payload: {
              username: value,
              success: () => {
                Toast.success('用户名修改成功，请重新登陆', 1.5);
                NavigationUtil.goBack();
              },
              fail: () => {
                Toast.fail('输入的用户名已存在', 1.5);
              },
            },
          });
        }
      },
      'default',
      '',
      ['请输入用户名']
    );
  };

  handleSex = (value: string) => {
    this.setState({ gender: value === '男' ? 1 : 0 });
  };

  genderChange = () => {
    Modal.alert(
      '修改性别',
      <SegmentedControl
        values={['女', '男']}
        selectedIndex={this.state.gender}
        style={styles.sexControl}
        onValueChange={this.handleSex}
      />,
      [
        {
          text: '取消',
          onPress: () => {
            this.setState({ gender: this.state.userInfo.gender });
          },
          style: 'cancel',
        },
        {
          text: '确认',
          onPress: () => {
            (this.props.dispatch as Dispatch)({
              type: 'user/updateInfo',
              payload: {
                gender: this.state.gender,
                success: () => {
                  this.getUserInfo();
                  Toast.success('性别修改成功', 1.5);
                },
                fail: () => {
                  Toast.fail('请选择和现在不一样的性别', 1.5, () =>
                    this.setState({ gender: this.state.userInfo.gender })
                  );
                },
              },
            });
          },
        },
      ]
    );
  };

  mobileChange = () => {
    Modal.prompt(
      '修改手机号',
      '',
      (value: string) => {
        if (!phoneRegex.test(value)) {
          Toast.fail('请按照正确手机号格式输入', 1.5);
          return;
        } else {
          (this.props.dispatch as Dispatch)({
            type: 'user/updateInfo',
            payload: {
              mobile_number: value,
              success: () => {
                this.getUserInfo();
                Toast.success('手机号修改成功', 1.5);
              },
              fail: () => {
                Toast.fail('与原来的手机号一致', 1.5);
              },
            },
          });
        }
      },
      'default',
      '',
      ['请输入手机号']
    );
  };

  emailChange = () => {
    Modal.prompt(
      '修改邮箱',
      '',
      (value: string) => {
        if (!emailRegex.test(value)) {
          Toast.fail('请按照正确邮箱格式输入', 1.5);
          return;
        } else {
          (this.props.dispatch as Dispatch)({
            type: 'user/updateInfo',
            payload: {
              email: value,
              success: () => {
                this.getUserInfo();
                Toast.success('邮箱修改成功', 1.5);
              },
              fail: () => {
                Toast.fail('与原来的邮箱一致', 1.5);
              },
            },
          });
        }
      },
      'default',
      '',
      ['请输入邮箱']
    );
  };

  render() {
    const {
      avatar_url,
      username,
      gender,
      email,
      mobile_number,
      _id,
    } = this.state.userInfo;
    return (
      <View>
        <TouchableOpacity activeOpacity={0.5} style={styles.container}>
          <Text style={styles.avatar}>头像</Text>
          <Image
            style={styles.picImage}
            source={{
              uri: avatar_url,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} style={styles.container}>
          <Text style={styles.left}>ID</Text>
          <Text style={styles.right}>{_id}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.container}
          onPress={this.usernameChange}
        >
          <Text style={styles.left}>用户名</Text>
          <Text style={styles.right}>{username}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.container}
          onPress={this.genderChange}
        >
          <Text style={styles.left}>性别</Text>
          <Text style={styles.right}>{gender === 0 ? '女' : '男'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.container}
          onPress={this.mobileChange}
        >
          <Text style={styles.left}>手机号</Text>
          <Text style={styles.right}>{mobile_number}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.container}
          onPress={this.emailChange}
        >
          <Text style={styles.left}>邮箱</Text>
          <Text style={styles.right}>{email}</Text>
        </TouchableOpacity>
        <Button
          style={styles.loginOut}
          activeStyle={styles.activeStyle}
          onPress={this.passwordChange}
        >
          <Text style={styles.fontButton}>修改密码</Text>
        </Button>
        <Button
          style={styles.loginOut}
          activeStyle={styles.activeStyle}
          onPress={this.loginOut}
        >
          <Text style={styles.fontButton}>退出登录</Text>
        </Button>
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
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: { fontSize: 16 },
  picImage: { width: 30, height: 30 },
  left: {},
  right: {},
  loginOut: { marginTop: 10, backgroundColor: 'pink' },
  activeStyle: { backgroundColor: '#fbe6e6' },
  fontButton: { color: 'white' },
  sexControl: { width: 200, height: 30 },
  GiftedForm: { width: 250 },
});
