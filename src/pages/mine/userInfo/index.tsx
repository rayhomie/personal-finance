import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Button, Toast } from '@ant-design/react-native';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from '@/utils/connect';
import { userinfo } from '@/service/user';
import NavigationUtil from '@/navigator/NavigationUtil';

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
}
@connect(({ app, loading }: IProps) => ({
  app,
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
  };

  UNSAFE_componentWillMount() {
    userinfo()().then(d => {
      if (d.data.code === 0) {
        this.setState({ userInfo: d.data.docs });
      } else {
        Toast.fail('获取用户信息失败');
      }
    });
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
        <TouchableOpacity activeOpacity={0.5} style={styles.container}>
          <Text style={styles.left}>用户名</Text>
          <Text style={styles.right}>{username}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} style={styles.container}>
          <Text style={styles.left}>性别</Text>
          <Text style={styles.right}>{gender ? '女' : '男'}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} style={styles.container}>
          <Text style={styles.left}>手机号</Text>
          <Text style={styles.right}>{mobile_number}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} style={styles.container}>
          <Text style={styles.left}>邮箱</Text>
          <Text style={styles.right}>{email}</Text>
        </TouchableOpacity>
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
});
