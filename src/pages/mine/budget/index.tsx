/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import { Toast, Modal, InputItem } from '@ant-design/react-native';
import LinearGradient from 'react-native-linear-gradient';
import { addCurBudget, deleteCurBudget } from '@/service/budget';

interface IProps {
  visible: boolean;
  type: '' | 'add' | 'update';
  budget: string;
  onClose: () => void;
}

const Budget: React.FC<IProps> = props => {
  const { visible, onClose, type = '', budget } = props;
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    setInput(budget);
  }, [visible]);

  const onDelete = async () => {
    const res = await deleteCurBudget();
    if (res.data.code === 0) {
      Toast.success('删除成功', 0.5);
    } else {
      Toast.success('删除失败，请重试', 0.5);
    }
    modalClose();
  };

  const onConfirm = async () => {
    if (input === '') {
      Toast.fail('请输入预算值，请重试', 0.5);
      return;
    }
    if (!/^(\-?)\d+(\.\d+)?$/.test(input)) {
      Toast.fail('请正确输入正数或负数', 0.5);
      return;
    }
    const res = await addCurBudget({ budget_value: Number(input).toFixed(2) });
    if (res.data.code === 0) {
      Toast.success(`${type !== 'update' ? '设置' : '修改'}成功`, 0.5);
      modalClose();
    } else {
      Toast.fail(
        `${
          type !== 'update'
            ? '设置失败，请重试'
            : '修改失败，请输入和原来不一致的预算值'
        }`,
        0.5
      );
    }
  };

  const modalClose = () => {
    setInput('');
    onClose();
  };

  return (
    <Modal
      popup
      visible={visible}
      animationType="slide"
      onClose={() => modalClose()}
      maskClosable
    >
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.5, y: 0.65 }}
        locations={[0, 1]}
        colors={['#ffeaaa', '#fffcdc']}
        style={styles.modalContainer}
      >
        <View style={styles.modalHeader}>
          {type !== 'update' ? (
            <TouchableOpacity onPress={() => modalClose()}>
              <Text style={styles.btnCancel}>取消</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => onDelete()}>
              <Text style={styles.btnCancel}>删除</Text>
            </TouchableOpacity>
          )}
          <View style={styles.input}>
            <View style={styles.inputItem}>
              <InputItem
                placeholder={`请输入${type !== 'update' ? '设置' : '修改'}${
                  moment().month() + 1
                }月的预算...`}
                maxLength={8}
                type="number"
                textAlign="center"
                clear
                value={input}
                onChange={input => setInput(input)}
              />
            </View>
          </View>
          <TouchableOpacity onPress={() => onConfirm()}>
            <Text style={styles.btnConfirm}>确认</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Modal>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  modalContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -10,
    height: 40,
  },
  btnCancel: {
    fontSize: 18,
    marginLeft: 10,
    color: '#FDB99B',
  },
  btnConfirm: { color: '#d9a7c7', fontSize: 18, marginRight: 10 },
  input: {
    width: (screenWidth * 2) / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputItem: {
    width: (screenWidth * 2) / 3,
  },
});

export default Budget;
