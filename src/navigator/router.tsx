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
import MonthRank from '@/pages/record/monthRank/index';
import AccountInfo from '@/pages/mine/accountInfo/index';
import AccountInfoItem from '@/pages/mine/accountInfo/item';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const renderTabBar = () => (
  <Tab.Navigator
    tabBarOptions={{
      activeTintColor: '#515151',
      tabStyle: { backgroundColor: '#fef6dd' },
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
            // headerTransparent: true,
            header: () => <></>,
          }}
        />
        <Stack.Screen
          name="用户信息"
          options={{
            headerStyle: { backgroundColor: '#fef6dd' },
          }}
          component={UserInfo}
        />
        <Stack.Screen
          name="记账"
          component={Account}
          options={{
            headerTitle: () => <></>,
            headerStyle: { backgroundColor: '#fef6dd' },
          }}
        />
        <Stack.Screen
          name="分类设置"
          component={CategorySetting}
          options={{
            headerRight: CategorySettingAdd,
            headerStyle: { backgroundColor: '#fef6dd' },
          }}
        />
        <Stack.Screen
          name="添加分类"
          component={Add}
          options={{
            headerTitle: () => <></>,
            headerStyle: { backgroundColor: '#fef6dd' },
          }}
        />
        <Stack.Screen
          name="收支排行详情"
          component={RankInfo}
          options={{ header: () => <></> }}
        />
        <Stack.Screen
          name="月排行"
          component={MonthRank}
          options={{ header: () => <></> }}
        />
        <Stack.Screen
          name="我的账单"
          component={AccountInfo}
          options={{ header: () => <></> }}
        />
        <Stack.Screen
          name="月度账单报表"
          component={AccountInfoItem}
          options={{ header: () => <></> }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
