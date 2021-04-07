/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { Button, Modal } from '@ant-design/react-native';
import { connect } from 'react-redux';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import LoginModal from './loginModal/index';
import RegisterModal from './registerModal/index';

interface IProps extends ConnectProps, ConnectState {}

const Login: React.FC<IProps> = props => {
  const { app, dispatch } = props;
  const dispatchApp = dispatch as Dispatch;
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showRegister, setShowRegister] = useState<boolean>(false);

  useEffect(() => {
    if (app?.isRegister) {
      setShowLogin(true);
    }
  }, [app?.isRegister]);

  return (
    <Modal popup animationType="slide-up" visible={app?.openLogin}>
      <View style={styles.container}>
        <LoginModal
          visible={showLogin}
          onClose={() => {
            setShowLogin(false);
          }}
        />
        <RegisterModal
          visible={showRegister}
          onClose={() => {
            setShowRegister(false);
          }}
        />
        <Button
          onPress={() => {
            setShowLogin(true);
          }}
        >
          登录
        </Button>
        <Button
          onPress={() => {
            setShowRegister(true);
          }}
        >
          注册
        </Button>
        <Button
          onPress={() => {
            dispatchApp({ type: 'app/save', payload: { openLogin: false } });
          }}
        >
          收起
        </Button>
      </View>
    </Modal>
  );
};

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

export default connect(({ app, user, mine, record, loading }: IProps) => ({
  app,
  user,
  record,
  mine,
  dataLoading: loading?.effects['app/login'],
}))(Login);
