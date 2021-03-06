/* eslint-disable react-native/no-inline-styles */
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
import MyModal from './Modal';

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
  const [gender, setGender] = useState<number>(user?.gender);
  const [randomAvatar, setRandomAvatar] = useState<number>(0);
  const [passwordForm, setPasswordForm] = useState<PasswordFormType>({
    password: '',
    confirmPassword: '',
  });
  const [avatarModal, setAvatarModal] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleType, setVisibleType] = useState<number>(0);

  const handlePasswordValueChange = (values: PasswordFormType) => {
    setPasswordForm(values);
  };

  const getUserInfo = () => {
    (dispatch as Dispatch)({
      type: 'user/getUserInfo',
      payload: {
        success: () => {},
        fail: () => {
          Toast.fail('????????????????????????');
        },
      },
    });
  };

  useEffect(() => {
    getUserInfo();
    setRandomAvatar((NavigationUtil.getParams() as any).randomAvatar);
  }, []);

  const loginOut = () => {
    Modal.alert('????????????', '???????????????????????????????????????????????????', [
      { text: '??????', onPress: () => console.log('cancel'), style: 'cancel' },
      {
        text: '??????',
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
                    username: '?????? / ??????',
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
      '????????????',
      <GiftedForm
        style={styles.GiftedForm}
        formName="passwordForm"
        scrollEnabled={false}
        onValueChange={handlePasswordValueChange}
        validators={{
          password: {
            title: '??????',
            validate: [
              {
                validator: 'isLength',
                arguments: [6, 16],
                message: '{TITLE}?????????{ARGS[0]}???{ARGS[1]}?????????',
              },
              {
                validator: 'matches',
                arguments: passwordRegex,
                message: '{TITLE}????????????1??????????????????1?????????',
              },
              {
                validator: 'matches',
                arguments: passwordNoSpaceRegex,
                message: '{TITLE}?????????????????????',
              },
            ],
          },
          confirmPassword: {
            title: '????????????',
            validate: [
              {
                validator: (value: string) => {
                  if (value === getValue(['password']).password) {
                    return true;
                  }
                  return false;
                },
                message: '???????????????????????????',
              },
            ],
          },
        }}
      >
        <GiftedForm.TextInputWidget
          name="password"
          title=""
          placeholder="???????????????"
          clearButtonMode="while-editing"
          maxLength={16}
          style={{ color: '#515151', width: 225 }}
          value={passwordForm.password}
          placeholderTextColor="#515151"
          secureTextEntry={true}
        />
        <GiftedForm.TextInputWidget
          name="confirmPassword"
          title=""
          placeholder="???????????????????????????"
          clearButtonMode="while-editing"
          maxLength={16}
          placeholderTextColor="#515151"
          style={{ color: '#515151', width: 225 }}
          value={passwordForm.confirmPassword}
          secureTextEntry={true}
        />
      </GiftedForm>,
      [
        {
          text: '??????',
          onPress: () => {
            setPasswordForm({
              password: '',
              confirmPassword: '',
            });
          },
          style: 'cancel',
        },
        {
          text: '??????',
          onPress: () => {
            const { password, confirmPassword } = getValue([
              'password',
              'confirmPassword',
            ]);
            if (password !== confirmPassword) {
              Toast.fail('?????????????????????????????????????????????????????????', 0.5);
              return;
            }
            if (!passwordRegex.test(password)) {
              Toast.fail(
                '?????????????????????1??????????????????1?????????????????????????????????6?????????',
                0.5
              );
              return;
            }
            (dispatch as Dispatch)({
              type: 'user/updatePassword',
              payload: {
                password,
                success: () => {
                  Toast.success('????????????????????????????????????', 0.5);
                  setPasswordForm({
                    password: '',
                    confirmPassword: '',
                  });
                  (dispatch as Dispatch)({
                    type: 'app/loginOut',
                    payload: {
                      callback: () => {
                        NavigationUtil.goBack();
                        (dispatch as Dispatch)({
                          type: 'user/save',
                          payload: {
                            avatar_url: '',
                            username: '?????? / ??????',
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
                fail: () => {
                  Toast.fail('????????????????????????????????????', 0.5);
                },
              },
            });
          },
        },
      ]
    );
  };

  const usernameChange = (value: string) => {
    if (!usernameRegex.test(value)) {
      Toast.fail(
        '???????????????3???16??????a???z???A~Z??????????????????0???9???????????????????????????',
        0.5
      );
      return;
    } else {
      (dispatch as Dispatch)({
        type: 'user/updateUsername',
        payload: {
          username: value,
          success: () => {
            Toast.success('???????????????????????????????????????', 0.5);
            (dispatch as Dispatch)({
              type: 'app/loginOut',
              payload: {
                callback: () => {
                  NavigationUtil.goBack();
                  (dispatch as Dispatch)({
                    type: 'user/save',
                    payload: {
                      avatar_url: '',
                      username: '?????? / ??????',
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
          fail: () => {
            Toast.fail('???????????????????????????', 0.5);
          },
        },
      });
    }
    // Modal.prompt(
    //   '???????????????',
    //   '',
    //   (value: string) => {
    //     if (!usernameRegex.test(value)) {
    //       Toast.fail(
    //         '???????????????3???16??????a???z???A~Z??????????????????0???9???????????????????????????',
    //         0.5
    //       );
    //       return;
    //     } else {
    //       (dispatch as Dispatch)({
    //         type: 'user/updateUsername',
    //         payload: {
    //           username: value,
    //           success: () => {
    //             Toast.success('???????????????????????????????????????', 0.5);
    //             NavigationUtil.goBack();
    //           },
    //           fail: () => {
    //             Toast.fail('???????????????????????????', 0.5);
    //           },
    //         },
    //       });
    //     }
    //   },
    //   'default',
    //   '',
    //   ['??????????????????']
    // );
  };

  const handleSex = (value: string) => {
    setGender(value === '???' ? 1 : 0);
  };

  const mobileChange = (value: string) => {
    if (!phoneRegex.test(value)) {
      Toast.fail('????????????????????????????????????', 0.5);
      return;
    } else {
      (dispatch as Dispatch)({
        type: 'user/updateInfo',
        payload: {
          mobile_number: value,
          success: () => {
            getUserInfo();
            Toast.success('?????????????????????', 0.5);
          },
          fail: () => {
            Toast.fail('???????????????????????????', 0.5);
          },
        },
      });
    }
    // Modal.prompt(
    //   '???????????????',
    //   '',
    //   (value: string) => {
    //     if (!phoneRegex.test(value)) {
    //       Toast.fail('????????????????????????????????????', 0.5);
    //       return;
    //     } else {
    //       (dispatch as Dispatch)({
    //         type: 'user/updateInfo',
    //         payload: {
    //           mobile_number: value,
    //           success: () => {
    //             getUserInfo();
    //             Toast.success('?????????????????????', 0.5);
    //           },
    //           fail: () => {
    //             Toast.fail('???????????????????????????', 0.5);
    //           },
    //         },
    //       });
    //     }
    //   },
    //   'default',
    //   '',
    //   ['??????????????????']
    // );
  };

  const emailChange = (value: string) => {
    if (!emailRegex.test(value)) {
      Toast.fail('?????????????????????????????????', 0.5);
      return;
    } else {
      (dispatch as Dispatch)({
        type: 'user/updateInfo',
        payload: {
          email: value,
          success: () => {
            getUserInfo();
            Toast.success('??????????????????', 0.5);
          },
          fail: () => {
            Toast.fail('????????????????????????', 0.5);
          },
        },
      });
    }

    // Modal.prompt(
    //   '????????????',
    //   '',
    //   (value: string) => {
    //     if (!emailRegex.test(value)) {
    //       Toast.fail('?????????????????????????????????', 0.5);
    //       return;
    //     } else {
    //       (dispatch as Dispatch)({
    //         type: 'user/updateInfo',
    //         payload: {
    //           email: value,
    //           success: () => {
    //             getUserInfo();
    //             Toast.success('??????????????????', 0.5);
    //           },
    //           fail: () => {
    //             Toast.fail('????????????????????????', 0.5);
    //           },
    //         },
    //       });
    //     }
    //   },
    //   'default',
    //   '',
    //   ['???????????????']
    // );
  };

  const choosePic = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
    }).then(image => {
      const formData = new FormData();
      let file = {
        uri: image.path,
        name: image.filename,
        // type: image.mime,
      };
      console.log(image);
      formData.append('image', file);
      updatePicture(formData).then(res => {
        if (res.data.code === 0) {
          (dispatch as Dispatch)({
            type: 'user/updateInfo',
            payload: {
              avatar_url: res.data.res.requestUrls[0].split('?')[0],
              success: () => {
                getUserInfo();
                Toast.success('??????????????????', 0.5);
              },
              fail: () => Toast.fail('??????????????????,?????????', 0.5),
            },
          });
        }
      });
    });
  };

  const openAvatar = () => {
    setAvatarModal(true);
  };

  const footerButtons = [
    {
      text: '??????',
      onPress: () => {
        setGender(user?.gender);
      },
    },
    {
      text: '??????',
      onPress: () => {
        console.log(gender, user?.gender, '??????');
        (dispatch as Dispatch)({
          type: 'user/updateInfo',
          payload: {
            gender,
            success: () => {
              getUserInfo();
              setGender(gender ? 1 : 0);
              Toast.success('??????????????????', 0.5);
            },
            fail: () => {
              Toast.fail('????????????????????????????????????', 0.5, () =>
                setGender(user?.gender)
              );
            },
          },
        });
      },
    },
  ];

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
            <Text style={styles.avatar}>??????</Text>
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
        <TouchableOpacity activeOpacity={0.5} onPress={() => setVisibleType(1)}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            colors={['#a1ffce', '#faffd1']}
            style={styles.container}
          >
            <Text style={styles.left}>?????????</Text>
            <Text style={styles.right}>{username}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={() => setVisible(true)}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            colors={['#a1ffce', '#faffd1']}
            style={styles.container}
          >
            <Text style={styles.left}>??????</Text>
            <Text style={styles.right}>{user?.gender === 0 ? '???' : '???'}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={() => setVisibleType(2)}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            colors={['#a1ffce', '#faffd1']}
            style={styles.container}
          >
            <Text style={styles.left}>?????????</Text>
            <Text style={styles.right}>{mobile_number}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={() => setVisibleType(3)}>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            colors={['#a1ffce', '#faffd1']}
            style={styles.container}
          >
            <Text style={styles.left}>??????</Text>
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
            <Text style={styles.fontButton}>???</Text>
            <Text style={styles.fontButton}>???</Text>
            <Text style={styles.fontButton}>???</Text>
            <Text style={styles.fontButton}>???</Text>
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
            <Text style={styles.fontButton}>???</Text>
            <Text style={styles.fontButton}>???</Text>
            <Text style={styles.fontButton}>???</Text>
            <Text style={styles.fontButton}>???</Text>
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
      <Modal
        title="????????????"
        transparent
        onClose={() => {
          setVisible(false);
          setGender(user?.gender);
        }}
        maskClosable
        visible={visible}
        footer={footerButtons}
      >
        <View
          style={{
            paddingTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SegmentedControl
            values={['???', '???']}
            selectedIndex={user?.gender}
            style={styles.sexControl}
            onValueChange={handleSex}
          />
        </View>
      </Modal>

      <MyModal
        title="???????????????"
        visible={visibleType === 1 ? true : false}
        onClose={() => setVisibleType(0)}
        Input={[{ type: 'text', placeholder: '??????????????????', maxLength: 16 }]}
        handleConfirm={values => usernameChange(values[0])}
      />
      <MyModal
        title="???????????????"
        visible={visibleType === 2 ? true : false}
        onClose={() => setVisibleType(0)}
        Input={[{ type: 'phone', placeholder: '??????????????????', maxLength: 11 }]}
        handleConfirm={values => mobileChange(values[0].split(' ').join(''))}
      />
      <MyModal
        title="????????????"
        visible={visibleType === 3 ? true : false}
        onClose={() => setVisibleType(0)}
        Input={[{ type: 'text', placeholder: '???????????????' }]}
        handleConfirm={values => emailChange(values[0])}
      />
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
