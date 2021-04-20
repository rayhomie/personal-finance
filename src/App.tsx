import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入本地化语言
import dva from './models/dva';
import models from './models/index';
// import AppNavigators from './navigator/AppNavigators';
import Router from './navigator/router';
import { Provider as AntdProvider } from '@ant-design/react-native';
import Login from '@/pages/login/index';
import RemindModal from '@/pages/analyse/remindModal';

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
          <RemindModal />
        </SafeAreaView>
      </AntdProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#fef6dd',
  },
});

export default App;
