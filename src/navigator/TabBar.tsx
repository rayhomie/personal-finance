import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { navigationRef } from './NavigationUtil';
import MineStackNavigator from './mine/index';
import RecordStackNavigator from './record/index';
import Chart from '@/pages/chart/index';

const Tab = createBottomTabNavigator();

export default function AppNavigators() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator>
        <Tab.Screen name="账单" component={RecordStackNavigator} />
        <Tab.Screen name="图表" component={Chart} />
        <Tab.Screen name="我的" component={MineStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
