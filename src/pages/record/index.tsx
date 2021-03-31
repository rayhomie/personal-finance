import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { Button, Toast } from '@ant-design/react-native';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
import NavigationUtil from '@/navigator/NavigationUtil';

interface RecordProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

interface IState {}

const Record: React.FC<RecordProps> = props => {
  return (
    <View>
      <StatusBar />
      <View>
        <Button
          onPress={() => {
            NavigationUtil.toPage('记账');
          }}
        >
          记账
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default connect(({ app, user, mine, loading }: RecordProps) => ({
  app,
  user,
  mine,
  dataLoading: loading?.effects['app/login'],
}))(Record);
