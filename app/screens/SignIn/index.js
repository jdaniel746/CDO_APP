import { AuthActions } from '@actions';
import { Button, SafeAreaView, Text, TextInput } from '@components';
import { BaseColor, BaseStyle, useTheme, Images } from '@config';
import React, { useState } from 'react';
import { Formik } from 'formik';
import {
  ScrollView,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useDispatch } from 'react-redux';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

const { login } = AuthActions;
const loginValidationSchema = yup.object().shape({
  user: yup.string().email('error.email.invalid').required('error.email.required'),
  password: yup.string().required('error.password.required')
});

const SignIn = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onLogin = (values) => {
    if (values.user !== '' && values.password !== '') {
      setLoading(true);
      dispatch(
        login({ user: values.user, password: values.password }, (response) => {
          if (response.success) {
            navigation.navigate('Main');
          } else {
            console.log('error'+JSON.stringify(response))
            setLoading(false);
          }
        })
      );
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20
  });

  return (
    <Formik
      initialValues={{ user: '', password: '' }}
      validationSchema={loginValidationSchema}
      onSubmit={(values) => {
        onLogin(values);
      }}>
      {({ handleSubmit, handleChange, handleBlur, values, errors }) => (
        <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={offsetKeyboard}
            style={{
              flex: 1
            }}>
            <View style={styles.contain}>
              <TextInput
                style={[BaseStyle.textInput]}
                onChangeText={handleChange('user')}
                name="user"
                onBlur={handleBlur('user')}
                autoCorrect={false}
                errors={errors.user}
                placeholder={t('input_email')}
                placeholderTextColor={errors.user ? BaseColor.grayColor : colors.primary}
                value={values.user}
                selectionColor={errors.user ? '#ff0000' : colors.primary}
              />
              <TextInput
                style={[BaseStyle.textInput, { marginTop: 10 }]}
                name="password"
                errors={errors.password}
                onChangeText={handleChange('password')}
                autoCorrect={false}
                onBlur={handleBlur('password')}
                placeholder={t('input_password')}
                secureTextEntry={true}
                placeholderTextColor={errors.password ? BaseColor.grayColor : colors.primary}
                value={values.password}
                selectionColor={colors.primary}
              />
              <View style={{ width: '100%', marginVertical: 16 }}>
                <Button full loading={loading} style={{ marginTop: 20 }} onPress={handleSubmit}>
                  {t('sign_in')}
                </Button>
              </View>
              <View style={styles.contentActionBottom}>
                <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
                  <Text body2 grayColor>
                    {t('forgot_your_password')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text body2 primaryColor>
                    {t('not_have_account')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </Formik>
  );
};

export default SignIn;
