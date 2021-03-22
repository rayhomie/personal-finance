import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Mine from '@/pages/mine/index';
import UserInfo from '@/pages/mine/userInfo/index';

const Stack = createStackNavigator();

export default function MineStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="我的" component={Mine} />
      <Stack.Screen name="用户信息" component={UserInfo} />
    </Stack.Navigator>
  );
}
