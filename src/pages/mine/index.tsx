import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from '@/utils/connect';
interface IProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

interface IState {}
@connect(({ app, loading }: IProps) => ({
  app,
  dataLoading: loading.effects['app/login'],
}))
class Mine extends Component<IProps, IState> {
  render() {
    const { dispatch } = this.props;
    return (
      <View>
        <Text>我的</Text>
        <Button
          title="登录"
          onPress={() => {
            dispatch({
              type: 'app/login',
              payload: { username: 'wangzhiqiang', password: '123456' },
            });
          }}
        />
      </View>
    );
  }
}

export default Mine;
