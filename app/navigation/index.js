import { Platform, StatusBar, Text, useColorScheme, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { languageSelect } from '@selectors';
import { useEffect, useRef, useState } from 'react';
import { BaseSetting, useTheme } from '@config';
import * as Font from 'expo-font';
import i18n from 'i18next';
import { ApplicationActions } from '@actions';
import { initReactI18next, useTranslation } from 'react-i18next';
import * as Utils from '@utils';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getInto } from '@selectors';
import Home from '@screens/Home';
import Profile from '@screens/Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BaseColor, BaseStyle } from '@config';
import { tabBarIcon } from '@navigation/components';
import SliderIntro from '@screens/SliderIntro';
import ChangePassword from '@screens/ChangePassword';
import Setting from '@screens/Setting';
import ProfileEdit from '@screens/ProfileEdit';
import SignUp from '../screens/SignUp';
import SignIn from '../screens/SignIn';
import ThemeSetting from '../screens/ThemeSetting';
import ChangeLanguage from '../screens/ChangeLanguage';
import ResetPassword from '../screens/ResetPassword';
import SelectDarkOption from '../screens/SelectDarkOption';
import SelectFontOption from '../screens/SelectFontOption';

const SettingsStack = createStackNavigator();
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

const AuthScreens = () => {
  const intro = useSelector(getInto);
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={intro ? 'SliderIntro' : 'SignIn'}>
      <AuthStack.Screen key="SlideIntro" name="SlideIntro" component={SliderIntro} />
      <MainStack.Screen key="SignIn" name="SignIn" component={SignIn} />
      <MainStack.Screen key="SingUp" name="SignUp" component={SignUp} />
      <MainStack.Screen key="ResetPassword" name="ResetPassword" component={ResetPassword} />
    </AuthStack.Navigator>
  );
};

const ProfileSettings = () => {
  return (
    <SettingsStack.Navigator
      initialRouteName={'Profile'}
      screenOptions={{
        headerShown: false
      }}>
      <SettingsStack.Screen key="Profile" name="Profile" component={Profile} />
      <SettingsStack.Screen key="ChangePassword" name="ChangePassword" component={ChangePassword} />
      <SettingsStack.Screen key="ProfileEdit" name="ProfileEdit" component={ProfileEdit} />
      <SettingsStack.Screen key="Setting" name="Setting" component={Setting} />
      <SettingsStack.Screen key="ThemeSetting" name="ThemeSetting" component={ThemeSetting} />
      <SettingsStack.Screen key="ChangeLanguage" name="ChangeLanguage" component={ChangeLanguage} />
      <SettingsStack.Screen
        key="SelectDarkOption"
        name="SelectDarkOption"
        component={SelectDarkOption}
      />
      <SettingsStack.Screen
        key="SelectFontOption"
        name="SelectFontOption"
        component={SelectFontOption}
      />
    </SettingsStack.Navigator>
  );
};

const MainScreens = () => {
  // Check display intro screen
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <BottomTab.Navigator
      initialRouteName={'Home'}
      tabBarOptions={{
        showIcon: true,
        showLabel: true,
        activeTintColor: colors.primaryColor,
        inactiveTintColor: BaseColor.grayColor,
        style: BaseStyle.tabBar,
        labelStyle: {
          fontSize: 12
        },
      }}>
      <BottomTab.Screen
        key="Home"
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => tabBarIcon({ color, name: 'home' }),
          title: t('Home')
        }}
      />
      <BottomTab.Screen
        key="ProfileSettings"
        name="ProfileSettings"
        component={ProfileSettings}
        options={{
          tabBarIcon: ({ color }) => tabBarIcon({ color, name: 'user-circle' }),
          title: t('Profile')
        }}
      />
    </BottomTab.Navigator>
  );
};

const Navigator = () => {
  const { theme } = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const language = useSelector(languageSelect);
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigationRef = useRef(null);

  useEffect(() => {
    // Config status bar
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor(isDarkMode ? 'black' : 'white', true);
    }
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
  }, [isDarkMode]);

  useEffect(() => {
    const onProcess = async () => {
      // Lazy loady Font
      await Font.loadAsync(BaseSetting.resourcesFont);
      // Get current language of device
      const languageCode = language ?? BaseSetting.defaultLanguage;
      dispatch(ApplicationActions.onChangeLanguage(languageCode));
      // Config language for app
      await i18n.use(initReactI18next).init({
        resources: BaseSetting.resourcesLanguage,
        lng: languageCode,
        fallbackLng: languageCode
      });
      setLoading(false);
      Utils.enableExperimental();
    };
    onProcess();
  }, []);

  if (loading) {
    return null;
  }
  console.log('STATE:' + JSON.stringify(state.auth.user));
  console.log('PROCESS' + process.env.API_KEY);
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <NavigationContainer theme={theme} ref={navigationRef}>
        <MainStack.Navigator
          initialRouteName={state.auth.user ? 'Home' : 'Auth'}
          screenOptions={{
            headerShown: false
          }}>
          <MainStack.Screen key="Main" name="Main" component={MainScreens} />
          <MainStack.Screen key="Auth" name="Auth" component={AuthScreens} />
        </MainStack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default Navigator;
