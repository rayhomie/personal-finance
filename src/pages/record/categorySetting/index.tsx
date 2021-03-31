import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Toast } from '@ant-design/react-native';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
import NavigationUtil from '@/navigator/NavigationUtil';


interface CategorySettingProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

interface CategorySettingState {}

const CategorySetting: React.FC<CategorySettingProps> = props => {
  return (
    <View>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default connect(
  ({ app, user, mine, loading }: CategorySettingProps) => ({
    app,
    user,
    mine,
    dataLoading: loading?.effects['app/login'],
  })
)(CategorySetting);
