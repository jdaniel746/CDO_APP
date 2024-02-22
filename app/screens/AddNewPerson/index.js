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

const { fetchPerson, updatePerson } = PersonActions;
//const minDate = dayjs().add(2, 'day').format('YYYY-MM-DD');
const profileValidationSchema = yup.object().shape({
  identify: yup.string().min(7, 'error.identify.min').max(8, 'error.identify.max'),
  firstname: yup
    .string()
    .required('error.firstname.required')
    .min(3, 'error.firstname.min')
    .max(15, 'error.firstname.max'),
    //invitedBy: yup.string().min(3, 'error.middlename.min').max(20, 'error.middlename.max'),
  lastname: yup
    .string()
    .required('error.lastname.required')
    .min(3, 'error.lastname.min')
    .max(15, 'error.lastname.max'),
  address: yup.string().min(10, 'error.address.min').max(100, 'error.address.max'),
  birthdate: yup.date(),
  phone_number: yup.number().typeError("error.phone.format")
  .positive("error.phone.positive")
  .integer("error.phone.integer")
  .test('len', 'error.phone.length', val => val?.toString().length === 7)
  .required('error.phone.required'),
  phone_code: yup.number().typeError("That doesn't look like a phone number")
  .positive("A phone number can't start with a minus")
  .integer("A phone number can't include a decimal point")
  .test('len', 'error.code.length', val => val?.toString().length === 3)
  .required('error.code.required'),

  local_number: yup.number().typeError("error.phone.format")
  .positive("error.phone.positive")
  .integer("error.phone.integer")
  .test('len', 'error.phone.length', val => val?.toString().length === 7)
  .required('error.phone.required'),
  local_code: yup.number().typeError("That doesn't look like a phone number local")
  .positive("A phone number can't start with a minus")
  .integer("A phone number can't include a decimal point")
  .test('len', 'error.code.length', val => val?.toString().length === 3)
  .required('error.code.required'),

  invited_by: yup
  .string()
  .required('error.firstname.required')
  .min(3, 'error.firstname.min')
  .max(15, 'error.firstname.max'),
});

const AddNew = (props) => {
  const { navigation } = props;
  const auth = useSelector((state) => state.auth);
  const user = auth.user;
  const person = useSelector((state) => state.person);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [avatar, setAvatar] = useState(user.avatar);
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

  useEffect(() => {
  }, [birthdate]);

  useEffect(() => {
    if (!person.person) {
      try {
        setIsLoading(true);
        dispatch(
          fetchPerson(user.id, (response) => {
            console.log('response:' + JSON.stringify(response));
            setIsLoading(false);
            if(!response.success){
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: response.message
              });
            }
          })
        );
      } catch (e) {
        setIsLoading(false);
        console.log('ERROR PERSONA :' + e);
      }
    }
  }, [person]);

  const handlerUpdate = (form) => {
    setIsLoading(true);
    form.id = user.id;
    form.birthdate = birthdate;
    dispatch(
      updatePerson(form, (response) => {
        console.log('responseU:' + JSON.stringify(response));
        setIsLoading(false);
        if (response.success) {
          Toast.show({
            type: 'success',
            text1: 'Exito',
            text2: ' Registro Exitoso!'
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'No se pudo registrar!'
          });
        }
      })
    );
  };

 

  return (
    <>
      <Spinner visible={isLoading} />
      {person.person && (
        <Formik
          initialValues={{
            identify: '',
            firstname: '',
            lastname: '',
            address: '', 
            birthdate: '',
            phone_code: '',
            phone_number: '',
            local_number: '',
            local_code: '',
            invited_by: ''

           
            /*code_local: '',
            phone_local: '',
            invitedBy: '',*/
          }}
          validationSchema={profileValidationSchema}
          onSubmit={(values) => {
            handlerUpdate(values);
          }}>
          {({ handleSubmit, setFieldValue, handleChange, handleBlur, values, errors }) => (
            <SafeAreaView style={BaseStyle.safeAreaView} edges={['right', 'top', 'left']}>
              <DateTimePicker
                mode="date"
                isVisible={isDateTimePickerVisible}
                onConfirm={handleDatePicked}
                onCancel={hideDateTimePicker}
              />
              <Header
                title={t('Add_Person')}
                renderLeft={() => {
                  return (
                    <Icon name="angle-left" size={20} color={colors.primary} enableRTL={true} />
                  );
                }}
                onPressLeft={() => {
                  navigation.goBack();
                }}
                onPressRight={() => {}}
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
                        onChangeText={handleChange('phone_code')}
                        placeholder={t('phone_code')}
                        name="phone_code"
                        onBlur={handleBlur('phone_code')}
                        errors={errors.phone_code}
                        keyboardType="numeric"
                        value={values.phone_code}
                      />
                    </View>
                    <View style={{ flex: 7, marginLeft: 10 }}>
                      <TextInput
                        onChangeText={handleChange('phone_number')}
                        placeholder={t('phone_number')}
                        keyboardType="numeric"
                        name="phone_number"
                        onBlur={handleBlur('phone_number')}
                        errors={errors.phone_number}
                        value={values.phone_number}
                      />
                    </View>
                  </View>



                  <View style={styles.contentTitle}>
                    <Text headline semibold>
                      {t('Local')}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <View style={{ flex: 3 }}>
                      <TextInput
                        onChangeText={handleChange('local_code')}
                        placeholder={t('local_code')}
                        name="local_code"
                        onBlur={handleBlur('local_code')}
                        errors={errors.local_code}
                        keyboardType="numeric"
                        value={values.local_code}
                      />
                    </View>
                    <View style={{ flex: 7, marginLeft: 10 }}>
                      <TextInput
                        onChangeText={handleChange('local_number')}
                        placeholder={t('local_number')}
                        keyboardType="numeric"
                        name="local_number"
                        onBlur={handleBlur('local_number')}
                        errors={errors.local_number}
                        value={values.local_number}
                      />
                    </View>
                  </View>

                  <View style={styles.contentTitle}>
                    <Text headline semibold>
                      {t('invited_by')}
                    </Text>
                  </View>
                  <TextInput
                    style={BaseStyle.textInput}
                    onChangeText={handleChange('invited_by')}
                    name="invited_by"
                    onBlur={handleBlur('invited_by')}
                    errors={errors.invited_by}
                    autoCorrect={false}
                    placeholder={t('invited_by')}
                    placeholderTextColor={BaseColor.grayColor}
                    value={values.invited_by}
                    selectionColor={colors.primary}
                  />

                 

                 

                  
                  
                  
                  
                  

                  
                </View>
              </ScrollView>
              <View style={{ padding: 20 }}>
                <Button full onPress={handleSubmit}>
                  {t('confirm')}
                </Button>
              </View>
            </SafeAreaView>
          )}
        </Formik>
      )}
    </>
  );
};

export default AddNew;