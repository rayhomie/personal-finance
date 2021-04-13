import React from 'react';
import { Image } from 'react-native';
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
import RankInfo from '@/pages/chart/rankInfo/index';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const renderTabBar = () => (
  <Tab.Navigator
    tabBarOptions={{
      activeTintColor: '#515151',
    }}
  >
    <Tab.Screen
      name="账单"
      component={Record}
      options={{
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <Image source={require('@/assets/image/tabbar_detail_s.png')} />
            );
          } else {
            return (
              <Image source={require('@/assets/image/tabbar_detail_n.png')} />
            );
          }
        },
      }}
    />
    <Tab.Screen
      name="图表"
      component={Chart}
      options={{
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <Image source={require('@/assets/image/tabbar_chart_s.png')} />
            );
          } else {
            return (
              <Image source={require('@/assets/image/tabbar_chart_n.png')} />
            );
          }
        },
      }}
    />
    <Tab.Screen
      name="我的"
      component={Mine}
      options={{
        tabBarIcon: ({ focused }) => {
          if (focused) {
            return (
              <Image source={require('@/assets/image/tabbar_mine_s.png')} />
            );
          } else {
            return (
              <Image source={require('@/assets/image/tabbar_mine_n.png')} />
            );
          }
        },
      }}
    />
  </Tab.Navigator>
);

export default function Router() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        <Stack.Screen
          name="返回"
          component={renderTabBar}
          options={{
            // headerTitle: RecordAdd,
            // headerStyle: { height: screenHeight * 2 - 170 },
            // headerTransparent: true,
            header: () => <></>,
          }}
        />
        <Stack.Screen name="用户信息" component={UserInfo} />
        <Stack.Screen
          name="记账"
          component={Account}
          options={{ headerTitle: () => <></> }}
        />
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
        <Stack.Screen
          name="收支排行详情"
          component={RankInfo}
          options={{ header: () => <></> }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
