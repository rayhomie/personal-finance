import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { navigationRef } from './NavigationUtil';
import Record from '@/pages/record/index';
import Chart from '@/pages/chart/index';
import MineStackNavigator from './mine/index';

const Tab = createBottomTabNavigator();

export default function AppNavigators() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator>
        <Tab.Screen name="记账" component={Record} />
        <Tab.Screen name="图表" component={Chart} />
        <Tab.Screen name="我的" component={MineStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
