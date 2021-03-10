import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ConnectProps, ConnectState } from '@/models/connect';
import { connect } from '@/utils/connect';
import NavigationUtil from '@/navigator/NavigationUtil';
import { Button } from '@ant-design/react-native';
interface IProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

interface IState {}

/**
 * 说明：
 * @author ${USER}
 * @date ${DATE}${TIME}
 */
@connect(({ home, loading }: IProps) => ({
  home,
  dataLoading: loading.effects['home/zhihu'],
}))
class Home extends Component<IProps, IState> {
  state: IState = {};

  componentDidMount() {}

  addNum = () => {
    let {
      home: { number },
    } = this.props;
    number++;
    this.props.dispatch({
      type: 'home/save',
      payload: {
        number,
      },
    });
  };

  subNum = () => {
    let {
      home: { number },
    } = this.props;
    number--;
    this.props.dispatch({
      type: 'home/save',
      payload: {
        number,
      },
    });
  };

  fetchText = () => {
    this.props.dispatch({
      type: 'home/zhihu',
    });
  };

  clearContent = () => {
    this.props.dispatch({
      type: 'home/save',
      payload: {
        content: [],
      },
    });
  };

  toDetails = () => {
    NavigationUtil.toPage('Details', {
      title: '你好',
    });
  };

  toNavigatorsTest = () => {
    NavigationUtil.toPage('NavigatorsTest', {
      title: 'NavigatorsTest',
    });
  };

  render() {
    const {
      home: { number, content },
      dataLoading,
    } = this.props;
    return (
      <View>
        <Text>你好：{number}</Text>
        <Button onPress={this.toDetails}>去详情</Button>
        <Button onPress={this.toNavigatorsTest}>导航测试</Button>
        <Button onPress={this.addNum}>加</Button>
        <Button onPress={this.subNum}>减</Button>
        <Button onPress={this.fetchText}>获取数据</Button>
        <View>
          <Text>111</Text>
        </View>
        <Button onPress={this.clearContent}>清除数据</Button>
        <Text>
          结果：
          {dataLoading
            ? '正在获取数据...'
            : content.map(item => <Text key={item.name}>{item.name}；</Text>)}
        </Text>
        <Button>Start</Button>
      </View>
    );
  }
}

export default Home;
