import { Button, Header, Icon, Image, SafeAreaView, Text, TextInput, CardList } from '@components';
import { BaseColor, BaseStyle, useTheme, Images } from '@config';
// Load sample data
import Spinner from 'react-native-loading-spinner-overlay';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { PersonActions } from '@actions';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as yup from 'yup';
import dayjs from 'dayjs';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { storage } from '@config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Toast from 'react-native-toast-message';
import UserIcon from '../../assets/images/user.png'
import { AuthActions } from '@actions';
//import * as ImagePicker from 'expo-image-picker';
//import * as ImageManipulator from 'expo-image-manipulator';


const { fetchPerson, updatePerson } = PersonActions;
//const minDate = dayjs().add(2, 'day').format('YYYY-MM-DD');

const newValidationSchema = yup.object().shape({
  identify: yup.string().min(7, 'error.identify.min').max(8, 'error.identify.max'),
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
  surname: yup.string().min(3, 'error.surname.min').max(20, 'error.surname.max'),
  address: yup.string().min(10, 'error.address.min').max(100, 'error.address.max'),
  birthdate: yup.date(),
  phone: yup.number().test('len', 'error.phone.length', (val) => val.toString().length === 7),
  local: yup.number().test('len', 'error.phone.length', (val) => val.toString().length === 7),
  code: yup.number().test('len', 'error.code.length', (val) => val.toString().length === 3),
  code_local: yup.number().test('len', 'error.code.length', (val) => val.toString().length === 3),
  invitadoPor: yup
    .string()
    .required('error.invitadoPor.required')
    .min(3, 'error.invitadoPor.min')
    .max(15, 'error.invitadoPor.max'),
});


