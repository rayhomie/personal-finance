import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from '@/utils/connect';
import request from '@/utils/request';
interface IProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

interface IState {}
@connect(({ app, loading }: IProps) => ({
  app,
  dataLoading: loading.effects['app/login'],
}))
class Mine extends Component<IProps, IState> {
  componentDidMount() {
    const { dispatch } = this.props;
    console.log('77777777777');
    // dispatch({
    //   type: 'app/login',
    //   payload: { username: 'wangzhiqiang', password: '123456' },
    // });
  }
  render() {
    const { dispatch } = this.props;
    return (
      <View>
        <Text>我的</Text>
        <Button
          title="请求"
          onPress={() => {
            // fetch('http://localhost:3000/api/login', {
            //   method: 'POST',
            //   headers: new Headers({
            //     'Content-Type': 'application/x-www-form-urlencoded',
            //   }),
            //   body: JSON.stringify({
            //     username: 'rayhomie',
            //     password: '123456',
            //   }),
            // })
            //   .then(d => d.json())
            //   .then(d => console.log(d));

            request({
              url: '/login',
              method: 'POST',
              data: {
                username: 'rayhomie',
                password: '123456',
              },
            }).then(d => console.log(d));
          }}
        />
      </View>
    );
  }
}

export default Mine;
