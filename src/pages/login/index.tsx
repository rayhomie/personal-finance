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
}
@connect(({ app, loading }: any) => ({
  app,
  dataLoading: loading.effects['app/login'],
}))
export default class Login extends Component<IProps, IState> {
  state: IState = {
    showLogin: false,
    showRegister: false,
  };

  UNSAFE_componentWillReceiveProps(nextProps: any) {
    if (nextProps?.app.isRegister) {
      this.setState({ showLogin: true });
    }
  }

  render() {
    const { visible, onClose } = this.props;
    const { showRegister, showLogin } = this.state;
    return (
      <Modal popup animationType="slide-up" visible={visible}>
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

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
