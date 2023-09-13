import { Button, Header, Icon, SafeAreaView, TextInput } from '@components';
import { AuthActions } from '@actions';
import { BaseColor, BaseStyle, useTheme } from '@config';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import styles from './styles';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import Toast from 'react-native-toast-message';
const { register } = AuthActions;

const registerValidationSchema = yup.object().shape({
  email: yup.string().email('error.email.invalid').required('error.email.required'),
  firstname: yup
    .string()
    .required('error.firstname.required')
    .min(3, 'error.firstname.min')
    .max(15, 'error.firstname.max'),
  lastname: yup
    .string()
    .required('error.lastname.required')
    .min(3, 'error.lastname.min')
    .max(15, 'error.lastname.max'),
  password: yup.string().required('error.password.required'),
  passwordConfirm: yup
    .string()
    .test('passwords-match', 'error.password.notEquals', function (value) {
      return this.parent.password === value;
    })
});

const SignUp = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onSignUp = (values) => {
    if (
      values.firstname !== '' &&
      values.lastname !== '' &&
      values.email !== '' &&
      values.password !== ''
    ) {
      setLoading(true);
      dispatch(
        register(values, (response) => {
          if (response.success) {
            setLoading(false);
            navigation.navigate('SignIn');
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: ' Error creando cuenta!'
            });
            setLoading(false);
          }
        })
      );
    }
  };

  return (
    <Formik
      initialValues={{ email: '', name: '', lastname: '', password: '', passwordConfirm: '' }}
      validationSchema={registerValidationSchema}
      onSubmit={(values) => {
        onSignUp(values);
      }}>
      {({ handleSubmit, handleChange, handleBlur, values, errors }) => (
        <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
          <Header
            title={t('sign_up')}
            renderLeft={() => {
              return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
          <ScrollView>
            <View style={styles.contain}>
              <TextInput
                style={[BaseStyle.textInput, { marginTop: 65 }]}
                name="firstname"
                onChangeText={handleChange('firstname')}
                onBlur={handleBlur('firstname')}
                errors={errors.firstname}
                autoCorrect={false}
                placeholder={t('input_firstname')}
                placeholderTextColor={errors.firstname ? BaseColor.grayColor : colors.primary}
                value={values.firstname}
              />
              <TextInput
                style={[BaseStyle.textInput, { marginTop: 10 }]}
                onChangeText={handleChange('lastname')}
                onBlur={handleBlur('lastname')}
                autoCorrect={false}
                errors={errors.lastname}
                placeholder={t('input_lastname')}
                placeholderTextColor={errors.lastname ? BaseColor.grayColor : colors.primary}
                value={values.lastname}
              />
              <TextInput
                style={[BaseStyle.textInput, { marginTop: 10 }]}
                onChangeText={handleChange('email')}
                autoCorrect={false}
                errors={errors.email}
                placeholder={t('input_email')}
                keyboardType="email-address"
                placeholderTextColor={errors.email ? BaseColor.grayColor : colors.primary}
                value={values.email}
              />
              <TextInput
                style={[BaseStyle.textInput, { marginTop: 10 }]}
                onChangeText={handleChange('password')}
                autoCorrect={false}
                errors={errors.password}
                onBlur={handleBlur('password')}
                secureTextEntry={true}
                placeholder={t('input_password')}
                placeholderTextColor={errors.password ? BaseColor.grayColor : colors.primary}
                value={values.password}
              />
              <TextInput
                style={[BaseStyle.textInput, { marginTop: 10 }]}
                onChangeText={handleChange('passwordConfirm')}
                autoCorrect={false}
                onBlur={handleBlur('passwordConfirm')}
                secureTextEntry={true}
                errors={errors.passwordConfirm}
                placeholder={t('confirm_password')}
                placeholderTextColor={errors.passwordConfirm ? BaseColor.grayColor : colors.primary}
                value={values.passwordConfirm}
              />
              <View style={{ width: '100%' }}>
                <Button full style={{ marginTop: 20 }} loading={loading} onPress={handleSubmit}>
                  {t('sign_up')}
                </Button>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </Formik>
  );
};

export default SignUp;
