import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入本地化语言
import dva from './models/dva';
import models from './models/index';
// import AppNavigators from './navigator/AppNavigators';
import TabBar from './navigator/TabBar';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Provider as AntdProvider } from '@ant-design/react-native';

const dvaApp: any = dva.createApp({
  initialState: {},
  models: models,
});

export const store = dvaApp.getStore();
dayjs.locale('zh-cn'); // 使用本地化语言

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AntdProvider>
          <StatusBar barStyle="dark-content" />
          <SafeAreaView style={styles.safeAreaView}>
            <TabBar />
          </SafeAreaView>
        </AntdProvider>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.lighter,
  },
});

export default App;
