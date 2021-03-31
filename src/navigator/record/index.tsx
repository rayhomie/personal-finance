import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Record from '@/pages/record/index';
import Account from '@/pages/record/account/index';
import CategorySetting from '@/pages/record/categorySetting/index';

const Stack = createStackNavigator();

export default function MineStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="账单" component={Record} />
      <Stack.Screen name="记账" component={Account} />
      <Stack.Screen name="分类设置" component={CategorySetting} />
    </Stack.Navigator>
  );
}
