import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Button, Modal } from '@ant-design/react-native';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from '@/utils/connect';

interface IProps extends ConnectState, ConnectProps {
  // dataLoading?: boolean;
  visible: boolean;
  onClose: () => void;
}

interface IState {}
@connect(({ app, loading }: IProps) => ({
  app,
  dataLoading: loading.effects['app/login'],
}))
export default class Login extends Component<IProps, IState> {
  render() {
    const { visible, onClose } = this.props;
    return (
      <Modal popup visible={visible}>
        <View style={styles.container}>
          <Button>登录</Button>
          <Button>注册</Button>
          <Button onPress={onClose}>关闭</Button>
        </View>
      </Modal>
    );
  }
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: { width: screenWidth, height: screenHeight, marginTop: 200 },
});
