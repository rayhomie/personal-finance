/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Modal } from '@ant-design/react-native';
import LinearGradient from 'react-native-linear-gradient';
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
    <Modal
      popup
      animationType="slide-up"
      visible={app?.openLogin}
      onClose={() =>
        dispatchApp({ type: 'app/save', payload: { openLogin: false } })
      }
      maskClosable
    >
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
        <LinearGradient
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 0.5, y: 1.0 }}
          locations={[0, 0.5, 0.6]}
          colors={['#921850', '#a11a52', '#c12a45']}
          style={styles.linearGradient}
        >
          <TouchableOpacity
            onPress={() => {
              setShowLogin(true);
            }}
          >
            <Text style={styles.buttonText}>登录</Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          start={{ x: 0.0, y: 0.25 }}
          end={{ x: 0.5, y: 1.0 }}
          locations={[0, 0.5, 0.6]}
          colors={['#c12a45', '#a11a52', '#921850']}
          style={styles.linearGradient}
        >
          <TouchableOpacity
            onPress={() => {
              setShowRegister(true);
            }}
          >
            <Text style={styles.buttonText}>注册</Text>
          </TouchableOpacity>
        </LinearGradient>
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
  linearGradient: {
    flex: 1,
    width: screenWidth / 2,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
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
