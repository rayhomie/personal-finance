import React, { Component } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { Button, Modal } from '@ant-design/react-native';
import { connect } from '@/utils/connect';
import LoginModal from './loginModal/index';
import RegisterModal from './registerModal/index';

interface IProps {
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
  showRegister: boolean;
  showLogin: boolean;
  gender: number;
  loginForm: LoginFormType;
  registerForm: RegisterFormType;
}
@connect(({ app, loading }: any) => ({
  app,
  dataLoading: loading.effects['app/login'],
}))
export default class Login extends Component<IProps, IState> {
  state: IState = {
    showLogin: false,
    showRegister: false,
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

  handleSex = (value: string) => {
    this.setState({ gender: value === '男' ? 1 : 0 });
  };

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
    const { showRegister, showLogin } = this.state;
    return (
      <Modal animationType="slide" visible={visible}>
        <View style={styles.container}>
          <LoginModal
            visible={showLogin}
            onClose={() => {
              this.setState({ showLogin: false });
            }}
          />
          <RegisterModal
            visible={showRegister}
            onClose={() => {
              this.setState({ showRegister: false });
            }}
          />
          <Button
            onPress={() => {
              this.setState({ showLogin: true });
            }}
          >
            登录
          </Button>
          <Button
            onPress={() => {
              this.setState({ showRegister: true });
            }}
          >
            注册
          </Button>
          <Button onPress={onClose}>收起</Button>
        </View>
      </Modal>
    );
  }
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: screenHeight,
    marginTop: 100,
  },
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
