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
  middlename: yup.string().min(3, 'error.middlename.min').max(20, 'error.middlename.max'),
  lastname: yup
    .string()
    .required('error.lastname.required')
    .min(3, 'error.lastname.min')
    .max(15, 'error.lastname.max'),
  surname: yup.string().min(3, 'error.surname.min').max(20, 'error.surname.max'),
  address: yup.string().min(10, 'error.address.min').max(100, 'error.address.max'),
  birthdate: yup.date(),
  phone: yup.number().test('len', 'error.phone.length', (val) => val.toString().length === 7),
  code: yup.number().test('len', 'error.code.length', (val) => val.toString().length === 3)
});

const ProfileEdit = (props) => {
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
    form.photo = avatar;
    form.birthdate = birthdate;
    dispatch(
      updatePerson(form, (response) => {
        console.log('responseU:' + JSON.stringify(response));
        setIsLoading(false);
        if (response.success) {
          Toast.show({
            type: 'success',
            text1: 'Exito',
            text2: ' Actualizacion del perfil exitosa!'
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'No se pudo actualizar tu perfil!'
          });
        }
      })
    );
  };

  const ImageChoiceAndUpload = async () => {
    try {
      if (Platform.OS === 'ios') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission is required for use.');
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false
      });
      //AQUI ESTA//
      if (!result.canceled) {
        let actions = [];
        actions.push({ resize: { width: 300 } });
        const manipulatorResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          actions,
          {
            compress: 0.4
          }
        );
        const localUri = await fetch(manipulatorResult.uri);
        const localBlob = await localUri.blob();
        const filename = user.id;
        const storageRef = ref(storage, `perfil/${user.id}/` + filename);
        const uploadTask = uploadBytesResumable(storageRef, localBlob);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
           // setProgress(parseInt(progress) + '%');
          },
          (error) => {
            console.log(error);
            alert('Upload failed.');
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              //setProgress('');
              setAvatar(downloadURL);
            });
          }
        );
      }
    } catch (e) {
      console.log('error', e.message);
    }
  };

  return (
    <>
      <Spinner visible={isLoading} />
      {person.person && (
        <Formik
          initialValues={{
            identify: person.person?.identify,
            firstname: person.person?.firstname,
            middlename: person.person?.middlename,
            lastname: person.person?.lastname,
            surname: person.person?.surname,
            address: person.person?.address,
            birthdate: person.person?.birthdate ?? birthdate,
            phone: person.person?.phone,
            code: person.person?.code
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
                title={t('edit_profile')}
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
                  
                  <CardList
                    style={{}}
                    image={{ uri: avatar }}
                    title="Pastor(a)"
                    subtitle="Description new"
                    rate={4.5}
                    onPress={ImageChoiceAndUpload}
                    onPressTag={() => {}}
                  />
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
                      {t('input_middlename')}
                    </Text>
                  </View>
                  <TextInput
                    style={BaseStyle.textInput}
                    onChangeText={handleChange('middlename')}
                    name="middlename"
                    onBlur={handleBlur('middlename')}
                    errors={errors.middlename}
                    autoCorrect={false}
                    placeholder={t('input_middlename')}
                    placeholderTextColor={BaseColor.grayColor}
                    value={values.middlename}
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
                      {t('input_surname')}
                    </Text>
                  </View>
                  <TextInput
                    style={BaseStyle.textInput}
                    onChangeText={handleChange('surname')}
                    name="surname"
                    onBlur={handleBlur('surname')}
                    errors={errors.surname}
                    autoCorrect={false}
                    placeholder={t('input_surname')}
                    placeholderTextColor={BaseColor.grayColor}
                    value={values.surname}
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

export default ProfileEdit;