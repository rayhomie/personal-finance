import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入本地化语言
import dva from './models/dva';
import models from './models/index';
// import AppNavigators from './navigator/AppNavigators';
import Router from './navigator/router';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Provider as AntdProvider } from '@ant-design/react-native';
import Login from '@/pages/login/index';

const dvaApp: any = dva.createApp({
  initialState: {},
  models: models,
});

export const store = dvaApp.getStore();
dayjs.locale('zh-cn'); // 使用本地化语言
const App = () => {
  return (
    <Provider store={store}>
      <AntdProvider>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeAreaView}>
          <Router />
          <Login />
        </SafeAreaView>
      </AntdProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.lighter,
  },
});

export default App;
