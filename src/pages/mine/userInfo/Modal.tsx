/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { TextStyle, View } from 'react-native';
import { Modal as AntdModal, InputItem } from '@ant-design/react-native';
import { InputItemPropsType } from '@ant-design/react-native/lib/input-item/PropsType';
import { ModalPropsType } from '@ant-design/react-native/lib/modal/PropsType';

interface ModalProps extends ModalPropsType<TextStyle> {
  title: string;
  callbackOrActions?: (value: string) => void;
  Input?: Input[];
  handleConfirm: (value: string[]) => void;
}

interface Input {
  type?: InputItemPropsType['type'];
  placeholder?: string;
  maxLength?: number;
}

const Modal: React.FC<ModalProps> = ({
  title = '',
  Input = [{ type: 'text', placeholder: '请输入' }],
  onClose,
  visible,
  handleConfirm,
  ...modalProps
}) => {
  const [input, setInput] = useState<string[]>(Input.map(() => ''));
  const footerButtons = [
    {
      text: '取消',
      onPress: () => {
        setInput(pre => pre.map(() => ''));
      },
    },
    {
      text: '确认',
      onPress: () => {
        handleConfirm(input);
      },
    },
  ];
  useEffect(() => {
    setInput(pre => pre.map(() => ''));
  }, [visible]);

  return (
    <AntdModal
      visible={visible}
      title={title}
      transparent
      maskClosable
      onClose={onClose}
      footer={footerButtons}
      {...modalProps}
    >
      <View style={{ marginTop: 15 }}>
        {Input.map((i: Input, index: number) => (
          <InputItem
            placeholderTextColor="#515151"
            style={{
              color: '#515151',
              fontSize: 14,
              borderWidth: 1,
              borderColor: '#eee',
              borderRadius: 5,
              paddingHorizontal: 10,
            }}
            type={i.type}
            maxLength={i.maxLength}
            clear
            last
            placeholder={i.placeholder}
            onChange={(value: string) =>
              setInput(pre => {
                pre[index] = value;
                return pre;
              })
            }
          />
        ))}
      </View>
    </AntdModal>
  );
};

export default Modal;
