import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { navigationRef } from './NavigationUtil';
import Record from '@/pages/record/index';
import Chart from '@/pages/chart/index';
import Mine from '@/pages/mine/index';
import Account from '@/pages/record/account/index';
import CategorySetting, {
  Add as CategorySettingAdd,
} from '@/pages/record/categorySetting/index';
import Add from '@/pages/record/categorySetting/add';
import UserInfo from '@/pages/mine/userInfo/index';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const renderTabBar = () => (
  <Tab.Navigator>
    <Tab.Screen name="账单" component={Record} />
    <Tab.Screen name="图表" component={Chart} />
    <Tab.Screen name="我的" component={Mine} />
  </Tab.Navigator>
);

export default function Router() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen name="记账app" component={renderTabBar} />
        <Stack.Screen name="用户信息" component={UserInfo} />
        <Stack.Screen name="记账" component={Account} />
        <Stack.Screen
          name="分类设置"
          component={CategorySetting}
          options={{
            headerRight: CategorySettingAdd,
          }}
        />
        <Stack.Screen
          name="添加分类"
          component={Add}
          options={{ headerTitle: () => <></> }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
