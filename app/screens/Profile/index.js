import { AuthActions } from '@actions';
import {
  Button,
  Icon,
  ProfileDetail,
  ProfilePerformance,
  SafeAreaView,
  Tag,
  Text
} from '@components';
import { BaseStyle, useTheme, Images } from '@config';
// Load sample data
import { UserData } from '@data';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';
const { logout } = AuthActions;

const Profile = (props) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { navigation } = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [userData] = useState(UserData[0]);
  const auth = useSelector((state) => state.auth);
  const user = auth.user;
  /**
   * @description Simple logout with Redux
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   */
  const onLogOut = () => {
    setLoading(true);
    dispatch(
      logout((response) => {
        setLoading(false);
        navigation.navigate('Auth');
      })
    );
  };

  const styleItem = {
    ...styles.profileItem,
    borderBottomColor: colors.border
  };
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
      {user && (
        <>
          <View style={[BaseStyle.container, { flex: 1 }]}>
            <View style={{ marginBottom: 20 }}>
              <Text header bold>
                {t('setting')}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <ProfileDetail
                  image={user.avatar}
                  textFirst={user?.fullName}
                  point={userData.point}
                  textSecond={userData.address}
                  textThird={userData.id}
                  onPress={() => {}}
                />
                <View style={styles.viewFollow}>
                  <View style={{ flex: 3 }}>
                    <Tag primary style={styles.follow} styleText={{}}>
                      + {t('follow')}
                    </Tag>
                  </View>

                  <View style={{ flex: 5 }}>
                    <ProfilePerformance data={userData.performance} />
                  </View>
                </View>
                <View style={{ width: '100%' }}>
                  <TouchableOpacity
                    style={styleItem}
                    onPress={() => {
                      navigation.navigate('Setting');
                    }}>
                    <Text body1>{t('setting')}</Text>
                    <Icon
                      name="angle-right"
                      size={18}
                      color={colors.primary}
                      style={{ marginLeft: 5 }}
                      enableRTL={true}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styleItem}
                    onPress={() => {
                      navigation.navigate('ProfileEdit');
                    }}>
                    <Text body1>{t('edit_profile')}</Text>
                    <Icon
                      name="angle-right"
                      size={18}
                      color={colors.primary}
                      style={{ marginLeft: 5 }}
                      enableRTL={true}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styleItem}
                    onPress={() => {
                      navigation.navigate('ChangePassword');
                    }}>
                    <Text body1>{t('change_password')}</Text>
                    <Icon
                      name="angle-right"
                      size={18}
                      color={colors.primary}
                      style={{ marginLeft: 5 }}
                      enableRTL={true}
                    />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={{ padding: 10 }}>
            <Button full loading={loading} onPress={() => onLogOut()}>
              {t('sign_out')}
            </Button>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Profile;
