/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Toast, Modal, SegmentedControl } from '@ant-design/react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { ConnectProps, ConnectState, Dispatch } from '@/models/connect';
import { connect } from 'react-redux';
import NavigationUtil from '@/navigator/NavigationUtil';
import LinearGradient from 'react-native-linear-gradient';
import avatarArr from '@/assets/json/avatarMap';
import { updatePicture } from '@/service/upload';

const { GiftedForm, GiftedFormManager } = require('react-native-gifted-form');

interface IProps extends ConnectState, ConnectProps {
  dataLoading?: boolean;
}

interface IState {
  gender: number | undefined;
  passwordForm: PasswordFormType;
}

type PasswordFormType = {
  password: string;
  confirmPassword: string;
};

const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
const phoneRegex = /^1[3|4|5|7|8][0-9]{9}$/;
const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
const passwordRegex = /^.*(?=.{6,})(?=.*\d)(?=.*[a-z]).*$/;
const passwordNoSpaceRegex = /^[^\s]*$/;

const getValue = (key: string[]) =>
  key.reduce((pre: any, cur) => {
    pre[cur] = GiftedFormManager.getValue('passwordForm', cur);
    return pre;
  }, {});

const UserInfo: React.FC<IState> = props => {
  const { dispatch, user } = props as any;
  const [gender, setGender] = useState<number>(1);
  const [randomAvatar, setRandomAvatar] = useState<number>(0);
  const [passwordForm, setPasswordForm] = useState<PasswordFormType>({
    password: '',
    confirmPassword: '',
  });
  const [avatarModal, setAvatarModal] = useState<boolean>(false);

  const handlePasswordValueChange = (values: PasswordFormType) => {
    setPasswordForm(values);
  };

  const getUserInfo = () => {
    (dispatch as Dispatch)({
      type: 'user/getUserInfo',
      payload: {
        success: () => {},
        fail: () => {
          Toast.fail('获取用户信息失败');
        },
      },
    });
  };

  useEffect(() => {
    getUserInfo();
    setRandomAvatar((NavigationUtil.getParams() as any).randomAvatar);
  }, []);

  const loginOut = () => {
    Modal.alert('退出登录', '退出登录会导致部分功能无法正常使用', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      {
        text: '确认',
        onPress: () => {
          (dispatch as Dispatch)({
            type: 'app/loginOut',
            payload: {
              callback: () => {
                NavigationUtil.goBack();
                (dispatch as Dispatch)({
                  type: 'user/save',
                  payload: {
                    avatar_url: '',
                    username: '登录 / 注册',
                    gender: 1,
                    email: '',
                    mobile_number: '',
                    _id: '',
                  },
                });
              },
            },
          });
        },
      },
    ]);
  };

  const passwordChange = () => {
    Modal.alert(
      '修改密码',
      <GiftedForm
        style={styles.GiftedForm}
        formName="passwordForm"
        scrollEnabled={false}
        onValueChange={handlePasswordValueChange}
        validators={{
          password: {
            title: '密码',
            validate: [
              {
                validator: 'isLength',
                arguments: [6, 16],
                message: '{TITLE}长度为{ARGS[0]}到{ARGS[1]}个字符',
              },
              {
                validator: 'matches',
                arguments: passwordRegex,
                message: '{TITLE}至少包括1个小写字母，1个数字',
              },
              {
                validator: 'matches',
                arguments: passwordNoSpaceRegex,
                message: '{TITLE}中不能使用空格',
              },
            ],
          },
          confirmPassword: {
            title: '确认密码',
            validate: [
              {
                validator: (value: string) => {
                  if (value === getValue(['password']).password) {
                    return true;
                  }
                  return false;
                },
                message: '请保证两次密码一致',
              },
            ],
          },
        }}
      >
        <GiftedForm.TextInputWidget
          name="password"
          title=""
          placeholder="请输入密码"
          clearButtonMode="while-editing"
          maxLength={16}
          value={passwordForm.password}
          secureTextEntry={true}
        />
        <GiftedForm.TextInputWidget
          name="confirmPassword"
          title=""
          placeholder="请输入二次确认密码"
          clearButtonMode="while-editing"
          maxLength={16}
          value={passwordForm.confirmPassword}
          secureTextEntry={true}
        />
      </GiftedForm>,
      [
        {
          text: '取消',
          onPress: () => {
            setPasswordForm({
              password: '',
              confirmPassword: '',
            });
          },
          style: 'cancel',
        },
        {
          text: '确认',
          onPress: () => {
            const { password, confirmPassword } = getValue([
              'password',
              'confirmPassword',
            ]);
            if (password !== confirmPassword) {
              Toast.fail('二次输入的密码和首次不一致！请重新输入', 0.5);
              return;
            }
            if (!passwordRegex.test(password)) {
              Toast.fail(
                '密码由至少包括1个小写字母，1个数字组成，且设置至少6位密码',
                0.5
              );
              return;
            }
            (dispatch as Dispatch)({
              type: 'user/updatePassword',
              payload: {
                password,
                success: () => {
                  Toast.success('密码更改成功，请重新登陆', 0.5);
                  setPasswordForm({
                    password: '',
                    confirmPassword: '',
                  });
                  NavigationUtil.goBack();
                },
                fail: () => {
                  Toast.fail('密码和之前的一致，未变动', 0.5);
                },
              },
            });
          },
        },
      ]
    );
  };

  const usernameChange = () => {
    Modal.prompt(
      '修改用户名',
      '',
      (value: string) => {
        if (!usernameRegex.test(value)) {
          Toast.fail(
            '用户名是由3至16位，a～z或A~Z的英文字母、0～9的数字或下划线组成',
            0.5
          );
          return;
        } else {
          (dispatch as Dispatch)({
            type: 'user/updateUsername',
            payload: {
              username: value,
              success: () => {
                Toast.success('用户名修改成功，请重新登陆', 0.5);
                NavigationUtil.goBack();
              },
              fail: () => {
                Toast.fail('输入的用户名已存在', 0.5);
              },
            },
          });
        }
      },
      'default',
      '',
      ['请输入用户名']
    );
  };

  const handleSex = (value: string) => {
    setGender(value === '男' ? 1 : 0);
  };

  const genderChange = () => {
    Modal.alert(
      '修改性别',
      <SegmentedControl
        values={['女', '男']}
        selectedIndex={gender}
        style={styles.sexControl}
        onValueChange={handleSex}
      />,
      [
        {
          text: '取消',
          onPress: () => {
            setGender(user?.gender);
          },
          style: 'cancel',
        },
        {
          text: '确认',
          onPress: () => {
            (dispatch as Dispatch)({
              type: 'user/updateInfo',
              payload: {
                gender: user?.gender,
                success: () => {
                  getUserInfo();
                  Toast.success('性别修改成功', 0.5);
                },
                fail: () => {
                  Toast.fail('请选择和现在不一样的性别', 0.5, () =>
                    setGender(user?.gender)
                  );
                },
              },
            });
          },
        },
      ]
    );
  };

  const mobileChange = () => {
    Modal.prompt(
      '修改手机号',
      '',
      (value: string) => {
        if (!phoneRegex.test(value)) {
          Toast.fail('请按照正确手机号格式输入', 0.5);
          return;
        } else {
          (dispatch as Dispatch)({
            type: 'user/updateInfo',
            payload: {
              mobile_number: value,
              success: () => {
                getUserInfo();
                Toast.success('手机号修改成功', 0.5);
              },
              fail: () => {
                Toast.fail('与原来的手机号一致', 0.5);
              },
            },
          });
        }
      },
      'default',
      '',
      ['请输入手机号']
    );
  };

  const emailChange = () => {
    Modal.prompt(
      '修改邮箱',
      '',
      (value: string) => {
        if (!emailRegex.test(value)) {
          Toast.fail('请按照正确邮箱格式输入', 0.5);
          return;
        } else {
          (dispatch as Dispatch)({
            type: 'user/updateInfo',
            payload: {
              email: value,
              success: () => {
                getUserInfo();
                Toast.success('邮箱修改成功', 0.5);
              },
              fail: () => {
                Toast.fail('与原来的邮箱一致', 0.5);
              },
            },
          });
        }
      },
      'default',
      '',
      ['请输入邮箱']
    );
  };

  const choosePic = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
    }).then(image => {
      const formData = new FormData();
      formData.append('image', image);
      updatePicture(formData).then(res => {
        if (res.data.code === 0) {
          (dispatch as Dispatch)({
            type: 'user/updateInfo',
            payload: {
              avatar_url: res.data.res.requestUrls[0],
              success: () => {
                getUserInfo();
                Toast.success('头像更改成功', 0.5);
              },
              fail: () => Toast.fail('头像更改失败,请重试', 0.5),
            },
          });
        }
      });
    });
  };

  const openAvatar = () => {
    setAvatarModal(true);
  };

  const { avatar_url, username, email, mobile_number, _id } = user as any;
  return (
    <View>
      <LinearGradient
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 0.5, y: 0.65 }}
        locations={[0, 1]}
        colors={['#ffeaaa', '#fffcdc']}
        style={styles.allContainer}
      >
        <TouchableOpacity activeOpacity={0.5} onPress={() => choosePic()}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            colors={['#a1ffce', '#faffd1']}
            style={styles.container}
          >
            <Text style={styles.avatar}>头像</Text>
            <TouchableOpacity activeOpacity={0.5} onPress={() => openAvatar()}>
              <Image
                style={styles.picImage}
                source={
                  avatar_url === ''
                    ? avatarArr[randomAvatar]
                    : {
                        uri: avatar_url,
                      }
                }
              />
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            colors={['#a1ffce', '#faffd1']}
            style={styles.container}
          >
            <Text style={styles.left}>ID</Text>
            <Text style={styles.right}>{_id}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={usernameChange}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            colors={['#a1ffce', '#faffd1']}
            style={styles.container}
          >
            <Text style={styles.left}>用户名</Text>
            <Text style={styles.right}>{username}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={genderChange}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            colors={['#a1ffce', '#faffd1']}
            style={styles.container}
          >
            <Text style={styles.left}>性别</Text>
            <Text style={styles.right}>{user?.gender === 0 ? '女' : '男'}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={mobileChange}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            colors={['#a1ffce', '#faffd1']}
            style={styles.container}
          >
            <Text style={styles.left}>手机号</Text>
            <Text style={styles.right}>{mobile_number}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={emailChange}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            colors={['#a1ffce', '#faffd1']}
            style={styles.container}
          >
            <Text style={styles.left}>邮箱</Text>
            <Text style={styles.right}>{email}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={passwordChange}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            colors={['#a1ffce', '#faffd1']}
            style={styles.btn}
          >
            <Text style={styles.fontButton}>修</Text>
            <Text style={styles.fontButton}>改</Text>
            <Text style={styles.fontButton}>密</Text>
            <Text style={styles.fontButton}>码</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={loginOut}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            colors={['#a1ffce', '#faffd1']}
            style={styles.btn}
          >
            <Text style={styles.fontButton}>退</Text>
            <Text style={styles.fontButton}>出</Text>
            <Text style={styles.fontButton}>登</Text>
            <Text style={styles.fontButton}>录</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
      <Modal
        popup
        visible={avatarModal}
        animationType="slide"
        onClose={() => setAvatarModal(false)}
        maskClosable
      >
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.5, y: 0.65 }}
          locations={[0, 1]}
          colors={['#ffeaaa', '#fffcdc']}
          style={styles.modalAvatar}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={
                avatar_url === ''
                  ? avatarArr[randomAvatar]
                  : {
                      uri: avatar_url,
                    }
              }
              style={styles.avatarSize}
            />
          </View>
        </LinearGradient>
      </Modal>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  allContainer: { height: screenHeight, width: screenWidth },
  container: {
    width: screenWidth,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: { fontSize: 16 },
  picImage: { width: 45, height: 45, borderRadius: 30 },
  left: {},
  right: {},
  btn: {
    width: screenWidth,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 120,
    paddingRight: 120,
    marginTop: 10,
    justifyContent: 'space-evenly',
  },
  fontButton: { color: '#3f4d5b', fontSize: 18, fontWeight: 'bold' },
  sexControl: { width: 200, height: 30 },
  GiftedForm: { width: 250 },
  modalAvatar: {
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    height: screenWidth,
  },
  avatarSize: { width: (screenWidth * 4) / 5, height: (screenWidth * 4) / 5 },
});

export default connect(({ app, user, mine, record, loading }: IProps) => ({
  app,
  user,
  record,
  mine,
  dataLoading: loading?.effects['app/login'],
}))(UserInfo);