const NewPerson = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [birthdate, setBirthdate] = useState();
  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showDateTimePicker = () => {
    setIsDateTimePickerVisible(true);
  };

  const hideDateTimePicker = () => {
    setIsDateTimePickerVisible(false);
  };

  const handleDatePicked = (date) => {
    setBirthdate(dayjs(date).format('YYYY-MM-DD'));
    hideDateTimePicker();
  };

  const onAddNew = (values) => {
    if (
      values.identify !== '' &&
      values.firstname !== '' &&
      values.lastname !== '' &&
      values.address !== '' &&
      values.birthdate !== '' &&
      values.code !== '' &&
      values.phone!== '' &&
      values.code_local!== '' &&
      values.code_local!== '' &&
      values.local!== '' &&
      values.invitadoPor !== ''

    ) {
      setLoading(true);
      dispatch(
        registerNew(values, (response) => {
          if (response.success) {
            Toast.show({
              type: 'success',
              text1: 'Exito',
              text2: ' Registro exitoso!'
            });
            navigation.navigate('Assistance');
          } else {
            console.log('error' + JSON.stringify(response));
            setLoading(false);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: ' No se pudo registrar!'
            });
            
          }
        })
      );
    }
  };
  return (
    <>
    <Spinner visible={isLoading} />

     
        <Formik
          initialValues={{
            identify: '',
            firstname: '',
            lastname: '',
            address: '', 
            birthdate: '',
            phone: '',
            code: '',
            code_local: '',
            local: '',
            
          }}
          validationSchema={newValidationSchema}
          onSubmit={(values) => {
            onAddNew(values);
          }}>
          {({ handleSubmit, handleChange, handleBlur, values, errors }) => (
            <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
              <DateTimePicker
                mode="date"
                isVisible={isDateTimePickerVisible}
                onConfirm={handleDatePicked}
                onCancel={hideDateTimePicker}
              />
              <Header
                title={t('Nuevo Convertido')}
                renderLeft={() => {
                  return <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />;
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
          />
              <ScrollView>
              <View style={styles.contain}>
                  {/*<View><Image source={image} style={styles.thumb} /></View>*/}
                  
                  <View style={styles.contentTitle}>
                    <Text headline semibold>
                      {t('identify')}
                    </Text>
                  </View>
                  <TextInput
                    style={BaseStyle.textInput}
                    onChangeText={handleChange('identify')}
                    name="identify"
                    onBlur={handleBlur('identify')}
                    errors={errors.identify}
                    autoCorrect={false}
                    placeholder={t('identify')}
                    placeholderTextColor={BaseColor.grayColor}
                    value={values.identify}
                    selectionColor={colors.primary}
                  />
                  <View style={styles.contentTitle}>
                    <Text headline semibold>
                      {t('input_firstname')}
                    </Text>
                  </View>
                  <TextInput
                    style={BaseStyle.textInput}
                    onChangeText={handleChange('firstname')}
                    name="firstname"
                    onBlur={handleBlur('firstname')}
                    errors={errors.firstname}
                    autoCorrect={false}
                    placeholder={t('input_firstname')}
                    placeholderTextColor={BaseColor.grayColor}
                    value={values.firstname}
                    selectionColor={colors.primary}
                  />           
                  
                  <View style={styles.contentTitle}>
                    <Text headline semibold>
                      {t('input_lastname')}
                    </Text>
                  </View>
                  <TextInput
                    style={BaseStyle.textInput}
                    onChangeText={handleChange('lastname')}
                    name="lastname"
                    onBlur={handleBlur('lastname')}
                    errors={errors.lastname}
                    autoCorrect={false}
                    placeholder={t('input_lastname')}
                    placeholderTextColor={BaseColor.grayColor}
                    value={values.lastname}
                    selectionColor={colors.primary}
                  />
                  
                  <View style={styles.contentTitle}>
                    <Text headline semibold>
                      {t('input_address')}
                    </Text>
                  </View>
                  <TextInput
                    style={BaseStyle.textInput}
                    onChangeText={handleChange('address')}
                    name="address"
                    onBlur={handleBlur('address')}
                    errors={errors.address}
                    autoCorrect={false}
                    multiline={true}
                    placeholder={t('input_address')}
                    placeholderTextColor={BaseColor.grayColor}
                    value={values.address}
                    selectionColor={colors.primary}
                  />
                  <View style={styles.contentTitle}>
                    <Text headline semibold>
                      {t('input_birthdate')}
                    </Text>
                  </View>
                  <TextInput
                    style={BaseStyle.textInput}
                    onChangeText={() => {}}
                    name="birthdate"
                    onBlur={handleBlur('birthdate')}
                    errors={errors.birthdate}
                    autoCorrect={false}
                    placeholder={t('input_birthdate')}
                    placeholderTextColor={BaseColor.grayColor}
                    value={birthdate ?? values.birthdate}
                    selectionColor={colors.primary}
                    editable={false}
                    icon={
                      <TouchableOpacity onPress={showDateTimePicker}>
                        <Icon name="calendar" size={25} color={BaseColor.grayColor} />
                      </TouchableOpacity>
                    }
                  />
                  <View style={styles.contentTitle}>
                    <Text headline semibold>
                      {t('input_phone')}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ flex: 3 }}>
                      <TextInput
                        onChangeText={handleChange('code')}
                        placeholder={t('code')}
                        name="code"
                        onBlur={handleBlur('code')}
                        errors={errors.code}
                        keyboardType="numeric"
                        value={values.code}
                      />
                    </View>
                    <View style={{ flex: 7, marginLeft: 10 }}>
                      <TextInput
                        onChangeText={handleChange('phone')}
                        placeholder={t('phone_number')}
                        keyboardType="numeric"
                        name="phone"
                        onBlur={handleBlur('phone')}
                        errors={errors.phone}
                        value={values.phone}
                      />
                    </View>
                  </View>


                  <View style={styles.contentTitle}>
                    <Text headline semibold>
                      {t('Telefono local')}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ flex: 3 }}>
                      <TextInput
                        onChangeText={handleChange('code_local')}
                        placeholder={t('code_local')}
                        name="code_local"
                        onBlur={handleBlur('code_local')}
                        errors={errors.code_local}
                        keyboardType="numeric"
                        value={values.code_local}
                      />
                    </View>
                    <View style={{ flex: 7, marginLeft: 10 }}>
                      <TextInput
                        onChangeText={handleChange('local')}
                        placeholder={t('local_number')}
                        keyboardType="numeric"
                        name="local"
                        onBlur={handleBlur('local')}
                        errors={errors.local}
                        value={values.local}
                      />

                    </View>
                  </View>

                  <View style={styles.contentTitle}>
                    <Text headline semibold>
                      {t('¿Quien te invito?')}
                    </Text>
                  </View>
                  <TextInput
                    style={BaseStyle.textInput}
                    onChangeText={handleChange('invitadoPor')}
                    name="invitadoPor"
                    onBlur={handleBlur('Quien te invito')}
                    errors={errors.invitadoPor}
                    autoCorrect={false}
                    placeholder={t('input_invitadoPor')}
                    placeholderTextColor={BaseColor.grayColor}
                    value={values.invitadoPor}
                    selectionColor={colors.primary}
                  />           
                  

                  
                </View>
              </ScrollView>
              <View style={{ padding: 20 }}>
                <Button full onPress={handleSubmit} loading={loading}>
                  {t('confirm')}
                </Button>
              </View>
            </SafeAreaView>
          )}
        </Formik>
    </>
  );
};


export default NewPerson;