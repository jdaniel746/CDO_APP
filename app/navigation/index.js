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
import AssistanceGroup from '../screens/Assistance';
import ThemeSetting from '../screens/ThemeSetting';
import ChangeLanguage from '../screens/ChangeLanguage';
import ResetPassword from '../screens/ResetPassword';
import SelectDarkOption from '../screens/SelectDarkOption';
import SelectFontOption from '../screens/SelectFontOption';
import { createDrawerNavigator } from '@react-navigation/drawer';
import PSelectAssignee from '../screens/PSelectAssignee';
import AddNewPerson from '../screens/AddNewPerson';
import PredicasDeGrupoSemanal from '../screens/PredicasDeGrupo';
import ListaDePredicas from '../screens/ListaDePredicas';
import CustomDrawer from "./components/CustomDrawer";
import Discipulados from '../screens/Discipulados';
import supabase from "../config/supabase";
import Toast from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { retrieveGroupsByUser } from "../actions/groups";
import * as actionTypes from "../actions/authActionTypes";


const SettingsStack = createStackNavigator();
const AssistanceStack = createStackNavigator();
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const ListarPredicasStack = createDrawerNavigator();



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


const DrawerNavigator = () => {
  const { t } = useTranslation();
  
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#da0048',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: 0,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen name={t("Home")} component={MainScreens} />
      <Drawer.Screen name={t("Contact")} component={PSelectAssignee} />
      <Drawer.Screen name={t("Preach of group")} component={PredicasDeGrupoSemanal} />
      <Drawer.Screen name={t("Disciples")} component={Discipulados} />
      <Drawer.Screen name={t("Assistance")} component={Assistance} />
      <Drawer.Screen name="Lista" component={ListaDePredicas} />
    </Drawer.Navigator>
  );
};

const Assistance = () => {
  
  return (
    <AssistanceStack.Navigator
      initialRouteName={'Assistance'}
      screenOptions={{
        headerShown: false
      }}>
      <SettingsStack.Screen key="Assistance" name="Assistance" component={AssistanceGroup} />
      <SettingsStack.Screen key="PeopleSelect" name="PeopleSelect" component={PSelectAssignee} />
      <SettingsStack.Screen key="AddNewPerson" name="AddNewPerson" component={AddNewPerson} />
      
      
      
    </AssistanceStack.Navigator>
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
        }
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

const onLoginSuccess = (data) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    data
  };
};

const Navigator = (props) => {
  const { navigation } = props;
  const { theme } = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const language = useSelector(languageSelect);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigationRef = useRef(null);

  useEffect(() => {
    console.log('STATE NAVIGATION: ' + JSON.stringify(auth));
  }, [auth.user]);

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

      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("ONAUTH")
        console.log(event)
        console.log("----------")
        console.log(session)
        switch (event) {
          case 'USER_UPDATED':
            if (session) {
              await init(session)
            }
            break;
          case 'SIGNED_IN':
            console.log("entro signed")
            if (session) {
              await init(session, dispatch)
              navigation.navigate('Main');
            } else {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Debe activar su cuenta enviada a su email!'
              });
              //callback({ success: false, message: 'Debe activar su cuenta enviada a su email!' });
            }
            break;
          case 'SIGNED_OUT':
            console.log("SIGNED OUT")
            break;
          case 'INITIAL_SESSION':
            console.log("entro initial sesion "+JSON.stringify(session))
            if(session) {
              await init(session)
              navigation.navigate('Main');
            }
            else {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'usuario o password invalidos!'
              });
              //callback({ success: false, message: 'usuario o password invalidos!' });
            }
            break;
          default:
            console.log("default")
          //callback({ success: false, message: 'usuario o password invalidos!' });
        }
      })
    };
    onProcess();
  }, []);

  const init = async function(session) {
    const { data, error } = await supabase.from('person').select('id').eq('user_id', session.user.id).single()
    console.log(data)
    let sessionData = {
      user: {
        lang: session.user.user_metadata.lang ?? 'es',
        email: session.user.email,
        id: session.user.id,
        firstname: session.user.user_metadata.firstname,
        lastname: session.user.user_metadata.lastname,
        avatar: session.user.user_metadata.avatar,
        role_id: session.user.user_metadata.role_id,
        active: session.user.user_metadata.active,
        person_id: data.id
      }
    };
    AsyncStorage.setItem('token', JSON.stringify(session.access_token));
    dispatch(onLoginSuccess(sessionData));
    dispatch(retrieveGroupsByUser(sessionData.user, (response) => {
      console.log(JSON.stringify(response))
    }))
  }

  if (loading) {
    return null;
  }
  console.log('STATE:' + JSON.stringify(auth.user));
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <NavigationContainer theme={theme} ref={navigationRef}>
        <MainStack.Navigator
          initialRouteName={auth.user && auth.user.id != null ? 'Main' : 'Auth'}
          screenOptions={{
            headerShown: false
          }}>
          {auth.user && auth.user.id != null ? (
            <>
              <MainStack.Screen key="Main" name="Main" component={DrawerNavigator} />
            </>
          ) : (
            <MainStack.Screen key="Auth" name="Auth" component={AuthScreens} />
          )}
        </MainStack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default Navigator;
