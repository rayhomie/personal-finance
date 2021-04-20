/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Modal } from '@ant-design/react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import moment from 'moment';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { pay_income } from '@/service/analyse';

interface RemindModalProps extends ConnectProps, ConnectState {}

const RemindModal: React.FC<RemindModalProps> = ({ dispatch, app, record }) => {
  const dispatchApp = dispatch as Dispatch;
  const [msg, setMsg] = useState<any>({});

  useEffect(() => {
    if (app?.isLogin === true) {
      getAnalyse();
    }
  }, [app?.isLogin, record?.addBillSuccess]);

  const getAnalyse = async () => {
    const res = await pay_income({
      date: moment().format('YYYY-MM-DD HH:mm:ss'),
      type: 'cur',
    });
    if (res.data.code !== 0) {
      setMsg({});
      return;
    }
    setMsg(res.data.cur_msg);
  };

  useEffect(() => {
    if (msg?.type !== 1) {
      dispatchApp({ type: 'app/save', payload: { openRemind: true } });
    }
  }, [msg]);

  return (
    <Modal
      popup
      animationType="slide-up"
      visible={app?.openRemind}
      onClose={() =>
        dispatchApp({ type: 'app/save', payload: { openRemind: false } })
      }
      maskClosable
    >
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.5, y: 0.65 }}
        locations={[0, 1]}
        colors={['#ffeaaa', '#fffcdc']}
        style={styles.container}
      >
        <Text style={styles.text}>{msg.curmsg}</Text>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    paddingHorizontal: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
export default connect(
  ({ app, user, mine, record, loading }: RemindModalProps) => ({
    app,
    user,
    record,
    mine,
    dataLoading: loading?.effects['app/login'],
  })
)(RemindModal);
